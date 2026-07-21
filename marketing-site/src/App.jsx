import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { BRAND } from './brand.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Platform from './pages/Platform.jsx';
import Pricing from './pages/Pricing.jsx';
import Live from './pages/Live.jsx';
import Contact from './pages/Contact.jsx';

const TITLES = {
  '/': `${BRAND.name} — ${BRAND.tagline}`,
  '/platform': `Platform — ${BRAND.name}`,
  '/pricing': `Pricing — ${BRAND.name}`,
  '/live': `Live now: Caffe Primo Firle — ${BRAND.name}`,
  '/contact': `Book a demo — ${BRAND.name}`,
};

export default function App() {
  const location = useLocation();

  // Keep the document title in sync with the route and the brand config.
  useEffect(() => {
    document.title = TITLES[location.pathname] || `${BRAND.name} — ${BRAND.tagline}`;
  }, [location.pathname]);

  // Scroll to top on route change — but leave in-page anchor jumps alone.
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/live" element={<Live />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}
