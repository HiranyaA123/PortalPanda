const ASSETS = {
  mark: '/brand/centralpass-mark.png',
  wordmark: '/brand/centralpass-wordmark.png',
  lockup: '/brand/centralpass-lockup.png',
};

export default function Logo({ variant = 'brand', className = '' }) {
  if (variant === 'lockup') {
    return <img className={className} src={ASSETS.lockup} alt="" aria-hidden="true" />;
  }

  if (variant === 'mark') {
    return <img className={className} src={ASSETS.mark} alt="" aria-hidden="true" />;
  }

  return (
    <span className={`brand-lockup ${className}`.trim()} aria-hidden="true">
      <img className="brand-lockup__mark" src={ASSETS.mark} alt="" />
      <img className="brand-lockup__word" src={ASSETS.wordmark} alt="" />
    </span>
  );
}
