#!/usr/bin/env node

/**
 * sync-sheet-images.mjs
 *
 * Fetches all Google Sheets that contain image columns, downloads every
 * referenced Google Drive image into public/sheets-images/, and writes
 * a manifest (src/data/sheet-images.json) that maps original URLs to
 * local paths.
 *
 * Run:  node scripts/sync-sheet-images.mjs
 * Or:   npm run sync-images
 */

import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

// ─── Config ──────────────────────────────────────────────────────────────────

const SHEETS = [
  {
    name: "hero",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzAu9nbAJtnbgol4C2LNlNh3HyxJs84W8mfVEtz_r44KzApHlOSFQdzdD_a_5nH7APxsWgu66RWtER/pub?gid=294905546&single=true&output=csv",
    imageColumns: ["image", "image_url"],
    // The first image of this sheet is also copied to public/hero-default.jpg
    // so the hero's initial paint is the real photo (not a broken placeholder).
    heroDefault: true,
  },
  {
    name: "menu_carousel",
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzAu9nbAJtnbgol4C2LNlNh3HyxJs84W8mfVEtz_r44KzApHlOSFQdzdD_a_5nH7APxsWgu66RWtER/pub?gid=1217918855&single=true&output=csv",
    imageColumns: ["image", "image_url"],
  },
];

const ROOT = path.resolve(import.meta.dirname, "..");
const IMAGE_DIR = path.join(ROOT, "public", "sheets-images");
const MANIFEST_PATH = path.join(ROOT, "src", "data", "sheet-images.json");
const HERO_DEFAULT_PATH = path.join(ROOT, "public", "hero-default.jpg");

// ─── CSV Parser ──────────────────────────────────────────────────────────────

function parseCSVLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      values.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  values.push(current);
  return values;
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((h, i) => {
      row[h.trim().toLowerCase().replace(/\s+/g, "_")] = (values[i] || "").trim();
    });
    return row;
  }).filter((row) => Object.values(row).some((v) => v));
}

// ─── Google Drive URL → direct download URL ─────────────────────────────────

function toDirectUrl(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Already a direct googleusercontent link
  if (trimmed.includes("lh3.googleusercontent.com")) return trimmed;

  // Format: /file/d/FILE_ID/...
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;

  // Format: open?id=FILE_ID
  const openMatch = trimmed.match(/drive\.google\.com\/open\?id=([^&]+)/);
  if (openMatch) return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;

  // Other URL (e.g. already an https image)
  if (trimmed.startsWith("http")) return trimmed;

  return null;
}

/** Extract a stable ID from a Google Drive URL for use as filename */
function extractFileId(url) {
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  // Hash the URL as fallback
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash + url.charCodeAt(i)) | 0;
  }
  return `img_${Math.abs(hash).toString(36)}`;
}

// ─── Image downloader ────────────────────────────────────────────────────────

async function downloadImage(url, destPath) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);

  // Determine extension from content-type
  const contentType = res.headers.get("content-type") || "";
  let ext = ".jpg";
  if (contentType.includes("png")) ext = ".png";
  else if (contentType.includes("webp")) ext = ".webp";
  else if (contentType.includes("gif")) ext = ".gif";

  const finalPath = destPath.replace(/\.[^.]+$/, ext);

  const fileStream = fs.createWriteStream(finalPath);
  await pipeline(Readable.fromWeb(res.body), fileStream);

  return { finalPath, ext };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🖼️  Syncing sheet images...\n");

  // Ensure directories exist
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });

  // Load existing manifest if it exists (for incremental updates)
  let manifest = {};
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
  } catch {
    // First run
  }

  let downloaded = 0;
  let skipped = 0;
  let errors = 0;
  let heroSourceFile = null;

  for (const sheet of SHEETS) {
    console.log(`📋 Fetching sheet: ${sheet.name}`);
    let csv;
    try {
      const res = await fetch(sheet.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      csv = await res.text();
      if (csv.includes("<!DOCTYPE html>")) throw new Error("Sheet not published");
    } catch (err) {
      console.error(`   ❌ Failed to fetch sheet "${sheet.name}": ${err.message}`);
      errors++;
      continue;
    }

    const rows = parseCSV(csv);
    console.log(`   Found ${rows.length} rows`);

    for (const row of rows) {
      for (const col of sheet.imageColumns) {
        const rawUrl = row[col];
        const directUrl = toDirectUrl(rawUrl);
        if (!directUrl) continue;

        // Already downloaded?
        if (manifest[directUrl]) {
          const localFile = path.join(ROOT, "public", manifest[directUrl]);
          if (fs.existsSync(localFile)) {
            if (sheet.heroDefault && !heroSourceFile) heroSourceFile = localFile;
            skipped++;
            continue;
          }
        }

        const fileId = extractFileId(directUrl);
        const tempDest = path.join(IMAGE_DIR, `${fileId}.jpg`);

        try {
          const { finalPath } = await downloadImage(directUrl, tempDest);
          const localPath = "/sheets-images/" + path.basename(finalPath);
          manifest[directUrl] = localPath;

          if (sheet.heroDefault && !heroSourceFile) heroSourceFile = finalPath;

          // Also map the raw Google Drive URL if different from direct
          const rawDirect = toDirectUrl(rawUrl);
          if (rawDirect && rawDirect !== directUrl) {
            manifest[rawDirect] = localPath;
          }
          // Map the raw URL too
          if (rawUrl && rawUrl.trim()) {
            manifest[rawUrl.trim()] = localPath;
          }

          console.log(`   ✅ ${path.basename(finalPath)} ← ${fileId}`);
          downloaded++;
        } catch (err) {
          console.error(`   ❌ Failed to download ${fileId}: ${err.message}`);
          errors++;
        }
      }
    }
  }

  // Keep public/hero-default.jpg in sync with the live hero image so the
  // hero's first paint shows the real photo instead of a broken placeholder.
  if (heroSourceFile && fs.existsSync(heroSourceFile)) {
    fs.copyFileSync(heroSourceFile, HERO_DEFAULT_PATH);
    console.log(`\n🌅 hero-default.jpg ← ${path.basename(heroSourceFile)}`);
  }

  // Write manifest
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");

  console.log(`\n✨ Done! ${downloaded} downloaded, ${skipped} skipped, ${errors} errors`);
  console.log(`   Manifest: ${path.relative(ROOT, MANIFEST_PATH)}`);
  console.log(`   Images:   ${path.relative(ROOT, IMAGE_DIR)}/`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
