import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Logo from './Logo.jsx';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link to="/" className="logomark" aria-label={`${BRAND.name} home`}>
              <Logo variant="lockup" className="footer__brand-lockup" />
            </Link>
            <p className="footer__desc">
              Custom customer and operations software for independent restaurants
              and cafes. Designed, built and supported in Adelaide.
            </p>
          </div>

          <div className="footer__col">
            <h3>Product</h3>
            <Link to="/platform">Platform</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/live">Our work</Link>
          </div>

          <div className="footer__col">
            <h3>Company</h3>
            <Link to="/contact">Start a project</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>

          <div className="footer__col">
            <h3>Get in touch</h3>
            <a href={`tel:${BRAND.contactPhone}`}>{BRAND.contactPhoneDisplay}</a>
            <a className="footer__email" href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>
            <p>{BRAND.location}</p>
          </div>
        </div>

        <div className="footer__fine">
          <span>© {year} {BRAND.name}. All rights reserved.</span>
          <span>{BRAND.location}</span>
        </div>
      </div>
    </footer>
  );
}
