import os
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
storage_key = None


def init_storage(force=False):
    global storage_key
    if storage_key and not force:
        return storage_key
    response = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    response.raise_for_status()
    storage_key = response.json()["storage_key"]
    return storage_key


def put_object(path, data, content_type):
    key = init_storage()
    response = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    response.raise_for_status()
    return response.json()


def get_object(path):
    key = init_storage()
    response = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=120)
    response.raise_for_status()
    return response.content, response.headers.get("Content-Type", "application/octet-stream")
