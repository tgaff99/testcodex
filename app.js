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

const influencerCommunity = [
  { name: "Ada Vector", followers: 122000, avgViews: 68000, avgComments: 1400, growth30d: 0.18, positiveSentiment: 0.81, consistency: 0.74, archetype: "Explainer" },
  { name: "Milo Circuit", followers: 87000, avgViews: 53000, avgComments: 920, growth30d: 0.26, positiveSentiment: 0.68, consistency: 0.88, archetype: "Builder" },
  { name: "Rin Atlas", followers: 241000, avgViews: 92000, avgComments: 2100, growth30d: 0.11, positiveSentiment: 0.89, consistency: 0.64, archetype: "Narrative" },
  { name: "Noor Helix", followers: 64000, avgViews: 47000, avgComments: 1200, growth30d: 0.34, positiveSentiment: 0.72, consistency: 0.91, archetype: "Trend Catalyst" },
  { name: "Kai Signal", followers: 156000, avgViews: 71000, avgComments: 1650, growth30d: 0.15, positiveSentiment: 0.76, consistency: 0.79, archetype: "Technical Analyst" }
];

const influencerAgents = [
  {
    id: "network-mapper",
    name: "Network Mapper",
    icon: "🕸️",
    mission: "Identifies who amplifies whom and where cascade effects begin.",
    output: "Builds activation sequence from bridge influencers to niche clusters."
  },
  {
    id: "narrative-chemist",
    name: "Narrative Chemist",
    icon: "🧪",
    mission: "Extracts qualitative themes from comments and creator tone.",
    output: "Aligns campaign hooks to trusted creator language and audience motives."
  },
  {
    id: "momentum-quant",
    name: "Momentum Quant",
    icon: "📈",
    mission: "Scores growth, engagement velocity, and consistency trends.",
    output: "Prioritizes creators by statistically weighted launch impact."
  },
  {
    id: "partnership-operator",
    name: "Partnership Operator",
    icon: "🤝",
    mission: "Converts analysis into execution-ready partnership motions.",
    output: "Produces outreach waves, incentive models, and contract guardrails."
  }
];

const ventureCapabilities = [
  { id: "lead-sourcing", name: "Niche + offer discovery", automated: 0.92, critical: 0.18, blocker: "Need daily vertical refresh" },
  { id: "rapid-funnel", name: "Landing + checkout spin-up", automated: 0.9, critical: 0.2, blocker: "Template QA for payment links" },
  { id: "content-engine", name: "Multi-channel content generation", automated: 0.88, critical: 0.15, blocker: "Brand voice drift at scale" },
  { id: "imessage-autoreply", name: "iMessage auto-response in your voice", automated: 0.42, critical: 0.32, blocker: "Requires Apple Messages automation bridge" },
  { id: "resume-updater", name: "Auto resume updater", automated: 0.61, critical: 0.15, blocker: "Needs canonical achievement source" }
];


const emailQueue = [
  { thread: "Warm inbound leads", volume: 26, slaHours: 2, revenueSignal: 0.92, action: "Reply with booking link + 2 qualifying questions" },
  { thread: "Partnership proposals", volume: 11, slaHours: 6, revenueSignal: 0.79, action: "Approve top 3 with rev-share terms" },
  { thread: "Client expansion asks", volume: 9, slaHours: 4, revenueSignal: 0.86, action: "Send upsell scope + timeline today" },
  { thread: "Support + refunds", volume: 18, slaHours: 8, revenueSignal: 0.41, action: "Auto-route by policy confidence" },
  { thread: "Newsletter replies", volume: 33, slaHours: 24, revenueSignal: 0.55, action: "Tag testimonial vs objection vs sales intent" }
];

const notesBacklog = [
  { bucket: "Offer ideas", count: 42, monetizationLift: 0.88, nextMove: "Score and shortlist top 5 by speed-to-cash" },
  { bucket: "Meeting notes", count: 31, monetizationLift: 0.66, nextMove: "Extract decisions, owners, due dates" },
  { bucket: "Content drafts", count: 27, monetizationLift: 0.59, nextMove: "Convert to distribution calendar" },
  { bucket: "Ops blockers", count: 13, monetizationLift: 0.81, nextMove: "Prioritize blockers tied to checkout friction" },
  { bucket: "Customer voice", count: 24, monetizationLift: 0.74, nextMove: "Cluster objections and update close scripts" }
];

const vexMissionTracks = [
  { track: "Autonomous navigation + safety", status: 0.84, nextMove: "Validate A* route mapping on physical field and tune obstacle thresholds." },
  { track: "Pickup/delivery + vision lock", status: 0.72, nextMove: "Calibrate signature profile and tune centerline turn gain for stable object alignment." },
  { track: "Competition runbook", status: 0.66, nextMove: "Package deterministic routines with failover triggers for battery and collision states." },
  { track: "Monetization product layer", status: 0.58, nextMove: "Ship subscription + telemetry dashboard MVP with weekly KPI review loop." }
];

const viralThreadFramework = {
  hooks: [
    "🚨 Most AI dashboards are theater. This one prints execution.",
    "I rebuilt ClawDBot into a 24/7 business launch cockpit. Here is the exact playbook.",
    "If your agent stack cannot show cash velocity + execution risk in one screen, it is broken."
  ],
  checklist: [
    "Lead with one quantified claim + one pain line in post 1.",
    "Use 2-3 posts for proof (metrics, workflow screenshots, before/after).",
    "Ask a direct question in at least 5 of 8 posts to trigger replies.",
    "Include one controlled hot take and one practical checklist post.",
    "End with clear CTA: save, reply keyword, tag builder friend."
  ],
  hashtags: ["#AIAgents", "#BuildInPublic", "#OpenClaw", "#Automation", "#ClawdBot"]
};

const factoryAgents = [
  { id: "offer-smith", name: "Offer Smith", icon: "💼", mission: "Turns demand signals into monetizable offers.", output: "Creates two daily offer specs with pricing ladders." },
  { id: "automation-operator", name: "Automation Operator", icon: "⚙️", mission: "Designs no-touch process orchestration.", output: "Maps automations with trigger chains, fallback paths, and SLAs." },
  { id: "voice-cloner", name: "Voice Cloner", icon: "📱", mission: "Keeps outbound messaging in your authentic communication style.", output: "Ships voice-safe reply templates and escalation thresholds for iMessage." },
  { id: "career-capital", name: "Career Capital Agent", icon: "🧾", mission: "Converts execution outcomes into resume-ready proof.", output: "Updates resume bullets, metrics, and role narratives automatically." }
];

