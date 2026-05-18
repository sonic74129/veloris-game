import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const Base = ({ size = 40, children, ...p }: IconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    {children}
  </svg>
);

const AzureMigrate = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 28L14 14h12l8 14H6z" />
    <path d="M14 28l6-10 6 10" />
    <circle cx={20} cy={20} r={2} />
  </Base>
);

const GitHubCopilot = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 6c-7 0-12 5-12 12 0 6 4 10 8 10h8c4 0 8-4 8-10 0-7-5-12-12-12z" />
    <circle cx={15} cy={20} r={2} />
    <circle cx={25} cy={20} r={2} />
    <path d="M16 26h8" />
  </Base>
);

const PowerBI = (p: IconProps) => (
  <Base {...p}>
    <rect x={8} y={20} width={5} height={12} />
    <rect x={17.5} y={12} width={5} height={20} />
    <rect x={27} y={6} width={5} height={26} />
  </Base>
);

const Teams = (p: IconProps) => (
  <Base {...p}>
    <rect x={4} y={10} width={20} height={20} rx={2} />
    <text x={14} y={25} textAnchor="middle" fontSize={14} fill="currentColor" stroke="none">T</text>
    <circle cx={30} cy={16} r={4} />
    <path d="M26 30c0-3 2-5 4-5s4 2 4 5" />
  </Base>
);

const SharePoint = (p: IconProps) => (
  <Base {...p}>
    <circle cx={14} cy={18} r={8} />
    <circle cx={26} cy={22} r={6} />
    <circle cx={20} cy={30} r={4} />
  </Base>
);

const DefenderCloud = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 6l12 4v8c0 8-5 14-12 16-7-2-12-8-12-16v-8l12-4z" />
    <path d="M15 19l4 4 8-8" />
  </Base>
);

const WorkIQ = (p: IconProps) => (
  <Base {...p}>
    <circle cx={20} cy={14} r={4} />
    <circle cx={10} cy={26} r={3} />
    <circle cx={30} cy={26} r={3} />
    <path d="M20 18v6M16 22l-3 3M24 22l3 3" />
  </Base>
);

const FabricIQ = (p: IconProps) => (
  <Base {...p}>
    <rect x={6} y={8} width={10} height={10} rx={1} />
    <rect x={24} y={8} width={10} height={10} rx={1} />
    <rect x={15} y={22} width={10} height={10} rx={1} />
    <path d="M11 18v4M29 18v4M20 22v-2" />
  </Base>
);

const FoundryIQ = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 30V14l12-8 12 8v16" />
    <path d="M16 30v-10h8v10" />
    <path d="M20 14v4" />
  </Base>
);

const Default = (p: IconProps) => (
  <Base {...p}>
    <circle cx={20} cy={20} r={12} />
    <circle cx={20} cy={20} r={6} />
  </Base>
);

// ── Stage 3
const OneLake = (p: IconProps) => (
  <Base {...p}>
    <ellipse cx={20} cy={12} rx={12} ry={4} />
    <path d="M8 12v8c0 2.2 5.4 4 12 4s12-1.8 12-4v-8" />
    <path d="M8 20v8c0 2.2 5.4 4 12 4s12-1.8 12-4v-8" />
  </Base>
);
const Ontology = (p: IconProps) => (
  <Base {...p}>
    <circle cx={20} cy={10} r={4} />
    <circle cx={8}  cy={28} r={4} />
    <circle cx={32} cy={28} r={4} />
    <circle cx={20} cy={22} r={3} />
    <path d="M20 14v5M17 21l-6 5M23 21l6 5" />
  </Base>
);
const DataAgent = (p: IconProps) => (
  <Base {...p}>
    <rect x={8} y={10} width={24} height={16} rx={2} />
    <circle cx={15} cy={18} r={1.6} />
    <circle cx={25} cy={18} r={1.6} />
    <path d="M14 30l3 3M26 30l-3 3M17 33h6" />
  </Base>
);
const OperationsAgent = (p: IconProps) => (
  <Base {...p}>
    <circle cx={20} cy={20} r={10} />
    <path d="M20 12v8l6 3" />
    <path d="M6 20h2M32 20h2M20 6v2M20 32v2" />
  </Base>
);

