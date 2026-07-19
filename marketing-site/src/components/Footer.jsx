import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import { IconMail, IconPhone } from './icons.jsx';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link to="/" className="logomark" aria-label={`${BRAND.name} home`}>
              <span className="logomark__badge" aria-hidden="true">
                {BRAND.name.charAt(0)}
              </span>
              {BRAND.name}
            </Link>
            <p className="footer__desc">
              Commission-free online ordering, custom-designed for your
              restaurant or caffe.
            </p>
          </div>

          <div className="footer__col">
            <h4>Get in touch</h4>
            <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>
            <a href={`tel:${BRAND.contactPhone}`}>{BRAND.contactPhoneDisplay}</a>
            <p>{BRAND.location}</p>
          </div>

          <div className="footer__col">
            <h4>More</h4>
            <Link to="/case-study">Case study</Link>
            <Link to="/contact">Talk to us</Link>
          </div>
        </div>

        <div className="footer__fine">
          © {year} {BRAND.name}
        </div>
      </div>
    </footer>
  );
}
