const BASE = import.meta.env.BASE_URL;

/**
 * Character layer.
 * Miranda on left as tall portrait; Kinky / Lily as advisors.
 * Variants control placement so characters don't overlap gameplay.
 */
interface CharacterLayerProps {
  miranda?: boolean;
  advisors?: boolean | 'small' | 'large';
  variant?: 'left' | 'left-large' | 'hero' | 'side';
  /** Override the lead-character image while keeping Miranda's slot dimensions. */
  lead?: 'miranda' | 'kinky' | 'lily';
}

export function CharacterLayer({
  miranda = true,
  advisors = false,
  variant = 'left',
  lead = 'miranda',
}: CharacterLayerProps) {
  const mirandaStyle =
    variant === 'hero'
      ? { left: 60, top: 90, width: 540, height: 900 }
      : variant === 'left-large'
      ? { left: 40, top: 110, width: 460, height: 820 }
      : variant === 'side'
      ? { left: 30, top: 120, width: 280, height: 600 }
      : { left: 50, top: 120, width: 360, height: 700 };

  // For non-Miranda leads, use height + auto width so aspect ratio stays correct
  // and Kinky/Lily render at a consistent visual size regardless of source.
  const leadSrc =
    lead === 'kinky' ? `${BASE}assets/characters/kinky2.png`
    : lead === 'lily'  ? `${BASE}assets/characters/lily.png`
    : `${BASE}assets/characters/Miranda.png`;
  const leadAlt = lead === 'kinky' ? 'Kinky' : lead === 'lily' ? 'Lily' : 'Miranda';
  const leadStyle: React.CSSProperties = lead === 'miranda'
    ? mirandaStyle
    : { left: mirandaStyle.left, top: mirandaStyle.top, height: mirandaStyle.height, width: 'auto' };

  const advisorMode: 'small' | 'large' | false =
    advisors === true ? 'large' : advisors || false;

  return (
    <>
      {miranda && (
        <img
          src={leadSrc}
          alt={leadAlt}
          style={{
            position: 'absolute',
            ...leadStyle,
            objectFit: 'contain',
            objectPosition: 'top',
            filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.7))',
          }}
        />
      )}

      {advisorMode === 'large' && (
        <>
          {/* Kinky & Lily — fixed height + auto width so both render visually
              the same size regardless of source aspect ratio. */}
          <img
            src={`${BASE}assets/characters/kinky2.png`}
            alt="Kinky"
            style={{
              position: 'absolute',
              left: 700, bottom: 340,
              height: 640,
              width: 'auto',
              filter: 'drop-shadow(0 24px 36px rgba(0,0,0,0.65))',
              zIndex: 2,
            }}
          />
          <img
            src={`${BASE}assets/characters/lily.png`}
            alt="Lily"
            style={{
              position: 'absolute',
              left: 1080, bottom: 340,
              height: 640,
              width: 'auto',
              filter: 'drop-shadow(0 24px 36px rgba(0,0,0,0.65))',
              zIndex: 3,
            }}
          />
        </>
      )}

      {advisorMode === 'small' && (
        <>
          <AdvisorChip
            src={`${BASE}assets/characters/kinky2.png`} name="KINKY"
            role="Strategy"  left={60} bottom={110}
          />
          <AdvisorChip
            src={`${BASE}assets/characters/lily.png`} name="LILY"
            role="Ops"       left={210} bottom={110}
          />
        </>
      )}
    </>
  );
}

function AdvisorChip({
  src, name, role, left, bottom,
}: { src: string; name: string; role: string; left: number; bottom: number }) {
  return (
    <div
      style={{ position: 'absolute', left, bottom, width: 130 }}
      className="z-[4]"
    >
      <div className="w-[130px] h-[150px] rounded-md overflow-hidden border border-gold-3 bg-ink-2/80 relative"
           style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.6), inset 0 0 12px rgba(201,165,90,0.15)' }}>
        <img
          src={src}
          alt={name}
          style={{
            position: 'absolute',
            left: '50%', top: 6,
            transform: 'translateX(-50%)',
            height: 200,
            objectFit: 'contain',
            objectPosition: 'top',
          }}
        />
      </div>
      <div className="mt-2 text-center">
        <div className="font-brand text-[11px] tracking-[0.3em] text-gold-4">{name}</div>
        <div className="font-mono text-[8.5px] tracking-[0.28em] text-warm-3 mt-0.5">{role}</div>
      </div>
    </div>
  );
}

