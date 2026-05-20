import type { LanguagePack } from './types';

export const enPack: LanguagePack = {
  ui: {
    brand: 'CONTOSO  MAISON',
    brandSub: 'Atelier · Strategy · Frontier Firm',
    trialTitle: 'Frontier Firm Transformation Trial',
    trialTitleEn: 'FRONTIER FIRM · TRANSFORMATION TRIAL',
    stagePillPrefix: 'Stage',
    nav: {
      warRoom: 'War Room', teams: 'Teams', data: 'Data',
      aiHub: 'AI Hub', competition: 'Competition', roadmap: 'Roadmap', settings: 'Settings',
    },
    hud: { level: 'Lv', energy: 'Energy' },
    buttons: {
      start: 'Begin Mission',
      next: 'Next Stage',
      reset: 'Reset Stage',
      backToMap: 'Back to Map',
      complete: 'Complete Stage',
      tryAgain: 'Try Again',
    },
    panels: {
      challenge: "Chairwoman's Challenge",
      mission: 'Mission Objectives',
      knowledge: 'Knowledge Points',
      hint: 'Hint',
      chairwoman: 'CHAIRWOMAN',
    },
    modal: {
      title: 'Stage Complete',
      body: 'Contoso has completed this transformation phase',
      nextStage: 'Next Stage',
    },
    mapSide: {
      progress: 'Transformation Progress',
      stage: 'Stage',
      nextReward: 'Next Reward',
    },
  },

  stages: [
    // ─────────────────────────────────────────────────────────────
    // TITLE SCREEN
    // ─────────────────────────────────────────────────────────────
    {
      id: 'title',
      type: 'title',
      title: 'CONTOSO MAISON',
      subtitle: 'Frontier Firm Transformation Trial',
    },

    // ─────────────────────────────────────────────────────────────
    // SCENE 0 — MISSION BRIEFING
    // ─────────────────────────────────────────────────────────────
    {
      id: 'mission',
      type: 'briefing',
      title: 'Scene 0 · Mission Briefing',
      subtitle: "Miranda's Challenge",
      challenge: {
        speaker: 'MIRANDA CONTOSO · MAISON QUEEN',
        title: "CHAIRWOMAN'S CHALLENGE",
        body: "Miranda Contoso is the queen of Contoso Maison — the true power behind this fashion empire.\n\nShe defines the brand's aesthetic, sets the direction each season, and decides whether this company stays at the forefront of global fashion.\n\nNow she has summoned you — Contoso Maison's new CTO. Before the next season launch, you must complete a transformation trial you cannot afford to fail.\n\nThis fashion house has world-class design and global influence, yet it is held back by fragmented legacy systems, siloed data, slow processes, and AI pilots that cannot scale.\n\nYour mission: complete 5 Transformation Trials to help Miranda elevate Contoso Maison into a truly AI-driven Frontier Firm.",
        quote: 'The runway waits for no one.\nNeither does transformation.',
      },
      missionObjectives: [
        'As the new CTO, audit legacy systems and identify transformation gaps',
        'Build an enterprise knowledge layer so meetings, documents, and business data become AI-readable assets',
        'Create an AI-ready data foundation so the Data Agent can reliably answer business questions',
        'Deploy enterprise-grade Agents to shift workflows from manual collaboration to intelligent automation',
        'Establish a multi-cloud AI security perimeter to protect models, data, and Agent actions',
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // SCENE 2 — LEVEL MAP
    // ─────────────────────────────────────────────────────────────
    {
      id: 'map',
      type: 'map',
      title: 'Kinky & Lily Are Here to Help You Become a Frontier Firm',
      subtitle: 'As CTO, you just heard Miranda lay out five challenges. Microsoft has sent Kinky and Lily to walk you through the solutions — one stage at a time.',
    },

    // ─────────────────────────────────────────────────────────────
    // STAGE 1 — AGENT-READY APPLICATION
    // ─────────────────────────────────────────────────────────────
    {
      id: 'stage1',
      stageNumber: 1,
      type: 'drag-match',
      title: 'Stage 1: Make Core Systems Agent-Ready',
      subtitle: 'Before deploying more AI Agents, map the legacy landscape and modernize critical Java / .NET apps.',
      storyBrief: `Contoso Maison is advancing its Frontier Firm transformation.

The board wants AI Agents to rapidly connect to the product catalog, orders, inventory, customer data, and supply chain systems — so every department can decide and act faster.

But the IT team has discovered that many core systems are still aging Java / .NET applications. Dependencies are unclear, versions are outdated, and some services are difficult to test, containerize, or allow Agents to connect to safely.

Connecting AI Agents to these core systems right now would not be connecting to the future — it would be connecting to a black box full of unknown dependencies and security risks.

Your mission: first map the legacy application landscape, then modernize critical Java / .NET apps to make the core platform Agent-Ready.`,
      storyBackgroundShort: 'Contoso Maison wants AI Agents to connect to product, inventory, order, customer, and supply chain systems. But many core systems are aging Java / .NET apps with unclear dependencies. For Agents to scale safely, the core platform must first become Agent-Ready.',
      challenge: {
        speaker: 'M. CONTOSO',
        title: "Chairwoman's Challenge",
        body: 'Contoso is advancing toward a Frontier Firm, but AI Agents still cannot safely and in real time connect to the product catalog, pricing, inventory, orders, and store systems. Before the launch season begins, map the legacy application landscape and modernize critical Java / .NET apps into a platform Agents can safely access.',
      },
      missionObjectives: [
        'Map the legacy application landscape and its dependencies',
        'Identify the critical systems to prioritize for modernization',
        'Make key Java / .NET apps upgradeable, testable, and containerizable',
        'Lay the foundation for secure Agent integration',
      ],
      knowledgePoints: [
        {
          title: 'Azure Migrate',
          body: 'Run an assessment to discover what legacy systems and applications exist.',
          icon: 'azure-migrate',
        },
        {
          title: 'GitHub Copilot App Modernization',
          body: 'Upgrade Java / .NET apps and drive testing and containerization.',
          icon: 'github-copilot',
        },
      ],
      hint: 'Drag the correct solution cards onto the matching problems to help Contoso build core system capabilities that Agents can safely access.',
      slots: [
        {
          id: 'slot-legacy-assessment',
          label: 'Problem 1',
          description: "We don't know which legacy apps we have or which systems to modernize first.",
        },
        {
          id: 'slot-app-modernization',
          label: 'Problem 2',
          description: 'Critical Java / .NET apps are outdated — dependencies, vulnerabilities, build issues, and containerization problems mean Agents cannot safely connect.',
        },
      ],
      options: [
        {
          id: 'azure-migrate',
          title: 'Azure Migrate',
          description: 'Discover app landscape, map dependencies, assess migration complexity, identify modernization priorities',
          icon: 'azure-migrate',
          accent: 'blue',
        },
        {
          id: 'github-copilot-appmod',
          title: 'GitHub Copilot App Modernization',
          description: 'Assess Java / .NET code, upgrade frameworks and dependencies, fix Build / CVE issues, add tests, drive containerization',
          icon: 'github-copilot',
          accent: 'gold',
        },
        {
          id: 'power-bi',
          title: 'Power BI',
          description: 'Data visualization and analytics',
          icon: 'power-bi',
          accent: 'gold',
        },
        {
          id: 'teams',
          title: 'Microsoft Teams',
          description: 'Team communication and collaboration',
          icon: 'teams',
          accent: 'purple',
        },
        {
          id: 'sharepoint',
          title: 'SharePoint',
          description: 'Document and content management',
          icon: 'sharepoint',
          accent: 'cyan',
        },
        {
          id: 'defender-cloud',
          title: 'Defender for Cloud',
          description: 'Cloud security posture protection',
          icon: 'defender-cloud',
          accent: 'blue',
        },
      ],
      correctMapping: {
        'slot-legacy-assessment': 'azure-migrate',
        'slot-app-modernization': 'github-copilot-appmod',
      },
    },

    // ─────────────────────────────────────────────────────────────
    // STAGE 2 — MICROSOFT IQ
    // ─────────────────────────────────────────────────────────────
    {
      id: 'stage2',
      stageNumber: 2,
      type: 'drag-match',
      title: 'Stage 2: Equip Agents with Microsoft IQ — Enterprise Intelligence',
      subtitle: 'Help Agents do more than connect to systems — make them understand people, business, and knowledge.',
      storyBrief: `After Stage 1, Contoso Maison knows which core systems need modernization.

But a Frontier Firm is not just about moving systems to the cloud. The real challenge is making the company's knowledge, data, and workflows correctly understandable and usable by AI.

The board now has three distinct needs:

Employees want Copilot to understand the context of meetings, emails, chats, and documents.

Business teams want to query sales, inventory, and operational data using natural language.

IT and innovation teams want to build more advanced Agents that connect to enterprise processes, tools, and systems.

Your mission: select the right Microsoft IQ capability for each scenario so Contoso Maison's AI transformation goes beyond chatting and gradually forms an enterprise intelligence layer.`,
      storyBackgroundShort: 'After core system modernization, Contoso Maison must decide how AI understands work context, data, and business processes. Different teams need different intelligence layers: work context, governed data intelligence, and customizable Agent reasoning.',
      challenge: {
        speaker: 'M. CONTOSO',
        title: "Chairwoman's Challenge",
        body: 'Contoso has a digital foundation and AI Agents that can connect to the platform, but they still don\'t truly "understand" the enterprise. Match the correct IQ to each problem to help Agents genuinely understand the business.',
      },
      missionObjectives: [
        'Match the three correct IQ types to their corresponding enterprise problems',
        'Help Agents understand how the enterprise operates',
        'Make Agents understand people, business, and knowledge',
      ],
      hint: 'Read each problem description carefully, think about which IQ best solves it, then drag the correct IQ card to the matching zone.',
      slots: [
        {
          id: 'slot-work',
          label: 'Problem 1: Agents don\'t understand how people work',
          description: 'Agents have no visibility into what employees are doing — they can\'t interpret meetings, emails, chats, or documents, don\'t understand collaboration relationships, and don\'t know what should happen next.',
        },
        {
          id: 'slot-fabric',
          label: 'Problem 2: Agents don\'t understand how the company runs',
          description: 'Agents can see data but don\'t understand KPIs, business metrics, semantic meaning, defined standards, or business logic.',
        },
        {
          id: 'slot-foundry',
          label: 'Problem 3: Agents can\'t find trusted knowledge',
          description: 'Agents may answer questions but don\'t know which trusted sources to retrieve from, can\'t use enterprise knowledge bases, and cannot guarantee consistent permissions.',
        },
      ],
      options: [
        {
          id: 'work-iq',
          title: 'Work IQ',
          description: 'Understands people, collaboration, meetings, emails, chats, documents, and organizational relationships',
          icon: 'work-iq',
          accent: 'gold',
        },
        {
          id: 'fabric-iq',
          title: 'Fabric IQ',
          description: 'Understands data, KPIs, semantic models, business metrics, and operational logic',
          icon: 'fabric-iq',
          accent: 'cyan',
        },
        {
          id: 'foundry-iq',
          title: 'Foundry IQ',
          description: 'Connects knowledge, RAG, enterprise knowledge bases, trusted retrieval, and consistent permissions',
          icon: 'foundry-iq',
          accent: 'purple',
        },
      ],
      correctMapping: {
        'slot-work': 'work-iq',
        'slot-fabric': 'fabric-iq',
        'slot-foundry': 'foundry-iq',
      },
    },

    // ─────────────────────────────────────────────────────────────
    // STAGE 3 — AI-READY DATA / DATA AGENT
    // ─────────────────────────────────────────────────────────────
    {
      id: 'stage3',
      stageNumber: 3,
      type: 'architecture-fill',
      title: 'Stage 3: Build AI-Ready Data to Make the Data Agent Truly Smart',
      subtitle: 'Without AI-ready data, there is no reliable Data Agent.',
      storyBrief: `Contoso Maison has started building its enterprise intelligence layer — but a problem quickly emerged:

For AI to answer well, data must first be prepared.

Business data is scattered across sales, inventory, supply chain, product, store, and customer systems. Different departments define the same metric differently, and data definitions are inconsistent. Even if Agents can read the data, they may not correctly interpret it.

Without a unified data foundation, semantic models, and enterprise ontology, a Data Agent will only generate answers that sound plausible but may not be reliable.

Your mission: consolidate scattered data into a unified data foundation, build a semantic and ontology layer, and let the Data Agent and Operations Agent reason and act on trusted data.`,
      storyBackgroundShort: 'AI output quality depends on data readiness. Contoso Maison\'s business data is spread across multiple systems with inconsistent definitions and unclear relationships. For Agents to be reliable, the enterprise must build a governed data foundation, semantic layer, and ontology layer.',
      challenge: {
        speaker: 'M. CONTOSO',
        title: "Chairwoman's Challenge",
        body: "Contoso has completed application modernization and understands Microsoft IQ. But when teams started using the Data Agent to analyze products, inventory, members, and stores, the answers were still inconsistent. The problem isn't the AI — the data isn't AI-ready yet. Complete the critical architecture to help Agents truly understand the business and drive operational actions.",
      },
      missionObjectives: [
        'Place 4 critical capability cards in the correct positions',
        'Complete the path from data unification to business semantics to natural language queries',
        'Evolve Agents from answering questions to taking proactive action',
      ],
      hint: 'Think about the sequence: unify data → add business semantics → enable natural language queries → drive proactive operations.',
      slots: [
        { id: 'slot-onelake',          label: 'Unified Data Foundation',         description: 'Data is scattered · Unify scattered enterprise data' },
        { id: 'slot-ontology',         label: 'Business Semantics',               description: 'Business meaning · Teach AI business meaning' },
        { id: 'slot-data-agent',       label: 'Natural Language Data Agent',      description: 'Ask in plain language · Let business users ask data questions' },
        { id: 'slot-operations-agent', label: 'Proactive Operations',             description: 'Proactive ops · Detect risks and trigger actions' },
      ],
      options: [
        { id: 'onelake',          title: 'OneLake',          description: 'Unified data foundation — consolidate scattered data',                icon: 'onelake',          accent: 'cyan' },
        { id: 'ontology',         title: 'Ontology',         description: 'Business semantics — help AI understand business concepts',           icon: 'ontology',         accent: 'purple' },
        { id: 'data-agent',       title: 'Data Agent',       description: 'Natural language data queries and analysis',                         icon: 'data-agent',       accent: 'green' },
        { id: 'operations-agent', title: 'Operations Agent', description: 'Proactive operations, event response, and action triggers',          icon: 'operations-agent', accent: 'pink' },
        { id: 'power-bi',         title: 'Power BI',         description: 'Visualization and report analytics',                                 icon: 'power-bi',         accent: 'gold' },
        { id: 'data-factory',     title: 'Data Factory',     description: 'Data integration and orchestration',                                 icon: 'data-factory',     accent: 'blue' },
        { id: 'data-science',     title: 'Data Science',     description: 'Modeling and experimental analysis',                                 icon: 'data-science',     accent: 'green' },
        { id: 'semantic-model',   title: 'Semantic Model',   description: 'Semantic model object layer',                                        icon: 'semantic-model',   accent: 'purple' },
      ],
      correctMapping: {
        'slot-onelake':          'onelake',
        'slot-ontology':         'ontology',
        'slot-data-agent':       'data-agent',
        'slot-operations-agent': 'operations-agent',
      },
    },

    // ─────────────────────────────────────────────────────────────
    // STAGE 4 — FOUNDRY / AI CHAOS
    // ─────────────────────────────────────────────────────────────
    {
      id: 'stage4',
      stageNumber: 4,
      type: 'drag-match',
      title: 'Stage 4: Tame AI Chaos with Foundry',
      subtitle: 'Consolidate scattered Agents, models, and governance capabilities into an enterprise AI platform.',
      storyBrief: `Contoso Maison's AI teams are no longer satisfied with standard Copilot.

The innovation team has started exploring more open Agent architectures:

Some teams use Openclaw to build extensible Agent workbenches.

Some teams are researching Hermes Agent — an Agent that emphasizes autonomous reasoning and tool invocation.

Engineering teams have started using Qwen as an open-source model foundation to build AI capabilities closer to local business and language needs.

These capabilities are accelerating Contoso Maison's AI innovation — but also introducing new risks:

Different Agents connect to tools in inconsistent ways.

Different models have inconsistent security boundaries and output quality.

Teams are independently connecting to CRM, ERP, product, supply chain, and document systems — causing duplicated development and governance gaps.

Without unified permissions, tool registration, session isolation, logging, and security policies, these Agents will quickly go from innovative experiments to enterprise liabilities.

Your mission: don't stop the innovation — bring Openclaw, Hermes Agent, Qwen, and other open Agents and models into enterprise governance so they can safely connect to core systems and converge toward a manageable, monitorable, and reusable Agent Platform.`,
      storyBackgroundShort: 'Contoso Maison is experimenting with Openclaw, Hermes Agent, and Qwen to accelerate open Agent innovation. But different Agent runtimes, model behaviors, tool connections, and security boundaries introduce new enterprise risk. The goal is not to stop innovation — but to manage these capabilities through a reusable, observable, and governed Agent Platform.',
      challenge: {
        speaker: 'M. CONTOSO',
        title: "Chairwoman's Challenge",
        body: 'Departments have started independently using OpenClaw, Hermes Agent, and Qwen Model. Innovation is fast — but AI silos, invisible invocations, and uncontrollable security have emerged. Drag the scattered AI assets into the correct Foundry zones.',
      },
      missionObjectives: [
        'Understand the three core capabilities of Foundry',
        'Place scattered AI assets in the correct zones',
        'Build a secure, observable, and governed AI platform',
      ],
      knowledgePoints: [
        { title: 'Foundry Hosted Agent',          body: 'Stop Agents from running in isolation — bring them into a unified managed environment.',  icon: 'hosted-agent' },
        { title: 'Foundry Fireworks',             body: 'Turn open-source models from experimental tools into production-ready inference capabilities.', icon: 'fireworks' },
        { title: 'Observability + Control Plane', body: 'Give the enterprise visibility, manageability, and control over AI and Agents.',             icon: 'control-plane' },
      ],
      hint: 'First determine whether it is an Agent, a Model, or a Governance Signal.',
      sidebarPanels: {
        chairwomanTitle: "CHAIRWOMAN'S CHALLENGE",
        chairwomanBody: "Departments have already deployed OpenClaw, Hermes Agent, and Qwen Model. Innovation is fast — but the platform is becoming fragmented, invisible, and hard to govern.\n\nTake these existing AI assets and bring them into the correct Foundry zones to build a unified enterprise AI platform.",
        chairwomanSignature: 'M. CONTOSO',
        missionTitle: 'Mission Objectives',
        platformStatusTitle: 'PLATFORM STATUS',
        hintTitle: 'NEED A HINT?',
        hintBody: 'Ask Lily for knowledge-point hints — Miranda will deduct points.\nEACH HINT -150 PTS',
      },
      platformStatus: [
        { slotId: 'hosted-agent', label: 'Hosted Agents', target: 2 },
        { slotId: 'model-runtime', label: 'Managed Models', target: 1 },
        { slotId: 'control-plane', label: 'Governance Signals', target: 2 },
      ],
      slots: [
        {
          id: 'hosted-agent',
          label: 'Foundry Hosted Agent',
          subtitleEn: 'Host Existing Agents',
          subtitleZh: '统一托管现有 Agent',
          description: 'Bring scattered Agents under unified management — providing a hosted runtime, session isolation, lifecycle management, permissions, and tool access.',
          dropHint: 'DROP EXISTING AGENTS HERE',
          icon: 'hosted-agent',
          capacity: 2,
        },
        {
          id: 'model-runtime',
          label: 'Foundry Fireworks',
          subtitleEn: 'Run Open Models',
          subtitleZh: '统一运行开源模型',
          description: 'Run open-source models in a unified production environment with support for evaluation, deployment, scaling, and inference — ensuring performance and stability.',
          dropHint: 'DROP MODEL ASSETS HERE',
          icon: 'fireworks',
          capacity: 1,
        },
        {
          id: 'control-plane',
          label: 'Observability + Control Plane',
          subtitleEn: 'Govern, Observe, Protect',
          subtitleZh: '统一观测与治理',
          description: 'Unified observability, logging, policies, and control plane for end-to-end tracing, cost / latency monitoring, and risk governance.',
          dropHint: 'DROP GOVERNANCE SIGNALS HERE',
          icon: 'control-plane',
          capacity: 2,
        },
      ],
      options: [
        {
          id: 'openclaw',
          title: 'OpenClaw',
          typeLabel: 'AGENT',
          team: 'Design Team',
          description: 'Workflow Agent built by the design process team',
          status: 'Running independently',
          category: 'agent',
          targetZone: 'hosted-agent',
          icon: 'openclaw',
          accent: 'cyan',
        },
        {
          id: 'hermes-agent',
          title: 'Hermes Agent',
          typeLabel: 'AGENT',
          team: 'Ops Team',
          description: 'Task Agent built by the business unit — not on the unified platform',
          status: 'Running independently',
          category: 'agent',
          targetZone: 'hosted-agent',
          icon: 'hermes-agent',
          accent: 'gold',
        },
        {
          id: 'qwen-model',
          title: 'Qwen Model',
          typeLabel: 'MODEL',
          team: 'China Team',
          description: 'Open-source model currently deployed independently',
          status: 'Deployed independently',
          category: 'model',
          targetZone: 'model-runtime',
          icon: 'qwen',
          accent: 'purple',
        },
        {
          id: 'trace-log',
          title: 'Trace Log',
          typeLabel: 'LOG',
          team: 'Platform Team',
          description: 'Scattered execution logs generated by Agent invocations',
          status: 'Stored separately',
          category: 'governance',
          targetZone: 'control-plane',
          icon: 'trace-log',
          accent: 'blue',
        },
        {
          id: 'prompt-injection-policy',
          title: 'Prompt Injection Policy',
          typeLabel: 'POLICY',
          team: 'Security Team',
          description: 'Prompt injection protection policy maintained independently by the security team',
          status: 'Maintained separately',
          category: 'governance',
          targetZone: 'control-plane',
          icon: 'shield',
          accent: 'green',
        },
      ],
      correctMapping: {
        'hosted-agent': ['openclaw', 'hermes-agent'],
        'model-runtime': ['qwen-model'],
        'control-plane': ['trace-log', 'prompt-injection-policy'],
      },
      completionTitle: 'AI Chaos Consolidated',
      completionMessage: 'Your enterprise AI assets are now in Foundry — unified hosting, model runtime, observability, and governance in place.',
      completionButtonLabel: 'Next Stage',
    },

    // ─────────────────────────────────────────────────────────────
    // STAGE 5 — AI SAFETY BOUNDARY
    // ─────────────────────────────────────────────────────────────
    {
      id: 'stage5',
      stageNumber: 5,
      type: 'safety-boundary',
      title: "Stage 5: Defend the Frontier Firm's AI Security Boundary",
      subtitle: 'Place 3 security capabilities in the correct positions to complete an end-to-end AI security chain.',
      storyBrief: `Contoso Maison's AI transformation has entered its final phase.

Different teams are using models and Agents across different clouds:

Azure hosts OpenAI.

Anthropic Cloud hosts Claude.

Google Cloud hosts Gemini.

These capabilities are accelerating business innovation — but also introducing new risks:

Different model entry points lack consistent security policies.

Prompt injection, unauthorized tool invocations, sensitive data leakage, and unsafe outputs can all occur across a multi-cloud environment.

Meanwhile, cloud infrastructure, AI workloads, and content safety all need to be monitored and protected in a unified way.

Your mission: place Content Safety, Defender for AI, and Defender for Cloud in the correct positions to build a security perimeter that covers multi-cloud AI workloads.`,
      storyBackgroundShort: 'Contoso Maison is currently running AI on Azure OpenAI, Claude on Anthropic Cloud, and Gemini on Google Cloud simultaneously. Innovation is accelerating, but AI security, content safety, and cloud security posture must be consistently governed across all clouds.',
      challenge: {
        speaker: 'M. CONTOSO',
        title: "Chairwoman's Challenge",
        body: 'Contoso has connected Agents to Claude, Gemini, and OpenAI. Now you need to place 3 security capabilities in the correct positions to complete an end-to-end AI security chain — from input to output, spanning multiple clouds.',
      },
      missionObjectives: [
        'Protect Prompt inputs and model output safety',
        'Detect Runtime anomalies and potential threats',
        'Discover and protect cross-cloud AI workloads and configuration risks',
      ],
      knowledgePoints: [
        { title: 'Content Safety',     body: 'Protect Prompt / Response safety.',         icon: 'content-safety' },
        { title: 'Defender for AI',    body: 'Detect AI Runtime threats.',                icon: 'defender-ai' },
        { title: 'Defender for Cloud', body: 'Discover and assess cross-cloud AI Workloads.', icon: 'defender-cloud' },
      ],
      hint: 'Think about the sequence: input/output guardrails → Runtime threat detection → multi-cloud Workload boundary protection.',
      slots: [
        { id: 'slot-a', label: 'A · Prompt / Response Guardrail', description: 'Check Prompt input and model output safety' },
        { id: 'slot-b', label: 'B · AI Runtime Threat Detection', description: 'Detect Runtime anomalies and threats' },
        { id: 'slot-c', label: 'C · Multi-cloud AI Workload Protection', description: 'Discover and protect cross-cloud AI workloads and configuration risks' },
      ],
      options: [
        { id: 'content-safety', title: 'Content Safety',     description: 'Content safety — protect Prompt and response safety',     icon: 'content-safety', accent: 'purple' },
        { id: 'defender-ai',    title: 'Defender for AI',    description: 'AI security — protect Runtime and users',                  icon: 'defender-ai',    accent: 'green' },
        { id: 'defender-cloud', title: 'Defender for Cloud', description: 'Cloud security — protect multi-cloud workloads',           icon: 'defender-cloud', accent: 'blue' },
      ],
      correctMapping: {
        'slot-a': 'content-safety',
        'slot-b': 'defender-ai',
        'slot-c': 'defender-cloud',
      },
    },
  ],
};
