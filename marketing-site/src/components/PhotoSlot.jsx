// A properly sized, styled slot for real venue photography.
//
// Drop a file into public/photos/ and pass `src` — the placeholder disappears
// and the image fills the same box, so the layout never shifts when photos
// arrive. Until then it renders as an intentional editorial plate rather than
// looking like a broken image.
export default function PhotoSlot({
  src,
  alt = '',
  ratio = '4 / 3',
  label = 'Photograph',
  caption,
  className = '',
}) {
  return (
    <figure className={`photo ${className}`.trim()}>
      <div className="photo__frame" style={{ aspectRatio: ratio }}>
        {src ? (
          <img src={src} alt={alt} loading="lazy" decoding="async" />
        ) : (
          <span className="photo__slot" role="img" aria-label={`${label} — image to be supplied`}>
            <span className="photo__mark" aria-hidden="true" />
            <span className="photo__label">{label}</span>
          </span>
        )}
      </div>
      {caption && <figcaption className="photo__caption">{caption}</figcaption>}
    </figure>
  );
}
