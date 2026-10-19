import yaml from "js-yaml";
import { HtmlBasePlugin } from "@11ty/eleventy";
import { pickLoc } from "./src/_lib/loc.js";

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
    return pickLoc(obj, field, this.ctx.locale.code);
  });
  eleventyConfig.addFilter("paragraphs", (text) =>
    String(text || "").split(/\n+/).map((s) => s.trim()).filter(Boolean)
  );
  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/10th-conference/",
  };
}
