import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { SmoothScroll } from "./components/SmoothScroll";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Works from "./pages/Works";

function SiteRoutes() {
  const location = useLocation();
  return (
    <div className="site-shell">
      <SmoothScroll />
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Works />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <SiteRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
}
