# Aurora Finance Edition

This is a **personal fork** of [Bonjourr](https://github.com/victrme/Bonjourr).
The upstream minimalist new-tab extension is preserved; the additional Aurora Desk is enabled **only on HTTP/HTTPS web deployments**.


## Compact UI (2026-10-20)

Aurora Mini Desk is deliberately **collapsed by default**. It appears only as a small
glass bar at the **bottom-left**, showing the next Greek calendar holiday countdown.
Click the bar to reveal the compact panel (max 360px wide).

Tabs:
- Today: next holidays + a rotating curated Vibe Coding idea.
- Holidays: Greek holiday countdowns, including Orthodox Easter-based dates,
  and personal dates stored only in the current browser.
- Vibe Lab: 12 curated project ideas with difficulty, idea rotation,
  local favorites and a copyable development brief.
- Markets / Energy / News: existing timestamped public feeds, lazy-loaded when opened.

All existing Bonjourr layout elements (background, clock, weather, quick links,
quotes, search box, settings) retain their **upstream styles and positions**.
This is a web-only overlay and does **not** change the installed Chrome extension.

The holiday feature is a calendar/countdown, not a determination of whether a
particular holiday is legally non-working for a given employee or industry.

Deployment note: Vercel daily deployment limits may block pushing the latest
branch until the quota resets; the GitHub branch may be newer than the current
public deployment. A prior READY deployment is not evidence that latest commits
are live.

## Features

- Manrope typography, enhanced readability, cyan/mint/amber/lilac Aurora palette
- Expandable, accessible news, daily-market-close, and energy observation panels
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
- If tiles say unavailable, visit \`/api/aurora\` and check the \`markets\`, \`energy\`, and \`news\` arrays. Public providers may refuse the request.
- Changing the original Bonjourr extension's settings, custom CSS, or GitHub Gist is **not** required.
- Hosting a webpage does **not** automatically replace Chrome's New Tab; that needs a new-tab redirect/extension after the page works.
