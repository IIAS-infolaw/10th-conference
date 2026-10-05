# IIAS Conference Site

Built with Eleventy 3, Nunjucks and Pico CSS.

## Build

```sh
npm ci
npm run build   # output in _site/
npm run dev     # http://localhost:8080/10th-conference/
```

## Updating

Agenda, speakers and sessions are generated at build time from a Google Sheet. One-off facts (name, date, venue, registration link, about/directions text) live in `src/_data/site.yaml`.

- Live data is fetched on every build (cached 1 hour in `.cache/`).
- If the fetch fails, or `SHEET_OFFLINE=1` is set, the build uses the committed `src/_data/snapshot.json`.
- Refresh the snapshot with `npm run sync` and commit it.

## Deploy

Pushes to `develop` build and publish via GitHub Actions automatically.

## AI Disclosure

Large language models were used in the scaffolding of this website. The overall architecture, the technical decisions, and the content of this website were all decided by a human.