const monetizationVectors = [
  { title: "High-ticket B2B ghost-automation", action: "Package your top workflow into a done-for-you setup sprint with weekly retainers." },
  { title: "Micro-SaaS wedge launches", action: "Ship one narrow painkiller tool daily with Stripe checkout and creator-led distribution." },
  { title: "Authority content syndication", action: "Repurpose daily execution wins into short-form posts that sell consulting + templates." },
  { title: "Performance partnership offers", action: "Pair with top-ranked influencers on rev-share campaigns tied to tracked conversion links." }
];

const hiveLanes = ["Acquisition", "Offer", "Sales", "Fulfillment", "Retention", "Analytics"];
const subagentHive = Array.from({ length: 300 }, (_, index) => {
  const lane = hiveLanes[index % hiveLanes.length];
  const cycle = index % 10;
  return {
    id: `hive-${index + 1}`,
    lane,
    autonomy: Math.min(0.99, 0.64 + cycle * 0.03),
    cashImpact: 85 + (index % 12) * 13
  };
});

const launcherPacks = [
  {
    id: "cash-blitz",
    name: "Cash Blitz Pack",
    icon: "⚡",
    summary: "Fastest path to revenue in the next 24 hours.",
    actions: ["cash", "inbox", "thread", "hive"]
  },
  {
    id: "system-hardening",
    name: "System Hardening Pack",
    icon: "🛡️",
    summary: "Stabilize ops, tighten readiness, and ship with fewer regressions.",
    actions: ["vex", "inbox", "hive"]
  },
  {
    id: "growth-loop",
    name: "Growth Loop Pack",
    icon: "📈",
    summary: "Run influencer + thread + automation loop with execution follow-through.",
    actions: ["thread", "hive", "cash", "vex"]
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
  selectedAgents: ["architect", "delivery"],
  selectedInfluencerAgents: ["momentum-quant", "narrative-chemist"],
  selectedFactoryAgents: ["offer-smith", "automation-operator"],
  denseMode: false,
  focusMode: false,
  commandQueue: [],
  selectedLauncherPack: "cash-blitz"
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
const densityToggle = document.getElementById("density-toggle");
const focusToggle = document.getElementById("focus-toggle");
const quickCashPlanBtn = document.getElementById("quick-cash-plan");
const quickInboxSprintBtn = document.getElementById("quick-inbox-sprint");
const quickHiveDeployBtn = document.getElementById("quick-hive-deploy");
const quickVexBriefBtn = document.getElementById("quick-vex-brief");
const modelSelect = document.getElementById("model-select");
const sessionList = document.getElementById("session-list");
const agentList = document.getElementById("agent-list");
const agentBrief = document.getElementById("agent-brief");
const runAgentsBtn = document.getElementById("run-agents");

const influencerTableBody = document.getElementById("influencer-table-body");
const influencerAgentList = document.getElementById("influencer-agent-list");
const influencerBrief = document.getElementById("influencer-brief");
const communityScore = document.getElementById("community-score");
const communitySignal = document.getElementById("community-signal");
const communityConsensus = document.getElementById("community-consensus");
const runInfluencerModuleBtn = document.getElementById("run-influencer-module");

const capabilityTableBody = document.getElementById("capability-table-body");
const factoryAgentList = document.getElementById("factory-agent-list");
const factoryBrief = document.getElementById("factory-brief");
const factoryCoverage = document.getElementById("factory-coverage");
const factoryThroughput = document.getElementById("factory-throughput");
const factoryReadiness = document.getElementById("factory-readiness");
const runFactoryModuleBtn = document.getElementById("run-factory-module");
const hiveOnline = document.getElementById("hive-online");
const hiveCash = document.getElementById("hive-cash");
const hiveStability = document.getElementById("hive-stability");
const hivePriorities = document.getElementById("hive-priorities");
const hiveBriefPreview = document.getElementById("hive-brief-preview");
const stageHiveBriefBtn = document.getElementById("stage-hive-brief");
const deployHiveBtn = document.getElementById("deploy-hive");
const inboxBurndown = document.getElementById("inbox-burndown");
const revenueSignal = document.getElementById("revenue-signal");
const noteClarity = document.getElementById("note-clarity");
const emailQueueBody = document.getElementById("email-queue-body");
const notesBucketBody = document.getElementById("notes-bucket-body");
const draftInboxZeroBtn = document.getElementById("draft-inbox-zero");
const runNotesSortBtn = document.getElementById("run-notes-sort");
const notesOpsBrief = document.getElementById("notes-ops-brief");
const vexIntegrationScore = document.getElementById("vex-integration-score");
const vexReadiness = document.getElementById("vex-readiness");
const vexMonetization = document.getElementById("vex-monetization");
const vexTrackBody = document.getElementById("vex-track-body");
const vexOpsBrief = document.getElementById("vex-ops-brief");
const buildVexStackBtn = document.getElementById("build-vex-stack");
const runVexRolloutBtn = document.getElementById("run-vex-rollout");
const threadHookScore = document.getElementById("thread-hook-score");
const threadReplyScore = document.getElementById("thread-reply-score");
const threadShareScore = document.getElementById("thread-share-score");
const threadAngle = document.getElementById("thread-angle");
const threadChecklist = document.getElementById("thread-checklist");
const threadBrief = document.getElementById("thread-brief");
const generateThreadBlueprintBtn = document.getElementById("generate-thread-blueprint");
const queueThreadLaunchBtn = document.getElementById("queue-thread-launch");

const metricMessages = document.getElementById("metric-messages");
const metricUserChars = document.getElementById("metric-user-chars");
const metricAssistantChars = document.getElementById("metric-assistant-chars");
const metricCommands = document.getElementById("metric-commands");
const pulseCash = document.getElementById("pulse-cash");
const pulseFactory = document.getElementById("pulse-factory");
const pulseHive = document.getElementById("pulse-hive");
const pulseInbox = document.getElementById("pulse-inbox");
const pulseVex = document.getElementById("pulse-vex");
const pulsePriority = document.getElementById("pulse-priority");
const commandQueue = document.getElementById("command-queue");
const runQueuedBtn = document.getElementById("run-queued");
const clearQueuedBtn = document.getElementById("clear-queued");
const launchCoherence = document.getElementById("launch-coherence");
const launchRevenueFit = document.getElementById("launch-revenue-fit");
const launchReadiness = document.getElementById("launch-readiness");
const launcherList = document.getElementById("launcher-list");
const launcherBrief = document.getElementById("launcher-brief");
const stageLauncherPackBtn = document.getElementById("stage-launcher-pack");
const runLauncherPackBtn = document.getElementById("run-launcher-pack");

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
      selectedInfluencerAgents: state.selectedInfluencerAgents,
      selectedFactoryAgents: state.selectedFactoryAgents,
      denseMode: state.denseMode,
      focusMode: state.focusMode,
      commandQueue: state.commandQueue,
      selectedLauncherPack: state.selectedLauncherPack,
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
    if (Array.isArray(parsed.selectedInfluencerAgents) && parsed.selectedInfluencerAgents.length) {
      state.selectedInfluencerAgents = parsed.selectedInfluencerAgents;
    }
    if (Array.isArray(parsed.selectedFactoryAgents) && parsed.selectedFactoryAgents.length) {
      state.selectedFactoryAgents = parsed.selectedFactoryAgents;
    }
    state.denseMode = parsed.denseMode ?? state.denseMode;
    state.focusMode = parsed.focusMode ?? state.focusMode;
    state.commandQueue = Array.isArray(parsed.commandQueue) ? parsed.commandQueue : state.commandQueue;
    state.selectedLauncherPack = parsed.selectedLauncherPack ?? state.selectedLauncherPack;
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

function applyViewModes() {
  document.body.classList.toggle("dense", state.denseMode);
  document.body.classList.toggle("focus-mode", state.focusMode);
  densityToggle.textContent = state.denseMode ? "Comfort view" : "Dense view";
  focusToggle.textContent = state.focusMode ? "Exit focus" : "Focus mode";
}


function queueAction(label, actionId) {
  state.commandQueue.push({ id: crypto.randomUUID(), label, actionId, queuedAt: new Date().toISOString() });
  renderCommandQueue();
  persist();
}

function executeQueuedAction(actionId) {
  if (actionId === "cash") runCashPlanMacro();
  if (actionId === "inbox") {
    const sprint = composeInboxZeroSprint();
    composer.value = sprint;
    composer.focus();
  }
  if (actionId === "hive") deploySubagentHive();
  if (actionId === "vex") buildVexStackBrief();
  if (actionId === "thread") generateThreadBlueprint();
}

function renderCommandQueue() {
  if (!commandQueue) return;
  commandQueue.innerHTML = "";
  if (!state.commandQueue.length) {
    const li = document.createElement("li");
    li.innerHTML = '<span>No queued actions yet.</span>';
    commandQueue.appendChild(li);
    return;
  }

  state.commandQueue.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.label}</span>`;
    const btn = document.createElement("button");
    btn.textContent = "Run";
    btn.addEventListener("click", () => {
      executeQueuedAction(item.actionId);
      state.commandQueue = state.commandQueue.filter((q) => q.id !== item.id);
      renderCommandQueue();
      persist();
    });
    li.appendChild(btn);
    commandQueue.appendChild(li);
  });
}

function renderExecutivePulse() {
  if (!pulseCash) return;
  const factory = computeFactoryInsights();
  const hive = computeHiveInsights();
  const notes = computeEmailNoteInsights();
  const vex = computeVexMissionInsights();
  const cashVelocity = Math.round((hive.dailyCashProjection / 300) * (factory.throughput + 0.2));

  pulseCash.textContent = `$${cashVelocity.toLocaleString()}/agent`;
  pulseFactory.textContent = toPercent(factory.readinessScore);
  pulseHive.textContent = toPercent(hive.stability);
  pulseInbox.textContent = `${Math.round(notes.inboxBurnDown * 100)}%`;
  pulseVex.textContent = toPercent(vex.integration);
  pulsePriority.textContent = vex.prioritizedTracks[0].track;
}


function computeLauncherInsights() {
  const factory = computeFactoryInsights();
  const hive = computeHiveInsights();
  const vex = computeVexMissionInsights();
  const influencer = analyzeInfluencerCommunity();
  const momentum = average(influencer.map((c) => c.influenceScore / 100));
  const coherence = Math.min(0.99, factory.readinessScore * 0.4 + hive.stability * 0.3 + vex.integration * 0.3);
  const revenueFit = Math.min(0.99, factory.throughput / 2 * 0.5 + momentum * 0.3 + hive.stability * 0.2);
  const readiness = Math.min(0.99, vex.readiness * 0.5 + factory.readinessScore * 0.3 + 0.2);
  return { coherence, revenueFit, readiness };
}

function renderLauncherModule() {
  const insights = computeLauncherInsights();
  launchCoherence.textContent = toPercent(insights.coherence);
  launchRevenueFit.textContent = toPercent(insights.revenueFit);
  launchReadiness.textContent = toPercent(insights.readiness);

  launcherList.innerHTML = "";
  launcherPacks.forEach((pack) => {
    const card = document.createElement("label");
    card.className = "agent-item";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "launcher-pack";
    radio.checked = state.selectedLauncherPack === pack.id;
    radio.addEventListener("change", () => {
      state.selectedLauncherPack = pack.id;
      launcherBrief.textContent = `${pack.name}: ${pack.summary}`;
      persist();
    });

    const content = document.createElement("div");
    content.innerHTML = `<strong>${pack.icon} ${pack.name}</strong><span>${pack.summary}</span>`;

    card.appendChild(radio);
    card.appendChild(content);
    launcherList.appendChild(card);
  });

  const selected = launcherPacks.find((p) => p.id === state.selectedLauncherPack) || launcherPacks[0];
  launcherBrief.textContent = `${selected.name}: ${selected.summary}`;
}

function stageLauncherPack() {
  const selected = launcherPacks.find((p) => p.id === state.selectedLauncherPack) || launcherPacks[0];
  selected.actions.forEach((actionId) => {
    const labelMap = {
      cash: "Cash acceleration macro",
      inbox: "Inbox sprint draft",
      hive: "Deploy hive command",
      vex: "Generate VEX stack brief",
      thread: "Draft viral thread"
    };
    queueAction(labelMap[actionId] || actionId, actionId);
  });
  launcherBrief.textContent = `${selected.name} staged at ${nowLabel()} (${selected.actions.length} actions queued).`;
}

async function runLauncherPackNow() {
  stageLauncherPack();
  const queued = [...state.commandQueue];
  for (const item of queued) {
    executeQueuedAction(item.actionId);
  }
  state.commandQueue = [];
  renderCommandQueue();
  launcherBrief.textContent = `Launcher pack executed at ${nowLabel()}.`;
  persist();
}

function runCashPlanMacro() {
  composer.value = [
    "Build a cash acceleration plan for the next 24 hours.",
    "",
    "Include:",
    "- 3 fastest-to-cash actions",
    "- offer + audience + channel per action",
    "- blocker and mitigation",
    "- owner and deadline"
  ].join("\n");
  composer.focus();
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
  renderExecutivePulse();
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

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function toPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function analyzeInfluencerCommunity() {
  return influencerCommunity
    .map((creator) => {
      const engagementRate = (creator.avgComments / creator.avgViews) * 12;
      const reachRate = creator.avgViews / creator.followers;
      const influenceScore = (creator.growth30d * 0.35 + engagementRate * 0.25 + creator.positiveSentiment * 0.25 + creator.consistency * 0.15) * 100;
      return {
        ...creator,
        engagementRate,
        reachRate,
        influenceScore
      };
    })
    .sort((a, b) => b.influenceScore - a.influenceScore);
}

function renderInfluencerModule() {
  const analysis = analyzeInfluencerCommunity();
  influencerTableBody.innerHTML = "";

  analysis.forEach((creator) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${creator.name}</td><td>${creator.influenceScore.toFixed(1)}</td><td>${creator.archetype}</td>`;
    influencerTableBody.appendChild(row);
  });

  const weightedHealthScore = average(analysis.map((creator) => creator.influenceScore));
  const growthSignal = average(analysis.map((creator) => creator.growth30d));
  const sentimentConsensus = average(analysis.map((creator) => creator.positiveSentiment));

  communityScore.textContent = weightedHealthScore.toFixed(1);
  communitySignal.textContent = toPercent(growthSignal);
  communityConsensus.textContent = toPercent(sentimentConsensus);

  influencerAgentList.innerHTML = "";
  influencerAgents.forEach((agent) => {
    const card = document.createElement("label");
    card.className = "agent-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = state.selectedInfluencerAgents.includes(agent.id);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        state.selectedInfluencerAgents = [...new Set([...state.selectedInfluencerAgents, agent.id])];
      } else {
        state.selectedInfluencerAgents = state.selectedInfluencerAgents.filter((id) => id !== agent.id);
      }
      updateInfluencerBrief();
      persist();
    });

    const meta = document.createElement("div");
    meta.innerHTML = `<strong>${agent.icon} ${agent.name}</strong><span>${agent.mission}</span>`;

    card.append(checkbox, meta);
    influencerAgentList.appendChild(card);
  });
  updateInfluencerBrief();
}

