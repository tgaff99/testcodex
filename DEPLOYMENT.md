# Deploy ClawDBot Command Center X (Free + Non-Interactive Friendly)

This repo is static HTML/CSS/JS, so any static host works.

## Option A: Quick public URL (no account, ephemeral)

Use the included script:

```bash
./scripts/deploy_free.sh 4173
```

What it does:
1. Starts `python3 -m http.server` on the given port.
2. Tries a **Cloudflare quick tunnel** (`cloudflared`) if installed.
3. Falls back to **localtunnel** via `npx`.

Notes:
- URL is temporary (good for immediate sharing/testing).
- Keep the terminal running to keep URL alive.

## Option B: Durable free hosting (account required)

### Netlify Drop
1. Zip the repo contents.
2. Go to `https://app.netlify.com/drop`.
3. Drag/drop zip.

### GitHub Pages
1. Push this repo to GitHub.
2. Enable Pages from branch root.
3. Access under `https://<user>.github.io/<repo>/`.

## Local smoke check before deploy

```bash
node --check app.js
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`.
