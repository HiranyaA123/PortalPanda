import { Link } from 'react-router-dom';
import { IconArrowRight } from '../components/icons.jsx';

export default function NotFound() {
  return (
    <main id="main">
      <section className="section not-found">
        <div className="container container--narrow center">
          <span className="eyebrow">404</span>
          <h1>That page isn’t connected.</h1>
          <p>Head back to the CentralPass home page or explore the platform.</p>
          <div className="hero__actions">
            <Link to="/" className="btn btn-primary btn-lg">Back home <IconArrowRight /></Link>
            <Link to="/platform" className="btn btn-ghost btn-lg">Explore the platform</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