function updateInfluencerBrief() {
  const selected = influencerAgents.filter((agent) => state.selectedInfluencerAgents.includes(agent.id));
  if (!selected.length) {
    influencerBrief.textContent = "No community agents selected yet.";
    return;
  }
  influencerBrief.innerHTML = selected
    .map((agent) => `<p><strong>${agent.icon} ${agent.name}</strong><br />${agent.output}</p>`)
    .join("");
}

function composeInfluencerActivationPlan() {
  const analysis = analyzeInfluencerCommunity();
  const topThree = analysis.slice(0, 3);
  const selected = influencerAgents.filter((agent) => state.selectedInfluencerAgents.includes(agent.id));
  const selectedText = selected.map((agent) => `${agent.icon} ${agent.name}`).join(", ") || "No specialist selected";

  const topPerformer = topThree[0];
  const medianScore = analysis[Math.floor(analysis.length / 2)].influenceScore;
  const communityVariance = average(analysis.map((creator) => Math.abs(creator.influenceScore - medianScore)));

  return [
    "## ClawDBot Influencer Activation Module",
    "### Quantitative findings",
    `- Weighted community score: **${average(analysis.map((creator) => creator.influenceScore)).toFixed(1)}**`,
    `- 30-day growth trend: **${toPercent(average(analysis.map((creator) => creator.growth30d)))}**`,
    `- Sentiment consensus: **${toPercent(average(analysis.map((creator) => creator.positiveSentiment)))}**`,
    `- Score dispersion (mean absolute deviation): **${communityVariance.toFixed(2)}**`,
    "",
    "### Ranked activation targets",
    ...topThree.map((creator, index) => `${index + 1}. **${creator.name}** (${creator.archetype}) — score ${creator.influenceScore.toFixed(1)}, engagement ${toPercent(creator.engagementRate)}, reach ${toPercent(creator.reachRate)}`),
    "",
    "### Qualitative read",
    `- Strongest immediate partner: **${topPerformer.name}** due to balanced momentum + audience trust signals.`,
    "- Community appetite favors explainers and trend catalysts; technical depth performs best when bundled with fast demos.",
    "- Recommended message arc: *problem tension → hands-on walkthrough → social proof → challenge prompt*. ",
    "",
    "### Activated specialist agents",
    `- ${selectedText}`,
    "",
    "### Execution module",
    "1. Wave 1 (7 days): seed top-two creators with co-designed narrative packs and measurable CTA links.",
    "2. Wave 2 (14 days): amplify with builder segment + community challenge to compound UGC.",
    "3. Wave 3 (30 days): retain high performers with affiliate tiers, update creative based on sentiment deltas."
  ].join("\n");
}

