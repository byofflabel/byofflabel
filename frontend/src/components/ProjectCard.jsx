import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";

export function ProjectCard({ project, index, onSelect }) {
  const videoRef = useRef(null);

  const startPreview = () => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  };
  const stopPreview = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <motion.article
      className={`project-card project-card-${(index % 6) + 1}`}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.55, delay: index * 0.04 }}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      data-testid={`project-card-${project.id}`}
    >
      <button type="button" className="project-card-button" onClick={() => onSelect(project)} aria-label={`Open ${project.title} project`} data-testid={`project-open-${project.id}`}>
        <div className="project-image-wrap">
          {project.image && <img src={project.image} alt={`${project.title} — ${project.client}`} loading="lazy" decoding="async" />}
          {project.videoUrl && (
            <video ref={videoRef} src={project.videoUrl} className={!project.image ? "video-cover" : ""} muted loop playsInline preload="metadata" poster={project.image || undefined} aria-label={!project.image ? `${project.title} video cover` : undefined} aria-hidden={project.image ? "true" : undefined} />
          )}
          <span className="project-index">0{index + 1}</span>
          <span className="project-open-icon">{project.videoUrl ? <Play size={17} fill="currentColor" /> : <ArrowUpRight size={19} />}</span>
          <span className="project-tap-label">{project.videoUrl ? "Tap for full film" : "View study"}</span>
        </div>
        <div className="project-card-meta">
          <h2>{project.title}</h2>
          <span>{project.year}</span>
          <p>{project.client}</p>
          <span className="project-category">{project.category}</span>
        </div>
      </button>
    </motion.article>
  );
}
