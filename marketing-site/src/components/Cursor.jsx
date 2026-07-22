import { useEffect, useRef, useState } from 'react';

// Site-wide custom cursor: a gradient "portal" ring plus a precise dot.
// Only mounts on fine-pointer devices with motion allowed — touch users and
// reduced-motion users keep their native cursor untouched.
export default function Cursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return undefined;

    setEnabled(true);
    document.body.classList.add('has-cursor', 'cursor-gone');

    const onMove = (e) => {
      const position = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (dotRef.current) dotRef.current.style.transform = position;
      if (ringRef.current) ringRef.current.style.transform = position;
      document.body.classList.remove('cursor-gone');
    };
    const onOver = (e) => {
      const t = e.target;
      const interactive = t.closest('a, button, [data-cursor], input, textarea, select, label');
      document.body.classList.toggle(
        'cursor-hot',
        !!(interactive && !interactive.matches('input, textarea, select'))
      );
    };
    const onDown = () => document.body.classList.add('cursor-press');
    const onUp = () => document.body.classList.remove('cursor-press');
    const onLeave = () => document.body.classList.add('cursor-gone');

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.body.classList.remove('has-cursor', 'cursor-hot', 'cursor-press', 'cursor-gone');
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div ref={ringRef} className="cursor cursor--ring" aria-hidden="true">
        <span className="cursor__v" />
      </div>
      <div ref={dotRef} className="cursor cursor--dot" aria-hidden="true">
        <span className="cursor__v" />
      </div>
    </>
  );
}
