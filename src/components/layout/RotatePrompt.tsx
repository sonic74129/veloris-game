export function RotatePrompt() {
  return (
    <div className="w-screen h-screen bg-ink-0 text-warm-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="font-brand text-[11px] tracking-[0.42em] text-gold-3 mb-6">
        CONTOSO MAISON
      </div>
      <RotateIcon />
      <div className="font-cn text-[24px] tracking-[0.12em] text-warm-1 mt-6">
        请将手机横屏体验
      </div>
      <div className="font-cns text-[13px] text-warm-3 mt-3 max-w-[300px] leading-relaxed">
        Frontier Firm Transformation Trial 采用 16:9 银幕级布局，
        请旋转设备以获得最佳沉浸体验。
      </div>
      <div className="font-cns text-[12px] text-warm-2 mt-4 max-w-[280px] leading-relaxed border border-gold-2/40 rounded px-4 py-2.5 bg-ink-2/60">
        💻 建议使用电脑体验完整版，画面更大、操作更顺畅。
      </div>
      <div className="font-cns text-[12px] text-accent-red mt-4 max-w-[280px] leading-relaxed border border-accent-red/40 rounded px-4 py-2.5 bg-ink-2/60">
        ⚠️ 请勿双指缩放屏幕 — 缩放可能导致画面错位。若已缩放，请双击屏幕或刷新页面恢复。
      </div>
      <div className="font-mono text-[10px] tracking-[0.32em] text-gold-3 mt-8">
        PLEASE ROTATE · LANDSCAPE MODE
      </div>
    </div>
  );
}

function RotateIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none"
         stroke="#d4af6a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="22" width="44" height="28" rx="3" />
      <rect x="22" y="16" width="28" height="40" rx="3"
            transform="rotate(-12 36 36)" opacity="0.5" />
      <path d="M30 36h12M36 30v12" opacity="0.7" />
      <path d="M58 12l4 6M62 18l-6 2" opacity="0.8" />
    </svg>
  );
}
