# ClawDBot Command Center X

A major upgrade of the previous prototype into a richer, stateful, execution-focused AI workbench with specialist copilots.

## What is improved

- Multi-session chat history with quick switching
- Persisted local state (sessions, model selection, prompt, toggles, selected agents)
- Expanded slash command workflows (`/plan`, `/spec`, `/debug`, `/ship`, `/risk`, `/squad`)
- New **Agent Forge** rail with specialist bots (systems architect, research scout, security sentinel, UX critic, delivery commander)
- One-click **Run selected agents** synthesis to generate a multi-agent plan in the active chat
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
