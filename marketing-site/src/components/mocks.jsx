// Coded, screenshot-free product mockups. Each is schematic but branded so the
// site never shows an empty placeholder. Wrapped in a lightweight app/browser
// "chrome" via <Frame>.

function Frame({ label, tone = 'light', children }) {
  return (
    <div className={`mk ${tone === 'dark' ? 'mk--dark' : ''}`}>
      <div className="mk__bar">
        <span className="mk__dots"><i /><i /><i /></span>
        <span className="mk__label">{label}</span>
      </div>
      <div className="mk__body">{children}</div>
    </div>
  );
}

export function MockOrder() {
  const items = [
    { e: '☕', n: 'Flat White', p: '$4.50' },
    { e: '🥑', n: 'Avo Smash', p: '$18.00' },
    { e: '🍳', n: 'Big Brekkie', p: '$24.00' },
    { e: '🥐', n: 'Croissant', p: '$6.50' },
  ];
  return (
    <Frame label="yourcafe.com.au">
      <div className="mk-order">
        <div className="mk-order__hero">
          <span className="mk-pill">Open · Pickup in 15 min</span>
          <b>Breakfast &amp; Brunch</b>
        </div>
        {items.map((it) => (
          <div className="mk-order__row" key={it.n}>
            <span className="mk-order__e">{it.e}</span>
            <span className="mk-order__n">{it.n}<i>{it.p}</i></span>
            <span className="mk-order__add">＋</span>
          </div>
        ))}
        <div className="mk-order__cta">2 items · $22.50 — Checkout</div>
      </div>
    </Frame>
  );
}

export function MockKitchen() {
  const tickets = [
    { no: 88, s: 'new', label: 'New', items: ['1× Flat White', '1× Big Brekkie'] },
    { no: 87, s: 'cooking', label: 'Cooking', items: ['2× Avo Smash', '1× OJ'] },
    { no: 86, s: 'ready', label: 'Ready', items: ['1× Wagyu Burger'] },
  ];
  return (
    <Frame label="Kitchen board" tone="dark">
      <div className="mk-kitchen">
        {tickets.map((t) => (
          <div className={`mk-tkt mk-tkt--${t.s}`} key={t.no}>
            <div className="mk-tkt__top">
              <b>#{t.no}</b>
              <span className={`mk-tkt__chip chip--${t.s}`}>{t.label}</span>
            </div>
            {t.items.map((i) => <span className="mk-tkt__i" key={i}>{i}</span>)}
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function MockDashboard() {
  return (
    <Frame label="CentralPass · Dashboard">
      <div className="mk-dash">
        <aside className="mk-dash__nav">
          <span className="is-active" />
          <span /><span /><span /><span />
        </aside>
        <div className="mk-dash__main">
          <div className="mk-dash__stats">
            <div className="mk-stat"><i>Today</i><b>$1,284</b><em className="up">▲ 12%</em></div>
            <div className="mk-stat"><i>Orders</i><b>63</b><em className="up">▲ 8%</em></div>
            <div className="mk-stat"><i>Avg</i><b>$20.4</b><em>—</em></div>
          </div>
          <div className="mk-chart">
            {[42, 60, 38, 72, 55, 83, 68].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="mk-rows">
            <span /><span /><span />
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function MockBookings() {
  const cols = ['Thu', 'Fri', 'Sat'];
  const chips = [
    [{ t: '6:00 · 2', a: 1 }, { t: '7:30 · 4', a: 0 }],
    [{ t: '6:30 · 6', a: 1 }, { t: '8:00 · 2', a: 1 }],
    [{ t: '5:30 · 4', a: 0 }, { t: '7:00 · 8', a: 1 }, { t: '8:30 · 2', a: 1 }],
  ];
  return (
    <Frame label="Bookings">
      <div className="mk-book">
        {cols.map((c, i) => (
          <div className="mk-book__col" key={c}>
            <b>{c}</b>
            {chips[i].map((ch) => (
              <span className={`mk-book__chip ${ch.a ? 'on' : ''}`} key={ch.t}>{ch.t}</span>
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function MockDelivery() {
  return (
    <Frame label="Delivery · Uber Direct" tone="dark">
      <div className="mk-deliv">
        <svg viewBox="0 0 220 120" className="mk-deliv__map" aria-hidden="true">
          <path d="M20 96 C 70 96, 70 40, 120 40 S 190 30, 200 20" />
          <circle className="mk-deliv__from" cx="20" cy="96" r="6" />
          <circle className="mk-deliv__to" cx="200" cy="20" r="6" />
          <circle className="mk-deliv__car" r="5">
            <animateMotion dur="3.4s" repeatCount="indefinite"
              path="M20 96 C 70 96, 70 40, 120 40 S 190 30, 200 20" />
          </circle>
        </svg>
        <div className="mk-deliv__card">
          <b>Order #88</b>
          <span>Courier assigned · ETA 12 min</span>
          <em>Dispatched via Uber Direct</em>
        </div>
      </div>
    </Frame>
  );
}

export function MockStaff() {
  const staff = [
    { n: 'Mia R.', role: 'Front of house', on: 1 },
    { n: 'Jack T.', role: 'Barista', on: 1 },
    { n: 'Sam K.', role: 'Kitchen', on: 0 },
  ];
  return (
    <Frame label="Staff portal">
      <div className="mk-staff">
        {staff.map((s) => (
          <div className="mk-staff__row" key={s.n}>
            <span className="mk-staff__av">{s.n[0]}</span>
            <span className="mk-staff__n">{s.n}<i>{s.role}</i></span>
            <span className={`mk-staff__clock ${s.on ? 'on' : ''}`}>
              {s.on ? 'Clocked in' : 'Off'}
            </span>
          </div>
        ))}
      </div>
    </Frame>
  );
}
