# One Ting

A tiny, minimal focus site. Type one task, set a timer, and commit.
Built with **React**, **Vite**, **Tailwind**, and **Framer Motion**. Confetti via `canvas-confetti`.

## Features
- Single-task input + duration (1–180 minutes)
- No pause. Stop button unlocks only after **5 minutes** or **25%** of the session
- Countdown in the browser title
- Smooth animations and **Light/Dark** theme (manual toggle)
- **Minimal sound cues** (start/finish) with a **Mute** toggle
- **Pop-out mini timer** window that stays visible while browsing other sites
- **Task History + Streaks** (local-only)
- **PWA support** (installable; offline basics)
- **Shareable summary** (Web Share API or copy to clipboard)

## Quickstart
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Notes
- Stop unlock rule: `max(5 minutes, 25% of total)` in `src/App.tsx`.
- Title resets when the session ends or is canceled.
- Unload warning appears if you try to close/refresh during a running session.
- History is stored locally under `focus_history_v1`.
- If the pop-out is blocked, allow pop-ups for your site.

## Potential subscription features (not implemented)
- **More Celebration Options** (balloons, stars, confetti styles)
- **Minimal Stats View** (weekly totals, success vs canceled)

## Pro (demo) scaffolding
- Click **Upgrade** to toggle a local-only Pro mode.
- Pro enables:
  - Celebration style selector (Burst, Streamers, Confetti)
  - Minimal Stats View (last 7 days totals & sessions)
- This is a front-end scaffold only; integrate your billing later.


## UI Tweaks
- Smooth Mute toggle
- Minimal Stats View (last 7 days)

- Mute control removed for simplicity.
- History log now scrolls in a compact masked stack.


## Deploy to Netlify
**Option A — Web UI**
1. Push to a Git repo (GitHub/GitLab/Bitbucket).
2. In Netlify, “New site from Git” → pick your repo.
3. Build command: `npm run build`
   Publish directory: `dist`
4. Deploy. (We include `netlify.toml` and `public/_redirects` for SPA fallback.)

**Option B — Drag & Drop**
1. Run locally:
   ```bash
   npm install
   npm run build
   ```
2. Drag the generated `dist/` folder into the Netlify UI (Deploys → “Deploy site”).

**Option C — Netlify CLI**
```bash
npm install
npm run build
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```
