// Server entry used only at build time by scripts/prerender.mjs. It is never
// shipped to the browser.
//
// The components are SSR-safe as written: everything that touches window does
// so inside useEffect (which does not run on the server), and the two render
// -time helpers in motion.jsx - finePointer() and reduced() - already guard on
// `typeof window !== 'undefined'`.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';

export function render(pathname) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={pathname}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}

export { SEO, getSeoData } from './seo.js';