function computeFactoryReadiness() {
  const weightedAutomation = ventureCapabilities.reduce((sum, capability) => sum + capability.automated * capability.critical, 0);
  const weightedCriticality = ventureCapabilities.reduce((sum, capability) => sum + capability.critical, 0);
  const automationCoverage = weightedAutomation / weightedCriticality;
  const throughputPerDay = 2 * Math.max(0.35, automationCoverage);
  const blockerPenalty = ventureCapabilities.filter((capability) => capability.automated < 0.7).length * 0.06;
  const readinessScore = Math.max(0, Math.min(1, automationCoverage - blockerPenalty));
  return { automationCoverage, throughputPerDay, readinessScore };
}

function renderFactoryModule() {
  const readiness = computeFactoryReadiness();
  capabilityTableBody.innerHTML = "";

  ventureCapabilities.forEach((capability) => {
    const status = capability.automated >= 0.8 ? "Strong" : capability.automated >= 0.6 ? "Partial" : "Critical";
    const row = document.createElement("tr");
    row.innerHTML = `<td>${capability.name}</td><td>${status} (${toPercent(capability.automated)})</td><td>${capability.blocker}</td>`;
    capabilityTableBody.appendChild(row);
  });

  factoryCoverage.textContent = toPercent(readiness.automationCoverage);
  factoryThroughput.textContent = readiness.throughputPerDay.toFixed(2);
  factoryReadiness.textContent = `${(readiness.readinessScore * 100).toFixed(0)}/100`;

  factoryAgentList.innerHTML = "";
  factoryAgents.forEach((agent) => {
    const card = document.createElement("label");
    card.className = "agent-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = state.selectedFactoryAgents.includes(agent.id);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        state.selectedFactoryAgents = [...new Set([...state.selectedFactoryAgents, agent.id])];
      } else {
        state.selectedFactoryAgents = state.selectedFactoryAgents.filter((id) => id !== agent.id);
      }
      updateFactoryBrief();
      persist();
    });

    const meta = document.createElement("div");
    meta.innerHTML = `<strong>${agent.icon} ${agent.name}</strong><span>${agent.mission}</span>`;

    card.append(checkbox, meta);
    factoryAgentList.appendChild(card);
  });
  updateFactoryBrief();
}

