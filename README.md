# Personal website

Static site for GitHub Pages. No build step.

## Structure

```
index.html
publish.bat
open-site.bat
assets/
  css/style.css
  js/main.js
  img/
.nojekyll
.gitignore
```

## Deploy

1. Push this folder to a GitHub repo (`<username>.github.io` for a root URL).
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder.

## Scripts (Windows)

- `publish.bat` does everything: installs GitHub CLI if needed, logs you in, creates the `<username>.github.io` repo, commits, pushes and turns on Pages. Optional message: `publish.bat "my message"`.
- `open-site.bat` opens the live GitHub Pages URL in your browser.
