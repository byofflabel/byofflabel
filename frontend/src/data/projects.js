export const LOGO_URL = "/media/brand/logo.jpg";
export const INSTAGRAM_URL = "https://www.instagram.com/byofflabel/";
export const SITE_YEAR = "2027";
export const storedMediaUrl = (id) => `${process.env.REACT_APP_BACKEND_URL}/api/media/${id}`;

// Add or edit projects here. videoUrl accepts MP4, YouTube and Vimeo URLs.
// For uploaded media, use storedMediaUrl("media-id") as image or videoUrl.
export const projects = [
  {
    id: "offlabel-vol-01",
    title: "OFFLABEL / VOL.01",
    client: "Off Label",
    year: "2026",
    category: "stills",
    image: "/media/vol01/DSC01233.webp",
    gallery: [
      "/media/vol01/DSC01233.webp",
      "/media/vol01/DSC01234.webp",
      "/media/vol01/DSC01236.webp",
      "/media/vol01/DSC01349.webp",
      "/media/vol01/DSC01416.webp",
      "/media/vol01/DSC01503.webp",
      "/media/vol01/DSC01494.webp",
    ],
    description: "Nocturnal portraits in leather and silver, framed by hard light and the last glow of the day. The first Off Label editorial series.",
    model: { name: "@5le3py", url: "https://www.instagram.com/5le3py/" },
    credits: ["Project — OFFLABEL / VOL.01", "Format — Editorial photo series"],
  },
  {
    id: "dadar-in-bloom",
    title: "DADAR IN BLOOM",
    client: "Off Label",
    year: "2026",
    category: "stills",
    image: "/media/dadar/DSC00246.webp",
    gallery: [
      "/media/dadar/DSC00246.webp",
      "/media/dadar/DSC00156.webp",
      "/media/dadar/DSC00112.webp",
      "/media/dadar/DSC00113.webp",
      "/media/dadar/DSC00432.webp",
      "/media/dadar/DSC00087.webp",
      "/media/dadar/DSC00157.webp",
    ],
    model: { name: "@aahaan.ahuja", url: "https://www.instagram.com/aahaan.ahuja/" },
    description: "An old Bombay vintage editorial set inside Dadar’s flower market—red knitwear, marigold garlands, hard sunlight and the theatre of everyday trade.",
    credits: ["Project — DADAR IN BLOOM", "Location — Dadar flower market", "Format — Editorial photo series"],
  },
  {
    id: "unbounded",
    title: "UNBOUNDED",
    client: "M Vault Fashion World",
    year: "2026",
    category: "video",
    image: null,
    videoUrl: "/media/video/unbounded.mp4",
    sourceUrl: "https://www.instagram.com/reel/DZiHasYMqI2/",
    description: "A fashion film built around movement, silhouette and the energy of the frame.",
    credits: [
      "Shot on — @sony",
      "Model — @mannnnjoshi",
      "Director & Photographer — @sobekk._",
      "Credit — @yxshsalvii",
      "Cinematographer & Editor — @kon.mirza",
      "Designer & Stylist — @sudikshaaa.16",
      "Creative Agency — @mvaultfashionworld",
    ],
  },
  {
    id: "triumph-spec-ad",
    title: "TRIUMPH SPEC AD",
    client: "Triumph / Spec Ad",
    year: "2026",
    category: "video",
    image: null,
    videoUrl: "/media/video/triumph-spec-ad.mp4",
    sourceUrl: "https://www.instagram.com/reel/DWF42-zDC5k/",
    description: "A speculative motorcycle film engineered around speed, machine detail and the tension between rider and road.",
    credits: [
      "Rider — @_.yashveer._",
      "DOP — @i_am_ronniie / @kon.mirza",
      "Editor — @kon.mirza",
      "Creative Direction — @sobekk._",
    ],
  },
];
