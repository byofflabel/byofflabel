import { useEffect, useRef, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { Cross } from "./Cross";
import { Lightbox } from "./Lightbox";

function getEmbedUrl(url) {
  if (!url) return null;
  const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}?rel=0`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export function ProjectModal({ project, open, onOpenChange }) {
  const [lightbox, setLightbox] = useState(null);
  const playerRef = useRef(null);
  useEffect(() => { setLightbox(null); }, [project?.id, open]);
  if (!project) return null;
  const embedUrl = getEmbedUrl(project.videoUrl);
  const hasGallery = project.gallery?.length > 0;
  const lightboxItems = hasGallery
    ? project.gallery.map((src, index) => ({ type: "image", src, alt: `${project.title} — frame ${index + 1}`, caption: project.title }))
    : [{ type: "video", src: project.videoUrl, poster: project.image || undefined, caption: project.title }];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="project-modal" data-testid="project-detail-modal" data-lenis-prevent>
        <DialogClose className="project-modal-close" aria-label="Close project" data-testid="project-modal-close-button">
          <Cross />
        </DialogClose>
        <div className="project-modal-inner">
          <div className="project-modal-heading">
            <span className="eyebrow">{project.category} / {project.year}</span>
            <DialogTitle>{project.title}</DialogTitle>
            <DialogDescription>{project.client}</DialogDescription>
          </div>
          {hasGallery ? (
            <div className="project-gallery-wrap project-gallery-all" data-testid="project-gallery">
              <div className="project-gallery-heading">
                <span className="eyebrow">{project.gallery.length} photographs / Complete series</span>
                <p>Scroll to view all frames</p>
              </div>
              <div className="project-gallery">
                {project.gallery.map((image, index) => (
                  <figure key={image} data-testid={`project-gallery-frame-${index + 1}`}>
                    <button type="button" className="gallery-zoom" onClick={() => setLightbox(index)} aria-label={`Open frame ${index + 1} full screen`} data-testid={`project-gallery-open-${index + 1}`}>
                      <img src={image} alt={`${project.title} — frame ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
                    </button>
                    <figcaption>{project.title} / {String(index + 1).padStart(2, "0")}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ) : (
            <div className="project-player" data-testid="project-media-player">
              {embedUrl ? (
                <iframe src={embedUrl} title={`${project.title} video`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
              ) : project.videoUrl ? (
                <>
                  <video ref={playerRef} src={project.videoUrl} poster={project.image} controls playsInline preload="metadata" />
                  <button type="button" className="project-expand" onClick={() => { playerRef.current?.pause(); setLightbox(0); }} data-testid="project-expand-video">Full screen ⤢</button>
                </>
              ) : (
                <img src={project.image} alt={`${project.title} project still`} />
              )}
            </div>
          )}
          {project.sourceUrl && <a className="project-source-link" href={project.sourceUrl} target="_blank" rel="noreferrer" data-testid="project-source-link">View original reel on Instagram ↗</a>}
          <div className="project-modal-details">
            <p className="project-description">{project.description}</p>
            <div className="project-credits">
              <span className="eyebrow">Credits / Notes</span>
              {project.credits.map((credit) => <p key={credit}>{credit}</p>)}
              {project.model && <a href={project.model.url} target="_blank" rel="noreferrer" data-testid="project-model-credit">Model — {project.model.name} ↗</a>}
            </div>
          </div>
        </div>
        {lightbox !== null && <Lightbox items={lightboxItems} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />}
      </DialogContent>
    </Dialog>
  );
}
