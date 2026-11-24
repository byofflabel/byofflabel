import asyncio
import logging
import os
import re
import secrets
import uuid
from contextlib import suppress
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated, Literal, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, File, HTTPException, Request, Response, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from pymongo import ASCENDING, DESCENDING, IndexModel
from starlette.middleware.cors import CORSMiddleware

from storage import get_object, init_storage, put_object

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

INDEXES = {
    "contact_inquiries": [
        IndexModel([("id", ASCENDING)], name="id", unique=True),
        IndexModel([("created_at", DESCENDING)], name="created_at_desc"),
    ],
    "media_files": [
        IndexModel([("id", ASCENDING)], name="id", unique=True),
        IndexModel([("created_at", DESCENDING)], name="created_at_desc"),
    ],
}

MAX_MEDIA_BYTES = 200 * 1024 * 1024
MEDIA_TYPES = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
}
media_bearer = HTTPBearer(auto_error=False)


async def ensure_indexes():
    for collection, models in INDEXES.items():
        for model in models:
            try:
                await db[collection].create_indexes([model])
            except Exception as exc:
                logging.getLogger(__name__).error("ensure_indexes(%s): %s", collection, exc)


async def prepare_storage():
    try:
        await asyncio.to_thread(init_storage)
        logging.getLogger(__name__).info("Media storage initialized")
    except Exception as exc:
        logging.getLogger(__name__).error("Media storage initialization failed: %s", exc)


def require_media_token(credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(media_bearer)]):
    expected = os.environ.get("MEDIA_UPLOAD_TOKEN", "")
    supplied = credentials.credentials if credentials else ""
    if not expected or not credentials or credentials.scheme.lower() != "bearer" or not secrets.compare_digest(supplied, expected):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")


class ContactInquiryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    company: Optional[str] = Field(default=None, max_length=120)
    project_type: Literal[
        "Campaign Videography",
        "Post-Production / Rapid Edit",
        "Full Creative Direction",
        "Editorial Stills",
        "Private Consultation",
    ]
    budget_range: Optional[str] = Field(default=None, max_length=50)
    message: str = Field(min_length=10, max_length=3000)


class ContactInquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: Optional[str] = None
    project_type: str
    budget_range: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def to_mongo(self):
        doc = self.model_dump(mode="json")
        doc["created_at"] = self.created_at.isoformat()
        return doc


class MediaDocument(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    storage_path: str
    original_filename: str
    content_type: str
    size: int
    is_deleted: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @classmethod
    def from_mongo(cls, doc):
        values = dict(doc)
        values.pop("_id", None)
        return cls(**values)

    def to_mongo(self):
        doc = self.model_dump(mode="json")
        doc["created_at"] = self.created_at.isoformat()
        return doc

    def to_public(self):
        return {
            "id": self.id,
            "filename": self.original_filename,
            "content_type": self.content_type,
            "size": self.size,
            "created_at": self.created_at.isoformat(),
            "url": f"/api/media/{self.id}",
        }


app = FastAPI(title="Off Label API")
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"message": "Off Label API", "status": "online"}


@api_router.get("/health")
async def health():
    return {"status": "healthy"}


@api_router.post("/contact", status_code=201)
async def create_contact_inquiry(input: ContactInquiryCreate):
    inquiry = ContactInquiry(**input.model_dump())
    await db.contact_inquiries.insert_one(inquiry.to_mongo())
    return {"id": inquiry.id, "status": "saved", "instagram_url": "https://www.instagram.com/byofflabel/"}


@api_router.post("/media", status_code=201, dependencies=[Depends(require_media_token)])
async def upload_media(file: Annotated[UploadFile, File()]):
    if file.content_type not in MEDIA_TYPES:
        raise HTTPException(status_code=415, detail="Supported files: JPEG, PNG, WebP, GIF, MP4, WebM and MOV")
    data = await file.read(MAX_MEDIA_BYTES + 1)
    if len(data) > MAX_MEDIA_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds the 200 MB limit")
    filename = (file.filename or "upload").replace("/", "_").replace("\\", "_")[:200]
    path = f"offlabel/uploads/portfolio/{uuid.uuid4()}.{MEDIA_TYPES[file.content_type]}"
    result = await asyncio.to_thread(put_object, path, data, file.content_type)
    media = MediaDocument(
        storage_path=result["path"],
        original_filename=filename,
        content_type=file.content_type,
        size=result["size"],
    )
    await db.media_files.insert_one(media.to_mongo())
    return media.to_public()


@api_router.get("/media")
async def list_media():
    docs = await db.media_files.find({"is_deleted": False}, {"_id": 0}).sort("created_at", -1).limit(1000).to_list(1000)
    return [MediaDocument.from_mongo(doc).to_public() for doc in docs]


@api_router.get("/media/{media_id}")
async def read_media(media_id: str, request: Request):
    doc = await db.media_files.find_one({"id": media_id, "is_deleted": False})
    if not doc:
        raise HTTPException(status_code=404, detail="Media not found")
    media = MediaDocument.from_mongo(doc)
    data, stored_type = await asyncio.to_thread(get_object, media.storage_path)
    total = len(data)
    headers = {
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": str(total),
    }
    range_header = request.headers.get("range", "")
    match = re.fullmatch(r"bytes=(\d+)-(\d*)", range_header)
    if match:
        start = int(match.group(1))
        end = min(int(match.group(2)) if match.group(2) else total - 1, total - 1)
        if start >= total or end < start:
            raise HTTPException(status_code=416, detail="Invalid range", headers={"Content-Range": f"bytes */{total}"})
        headers.update({"Content-Range": f"bytes {start}-{end}/{total}", "Content-Length": str(end - start + 1)})
        return Response(content=data[start:end + 1], status_code=206, media_type=media.content_type or stored_type, headers=headers)
    return Response(content=data, media_type=media.content_type or stored_type, headers=headers)


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)


@app.on_event("startup")
async def start_background_services():
    app.state.index_task = asyncio.create_task(ensure_indexes())
    app.state.storage_task = asyncio.create_task(prepare_storage())


@app.on_event("shutdown")
async def shutdown_db_client():
    for task_name in ("index_task", "storage_task"):
        task = getattr(app.state, task_name, None)
        if task:
            task.cancel()
            with suppress(asyncio.CancelledError):
                await task
    client.close()
