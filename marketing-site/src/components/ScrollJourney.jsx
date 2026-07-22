import { useEffect, useMemo, useRef, useState } from 'react';
import {
  IconStore,
  IconRefresh,
  IconChef,
  IconClock,
  IconPrinter,
  IconTruck,
} from './icons.jsx';

// Scroll-driven "follow an order through the portal". A glowing packet rides a
// curvy path down the page; each stage animates as the packet reaches it, and
// reverses when you scroll back up. You can build your own order at the top and
// watch those exact items flow into the kitchen ticket and the printed receipt.

const MENU = [
  { id: 'flat', e: '☕', n: 'Flat White', p: 4.5 },
  { id: 'avo', e: '🥑', n: 'Avo Smash', p: 18 },
  { id: 'brekkie', e: '🍳', n: 'Big Brekkie', p: 24 },
  { id: 'burger', e: '🍔', n: 'Wagyu Burger', p: 22 },
  { id: 'waffle', e: '🧇', n: 'Waffles', p: 16 },
];
const DEFAULT = ['flat', 'brekkie', 'avo'];
const money = (n) => `$${n.toFixed(2)}`;

const STAGES = [
  { id: 'order', Icon: IconStore, step: 'A customer orders', title: 'They build it on your own site', body: 'A custom ordering site — your brand, your menu. Pick a few dishes and watch them travel.', kind: 'order' },
  { id: 'sync', Icon: IconRefresh, step: 'It reaches your portal', title: 'Sent straight to you, in real time', body: 'The order lands in Portal Panda the instant it’s placed — no marketplace, no middleman, no commission.', kind: 'send' },
  { id: 'kitchen', Icon: IconChef, step: 'The kitchen picks it up', title: 'It lands on the kitchen board', body: 'Your team sees it instantly on the tablet with a sound alert. One tap to accept and start cooking.', kind: 'ticket-new' },
  { id: 'cook', Icon: IconClock, step: 'Your team cooks', title: 'Cooked, then marked ready', body: 'Status moves from cooking to ready in a tap — and the customer is kept in the loop automatically.', kind: 'ticket-ready' },
  { id: 'print', Icon: IconPrinter, step: 'The docket prints', title: 'A receipt prints itself', body: 'A docket slides out of the Star receipt printer the moment an order is accepted — nothing to key in.', kind: 'receipt' },
  { id: 'deliver', Icon: IconTruck, step: 'Pickup or delivery', title: 'Out the door', body: 'Ready for pickup, or dispatched to an Uber Direct courier automatically — and you keep the customer.', kind: 'delivery' },
];

