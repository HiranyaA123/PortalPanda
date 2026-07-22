import { useEffect, useRef, useState } from 'react';
import SystemWeb, { SYSTEMS } from './SystemWeb.jsx';

// Pins the web while you scroll and sweeps the active system around it, so the
// data flow is scroll-driven — then releases into the demo CTA below. On small
// screens it degrades to a normal, click-only interactive section (no pinning).
export default function SystemWebSection() {
  const ref = useRef(null);
  const manualOverrideRef = useRef(false);
  const [active, setActive] = useState('order');
  const [idx, setIdx] = useState(0);

  const selectSystem = (id) => {
    const nextIndex = SYSTEMS.findIndex((system) => system.id === id);
    manualOverrideRef.current = true;
    setActive(id);
    if (nextIndex >= 0) setIdx(nextIndex);
  };

  useEffect(() => {
    if (window.matchMedia('(max-width: 900px)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // Keep a clicked module stable until the user intentionally scrolls again.
        if (manualOverrideRef.current) return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = el.offsetHeight - window.innerHeight;
        const p = Math.min(Math.max(-rect.top / Math.max(dist, 1), 0), 1);
        // Small lead-in/out padding so the first and last systems get airtime.
        const eased = Math.min(Math.max((p - 0.06) / 0.88, 0), 1);
        const i = Math.min(Math.floor(eased * SYSTEMS.length), SYSTEMS.length - 1);
        setIdx(i);
        setActive(SYSTEMS[i].id);
      });
    };

    const resumeAuto = () => {
      manualOverrideRef.current = false;
    };
    const resumeAutoFromKey = (event) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
        resumeAuto();
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('wheel', resumeAuto, { passive: true });
    window.addEventListener('touchmove', resumeAuto, { passive: true });
    window.addEventListener('keydown', resumeAutoFromKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', resumeAuto);
      window.removeEventListener('touchmove', resumeAuto);
      window.removeEventListener('keydown', resumeAutoFromKey);
    };
  }, []);

  return (
    <section className="weblab" ref={ref}>
      <div className="weblab__sticky">
        <div className="container">
          <div className="section-head weblab__head">
            <span className="eyebrow">One connected system</span>
            <h2>Every part of your venue, talking to each other.</h2>
            <p>Scroll — data flows from the CentralPass core to each system in turn. Or click any node to explore it yourself.</p>
          </div>

          <SystemWeb active={active} onSelect={selectSystem} />

          <div className="weblab__cue" aria-hidden="true">
            <span className="weblab__count">{String(idx + 1).padStart(2, '0')}</span>
            <span className="weblab__count-sep">/ {String(SYSTEMS.length).padStart(2, '0')}</span>
            <span className="weblab__cue-line"><span className="weblab__cue-fill" style={{ width: `${((idx + 1) / SYSTEMS.length) * 100}%` }} /></span>
            <span className="weblab__cue-text">{idx < SYSTEMS.length - 1 ? 'keep scrolling' : 'all connected'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
