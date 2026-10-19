import { pickLoc } from "../_lib/loc.js";

export default {
  layout: "base.njk",
  pageKey: "speakers",
  pagination: { data: "program.speakerPages", size: 1, alias: "entry" },
  eleventyComputed: {
    locale: (data) => data.entry.locale,
    person: (data) => data.entry.person,
    L: (data) => data.i18n[data.entry.locale.code],
    altLocale: (data) => data.locales.find((l) => l.code !== data.entry.locale.code),
    permalink: (data) => `/${data.entry.locale.prefix}speakers/${data.entry.person.slug}/`,
    altUrl: (data) => `/${data.locales.find((l) => l.code !== data.entry.locale.code).prefix}speakers/${data.entry.person.slug}/`,
    pageTitle: (data) => pickLoc(data.entry.person, "name", data.entry.locale.code),
  },
};
