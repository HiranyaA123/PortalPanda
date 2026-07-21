import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// The showpiece: an interactive simulation of an order flowing through Portal
// Panda. Tap menu items to build an order, send it to the kitchen, and watch it
// move New -> Cooking -> Ready with a receipt printing. Auto-plays once on load,
// then hands control to the visitor. No screenshots — it's all live UI.

const MENU = [
  { id: 'flat-white', emoji: '☕', name: 'Flat White', price: 4.5 },
  { id: 'avo', emoji: '🥑', name: 'Avo Smash', price: 18 },
  { id: 'brekkie', emoji: '🍳', name: 'Big Brekkie', price: 24 },
  { id: 'burger', emoji: '🍔', name: 'Wagyu Burger', price: 22 },
  { id: 'waffles', emoji: '🧇', name: 'Waffles', price: 16 },
];

const money = (n) => `$${n.toFixed(2)}`;
const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// stage: 'building' | 'new' | 'cooking' | 'ready'
export default function OrderFlowDemo() {
  const [order, setOrder] = useState([]);
  const [stage, setStage] = useState('building');
  const [orderNo, setOrderNo] = useState(87);

  const interacted = useRef(false);
  const stageRef = useRef('building');
  const flowTimers = useRef([]);
  const autoTimers = useRef([]);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  const clear = (ref) => {
    ref.current.forEach(clearTimeout);
    ref.current = [];
  };
  const after = (ref, ms, fn) => {
    const t = setTimeout(fn, ms);
    ref.current.push(t);
  };

  const lines = useMemo(() => {
    const map = new Map();
    order.forEach((it) => {
      const cur = map.get(it.id);
      map.set(it.id, cur ? { ...cur, qty: cur.qty + 1 } : { ...it, qty: 1 });
    });
    return [...map.values()];
  }, [order]);

  const total = order.reduce((s, it) => s + it.price, 0);

  const send = useCallback(() => {
    clear(flowTimers);
    setStage('new');
    after(flowTimers, 1300, () => setStage('cooking'));
    after(flowTimers, 3600, () => setStage('ready'));
  }, []);

  const addItem = (item, isAuto = false) => {
    if (!isAuto) {
      interacted.current = true;
      clear(autoTimers);
    }
    if (stageRef.current !== 'building') {
      // Starting a fresh order after a completed one.
      clear(flowTimers);
      setOrderNo((n) => n + 1);
      setStage('building');
      setOrder([item]);
    } else {
      setOrder((o) => [...o, item]);
    }
  };

  const handleSend = () => {
    interacted.current = true;
    clear(autoTimers);
    if (order.length) send();
  };

  const reset = () => {
    interacted.current = true;
    clear(autoTimers);
    clear(flowTimers);
    setOrder([]);
    setStage('building');
    setOrderNo((n) => n + 1);
  };

  // Auto-play a single scripted run shortly after mount.
  useEffect(() => {
    if (reduced()) {
      // Static "finished" state for reduced-motion users.
      setOrder([MENU[0], MENU[2], MENU[1]]);
      setStage('ready');
      return undefined;
    }
    const play = () => {
      if (interacted.current) return;
      setOrder([]);
      setStage('building');
      after(autoTimers, 500, () => !interacted.current && setOrder([MENU[0]]));
      after(autoTimers, 1250, () => !interacted.current && setOrder([MENU[0], MENU[2]]));
      after(autoTimers, 2000, () => !interacted.current && setOrder([MENU[0], MENU[2], MENU[1]]));
      after(autoTimers, 2750, () => !interacted.current && send());
    };
    after(autoTimers, 1600, play);
    return () => {
      clear(autoTimers);
      clear(flowTimers);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stageLabel = { new: 'New order', cooking: 'Cooking', ready: 'Ready' };
  const done = stage === 'ready';

  return (
    <div className="ofd" data-cursor>
      <div className="ofd__glow" aria-hidden="true" />

      {/* Customer ordering app */}
      <div className="ofd__panel ofd__order">
        <div className="ofd__bar">
          <span className="ofd__dots"><i /><i /><i /></span>
          <span className="ofd__title">Your Café · Order online</span>
        </div>

        <div className="ofd__menu">
          {MENU.map((item) => (
            <button
              key={item.id}
              type="button"
              className="ofd__item"
              onClick={() => addItem(item)}
            >
              <span className="ofd__emoji" aria-hidden="true">{item.emoji}</span>
              <span className="ofd__name">
                {item.name}
                <small>{money(item.price)}</small>
              </span>
              <span className="ofd__plus" aria-hidden="true">＋</span>
            </button>
          ))}
        </div>

        <div className="ofd__cart">
          {lines.length === 0 ? (
            <p className="ofd__empty">Tap a dish to start an order →</p>
          ) : (
            <ul className="ofd__lines">
              {lines.map((l) => (
                <li key={l.id}>
                  <span className="ofd__qty">{l.qty}×</span>
                  {l.name}
                  <span className="ofd__lineprice">{money(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="ofd__total">
            <span>Total</span>
            <b>{money(total)}</b>
          </div>
          <button
            type="button"
            className="ofd__send"
            onClick={handleSend}
            disabled={!order.length || stage !== 'building'}
          >
            {stage === 'building' ? 'Send to kitchen →' : 'Order sent ✓'}
          </button>
        </div>
      </div>

      {/* Flight path */}
      <div className={`ofd__flight ${stage !== 'building' ? 'is-live' : ''}`} aria-hidden="true">
        <span className="ofd__spark" />
      </div>

      {/* Kitchen board */}
      <div className="ofd__panel ofd__kitchen">
        <div className="ofd__bar ofd__bar--dark">
          <span className="ofd__dots"><i /><i /><i /></span>
          <span className="ofd__title">Kitchen board</span>
          <span className={`ofd__live ${stage !== 'building' ? 'on' : ''}`}>● live</span>
        </div>

        <div className="ofd__tickets">
          {stage === 'building' ? (
            <div className="ofd__waiting">
              <span className="ofd__radar" />
              Waiting for orders…
            </div>
          ) : (
            <div className={`ticket ticket--${stage}`}>
              <div className="ticket__head">
                <span className="ticket__no">#{orderNo}</span>
                <span className={`ticket__chip chip--${stage}`}>{stageLabel[stage]}</span>
              </div>
              <ul className="ticket__items">
                {lines.map((l) => (
                  <li key={l.id}>
                    <span>{l.qty}×</span> {l.name}
                  </li>
                ))}
              </ul>
              <div className="ticket__bar">
                <span className="ticket__fill" />
              </div>
            </div>
          )}
        </div>

        {/* Receipt printer */}
        <div className={`ofd__printer ${done ? 'is-printing' : ''}`}>
          <div className="ofd__printer-slot" />
          <div className="ofd__receipt" aria-hidden={!done}>
            <b>Your Café</b>
            <span>Order #{orderNo}</span>
            {lines.map((l) => (
              <span key={l.id}>{l.qty}× {l.name}</span>
            ))}
            <span className="ofd__receipt-total">TOTAL {money(total)}</span>
            <span className="ofd__receipt-cut">✽ pickup ready ✽</span>
          </div>
        </div>
      </div>

      {done && (
        <button type="button" className="ofd__again" onClick={reset}>
          ↻ Run it again
        </button>
      )}
    </div>
  );
}
