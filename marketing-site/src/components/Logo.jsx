// CentralPass mark: a central hub with six spokes radiating to system nodes.
// Drawn in ink with a burnt-red hub so it sits inside the editorial palette
// rather than fighting it — it inherits colour from the surrounding text.

const NODES = [
  [24, 8],
  [37.9, 16],
  [37.9, 32],
  [24, 40],
  [10.1, 32],
  [10.1, 16],
];

export default function Logo({ size = 30, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      {NODES.map(([x, y]) => (
        <line
          key={`s-${x}-${y}`}
          x1="24" y1="24" x2={x} y2={y}
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.42"
        />
      ))}

      {NODES.map(([x, y]) => (
        <circle
          key={`n-${x}-${y}`}
          cx={x} cy={y} r="2.9"
          fill="none" stroke="currentColor" strokeWidth="1.6"
        />
      ))}

      <circle cx="24" cy="24" r="6.4" fill="#a8371a" />
    </svg>
  );
}
