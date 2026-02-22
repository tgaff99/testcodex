const quickPrompts = [
  "Build this week's issue plan for AI engineers (5 sections + CTA).",
  "Turn these raw links into concise summaries with why-it-matters notes.",
  "Generate 3 subject lines and pick the best with rationale.",
  "Create a QA checklist for factual claims, links, and tone.",
  "Draft a sponsor block that fits a technical newsletter voice."
];

const agentCatalog = [
  {
    id: "scout",
    name: "Trend Scout",
    icon: "🔎",
    mission: "Finds notable stories and source URLs.",
    output: "Delivers ranked stories with confidence and freshness signals."
  },
  {
    id: "verifier",
    name: "Fact Verifier",
    icon: "🛡️",
    mission: "Checks claims, dates, quotes, and references.",
    output: "Flags risky claims and proposes safer, sourced rewrites."
  },
  {
    id: "strategist",
    name: "Angle Strategist",
    icon: "🎯",
    mission: "Builds a narrative angle for the target audience.",
    output: "Maps hooks, sequencing, and reader takeaway positioning."
  },
  {
    id: "writer",
    name: "Draft Writer",
    icon: "✍️",
    mission: "Produces clean newsletter sections quickly.",
    output: "Returns intro, sections, transitions, and CTA in one draft."
  },
  {
    id: "publisher",
    name: "Distribution Planner",
    icon: "🚀",
    mission: "Prepares send strategy and post-send analysis.",
    output: "Defines subject line tests, send time, and KPI follow-up."
  }
];

const slashProfiles = {
  sources: {
    title: "Source pack",
    text: "## Source Intake\n- Gather 10 candidate links\n- Remove duplicates/outdated items\n- Score for relevance, novelty, and trust\n- Keep top 5 for issue planning"
  },
  angles: {
    title: "Story angles",
    text: "## Angle Options\n1. **What changed this week**\n2. **Operator playbook**\n3. **Market signal and implications**\n\nChoose one primary angle to keep the issue coherent."
  },
  outline: {
    title: "Issue outline",
    text: "## Outline\n- Hook + promise\n- 3–5 core stories\n- Deep dive\n- Tool/resource pick\n- CTA + next issue teaser"
  },
  draft: {
    title: "Draft protocol",
    text: "## Draft\n1. Keep sections skimmable\n2. Add one clear insight per section\n3. Cite source context briefly\n4. End with practical next action"
  },
  qa: {
    title: "Editorial QA",
    text: "## QA Gate\n- ✅ Facts checked\n- ✅ Links valid\n- ✅ Tone consistent\n- ✅ Claims properly hedged\n- ✅ CTA and tracking links verified"
  },
  ship: {
    title: "Send checklist",
    text: "## Ship\n- Final proofread\n- Subject line A/B variant ready\n- Segment and send time confirmed\n- Dashboard set for open/click/reply rates"
  }
};

const state = {
  sessions: [],
  activeSessionId: null,
  streaming: true,
  theme: "dark",
  sound: false,
  selectedAgents: ["scout", "writer"]
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

function createId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createSession(name = "New issue") {
  const session = {
    id: createId(),
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
    "newsletter-factory-state",
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
  const raw = localStorage.getItem("newsletter-factory-state");
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
    session.name = content.slice(0, 30).replace(/\n/g, " ") || "New issue";
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
    return "Select at least one agent before running the pipeline.";
  }

  const brief = selected
    .map((agent) => `### ${agent.icon} ${agent.name}\n- Mission: ${agent.mission}\n- Deliverable: ${agent.output}`)
    .join("\n\n");

  return [
    "## Multi-Agent Newsletter Pipeline",
    `Issue focus: **${input.trim().slice(0, 180)}${input.trim().length > 180 ? "…" : ""}**`,
    "",
    brief,
    "",
    "### Unified run order",
    "1. Gather and rank candidate stories.",
    "2. Validate facts and remove weak claims.",
    "3. Select one narrative angle and structure the issue.",
    "4. Draft concise sections and CTA.",
    "5. Approve send plan with KPI targets."
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
    return "Unknown command. Use `/sources`, `/angles`, `/outline`, `/draft`, `/qa`, or `/ship`.";
  }

  const constraints = systemPrompt.value.trim().slice(0, 180);
  const model = modelSelect.value;
  return [
    "### Editor Response",
    `**Model:** ${model}`,
    `**Issue brief:** ${trimmed.slice(0, 240)}${trimmed.length > 240 ? "…" : ""}`,
    "",
    "**Recommended next actions**",
    "- Lock this issue's audience and objective.",
    "- Produce source shortlist and discard low-confidence items.",
    "- Build outline and draft with one clear insight per section.",
    "- Run QA for claims, links, and clarity before send.",
    "",
    `**Policy memory:** ${constraints}${systemPrompt.value.length > 180 ? "…" : ""}`,
    "",
    "Run **pipeline agents** for specialist deliverables, or use `/outline` to generate structure immediately."
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

  addMessage("user", input, `editor • ${nowLabel()}`);
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
  const input = composer.value.trim() || "Current issue objective";
  addMessage("user", `🧠 Pipeline Run\n${input}`, `editor • ${nowLabel()}`);

  const synthesis = composeAgentOutput(input);
  const result = addMessage("assistant", state.streaming ? "" : synthesis, `pipeline • generating`);
  if (!result) return;

  if (state.streaming) {
    await streamText(result.node, synthesis);
    result.message.content = synthesis;
  }

  result.message.meta = `pipeline • ${nowLabel()}`;
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
      "Welcome to **Multi-Agent Newsletter Factory**. Define audience, timeframe, and objective, then run the pipeline to generate an issue from sourcing to ship.",
    meta: "system • ready",
    createdAt: new Date().toISOString()
  });
  refreshChat();
  renderSessions();
  persist();
}

function createNewSession() {
  createSession(`Issue ${state.sessions.length + 1}`);
  resetChat();
}

function exportTranscript() {
  const session = activeSession();
  if (!session) return;

  const payload = {
    app: "Multi-Agent Newsletter Factory",
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
    "Audience:",
    "",
    "Primary objective:",
    seed || "",
    "",
    "Source constraints:",
    "",
    "Issue sections required:",
    "",
    "Tone and CTA:"
  ].join("\n");
  composer.focus();
});
insertContextBtn.addEventListener("click", () => {
  composer.value += "\n\n<issue_context>\naudience: \nsend_date: \ncore_themes: \nsource_pool: \ncta: \n</issue_context>";
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
  createSession("Issue planning");
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
