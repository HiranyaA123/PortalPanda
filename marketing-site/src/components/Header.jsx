import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Logo from './Logo.jsx';
import { IconMenu, IconClose } from './icons.jsx';

// `end` on "/" so it only highlights on the home route — without it every path
// starts with "/" and Home would render as active everywhere.
const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/platform', label: 'Platform' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/live', label: 'Our work' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const burgerRef = useRef(null);
  const menuRef = useRef(null);
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        burgerRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = menuRef.current?.querySelectorAll('a, button:not([disabled])');
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.classList.add('menu-open');
    window.addEventListener('keydown', onKeyDown);
    window.requestAnimationFrame(() => menuRef.current?.querySelector('a')?.focus());
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <Link to="/" className="logomark" aria-label={`${BRAND.name} home`}>
          <Logo className="logomark__brand" />
        </Link>

        <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Primary">
          <ul className="nav__links" id="primary-navigation" ref={menuRef}>
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) => (isActive ? 'is-active' : '')}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/contact" className="btn btn-primary nav__cta-mobile">
                Start a project
              </Link>
            </li>
          </ul>

          <div className="nav__right">
            <Link to="/contact" className="btn btn-primary nav__cta-desktop">
              Start a project
            </Link>
            <button
              ref={burgerRef}
              type="button"
              className="nav__burger"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="primary-navigation"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <IconClose /> : <IconMenu />}
            </button>
          </div>

          {open && (
            <button
              type="button"
              className="nav__backdrop"
              aria-label="Close navigation menu"
              tabIndex={-1}
              onClick={() => setOpen(false)}
            />
          )}
        </nav>
      </div>
    </header>
  );
}