function updateFactoryBrief() {
  const selected = factoryAgents.filter((agent) => state.selectedFactoryAgents.includes(agent.id));
  if (!selected.length) {
    factoryBrief.textContent = "No factory agents selected yet.";
    return;
  }
  factoryBrief.innerHTML = selected
    .map((agent) => `<p><strong>${agent.icon} ${agent.name}</strong><br />${agent.output}</p>`)
    .join("");
}

function composeFactoryModulePlan() {
  const readiness = computeFactoryReadiness();
  const selected = factoryAgents.filter((agent) => state.selectedFactoryAgents.includes(agent.id));
  const blockers = ventureCapabilities.filter((capability) => capability.automated < 0.7);
  const blockerText = blockers.map((capability) => `- **${capability.name}**: ${capability.blocker}`).join("\n");

  return [
    "## Venture Factory: 2 Businesses/Day Module",
    "### Throughput diagnostics",
    `- Weighted automation coverage: **${toPercent(readiness.automationCoverage)}**`,
    `- Modeled daily throughput: **${readiness.throughputPerDay.toFixed(2)} businesses/day**`,
    `- Execution readiness: **${(readiness.readinessScore * 100).toFixed(0)}/100**`,
    "",
    "### Capability gaps (highest drag)",
    blockerText || "- No critical capability gaps detected.",
    "",
    "### Must-have tools integration plan",
    "1. **iMessage auto-response (your voice)**: use a local Apple Messages automation bridge + templated voiceprint prompts + human takeover trigger when confidence < 0.72.",
    "2. **Auto resume updater**: pipe daily wins into a structured achievement ledger, then regenerate role-specific bullets with quantified outcomes.",
    "3. **Business Launch Conveyor**: run niche selection, offer generation, checkout deployment, and campaign launch in 4 parallel lanes.",
    "",
    "### 95% automation operating cadence",
    "- 06:00: Generate two validated offers with channel fit score > 0.68.",
    "- 07:30: Auto-deploy two landing funnels and checkout links.",
    "- 09:00: Publish acquisition content and activate influencer + outreach workflows.",
    "- 20:00: Consolidate revenue, push customer replies, update resume proof log.",
    "",
    "### Activated factory agents",
    `- ${selected.map((agent) => `${agent.icon} ${agent.name}`).join(", ") || "None"}`
  ].join("\n");
}

