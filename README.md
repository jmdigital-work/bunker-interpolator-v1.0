# MarineCalc V1.0 — PWA

This version is a Progressive Web App (PWA).

## Run locally

Open the folder in VS Code and use **Live Server**. A service worker normally requires `localhost` or HTTPS, so opening the HTML directly with `file://` will not enable offline/PWA features.

## Publish it for everybody

The simplest route is **GitHub Pages**:

1. Create a GitHub repository, for example `bunker-interpolator`.
2. Upload all files in this folder.
3. In GitHub, go to **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)`.
6. Save.
7. GitHub will give you a public HTTPS address.

Once served over HTTPS, users can open the calculator in their browser and, on supported devices/browsers, choose **Install app / Add to Home Screen**.

## PWA files

- `manifest.webmanifest` — app name, icon, display mode, theme.
- `sw.js` — caches the app so it can work offline after the first successful load.
- `icons/` — install icons.
- `index.html` — registers the service worker.

## Important

If you change the app files after deployment, increase the cache version in `sw.js`, for example:

`bunker-interpolator-v2`

That tells browsers to replace the old cached app.

## Suggested production path

GitHub Pages is fine for a free public calculator. If you later want:
- a custom domain such as `bunkerinterpolator.com`
- analytics
- multiple calculators
- saved tank tables
- user accounts
- a backend/database
- a "Share this tank table" feature

then we can move the same frontend to a production host and add those features without rebuilding the calculator from scratch.
