import type { KnowledgePoint } from '../../data/types';
import { Icon } from '../icons/Icon';

interface KnowledgePanelProps {
  title: string;
  points: KnowledgePoint[];
}

export function KnowledgePanel({ title, points }: KnowledgePanelProps) {
  return (
    <div className="glass p-5 frame-corners relative">
      <span className="c-tl" /><span className="c-br" />
      <div className="eyebrow mb-3">{title}</div>
      <div className="space-y-3">
        {points.map((p, i) => (
          <div key={i} className="flex gap-3">
            <div className="text-gold-4 flex-shrink-0 mt-0.5">
              <Icon name={p.icon} size={28} />
            </div>
            <div>
              <div className="font-cns text-[13px] text-gold-4 font-medium">{p.title}</div>
              <div className="font-cns text-[12px] text-warm-3 leading-[1.55] mt-0.5">
                {p.body}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
