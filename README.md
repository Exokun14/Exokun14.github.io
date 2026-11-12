# Personal website

![CI](https://github.com/Exokun14/Exokun14.github.io/actions/workflows/ci.yml/badge.svg)

Static site for GitHub Pages. No build step, no framework.

## Structure

```
index.html  projects.html  about.html
data/projects.js        all projects (add one entry = new slide, envelope and letter)
data/activity.json      written nightly by .github/workflows/activity.yml
assets/css  assets/js  assets/img
tests/  playwright.config.js   Playwright checks (run by CI on every push)
publish.bat  open-site.bat     Windows helpers
```

## Add a project

Add an object to the list in `data/projects.js`. Optional `"image": "assets/img/shot.jpg"` shows a screenshot instead of the painted scene.

## Scripts (Windows)

- `publish.bat` does everything: installs GitHub CLI if needed, logs you in, creates the `<username>.github.io` repo, commits, pulls, pushes and turns on Pages.
- `open-site.bat` opens the live GitHub Pages URL.
- `test.bat` starts a local test server and opens the site in your browser. `test.bat tests` runs the Playwright checks instead.

## Preview locally

The pages load JSON, so use a server instead of double-clicking: `npx http-server` or `python -m http.server`.
