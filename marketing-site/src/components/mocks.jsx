// Coded, screenshot-free product mockups. Each is schematic but branded so the
// site never shows an empty placeholder. Wrapped in a lightweight app/browser
// "chrome" via <Frame>.
//
// These are INTERACTIVE. A static picture of software is a claim; something the
// visitor can poke is evidence. Every control below is a real <button> with an
// accessible name, so the demos are keyboard-operable and screen-reader
// navigable rather than decorative divs with click handlers.
//
// They are demonstrations, not the product. Each frame carries a visible
// "Demo" marker and the interactive region is labelled as a sample, so nobody
// mistakes the mock data for their own venue's.
import { useState } from 'react';
import {
  IconCoffee,
  IconBowl,
  IconEgg,
  IconPastry,
} from './icons.jsx';

function Frame({ label, tone = 'light', hint, children }) {
  return (
    <div className={`mk ${tone === 'dark' ? 'mk--dark' : ''}`}>
      <div className="mk__bar">
        <span className="mk__dots"><i /><i /><i /></span>
        <span className="mk__label">{label}</span>
        <span className="mk__demo">Demo</span>
      </div>
      <div className="mk__body">{children}</div>
      {hint && <p className="mk__hint">{hint}</p>}
    </div>
  );
}

const AUD = (n) => `$${n.toFixed(2)}`;

