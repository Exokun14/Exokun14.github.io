# Personal website

![CI](https://github.com/Exokun14/Exokun14.github.io/actions/workflows/ci.yml/badge.svg)

Static site for GitHub Pages. No build step, no framework.

## Structure

```
index.html  projects.html  about.html  notes.html  services.html
trail.html  gallery.html  playground.html  guestbook.html  404.html
                        Pages stay in the root so GitHub Pages URLs don't change.

data/
  site.js               text for About, Notes, trail log (trails), gallery (paintings, photos), guestbook repo
  projects.js           all projects (add one entry = new slide, scroll and letter)
  activity.json         written nightly by .github/workflows/activity.yml
assets/
  css/  js/  img/       styles, scripts, images
  Clarence-Joven-CV.pdf
tests/                  Playwright checks (run by CI on every push)
scripts/                Windows helpers: publish, open-site, test, backup, setup-counter
.github/workflows/      ci.yml (tests) and activity.yml (nightly activity feed)
playwright.config.js  package.json  site.webmanifest  favicon.ico  .nojekyll
```

## Hire me page

`services.html` reads `services`, `skills`, `timeline` and `learning` from `data/site.js`. No prices are shown. To show one, add `from: 'From $X'` to a service.

## Add a climb, a photo or a painting

- Climb: add an object at the top of `trails` in `data/site.js` (`date`, `name`, `tag`, `tough` 1 to 4, `note`, optional `photo`, `alt`, `masl`).
- Photo: add `{ src, alt, caption }` to `photos` in `data/site.js`. A Photos tab appears in the gallery.
- Painting: add an entry to `paintings` with `src`, `title`, `alt`, `group` (sets the filter tab) and `w`, `h` (image size in pixels).
- Guestbook: visitors sign by opening a GitHub issue titled `[Guestbook] ...` in the repo set in `guestbook`. Close an issue to remove it from the page. Issues must be enabled on the repo.

## Add a project

Add an object to the list in `data/projects.js`. Optional `"image": "assets/img/shot.jpg"` shows a screenshot instead of the painted scene.

## Scripts (Windows)

Run these from anywhere (double-click or from a terminal). They all work from the site root.

- `scripts\publish.bat` does everything: installs GitHub CLI if needed, logs you in, creates the `<username>.github.io` repo, commits, pulls, pushes and turns on Pages.
- `scripts\open-site.bat` opens the live GitHub Pages URL.
- `scripts\test.bat` starts a local test server and opens the site in your browser. `scripts\test.bat tests` runs the Playwright checks instead.
- `scripts\backup.bat` zips the site into `backups/` (git-ignored).
- `scripts\setup-counter.bat` switches on the GoatCounter visitor counter in `assets/js/stats.js`.

## Preview locally

The pages load JSON, so use a server instead of double-clicking: `npm start`, `npx http-server` or `python -m http.server`.
