const quickPrompts = [
  "Map a 30/60/90-day launch plan with top risks and mitigations.",
  "Convert this vague request into an implementation spec + acceptance tests.",
  "Simulate a design review: strengths, weaknesses, and likely objections.",
  "Create a brutal pre-mortem and propose concrete prevention actions.",
  "Draft a ship checklist with owners, dependencies, and rollback plan."
];

const agentCatalog = [
  {
    id: "architect",
    name: "Systems Architect",
    icon: "🏗️",
    mission: "Breaks problems into components and interfaces.",
    output: "Creates architecture maps, trade-offs, and sequencing guidance."
  },
  {
    id: "research",
    name: "Research Scout",
    icon: "🔎",
    mission: "Finds unknowns and validates assumptions.",
    output: "Highlights key questions, missing data, and validation plan."
  },
  {
    id: "security",
    name: "Security Sentinel",
    icon: "🛡️",
    mission: "Threat-models abuse, data exposure, and compliance risk.",
    output: "Produces hardening checklist and highest-impact controls."
  },
  {
    id: "ux",
    name: "UX Critic",
    icon: "🎯",
    mission: "Optimizes user flow, clarity, and adoption.",
    output: "Returns friction points, copy updates, and UX experiments."
  },
  {
    id: "delivery",
    name: "Delivery Commander",
    icon: "🚀",
    mission: "Turns strategy into milestones and accountable owners.",
    output: "Builds rollout plan, dependencies, and rollback criteria."
  }
];

const slashProfiles = {
  plan: {
    title: "Execution plan",
    text: "## 3-Phase Plan\n1. **Frame outcome**: define metric, scope, and deadline.\n2. **Ship v1 fast**: prioritize one thin vertical slice.\n3. **Harden + scale**: add guardrails, docs, and observability."
  },
  spec: {
    title: "Specification skeleton",
    text: "## Spec\n- **Problem**\n- **User stories**\n- **Non-goals**\n- **API/data contract**\n- **Acceptance tests**\n- **Rollout + rollback**"
  },
  debug: {
    title: "Debug protocol",
    text: "## Debug\n1. Reproduce with minimal case.\n2. Capture expected vs actual.\n3. Identify likely fault domain.\n4. Add temporary instrumentation.\n5. Patch and verify with regression test."
  },
  ship: {
    title: "Release readiness",
    text: "## Ship Gate\n- ✅ Risk log updated\n- ✅ Monitoring + alert thresholds\n- ✅ Fallback/rollback rehearsed\n- ✅ Owner + comms plan set"
  },
  risk: {
    title: "Risk matrix",
    text: "## Top Risks\n- Scope creep\n- Hidden dependency delays\n- Integration regressions\n- Ambiguous ownership\n\nFor each: likelihood, impact, trigger, and contingency."
  },
  squad: {
    title: "Agent squad",
    text: "Use **Run selected agents** to generate parallel specialist recommendations and a merged execution plan."
  }
};

const state = {
  sessions: [],
  activeSessionId: null,
  streaming: true,
  theme: "dark",
  sound: false,
  selectedAgents: ["architect", "delivery"]
};

const chatContainer = document.getElementById("chat-container");
const composer = document.getElementById("composer");
const sendBtn = document.getElementById("send-btn");
const newChatBtn = document.getElementById("new-chat");
const newSessionBtn = document.getElementById("new-session");
const clearInputBtn = document.getElementById("clear-input");
const improvePromptBtn = document.getElementById("improve-prompt");
const insertContextBtn = document.getElementById("insert-context");
const exportChatBtn = document.getElementById("export-chat");
const streamingToggle = document.getElementById("streaming-toggle");
const themeToggle = document.getElementById("theme-toggle");
const soundToggle = document.getElementById("sound-toggle");
const promptChips = document.getElementById("prompt-chips");
const systemPrompt = document.getElementById("system-prompt");
const modelStatus = document.getElementById("model-status");
const modelSelect = document.getElementById("model-select");
const sessionList = document.getElementById("session-list");
const agentList = document.getElementById("agent-list");
const agentBrief = document.getElementById("agent-brief");
const runAgentsBtn = document.getElementById("run-agents");

