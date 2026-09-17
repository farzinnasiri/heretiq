import React, { useRef, useState, useEffect } from 'react';
import { Archetype, ClassicalCompassResult, Dimension, Scores } from '../../domain/types';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import { formatVerifiedDate } from '../../domain/dateUtils';
import { preloadImage, isImagePreloaded } from '../../utils/imagePreloader';

export type ForgePhase =
  | 'idle'
  | 'oracle_intro'
  | 'trace_border'
  | 'cutout_impact'
  | 'fill_front'
  | 'flip_to_back'
  | 'count_matrix'
  | 'flip_to_front'
  | 'settled';

interface ArchetypeCardProps {
  archetype: Archetype;
  classicalResult?: ClassicalCompassResult;
  scores?: Scores;
  format?: 'card' | 'poster' | 'story';
  interactive?: boolean;
  className?: string;
  isFlipped?: boolean;
  onFlipChange?: (flipped: boolean) => void;
  isPopping?: boolean;
  forgePhase?: ForgePhase;
}

const DIMENSIONS_CONFIG: {
  id: Dimension;
  name: string;
  leftLabel: string;
  rightLabel: string;
}[] = [
  { id: 'M', name: 'Provision', leftLabel: 'Public', rightLabel: 'Markets' },
  { id: 'A', name: 'Freedom', leftLabel: 'Order', rightLabel: 'Autonomy' },
  { id: 'I', name: 'Institutions', leftLabel: 'Challenge', rightLabel: 'Trust' },
  { id: 'G', name: 'Belonging', leftLabel: 'National', rightLabel: 'Global' },
  { id: 'E', name: 'Distribution', leftLabel: 'Rewards', rightLabel: 'Equality' },
  { id: 'T', name: 'Technology', leftLabel: 'Precaution', rightLabel: 'Acceleration' },
];

interface AnimatedDimensionRowProps {
  cfg: (typeof DIMENSIONS_CONFIG)[0];
  score: number;
  isCounting: boolean;
  delayIndex: number;
}

const AnimatedDimensionRow: React.FC<AnimatedDimensionRowProps> = ({
  cfg,
  score,
  isCounting,
  delayIndex,
}) => {
  const [displayedScore, setDisplayedScore] = useState<number>(50);
  const [isRowVisible, setIsRowVisible] = useState<boolean>(false);
  const [isLockedIn, setIsLockedIn] = useState<boolean>(false);

  useEffect(() => {
    if (!isCounting) {
      setDisplayedScore(score);
      setIsRowVisible(true);
      setIsLockedIn(true);
      return;
    }

    setDisplayedScore(50);
    setIsRowVisible(false);
    setIsLockedIn(false);

    const staggerDelay = delayIndex * 200;
    const appearTimer = setTimeout(() => {
      setIsRowVisible(true);

      const startTime = performance.now();
      const duration = 850;
      const startVal = 50;
      const diff = score - startVal;

      const animateFrame = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startVal + diff * ease);
        setDisplayedScore(current);

        if (progress < 1) {
          requestAnimationFrame(animateFrame);
        } else {
          setDisplayedScore(score);
          setIsLockedIn(true);
        }
      };

      requestAnimationFrame(animateFrame);
    }, staggerDelay);

    return () => clearTimeout(appearTimer);
  }, [isCounting, score, delayIndex]);

  let badgeText = 'Balanced';
  let badgeColor = 'text-white/70 bg-white/5 border-white/10';

  if (displayedScore < 50) {
    const pct = 100 - displayedScore;
    badgeText = `${pct}% ${cfg.leftLabel}`;
    badgeColor = 'text-[#FF2A54] bg-[#FF2A54]/10 border-[#FF2A54]/30';
  } else if (displayedScore > 50) {
    badgeText = `${displayedScore}% ${cfg.rightLabel}`;
    badgeColor = 'text-[#0066FF] bg-[#0066FF]/10 border-[#0066FF]/30';
  }

  const dotColor =
    displayedScore < 50
      ? 'bg-[#FF2A54] shadow-[0_0_8px_#FF2A54]'
      : displayedScore > 50
      ? 'bg-[#0066FF] shadow-[0_0_8px_#0066FF]'
      : 'bg-white shadow-[0_0_8px_white]';

  return (
    <div
      className="flex flex-col gap-1.5 sm:gap-2 transition-all duration-300"
      style={{
        opacity: isRowVisible ? 1 : 0,
        transform: isRowVisible ? 'translateX(0)' : 'translateX(-12px)',
      }}
    >
      <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px]">
          <span className="text-white font-bold uppercase tracking-wider">
            {cfg.name}
          </span>
          <span className="text-[#64748B]">·</span>
          <span className="text-[#FF2A54] font-semibold">{cfg.leftLabel}</span>
          <span className="text-[#64748B]">/</span>
          <span className="text-[#0066FF] font-semibold">{cfg.rightLabel}</span>
        </div>
        <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold border transition-transform ${badgeColor} ${isLockedIn ? 'animate-badge-lockin' : ''}`}>
          {badgeText}
        </span>
      </div>

      {/* Precision Gradient Track with proper breathing room */}
      <div className="relative h-2 sm:h-2.5 w-full rounded-full bg-gradient-to-r from-[#FF2A54]/30 via-white/10 to-[#0066FF]/30 border border-white/15">
        {/* 50% Midline Pip */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/35 -translate-x-1/2 z-0" />
        {/* Glowing Score Indicator Dot */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-10 transition-all duration-150 ${dotColor}`}
          style={{ left: `calc(${displayedScore}% - 7px)` }}
        />
      </div>
    </div>
  );
};

