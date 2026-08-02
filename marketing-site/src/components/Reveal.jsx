import { useEffect, useRef, useState } from 'react';

// Fade + 12px rise on scroll, via IntersectionObserver.
// Respects prefers-reduced-motion (handled in CSS: .reveal is neutralised).
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If IntersectionObserver is unavailable, just show the content.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);

    // Safety net. Pages are prerendered now, so this content ships in the HTML
    // at opacity:0 and is only revealed by the observer above - if the observer
    // never reports, the copy stays permanently invisible. Anything already at
    // or above the fold on mount (restored scroll position, deep link to an
    // anchor, or an element scrolled past before hydration finished) is
    // revealed immediately rather than waiting for an intersection that has
    // already happened.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setVisible(true);
      observer.unobserve(node);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={['reveal', visible && 'is-visible', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}
