// Renders a screenshot inside a minimal CSS device frame (phone / tablet /
// desktop). Real screenshots live in src/assets/screenshots/ and are picked up
// automatically: drop a file with the expected name in that folder and it
// replaces the placeholder — no code change needed. Until then, an
// aspect-correct placeholder block with a muted label is shown.

// Eagerly map every image that actually exists in the screenshots folder.
// When the folder is empty this is simply {}, so the build still succeeds.
const modules = import.meta.glob(
  '../assets/screenshots/*.{png,jpg,jpeg,webp,svg}',
  { eager: true, query: '?url', import: 'default' }
);

const screenshots = {};
for (const path in modules) {
  const filename = path.split('/').pop();
  screenshots[filename] = modules[path];
}

const FRAME = {
  phone: { device: 'device--phone', ph: 'ph--phone' },
  tablet: { device: 'device--tablet', ph: 'ph--tablet' },
  desktop: { device: 'device--desktop', ph: 'ph--desktop' },
};

export default function DeviceFrame({
  type = 'phone',
  src,
  label,
  alt,
  light = false,
  className = '',
}) {
  const frame = FRAME[type] || FRAME.phone;
  const realSrc = src ? screenshots[src] : undefined;

  return (
    <div
      className={`device ${frame.device} ${light ? 'device--light' : ''} ${className}`.trim()}
    >
      <div className="device__screen">
        {realSrc ? (
          <img src={realSrc} alt={alt || label} loading="lazy" />
        ) : (
          <div className={`ph ${frame.ph}`} role="img" aria-label={alt || label}>
            <span className="ph__label">{label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