const metricMessages = document.getElementById("metric-messages");
const metricUserChars = document.getElementById("metric-user-chars");
const metricAssistantChars = document.getElementById("metric-assistant-chars");
const metricCommands = document.getElementById("metric-commands");

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function activeSession() {
  return state.sessions.find((session) => session.id === state.activeSessionId);
}

function createSession(name = "New operation") {
  const session = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    messages: []
  };
  state.sessions.unshift(session);
  state.activeSessionId = session.id;
  return session;
}

function persist() {
  localStorage.setItem(
    "clawdbot-command-center-x",
    JSON.stringify({
      sessions: state.sessions,
      activeSessionId: state.activeSessionId,
      streaming: state.streaming,
      theme: state.theme,
      sound: state.sound,
      selectedAgents: state.selectedAgents,
      systemPrompt: systemPrompt.value,
      model: modelSelect.value
    })
  );
}

function loadPersisted() {
  const raw = localStorage.getItem("clawdbot-command-center-x");
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.sessions) && parsed.sessions.length) {
      state.sessions = parsed.sessions;
      state.activeSessionId = parsed.activeSessionId || parsed.sessions[0].id;
    }
    state.streaming = parsed.streaming ?? state.streaming;
    state.theme = parsed.theme ?? state.theme;
    state.sound = parsed.sound ?? state.sound;
    if (Array.isArray(parsed.selectedAgents) && parsed.selectedAgents.length) {
      state.selectedAgents = parsed.selectedAgents;
    }
    if (typeof parsed.systemPrompt === "string") systemPrompt.value = parsed.systemPrompt;
    if (typeof parsed.model === "string") modelSelect.value = parsed.model;
  } catch {
    modelStatus.textContent = "Storage parse failed; started fresh";
  }
}

function renderMarkdownLite(text) {
  return text
    .replace(/^###\s(.+)$/gm, "<h4>$1</h4>")
    .replace(/^##\s(.+)$/gm, "<h3>$1</h3>")
    .replace(/^\-\s(.+)$/gm, "• $1")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function renderMessage(message) {
  const tpl = document.getElementById("message-template");
  const node = tpl.content.firstElementChild.cloneNode(true);
  node.classList.add(`message--${message.role}`);

  const avatar = node.querySelector(".avatar");
  avatar.textContent = message.role === "user" ? "🧑" : message.role === "assistant" ? "🤖" : "ℹ️";
  node.querySelector(".message__meta").textContent = message.meta || `${message.role} • ${nowLabel()}`;

  const body = node.querySelector(".message__body");
  body.innerHTML = renderMarkdownLite(message.content);

  node.querySelectorAll(".tool-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.dataset.action;
      if (action === "copy") {
        await navigator.clipboard.writeText(message.content);
        modelStatus.textContent = "Copied message";
      }
      if (action === "reuse") {
        composer.value = message.content;
        composer.focus();
      }
    });
  });

  chatContainer.appendChild(node);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return node;
}

function renderSessions() {
  sessionList.innerHTML = "";
  state.sessions.forEach((session) => {
    const btn = document.createElement("button");
    btn.className = `session-item ${session.id === state.activeSessionId ? "active" : ""}`;
    btn.textContent = `${session.name} (${session.messages.length})`;
    btn.addEventListener("click", () => {
      state.activeSessionId = session.id;
      refreshChat();
      renderSessions();
      persist();
    });
    sessionList.appendChild(btn);
  });
}

function refreshChat() {
  chatContainer.innerHTML = "";
  const session = activeSession();
  if (!session) return;
  session.messages.forEach(renderMessage);
  updateMetrics();
}

function addMessage(role, content, meta) {
  const session = activeSession();
  if (!session) return null;

  const message = {
    role,
    content,
    meta,
    createdAt: new Date().toISOString()
  };

  session.messages.push(message);
  if (role === "user" && session.messages.length <= 2) {
    session.name = content.slice(0, 26).replace(/\n/g, " ") || "New operation";
  }
  const node = renderMessage(message);
  renderSessions();
  updateMetrics();
  persist();
  return { node, message };
}