function buildPath(pts) {
  if (pts.length < 2) return '';
  const d = [`M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`];
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`);
  }
  return d.join(' ');
}

export default function ScrollJourney() {
  const [order, setOrder] = useState([]);

  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const trackRef = useRef(null);
  const flowRef = useRef(null);
  const trailRef = useRef(null);
  const packetRef = useRef(null);
  const nodeRefs = useRef([]);

  const lines = useMemo(() => {
    const ids = order.length ? order : DEFAULT;
    const map = new Map();
    ids.forEach((id) => {
      const it = MENU.find((m) => m.id === id);
      if (!it) return;
      const cur = map.get(id);
      map.set(id, cur ? { ...cur, qty: cur.qty + 1 } : { ...it, qty: 1 });
    });
    return [...map.values()];
  }, [order]);

  const total = (order.length ? order : DEFAULT).reduce((s, id) => {
    const it = MENU.find((m) => m.id === id);
    return s + (it ? it.p : 0);
  }, 0);

  const add = (id) => setOrder((o) => [...o, id]);
  const removeOne = (id) =>
    setOrder((o) => {
      const i = o.lastIndexOf(id);
      if (i < 0) return o;
      const copy = [...o];
      copy.splice(i, 1);
      return copy;
    });

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const track = trackRef.current;
    const flow = flowRef.current;
    const trail = trailRef.current;
    const packet = packetRef.current;
    if (!root || !trail) return undefined;

    const stages = [...root.querySelectorAll('.stage')];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let len = 0;
    let anchors = [];

    const update = () => {
      if (!len) return;
      const rect = root.getBoundingClientRect();
      const p = Math.min(Math.max((window.innerHeight * 0.5 - rect.top) / rect.height, 0), 1);
      const pt = trail.getPointAtLength(len * p);
      packet.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
      trail.style.strokeDashoffset = `${len * (1 - p)}`;
      for (let i = 0; i < stages.length; i += 1) {
        const a = anchors[i];
        if (a) stages[i].classList.toggle('is-active', pt.y >= a.y - 24);
      }
    };

    const build = () => {
      const rr = root.getBoundingClientRect();
      const W = root.offsetWidth;
      const H = root.offsetHeight;
      anchors = nodeRefs.current.filter(Boolean).map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - rr.left + r.width / 2, y: r.top - rr.top + r.height / 2 };
      });
      if (anchors.length < 2) return;
      const d = buildPath(anchors);
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      track.setAttribute('d', d);
      trail.setAttribute('d', d);
      if (flow) flow.setAttribute('d', d);
      len = trail.getTotalLength();
      trail.style.strokeDasharray = `${len}`;
      update();
    };

    if (reduce) {
      build();
      stages.forEach((s) => s.classList.add('is-active'));
      if (len) {
        trail.style.strokeDashoffset = '0';
        const pt = trail.getPointAtLength(len);
        packet.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
      }
      return undefined;
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    build();
    const t = setTimeout(build, 350); // rebuild once fonts/layout settle
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', build);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', build);
    };
  }, []);

  const renderVisual = (kind) => {
    if (kind === 'order') {
      return (
        <div className="jv jv--order">
          <div className="jv__bar"><span className="jv__dots"><i /><i /><i /></span> Your Café · Build an order</div>
          <div className="jv__menu">
            {MENU.map((it) => (
              <button key={it.id} type="button" className="jv__mi" onClick={() => add(it.id)}>
                <span className="jv__mi-e">{it.e}</span>
                <span className="jv__mi-n">{it.n}<i>{money(it.p)}</i></span>
                <span className="jv__mi-add">＋</span>
              </button>
            ))}
          </div>
          <div className="jv__sel">
            {lines.length === 0 ? (
              <p className="jv__sel-empty">Tap a dish to add it →</p>
            ) : (
              <ul className="jv__sel-list">
                {lines.map((l) => (
                  <li key={l.id}>
                    <button type="button" className="jv__sel-x" onClick={() => removeOne(l.id)} aria-label={`Remove ${l.n}`}>×</button>
                    <span className="jv__sel-q">{l.qty}×</span> {l.n}
                    <b>{money(l.p * l.qty)}</b>
                  </li>
                ))}
              </ul>
            )}
            <div className="jv__sel-total">
              <span>{order.length ? 'Your order' : 'Sample order'}</span>
              <b>{money(total)}</b>
            </div>
          </div>
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
            {lines.map((l) => (
              <span className="jv-ticket__i" key={l.id}>{l.qty}× {l.n}</span>
            ))}
            <div className="jv-ticket__bar"><span className="jv-ticket__fill" /></div>
          </div>
        </div>
      );
    }
    if (kind === 'receipt') {
      return (
        <div className="jv jv--print">
          <div className="printer">
            <div className="printer__top"><span className="printer__led" /> STAR TSP · receipt printer</div>
            <div className="printer__slot" />
            <div className="printer__feed">
              <div className="receipt">
                <b>Your Café</b>
                <span>Order #88 · Pickup</span>
                <span className="receipt__rule" />
                {lines.map((l) => (
                  <span key={l.id}>{l.qty}× {l.n}</span>
                ))}
                <span className="receipt__total">TOTAL {money(total)}</span>
                <span className="receipt__cut">✽ accepted 8:41am ✽</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="jv jv--deliver">
        <div className="jv__bar jv__bar--dark"><span className="jv__dots"><i /><i /><i /></span> Delivery · Uber Direct</div>
        <svg viewBox="0 0 240 120" className="jv-map" aria-hidden="true">
          <path d="M20 98 C 80 98, 80 38, 130 38 S 210 28, 220 20" />
          <circle className="jv-map__from" cx="20" cy="98" r="6" />
          <circle className="jv-map__to" cx="220" cy="20" r="6" />
          <circle className="jv-map__car" r="5">
            <animateMotion dur="3.2s" repeatCount="indefinite" path="M20 98 C 80 98, 80 38, 130 38 S 210 28, 220 20" />
          </circle>
        </svg>
        <div className="jv-deliv__row">
          <span className="jv-deliv__tag">Ready for pickup</span>
          <span className="jv-deliv__tag jv-deliv__tag--alt">Courier · ETA 12 min</span>
        </div>
      </div>
    );
  };

  return (
    <div className="journey" ref={rootRef}>
      <svg className="journey__svg" ref={svgRef} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="jtrail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6C4DFF" />
            <stop offset="0.5" stopColor="#A24BFF" />
            <stop offset="1" stopColor="#FF6B4A" />
          </linearGradient>
        </defs>
        <path className="journey__track" ref={trackRef} />
        <path className="journey__flow" ref={flowRef} />
        <path className="journey__trail" ref={trailRef} />
        <g className="journey__packet" ref={packetRef}>
          <circle className="journey__halo" r="15" />
          <circle className="journey__core" r="6" />
        </g>
      </svg>

      <ol className="journey__stages">
        {STAGES.map((s, i) => {
          const { Icon } = s;
          return (
            <li className="stage" key={s.id}>
              <div className="stage__node">
                <span
                  className="stage__node-inner"
                  ref={(el) => { nodeRefs.current[i] = el; }}
                >
                  <Icon />
                </span>
              </div>
              <div className="stage__card">
                <div className="stage__copy">
                  <span className="stage__step">{String(i + 1).padStart(2, '0')} · {s.step}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
                <div className="stage__vis">{renderVisual(s.kind)}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
