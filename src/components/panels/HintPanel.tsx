interface HintPanelProps {
  title: string;
  body: string;
}

export function HintPanel({ title, body }: HintPanelProps) {
  return (
    <div className="glass p-4 frame-corners relative border-l-2 !border-l-gold-3">
      <span className="c-tl" /><span className="c-br" />
      <div className="eyebrow mb-2 text-gold-4">{title}</div>
      <div className="font-cns text-[12px] text-warm-2 leading-[1.6]">
        {body}
      </div>
    </div>
  );
}
