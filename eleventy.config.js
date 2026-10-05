import yaml from "js-yaml";
import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy({
    "node_modules/@picocss/pico/css/pico.classless.min.css": "css/pico.classless.min.css",
  });
  eleventyConfig.addFilter("timeRange", (a, b) => `${a}–${b}`); // U+2013
  eleventyConfig.addFilter("loc", function (obj, field) {
    const code = this.ctx.locale.code; // "tw" | "en"
    const tw = (obj && obj[field + "TW"]) || "";
    const en = (obj && obj[field + "EN"]) || "";
    return code === "tw" ? tw || en : en || tw;
  });
  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/10th-conference/",
  };
}
