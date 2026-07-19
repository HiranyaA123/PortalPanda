import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BRAND } from '../brand.js';
import { IconMenu, IconClose } from './icons.jsx';

const ANCHORS = [
  { id: 'product', label: 'Product' },
  { id: 'features', label: 'Features' },
  { id: 'case-study', label: 'Case study' },
  { id: 'how-it-works', label: 'How it works' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const goToAnchor = (event, id) => {
    setOpen(false);
    if (isHome) {
      // Let the browser handle the in-page smooth scroll via href="#id".
      return;
    }
    event.preventDefault();
    navigate('/');
    // Wait for the landing page to mount, then scroll to the section.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  };

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="logomark" aria-label={`${BRAND.name} home`}>
          <span className="logomark__badge" aria-hidden="true">
            {BRAND.name.charAt(0)}
          </span>
          {BRAND.name}
        </Link>

        <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Primary">
          <ul className="nav__links">
            {ANCHORS.map((a) => (
              <li key={a.id}>
                <a
                  href={`${isHome ? '' : '/'}#${a.id}`}
                  onClick={(e) => goToAnchor(e, a.id)}
                >
                  {a.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/contact" className="btn btn-primary nav__cta-mobile">
                Talk to us
              </Link>
            </li>
          </ul>

          <Link to="/contact" className="btn btn-primary nav__cta-desktop">
            Talk to us
          </Link>

          <button
            type="button"
            className="nav__burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </nav>
      </div>
    </header>
  );
}
