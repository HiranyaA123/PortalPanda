import { useEffect, useRef, useState } from 'react';

// Interactive module explorer: a vertical list of modules; picking one swaps the
// panel (copy + a live coded mockup). Gently auto-advances until the visitor
// takes over, then stays put.
export default function ModuleExplorer({ modules, autoMs = 4200 }) {
  const [active, setActive] = useState(0);
  const [taken, setTaken] = useState(false);
  const hovering = useRef(false);

  useEffect(() => {
    if (taken) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => {
      if (!hovering.current) setActive((a) => (a + 1) % modules.length);
    }, autoMs);
    return () => clearInterval(id);
  }, [taken, modules.length, autoMs]);

  const pick = (i) => {
    setTaken(true);
    setActive(i);
  };

  const m = modules[active];
  const Mock = m.Mock;

  return (
    <div
      className="explorer"
      onMouseEnter={() => { hovering.current = true; }}
      onMouseLeave={() => { hovering.current = false; }}
    >
      <div className="explorer__tabs" role="tablist" aria-label="Platform modules">
        {modules.map((mod, i) => {
          const Icon = mod.Icon;
          return (
            <button
              key={mod.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`explorer__tab ${i === active ? 'is-active' : ''}`}
              onClick={() => pick(i)}
            >
              <span className="explorer__tab-icon"><Icon /></span>
              <span className="explorer__tab-name">{mod.name}</span>
              {i === active && !taken && <span className="explorer__progress" style={{ animationDuration: `${autoMs}ms` }} />}
            </button>
          );
        })}
      </div>

      <div className="explorer__panel" key={active}>
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
    </div>
  );
}
