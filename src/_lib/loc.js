export function pickLoc(obj, field, code) {
  const tw = (obj && obj[field + "TW"]) || "";
  const en = (obj && obj[field + "EN"]) || "";
  return code === "tw" ? tw || en : en || tw;
}
