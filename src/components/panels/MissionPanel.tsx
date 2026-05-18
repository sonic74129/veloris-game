interface MissionPanelProps {
  title: string;
  objectives: string[];
}

export function MissionPanel({ title, objectives }: MissionPanelProps) {
  return (
    <div className="glass p-5 frame-corners relative">
      <span className="c-tl" /><span className="c-br" />
      <div className="eyebrow mb-3">{title}</div>
      <ul className="space-y-2">
        {objectives.map((o, i) => (
          <li key={i} className="flex gap-3 font-cns text-[12.5px] text-warm-2 leading-[1.6]">
            <span className="font-mono text-gold-3 text-[11px] mt-[2px]">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{o}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
