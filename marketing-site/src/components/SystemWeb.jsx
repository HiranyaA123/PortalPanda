import { useLayoutEffect, useMemo, useRef, useState, useEffect } from 'react';
import {
  IconStore,
  IconCalendar,
  IconChef,
  IconClock,
  IconChat,
  IconTruck,
} from './icons.jsx';

// The "web of data": a CentralPass hub in the middle with live data flowing out
// along a web to six interactive system nodes. Click a node to open its live
// component. What you order flows into the kitchen ticket — one connected system.

export const SYSTEMS = [
  { id: 'order', name: 'Ordering', Icon: IconStore, x: 50, y: 8 },
  { id: 'book', name: 'Bookings', Icon: IconCalendar, x: 88, y: 30 },
  { id: 'kitchen', name: 'Kitchen', Icon: IconChef, x: 85, y: 74 },
  { id: 'staff', name: 'Staff clock', Icon: IconClock, x: 50, y: 94 },
  { id: 'promo', name: 'Promotions', Icon: IconChat, x: 15, y: 74 },
  { id: 'delivery', name: 'Delivery', Icon: IconTruck, x: 12, y: 30 },
];

const MENU = [
  { id: 'flat', e: '☕', n: 'Flat White', p: 4.5 },
  { id: 'avo', e: '🥑', n: 'Avo Smash', p: 18 },
  { id: 'brekkie', e: '🍳', n: 'Big Brekkie', p: 24 },
  { id: 'burger', e: '🍔', n: 'Wagyu Burger', p: 22 },
];
const DEFAULT = ['flat', 'brekkie', 'avo'];
const money = (n) => `$${n.toFixed(2)}`;

const SLOTS = ['6:00', '6:30', '7:00', '7:30', '8:00', '8:30'];
const PROMOS = [
  { id: 'fri', label: '20% off Fridays', copy: 'This Friday only — 20% off your whole order at Central Café. Tap to order.' },
  { id: 'bogo', label: 'Free coffee w/ brekkie', copy: 'Free coffee with any Big Brekkie this week at Central Café. See you soon!' },
  { id: 'loyal', label: 'We miss you — 15% off', copy: 'Haven’t seen you in a while! Here’s 15% off your next pickup. Come back soon.' },
];

