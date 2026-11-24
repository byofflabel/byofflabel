import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { INSTAGRAM_URL, LOGO_URL } from "../data/projects";

const links = [
  { label: "Works", to: "/", id: "works" },
  { label: "About", to: "/about", id: "about" },
  { label: "Contact", to: "/contact", id: "contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header" data-testid="site-header">
      <div className="header-topline">
        <span className="header-note">Mumbai / India</span>
        <Link to="/" className="brand-link" aria-label="Off Label — Works" data-testid="header-brand-link">
          <img src={LOGO_URL} alt="Off Label chrome cross logo" className="brand-logo" data-testid="header-brand-logo-image" />
        </Link>
        <a className="header-note header-social" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" data-testid="nav-instagram-link">@byofflabel</a>
        <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} data-testid="mobile-menu-toggle">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <nav className="desktop-nav" aria-label="Primary navigation" data-testid="desktop-navigation">
        {links.map((link) => (
          <NavLink key={link.id} to={link.to} end={link.to === "/"} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} data-testid={`nav-link-${link.id}`}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile navigation"
            data-testid="mobile-navigation"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <span className="eyebrow">Index / 03</span>
            {links.map((link, index) => (
              <NavLink key={link.id} to={link.to} end={link.to === "/"} onClick={() => setOpen(false)} className="mobile-nav-link" data-testid={`mobile-nav-link-${link.id}`}>
                <span>0{index + 1}</span>{link.label}
              </NavLink>
            ))}
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="mobile-instagram" data-testid="mobile-instagram-link">Instagram ↗</a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
