import fs from "node:fs";
import { fetchLive, SNAPSHOT_PATH } from "../src/_lib/sheet.js";

const data = await fetchLive("0s");
fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(data, null, 2) + "\n");
console.log("snapshot written:", Object.entries(data).map(([k, v]) => `${k}=${v.length}`).join(" "));