export default function SystemWeb({ active: activeProp, onSelect } = {}) {
  const [activeInternal, setActiveInternal] = useState('order');
  const active = activeProp || activeInternal;
  const setActive = onSelect || setActiveInternal;
  const [order, setOrder] = useState([]);
  const [staff, setStaff] = useState({ Mia: true, Jack: true, Sam: false });
  const [slot, setSlot] = useState('7:00');
  const [promo, setPromo] = useState('fri');
  const [sent, setSent] = useState(false);

  const stageRef = useRef(null);
  const svgRef = useRef(null);
  const hubRef = useRef(null);
  const nodeRefs = useRef([]);
  const [edges, setEdges] = useState([]);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  const activeIndex = SYSTEMS.findIndex((s) => s.id === active);

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

  // Measure hub + node centres and build the web edges in pixel space.
  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const hub = hubRef.current;
      if (!stage || !hub) return;
      const sr = stage.getBoundingClientRect();
      const hr = hub.getBoundingClientRect();
      const hx = hr.left - sr.left + hr.width / 2;
      const hy = hr.top - sr.top + hr.height / 2;
      const next = nodeRefs.current.filter(Boolean).map((el) => {
        const r = el.getBoundingClientRect();
        const nx = r.left - sr.left + r.width / 2;
        const ny = r.top - sr.top + r.height / 2;
        return { d: `M ${hx.toFixed(1)} ${hy.toFixed(1)} L ${nx.toFixed(1)} ${ny.toFixed(1)}`, len: Math.hypot(nx - hx, ny - hy) };
      });
      setDims({ w: sr.width, h: sr.height });
      setEdges(next);
    };
    measure();
    const t = setTimeout(measure, 300);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Pause the flowing packets when the web is off-screen.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => stage.classList.toggle('is-live', e.isIntersecting)),
      { threshold: 0.15 }
    );
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  const add = (id) => setOrder((o) => [...o, id]);
  const removeOne = (id) =>
    setOrder((o) => {
      const i = o.lastIndexOf(id);
      if (i < 0) return o;
      const c = [...o];
      c.splice(i, 1);
      return c;
    });

  const detail = () => {
    if (active === 'order') {
      return (
        <div className="jv jv--order">
          <div className="jv__bar"><span className="jv__dots"><i /><i /><i /></span> Central Café · Order online</div>
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
              <span>{order.length ? 'Your order → flows to the kitchen' : 'Sample order'}</span>
              <b>{money(total)}</b>
            </div>
          </div>
        </div>
      );
    }
    if (active === 'kitchen') {
      return (
        <div className="jv jv--kitchen is-new">
          <div className="jv__bar jv__bar--dark">
            <span className="jv__dots"><i /><i /><i /></span> Kitchen board
            <span className="jv__ding">● live</span>
          </div>
          <div className="jv-ticket is-shown">
            <div className="jv-ticket__top">
              <b>#88</b>
              <span className="ticket__chip chip--new">New</span>
            </div>
            {lines.map((l) => (
              <span className="jv-ticket__i" key={l.id}>{l.qty}× {l.n}</span>
            ))}
            <div className="jv-ticket__bar"><span className="jv-ticket__fill" style={{ width: '34%', background: 'var(--violet-2)' }} /></div>
            <p className="jv-hint">This is the order you built in Ordering — same system.</p>
          </div>
        </div>
      );
    }
    if (active === 'book') {
      return (
        <div className="jv jv--book">
          <div className="jv__bar"><span className="jv__dots"><i /><i /><i /></span> Bookings · Fri 12 Jul</div>
          <div className="book__body">
            <span className="book__label">Pick a table time</span>
            <div className="book__grid">
              {SLOTS.map((t) => (
                <button key={t} type="button" className={`book__slot ${slot === t ? 'on' : ''}`} onClick={() => setSlot(t)}>{t}pm</button>
              ))}
            </div>
            <div className="book__confirm">
              <span className="book__tick">✓</span>
              Booked <b>{slot}pm</b> · 4 covers · confirmed by SMS
            </div>
          </div>
        </div>
      );
    }
    if (active === 'staff') {
      return (
        <div className="jv jv--staff">
          <div className="jv__bar jv__bar--dark"><span className="jv__dots"><i /><i /><i /></span> Staff portal · Time clock</div>
          <div className="staff__body">
            {Object.entries(staff).map(([name, on]) => (
              <div className="staff__row" key={name}>
                <span className="staff__av">{name[0]}</span>
                <span className="staff__n">{name}<i>{on ? 'On shift since 7:02am' : 'Not clocked in'}</i></span>
                <button
                  type="button"
                  className={`staff__clock ${on ? 'in' : 'out'}`}
                  onClick={() => setStaff((s) => ({ ...s, [name]: !s[name] }))}
                >
                  {on ? 'Clock out' : 'Clock in'}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (active === 'promo') {
      const p = PROMOS.find((x) => x.id === promo);
      return (
        <div className="jv jv--promo">
          <div className="jv__bar"><span className="jv__dots"><i /><i /><i /></span> Promotions · Email + SMS</div>
          <div className="promo__body">
            <div className="promo__pick">
              {PROMOS.map((x) => (
                <button key={x.id} type="button" className={`promo__chip ${promo === x.id ? 'on' : ''}`} onClick={() => { setPromo(x.id); setSent(false); }}>{x.label}</button>
              ))}
            </div>
            <button type="button" className={`promo__send ${sent ? 'is-sent' : ''}`} onClick={() => setSent(true)}>
              {sent ? 'Sent to 1,240 customers ✓' : 'Send to 1,240 customers'}
            </button>
            <div className={`promo__out ${sent ? 'show' : ''}`}>
              <div className="promo__email">
                <div className="promo__email-h"><span className="promo__dot" /> Central Café</div>
                <b>{p.label}</b>
                <span>{p.copy}</span>
              </div>
              <div className="promo__sms">
                <span className="promo__sms-bub">{p.copy}</span>
                <span className="promo__sms-meta">SMS · delivered</span>
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
          <circle className="jv-map__car" cx="129" cy="39" r="5.5" />
        </svg>
        <div className="jv-deliv__row">
          <span className="jv-deliv__tag">Ready for pickup</span>
          <span className="jv-deliv__tag jv-deliv__tag--alt">Courier · ETA 12 min</span>
        </div>
      </div>
    );
  };

  const activeName = SYSTEMS[activeIndex]?.name;

  return (
    <div className="webz">
      <div className="webz__stage" ref={stageRef}>
        <svg
          className="webz__lines"
          ref={svgRef}
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="webgrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6C4DFF" />
              <stop offset="1" stopColor="#FF6B4A" />
            </linearGradient>
          </defs>
          {edges.map((e, i) => (
            <path key={`b${i}`} className={`webz__edge ${i === activeIndex ? 'is-active' : ''}`} d={e.d} />
          ))}
          {edges.map((e, i) => (
            <path
              key={`p${i}`}
              className={`webz__pulse ${i === activeIndex ? 'is-active' : ''}`}
              d={e.d}
              style={{ '--l': `${e.len}px`, '--dur': `${2.1 + i * 0.22}s`, animationDelay: `${i * 0.32}s` }}
            />
          ))}
        </svg>

        <button type="button" className="webz__hub" ref={hubRef} onClick={() => setActive('order')}>
          <span className="webz__hub-ring" />
          <span className="webz__hub-core">
            <b>Central</b>Pass
          </span>
        </button>

        {SYSTEMS.map((s, i) => {
          const { Icon } = s;
          return (
            <button
              key={s.id}
              type="button"
              className={`webz__node ${active === s.id ? 'is-active' : ''}`}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              ref={(el) => { nodeRefs.current[i] = el; }}
              onClick={() => setActive(s.id)}
              aria-pressed={active === s.id}
            >
              <span className="webz__node-icon"><Icon /></span>
              <span className="webz__node-name">{s.name}</span>
            </button>
          );
        })}
      </div>

      <div className="webz__detail">
        <div className="webz__detail-head">
          <span className="eyebrow">{activeName}</span>
          <p>Live component — try it. Everything you see is one connected system.</p>
        </div>
        <div className="webz__detail-body" key={active}>
          {detail()}
        </div>
      </div>
    </div>
  );
}
