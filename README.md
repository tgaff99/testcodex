# ClawDBot Command Center X

A major upgrade of the previous prototype into a richer, stateful, execution-focused AI workbench with specialist copilots.

## What is improved

- Multi-session chat history with quick switching
- Persisted local state (sessions, model selection, prompt, toggles, selected agents)
- Expanded slash command workflows (`/plan`, `/spec`, `/debug`, `/ship`, `/risk`, `/squad`)
- New **Agent Forge** rail with specialist bots (systems architect, research scout, security sentinel, UX critic, delivery commander)
- Added **Influencer Intelligence Module** with a quantified ClawDBot community scorecard, ranked influencer table, and dedicated influencer-agent squad
- One-click **Run selected agents** synthesis to generate a multi-agent plan in the active chat
- One-click **Generate influencer activation plan** output combining mathematical scoring, statistical trends, and qualitative messaging guidance
- Added **Venture Factory** module with automation coverage scoring, throughput modeling for a 2-business/day target, capability gap table, and factory specialist agents
- Included execution blueprint for must-have tools: iMessage auto-response in your voice + auto resume updater pipeline
- Added **Inbox & Notes Ops** module for revenue-first email triage, notes bucket sorting, and one-click inbox-zero sprint generation
- Added **Clawbot Mission Stack** module that unifies VEX autonomy/safety tracks with monetization rollout actions and one-click full rollout generation
- Added a high-density **Command Velocity** upgrade with quick-action macro bar (cash plan, inbox sprint, hive deploy, VEX brief), plus persistent **Dense view** and **Focus mode** toggles for more usable screen real estate
- Added an **Executive Pulse ribbon** for real-time cash/readiness pressure signals and a new **Command Queue** to stage + run high-impact actions in sequence
- Added **Viral Thread Studio** with an 8-post thread generator, virality scoring, and queueable launch workflow for X growth loops
- Added a **Unified Ops Launcher** that bundles best-of workflows into reusable packs (Cash Blitz, System Hardening, Growth Loop) with one-click stage/run behavior
- Added a full **VEX Clawbot C++ codebase scaffold** under `vex/` with modular subsystems, FSM, A* pathfinding, safety controls, telemetry, and optional offline AI weight tuner
- New **Subagent Hive Control** panel in the reclaimed composer space with a staged command brief, 300-agent deployment action, lane-level priorities, and cash projection telemetry
- Model selector + live status indicator
- Conversation analytics cards (message and character metrics)
- Message tools for copy/reuse
- Prompt enhancement helpers and context template insertion
- Export of active session transcript to JSON (including selected agents)
- Keyboard shortcuts (`Enter` send, `Shift+Enter` newline, `Ctrl/Cmd+K` focus composer)
- Dark/light theme with responsive layout and improved visual hierarchy

## Run locally

```bash
python3 -m http.server 4173
```

Open: `http://localhost:4173`


## Deploy

For free-host options and a one-command temporary public URL flow, see `DEPLOYMENT.md`.
