export function pickLoc(obj, field, code) {
  const tw = (obj && obj[field + "TW"]) || "";
  const en = (obj && obj[field + "EN"]) || "";
  return code === "tw" ? tw || en : en || tw;
}

export function formatAffiliation(obj, code) {
  const org = String(pickLoc(obj, "org", code)).trim();
  const title = String(pickLoc(obj, "title", code)).trim();
  if (!org || !title) return org || title;
  return code === "tw" ? org + title : `${title}, ${org}`;
}
