import { useEffect, useRef, useState } from 'react';

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

// Magnetic — element drifts toward the pointer, springs back on leave.
export function Magnetic({ children, strength = 0.35, className = '', ...rest }) {
  const ref = useRef(null);
  const active = finePointer() && !reduced();

  const onMove = (e) => {
    if (!active || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <span
      ref={ref}
      className={`magnetic ${className}`}
      onMouseMove={onMove}
      onMouseLeave={reset}
      {...rest}
    >
      {children}
    </span>
  );
}

// CountUp — animates a number into view once it's on screen.
//
// The truthful final value is what lives in the DOM and what assistive tech
// reads. Previously this initialised at `from`, so the page advertised "0+
// menu items" to screen readers, crawlers, screenshots and anyone whose
// observer never fired — the exact opposite of the intended proof. The
// animation is now decorative only: it is aria-hidden, and the real figure is
// always present as the accessible name.
export function CountUp({ to, from = 0, duration = 1400, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const final = `${prefix}${to.toFixed(decimals)}${suffix}`;
  // Start at the true value so no-JS, pre-observer and failed-observer states
  // are all still accurate.
  const [val, setVal] = useState(to);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (reduced()) {
      setVal(to);
      return undefined;
    }
    let raf = 0;
    let start = 0;
    let seen = false;

    const run = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(run);
    };

    const startRun = () => {
      // Only drop to `from` at the moment the animation actually begins.
      setVal(from);
      raf = requestAnimationFrame(run);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !seen) {
            seen = true;
            startRun();
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(node);
    // Fallback: if it's already on screen at mount, kick it off immediately.
    const r = node.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0 && !seen) {
      seen = true;
      startRun();
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [to, from, duration]);

  return (
    <span ref={ref} aria-label={final}>
      <span aria-hidden="true">
        {prefix}
        {val.toFixed(decimals)}
        {suffix}
      </span>
    </span>
  );
}
