import fs from "node:fs";
import { fetchSheets } from "../_lib/sheet.js";

const SPEAKER_IMG_DIR = new URL("../img/speakers/", import.meta.url);
const DEFAULT_PHOTO = "/img/speakers/default.jpg";
const locales = JSON.parse(fs.readFileSync(new URL("./locales.json", import.meta.url), "utf8"));

function slugify(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function photoFor(slug) {
  return slug && fs.existsSync(new URL(`${slug}.jpg`, SPEAKER_IMG_DIR))
    ? `/img/speakers/${slug}.jpg`
    : DEFAULT_PHOTO;
}

export default async function () {
  const sheets = await fetchSheets();

  const sessions = sheets["場次"].map((r) => ({
    number: r["編號"],
    nameTW: r["名稱"],
    nameEN: r["Name"],
    moderatorRaw: r["主持人"],
  }));

  const people = sheets["講者"].map((r) => {
    const slug = slugify(r["Name"]);
    return {
      key: r["姓名"],
      nameTW: r["姓名"],
      nameEN: r["Name"],
      orgTW: r["服務單位"],
      orgEN: r["Organization"],
      titleTW: r["職稱"],
      titleEN: r["Title"],
      bioTW: r["簡介"],
      bioEN: r["Biography"],
      url: r["連結"],
      slug,
      photo: photoFor(slug),
      appearances: [],
    };
  });
  const index = new Map(people.map((p) => [p.key, p]));

  const noSlug = people.filter((p) => !p.slug).map((p) => p.nameTW);
  if (noSlug.length) console.warn("[program] no English name, no speaker page:", noSlug.join(", "));

  const speakerPages = [];
  for (const locale of locales) {
    for (const person of people) {
      if (person.slug) speakerPages.push({ locale, person });
    }
  }

  function resolvePerson(raw) {
    const key = (raw || "").trim();
    if (!key) return null;
    if (index.has(key)) return index.get(key);
    console.warn("[program] unknown person, using bare name:", key);
    return {
      key, nameTW: key, nameEN: key, orgTW: "", orgEN: "", titleTW: "", titleEN: "",
      bioTW: "", bioEN: "", url: "", slug: "", photo: DEFAULT_PHOTO, appearances: [],
    };
  }

  for (const s of sessions) {
    s.moderator = resolvePerson(s.moderatorRaw);
    delete s.moderatorRaw;
  }
  const sessionIndex = new Map(sessions.map((s) => [s.number, s]));

  const blocks = [];
  const sessionBlocks = new Map();
  for (const r of sheets["議程表"]) {
    const startsAt = r["開始時間"];
    const endsAt = r["結束時間"];
    const type = r["類型"];
    const number = r["場次"];

    if (type !== "議程" || number === "") {
      blocks.push({ kind: "simple", type, startsAt, endsAt, titleTW: r["題目"], titleEN: r["Topic"] });
      continue;
    }

    let block = sessionBlocks.get(number);
    if (!block) {
      let session = sessionIndex.get(number);
      if (!session) {
        console.warn("[program] unknown session number:", number);
        session = { number, nameTW: number, nameEN: "", moderator: null };
      }
      block = { kind: "session", number, session, startsAt, endsAt, talks: [], discussants: [] };
      sessionBlocks.set(number, block);
      blocks.push(block);
    }
    const talk = {
      titleTW: r["題目"],
      titleEN: r["Topic"],
      speakers: [r["報告人1"], r["報告人2"]].map(resolvePerson).filter(Boolean),
      paperUrl: r["文章連結"],
    };
    block.talks.push(talk);
    const discussant = resolvePerson(r["評論人"]);
    if (discussant && !block.discussants.some((d) => d.key === discussant.key)) {
      block.discussants.push(discussant);
    }
    if (startsAt < block.startsAt) block.startsAt = startsAt;
    if (endsAt > block.endsAt) block.endsAt = endsAt;

    for (const p of talk.speakers) {
      p.appearances.push({ role: "speaker", blockNumber: number, titleTW: talk.titleTW, titleEN: talk.titleEN });
    }
  }

  for (const b of sessionBlocks.values()) {
    const at = { blockNumber: b.number, titleTW: b.session.nameTW, titleEN: b.session.nameEN };
    if (b.session.moderator) b.session.moderator.appearances.push({ role: "moderator", ...at });
    for (const d of b.discussants) d.appearances.push({ role: "discussant", ...at });
  }

  return { sessions, people, blocks, speakerPages };
}
