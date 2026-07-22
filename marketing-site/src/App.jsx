import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Cursor from './components/Cursor.jsx';
import Home from './pages/Home.jsx';
import Platform from './pages/Platform.jsx';
import Pricing from './pages/Pricing.jsx';
import Live from './pages/Live.jsx';
import Contact from './pages/Contact.jsx';
import Legal from './pages/Legal.jsx';
import NotFound from './pages/NotFound.jsx';
import { applySeo } from './seo.js';

export default function App() {
  const location = useLocation();

  // Keep search and social metadata in sync with the current route.
  useEffect(() => {
    applySeo(location.pathname);
  }, [location.pathname]);

  // Scroll to top on route change — but leave in-page anchor jumps alone.
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Cursor />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/live" element={<Live />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Legal type="privacy" />} />
        <Route path="/terms" element={<Legal type="terms" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