export function MockOrder() {
  // Item icons are SVG, not emoji - see icons.jsx for why.
  const items = [
    { n: 'Flat White', p: 4.5, Icon: IconCoffee },
    { n: 'Avo Smash', p: 18, Icon: IconBowl },
    { n: 'Big Brekkie', p: 24, Icon: IconEgg },
    { n: 'Croissant', p: 6.5, Icon: IconPastry },
  ];
  const [cart, setCart] = useState({ 'Flat White': 1, 'Avo Smash': 1 });

  const add = (name) =>
    setCart((c) => ({ ...c, [name]: (c[name] || 0) + 1 }));
  const remove = (name) =>
    setCart((c) => {
      const next = { ...c, [name]: (c[name] || 0) - 1 };
      if (next[name] <= 0) delete next[name];
      return next;
    });

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = items.reduce((sum, it) => sum + (cart[it.n] || 0) * it.p, 0);

  return (
    <Frame label="yourcafe.com.au" hint="Sample menu. Add an item to see the cart update.">
      <div className="mk-order">
        <div className="mk-order__hero">
          <span className="mk-pill">Open · Pickup in 15 min</span>
          <b>Breakfast &amp; Brunch</b>
        </div>

        <ul className="mk-order__list">
          {items.map(({ n, p, Icon }) => {
            const qty = cart[n] || 0;
            return (
              <li className={`mk-order__row ${qty ? 'is-in-cart' : ''}`} key={n}>
                <span className="mk-order__e" aria-hidden="true"><Icon /></span>
                <span className="mk-order__n">{n}<i>{AUD(p)}</i></span>
                <span className="mk-order__qty">
                  <button
                    type="button"
                    className="mk-order__step"
                    onClick={() => remove(n)}
                    disabled={!qty}
                    aria-label={`Remove one ${n}`}
                  >
                    −
                  </button>
                  <b aria-live="off">{qty}</b>
                  <button
                    type="button"
                    className="mk-order__step mk-order__step--add"
                    onClick={() => add(n)}
                    aria-label={`Add one ${n}`}
                  >
                    +
                  </button>
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mk-order__cta" role="status">
          {count
            ? `${count} item${count === 1 ? '' : 's'} · ${AUD(total)} · Checkout`
            : 'Your cart is empty'}
        </p>
      </div>
    </Frame>
  );
}

export function MockKitchen() {
  // A ticket moves New -> Cooking -> Ready, the way it does on the pass.
  const FLOW = ['new', 'cooking', 'ready'];
  const LABEL = { new: 'New', cooking: 'Cooking', ready: 'Ready' };
  const NEXT = { new: 'Start cooking', cooking: 'Mark ready', ready: 'Hand over' };

  const [tickets, setTickets] = useState([
    { no: 88, s: 'new', items: ['1× Flat White', '1× Big Brekkie'] },
    { no: 87, s: 'cooking', items: ['2× Avo Smash', '1× OJ'] },
    { no: 86, s: 'ready', items: ['1× Wagyu Burger'] },
  ]);

  const advance = (no) =>
    setTickets((all) =>
      all.map((t) => {
        if (t.no !== no) return t;
        const i = FLOW.indexOf(t.s);
        return i < FLOW.length - 1 ? { ...t, s: FLOW[i + 1] } : { ...t, s: 'new' };
      }),
    );

  return (
    <Frame label="Kitchen board" tone="dark" hint="Sample tickets. Tap one to move it along the pass.">
      <div className="mk-kitchen">
        {tickets.map((t) => (
          <button
            type="button"
            className={`mk-tkt mk-tkt--${t.s}`}
            key={t.no}
            onClick={() => advance(t.no)}
            aria-label={`Order ${t.no}, currently ${LABEL[t.s]}. ${NEXT[t.s]}.`}
          >
            <span className="mk-tkt__top">
              <b>#{t.no}</b>
              <span className={`mk-tkt__chip chip--${t.s}`}>{LABEL[t.s]}</span>
            </span>
            {t.items.map((i) => <span className="mk-tkt__i" key={i}>{i}</span>)}
            <span className="mk-tkt__next">{NEXT[t.s]}</span>
          </button>
        ))}
      </div>
    </Frame>
  );
}

export function MockDashboard() {
  const VIEWS = [
    {
      id: 'today', name: 'Today',
      stats: [['Today', '$1,284', '▲ 12%'], ['Orders', '63', '▲ 8%'], ['Avg', '$20.40', '']],
      bars: [42, 60, 38, 72, 55, 83, 68],
    },
    {
      id: 'week', name: 'This week',
      stats: [['Week', '$8,910', '▲ 6%'], ['Orders', '412', '▲ 4%'], ['Avg', '$21.60', '']],
      bars: [58, 44, 66, 51, 78, 92, 74],
    },
    {
      id: 'menu', name: 'Menu',
      stats: [['Items', '104', ''], ['Sold out', '3', ''], ['Top seller', 'Big Brekkie', '']],
      bars: [88, 71, 64, 52, 47, 33, 22],
    },
  ];
  const [view, setView] = useState(0);
  const v = VIEWS[view];

  return (
    <Frame label="CentralPass · Dashboard" hint="Sample data. Switch views to see the dashboard change.">
      <div className="mk-dash">
        <div className="mk-dash__nav" role="group" aria-label="Sample dashboard views">
          {VIEWS.map((item, i) => (
            <button
              type="button"
              key={item.id}
              className={`mk-dash__navitem ${i === view ? 'is-active' : ''}`}
              onClick={() => setView(i)}
              aria-pressed={i === view}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="mk-dash__main">
          <div className="mk-dash__stats">
            {v.stats.map(([label, value, delta]) => (
              <div className="mk-stat" key={label}>
                <i>{label}</i><b>{value}</b><em className={delta ? 'up' : ''}>{delta || '/'}</em>
              </div>
            ))}
          </div>
          <div className="mk-chart" aria-hidden="true">
            {v.bars.map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function MockBookings() {
  const cols = ['Thu', 'Fri', 'Sat'];
  const initial = [
    [{ t: '6:00 · 2', a: 1 }, { t: '7:30 · 4', a: 0 }],
    [{ t: '6:30 · 6', a: 1 }, { t: '8:00 · 2', a: 1 }],
    [{ t: '5:30 · 4', a: 0 }, { t: '7:00 · 8', a: 1 }, { t: '8:30 · 2', a: 1 }],
  ];
  const [slots, setSlots] = useState(initial);

  const toggle = (col, idx) =>
    setSlots((all) => all.map((c, ci) =>
      ci !== col ? c : c.map((s, si) => (si === idx ? { ...s, a: s.a ? 0 : 1 } : s))));

  return (
    <Frame label="Bookings" hint="Sample week. Tap a slot to open or close it.">
      <div className="mk-book">
        {cols.map((c, i) => (
          <div className="mk-book__col" key={c}>
            <b>{c}</b>
            {slots[i].map((ch, si) => (
              <button
                type="button"
                className={`mk-book__chip ${ch.a ? 'on' : ''}`}
                key={ch.t}
                onClick={() => toggle(i, si)}
                aria-pressed={!!ch.a}
                aria-label={`${c} ${ch.t.replace('·', 'for')} covers, ${ch.a ? 'open' : 'closed'}`}
              >
                {ch.t}
              </button>
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function MockDelivery() {
  const [dispatched, setDispatched] = useState(false);

  return (
    <Frame label="Delivery · Uber Direct" tone="dark" hint="Sample order. Dispatch a courier to see the hand-off.">
      <div className="mk-deliv">
        <svg viewBox="0 0 220 120" className="mk-deliv__map" aria-hidden="true">
          <path d="M20 96 C 70 96, 70 40, 120 40 S 190 30, 200 20" />
          <circle className="mk-deliv__from" cx="20" cy="96" r="6" />
          <circle className="mk-deliv__to" cx="200" cy="20" r="6" />
          {dispatched && (
            <circle className="mk-deliv__car" r="5">
              <animateMotion dur="3.4s" repeatCount="indefinite"
                path="M20 96 C 70 96, 70 40, 120 40 S 190 30, 200 20" />
            </circle>
          )}
        </svg>
        <div className="mk-deliv__card">
          <b>Order #88</b>
          <span role="status">
            {dispatched ? 'Courier assigned · ETA 12 min' : 'Ready for dispatch'}
          </span>
          <button
            type="button"
            className="mk-deliv__go"
            onClick={() => setDispatched((d) => !d)}
            aria-pressed={dispatched}
          >
            {dispatched ? 'Recall courier' : 'Dispatch courier'}
          </button>
        </div>
      </div>
    </Frame>
  );
}

export function MockStaff() {
  const [staff, setStaff] = useState([
    { n: 'Mia R.', role: 'Front of house', on: 1 },
    { n: 'Jack T.', role: 'Barista', on: 1 },
    { n: 'Sam K.', role: 'Kitchen', on: 0 },
  ]);

  const toggle = (name) =>
    setStaff((all) => all.map((s) => (s.n === name ? { ...s, on: s.on ? 0 : 1 } : s)));

  return (
    <Frame label="Staff portal" hint="Sample roster. Tap a name to clock them in or out.">
      <div className="mk-staff">
        {staff.map((s) => (
          <div className="mk-staff__row" key={s.n}>
            <span className="mk-staff__av" aria-hidden="true">{s.n[0]}</span>
            <span className="mk-staff__n">{s.n}<i>{s.role}</i></span>
            <button
              type="button"
              className={`mk-staff__clock ${s.on ? 'on' : ''}`}
              onClick={() => toggle(s.n)}
              aria-pressed={!!s.on}
              aria-label={`${s.n}, ${s.on ? 'clocked in' : 'off shift'}. ${s.on ? 'Clock out' : 'Clock in'}.`}
            >
              {s.on ? 'Clocked in' : 'Off'}
            </button>
          </div>
        ))}
      </div>
    </Frame>
  );
}
