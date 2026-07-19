import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { BRAND } from './brand.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/Landing.jsx';
import CaseStudy from './pages/CaseStudy.jsx';
import Contact from './pages/Contact.jsx';

const TITLES = {
  '/': `${BRAND.name} — ${BRAND.tagline}`,
  '/case-study': `Case study: Caffe Primo Firle — ${BRAND.name}`,
  '/contact': `Talk to us — ${BRAND.name}`,
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
        <Route path="/" element={<Landing />} />
        <Route path="/case-study" element={<CaseStudy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Landing />} />
      </Routes>
      <Footer />
    </>
  );
}