function updateMetrics() {
  const session = activeSession();
  if (!session) return;
  const messages = session.messages.length;
  const userChars = session.messages.filter((m) => m.role === "user").reduce((sum, m) => sum + m.content.length, 0);
  const assistantChars = session.messages
    .filter((m) => m.role === "assistant")
    .reduce((sum, m) => sum + m.content.length, 0);
  const commands = session.messages.filter((m) => m.role === "user" && m.content.trim().startsWith("/")).length;

  metricMessages.textContent = messages;
  metricUserChars.textContent = userChars;
  metricAssistantChars.textContent = assistantChars;
  metricCommands.textContent = commands;
}

function hydrateQuickPrompts() {
  quickPrompts.forEach((prompt) => {
    const btn = document.createElement("button");
    btn.textContent = prompt;
    btn.addEventListener("click", () => {
      composer.value = prompt;
      composer.focus();
    });
    promptChips.appendChild(btn);
  });
}

function renderAgentForge() {
  agentList.innerHTML = "";
  agentCatalog.forEach((agent) => {
    const card = document.createElement("label");
    card.className = "agent-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = state.selectedAgents.includes(agent.id);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        state.selectedAgents = [...new Set([...state.selectedAgents, agent.id])];
      } else {
        state.selectedAgents = state.selectedAgents.filter((id) => id !== agent.id);
      }
      updateAgentBrief();
      persist();
    });

    const meta = document.createElement("div");
    meta.innerHTML = `<strong>${agent.icon} ${agent.name}</strong><span>${agent.mission}</span>`;

    card.append(checkbox, meta);
    agentList.appendChild(card);
  });
  updateAgentBrief();
}

function updateAgentBrief() {
  const selected = agentCatalog.filter((agent) => state.selectedAgents.includes(agent.id));
  if (!selected.length) {
    agentBrief.textContent = "No agent selected. Pick at least one specialist.";
    return;
  }
  agentBrief.innerHTML = selected
    .map((agent) => `<p><strong>${agent.icon} ${agent.name}</strong><br />${agent.output}</p>`)
    .join("");
}

function composeAgentOutput(input) {
  const selected = agentCatalog.filter((agent) => state.selectedAgents.includes(agent.id));
  if (!selected.length) {
    return "Select at least one agent in Agent Forge before running a squad pass.";
  }

  const brief = selected
    .map((agent) => `### ${agent.icon} ${agent.name}\n- Mission: ${agent.mission}\n- Recommendation: ${agent.output}`)
    .join("\n\n");

  return [
    "## Multi-Agent Synthesis",
    `Request focus: **${input.trim().slice(0, 180)}${input.trim().length > 180 ? "…" : ""}**`,
    "",
    brief,
    "",
    "### Unified execution order",
    "1. Define success metric and target date.",
    "2. Run discovery + architecture + risk checks in parallel.",
    "3. Ship smallest high-confidence slice, then harden with observability and rollback rehearsal."
  ].join("\n");
}

function beep() {
  if (!state.sound) return;
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  oscillator.type = "triangle";
  oscillator.frequency.value = 640;
  oscillator.connect(ctx.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    ctx.close();
  }, 50);
}

function buildAssistantReply(input) {
  const trimmed = input.trim();
  if (!trimmed) return "Please provide a request.";

  if (trimmed.startsWith("/")) {
    const key = trimmed.slice(1).split(" ")[0].toLowerCase();
    const profile = slashProfiles[key];
    if (profile) return `### ${profile.title}\n${profile.text}`;
    return "Unknown command. Use `/plan`, `/spec`, `/debug`, `/ship`, `/risk`, or `/squad`.";
  }

  const constraints = systemPrompt.value.trim().slice(0, 160);
  const model = modelSelect.value;
  return [
    "### Strategic Response",
    `**Model stance:** ${model}`,
    `**Request digest:** ${trimmed.slice(0, 240)}${trimmed.length > 240 ? "…" : ""}`,
    "",
    "**Execution track**",
    "- Clarify success metric + owner + due date.",
    "- Sequence the work into one immediate deliverable and one stabilization phase.",
    "- Add explicit failure triggers and contingency actions.",
    "",
    `**Constraint memory:** ${constraints}${systemPrompt.value.length > 160 ? "…" : ""}`,
    "",
    "Run **selected agents** for specialist analysis, or reply `/plan` to produce a phased milestone plan."
  ].join("\n");
}

async function streamText(targetNode, fullText) {
  const body = targetNode.querySelector(".message__body");
  body.textContent = "";
  for (let i = 0; i < fullText.length; i += 1) {
    body.textContent += fullText[i];
    if (i % 4 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 6));
    }
  }
  targetNode.querySelector(".message__body").innerHTML = renderMarkdownLite(fullText);
}

