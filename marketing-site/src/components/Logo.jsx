import { useId } from 'react';

// CentralPass mark: a central hub with six spokes radiating to system nodes —
// a compact version of the connected system the platform is built around.

const NODES = [
  [24, 8],
  [37.9, 16],
  [37.9, 32],
  [24, 40],
  [10.1, 32],
  [10.1, 16],
];

export default function Logo({ size = 34, className = '' }) {
  const gid = `cp-grad-${useId().replace(/:/g, '')}`;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6C4DFF" />
          <stop offset="0.55" stopColor="#A24BFF" />
          <stop offset="1" stopColor="#FF6B4A" />
        </linearGradient>
      </defs>

      {/* spokes */}
      {NODES.map(([x, y]) => (
        <line key={`${x}-${y}`} x1="24" y1="24" x2={x} y2={y} stroke={`url(#${gid})`} strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
      ))}

      {/* outer nodes */}
      {NODES.map(([x, y]) => (
        <circle key={`n-${x}-${y}`} cx={x} cy={y} r="3.1" fill="#0b0b12" stroke={`url(#${gid})`} strokeWidth="1.8" />
      ))}

      {/* central hub */}
      <circle cx="24" cy="24" r="6.6" fill={`url(#${gid})`} />
      <circle cx="24" cy="24" r="2.4" fill="#0b0b12" />
    </svg>
  );
}
