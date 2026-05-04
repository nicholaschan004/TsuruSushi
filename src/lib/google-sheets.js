const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = {};

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

export async function fetchSheet(sheetUrl) {
    const now = Date.now();
    if (cache[sheetUrl] && now - cache[sheetUrl].time < CACHE_DURATION) {
        return cache[sheetUrl].data;
    }

    const res = await fetch(sheetUrl);
    if (!res.ok) throw new Error("Failed to fetch sheet");
    const text = await res.text();
    if (text.includes("<!DOCTYPE html>")) throw new Error("Sheet not published");
    const data = parseCSV(text);
    cache[sheetUrl] = { data, time: now };
    return data;
}
