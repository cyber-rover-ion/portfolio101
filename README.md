# Jebin Pravinraj — Portfolio

A lightweight, responsive personal portfolio built with plain HTML, CSS, and JavaScript.

## Project files

- `index.html` — main portfolio page
- `style.css` — layout, visual styling, responsive rules, and motion
- `script.js` — navigation, scroll state, reveal effects, and pointer interactions
- `privacy.html` / `terms.html` — legal information pages
- `favicon.svg` — site icon

## Run locally

No build step or package installation is required. Open `index.html` in a browser, or serve this folder with any static HTTP server.

## Deploy

The repository is configured for Vercel's static-site hosting. Connect the repository to Vercel with the project root as the root directory. No framework preset, install command, or build command is required; serve the repository root as the output.

Every push to `main` can then trigger a production deployment through the Git integration.

## Notes

- The site uses progressive enhancement: core content remains readable if JavaScript is unavailable.
- Scroll and pointer effects respect the user's reduced-motion preference.
- No runtime dependencies or backend services are required.
