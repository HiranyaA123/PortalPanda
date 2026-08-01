import { useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight, IconSparkle } from './icons.jsx';

// Interactive module explorer: a vertical list of modules; picking one swaps the
// panel (copy + a coded mockup).
//
// Auto-advance was removed deliberately. It changed the panel every 4.2s while
// people were still reading, shifted the page height by ~226px at mobile
// widths, could not be paused by keyboard users, and could not be paused at all
// on touch (no hover). Content now only changes when the visitor asks it to.
//
// Implements the WAI-ARIA tab pattern properly: tabs own their panel via
// aria-controls, roving tabIndex keeps one stop in the tab order, and
// arrow/Home/End keys move between tabs.
export default function ModuleExplorer({ modules, capabilityExamples = [] }) {
  const [active, setActive] = useState(0);
  const baseId = useId().replace(/:/g, '');
  const tabRefs = useRef([]);

  const tabId = (i) => `${baseId}-tab-${i}`;
  const panelId = (i) => `${baseId}-panel-${i}`;

  const focusTab = (i) => {
    const next = (i + modules.length) % modules.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event) => {
    const keys = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: modules.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    focusTab(keys[event.key]);
  };

  const m = modules[active];
  const Mock = m.Mock;

  return (
    <div className="explorer">
      <div className="explorer__rail">
        <div
          className="explorer__tabs"
          role="tablist"
          aria-label="Platform modules"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
        >
          {modules.map((mod, i) => {
            const Icon = mod.Icon;
            const selected = i === active;
            return (
              <button
                key={mod.id}
                type="button"
                role="tab"
                aria-label={mod.name}
                id={tabId(i)}
                aria-selected={selected}
                aria-controls={panelId(i)}
                tabIndex={selected ? 0 : -1}
                ref={(el) => { tabRefs.current[i] = el; }}
                className={`explorer__tab ${selected ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="explorer__tab-icon"><Icon /></span>
                <span className="explorer__tab-name">{mod.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="explorer__panel"
        role="tabpanel"
        id={panelId(active)}
        aria-labelledby={tabId(active)}
        tabIndex={0}
      >
        <div className="explorer__copy">
          <span className="eyebrow">{m.eyebrow}</span>
          <h3>{m.heading}</h3>
          <p>{m.body}</p>
          <ul className="feature-list">
            {m.features.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
        <div className="explorer__media">
          <Mock />
        </div>
      </div>

      <aside className="explorer__capability" aria-labelledby={`${baseId}-capability-title`}>
        <span className="explorer__capability-icon" aria-hidden="true"><IconSparkle /></span>
        <div className="explorer__capability-copy">
          <span className="explorer__capability-label">Your build is not limited to this list</span>
          <h3 id={`${baseId}-capability-title`}>Need something else? We can build it.</h3>
          <p>Tell us the outcome you need. We will design and scope the capability around how your venue actually works.</p>
        </div>
        <ul className="explorer__capability-examples" aria-label="Example custom capabilities">
          {capabilityExamples.map(([title]) => <li key={title}>{title}</li>)}
        </ul>
        <Link to="/contact" className="btn explorer__capability-action">
          Request a capability <IconArrowRight />
        </Link>
      </aside>
    </div>
  );
}
