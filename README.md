# Personal website

Static site for GitHub Pages. No build step.

## Structure

```
index.html
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
