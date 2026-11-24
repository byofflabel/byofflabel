import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Cross } from "../components/Cross";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { INSTAGRAM_URL } from "../data/projects";

const FORMSPREE_URL = process.env.REACT_APP_FORMSPREE_URL || "https://formspree.io/f/xppdoerp";
const initialForm = { name: "", email: "", company: "", project_type: "", budget_range: "", message: "" };
const projectTypes = ["Campaign Videography", "Post-Production / Rapid Edit", "Full Creative Direction", "Editorial Stills", "Private Consultation"];
const budgets = ["$5,000 – $10,000", "$10,000 – $25,000", "$25,000 – $50,000", "$50,000+"];

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setCopied(false);
    setError("");
    const brief = [
      "OFF LABEL — PROJECT BRIEF",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Brand / Label: ${form.company || "Not supplied"}`,
      `Project: ${form.project_type}`,
      `Budget: ${form.budget_range || "Not supplied"}`,
      "",
      form.message,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
    } catch {}
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, _subject: `Off Label brief — ${form.name}` }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.errors?.[0]?.message || "send-failed");
      }
      setStatus("success");
      setForm(initialForm);
      window.setTimeout(() => window.location.assign(INSTAGRAM_URL), 1400);
    } catch (err) {
      setStatus("error");
      setError(err.message && err.message !== "send-failed" && err.message !== "Failed to fetch"
        ? err.message
        : "The signal did not send. Please try again or email byofflabel@gmail.com.");
    }
  };

  return (
    <motion.main className="contact-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <Seo title="Contact Off Label — Start a Project" description="Tell Off Label what you’re building. Share your campaign, videography, editing or creative direction brief and continue the conversation on Instagram." />
      <section className="contact-layout" data-testid="contact-layout">
        <div className="contact-intro">
          <span className="eyebrow">Contact / Open channel</span>
          <h1 data-testid="contact-page-title">Tell us what<br />you’re <em>building.</em></h1>
          <p>Bring the half-formed thought, the impossible reference, the thing you cannot quite articulate. We will take it from there.</p>
          <Cross className="contact-cross" />
          <div className="contact-details">
            <div><span>Instagram</span><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" data-testid="contact-instagram-link">@byofflabel <ArrowUpRight size={14} /></a></div>
            <div><span>Email</span><a href="mailto:byofflabel@gmail.com" data-testid="contact-email-link">byofflabel@gmail.com <ArrowUpRight size={14} /></a></div>
            <div><span>Location</span><p data-testid="contact-location">Mumbai, India</p></div>
            <div><span>Availability</span><p data-testid="contact-availability">Private enquiries open</p></div>
          </div>
        </div>

        <Reveal className="contact-form-wrap" delay={0.15}>
          <div className="form-heading"><span>Project dispatch</span><span>All fields marked * are required</span></div>
          <form onSubmit={submit} className="contact-form" data-testid="contact-submission-form">
            <label>Name / Alias *<input name="name" value={form.name} onChange={update} required minLength={2} maxLength={100} autoComplete="name" placeholder="Your name" data-testid="contact-name-input" /></label>
            <label>Email address *<input name="email" type="email" value={form.email} onChange={update} required autoComplete="email" placeholder="you@studio.com" data-testid="contact-email-input" /></label>
            <label>Brand / Label<input name="company" value={form.company} onChange={update} maxLength={120} autoComplete="organization" placeholder="Company or project" data-testid="contact-company-input" /></label>
            <label>Project discipline *
              <Select value={form.project_type} onValueChange={(value) => setForm({ ...form, project_type: value })} required>
                <SelectTrigger className="contact-select" data-testid="contact-project-type-select"><SelectValue placeholder="Select a discipline" /></SelectTrigger>
                <SelectContent className="contact-select-content">{projectTypes.map((type) => <SelectItem key={type} value={type} data-testid={`project-type-${type.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-")}`}>{type}</SelectItem>)}</SelectContent>
              </Select>
            </label>
            <label>Budget bracket (optional)
              <Select value={form.budget_range} onValueChange={(value) => setForm({ ...form, budget_range: value })}>
                <SelectTrigger className="contact-select" data-testid="contact-budget-select"><SelectValue placeholder="Prefer not to say" /></SelectTrigger>
                <SelectContent className="contact-select-content">{budgets.map((budget) => <SelectItem key={budget} value={budget}>{budget}</SelectItem>)}</SelectContent>
              </Select>
            </label>
            <label className="form-message">Brief / Synopsis *<textarea name="message" value={form.message} onChange={update} required minLength={10} maxLength={3000} rows={5} placeholder="What are we making, and why should it matter?" data-testid="contact-message-input" /></label>
            {status === "error" && <p className="form-status form-error" role="alert" data-testid="contact-form-error">{error}</p>}
            {status === "success" && <div className="form-status form-success" role="status" data-testid="contact-form-success-banner"><span>{copied ? "Brief sent and copied. Opening Instagram…" : "Brief sent. Opening Instagram…"}</span><a href={INSTAGRAM_URL} data-testid="contact-success-instagram-link">Continue now ↗</a></div>}
            <button type="submit" className="submit-button" disabled={status === "sending" || status === "success"} data-testid="contact-form-submit-button">
              <span>{status === "sending" ? "Sending signal" : status === "success" ? "Signal received" : "Send the brief"}</span><ArrowUpRight size={20} />
            </button>
            <p className="form-note">Your brief is sent privately and copied when your browser allows it. After the Instagram redirect, open a DM and paste your brief.</p>
          </form>
        </Reveal>
      </section>
    </motion.main>
  );
}