function computeHiveInsights() {
  const factory = computeFactoryReadiness();
  const influencer = analyzeInfluencerCommunity();
  const influencerMomentum = average(influencer.map((creator) => creator.influenceScore / 100));
  const selectedIntensity = (state.selectedFactoryAgents.length + state.selectedInfluencerAgents.length + state.selectedAgents.length)
    / (factoryAgents.length + influencerAgents.length + agentCatalog.length);
  const laneAutonomy = average(subagentHive.map((agent) => agent.autonomy));
  const activeRatio = Math.min(0.99, factory.readinessScore * 0.45 + laneAutonomy * 0.4 + selectedIntensity * 0.15);
  const onlineAgents = Math.round(subagentHive.length * activeRatio);
  const stability = Math.max(0.55, Math.min(0.99, laneAutonomy * 0.58 + factory.readinessScore * 0.27 + influencerMomentum * 0.15));
  const dailyCashProjection = onlineAgents * average(subagentHive.map((agent) => agent.cashImpact)) * 0.085;

  const rankedActions = monetizationVectors
    .map((vector, index) => ({
      ...vector,
      score: activeRatio * (0.94 - index * 0.1) + stability * 0.48 - (1 - factory.readinessScore) * 0.22
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return { onlineAgents, dailyCashProjection, stability, rankedActions };
}

function buildHiveCommandBrief() {
  const insights = computeHiveInsights();
  const session = activeSession();
  const latestUserRequest = [...(session?.messages || [])].reverse().find((message) => message.role === "user")?.content || "No prior user request captured";

  return [
    "You are Hive Commander inside ClawDBot Command Center X.",
    "",
    "### Hive mission",
    "- Deploy and coordinate 300 autonomous subagents across acquisition, offer creation, sales, fulfillment, retention, and analytics.",
    "- Drive the app toward best-in-class revenue execution while maintaining control, auditability, and quality gates.",
    "- Preserve hard requirements: iMessage voice-safe auto response + auto resume updater + conversion telemetry.",
    "",
    "### Current hive diagnostics",
    `- Agents online: ${insights.onlineAgents}/300`,
    `- Daily cash projection: $${Math.round(insights.dailyCashProjection).toLocaleString()}`,
    `- Autonomy stability: ${toPercent(insights.stability)}`,
    "- Priority cash vectors:",
    ...insights.rankedActions.map((action, idx) => `  ${idx + 1}. ${action.title}: ${action.action}`),
    "",
    "### Latest operator request",
    latestUserRequest,
    "",
    "### Required output",
    "1) 6-lane swarm operating plan with lane owners and handoff rules.",
    "2) Risk controls: kill-switch triggers, fraud guardrails, and human override thresholds.",
    "3) 24-hour deployment sprint with measurable cash KPIs.",
    "4) Immediate commands this cockpit can execute now."
  ].join("\n");
}

function renderHiveControl() {
  const insights = computeHiveInsights();
  hiveOnline.textContent = `${insights.onlineAgents}/300`;
  hiveCash.textContent = `$${Math.round(insights.dailyCashProjection).toLocaleString()}`;
  hiveStability.textContent = toPercent(insights.stability);

  hivePriorities.innerHTML = "";
  insights.rankedActions.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.title}</strong>: ${item.action}`;
    hivePriorities.appendChild(li);
  });
}

function stageHiveBrief() {
  const brief = buildHiveCommandBrief();
  composer.value = brief;
  hiveBriefPreview.textContent = brief.slice(0, 420) + (brief.length > 420 ? "…" : "");
  composer.focus();
}

async function deploySubagentHive() {
  const brief = buildHiveCommandBrief();
  addMessage("user", `🐝 Deploy 300-Subagent Hive\n${brief}`, `you • ${nowLabel()}`);

  const insights = computeHiveInsights();
  const response = [
    "## 300-Subagent Hive Deployment",
    "### Deployment telemetry",
    `- **${insights.onlineAgents}/300** agents are greenlit with projected daily cashflow of **$${Math.round(insights.dailyCashProjection).toLocaleString()}**.`,
    `- Stability index currently at **${toPercent(insights.stability)}** with enforced human override on high-risk moves.`,
    "",
    "### 6-lane swarm orchestration",
    "1. **Acquisition lane (50 agents)**: source high-intent demand pockets and shut off channels under margin threshold.",
    "2. **Offer lane (50 agents)**: synthesize and test offer stacks, bonuses, and urgency scripts.",
    "3. **Sales lane (60 agents)**: run response trees, close scripts, and iMessage voice-safe auto follow-up.",
    "4. **Fulfillment lane (45 agents)**: orchestrate delivery quality, handoff timing, and churn prevention.",
    "5. **Retention lane (45 agents)**: trigger upsell/cross-sell ladders from behavior signals.",
    "6. **Analytics lane (50 agents)**: update cash dashboards, resume ledger proof, and anomaly alerts.",
    "",
    "### Immediate cash actions",
    ...insights.rankedActions.map((item, index) => `${index + 1}. ${item.title}: ${item.action}`),
    "",
    "### 24-hour command cadence",
    "- 06:00: launch 12 offer experiments and route leads by urgency score.",
    "- 11:00: auto-send sales follow-ups, escalate only low-confidence threads to human.",
    "- 16:00: push fulfilled win metrics into resume updater and revenue scoreboard.",
    "- 21:00: kill weak campaigns, redeploy agents to the best-performing lane.",
    "",
    "### Operator controls",
    "1. Run Venture Factory, then deploy hive to reflect current automation readiness.",
    "2. Keep human approval for transactions above predefined risk threshold.",
    "3. Re-stage hive brief after each major KPI shift for adaptive retasking."
  ].join("\n");

  const result = addMessage("assistant", state.streaming ? "" : response, "hive-control • generating");
  if (!result) return;
  if (state.streaming) {
    await streamText(result.node, response);
    result.message.content = response;
  }

  result.message.meta = `hive-control • ${nowLabel()}`;
  result.node.querySelector(".message__meta").textContent = result.message.meta;
  hiveBriefPreview.textContent = brief.slice(0, 420) + (brief.length > 420 ? "…" : "");
  updateMetrics();
  renderHiveControl();
  persist();
}

function computeEmailNoteInsights() {
  const totalEmails = emailQueue.reduce((sum, item) => sum + item.volume, 0);
  const weightedSlaPressure = average(emailQueue.map((item) => Math.min(1, 1 / Math.max(1, item.slaHours / 4))));
  const avgRevenueSignal = average(emailQueue.map((item) => item.revenueSignal));
  const totalNotes = notesBacklog.reduce((sum, item) => sum + item.count, 0);
  const clarityIndex = Math.min(0.99, average(notesBacklog.map((item) => item.monetizationLift)) * 0.62 + (1 - Math.min(1, totalNotes / 220)) * 0.38);
  const burnDown = Math.max(0.08, Math.min(0.99, avgRevenueSignal * 0.42 + weightedSlaPressure * 0.38 + clarityIndex * 0.2));

  const prioritizedEmail = [...emailQueue]
    .map((item) => ({
      ...item,
      priority: item.revenueSignal * 0.62 + (1 / Math.max(item.slaHours, 1)) * 0.25 + Math.min(item.volume / 35, 1) * 0.13
    }))
    .sort((a, b) => b.priority - a.priority);

  const prioritizedNotes = [...notesBacklog]
    .map((item) => ({
      ...item,
      sortScore: item.monetizationLift * 0.65 + Math.min(item.count / 45, 1) * 0.35
    }))
    .sort((a, b) => b.sortScore - a.sortScore);

  return { totalEmails, totalNotes, burnDown, avgRevenueSignal, clarityIndex, prioritizedEmail, prioritizedNotes };
}

function renderEmailNotesOps() {
  const insights = computeEmailNoteInsights();
  inboxBurndown.textContent = toPercent(insights.burnDown);
  revenueSignal.textContent = toPercent(insights.avgRevenueSignal);
  noteClarity.textContent = toPercent(insights.clarityIndex);

  emailQueueBody.innerHTML = "";
  insights.prioritizedEmail.slice(0, 5).forEach((item) => {
    const row = document.createElement("tr");
    const priorityLabel = item.priority >= 0.85 ? "P1" : item.priority >= 0.72 ? "P2" : "P3";
    row.innerHTML = `<td>${item.thread} (${item.volume})</td><td>${priorityLabel}</td><td>${item.action}</td>`;
    emailQueueBody.appendChild(row);
  });

  notesBucketBody.innerHTML = "";
  insights.prioritizedNotes.slice(0, 5).forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item.bucket}</td><td>${item.count}</td><td>${item.nextMove}</td>`;
    notesBucketBody.appendChild(row);
  });
}

function composeInboxZeroSprint() {
  const insights = computeEmailNoteInsights();
  const topEmail = insights.prioritizedEmail[0];
  const topNote = insights.prioritizedNotes[0];
  return [
    "## Inbox Zero Sprint (Revenue-first)",
    `- Inbox burn-down capacity: **${toPercent(insights.burnDown)}** across **${insights.totalEmails} active threads**.`,
    `- Revenue signal: **${toPercent(insights.avgRevenueSignal)}** | Notes clarity: **${toPercent(insights.clarityIndex)}**.`,
    "",
    "### 90-minute sequence",
    `1. Clear P1 email cluster first: **${topEmail.thread}** (action: ${topEmail.action}).`,
    "2. Batch P2 threads in two 20-minute windows using templates + one-click snippets.",
    "3. Auto-tag remaining threads: follow-up, delegate, archive, nurture.",
    "",
    "### Notes sorting protocol",
    `- Start with **${topNote.bucket}** to maximize monetization lift.`,
    "- Convert each note into one of: decision, experiment, objection, asset.",
    "- Export decision notes to weekly KPI review and pipeline board.",
    "",
    "### Done when",
    "- P1 inbox reaches zero.",
    "- At least 10 notes transformed into executable tasks.",
    "- Top 3 objections are added to close scripts."
  ].join("\n");
}

