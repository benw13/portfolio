# Ben Williams: personal site

Live at **https://ben-williams-portfolio-production.up.railway.app**

Static site, no build step and no dependencies.

```bash
node server.mjs
```

Then open http://localhost:4321.

## Files
- `index.html`: all content (hero, projects, experience, about, contact)
- `styles.css`: design tokens at the top (Aggie maroon, light and dark themes)
- `main.js`: theme toggle, screenshot tabs, arbitrage chart, copy-email button
- `assets/img/`: headshot, project screenshots and icons
- `assets/files/Ben_Williams_Resume.pdf`: the Mays Career Fair résumé (Sep 2026)

## To do
- Paste your LinkedIn URL into `LINKEDIN_URL` at the top of `main.js`. The LinkedIn button stays hidden until you do.

## Deploying
Hosted on Railway, where `npm start` runs `server.mjs`. Any static host also works (Vercel, Netlify, GitHub Pages); upload the folder as-is.
