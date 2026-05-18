import type { LanguagePack } from './types';

export const zhPack: LanguagePack = {
  ui: {
    brand: 'VELORIS  MAISON',
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
      body: 'Veloris 已完成本阶段转型能力',
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
      title: 'VELORIS MAISON',
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
        speaker: 'MIRANDA VELORIS · MAISON QUEEN',
        title: 'CHAIRWOMAN 的挑战',
        body: 'Miranda Veloris 是 Veloris Maison 的女王级掌权者，也是这家时尚帝国真正的大老板。\n\n她定义品牌审美，决定每一季的方向，也决定这家公司是否能继续站在全球时尚的最前线。\n\n现在，她召见了你——Veloris Maison 新任 CTO。在下一季发布前，你必须完成一场不容失败的 AI 转型试炼。\n\n这家时尚集团拥有顶级设计与全球影响力，却被分散的旧系统、割裂的数据、缓慢的流程和无法规模化的 AI 试点拖住脚步。\n\n你的任务，是通过 5 场 Transformation Trial，帮助 Miranda 将 Veloris Maison 升级为真正的 AI-driven Frontier Firm。',
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
      challenge: {
        speaker: 'M. VELORIS',
        title: 'Chairwoman 的挑战',
        body: 'Veloris 正在迈向 Frontier Firm，但 AI Agent 还无法安全、实时地连接商品目录、价格、库存、订单与门店系统。在发布季开始前，请先看清老旧应用版图，再把关键 Java / .NET 应用现代化成可供 Agent 安全接入的平台。',
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
      hint: '拖拽正确的解决方案卡片到对应问题上，帮助 Veloris 建立可被 Agent 安全接入的核心系统能力。',
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
      challenge: {
        speaker: 'M. VELORIS',
        title: 'Chairwoman 的挑战',
        body: 'Veloris 已经有底层数据化，AI Agent 也能接入平台，但它们仍然不够"懂企业"。请将正确的 IQ 推到对应的问题，帮助 Agent 真正理解企业。',
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
      subtitle: '在部署更多智能 Agent 前，先让企业数据具备统一底座、业务语义与主动运营能力。',
      challenge: {
        speaker: 'M. VELORIS',
        title: 'Chairwoman 的挑战',
        body: 'Veloris 已完成应用现代化，也理解了 Microsoft IQ 的方向，但团队开始用 Data Agent 分析商品、库存、会员与门店时，答案仍不稳定。问题不在 AI，而在数据还没有 AI-ready。请补齐关键架构，让 Agent 真正理解业务、回答问题，并推动运营行动。',
      },
      missionObjectives: [
        '将正确的 4 个组件匹配到架构图中的空位',
        '让 Data Agent 建立在 AI-ready data 之上',
        '帮助 Agent 从看数据到懂业务、会行动',
      ],
      hint: '先思考企业要先解决什么：统一数据底座 → 建立业务语义 → 自然语言问数 → 主动运营响应。',
      slots: [
        { id: 'slot-onelake',          label: '问题 1 · 数据基础',     description: '商品、库存、会员、门店数据分散在 ERP、POS、CRM、电商与 Excel 中。统一分散数据，建立可信底座。' },
        { id: 'slot-ontology',         label: '问题 2 · 业务语义',     description: 'AI 看得到字段，却不理解爆款、滞销、会员偏好、新品系列与门店补货。建立业务概念、关系与指标定义。' },
        { id: 'slot-data-agent',       label: '问题 3 · 自然语言问数', description: '商品企划、营销与门店主管不会 SQL，却希望直接问哪些新品最可能成为爆款。让业务用户用自然语言分析数据。' },
        { id: 'slot-operations-agent', label: '问题 4 · 主动运营',     description: '主动发现缺货、滞销、库存风险与会员流失，并触发提醒或后续流程。' },
      ],
      options: [
        { id: 'onelake',          title: 'OneLake',          description: '统一数据底座，整合分散数据',           icon: 'onelake',          accent: 'cyan' },
        { id: 'ontology',         title: 'Ontology',         description: '建立业务语义，让 AI 理解业务概念',      icon: 'ontology',         accent: 'purple' },
        { id: 'data-agent',       title: 'Data Agent',       description: '支持自然语言问数与分析',               icon: 'data-agent',       accent: 'green' },
        { id: 'operations-agent', title: 'Operations Agent', description: '支持主动运营、事件响应与行动触发',     icon: 'operations-agent', accent: 'pink' },
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
      challenge: {
        speaker: 'M. VELORIS',
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
      hint: '先判断每个选项属于 Agent、模型，还是治理能力。再拖到对应的 Foundry 区域。',
      slots: [
        { id: 'slot-hosted-agent',  label: 'A · Foundry Hosted Agent',         description: '统一托管 Agent，提供独立运行环境、session 隔离、生命周期管理、权限与工具接入。', capacity: 2 },
        { id: 'slot-fireworks',     label: 'B · Foundry Fireworks',            description: '统一运行开源模型，支持高性能推理、模型评估、部署、扩展与生产化。',               capacity: 1 },
        { id: 'slot-control-plane', label: 'C · Observability + Control Plane', description: '统一观测与治理，追踪调用、工具使用、执行路径、成本、延迟、错误与风险行为。',     capacity: 2 },
      ],
      options: [
        { id: 'openclaw',                title: 'OpenClaw',                description: '开源 Agent 框架',           icon: 'openclaw',         accent: 'cyan' },
        { id: 'hermes-agent',            title: 'Hermes Agent',            description: '部门自建 Agent',            icon: 'hermes-agent',     accent: 'gold' },
        { id: 'qwen-model',              title: 'Qwen Model',              description: '开源大模型',                 icon: 'qwen',             accent: 'purple' },
        { id: 'trace-log',               title: 'Trace Log',               description: 'Agent 调用与执行追踪',       icon: 'trace-log',        accent: 'blue' },
        { id: 'prompt-injection-policy', title: 'Prompt Injection Policy', description: 'Prompt Injection 安全策略', icon: 'shield',           accent: 'green' },
      ],
      correctMapping: {
        'slot-hosted-agent':  ['openclaw', 'hermes-agent'],
        'slot-fireworks':     ['qwen-model'],
        'slot-control-plane': ['trace-log', 'prompt-injection-policy'],
      },
    },

    // ─────────────────────────────────────────────────────────────
    // STAGE 5 — AI SAFETY BOUNDARY
    // ─────────────────────────────────────────────────────────────
    {
      id: 'stage5',
      stageNumber: 5,
      type: 'safety-boundary',
      title: '第 5 关：守住 AI Frontier Firm 的安全边界',
      subtitle: '把正确的安全能力放到架构图中，保护 Prompt、侦测 AI Runtime 风险，并发现跨云 AI Workloads。',
      challenge: {
        speaker: 'M. VELORIS',
        title: 'Chairwoman 的挑战',
        body: 'Veloris 已经完成系统现代化、企业智能层、AI-ready data 与 Foundry 治理。现在，Agent 已经连接 Claude、Gemini 与 OpenAI 等多云模型。但 AI 越强大，攻击面也越大。请把正确的安全能力拖到架构图中的对应位置，让 Veloris 的 AI Frontier Firm 既能创新，也能被安全保护。',
      },
      missionObjectives: [
        '将 3 个安全能力放到正确位置',
        '保护 Prompt 输入与模型输出',
        '侦测 AI Runtime 异常行为',
        '发现并评估跨云 AI Workloads',
      ],
      knowledgePoints: [
        { title: 'Content Safety',     body: '保护 Prompt / Response 安全。',     icon: 'content-safety' },
        { title: 'Defender for AI',    body: '侦测 AI Runtime 威胁。',            icon: 'defender-ai' },
        { title: 'Defender for Cloud', body: '发现与评估跨云 AI Workloads。',     icon: 'defender-cloud' },
      ],
      hint: '先判断安全能力保护的是哪一层：Prompt 入口 → AI Runtime → 多云 Workload。',
      slots: [
        { id: 'slot-content-safety',  label: 'Layer 1 · Prompt / Response 安全检查',     description: '用户输入可能包含有害内容、越狱攻击或脱敏错误。哪个能力应该先检查 Prompt？' },
        { id: 'slot-defender-ai',     label: 'Layer 2 · AI Runtime 威胁侦测',             description: '模型调用中可能出现越狱尝试、资料外泄或异常提示行为。哪个能力负责侦测 AI Runtime 风险？' },
        { id: 'slot-defender-cloud',  label: 'Layer 3 · 多云 AI Workloads 发现与保护',   description: 'Claude、Gemini 与 OpenAI 分散在不同云上。哪个能力负责发现并评估跨云 AI Workloads？' },
      ],
      options: [
        { id: 'content-safety', title: 'Content Safety',     description: 'Prompt 安全护栏',     icon: 'content-safety', accent: 'purple' },
        { id: 'defender-ai',    title: 'Defender for AI',    description: 'AI Runtime 威胁侦测', icon: 'defender-ai',    accent: 'green' },
        { id: 'defender-cloud', title: 'Defender for Cloud', description: '跨云 Workload 发现',  icon: 'defender-cloud', accent: 'blue' },
      ],
      correctMapping: {
        'slot-content-safety': 'content-safety',
        'slot-defender-ai':    'defender-ai',
        'slot-defender-cloud': 'defender-cloud',
      },
    },
  ],
};
