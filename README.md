# Elder Care Financial Planner (All In Legacy)

Compare three paths for aging parents:

1. Move to a professional care facility
2. Build a casita on the adult child's lot
3. Sell and build a new multi-generational home

The Decision tab gives a plain-English verdict. Your Situation holds family numbers. Scenarios and Projection show the paths. Defaults holds care costs, home-care hours, rental assumptions, and economics.

This is a planning tool for the All In Planner and Strong Roots Legacy program. It is not tax, legal, or investment advice.

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm test
npm run build
npm run preview
```

Inputs are saved in the browser (`localStorage`) so a refresh does not wipe the conversation. A backend can later replace `src/state/planStore.js` without touching the rest of the app.

## Deploy (Cloudflare Workers)

The production target is a static Worker, the same pattern as `estimator.buildwithstrongroots.com`.

```bash
npm run deploy
```

That builds `dist/` and runs `wrangler deploy` using `wrangler.toml`. After the first deploy, bind a custom domain in the Cloudflare dashboard (for example `legacy.buildwithstrongroots.com`).

## Project layout

```
src/
  App.jsx                  header + tabs
  state/                   defaults, plan hook, localStorage store
  lib/                     finance, care, rental, projection, compare
  components/tabs/         Decision, Situation, Scenarios, Projection, Defaults
```
