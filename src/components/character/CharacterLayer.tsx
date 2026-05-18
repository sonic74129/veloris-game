/**
 * Character layer.
 * Miranda on left as tall portrait; Kinky / Lily as advisors.
 * Variants control placement so characters don't overlap gameplay.
 */
interface CharacterLayerProps {
  miranda?: boolean;
  advisors?: boolean | 'small' | 'large';
  variant?: 'left' | 'left-large' | 'hero' | 'side';
}

export function CharacterLayer({
  miranda = true,
  advisors = false,
  variant = 'left',
}: CharacterLayerProps) {
  const mirandaStyle =
    variant === 'hero'
      ? { left: 60, top: 90, width: 540, height: 900 }
      : variant === 'left-large'
      ? { left: 40, top: 110, width: 460, height: 820 }
      : variant === 'side'
      ? { left: 30, top: 120, width: 280, height: 600 }
      : { left: 50, top: 120, width: 360, height: 700 };

  const advisorMode: 'small' | 'large' | false =
    advisors === true ? 'large' : advisors || false;

  return (
    <>
      {miranda && (
        <img
          src="/assets/characters/Miranda.png"
          alt="Miranda"
          style={{
            position: 'absolute',
            ...mirandaStyle,
            objectFit: 'contain',
            objectPosition: 'top',
            filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.7))',
          }}
        />
      )}

      {advisorMode === 'large' && (
        <>
          {/* Kinky — center-left, mid-foreground */}
          <img
            src="/assets/characters/kinky2.png"
            alt="Kinky"
            style={{
              position: 'absolute',
              left: 540, bottom: 70,
              width: 360, height: 760,
              objectFit: 'contain',
              objectPosition: 'bottom',
              filter: 'drop-shadow(0 24px 36px rgba(0,0,0,0.65))',
              zIndex: 2,
            }}
          />
          {/* Lily — center-right */}
          <img
            src="/assets/characters/lily.png"
            alt="Lily"
            style={{
              position: 'absolute',
              left: 820, bottom: 70,
              width: 360, height: 760,
              objectFit: 'contain',
              objectPosition: 'bottom',
              filter: 'drop-shadow(0 24px 36px rgba(0,0,0,0.65))',
              zIndex: 3,
            }}
          />
        </>
      )}

      {advisorMode === 'small' && (
        <>
          <AdvisorChip
            src="/assets/characters/kinky2.png" name="KINKY"
            role="Strategy"  left={60} bottom={110}
          />
          <AdvisorChip
            src="/assets/characters/lily.png" name="LILY"
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

