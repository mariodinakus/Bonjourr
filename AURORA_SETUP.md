# Aurora Finance Edition

This is a **personal fork** of [Bonjourr](https://github.com/victrme/Bonjourr).
The upstream minimalist new-tab extension is preserved; the additional Aurora Desk is enabled **only on HTTP/HTTPS web deployments**.


## Integrated quote ticker (2026-10-20)

**No separate dashboard, no floating panels, no extra columns.**

The original `#quotes_container` remains in precisely the same location below Bonjourr's quick links. It still displays upstream quotes, with its original quote engine and author. A small navigation row INSIDE the same quote card can switch the content:

- **Γνωμικό** — the actual Bonjourr quote, unchanged in functionality.
- **Αργίες** — countdown to next Greek calendar holiday and optional local personal date.
- **Vibe idea** — one of 12 curated coding ideas, with next idea, local favorite and copy brief.
- **Ειδήσεις** — linked source headline (when available).
- **Αγορές** / **Ενέργεια** — dated historical observations (not live quotes).

Rotation occurs every ~18 seconds when the user is not interacting. Hover, keyboard focus or selection pauses it, and clicking a category lets the user read it. The original full-screen photo, clock, weather, search and links **keep their native positions**.

The ticker appears on web deployments only; it is not a change to the installed Chrome extension. The quotes widget must be enabled in Bonjourr settings for the ticker to be visible.

A Greek calendar holiday is not necessarily a mandatory day off in every industry or workplace.

Deployment note: Vercel deployment quotas may block rebuilding the latest commit. A previous READY build is not evidence that the newest GitHub changes are live.

## Features

- Manrope inside the compact information ticker, with subtle cyan highlights
- Category selection inside the pre-existing quote widget, without another panel
- News metadata and original source links via Google News RSS
- S&P 500, Nasdaq 100, and DAX **historical daily closes** via Stooq (subject to availability)
- Brent and WTI **historical daily observations** via FRED/EIA (subject to availability)
- Greek electricity market link to the official Hellenic Energy Exchange; **no fabricated €/MWh price**
- 15-minute cache/refresh with visible observation dates, graceful unavailable states and no API keys

## How to deploy on Vercel

1. Connect this repository to a **new** Vercel project.
2. Vercel uses the root \`vercel.json\`, which installs Deno and compiles the \`online prod\` target.
3. Static output: \`release/online\` (the official Bonjourr Deno build).
4. The public read-only data route is \`/api/aurora\`.
5. For preview, choose \`feature/aurora-finance-dashboard\`. Once tested, merge the PR to \`master\` to update the default branch.

No subscription or API key is required for the initial implementation, but public sources can impose limits, lag, or refuse automated requests. If unavailable, data fields show an unavailable state instead of a false quote.

**Data quality:** Stock and oil prices are **NOT live**. Observations may lag by one or several business days; always check \`observedOn\`. Google News RSS freshness varies. This is a prototype, not a trading or pricing feed.

**Privacy and licensing:** News feeds and Google Fonts generate external network requests. Credit the original Bonjourr project and keep its license notices.

## Developing

Follow \`AGENTS.md\` in the upstream repository. Use Deno, not npm:

\`\`\`sh
deno task online
deno task types
deno task format
deno run --allow-all ./tasks/build.ts online prod
\`\`\`

### Deployment/access troubleshooting

- If Vercel reports **READY** but the preview URL asks for Vercel authentication, inspect Deployment Protection settings of the **new** project.
- If categories say unavailable, visit \`/api/aurora\` and check the \`markets\`, \`energy\`, and \`news\` arrays. Public providers may refuse the request.
- Changing the original Bonjourr extension's settings, custom CSS, or GitHub Gist is **not** required.
- Hosting a webpage does **not** automatically replace Chrome's New Tab; that needs a new-tab redirect/extension after the page works.