async function handleSend() {
  const input = composer.value;
  if (!input.trim()) return;

  addMessage("user", input, `you • ${nowLabel()}`);
  composer.value = "";

  const response = buildAssistantReply(input);
  const result = addMessage("assistant", state.streaming ? "" : response, `${modelSelect.value} • generating`);
  if (!result) return;

  if (state.streaming) {
    await streamText(result.node, response);
    result.message.content = response;
  }

  result.message.meta = `${modelSelect.value} • ${nowLabel()}`;
  result.node.querySelector(".message__meta").textContent = result.message.meta;
  updateMetrics();
  persist();
  beep();
}

async function runAgents() {
  const input = composer.value.trim() || "Current active objective";
  addMessage("user", `🧠 Agent Squad Run\n${input}`, `you • ${nowLabel()}`);

  const synthesis = composeAgentOutput(input);
  const result = addMessage("assistant", state.streaming ? "" : synthesis, `agent-squad • generating`);
  if (!result) return;

  if (state.streaming) {
    await streamText(result.node, synthesis);
    result.message.content = synthesis;
  }

  result.message.meta = `agent-squad • ${nowLabel()}`;
  result.node.querySelector(".message__meta").textContent = result.message.meta;
  updateMetrics();
  persist();
}

function resetChat() {
  const session = activeSession();
  if (!session) return;
  session.messages = [];
  session.messages.push({
    role: "system",
    content:
      "Welcome to **ClawDBot Command Center X**. Drive execution with concrete outcomes, constraints, and clear owners. Use Agent Forge to run specialist copilots.",
    meta: "system • ready",
    createdAt: new Date().toISOString()
  });
  refreshChat();
  renderSessions();
  persist();
}

function createNewSession() {
  createSession(`Operation ${state.sessions.length + 1}`);
  resetChat();
}

function exportTranscript() {
  const session = activeSession();
  if (!session) return;

  const payload = {
    app: "ClawDBot Command Center X",
    exportedAt: new Date().toISOString(),
    model: modelSelect.value,
    selectedAgents: state.selectedAgents,
    systemPrompt: systemPrompt.value,
    session
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${session.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

sendBtn.addEventListener("click", handleSend);
runAgentsBtn.addEventListener("click", runAgents);
newChatBtn.addEventListener("click", resetChat);
newSessionBtn.addEventListener("click", createNewSession);
clearInputBtn.addEventListener("click", () => {
  composer.value = "";
  composer.focus();
});
improvePromptBtn.addEventListener("click", () => {
  const seed = composer.value.trim();
  composer.value = [
    "Goal:",
    seed || "Describe target business/user outcome.",
    "",
    "Context:",
    "",
    "Constraints:",
    "",
    "Definition of done:",
    "",
    "Output format required:"
  ].join("\n");
  composer.focus();
});
insertContextBtn.addEventListener("click", () => {
  composer.value += "\n\n<context>\nproject: \nconstraints: \ndeadline: \nowners: \nrisks: \n</context>";
  composer.focus();
});
exportChatBtn.addEventListener("click", exportTranscript);
streamingToggle.addEventListener("change", (event) => {
  state.streaming = event.target.checked;
  persist();
});
themeToggle.addEventListener("change", (event) => {
  state.theme = event.target.checked ? "dark" : "light";
  document.body.classList.toggle("light", state.theme === "light");
  persist();
});
soundToggle.addEventListener("change", (event) => {
  state.sound = event.target.checked;
  persist();
});
modelSelect.addEventListener("change", () => {
  modelStatus.textContent = `${modelSelect.value} armed`;
  persist();
});
systemPrompt.addEventListener("change", persist);

composer.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    composer.focus();
  }
});

loadPersisted();
if (!state.sessions.length) {
  createSession("Primary operation");
  resetChat();
}
streamingToggle.checked = state.streaming;
themeToggle.checked = state.theme === "dark";
soundToggle.checked = state.sound;
document.body.classList.toggle("light", state.theme === "light");
renderSessions();
refreshChat();
hydrateQuickPrompts();
renderAgentForge();
modelStatus.textContent = `${modelSelect.value} armed`;
