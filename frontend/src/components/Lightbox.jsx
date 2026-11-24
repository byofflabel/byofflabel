import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function Lightbox({ items, index, onIndex, onClose }) {
  const touchX = useRef(null);
  const count = items.length;
  const item = items[index];

  useEffect(() => {
    const go = (step) => onIndex((index + step + count) % count);
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        event.preventDefault();
        onClose();
      } else if (count > 1 && event.key === "ArrowRight") {
        event.stopPropagation();
        go(1);
      } else if (count > 1 && event.key === "ArrowLeft") {
        event.stopPropagation();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [index, count, onIndex, onClose]);

  if (!item) return null;
  const step = (event, amount) => {
    event.stopPropagation();
    onIndex((index + amount + count) % count);
  };
  const onTouchEnd = (event) => {
    if (touchX.current === null || count < 2) return;
    const delta = event.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(delta) > 50) onIndex((index + (delta < 0 ? 1 : -1) + count) % count);
  };

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Full preview"
      style={{ pointerEvents: "auto" }}
      onClick={onClose}
      onTouchStart={(event) => { touchX.current = event.touches[0].clientX; }}
      onTouchEnd={onTouchEnd}
      data-testid="lightbox"
    >
      <button type="button" className="lightbox-close" onClick={(event) => { event.stopPropagation(); onClose(); }} aria-label="Close preview" data-testid="lightbox-close">
        <X size={22} />
      </button>
      {count > 1 && (
        <button type="button" className="lightbox-nav lightbox-prev" onClick={(event) => step(event, -1)} aria-label="Previous" data-testid="lightbox-prev">
          <ChevronLeft size={26} />
        </button>
      )}
      <div className="lightbox-stage" onClick={(event) => event.stopPropagation()}>
        {item.type === "video"
          ? <video key={item.src} src={item.src} poster={item.poster} controls autoPlay playsInline />
          : <img key={item.src} src={item.src} alt={item.alt || ""} />}
      </div>
      {count > 1 && (
        <button type="button" className="lightbox-nav lightbox-next" onClick={(event) => step(event, 1)} aria-label="Next" data-testid="lightbox-next">
          <ChevronRight size={26} />
        </button>
      )}
      <div className="lightbox-caption">
        {count > 1 ? `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}` : ""}{item.caption ? ` — ${item.caption}` : ""}
      </div>
    </div>,
    document.body
  );
}
