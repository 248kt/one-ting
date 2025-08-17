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
