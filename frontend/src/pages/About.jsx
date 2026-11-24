import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cross } from "../components/Cross";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";

const services = [
  { number: "01", title: "Creative direction", text: "Visual worlds, campaign treatments and brand narratives with a point of view sharp enough to leave a mark." },
  { number: "02", title: "Videography", text: "Atmospheric films, deliberate lighting and intimate set direction. Every frame earns its place." },
  { number: "03", title: "Editing", text: "Pacing, sound, grade and restraint. We find the pulse, remove the noise and cut until nothing else can be taken away." },
  { number: "04", title: "Marketing", text: "Private campaign thinking and launch narratives built to travel without sanding off what makes you unmistakable." },
];

const founders = [
  { name: "Mirza", role: "Video production", instagram: "https://www.instagram.com/kon.mirza/", handle: "@kon.mirza", id: "mirza" },
  { name: "Almora Rapsang", role: "Marketing", instagram: "https://www.instagram.com/5le3py/", handle: "@5le3py", id: "almora" },
];

const duties = [
  {
    id: "nadeem",
    name: "Nadeem Mirza",
    role: "Video Production",
    intro: "The one behind the lens and the timeline. Nadeem carries a project from first idea to final export.",
    items: [
      ["Planning", "breaks down each project into shot lists, schedules, locations, and logistics before we roll."],
      ["Creative direction", "sets the visual language, mood, and references so every frame feels like one world."],
      ["Videography and cinematography", "runs the camera, lighting, framing, and movement on set."],
      ["Editing", "handles pacing, sound, color grade, and the final cut."],
    ],
  },
  {
    id: "almora",
    name: "Almora Rapsang",
    role: "Marketing",
    intro: "The one who builds the narrative and holds the relationships. Almora shapes how our work reaches people and keeps every client in the loop.",
    items: [
      ["Marketing", "develops campaign strategy, launch narratives, and positioning for each client."],
      ["Creative planning", "shapes concepts, content calendars, and rollout plans alongside Nadeem."],
      ["Management", "oversees timelines, deliverables, and the overall flow of each project."],
      ["Client relations", "first point of contact for new inquiries, handles outreach, briefs, feedback, and ongoing communication."],
    ],
  },
];

const workflow = [
  { number: "01", title: "Brief", text: "We listen, question and define the real objective.", id: "brief" },
  { number: "02", title: "Plan", text: "We build the references, schedule and creative route.", id: "plan" },
  { number: "03", title: "Shoot and Edit", text: "Nadeem directs production and shapes the final cut.", id: "shoot-edit" },
  { number: "04", title: "Deliver", text: "Almora coordinates feedback, files and the release.", id: "deliver" },
];

export default function About() {
  const [openDuties, setOpenDuties] = useState([]);
  const toggleDuty = (id) => setOpenDuties((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <motion.main className="about-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <Seo title="About Off Label — Direction, Film & Editing" description="Off Label is a marketing and videography agency shaping creative direction, atmospheric films, precise edits and campaign narratives." />
      <section className="about-hero" data-testid="about-hero">
        <span className="eyebrow">About / The private practice</span>
        <h1 data-testid="about-page-title">Nothing ordinary<br /><em>leaves the room.</em></h1>
        <div className="about-intro">
          <Cross />
          <p>Off Label is a marketing and videography craft for people building their own visual language. We direct, film, edit and shape campaigns with atmosphere first.</p>
          <p>Our philosophy is simple: taste over volume, tension over decoration, and no work that could belong to anyone else.</p>
        </div>
      </section>

      <section className="services-section" data-testid="services-section">
        <Reveal className="section-heading-row">
          <div><span className="eyebrow">Capabilities / 04</span><h2>What we do</h2></div>
          <p>From the first reference to the final cut.</p>
        </Reveal>
        <div className="services-list">
          {services.map((service, index) => (
            <Reveal key={service.number} delay={index * 0.06} className="service-item">
              <span>{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><Cross />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="founders-section" data-testid="founders-section">
        <Reveal className="section-heading-row">
          <div><span className="eyebrow">The founders / 02</span><h2>Behind the label</h2></div>
          <p>Two disciplines. One visual language.</p>
        </Reveal>
        <div className="founders-grid">
          {founders.map((founder, index) => (
            <Reveal key={founder.id} delay={index * 0.1} className="founder-item">
              <span className="founder-number">0{index + 1} / Founder</span>
              <h3>{founder.name}</h3>
              <p>{founder.role}</p>
              <a href={founder.instagram} target="_blank" rel="noreferrer" data-testid={`founder-instagram-${founder.id}`}>{founder.handle} ↗</a>
              <Cross />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="operate-section" data-testid="how-we-operate-section">
        <Reveal className="section-heading-row">
          <div><span className="eyebrow">Founder duties / 02</span><h2>How We Operate</h2></div>
          <p>Expand each role to see how the work moves.</p>
        </Reveal>
        <div className="operate-grid">
          {duties.map((founder, index) => {
            const isOpen = openDuties.includes(founder.id);
            return (
              <Reveal key={founder.id} delay={index * 0.1} className={`duty-card ${isOpen ? "open" : ""}`}>
                <button type="button" className="duty-toggle" onClick={() => toggleDuty(founder.id)} aria-expanded={isOpen} aria-controls={`duty-panel-${founder.id}`} data-testid={`operate-toggle-${founder.id}`}>
                  <span className="founder-number">0{index + 1} / {founder.role}</span>
                  <h3>{founder.name}</h3>
                  <Cross />
                </button>
                <p className="duty-intro">{founder.intro}</p>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div id={`duty-panel-${founder.id}`} className="duty-panel" data-testid={`operate-panel-${founder.id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                      <ul>
                        {founder.items.map(([label, text]) => <li key={label}><strong>{label}</strong><span>{text}</span></li>)}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="workflow-row">
          {workflow.map((step) => (
            <div className="workflow-step" key={step.id} data-testid={`workflow-step-${step.id}`}>
              <span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p>
            </div>
          ))}
        </Reveal>
      </section>
    </motion.main>
  );
}
