# Multi-Agent Newsletter Factory

A browser-based control center for producing a newsletter issue with specialist AI agents.

## What it does

- Multi-session issue history with local persistence
- Slash command workflow for editorial stages (`/sources`, `/angles`, `/outline`, `/draft`, `/qa`, `/ship`)
- Agent team selection and one-click pipeline synthesis
- Prompt helper chips and structured issue templates
- Streaming responses, exportable JSON transcript, and basic issue analytics
- Dark/light theme and keyboard shortcuts (`Enter`, `Shift+Enter`, `Ctrl/Cmd+K`)

## Run locally

```bash
python3 -m http.server 4173
```

Open: `http://localhost:4173`

## Build & deploy

This app is static (HTML/CSS/JS), so deployment is just file hosting.

### Deploy to Netlify (quickest)

1. Push this folder to a Git repository.
2. In Netlify: **Add new site** → **Import an existing project**.
3. Build command: *(leave empty)*
4. Publish directory: `.`
5. Deploy.

### Deploy to Vercel

1. Run:
   ```bash
   npx vercel --prod
   ```
2. Use `.` as the output directory when prompted.

### Deploy with GitHub Pages

1. Push to GitHub.
2. Settings → Pages → Deploy from branch.
3. Select your default branch and `/ (root)`.
4. Save to publish.

## Suggested first 10 towns to cover

For an AI/business-focused newsletter with broad U.S. audience signal, start with:

1. San Francisco, CA
2. New York, NY
3. Seattle, WA
4. Austin, TX
5. Boston, MA
6. Los Angeles, CA
7. Chicago, IL
8. Denver, CO
9. Atlanta, GA
10. Miami, FL

## Local deployment on your machine

Use the helper scripts in this repo:

```bash
./deploy_local.sh        # starts on port 4173
./deploy_local.sh 8080   # starts on a custom port
```

Stop it with:

```bash
./stop_local.sh
```

If `localhost:4173` is not responding, run:

```bash
./stop_local.sh
./deploy_local.sh
```

The deploy script now auto-cleans stale PID files and verifies the server is reachable before reporting success.
