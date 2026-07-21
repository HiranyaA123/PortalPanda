// Portal Panda mark: a geometric panda face framed by a glowing "portal" ring.
// The gradient id is suffixed so multiple instances on one page don't collide.
let uid = 0;

export default function Logo({ size = 34, className = '' }) {
  const gid = `pp-grad-${(uid += 1)}`;
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
        <linearGradient id={gid} x1="4" y1="6" x2="44" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6C4DFF" />
          <stop offset="0.55" stopColor="#A24BFF" />
          <stop offset="1" stopColor="#FF6B4A" />
        </linearGradient>
      </defs>

      {/* Portal ring */}
      <circle cx="24" cy="24" r="21" stroke={`url(#${gid})`} strokeWidth="3.2" />

      {/* Ears */}
      <circle cx="13.5" cy="12.5" r="5.4" fill="#0B0B12" />
      <circle cx="34.5" cy="12.5" r="5.4" fill="#0B0B12" />

      {/* Face */}
      <circle cx="24" cy="25" r="13.2" fill="#0B0B12" />

      {/* Eye patches */}
      <ellipse cx="18.7" cy="23.2" rx="3.5" ry="4.4" transform="rotate(-18 18.7 23.2)" fill="#fff" />
      <ellipse cx="29.3" cy="23.2" rx="3.5" ry="4.4" transform="rotate(18 29.3 23.2)" fill="#fff" />
      <circle cx="19.2" cy="23.8" r="1.5" fill="#0B0B12" />
      <circle cx="28.8" cy="23.8" r="1.5" fill="#0B0B12" />

      {/* Nose + smile */}
      <path d="M21.5 29.5c1.4 1.6 3.6 1.6 5 0" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="24" cy="28" r="1.5" fill="#fff" />
    </svg>
  );
}
