# AGENTS.md

Static personal/resume site served by **GitHub Pages** from the repo root.
Custom domain `ronanrodrigo.dev` (see `CNAME`). No build step, no package
manager, no CI, no tests — push to `master` deploys.

History is rewritten regularly (force-push). Don't assume commit SHAs persist.

## File roles

- `index.html` — the single-page resume. This is the only "real" page; nearly
  all edits land here.
- Top-level `*.html` stubs (except `index.html`, `live.html`, `univille.html`)
  are **meta-refresh redirects** to external profiles — e.g. `github.html` →
  github.com/ronanrodrigo, `telegram.html` → t.me/ronanrodrigo. Each backs a
  path like `ronanrodrigo.dev/<slug>`. They are intentionally bare (no JS, no
  CSS, no analytics). **Do not add the gtag snippet to these stubs** — that's
  a deliberate change from the old site.
- `live.html` — "Talk to Ronan" channel-picker page. Standalone, links to the
  redirect stubs plus native `facetime:` / `imessage:` URIs.
- `univille.html` — standalone resources list (`lang="pt-BR"`). Standalone page
  for a lecture; not part of the resume.
- `slack/ios.html` and `slack.html` are **duplicates** of the same Slack
  redirect. If you edit one, update the other. The duplicate is intentional
  (different link targets historically); do not delete without checking.
- `.well-known/discord` — Discord domain-verification token. Leave as-is.
- `sitemap.xml` lists only `/`, `/live`, `/univille`. The redirect stubs are
  intentionally omitted — keep it that way when adding/removing pages.

## Styles & JS

- **`styles.css` is the one stylesheet**, shared by `index.html`, `live.html`,
  `univille.html`. It defines CSS design tokens at `:root` and light-theme
  overrides under `[data-theme="light"]`. Default theme is `dark` (set on
  `<html data-theme="dark">` in each page).
- Do not assume `prefers-color-scheme` — theme is explicit via `data-theme`,
  persisted to `localStorage['theme']` and toggled by the button in `main.js`.
- `main.js` hooks specific element IDs/classes: `#themeToggle`, `#year`,
  `#navbar`, and runs an `IntersectionObserver` fade-in on `.timeline-item` and
  `.publications-list li`. New animated sections must be registered in
  `main.js` or they won't animate.
- Google Analytics `gtag` id `UA-140410646-1` is embedded inline in `index.html`,
  `live.html`, and `univille.html`. Preserve it when editing those three.
  Redirect stubs do **not** include it.
- Fonts: Inter + JetBrains Mono, loaded from Google Fonts CDN inline in each
  page `<head>`. No local font files.
- `favicon.svg` is an emoji SVG (`🧑‍💻`). PNG/ico favicons also committed.

## Conventions / gotchas

- HTML is hand-rolled, no build, no templating. Copy the `<head>`/`<style>`
  block from an existing standalone page when adding a new page.
- **No `vercel.json` / no Vercel config.** It was explicitly removed (commit
  `3d5d504`) because GitHub Pages doesn't support it. Don't reintroduce.
- The `.gitignore` is empty/absent in the current tree after the force-push —
  don't assume old ignore rules apply.
- There is no `.nojekyll`: by default GitHub Pages runs Jekyll. Plain HTML still
  works, but files starting with `_` would be dropped — avoid that prefix for
  new assets.
- Branch is `master` (not `main`). Remotes: `origin/master`, `origin/temp`.

## How to verify

No automated checks exist. To verify changes, push to `master` (or a branch)
and load `https://ronanrodrigo.dev/...` after Pages rebuilds. There is no local
preview command configured — open the HTML files directly in a browser if
needed.