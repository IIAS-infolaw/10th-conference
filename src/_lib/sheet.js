import fs from "node:fs";
import EleventyFetch from "@11ty/eleventy-fetch";
import { parse } from "csv-parse/sync";

export const SHEET_ID = "1ET9GVj0-Yt4ihhmOnU-9r2QhjnyG13dY-xLWBUkrmQc";
export const SHEET_NAMES = ["議程表", "講者", "場次"];
export const SNAPSHOT_PATH = new URL("../_data/snapshot.json", import.meta.url);

export function sheetUrl(name) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`;
}

export function parseCsv(text) {
  return parse(text, { columns: true, skip_empty_lines: true, bom: true, trim: true });
}

export async function fetchLive(duration) {
  const out = {};
  for (const name of SHEET_NAMES) {
    const text = await EleventyFetch(sheetUrl(name), { duration, type: "text", directory: ".cache" });
    out[name] = parseCsv(text);
  }
  return out;
}

export async function fetchSheets() {
  let reason;
  if (process.env.SHEET_OFFLINE === "1") {
    reason = "SHEET_OFFLINE=1";
  } else {
    try {
      return await fetchLive("1h");
    } catch (e) {
      reason = e.message;
    }
  }
  if (!fs.existsSync(SNAPSHOT_PATH)) {
    throw new Error(`[sheet] no live data (${reason}) and no snapshot at src/_data/snapshot.json`);
  }
  console.warn("[sheet] using committed snapshot:", reason);
  return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, "utf8"));
}
