import { useEffect, useRef } from 'react';
import {
  IconStore,
  IconRefresh,
  IconChef,
  IconClock,
  IconPrinter,
  IconTruck,
} from './icons.jsx';

// Scroll-driven "follow an order through the portal" narrative. A glowing packet
// travels down a spine on the left as you scroll; each stage on the right comes
// alive (order fills, ticket lands, receipt prints, courier dispatches) when it
// scrolls into view. Reduced-motion users see every stage active and static.

const STAGES = [
  {
    id: 'order', Icon: IconStore, step: 'A customer orders',
    title: 'They tap through your own site',
    body: 'A custom ordering site — your brand, your menu, your prices. Card or cash, pickup or delivery.',
    kind: 'order',
  },
  {
    id: 'sync', Icon: IconRefresh, step: 'It reaches your portal',
    title: 'Sent straight to you, in real time',
    body: 'The order lands in Portal Panda the instant it’s placed — no marketplace, no middleman, no commission.',
    kind: 'send',
  },
  {
    id: 'kitchen', Icon: IconChef, step: 'The kitchen picks it up',
    title: 'It lands on the kitchen board',
    body: 'Your team sees it instantly on the tablet with a sound alert. One tap to accept and start cooking.',
    kind: 'ticket-new',
  },
  {
    id: 'cook', Icon: IconClock, step: 'Your team cooks',
    title: 'Cooked, then marked ready',
    body: 'Status moves from cooking to ready in a tap — and the customer is kept in the loop automatically.',
    kind: 'ticket-ready',
  },
  {
    id: 'print', Icon: IconPrinter, step: 'The docket prints',
    title: 'A receipt prints itself',
    body: 'Dockets print automatically on a Star receipt printer the moment an order is accepted — nothing to key in.',
    kind: 'receipt',
  },
  {
    id: 'deliver', Icon: IconTruck, step: 'Pickup or delivery',
    title: 'Out the door',
    body: 'Ready for pickup, or dispatched to an Uber Direct courier automatically — and you keep the customer either way.',
    kind: 'delivery',
  },
];

function Visual({ kind }) {
  if (kind === 'order') {
    return (
      <div className="jv jv--order">
        <div className="jv__bar"><span className="jv__dots"><i /><i /><i /></span> Your Café · Order</div>
        <ul className="jv__items">
          <li><span>☕</span> Flat White <b>$4.50</b></li>
          <li><span>🍳</span> Big Brekkie <b>$24.00</b></li>
          <li><span>🥑</span> Avo Smash <b>$18.00</b></li>
        </ul>
        <div className="jv__total"><span>Total</span><b>$46.50</b></div>
        <div className="jv__go">Place order →</div>
      </div>
    );
  }
  if (kind === 'send') {
    return (
      <div className="jv jv--send">
        <div className="jv__wave"><span /><span /><span /></div>
        <code className="jv__code">POST /orders → 200 OK</code>
        <span className="jv__note">Encrypted · commission-free · instant</span>
      </div>
    );
  }
  if (kind === 'ticket-new' || kind === 'ticket-ready') {
    const ready = kind === 'ticket-ready';
    return (
      <div className={`jv jv--kitchen ${ready ? 'is-ready' : 'is-new'}`}>
        <div className="jv__bar jv__bar--dark">
          <span className="jv__dots"><i /><i /><i /></span> Kitchen board
          <span className="jv__ding">● live</span>
        </div>
        <div className="jv-ticket">
          <div className="jv-ticket__top">
            <b>#88</b>
            <span className={`ticket__chip chip--${ready ? 'ready' : 'new'}`}>{ready ? 'Ready' : 'New'}</span>
          </div>
          <span className="jv-ticket__i">1× Flat White</span>
          <span className="jv-ticket__i">1× Big Brekkie</span>
          <span className="jv-ticket__i">1× Avo Smash</span>
          <div className="jv-ticket__bar"><span className="jv-ticket__fill" /></div>
        </div>
      </div>
    );
  }
  if (kind === 'receipt') {
    return (
      <div className="jv jv--print">
        <div className="jv-printer">
          <div className="jv-printer__body">
            <span className="jv-printer__eye" />
            RECEIPT PRINTER
          </div>
          <div className="jv-printer__slot" />
          <div className="jv-receipt">
            <b>Your Café</b>
            <span>Order #88 · Pickup</span>
            <span>1× Flat White</span>
            <span>1× Big Brekkie</span>
            <span>1× Avo Smash</span>
            <span className="jv-receipt__total">TOTAL $46.50</span>
            <span className="jv-receipt__cut">✽ accepted 8:41am ✽</span>
          </div>
        </div>
      </div>
    );
  }
  // delivery
  return (
    <div className="jv jv--deliver">
      <div className="jv__bar jv__bar--dark"><span className="jv__dots"><i /><i /><i /></span> Delivery · Uber Direct</div>
      <svg viewBox="0 0 240 120" className="jv-map" aria-hidden="true">
        <path d="M20 98 C 80 98, 80 38, 130 38 S 210 28, 220 20" />
        <circle className="jv-map__from" cx="20" cy="98" r="6" />
        <circle className="jv-map__to" cx="220" cy="20" r="6" />
        <circle className="jv-map__car" r="5">
          <animateMotion dur="3.2s" repeatCount="indefinite"
            path="M20 98 C 80 98, 80 38, 130 38 S 210 28, 220 20" />
        </circle>
      </svg>
      <div className="jv-deliv__row">
        <span className="jv-deliv__tag">Ready for pickup</span>
        <span className="jv-deliv__tag jv-deliv__tag--alt">Courier · ETA 12 min</span>
      </div>
    </div>
  );
}

export default function ScrollJourney() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const stages = [...root.querySelectorAll('.stage')];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      stages.forEach((s) => s.classList.add('is-active'));
      root.style.setProperty('--p', '1');
      return undefined;
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height - vh;
        const scrolled = Math.min(Math.max(-rect.top + vh * 0.5, 0), Math.max(total, 1));
        const p = total > 0 ? Math.min(scrolled / total, 1) : 0;
        root.style.setProperty('--p', p.toFixed(4));
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('is-active');
        });
      },
      { rootMargin: '0px 0px -30% 0px', threshold: 0.2 }
    );
    stages.forEach((s) => io.observe(s));

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="journey" ref={rootRef}>
      <div className="journey__spine" aria-hidden="true">
        <div className="journey__flow" />
        <div className="journey__trail" />
        <div className="journey__packet" />
      </div>

      <ol className="journey__stages">
        {STAGES.map((s, i) => {
          const { Icon } = s;
          return (
            <li className="stage" data-i={i} key={s.id}>
              <div className="stage__node">
                <span className="stage__node-inner"><Icon /></span>
              </div>
              <div className="stage__card">
                <div className="stage__copy">
                  <span className="stage__step">{String(i + 1).padStart(2, '0')} · {s.step}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
                <div className="stage__vis">
                  <Visual kind={s.kind} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