export const ArchetypeCard: React.FC<ArchetypeCardProps> = ({
  archetype,
  classicalResult: _classicalResult,
  scores,
  interactive = true,
  className = '',
  isFlipped: controlledFlipped,
  onFlipChange,
  isPopping = false,
  forgePhase = 'idle',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [sheenX, setSheenX] = useState(50);
  const [sheenY, setSheenY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [internalFlipped, setInternalFlipped] = useState(false);

  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;

  const [isManualFlipping, setIsManualFlipping] = useState(false);
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevFlippedRef = useRef(isFlipped);

  // When flip state changes, run smooth 850ms flip physics and zero out tilts
  useEffect(() => {
    if (prevFlippedRef.current !== isFlipped) {
      prevFlippedRef.current = isFlipped;
      setIsManualFlipping(true);
      setRotateX(0);
      setRotateY(0);
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
      flipTimerRef.current = setTimeout(() => {
        setIsManualFlipping(false);
      }, 850);
    }

    return () => {
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    };
  }, [isFlipped]);

  // Screen-wide ambient mouse tracking (tracks cursor even outside the card)
  useEffect(() => {
    if (!interactive) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      // If directly hovering over the card, local onMouseMove handles the high-precision tilt
      if (isHovered || !cardRef.current) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const rect = cardRef.current.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - cardCenterX;
      const dy = e.clientY - cardCenterY;

      // Gentle ambient tilt: max ±4.5 deg across viewport
      const maxAmbientTilt = 4.5;
      const normX = Math.max(-1, Math.min(1, dx / (window.innerWidth * 0.5)));
      const normY = Math.max(-1, Math.min(1, dy / (window.innerHeight * 0.5)));

      setRotateX(normY * -maxAmbientTilt);
      setRotateY(normX * maxAmbientTilt);

      // Subtle ambient specular sheen shift (between ~40% and 60%)
      setSheenX(50 + normX * 10);
      setSheenY(50 + normY * 10);
    };

    const handleWindowPointerLeave = () => {
      if (!isHovered) {
        setRotateX(0);
        setRotateY(0);
        setSheenX(50);
        setSheenY(50);
      }
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    document.addEventListener('mouseleave', handleWindowPointerLeave);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      document.removeEventListener('mouseleave', handleWindowPointerLeave);
    };
  }, [interactive, isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current || isManualFlipping) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10; // max 10 deg tilt
    const rY = ((x - centerX) / centerX) * 10;
    setRotateX(rX);
    setRotateY(rY);

    setSheenX((x / rect.width) * 100);
    setSheenY((y / rect.height) * 100);
  };

  const handleMouseEnter = () => {
    if (interactive) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
  };

  const toggleCard = () => {
    if (!interactive) return;
    const next = !isFlipped;
    setInternalFlipped(next);
    onFlipChange?.(next);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggleCard();
  };

  const handleFaceClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    toggleCard();
  };

  const getDimensionScore = (d: Dimension): number => {
    if (scores && scores[d] !== null && scores[d] !== undefined) {
      return scores[d]!;
    }
    return archetype.prototype[d] ?? 50;
  };

  const themeColor = archetype.cardColor || '#0066FF';
  const fullImageSrc = archetype.fullCardImagePath || `/archetypes/${archetype.id}.webp`;
  const thumbImageSrc = archetype.thumbnailImagePath || archetype.cardImagePath || `/archetypes/thumbs/${archetype.id}.webp`;

  const [activeImageSrc, setActiveImageSrc] = useState<string>(() => {
    return isImagePreloaded(fullImageSrc) ? fullImageSrc : thumbImageSrc;
  });

  useEffect(() => {
    if (isImagePreloaded(fullImageSrc)) {
      setActiveImageSrc(fullImageSrc);
      return;
    }

    preloadImage(fullImageSrc)
      .then(() => {
        setActiveImageSrc(fullImageSrc);
      })
      .catch(() => {
        setActiveImageSrc(thumbImageSrc);
      });
  }, [fullImageSrc, thumbImageSrc]);

  const verifiedDate = formatVerifiedDate();

  const isForgeFlipping = forgePhase === 'flip_to_back' || forgePhase === 'flip_to_front';
  const isFlipping = isForgeFlipping || isManualFlipping;

  const scaleFactor = isForgeFlipping
    ? 1.03
    : isManualFlipping
    ? 1.045
    : isHovered
    ? 1.025
    : 1;

  const cardTransition = isForgeFlipping
    ? 'transform 1.1s cubic-bezier(0.2, 0.85, 0.25, 1)'
    : isManualFlipping
    ? 'transform 0.85s cubic-bezier(0.2, 0.85, 0.25, 1)'
    : isHovered
    ? 'transform 0.12s ease-out'
    : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

  const isFrontHidden =
    forgePhase === 'oracle_intro' ||
    forgePhase === 'trace_border';
  const isCutoutHidden = forgePhase === 'oracle_intro' || forgePhase === 'trace_border';
  const isImpactPunching = forgePhase === 'cutout_impact';
  const isBorderTracing = forgePhase === 'trace_border';

  return (
    <div
      style={{ perspective: 1400, touchAction: 'manipulation' }}
      onClick={toggleCard}
      onKeyDown={handleCardKeyDown}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? isFlipped : undefined}
      aria-label={interactive ? `Show ${isFlipped ? 'front' : 'back'} of card` : undefined}
      className={`w-full flex justify-center items-center select-none relative z-40 transition-opacity duration-500 ${
        forgePhase === 'oracle_intro' ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'
      } ${interactive ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Radiant Shockwave Ring Layer on Impact (Option 1) */}
      {isImpactPunching && (
        <div
          className="absolute pointer-events-none rounded-3xl border-2 z-10 animate-card-shockwave w-full max-w-[285px] xs:max-w-[310px] sm:max-w-[380px] md:max-w-[440px] aspect-[3/4]"
          style={{
            borderColor: themeColor,
            boxShadow: `0 0 50px 10px ${themeColor}70, inset 0 0 30px ${themeColor}40`,
          }}
        />
      )}

      {/* Elastic Spring Punch Wrapper - completely isolates spring bounce from 3D card tilt */}
      <div
        className={`w-full max-w-[285px] xs:max-w-[310px] sm:max-w-[380px] md:max-w-[440px] aspect-[3/4] flex justify-center items-center relative ${
          isImpactPunching ? 'animate-card-impact-punch' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 3D Rotatable Flippable Card Shell */}
        <div
          ref={cardRef}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg) scale3d(${scaleFactor}, ${scaleFactor}, ${scaleFactor})`,
            transformStyle: 'preserve-3d',
            transition: cardTransition,
            background: `radial-gradient(ellipse at 50% 45%, ${themeColor}26 0%, ${themeColor}0c 50%, #07090E 85%)`,
          }}
          className="relative z-40 w-full h-full rounded-3xl shadow-2xl transition-shadow duration-500 group"
        >
        {/* Holographic Border Outline (Layered behind cutout so cutout can overlay border) */}
        <div
          className={`absolute inset-0 rounded-3xl pointer-events-none border z-15 transition-opacity duration-300 ${
            forgePhase === 'oracle_intro' || forgePhase === 'trace_border'
              ? 'opacity-0'
              : 'opacity-100'
          }`}
          style={{
            borderColor: isHovered || isPopping ? themeColor : 'rgba(255, 255, 255, 0.15)',
            boxShadow: isHovered || isPopping
              ? `0 0 45px -5px ${themeColor}50, inset 0 0 25px ${themeColor}25`
              : '0 15px 35px -10px rgba(0,0,0,0.85)',
            transition: 'all 0.4s ease',
          }}
        />

        {/* Interactive Specular Holographic Foil Sheen */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none mix-blend-overlay z-15 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 60%)`,
            opacity: isHovered ? 0.45 : 0.18,
          }}
        />

        {/* Holographic Specular Beam Sweep on Impact (Option 2) */}
        {isImpactPunching && (
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-20">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-holo-sweep -skew-x-12" />
          </div>
        )}

        {/* Glowing Vector Border Tracing during Forge */}
        {isBorderTracing && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-visible"
          >
            <defs>
              <filter id="forge-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="spark-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feGaussianBlur stdDeviation="2.5" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Trailing Stroke */}
            <rect
              x="1.5"
              y="1.5"
              rx="22.5"
              ry="22.5"
              fill="none"
              stroke={themeColor}
              strokeWidth="3"
              pathLength="1000"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              filter="url(#forge-glow)"
              className="animate-trace-border w-[calc(100%-3px)] h-[calc(100%-3px)]"
            />

            {/* Blazing White Spark Head */}
            <rect
              x="1.5"
              y="1.5"
              rx="22.5"
              ry="22.5"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              strokeLinecap="round"
              pathLength="1000"
              strokeDasharray="24 1000"
              strokeDashoffset="1000"
              filter="url(#spark-glow)"
              className="animate-trace-spark w-[calc(100%-3px)] h-[calc(100%-3px)]"
            />
          </svg>
        )}

        {/* ========================================================================= */}
        {/* FRONT FACE: Archetype Persona & Collectible Cutout (Overflow-Visible 3D)  */}
        {/* ========================================================================= */}
        <div
          onClick={handleFaceClick}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transition: isFlipping ? 'opacity 0.2s ease 0.38s' : 'opacity 0.2s ease',
          }}
          className={`absolute inset-0 w-full h-full rounded-3xl p-3.5 sm:p-4 md:p-5 flex flex-col justify-between overflow-visible ${
            isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Clipped Inner Aura Background */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-72 sm:h-72 rounded-full blur-[70px] transition-all duration-700 ${
                isFrontHidden
                  ? 'opacity-10'
                  : isImpactPunching
                  ? 'opacity-90 scale-125 animate-card-aura-flare'
                  : 'opacity-40 group-hover:opacity-85 group-hover:scale-115'
              }`}
              style={{ backgroundColor: themeColor }}
            />
          </div>

          {/* Inner Card Framing Line */}
          <div className="absolute inset-2.5 sm:inset-3 rounded-2xl pointer-events-none border border-white/[0.08] border-dashed z-10" />

          {/* Corner Pips */}
          <div
            className={`absolute top-3.5 left-3.5 w-1.5 h-1.5 rounded-full z-30 transition-opacity duration-500 ${
              isFrontHidden ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ backgroundColor: themeColor }}
          />
          <div
            className={`absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full z-30 transition-opacity duration-500 ${
              isFrontHidden ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ backgroundColor: themeColor }}
          />
          <div
            className={`absolute bottom-3.5 left-3.5 w-1.5 h-1.5 rounded-full z-30 transition-opacity duration-500 ${
              isFrontHidden ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ backgroundColor: themeColor }}
          />
          <div
            className={`absolute bottom-3.5 right-3.5 w-1.5 h-1.5 rounded-full z-30 transition-opacity duration-500 ${
              isFrontHidden ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ backgroundColor: themeColor }}
          />

          {/* Card Front Header: Persona Name (Clean & standardized margins) */}
          <div
            className={`relative z-40 shrink-0 flex items-center justify-between w-full pt-1 px-2 sm:px-2.5 transition-all duration-400 ease-out ${
              isFrontHidden ? '-translate-y-3 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
            }`}
          >
            <div className="flex items-baseline gap-2 truncate">
              <span
                className="text-xs sm:text-[13px] md:text-sm font-display font-black tracking-wider uppercase drop-shadow-sm"
                style={{ color: themeColor }}
              >
                {archetype.personaName || archetype.title}
              </span>
            </div>
          </div>

          {/* Character Cutout Stage (Pops out in 3D over card border on hover) */}
          <div className="relative z-30 flex-1 min-h-0 w-full flex items-end justify-center pointer-events-none overflow-visible -mb-3.5 sm:-mb-4">
            <img
              src={activeImageSrc}
              alt={archetype.title}
              className={`w-full h-full object-contain object-bottom filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.7)] group-hover:drop-shadow-[0_30px_60px_rgba(0,0,0,0.98)] origin-bottom transition-all duration-500 ease-out ${
                isCutoutHidden
                  ? 'opacity-0 scale-90 translate-y-6'
                  : 'opacity-100 scale-[1.12] sm:scale-[1.16] md:scale-[1.18] group-hover:scale-[1.28] sm:group-hover:scale-[1.32] translate-y-3.5 sm:translate-y-4 group-hover:translate-y-0.5 sm:group-hover:translate-y-1'
              }`}
              loading="eager"
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/archetypes/card-back.webp';
              }}
            />
          </div>

          {/* Card Front Footer: Description Plaque (Higher z-index z-40 firmly tucks cutout bottom edge) */}
          <div
            className={`relative z-40 shrink-0 flex flex-col gap-1.5 w-full bg-black/85 backdrop-blur-md px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border border-white/[0.12] shadow-2xl transition-all duration-400 ease-out ${
              isFrontHidden ? 'translate-y-4 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
            }`}
          >
            {/* Title above description */}
            <div className="text-[11px] sm:text-xs md:text-[13px] font-display font-extrabold text-white tracking-tight drop-shadow-sm truncate">
              {archetype.title}
            </div>

            <p className="text-[10px] sm:text-[10.5px] md:text-[11px] text-[#CBD5E1] leading-snug line-clamp-2">
              {archetype.description}
            </p>

            {/* Duality Dots & Single Flip Indicator */}
            <div className="flex justify-between items-center pt-1 border-t border-white/[0.08] mt-0.5 text-[8.5px] sm:text-[9px] font-mono text-[#64748B]">
              <div className="flex items-center gap-1.5 truncate mr-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A54] shrink-0" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] shrink-0" />
                <span className="uppercase tracking-wider truncate">VERIFIED BY HERETIQ · {verifiedDate}</span>
              </div>
              <div className="flex items-center gap-1 text-[#94A3B8] hover:text-white transition-colors shrink-0">
                <span>TAP TO FLIP</span>
                <RotateCcw size={9} />
              </div>
            </div>
          </div>
        </div>


        {/* ========================================================================= */}
        {/* BACK FACE: Encoded 6-Dimension Spectrum Matrix (Bespoke Identity Card)   */}
        {/* ========================================================================= */}
        <div
          onClick={handleFaceClick}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            transition: isFlipping ? 'opacity 0.2s ease 0.38s' : 'opacity 0.2s ease',
          }}
          className={`absolute inset-0 w-full h-full rounded-3xl overflow-hidden p-3.5 sm:p-4 md:p-5 flex flex-col justify-between bg-[#06080F] ${
            isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Inner Card Framing Line */}
          <div className="absolute inset-2.5 sm:inset-3 rounded-2xl pointer-events-none border border-white/[0.08] border-dashed" />

          {/* Corner Pips */}
          <div className="absolute top-3.5 left-3.5 w-1.5 h-1.5 rounded-full z-20" style={{ backgroundColor: themeColor }} />
          <div className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full z-20" style={{ backgroundColor: themeColor }} />
          <div className="absolute bottom-3.5 left-3.5 w-1.5 h-1.5 rounded-full z-20" style={{ backgroundColor: themeColor }} />
          <div className="absolute bottom-3.5 right-3.5 w-1.5 h-1.5 rounded-full z-20" style={{ backgroundColor: themeColor }} />

          {/* Ambient Radial Aura */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full blur-[80px] pointer-events-none opacity-30"
            style={{ backgroundColor: themeColor }}
          />

          {/* Card Back Header: Persona Name & Archetype Title */}
          <div className="relative z-10 shrink-0 flex items-center justify-between w-full pt-1 px-1">
            <div className="flex items-baseline gap-1.5 truncate">
              {archetype.personaName && (
                <span
                  className="text-xs sm:text-[13px] md:text-sm font-display font-black tracking-wider uppercase"
                  style={{ color: themeColor }}
                >
                  {archetype.personaName}
                </span>
              )}
              {archetype.personaName && <span className="text-white/40 text-xs">•</span>}
              <span className="text-xs sm:text-[13px] md:text-sm font-display font-extrabold text-white tracking-tight truncate">
                {archetype.title}
              </span>
            </div>
          </div>

          {/* Center: The User's Encoded 6 Political Spectrums (High-Density Telemetry) */}
          <div className="relative z-10 my-auto w-full flex flex-col gap-2 xs:gap-2.5 sm:gap-3.5 md:gap-4.5 px-1 py-1 sm:py-2">
            {DIMENSIONS_CONFIG.map((cfg, idx) => {
              const score = getDimensionScore(cfg.id);
              return (
                <AnimatedDimensionRow
                  key={cfg.id}
                  cfg={cfg}
                  score={score}
                  isCounting={forgePhase === 'count_matrix'}
                  delayIndex={idx}
                />
              );
            })}
          </div>

          {/* Card Back Footer: Centered Verified Badge & Tap-to-flip affordance */}
          <div className="relative z-10 shrink-0 flex flex-col gap-1.5 w-full bg-black/60 backdrop-blur-md px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl border border-white/[0.09]">
            {/* Centered Verified Badge */}
            <div className="flex items-center justify-center gap-1.5 text-[9px] sm:text-[9.5px] font-mono text-emerald-400 font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A54]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
              <ShieldCheck size={11} className="text-emerald-400" />
              <span>VERIFIED BY HERETIQ · {verifiedDate}</span>
            </div>

            {/* Tap to flip back bar */}
            <div className="flex justify-between items-center pt-1 border-t border-white/[0.06] text-[9px] font-mono text-[#64748B]">
              <span>HERETIQ 2026 EDITION</span>
              <div className="flex items-center gap-1 text-white font-bold cursor-pointer hover:text-white/80 transition-colors">
                <span>TAP TO FLIP FRONT</span>
                <RotateCcw size={9} className="text-white" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);
};