// ── Stage 4
const HostedAgent = (p: IconProps) => (
  <Base {...p}>
    <rect x={6} y={10} width={28} height={20} rx={2} />
    <path d="M6 16h28" />
    <circle cx={12} cy={13} r={1} />
    <circle cx={16} cy={13} r={1} />
    <path d="M14 22h12M14 26h8" />
  </Base>
);
const Fireworks = (p: IconProps) => (
  <Base {...p}>
    <circle cx={20} cy={20} r={3} />
    <path d="M20 6v6M20 28v6M6 20h6M28 20h6M10 10l4 4M30 30l-4-4M10 30l4-4M30 10l-4 4" />
  </Base>
);
const ControlPlane = (p: IconProps) => (
  <Base {...p}>
    <rect x={6} y={8}  width={28} height={8} rx={1} />
    <rect x={6} y={20} width={28} height={4} rx={1} />
    <rect x={6} y={28} width={28} height={4} rx={1} />
    <circle cx={10} cy={12} r={1} />
  </Base>
);
const OpenClaw = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 6c-7 0-12 5-12 12s5 14 12 14 12-7 12-14-5-12-12-12z" />
    <path d="M14 16l3 4 6-6" />
  </Base>
);
const HermesAgent = (p: IconProps) => (
  <Base {...p}>
    <circle cx={20} cy={14} r={5} />
    <path d="M10 32c0-6 4-10 10-10s10 4 10 10" />
  </Base>
);
const QwenModel = (p: IconProps) => (
  <Base {...p}>
    <rect x={8} y={8} width={24} height={24} rx={3} />
    <path d="M14 14l6 6 6-6M14 20l6 6 6-6" />
  </Base>
);
const TraceLog = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 32V8h22l6 6v18z" />
    <path d="M12 16h14M12 22h14M12 28h8" />
  </Base>
);
const ShieldIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 6l12 4v8c0 8-5 14-12 16-7-2-12-8-12-16v-8l12-4z" />
    <path d="M16 20l3 3 6-6" />
  </Base>
);

// ── Stage 5
const ContentSafety = (p: IconProps) => (
  <Base {...p}>
    <rect x={6} y={12} width={28} height={16} rx={2} />
    <path d="M14 20h12" />
    <path d="M12 8l-2 4M28 8l2 4" />
  </Base>
);
const DefenderAI = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 6l12 4v8c0 8-5 14-12 16-7-2-12-8-12-16v-8l12-4z" />
    <text x={20} y={24} textAnchor="middle" fontSize={9} fill="currentColor" stroke="none"
          fontFamily="monospace">AI</text>
  </Base>
);

export const IconRegistry: Record<string, (p: IconProps) => React.ReactElement> = {
  'azure-migrate': AzureMigrate,
  'github-copilot': GitHubCopilot,
  'power-bi': PowerBI,
  teams: Teams,
  sharepoint: SharePoint,
  'defender-cloud': DefenderCloud,
  'work-iq': WorkIQ,
  'fabric-iq': FabricIQ,
  'foundry-iq': FoundryIQ,
  // Stage 3
  onelake: OneLake,
  ontology: Ontology,
  'data-agent': DataAgent,
  'operations-agent': OperationsAgent,
  // Stage 4
  'hosted-agent': HostedAgent,
  fireworks: Fireworks,
  'control-plane': ControlPlane,
  openclaw: OpenClaw,
  'hermes-agent': HermesAgent,
  qwen: QwenModel,
  'trace-log': TraceLog,
  shield: ShieldIcon,
  // Stage 5
  'content-safety': ContentSafety,
  'defender-ai': DefenderAI,
};

export function Icon({ name, size = 40, ...rest }: { name?: string } & IconProps) {
  const Cmp = (name && IconRegistry[name]) || Default;
  return <Cmp size={size} {...rest} />;
}
