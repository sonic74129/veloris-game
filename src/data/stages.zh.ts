import type { LanguagePack } from './types';

export const zhPack: LanguagePack = {
  ui: {
    brand: 'CONTOSO  MAISON',
    brandSub: 'Atelier · Strategy · Frontier Firm',
    trialTitle: 'Frontier Firm 转型试炼',
    trialTitleEn: 'FRONTIER FIRM · TRANSFORMATION TRIAL',
    stagePillPrefix: '关卡',
    nav: {
      warRoom: '作战室', teams: 'Teams', data: '资料',
      aiHub: 'AI 中枢', competition: '竞品', roadmap: '路线图', settings: '设置',
    },
    hud: { level: 'Lv', energy: '能量' },
    buttons: {
      start: '开始任务',
      next: '进入下一关',
      reset: '重置本关',
      backToMap: '返回路线图',
      complete: '完成本关',
      tryAgain: '再试一次',
    },
    panels: {
      challenge: 'Chairwoman 的挑战',
      mission: '本关任务目标',
      knowledge: '能力知识点',
      hint: '通关提示',
      chairwoman: 'CHAIRWOMAN · 董事长',
    },
    modal: {
      title: '通关成功',
      body: 'Contoso 已完成本阶段转型能力',
      nextStage: '进入下一关',
    },
    mapSide: {
      progress: '转型进度',
      stage: '关卡',
      nextReward: '下一个奖励',
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
      subtitle: 'Frontier Firm 转型试炼',
    },
    // ─────────────────────────────────────────────────────────────
    // SCENE 0 — MISSION BRIEFING
    // ─────────────────────────────────────────────────────────────
    {
      id: 'mission',
      type: 'briefing',
      title: '第 0 关 · 任务简报',
      subtitle: 'Miranda 的挑战',
      challenge: {
        speaker: 'MIRANDA CONTOSO · MAISON QUEEN',
        title: 'CHAIRWOMAN 的挑战',
        body: 'Miranda Contoso 是 Contoso Maison 的女王级掌权者，也是这家时尚帝国真正的大老板。\n\n她定义品牌审美，决定每一季的方向，也决定这家公司是否能继续站在全球时尚的最前线。\n\n现在，她召见了你——Contoso Maison 新任 CTO。在下一季发布前，你必须完成一场不容失败的 AI 转型试炼。\n\n这家时尚集团拥有顶级设计与全球影响力，却被分散的旧系统、割裂的数据、缓慢的流程和无法规模化的 AI 试点拖住脚步。\n\n你的任务，是通过 5 场 Transformation Trial，帮助 Miranda 将 Contoso Maison 升级为真正的 AI-driven Frontier Firm。',
        quote: '秀场不会等待任何人。\n转型也不会。',
      },
      missionObjectives: [
        '作为新任 CTO，盘点旧系统与关键应用，找出转型断点',
        '建立企业知识层，让会议、文件与业务数据成为 AI 可理解的资产',
        '打造 AI-ready data foundation，让 Data Agent 能可靠回答业务问题',
        '部署企业级 Agent，让流程从人工协作走向智能自动化',
        '建立多云 AI 安全防线，保护模型、数据与 Agent 行动',
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // SCENE 2 — LEVEL MAP
    // ─────────────────────────────────────────────────────────────
    {
      id: 'map',
      type: 'map',
      title: 'Kinky 与 Lily 助你成为 Frontier Firm',
      subtitle: '作为 CTO，你刚刚听完 Miranda 在场景一提出的五大挑战。微软派来了 Kinky 与 Lily，专为你的企业一一拆解解法。',

    },

    // ─────────────────────────────────────────────────────────────
    // STAGE 1 — AGENT-READY APPLICATION
    // ─────────────────────────────────────────────────────────────
    {
      id: 'stage1',
      stageNumber: 1,
      type: 'drag-match',
      title: '第 1 关：让核心系统具备 Agent-Ready 能力',
      subtitle: '在部署更多 AI Agent 前，先看清旧系统版图，再现代化关键 Java / .NET 应用。',
      storyBrief: `Contoso Maison 正在推进 Frontier Firm 转型。

    董事会希望 AI Agent 能快速接入商品目录、订单、库存、客户资料与供应链系统，让各部门可以更快决策、更快行动。

    但 IT 团队发现，许多核心系统仍是老旧 Java / .NET 应用。系统依赖关系不清，应用版本过旧，部分服务难以测试、难以容器化，也无法安全地让 Agent 直接接入。

    如果现在就让 AI Agent 连接这些核心系统，Agent 接上的不是未来，而是一个充满未知依赖与安全风险的黑盒。

    你的任务是：先看清老旧系统版图，再现代化关键 Java / .NET 应用，让核心系统成为 Agent-Ready 的平台。`,
      storyBackgroundShort: 'Contoso Maison 希望 AI Agent 能连接商品、库存、订单、客户与供应链系统。但许多核心系统仍是老旧 Java / .NET 应用，依赖关系不清。要让 Agent 安全规模化，核心平台必须先成为 Agent-Ready。',
      challenge: {
        speaker: 'M. CONTOSO',
        title: 'Chairwoman 的挑战',
        body: 'Contoso 正在迈向 Frontier Firm，但 AI Agent 还无法安全、实时地连接商品目录、价格、库存、订单与门店系统。在发布季开始前，请先看清老旧应用版图，再把关键 Java / .NET 应用现代化成可供 Agent 安全接入的平台。',
      },
      missionObjectives: [
        '看清老旧应用版图与依赖',
        '选出优先现代化的关键系统',
        '让关键 Java / .NET 应用可升级、可测试、可容器化',
        '为 Agent 的安全整合打下基础',
      ],
      knowledgePoints: [
        {
          title: 'Azure Migrate',
          body: '先做 assessment，帮助你知道有哪些老旧系统与应用。',
          icon: 'azure-migrate',
        },
        {
          title: 'GitHub Copilot App Modernization',
          body: '帮助升级 Java / .NET 应用，并推进测试与容器化。',
          icon: 'github-copilot',
        },
      ],
      hint: '拖拽正确的解决方案卡片到对应问题上，帮助 Contoso 建立可被 Agent 安全接入的核心系统能力。',
      slots: [
        {
          id: 'slot-legacy-assessment',
          label: '问题 1',
          description: '我们不知道有哪些老旧应用，也不知道该先改哪些系统。',
        },
        {
          id: 'slot-app-modernization',
          label: '问题 2',
          description: '关键 Java / .NET 应用过旧，存在依赖、漏洞、Build 与容器化问题，Agent 无法安全接入。',
        },
      ],
      options: [
        {
          id: 'azure-migrate',
          title: 'Azure Migrate',
          description: '发现应用版图、梳理依赖关系、评估迁移复杂度、识别现代化优先级',
          icon: 'azure-migrate',
          accent: 'blue',
        },
        {
          id: 'github-copilot-appmod',
          title: 'GitHub Copilot App Modernization',
          description: '评估 Java / .NET 代码、升级框架与依赖、修复 Build / CVE、补充测试、推进容器化',
          icon: 'github-copilot',
          accent: 'gold',
        },
        {
          id: 'power-bi',
          title: 'Power BI',
          description: '数据可视化分析',
          icon: 'power-bi',
          accent: 'gold',
        },
        {
          id: 'teams',
          title: 'Microsoft Teams',
          description: '团队沟通协作',
          icon: 'teams',
          accent: 'purple',
        },
        {
          id: 'sharepoint',
          title: 'SharePoint',
          description: '文档与内容管理',
          icon: 'sharepoint',
          accent: 'cyan',
        },
        {
          id: 'defender-cloud',
          title: 'Defender for Cloud',
          description: '云安全态势防护',
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
      title: '第 2 关：为 Agent 装上 Microsoft IQ 企业智能层',
      subtitle: '让 Agent 不只接上系统，更懂人、懂业务、懂知识。',
      storyBrief: `第一关完成后，Contoso Maison 已经知道哪些核心系统需要现代化。

    但 Frontier Firm 不是只把系统搬到云上。真正的挑战是：让企业的知识、数据与工作流程，都能被 AI 正确理解与使用。

    董事会现在提出三个不同的需求：

    员工希望 Copilot 能理解会议、邮件、聊天与文件脉络。

    业务团队希望能用自然语言查询销售、库存与营运数据。

    IT 与创新团队希望能建立更进阶的 Agent，连接企业流程、工具与系统。

    你的任务是：为不同场景选择正确的 Microsoft IQ 能力，让 Contoso Maison 的 AI 转型不只是聊天，而是逐步形成企业智能层。`,
      storyBackgroundShort: '完成核心系统现代化后，Contoso Maison 需要决定 AI 如何理解工作场景、数据与业务流程。不同团队需要不同智能层：工作上下文、受治理的数据智能，以及可定制的 Agent 推理能力。',
      challenge: {
        speaker: 'M. CONTOSO',
        title: 'Chairwoman 的挑战',
        body: 'Contoso 已经有底层数据化，AI Agent 也能接入平台，但它们仍然不够"懂企业"。请将正确的 IQ 推到对应的问题，帮助 Agent 真正理解企业。',
      },
      missionObjectives: [
        '将正确的三种 IQ 匹配到对应的企业问题',
        '帮助 Agent 理解企业如何运转',
        '让 Agent 懂人、懂业务、懂知识',
      ],
      hint: '请仔细阅读每个问题描述，思考哪一种 IQ 最能解决该问题，然后将正确的 IQ 卡片拖到对应区域。',
      slots: [
        {
          id: 'slot-work',
          label: '问题 1：Agent 不懂人怎么工作',
          description: 'Agent 不知道员工在做什么，看不懂会议、邮件、聊天、文件，不理解协作关系，也不知道下一步该做什么。',
        },
        {
          id: 'slot-fabric',
          label: '问题 2：Agent 不懂公司怎么运转',
          description: 'Agent 能看到数据，但不理解 KPI、业务指标、语义含义、定义规范，也不懂业务逻辑。',
        },
        {
          id: 'slot-foundry',
          label: '问题 3：Agent 找不到可信知识',
          description: 'Agent 可能会回答问题，但不知道从哪里检索可信知识，也不会使用企业知识库，更无法保证权限一致。',
        },
      ],
      options: [
        {
          id: 'work-iq',
          title: 'Work IQ',
          description: '理解人、协作、会议、邮件、聊天、文件与组织关系',
          icon: 'work-iq',
          accent: 'gold',
        },
        {
          id: 'fabric-iq',
          title: 'Fabric IQ',
          description: '理解数据、KPI、语义模型、业务指标与运营逻辑',
          icon: 'fabric-iq',
          accent: 'cyan',
        },
        {
          id: 'foundry-iq',
          title: 'Foundry IQ',
          description: '连接知识、RAG、企业知识库、可信检索与权限一致',
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
      title: '第 3 关：打造 AI-Ready Data，让 Data Agent 真正变聪明',
      subtitle: '没有 AI-ready data，就没有可靠的 Data Agent。',
      storyBrief: `Contoso Maison 已经开始建立企业智能层，但很快发现一个问题：

    AI 要回答得好，数据必须先准备好。

    业务数据散落在销售、库存、供应链、商品、门店与客户系统中。不同部门对同一个指标有不同定义，数据口径不一致。Agent 即使能读到数据，也不一定能正确理解数据。

    如果没有统一的数据基础、语义模型与企业本体，Data Agent 只会生成看似合理、但不一定可靠的答案。

    你的任务是：把分散的数据汇入统一数据基础，建立语义与本体层，让 Data Agent 和 Operation Agent 可以基于可信数据做推理与行动。`,
      storyBackgroundShort: 'AI 结果质量取决于数据准备度。Contoso Maison 的业务数据分散在多个系统中，定义不一致、关系不清。要让 Agent 可靠，企业必须建立受治理的数据基础、语义层与本体层。',
      challenge: {
        speaker: 'M. CONTOSO',
        title: 'Chairwoman 的挑战',
        body: 'Contoso 已完成应用现代化，也理解了 Microsoft IQ。但当团队开始用 Data Agent 分析商品、库存、会员与门店时，答案仍不稳定。问题不在 AI，而是数据还没有 AI-ready。请补全关键架构，让 Agent 真正理解业务，并推动运营行动。',
      },
      missionObjectives: [
        '将 4 张关键能力卡放到正确位置',
        '完成从数据统一到业务语义再到问数的路径',
        '让 Agent 从回答问题进化到主动行动',
      ],
      hint: '先想顺序：数据统一 → 业务语义 → 自然语言问数 → 主动运营。',
      slots: [
        { id: 'slot-onelake',          label: 'Unified Data Foundation',         description: '数据分散 · Unify scattered enterprise data' },
        { id: 'slot-ontology',         label: 'Business Semantics',               description: '业务语义 · Teach AI business meaning' },
        { id: 'slot-data-agent',       label: 'Natural Language Data Agent',      description: '自然语言问数 · Let business users ask data questions' },
        { id: 'slot-operations-agent', label: 'Proactive Operations',             description: '主动运营 · Detect risks and trigger actions' },
      ],
      options: [
        { id: 'onelake',          title: 'OneLake',          description: '统一数据底座，整合分散数据',           icon: 'onelake',          accent: 'cyan' },
        { id: 'ontology',         title: 'Ontology',         description: '建立业务语义，让 AI 理解业务概念',      icon: 'ontology',         accent: 'purple' },
        { id: 'data-agent',       title: 'Data Agent',       description: '支持自然语言问数与分析',               icon: 'data-agent',       accent: 'green' },
        { id: 'operations-agent', title: 'Operations Agent', description: '支持主动运营、事件响应与行动触发',     icon: 'operations-agent', accent: 'pink' },
        { id: 'power-bi',         title: 'Power BI',         description: '可视化与报表分析',                     icon: 'power-bi',         accent: 'gold' },
        { id: 'data-factory',     title: 'Data Factory',     description: '数据集成与调度',                       icon: 'data-factory',     accent: 'blue' },
        { id: 'data-science',     title: 'Data Science',     description: '建模与实验分析',                       icon: 'data-science',     accent: 'green' },
        { id: 'semantic-model',   title: 'Semantic Model',   description: '语义模型对象层',                       icon: 'semantic-model',   accent: 'purple' },
      ],
      correctMapping: {
        'slot-onelake':          'onelake',
        'slot-ontology':         'ontology',
        'slot-data-agent':       'data-agent',
        'slot-operations-agent': 'operations-agent',
      },
    },

    // ─────────────────────────────────────────────────────────────
    // STAGE 4 — FOUNDRY / AI CHAOS (multi-card per slot)
    // ─────────────────────────────────────────────────────────────
    {
      id: 'stage4',
      stageNumber: 4,
      type: 'drag-match',
      title: '第 4 关：用 Foundry 收编 AI Chaos',
      subtitle: '把分散的 Agent、模型与治理能力，整理成企业级 AI 平台。',
      storyBrief: `Contoso Maison 的 AI 团队已经不满足于只使用标准 Copilot。

    创新团队开始尝试更开放的 Agent 架构：

    有些团队用 Openclaw 建立可扩展的 Agent 工作台。

    有些团队研究 Hermes Agent 这类更强调自主推理与工具调用的 Agent。

    也有工程团队开始使用 Qwen 作为开源模型基础，打造更贴近本地业务与中文场景的 AI 能力。

    这些能力让 Contoso Maison 的 AI 创新速度变快，但也带来新的风险：

    不同 Agent 的工具接入方式不一致。

    不同模型的安全边界与输出质量不一致。

    各团队各自接 CRM、ERP、商品、供应链与文件系统，造成重复开发与治理断裂。

    如果没有统一的权限、工具注册、session 隔离、日志监控与安全策略，这些 Agent 很快就会从创新实验变成企业风险。

    你的任务是：不要阻止创新，而是把 Openclaw、Hermes Agent、Qwen 这类开放式 Agent 与模型能力纳入企业级治理，让它们可以安全地接入核心系统，并逐步收敛到可管理、可监控、可复用的 Agent Platform。`,
      storyBackgroundShort: 'Contoso Maison 正在试验 Openclaw、Hermes Agent 与 Qwen 以加速开放式 Agent 创新。但不同 Agent 运行时、模型行为、工具连接与安全边界带来了新的企业风险。目标不是阻止创新，而是通过可复用、可观测、可治理的 Agent Platform 管理这些能力。',
      challenge: {
        speaker: 'M. CONTOSO',
        title: 'Chairwoman 的挑战',
        body: '各部门开始自己使用 OpenClaw、Hermes Agent 和 Qwen Model。创新很快，但也出现 AI 孤岛、调用不可见、安全不可控的问题。请把散落的 AI 资产拖到正确的 Foundry 区域。',
      },
      missionObjectives: [
        '理解 Foundry 三大核心能力',
        '将散落的 AI 资产放到正确区域',
        '建立安全、可观测、可治理的 AI 平台',
      ],
      knowledgePoints: [
        { title: 'Foundry Hosted Agent',          body: '让 Agent 不再散落运行，而是进入统一托管环境。',         icon: 'hosted-agent' },
        { title: 'Foundry Fireworks',             body: '让开源模型从实验模型变成可生产运行的推理能力。',         icon: 'fireworks' },
        { title: 'Observability + Control Plane', body: '让企业看得见、管得住、控得了 AI 与 Agent。',             icon: 'control-plane' },
      ],
      hint: '先判断它是 Agent、Model，还是 Governance Signal。',
      sidebarPanels: {
        chairwomanTitle: 'CHAIRWOMAN 的挑战',
        chairwomanBody: '各部门已经陆续上线了 OpenClaw、Hermes Agent 和 Qwen Model。创新很快，但平台正在变得碎片化、不可见、难以治理。\n\n请你把这些已有的 AI 资产，收编到正确的 Foundry 区域，建立统一的企业级 AI 平台。',
        chairwomanSignature: 'M. CONTOSO',
        missionTitle: '本关任务目标',
        platformStatusTitle: '收编进度 / PLATFORM STATUS',
        hintTitle: '需要提示？ / NEED A HINT?',
        hintBody: '向 Lily 请求本关知识点提示，Miranda 会扣分。\nEACH HINT -150 PTS',
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
          description: '将分散的 Agent 统一纳管，提供托管运行环境、session 隔离、生命周期管理、权限与工具接入。',
          dropHint: 'DROP EXISTING AGENTS HERE',
          icon: 'hosted-agent',
          capacity: 2,
        },
        {
          id: 'model-runtime',
          label: 'Foundry Fireworks',
          subtitleEn: 'Run Open Models',
          subtitleZh: '统一运行开源模型',
          description: '将开源模型在生产环境中统一运行，支持评估、部署、扩展与推理，保障性能与稳定性。',
          dropHint: 'DROP MODEL ASSETS HERE',
          icon: 'fireworks',
          capacity: 1,
        },
        {
          id: 'control-plane',
          label: 'Observability + Control Plane',
          subtitleEn: 'Govern, Observe, Protect',
          subtitleZh: '统一观测与治理',
          description: '统一可观测性、日志、策略与控制平面，实现全链路追踪、成本 / 延迟监控与风险治理。',
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
          description: '设计流程团队自建的工作流 Agent',
          status: '独立运行中',
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
          description: '业务部门自建任务 Agent，未纳入统一平台',
          status: '独立运行中',
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
          description: '当前独立部署的开源模型服务',
          status: '独立部署中',
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
          description: '各 Agent 调用产生的分散执行日志',
          status: '分散存储中',
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
          description: '安全团队单独制定的提示注入防护策略',
          status: '独立维护中',
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
      completionMessage: '你的企业 AI 资产已纳入 Foundry，实现统一托管、模型运行、可观测与可治理。',
      completionButtonLabel: '进入下一关',
    },

    // ─────────────────────────────────────────────────────────────
    // STAGE 5 — AI SAFETY BOUNDARY
    // ─────────────────────────────────────────────────────────────
    {
      id: 'stage5',
      stageNumber: 5,
      type: 'safety-boundary',
      title: '第 5 关：守住 AI Frontier Firm 的安全边界',
      subtitle: '把 3 个安全能力放到正确位置，完成端到端 AI 安全防护链路。',
      storyBrief: `Contoso Maison 的 AI 转型已经进入最后阶段。

    不同团队开始使用不同云上的模型与 Agent：

    Azure 上有 OpenAI。

    Anthropic Cloud 上有 Claude。

    Google Cloud 上有 Gemini。

    这些能力让业务创新速度变快，但也带来新的风险：

    不同模型入口缺乏一致的安全策略。

    Prompt injection、越权工具调用、敏感数据泄露与不安全输出，都可能在多云环境中发生。

    同时，云端基础设施、AI 工作负载与内容安全也需要被统一监控与保护。

    你的任务是：把 Content Safety、Defender for AI 与 Defender for Cloud 放到正确位置，建立一个能覆盖多云 AI 工作负载的安全防线。`,
      storyBackgroundShort: 'Contoso Maison 目前在 Azure OpenAI、Anthropic Cloud 的 Claude 与 Google Cloud 的 Gemini 上同时运行 AI。创新正在加速，但 AI 安全、内容安全与云安全态势必须在多云之间保持一致治理。',
      challenge: {
        speaker: 'M. CONTOSO',
        title: 'Chairwoman 的挑战',
        body: 'Contoso 已将 Agent 连接到 Claude、Gemini 与 OpenAI。现在，你需要将 3 个安全能力放到正确位置，完成一条从输入到输出、横跨多云的端到端 AI 安全防护链路。',
      },
      missionObjectives: [
        '保护 Prompt 输入与模型输出安全',
        '侦测 Runtime 异常行为与潜在威胁',
        '发现并保护跨云 AI workloads 与配置风险',
      ],
      knowledgePoints: [
        { title: 'Content Safety',     body: '保护 Prompt / Response 安全。',     icon: 'content-safety' },
        { title: 'Defender for AI',    body: '侦测 AI Runtime 威胁。',            icon: 'defender-ai' },
        { title: 'Defender for Cloud', body: '发现与评估跨云 AI Workloads。',     icon: 'defender-cloud' },
      ],
      hint: '先想顺序：输入输出护栏 → Runtime 威胁侦测 → 多云 Workload 边界保护。',
      slots: [
        { id: 'slot-a', label: 'A · Prompt / Response Guardrail', description: '检查 Prompt 输入与模型输出安全' },
        { id: 'slot-b', label: 'B · AI Runtime Threat Detection', description: '侦测 Runtime 异常行为与威胁' },
        { id: 'slot-c', label: 'C · Multi-cloud AI Workload Protection', description: '发现并保护跨云 AI workloads 与配置风险' },
      ],
      options: [
        { id: 'content-safety', title: 'Content Safety',     description: '内容安全防护 · 保护 Prompt 与响应安全',   icon: 'content-safety', accent: 'purple' },
        { id: 'defender-ai',    title: 'Defender for AI',    description: 'AI 安全防护 · 保护 Runtime 与用户',      icon: 'defender-ai',    accent: 'green' },
        { id: 'defender-cloud', title: 'Defender for Cloud', description: '云安全防护 · 保护多云 workloads',         icon: 'defender-cloud', accent: 'blue' },
      ],
      correctMapping: {
        'slot-a': 'content-safety',
        'slot-b': 'defender-ai',
        'slot-c': 'defender-cloud',
      },
    },
  ],
};
