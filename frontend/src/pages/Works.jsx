import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Cross } from "../components/Cross";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectModal } from "../components/ProjectModal";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { projects, SITE_YEAR } from "../data/projects";

const filters = ["all", ...new Set(projects.map((project) => project.category))];

export default function Works() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const heroRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 110]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 3]);
  const visible = filter === "all" ? projects : projects.filter((project) => project.category === filter);

  return (
    <motion.main className="works-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <Seo title="Off Label — Selected Films, Edits & Campaigns" description="Explore Off Label’s selected videography, surgical edits, campaign direction and editorial stills. Private visual work with nothing ordinary attached." />
      <section className="works-hero" ref={heroRef} data-testid="works-hero">
        <motion.div className="hero-reference" style={{ y: imageY, rotate: imageRotate }} initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 1.4, delay: 0.35, ease: [0.76, 0, 0.24, 1] }}>
          <img className="hero-work-image" src="/media/dadar/DSC00246.webp" alt="Dadar in Bloom — red knitwear among flower garlands" fetchPriority="high" />
          <img className="hero-work-image" src="/media/vol01/DSC01233.webp" alt="OFFLABEL VOL.01 — leather portrait in evening light" fetchPriority="high" />
          <span>Original work / {SITE_YEAR}</span>
        </motion.div>
        <div className="hero-kicker"><span>Selected works</span><span>{SITE_YEAR}</span></div>
        <h1 className="works-title hero-title-new" data-testid="works-page-title">
          <span className="title-mask"><motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>Beyond the label.</motion.span></span>
          <span className="title-mask title-bottom"><motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}>Beyond the ordinary.</motion.span></span>
        </h1>
        <motion.p className="hero-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
          Marketing, directed films and surgical edits for labels that would rather be felt than explained.
        </motion.p>
        <div className="hero-scroll-cue"><span /> Scroll to enter</div>
      </section>

      <div className="editorial-marquee" aria-label="Off Label disciplines" data-testid="editorial-marquee">
        <div>Off Label <Cross /> Marketing <Cross /> Direction <Cross /> Pacing <Cross /> Heavy grading <Cross /> Off Label <Cross /> Marketing <Cross /> Direction <Cross /> Pacing <Cross /> Heavy grading <Cross /></div>
      </div>

      <section className="works-index" data-testid="works-index">
        <Reveal className="section-heading-row">
          <div><span className="eyebrow">Archive / Original series</span><h2>The work</h2></div>
          <p>Original photo series from the Off Label archive.</p>
        </Reveal>
        <div className="filter-bar" role="group" aria-label="Filter projects" data-testid="project-filters">
          {filters.map((item) => (
            <button key={item} type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)} aria-pressed={filter === item} data-testid={`filter-btn-${item}`}>
              {item === "all" ? "All work" : item}<sup>{item === "all" ? projects.length : projects.filter((p) => p.category === item).length}</sup>
            </button>
          ))}
        </div>
        <motion.div layout className="project-grid" data-testid="project-grid">
          <AnimatePresence mode="popLayout">
            {visible.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onSelect={setSelected} />)}
          </AnimatePresence>
        </motion.div>
      </section>
      <ProjectModal project={selected} open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} />
    </motion.main>
  );
}
