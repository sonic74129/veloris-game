import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="fixed inset-0 z-[9999] bg-ink-0 flex flex-col items-center justify-center p-8 text-center">
        <div className="font-brand text-[11px] tracking-[0.42em] text-gold-3 mb-6">
          CONTOSO MAISON
        </div>
        <div className="font-cn text-[28px] tracking-[0.08em] text-warm-1">
          游戏遇到问题
        </div>
        <div className="font-cns text-[14px] text-warm-2 mt-4 max-w-[360px] leading-relaxed">
          这通常是双指缩放画面造成的。<br />
          点击下方按钮刷新页面即可恢复游戏。
        </div>
        <div className="font-cns text-[12px] text-warm-3 mt-2 max-w-[300px]">
          This is usually caused by pinch-zoom. Tap below to refresh.
        </div>
        <button
          onClick={() => location.reload()}
          className="mt-8 px-10 py-3.5 bg-gold-3 hover:bg-gold-4 text-ink-0
                     font-cns font-medium tracking-[0.24em] text-[14px]
                     shadow-gold-glow transition-colors"
        >
          🔄 刷新页面 / Refresh
        </button>
        <div className="font-mono text-[9px] tracking-[0.28em] text-warm-4 mt-8">
          ERROR BOUNDARY · FRONTIER FIRM
        </div>
      </div>
    );
  }
}
