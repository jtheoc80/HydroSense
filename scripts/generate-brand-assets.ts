/**
 * Generates brand assets:
 * 1. White knockout of horizontal logo (for dark backgrounds)
 * 2. Favicon (32x32)
 * 3. Apple touch icon (180x180)
 * 4. PWA icon (512x512)
 * 5. OG image (1200x630, Rice Blue bg, white logo, tagline)
 */

import sharp from "sharp";
import path from "path";

const BRAND_DIR = path.join(__dirname, "..", "public", "brand");
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const INK_800 = { r: 0, g: 36, b: 105 }; // #002469

/**
 * The source PNG has no alpha channel — it's a logo on a near-white
 * opaque background. We need to:
 * 1. Detect background pixels (near-white, high luminance)
 * 2. Make them fully transparent
 * 3. Turn remaining (logo) pixels pure white
 */
async function whiteKnockout() {
  const src = path.join(BRAND_DIR, "logo-horizontal-dark.png");
  const dest = path.join(BRAND_DIR, "logo-horizontal-light.png");

  const { data, info } = await sharp(src)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  // Background is near-white (R~253, G~255, B~254).
  // Any pixel where R+G+B > 740 (avg > 246) is background.
  const BG_THRESHOLD = 740;

  for (let i = 0; i < data.length; i += 4) {
    const sum = data[i] + data[i + 1] + data[i + 2];
    if (sum > BG_THRESHOLD) {
      // Background -> fully transparent
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    } else {
      // Logo pixel -> white, keep full opacity
      // For anti-aliased edge pixels (mid-range), scale alpha by darkness
      const brightness = sum / 3;
      // Darker pixels = more opaque, lighter pixels near edge = more transparent
      // Map brightness 0-246 to alpha 255-0
      const alpha = Math.round(255 * (1 - brightness / 246));
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = Math.min(255, Math.max(0, alpha));
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(dest);

  console.log(`White knockout: ${dest} (${info.width}x${info.height})`);
}

/**
 * Same background removal for the mark icon, producing a clean transparent version.
 */
async function cleanMark() {
  const src = path.join(BRAND_DIR, "logo-mark.png");
  const dest = path.join(BRAND_DIR, "logo-mark-clean.png");

  const { data, info } = await sharp(src)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  const BG_THRESHOLD = 740;
  for (let i = 0; i < data.length; i += 4) {
    const sum = data[i] + data[i + 1] + data[i + 2];
    if (sum > BG_THRESHOLD) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
    // Keep original colors for dark mark (used on light backgrounds)
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(dest);

  console.log(`Clean mark: ${dest} (${info.width}x${info.height})`);
}

async function generateFavicons() {
  const src = path.join(BRAND_DIR, "logo-mark-clean.png");

  // favicon.png (32x32)
  await sharp(src)
    .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(PUBLIC_DIR, "favicon.png"));
  console.log("Favicon: public/favicon.png (32x32)");

  // Apple touch icon (180x180, solid white bg for iOS)
  await sharp(src)
    .resize(152, 152, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 14, bottom: 14, left: 14, right: 14,
      background: { r: 255, g: 255, b: 255, alpha: 255 },
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toFile(path.join(PUBLIC_DIR, "apple-touch-icon.png"));
  console.log("Apple touch icon: public/apple-touch-icon.png (180x180)");

  // PWA icon (512x512)
  await sharp(src)
    .resize(460, 460, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 26, bottom: 26, left: 26, right: 26,
      background: { r: 255, g: 255, b: 255, alpha: 255 },
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toFile(path.join(PUBLIC_DIR, "icon.png"));
  console.log("PWA icon: public/icon.png (512x512)");
}

async function generateOgImage() {
  const logoSrc = path.join(BRAND_DIR, "logo-horizontal-light.png");

  const logo = await sharp(logoSrc)
    .resize(500, null, { fit: "inside" })
    .toBuffer();

  const logoMeta = await sharp(logo).metadata();
  const logoW = logoMeta.width || 500;
  const logoH = logoMeta.height || 125;

  const taglineSvg = Buffer.from(`
    <svg width="1200" height="80">
      <text x="600" y="50" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="32" font-style="italic" fill="#CBD5E1"
        letter-spacing="0.5">Stop leaving $600 a year on the table</text>
    </svg>
  `);

  const subtitleSvg = Buffer.from(`
    <svg width="1200" height="50">
      <text x="600" y="35" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="20" fill="#9AA8BF"
        letter-spacing="1">SMART HOME WATER DEFENSE | TEXAS</text>
    </svg>
  `);

  const logoLeft = Math.round((1200 - logoW) / 2);
  const logoTop = 170;

  await sharp({
    create: {
      width: 1200, height: 630, channels: 4,
      background: { r: INK_800.r, g: INK_800.g, b: INK_800.b, alpha: 255 },
    },
  })
    .composite([
      { input: logo, left: logoLeft, top: logoTop },
      { input: taglineSvg, left: 0, top: logoTop + logoH + 50 },
      { input: subtitleSvg, left: 0, top: logoTop + logoH + 130 },
    ])
    .png()
    .toFile(path.join(PUBLIC_DIR, "og-image.png"));

  console.log("OG image: public/og-image.png (1200x630)");
}

async function main() {
  await whiteKnockout();
  await cleanMark();
  await generateFavicons();
  await generateOgImage();
  console.log("\nAll brand assets generated.");
}

main().catch((err) => {
  console.error("Brand asset generation failed:", err);
  process.exit(1);
});
