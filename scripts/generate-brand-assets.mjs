/**
 * Regenerates the brand icons from the supplied lockup.
 *
 * Source of truth: `public/images/brand/logo-local-organic-mart.png` (the
 * designer's file, untouched). Run with `node scripts/generate-brand-assets.mjs`
 * after replacing that file.
 *
 * The crest is a 105×102 crop of the 227×102 lockup; icons therefore upscale
 * it. That is acceptable at tab sizes (16–48px, downscaled) and at 180px,
 * and only soft at 512px. Do not "fix" it by redrawing the mark — replace the
 * source with a larger export when one exists.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "public/images/brand/logo-local-organic-mart.png");
const APP = path.join(ROOT, "src/app");

const IVORY = "#f4efe4";
const GOLD = "#c6a15b";

const crest = await sharp(SRC)
  .extract({ left: 0, top: 0, width: 105, height: 102 })
  .toBuffer();

/** Crest centred on an ivory tile, inset so the ribbon is not clipped. */
async function tile(size, inset = 0.1, palette = true) {
  const inner = Math.round(size * (1 - inset * 2));
  const art = await sharp(crest)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: "lanczos3",
    })
    .sharpen({ sigma: size >= 256 ? 0.7 : 0.9 })
    .png()
    .toBuffer();

  return sharp({
    // RGBA: the ICO container used for favicon.ico rejects RGB PNG entries.
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 244, g: 239, b: 228, alpha: 1 },
    },
  })
    .composite([
      {
        input: art,
        left: Math.round((size - inner) / 2),
        top: Math.round((size - inner) / 2),
      },
    ])
    // Palette PNGs are smaller, but an indexed PNG inside favicon.ico is
    // rejected by the build ("not in RGBA format"), so the ICO entries stay
    // truecolour+alpha.
    .png({ compressionLevel: 9, effort: 10, palette, colours: 192 })
    .toBuffer();
}

// App icons — Next picks these up from the app directory.
fs.writeFileSync(path.join(APP, "icon.png"), await tile(512, 0.09));
fs.writeFileSync(path.join(APP, "apple-icon.png"), await tile(180, 0.1));

// Open Graph card: ivory ground, lockup, one gold hairline.
const lockHeight = 260;
const lock = await sharp(SRC)
  .resize({ height: lockHeight, kernel: "lanczos3" })
  .sharpen({ sigma: 0.5 })
  .png()
  .toBuffer();
const lockMeta = await sharp(lock).metadata();
const frame = Buffer.from(
  `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
     <rect x="40" y="40" width="1120" height="550" fill="none" stroke="${GOLD}" stroke-opacity="0.55" stroke-width="1"/>
   </svg>`,
);
fs.writeFileSync(
  path.join(APP, "opengraph-image.png"),
  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: IVORY },
  })
    .composite([
      {
        input: lock,
        left: Math.round((1200 - lockMeta.width) / 2),
        top: Math.round((630 - lockHeight) / 2),
      },
      { input: frame, left: 0, top: 0 },
    ])
    .png()
    .toBuffer(),
);

// favicon.ico: PNG entries at 16, 32 and 48, replacing the framework default.
const icoSizes = [16, 32, 48];
const images = [];
for (const size of icoSizes) {
  images.push({ size, png: await tile(size, 0.08, false) });
}

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);

const entries = [];
let offset = 6 + images.length * 16;
for (const { size, png } of images) {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0); // width
  entry.writeUInt8(size, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  entries.push(entry);
  offset += png.length;
}

fs.writeFileSync(
  path.join(APP, "favicon.ico"),
  Buffer.concat([header, ...entries, ...images.map((image) => image.png)]),
);

console.log(
  "brand assets:",
  fs.statSync(path.join(APP, "icon.png")).size,
  fs.statSync(path.join(APP, "apple-icon.png")).size,
  fs.statSync(path.join(APP, "opengraph-image.png")).size,
  fs.statSync(path.join(APP, "favicon.ico")).size,
);
