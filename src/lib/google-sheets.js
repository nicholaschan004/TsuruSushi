const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const memCache = {};

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

/**
 * Convert a Google Drive sharing link to a direct image URL.
 * Accepts any of these formats:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/open?id=FILE_ID
 *   https://lh3.googleusercontent.com/d/FILE_ID  (already direct — returned as-is)
 * Non-Drive URLs are returned unchanged.
 */
export function toDirectImageUrl(url) {
    if (!url || typeof url !== "string") return url;
    const trimmed = url.trim();

    // Already a direct googleusercontent link
    if (trimmed.includes("lh3.googleusercontent.com")) return trimmed;

    // Format: /file/d/FILE_ID/...
    const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;

    // Format: open?id=FILE_ID
    const openMatch = trimmed.match(/drive\.google\.com\/open\?id=([^&]+)/);
    if (openMatch) return `https://lh3.googleusercontent.com/d/${openMatch[1]}`;

    return trimmed;
}

/**
 * Preload an image so the browser caches it for instant display.
 */
export function preloadImage(url) {
    if (!url) return;
    const img = new Image();
    img.src = url;
}

/**
 * Preload an array of image URLs in parallel.
 */
export function preloadImages(urls) {
    urls.forEach((url) => preloadImage(url));
}

/**
 * Generate a short localStorage key from a sheet URL.
 */
function storageKey(sheetUrl) {
    // Use gid or last segment as key
    const match = sheetUrl.match(/gid=(\d+)/);
    return `tsuru_sheet_${match ? match[1] : "default"}`;
}

/**
 * Fetch a published Google Sheet as CSV, parse it, and return rows.
 * Uses a two-tier cache:
 *   1. In-memory (instant, lost on page reload)
 *   2. localStorage (survives reloads, 5-minute TTL)
 * The sheet is always re-fetched in the background to stay fresh.
 */
export async function fetchSheet(sheetUrl) {
    const now = Date.now();

    // Tier 1: in-memory cache (instant)
    if (memCache[sheetUrl] && now - memCache[sheetUrl].time < CACHE_DURATION) {
        return memCache[sheetUrl].data;
    }

    // Tier 2: localStorage cache (survives reload)
    const key = storageKey(sheetUrl);
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (now - parsed.time < CACHE_DURATION) {
                // Populate memory cache from localStorage
                memCache[sheetUrl] = { data: parsed.data, time: parsed.time };
                // Refresh in background silently
                refreshSheet(sheetUrl, key).catch(() => {});
                return parsed.data;
            }
        }
    } catch (_e) {
        // localStorage unavailable or corrupt — continue to fetch
    }

    // No cache — fetch fresh
    return refreshSheet(sheetUrl, key);
}

/**
 * Fetch fresh data from the sheet and update both caches.
 */
async function refreshSheet(sheetUrl, key) {
    const now = Date.now();
    const res = await fetch(sheetUrl);
    if (!res.ok) throw new Error("Failed to fetch sheet");
    const text = await res.text();
    if (text.includes("<!DOCTYPE html>")) throw new Error("Sheet not published");
    const data = parseCSV(text);

    // Update both caches
    memCache[sheetUrl] = { data, time: now };
    try {
        localStorage.setItem(key, JSON.stringify({ data, time: now }));
    } catch (_e) {
        // localStorage full or unavailable — ignore
    }

    return data;
}
