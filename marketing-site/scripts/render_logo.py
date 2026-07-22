"""Render the checked-in CentralPass SVG identity as production PNG assets."""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
INK = (11, 11, 18, 255)
VIOLET = (108, 77, 255, 255)
MAGENTA = (162, 75, 255, 255)
CORAL = (255, 107, 74, 255)
WHITE = (243, 242, 247, 255)


def mix(a, b, amount):
    return tuple(round(a[i] + (b[i] - a[i]) * amount) for i in range(4))


def gradient(size):
    axis = np.arange(size, dtype=np.float32)
    t = (axis[:, None] + axis[None, :]) / (size * 2)
    low = np.clip(t / 0.54, 0, 1)[..., None]
    high = np.clip((t - 0.54) / 0.46, 0, 1)[..., None]
    violet = np.array(VIOLET, dtype=np.float32)
    magenta = np.array(MAGENTA, dtype=np.float32)
    coral = np.array(CORAL, dtype=np.float32)
    rgba = np.where(
        (t <= 0.54)[..., None],
        violet + (magenta - violet) * low,
        magenta + (coral - magenta) * high,
    ).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def mark(size, dark_tile=False):
    scale = 4
    canvas_size = size * scale
    image = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    if dark_tile:
        tile = Image.new("RGBA", image.size, INK)
        tile_mask = Image.new("L", image.size, 0)
        ImageDraw.Draw(tile_mask).rounded_rectangle(
            (0, 0, canvas_size - 1, canvas_size - 1),
            radius=canvas_size * 0.24,
            fill=255,
        )
        image.alpha_composite(Image.composite(tile, Image.new("RGBA", image.size), tile_mask))

    unit = canvas_size / 512
    center = (256 * unit, 256 * unit)
    nodes = [
        (256 * unit, 76 * unit),
        (411.9 * unit, 166 * unit),
        (411.9 * unit, 346 * unit),
        (256 * unit, 436 * unit),
        (100.1 * unit, 346 * unit),
        (100.1 * unit, 166 * unit),
    ]
    mask = Image.new("L", image.size, 0)
    draw = ImageDraw.Draw(mask)
    for node in nodes:
        draw.line((center, node), fill=230, width=round(20 * unit))
    for x, y in nodes:
        r = 34 * unit
        draw.ellipse((x - r, y - r, x + r, y + r), outline=255, width=round(18 * unit))
    r = 72 * unit
    draw.ellipse((center[0] - r, center[1] - r, center[0] + r, center[1] + r), fill=255)
    image.alpha_composite(Image.composite(gradient(canvas_size), Image.new("RGBA", image.size), mask))

    ink = ImageDraw.Draw(image)
    for x, y in nodes:
        r = 25 * unit
        ink.ellipse((x - r, y - r, x + r, y + r), fill=INK)
    r = 26 * unit
    ink.ellipse((center[0] - r, center[1] - r, center[0] + r, center[1] + r), fill=INK)
    return image.resize((size, size), Image.Resampling.LANCZOS)


def logo():
    scale = 2
    width, height = 1840 * scale, 440 * scale
    image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    symbol = mark(400 * scale)
    image.alpha_composite(symbol, (10 * scale, 20 * scale))
    font_path = Path("C:/Windows/Fonts/arialbd.ttf")
    font = ImageFont.truetype(str(font_path), 188 * scale)
    draw = ImageDraw.Draw(image)
    draw.text((450 * scale, 105 * scale), "CentralPass", font=font, fill=WHITE, anchor="lm", stroke_width=0)
    return image.resize((1840, 440), Image.Resampling.LANCZOS)


def main():
    logo().save(PUBLIC / "centralpass-logo.png", optimize=True)
    mark(512).save(PUBLIC / "centralpass-mark.png", optimize=True)
    mark(512).save(PUBLIC / "centralpass-mark-512.png", optimize=True)
    mark(192).save(PUBLIC / "centralpass-mark-192.png", optimize=True)
    mark(180, dark_tile=True).save(PUBLIC / "apple-touch-icon.png", optimize=True)


if __name__ == "__main__":
    main()
