import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BACKUP_DIR = path.join(ROOT, "image_originals_backup");

// Bucket sizes derived from actual rendered container width across all
// pages that reference each file (see grid-cols / max-width context).
const HERO = { width: 1920, height: 1080, quality: 78 };
const PROFILE = { width: 1200, height: 1500, quality: 80 }; // portrait, half-width columns
const TWO_COL = { width: 1400, height: 1050, quality: 78 }; // half-width landscape
const THREE_COL = { width: 900, height: 600, quality: 78 }; // 3-4 col grid cards
const THUMB = { width: 800, height: 600, quality: 80 }; // coach headshot thumbnails

const FILES = [
  // backgrounds
  ["public/images/backgrounds/About us.jpg", HERO],
  ["public/images/backgrounds/Teamphoto.jpg", HERO],
  ["public/images/backgrounds/Coach and team.jpeg", PROFILE],
  ["public/images/backgrounds/C5C294E1-8716-448A-8AF3-D3344A426B5B.JPG", TWO_COL],
  ["public/images/backgrounds/C16E2015-B516-4C26-AB11-F205D210908F.JPG", THREE_COL],
  ["public/images/backgrounds/E643E6EF-FF1D-4149-928B-985FE3F29946.JPG", THREE_COL],
  ["public/images/backgrounds/BD7C0CD2-341D-4487-B508-EA3FFE7A34EB.JPG", THREE_COL],
  ["public/images/backgrounds/IMG_1167.JPG", THREE_COL],
  ["public/images/backgrounds/3AF9B34A-0553-4C7E-A957-7963D470D43B.JPG", THREE_COL],
  ["public/images/backgrounds/IMG_1343.JPG", THREE_COL],
  ["public/images/backgrounds/D559B2BE-44BA-4A5D-9671-DA0D2154386E.JPG", THREE_COL],
  ["public/images/backgrounds/Arda 2 .jpg", THREE_COL],
  ["public/images/backgrounds/IMG_1317.JPG", THREE_COL],
  ["public/images/backgrounds/IMG_1349.JPG", THREE_COL],
  // coaches
  ["public/images/coaches/Coach 5.jpeg", PROFILE],
  ["public/images/coaches/Coach 1.jpeg", THUMB],
  ["public/images/coaches/Coach 2.jpeg", THUMB],
  ["public/images/coaches/Coach3.jpeg", THUMB],
  ["public/images/coaches/Coach 6.jpeg", THUMB],
  ["public/images/coaches/Coach 4.jpeg", THUMB],
];

async function main() {
  await fs.mkdir(path.join(BACKUP_DIR, "backgrounds"), { recursive: true });
  await fs.mkdir(path.join(BACKUP_DIR, "coaches"), { recursive: true });

  let totalBefore = 0;
  let totalAfter = 0;

  for (const [rel, bucket] of FILES) {
    const srcPath = path.join(ROOT, rel);
    const stat = await fs.stat(srcPath);
    totalBefore += stat.size;

    const parsed = path.parse(rel);
    const outPath = path.join(ROOT, parsed.dir, `${parsed.name}.webp`);
    const backupPath = path.join(
      BACKUP_DIR,
      rel.startsWith("public/images/backgrounds") ? "backgrounds" : "coaches",
      parsed.base
    );

    await sharp(srcPath)
      .rotate() // respect EXIF orientation before resizing
      .resize({ width: bucket.width, height: bucket.height, fit: "inside", withoutEnlargement: true })
      .webp({ quality: bucket.quality })
      .toFile(outPath);

    const outStat = await fs.stat(outPath);
    totalAfter += outStat.size;

    await fs.copyFile(srcPath, backupPath);
    await fs.rm(srcPath);

    console.log(
      `${rel} -> ${path.relative(ROOT, outPath)}  ${(stat.size / 1024 / 1024).toFixed(2)}MB -> ${(outStat.size / 1024).toFixed(0)}KB`
    );
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`
  );
}

main();