async function runNotesSortingProtocol() {
  const sprint = composeInboxZeroSprint();
  addMessage("user", "📬 Run Inbox & Notes Ops Protocol", `you • ${nowLabel()}`);
  const response = [
    sprint,
    "",
    "## Auto-generated next actions",
    "1. Draft 5 high-conversion reply templates (lead follow-up, proposal acceptance, upsell, objection handling, nurture).",
    "2. Build note sorter labels: `cash-now`, `later`, `delegate`, `insight-bank`.",
    "3. Run a twice-daily 15-minute note-to-task conversion sweep.",
    "4. Send end-of-day summary with closed loops, pending decisions, and blocked items."
  ].join("\n");

  const result = addMessage("assistant", state.streaming ? "" : response, "notes-ops • generating");
  if (!result) return;
  if (state.streaming) {
    await streamText(result.node, response);
    result.message.content = response;
  }
  result.message.meta = `notes-ops • ${nowLabel()}`;
  result.node.querySelector(".message__meta").textContent = result.message.meta;
  notesOpsBrief.textContent = `Protocol refreshed at ${nowLabel()}. Focus: ${computeEmailNoteInsights().prioritizedEmail[0].thread}.`;
  updateMetrics();
  persist();
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

async function runInfluencerModule() {
  addMessage("user", "📣 Run Influencer Intelligence Module", `you • ${nowLabel()}`);

  const modulePlan = composeInfluencerActivationPlan();
  const result = addMessage("assistant", state.streaming ? "" : modulePlan, "influencer-module • generating");
  if (!result) return;

  if (state.streaming) {
    await streamText(result.node, modulePlan);
    result.message.content = modulePlan;
  }

  result.message.meta = `influencer-module • ${nowLabel()}`;
  result.node.querySelector(".message__meta").textContent = result.message.meta;
  updateMetrics();
  persist();
}

async function runFactoryModule() {
  addMessage("user", "🏭 Run Venture Factory Module", `you • ${nowLabel()}`);

  const modulePlan = composeFactoryModulePlan();
  const result = addMessage("assistant", state.streaming ? "" : modulePlan, "venture-factory • generating");
  if (!result) return;

  if (state.streaming) {
    await streamText(result.node, modulePlan);
    result.message.content = modulePlan;
  }

  result.message.meta = `venture-factory • ${nowLabel()}`;
  result.node.querySelector(".message__meta").textContent = result.message.meta;
  updateMetrics();
  persist();
}


function computeVexMissionInsights() {
  const integration = average(vexMissionTracks.map((track) => track.status));
  const readiness = Math.min(0.99, integration * 0.7 + (computeFactoryInsights().readinessScore * 0.3));
  const monetization = Math.min(0.99, computeFactoryInsights().throughput / 2 * 0.55 + computeHiveInsights().stability * 0.45);
  return {
    integration,
    readiness,
    monetization,
    prioritizedTracks: [...vexMissionTracks].sort((a, b) => a.status - b.status)
  };
}

function renderVexMissionStack() {
  const insights = computeVexMissionInsights();
  vexIntegrationScore.textContent = toPercent(insights.integration);
  vexReadiness.textContent = toPercent(insights.readiness);
  vexMonetization.textContent = toPercent(insights.monetization);

  vexTrackBody.innerHTML = "";
  insights.prioritizedTracks.forEach((track) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${track.track}</td><td>${toPercent(track.status)}</td><td>${track.nextMove}</td>`;
    vexTrackBody.appendChild(row);
  });
}

function composeVexStackBrief() {
  const insights = computeVexMissionInsights();
  const topGap = insights.prioritizedTracks[0];
  return [
    "### Unified VEX + Command Center stack brief",
    `- Integration score: ${toPercent(insights.integration)}`,
    `- Competition readiness: ${toPercent(insights.readiness)}`,
    `- Monetization traction: ${toPercent(insights.monetization)}`,
    "",
    "#### Priority merge plan",
    ...insights.prioritizedTracks.map((track, idx) => `${idx + 1}. **${track.track}** (${toPercent(track.status)}): ${track.nextMove}`),
    "",
    "#### Unified execution sequence",
    "1. Lock VEX safety/runtime baseline (energy manager + e-stop + telemetry).",
    "2. Tune vision-assisted pickup loop against real object signatures.",
    "3. Wire competition routine presets and fallback state transitions.",
    "4. Connect app ops modules (influencer, factory, hive, inbox/notes) to a weekly monetization scorecard.",
    "5. Ship 14-day sprint with daily KPI check-ins and one hard blocker removal per day."
  ].join("\n");
}

async function buildVexStackBrief() {
  addMessage("user", "🤖 Build unified VEX stack brief", `you • ${nowLabel()}`);
  const brief = composeVexStackBrief();
  const result = addMessage("assistant", state.streaming ? "" : brief, "vex-stack • generating");
  if (!result) return;

  if (state.streaming) {
    await streamText(result.node, brief);
    result.message.content = brief;
  }

  result.message.meta = `vex-stack • ${nowLabel()}`;
  result.node.querySelector(".message__meta").textContent = result.message.meta;
  vexOpsBrief.textContent = `Stack brief staged at ${nowLabel()}. Primary gap: ${computeVexMissionInsights().prioritizedTracks[0].track}.`;
  updateMetrics();
  persist();
}

async function runVexRollout() {
  addMessage("user", "🚀 Run full app + bot rollout", `you • ${nowLabel()}`);
  const rollout = [
    composeVexStackBrief(),
    "",
    "### 7-day rollout cadence",
    "- Day 1: Validate VEX compile/deploy path and baseline safety tests.",
    "- Day 2: Tune autonomous + pickup loops with recorded telemetry.",
    "- Day 3: Launch first monetization workflow using Venture Factory and Inbox/Notes Ops.",
    "- Day 4: Activate influencer module and stage hive brief aligned to first cash channel.",
    "- Day 5: Run competition mode rehearsal + contingency drills.",
    "- Day 6: Publish operator dashboard snapshot and update blockers.",
    "- Day 7: Retrospective, KPI review, and next sprint commitments."
  ].join("\n");

  const result = addMessage("assistant", state.streaming ? "" : rollout, "vex-rollout • generating");
  if (!result) return;
  if (state.streaming) {
    await streamText(result.node, rollout);
    result.message.content = rollout;
  }
  result.message.meta = `vex-rollout • ${nowLabel()}`;
  result.node.querySelector(".message__meta").textContent = result.message.meta;
  vexOpsBrief.textContent = `Rollout generated at ${nowLabel()}. Focus: ${computeVexMissionInsights().prioritizedTracks[0].nextMove}`;
  updateMetrics();
  persist();
}


function computeThreadViralityInsights() {
  const influencer = analyzeInfluencerCommunity();
  const momentum = average(influencer.map((item) => item.influenceScore / 100));
  const factory = computeFactoryInsights();
  const hive = computeHiveInsights();
  const hookStrength = Math.min(0.99, momentum * 0.45 + factory.readinessScore * 0.35 + 0.2);
  const replyDensity = Math.min(0.99, hive.stability * 0.32 + factory.throughput / 2 * 0.28 + 0.3);
  const sharePotential = Math.min(0.99, hookStrength * 0.55 + replyDensity * 0.45);
  return { hookStrength, replyDensity, sharePotential };
}

function renderThreadStudio() {
  const insights = computeThreadViralityInsights();
  threadHookScore.textContent = toPercent(insights.hookStrength);
  threadReplyScore.textContent = toPercent(insights.replyDensity);
  threadShareScore.textContent = toPercent(insights.sharePotential);

  threadChecklist.innerHTML = "";
  viralThreadFramework.checklist.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    threadChecklist.appendChild(li);
  });
}

function composeViralThread() {
  const angle = threadAngle.value.trim() || "How ClawDBot now runs dense autonomous business operations end-to-end";
  const factory = computeFactoryInsights();
  const hive = computeHiveInsights();
  const notes = computeEmailNoteInsights();
  const topHook = viralThreadFramework.hooks[0];

  const posts = [
    `1/8 ${topHook} ${angle}. Thread 🧵`,
    "2/8 Most dashboards show vanity metrics. This one shows execution pressure, cash flow, and next moves. What metric do you trust least?",
    `3/8 We added an Executive Pulse ribbon: cash velocity, factory readiness (${toPercent(factory.readinessScore)}), hive stability (${toPercent(hive.stability)}), and inbox pressure (${Math.round(notes.inboxBurnDown * 100)}%).`,
    "4/8 Revenue waterfall ops: baseline → inflows → outflows → net delta. Add scenario sims, not wishful forecasts. Where is your biggest leak today?",
    "5/8 Agent deep dives now map inputs/outputs, score reliability, and keep human-veto controls on critical actions.",
    "6/8 Hot take: most AI ops stacks are over-designed and under-instrumented. Fewer layers, sharper telemetry, faster execution. Agree or disagree?",
    `7/8 If you want the exact rollout sequence, reply "THREAD" and I will send the template checklist + post cadence (${viralThreadFramework.hashtags.slice(0,3).join(" ")}).`,
    `8/8 Save this and tag one operator building with AI agents. ${viralThreadFramework.hashtags.join(" ")}`
  ];

  return posts.join("\n\n");
}

async function generateThreadBlueprint() {
  addMessage("user", "🧵 Generate 8-post viral thread blueprint", `you • ${nowLabel()}`);
  const thread = composeViralThread();
  const result = addMessage("assistant", state.streaming ? "" : thread, "thread-studio • generating");
  if (!result) return;
  if (state.streaming) {
    await streamText(result.node, thread);
    result.message.content = thread;
  }
  result.message.meta = `thread-studio • ${nowLabel()}`;
  result.node.querySelector(".message__meta").textContent = result.message.meta;
  threadBrief.textContent = `Thread generated at ${nowLabel()}. Lead with: ${viralThreadFramework.hooks[0]}`;
  composer.value = thread;
  updateMetrics();
  persist();
}

function queueThreadLaunchWorkflow() {
  queueAction("Draft viral thread", "thread");
  queueAction("Deploy hive command", "hive");
  queueAction("Generate VEX stack brief", "vex");
  threadBrief.textContent = `Launch workflow queued at ${nowLabel()}.`;
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
    selectedInfluencerAgents: state.selectedInfluencerAgents,
    selectedFactoryAgents: state.selectedFactoryAgents,
    stagedHiveBrief: hiveBriefPreview.textContent,
    notesOpsBrief: notesOpsBrief.textContent,
    vexOpsBrief: vexOpsBrief.textContent,
    threadBrief: threadBrief.textContent,
    launcherPack: state.selectedLauncherPack,
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
runInfluencerModuleBtn.addEventListener("click", runInfluencerModule);
runFactoryModuleBtn.addEventListener("click", runFactoryModule);
stageHiveBriefBtn.addEventListener("click", stageHiveBrief);
deployHiveBtn.addEventListener("click", deploySubagentHive);
draftInboxZeroBtn.addEventListener("click", () => {
  const sprint = composeInboxZeroSprint();
  composer.value = sprint;
  notesOpsBrief.textContent = sprint.slice(0, 240) + (sprint.length > 240 ? "…" : "");
  composer.focus();
});
runNotesSortBtn.addEventListener("click", runNotesSortingProtocol);
buildVexStackBtn.addEventListener("click", buildVexStackBrief);
runVexRolloutBtn.addEventListener("click", runVexRollout);
densityToggle.addEventListener("click", () => {
  state.denseMode = !state.denseMode;
  applyViewModes();
  persist();
});
focusToggle.addEventListener("click", () => {
  state.focusMode = !state.focusMode;
  applyViewModes();
  persist();
});
quickCashPlanBtn.addEventListener("click", () => queueAction("Cash acceleration macro", "cash"));
quickInboxSprintBtn.addEventListener("click", () => queueAction("Inbox sprint draft", "inbox"));
quickHiveDeployBtn.addEventListener("click", () => queueAction("Deploy hive command", "hive"));
quickVexBriefBtn.addEventListener("click", () => queueAction("Generate VEX stack brief", "vex"));
generateThreadBlueprintBtn.addEventListener("click", generateThreadBlueprint);
queueThreadLaunchBtn.addEventListener("click", queueThreadLaunchWorkflow);
stageLauncherPackBtn.addEventListener("click", stageLauncherPack);
runLauncherPackBtn.addEventListener("click", runLauncherPackNow);
runQueuedBtn.addEventListener("click", async () => {
  const queued = [...state.commandQueue];
  for (const item of queued) {
    executeQueuedAction(item.actionId);
  }
  state.commandQueue = [];
  renderCommandQueue();
  persist();
});
clearQueuedBtn.addEventListener("click", () => {
  state.commandQueue = [];
  renderCommandQueue();
  persist();
});
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
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "j") {
    event.preventDefault();
    state.denseMode = !state.denseMode;
    applyViewModes();
    persist();
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
    event.preventDefault();
    state.focusMode = !state.focusMode;
    applyViewModes();
    persist();
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
applyViewModes();
renderSessions();
refreshChat();
hydrateQuickPrompts();
renderAgentForge();
renderInfluencerModule();
renderFactoryModule();
renderEmailNotesOps();
renderVexMissionStack();
renderThreadStudio();
renderLauncherModule();
renderHiveControl();
renderCommandQueue();
renderExecutivePulse();
modelStatus.textContent = `${modelSelect.value} armed`;
