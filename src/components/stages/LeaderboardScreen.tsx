import { useEffect, useState, useRef } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { loadLeaderboard, type LeaderboardEntry } from '../../lib/leaderboard';

const BASE = import.meta.env.BASE_URL;

const SONIC_SUBTITLE_ZH = '挑战完成，恭喜！您的智慧与选择，已永久刻入排行榜。';
const SONIC_SUBTITLE_EN = 'Challenge complete — your judgment is now part of the Maison archive.';

export function LeaderboardScreen() {
  const restartRun = useGameState((s) => s.restartRun);
  const language = useGameState((s) => s.language);
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [vidPaused, setVidPaused] = useState(false);
  const [vidMuted, setVidMuted] = useState(true);

  useEffect(() => {
    loadLeaderboard().then(setBoard);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Try to play with audio (works if user has interacted with the page, i.e., completed the game)
    v.muted = false;
    v.play().catch(() => {
      // Browser blocked audio autoplay — fall back to muted, user can click the unmute button
      v.muted = true;
      setVidMuted(true);
      v.play().catch(() => {});
    });
  }, []);

  function togglePause() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setVidPaused(false); }
    else { v.pause(); setVidPaused(true); }
  }

  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setVidMuted(v.muted);
  }

  const top3 = board.slice(0, 3);
  const allRows = board;

  return (
    <>
      <div className="absolute inset-0 overflow-y-auto px-10 pt-16 pb-10">
      {/* Header */}
      <div className="flex justify-between items-end mb-6 max-w-[1400px] mx-auto">
        <div>
          <div className="eyebrow">MIRANDA'S BOARD · 董事会榜单</div>
          <div className="font-brand text-[38px] tracking-[0.14em] text-warm-1 mt-2 leading-tight">
            Frontier Firm Ranking
          </div>
          <div className="font-cn text-[14px] text-warm-2 italic mt-1">
            The board remembers every mistake.
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[9px] tracking-[0.28em] text-warm-3">SEASON · FW26</div>
          <div className="font-brand text-[16px] text-gold-4 tracking-[0.14em] mt-1">
            {board.length} CHALLENGERS
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-5 max-w-[1400px] mx-auto mb-6 items-end">
          <PodiumCard entry={top3[1]} place={2} color="#d8d4c8" />
          <PodiumCard entry={top3[0]} place={1} color="var(--tw-gold-5, #f6e6bf)" tall />
          <PodiumCard entry={top3[2]} place={3} color="#c79968" />
        </div>
      )}

      {/* Full table */}
      <div className="glass frame-corners relative max-w-[1400px] mx-auto overflow-hidden">
        <span className="c-tl" /><span className="c-br" />
        {/* Header row */}
        <div className="grid grid-cols-[60px_1.4fr_1fr_0.8fr_0.6fr_0.5fr_0.5fr] gap-3 px-5 py-3 border-b border-gold-1">
          <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">RANK</span>
          <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">NAME</span>
          <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">COMPANY</span>
          <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">SCORE</span>
          <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">TIME</span>
          <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">W</span>
          <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">H</span>
        </div>
        {/* Rows */}
        {allRows.map((entry) => {
          const isYou = entry.isYou;
          const mm = String(Math.floor(entry.totalTime / 60)).padStart(2, '0');
          const ss = String(entry.totalTime % 60).padStart(2, '0');
          return (
            <div
              key={`${entry.playerName}-${entry.timestamp}`}
              className={`grid grid-cols-[60px_1.4fr_1fr_0.8fr_0.6fr_0.5fr_0.5fr] gap-3 px-5 py-2.5 border-b border-gold-1/30
                ${isYou ? 'bg-[#6ec8d8]/10 border-l-2 !border-l-[#6ec8d8]' : ''}`}
            >
              <span className={`font-brand text-[18px] ${
                entry.rank === 1 ? 'text-gold-5' :
                entry.rank === 2 ? 'text-[#d8d4c8]' :
                entry.rank === 3 ? 'text-[#c79968]' :
                isYou ? 'text-[#6ec8d8]' : 'text-warm-2'
              }`}>#{entry.rank}</span>
              <span className="font-brand text-[13px] tracking-[0.1em] text-warm-1 flex items-center gap-2">
                {entry.playerName.toUpperCase()}
                {isYou && (
                  <span className="font-mono text-[8px] tracking-[0.28em] text-[#6ec8d8] border border-[#6ec8d8]/50 px-1.5 py-0.5">YOU</span>
                )}
              </span>
              <span className="font-mono text-[11px] tracking-[0.14em] text-warm-2 self-center">{entry.company.toUpperCase()}</span>
              <span className={`font-brand text-[16px] self-center ${
                entry.rank === 1 ? 'text-gold-5' : isYou ? 'text-[#6ec8d8]' : 'text-warm-1'
              }`}>{entry.totalScore.toLocaleString()}</span>
              <span className="font-mono text-[11px] text-warm-2 self-center">{mm}:{ss}</span>
              <span className={`font-mono text-[11px] self-center ${entry.totalWrongAttempts > 0 ? 'text-[#e85d5d]' : 'text-warm-2'}`}>{entry.totalWrongAttempts}</span>
              <span className={`font-mono text-[11px] self-center ${entry.totalHintsUsed > 0 ? 'text-[#6ec8d8]' : 'text-warm-2'}`}>{entry.totalHintsUsed}</span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-5 max-w-[1400px] mx-auto">
        <div className="font-cn text-[11px] text-warm-3 italic">
          分数相同时，<span className="text-gold-4">用时短者排名靠前</span>。
        </div>
        <button
          onClick={restartRun}
          className="px-6 py-2.5 border border-gold-2 hover:border-gold-3
                     text-gold-4 font-cns tracking-[0.2em] text-[12px]
                     transition-colors bg-ink-0/60"
        >
          Restart Challenge ↻
        </button>
      </div>
    </div>

    {/* ── Sonic Atelier Greeting Card ── */}
    <div className="absolute right-[48px] bottom-[88px] z-50" style={{ width: 300 }}>
      <div style={{
        position: 'relative',
        padding: '14px 14px 16px',
        background: 'linear-gradient(180deg, rgba(28,23,18,0.95), rgba(10,8,7,0.98))',
        border: '1px solid #c9a55a',
        boxShadow: 'inset 0 1px 0 rgba(246,230,191,0.18), inset 0 -1px 0 rgba(0,0,0,0.7), 0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(201,165,90,0.12)',
      }}>
        {/* Corner accents */}
        <span style={{ position:'absolute', top:-3, left:-3, width:14, height:14, border:'1px solid #e3c886', borderRight:'none', borderBottom:'none', pointerEvents:'none' }} />
        <span style={{ position:'absolute', bottom:-3, right:-3, width:14, height:14, border:'1px solid #e3c886', borderLeft:'none', borderTop:'none', pointerEvents:'none' }} />

        {/* Header row */}
        <div style={{ display:'flex', alignItems:'center', gap:10, paddingBottom:10, borderBottom:'1px solid rgba(90,72,40,0.6)', marginBottom:10 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'oklch(0.7 0.18 25)', boxShadow:'0 0 10px oklch(0.65 0.2 25)', animation:'greet-pulse 1.6s ease-in-out infinite', flexShrink:0 }} />
          <span className="font-mono" style={{ flex:1, fontSize:10, letterSpacing:'0.26em', color:'#c9a55a', textTransform:'uppercase', whiteSpace:'nowrap' }}>
            Live · Atelier Greeting
          </span>
          <span className="font-mono" style={{ fontSize:9, letterSpacing:'0.22em', color:'rgba(138,122,93,0.8)', whiteSpace:'nowrap', marginLeft:8 }}>
            From Paris · FR
          </span>
        </div>

        {/* Video frame */}
        <div style={{ position:'relative', width:'100%', aspectRatio:'1/1', background:'#0a0807', overflow:'hidden', border:'1px solid rgba(90,72,40,0.7)', isolation:'isolate' }}>
          <video
            ref={videoRef}
            src={`${BASE}video/sonic.mp4`}
            muted
            playsInline
            style={{
              position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover',
              filter:'brightness(0.94) contrast(1.12) saturate(0.85) sepia(0.12)',
              WebkitMaskImage:'radial-gradient(ellipse 80% 90% at 50% 45%, black 35%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.35) 80%, transparent 100%)',
              maskImage:'radial-gradient(ellipse 80% 90% at 50% 45%, black 35%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.35) 80%, transparent 100%)',
            }}
          />
          {/* Warm vignette overlay */}
          <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', mixBlendMode:'multiply',
            background:'radial-gradient(ellipse 70% 80% at 50% 45%, rgba(201,165,90,0.08), transparent 70%), radial-gradient(ellipse at 50% 100%, rgba(10,8,7,0.85), transparent 65%)' }} />
          {/* Top/bottom scrim */}
          <div style={{ position:'absolute', inset:0, zIndex:3, pointerEvents:'none',
            background:'linear-gradient(180deg, rgba(10,8,7,0.4), transparent 25%, transparent 70%, rgba(10,8,7,0.85))' }} />
          {/* Corner brackets */}
          {(['tl','tr','bl','br'] as const).map(pos => (
            <span key={pos} style={{ position:'absolute', width:18, height:18, border:'1px solid #e3c886', zIndex:4,
              ...(pos==='tl' ? { top:8, left:8, borderRight:'none', borderBottom:'none' } :
                  pos==='tr' ? { top:8, right:8, borderLeft:'none', borderBottom:'none' } :
                  pos==='bl' ? { bottom:8, left:8, borderRight:'none', borderTop:'none' } :
                               { bottom:8, right:8, borderLeft:'none', borderTop:'none' }) }} />
          ))}
          {/* REC timecode */}
          <div className="font-mono" style={{ position:'absolute', right:12, top:12, zIndex:5, fontSize:9, letterSpacing:'0.24em', color:'#e3c886', background:'rgba(10,8,7,0.6)', border:'1px solid rgba(90,72,40,0.7)', padding:'2px 6px' }}>
            REC · 00:05
          </div>
          {/* Speaker */}
          <div style={{ position:'absolute', left:12, bottom:12, zIndex:5 }}>
            <div className="font-brand" style={{ fontSize:14, letterSpacing:'0.22em', color:'#e3c886' }}>SONIC</div>
            <div className="font-mono" style={{ fontSize:8, letterSpacing:'0.32em', color:'rgba(138,122,93,0.8)', marginTop:2 }}>CREATOR · PARIS</div>
          </div>
        </div>

        {/* Subtitle band */}
        <div style={{ marginTop:12, padding:'12px', background:'linear-gradient(180deg, rgba(10,8,7,0.7), rgba(10,8,7,0.4))', border:'1px solid rgba(90,72,40,0.5)', borderLeft:'2px solid #c9a55a', position:'relative' }}>
          <span className="font-mono" style={{ position:'absolute', top:-7, left:10, fontSize:9, letterSpacing:'0.32em', color:'#e3c886', padding:'0 6px', background:'linear-gradient(180deg, rgba(28,23,18,0.98), rgba(15,12,10,0.98))', textTransform:'uppercase' }}>
            Subtitle · 中 / EN
          </span>
          {language !== 'en' && (
            <div className="font-cns" style={{ fontSize:12, lineHeight:1.5, color:'rgba(199,184,150,0.9)', letterSpacing:'0.04em', marginBottom:6 }}>
              {SONIC_SUBTITLE_ZH}
            </div>
          )}
          <div className="font-serif" style={{ fontSize:12, lineHeight:1.45, color:'rgba(244,235,216,0.85)', fontStyle:'italic', letterSpacing:'0.02em' }}>
            {SONIC_SUBTITLE_EN}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:10 }}>
          <button onClick={togglePause} style={{ display:'grid', placeItems:'center', width:28, height:28, border:'1px solid rgba(90,72,40,0.7)', background:'rgba(10,8,7,0.6)', color:'#e3c886', cursor:'pointer', flexShrink:0 }}>
            {vidPaused
              ? <svg viewBox="0 0 24 24" width={12} height={12} fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              : <svg viewBox="0 0 24 24" width={12} height={12} fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>}
          </button>
          <button onClick={toggleMute} style={{ display:'grid', placeItems:'center', width:28, height:28, border:'1px solid rgba(90,72,40,0.7)', background:'rgba(10,8,7,0.6)', color: vidMuted ? 'rgba(138,122,93,0.6)' : '#e3c886', cursor:'pointer', flexShrink:0 }}>
            {vidMuted
              ? <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M16 9l5 6M21 9l-5 6"/></svg>
              : <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={1.6}><path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M16 11.5a4 4 0 0 1 0 5"/></svg>}
          </button>
          <div style={{ flex:1, height:2, background:'rgba(201,165,90,0.18)', position:'relative' }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'100%', background:'linear-gradient(90deg, #c9a55a, #e3c886)', boxShadow:'0 0 6px rgba(201,165,90,0.5)' }} />
          </div>
          <span className="font-mono" style={{ fontSize:9, letterSpacing:'0.18em', color:'rgba(138,122,93,0.8)', flexShrink:0 }}>00:05</span>
        </div>
      </div>
    </div>
    </>
  );
}

