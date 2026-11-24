import { Link } from "react-router-dom";
import { INSTAGRAM_URL, SITE_YEAR } from "../data/projects";
import { Cross } from "./Cross";

export function Footer() {
  return (
    <footer className="site-footer" data-testid="site-footer">
      <Cross className="footer-cross" />
      <div className="footer-main">
        <p className="footer-statement">Make it impossible<br /><em>to ignore.</em></p>
        <div className="footer-links">
          <Link to="/about" data-testid="footer-about-link">About</Link>
          <Link to="/contact" data-testid="footer-contact-link">Contact</Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" data-testid="footer-instagram-link">Instagram ↗</a>
        </div>
      </div>
      <div className="footer-base">
        <span>© {SITE_YEAR} Off Label</span>
        <span>Marketing &amp; Video Production</span>
        <span>All signals, no noise</span>
      </div>
    </footer>
  );
}
