export default {
  layout: "base.njk",
  pagination: { data: "locales", size: 1, alias: "locale" },
  eleventyComputed: {
    permalink: (data) => `/${data.locale.prefix}${data.slug}`,
    L: (data) => data.i18n[data.locale.code],
    altLocale: (data) => data.locales.find((l) => l.code !== data.locale.code),
    altUrl: (data) => `/${data.locales.find((l) => l.code !== data.locale.code).prefix}${data.slug.replace(/index\.html$/, "")}`,
  },
};
