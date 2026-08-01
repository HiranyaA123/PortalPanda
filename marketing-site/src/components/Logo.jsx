// Intrinsic dimensions are declared so each logo reserves its space before the
// asset decodes. The header is the first thing painted, so a logo that pops in
// shifts everything below it.
const ASSETS = {
  mark: { src: '/centralpass-mark.svg', width: 1024, height: 1024 },
  wordmark: { src: '/brand/centralpass-wordmark.png', width: 640, height: 111 },
  lockup: { src: '/centralpass-logo.svg', width: 4000, height: 1000 },
};

export default function Logo({ variant = 'brand', className = '' }) {
  if (variant === 'lockup' || variant === 'mark') {
    const asset = ASSETS[variant];
    return (
      <img
        className={className}
        src={asset.src}
        width={asset.width}
        height={asset.height}
        alt=""
        aria-hidden="true"
      />
    );
  }

  return (
    <span className={`brand-lockup ${className}`.trim()} aria-hidden="true">
      <img
        className="brand-lockup__mark"
        src={ASSETS.mark.src}
        width={ASSETS.mark.width}
        height={ASSETS.mark.height}
        alt=""
      />
      <img
        className="brand-lockup__word"
        src={ASSETS.wordmark.src}
        width={ASSETS.wordmark.width}
        height={ASSETS.wordmark.height}
        alt=""
      />
    </span>
  );
}
