import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Logo from './Logo.jsx';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="glow glow--violet" style={{ width: 380, height: 380, bottom: -220, left: '10%', opacity: 0.28 }} />
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link to="/" className="logomark" aria-label={`${BRAND.name} home`}>
              <Logo className="logomark__mark" />
              {BRAND.name}
            </Link>
            <p className="footer__desc">
              Bespoke, commission-free venue software for independent restaurants
              and cafes. Designed and built from scratch in Adelaide.
            </p>
          </div>

          <div className="footer__col">
            <h4>Product</h4>
            <Link to="/platform">Platform</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/live">Live now</Link>
          </div>

          <div className="footer__col">
            <h4>Company</h4>
            <Link to="/contact">Plan your build</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>

          <div className="footer__col">
            <h4>Get in touch</h4>
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
