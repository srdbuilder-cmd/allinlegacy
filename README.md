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

There is only a `main` branch. Cloudflare **Workers Builds** watches that branch: every push to `main` builds and goes live. No pull request is required.

The Worker name in `wrangler.toml` is `allin-legacy-prod`. That name must match the Worker in the dashboard.

### One-time Cloudflare setup

1. Open [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages).
2. **Create** → **Import a repository** → connect the GitHub account that owns `srdbuilder-cmd/allinlegacy` (or `AllInLegacy`).
3. Select this repository.
4. Use these build settings:

   | Setting | Value |
   | --- | --- |
   | Worker name | `allin-legacy-prod` |
   | Production branch | `main` |
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |
   | Root directory | `/` (leave default) |

5. **Save and Deploy**. Cloudflare creates the Worker, generates a build token, and publishes the first version.
6. Preview it at `https://allin-legacy-prod.<your-subdomain>.workers.dev`.
7. Optional: in the Worker → **Settings** → **Domains & Routes**, bind a custom host such as `legacy.buildwithstrongroots.com`.

After that, `git push origin main` is the release. Cloudflare will show each build under the Worker → **Deployments**.

Do not also add a GitHub Actions deploy workflow for the same Worker. Two pipelines on `main` would publish twice.

### Deploy from this machine (optional)

```bash
npx wrangler login
npm run deploy:local
```

### After you add a second branch later

If you later add `dev` or pull requests, turn on **non-production branch builds** in Worker → **Settings** → **Build**. Those commits get a preview URL and do not replace production. Until then, treat `main` as live.

## Project layout

```
src/
  App.jsx                  header + tabs
  state/                   defaults, plan hook, localStorage store
  lib/                     finance, care, rental, projection, compare
  components/tabs/         Decision, Situation, Scenarios, Projection, Defaults
```
