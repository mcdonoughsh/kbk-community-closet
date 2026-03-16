import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const inputPath = join(root, "src/app/favicon.png");
const outputPath = join(root, "src/app/favicon-white.png");

const { data, info } = await sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
for (let i = 0; i < data.length; i += channels) {
  data[i] = 255 - data[i];     // R
  data[i + 1] = 255 - data[i + 1]; // G
  data[i + 2] = 255 - data[i + 2]; // B
  // leave alpha (i + 3) unchanged
}

await sharp(data, { raw: { width, height, channels } })
  .png()
  .toFile(outputPath);

console.log("Written:", outputPath);
