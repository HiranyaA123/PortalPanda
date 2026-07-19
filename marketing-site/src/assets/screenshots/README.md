# Screenshots

Drop real product screenshots into this folder using these **exact filenames**.
The site picks them up automatically (via `import.meta.glob` in
`src/components/DeviceFrame.jsx`) — no code changes needed. Until a file is
present, an aspect-correct placeholder block with a muted label is shown.

| Filename | What it shows | Frame | Aspect |
|---|---|---|---|
| `customer-menu-phone.png` | Customer site menu on a phone | phone | 9 : 19.5 |
| `customer-checkout-phone.png` | Checkout step on a phone | phone | 9 : 19.5 |
| `kitchen-board-tablet.png` | Staff dashboard order board on a tablet | tablet | 4 : 3 |
| `admin-menu-desktop.png` | Admin menu management on desktop | desktop | 16 : 10 |
| `admin-customers-desktop.png` | Admin customer list on desktop | desktop | 16 : 10 |
| `casestudy-hero.png` | Wide shot for the case-study teaser + page | desktop | 16 : 10 |

`.png`, `.jpg`, `.jpeg`, `.webp` and `.svg` are all supported. Match the target
aspect ratio so images aren't awkwardly cropped (they're rendered with
`object-fit: cover`).