function PodiumCard({ entry, place, color, tall }: {
  entry: LeaderboardEntry; place: number; color: string; tall?: boolean;
}) {
  const mm = String(Math.floor(entry.totalTime / 60)).padStart(2, '0');
  const ss = String(entry.totalTime % 60).padStart(2, '0');
  return (
    <div className={`glass frame-corners relative p-5 ${tall ? 'min-h-[280px]' : 'min-h-[220px]'}
      ${place === 1 ? 'bg-gradient-to-b from-gold-1/15 to-ink-0/90 border-gold-3' : ''}`}
      style={place === 1 ? { boxShadow: '0 0 40px rgba(201,165,90,0.15)' } : undefined}
    >
      <span className="c-tl" /><span className="c-br" />
      <div className="flex justify-between items-start">
        <span className="font-brand text-[40px] leading-none" style={{ color }}>#{place}</span>
      </div>
      <div className="font-brand text-[18px] tracking-[0.12em] mt-4 leading-tight" style={{ color: place === 1 ? color : 'var(--tw-warm-1, #f0ede6)' }}>
        {entry.playerName.toUpperCase()}
      </div>
      <div className="font-cn text-[11px] text-warm-3 tracking-[0.14em] mt-1">
        {entry.company.toUpperCase()}
      </div>
      <div className="h-px bg-gold-1 my-3" />
      <div className="flex justify-between items-baseline">
        <span className="font-mono text-[9px] tracking-[0.24em] text-warm-3">SCORE</span>
        <span className="font-brand text-[26px]" style={{ color }}>{entry.totalScore.toLocaleString()}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 font-mono text-[9px] tracking-[0.14em] text-warm-3">
        <div>TIME<br /><span className="text-warm-1">{mm}:{ss}</span></div>
        <div>W<br /><span className="text-warm-1">{entry.totalWrongAttempts}</span></div>
        <div>H<br /><span className="text-warm-1">{entry.totalHintsUsed}</span></div>
      </div>
    </div>
  );
}
