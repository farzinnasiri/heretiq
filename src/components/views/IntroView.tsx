import { GlassPanel, GlassButton } from '../ui/Glass';
import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ARCHETYPES } from '../../domain/archetypes';

interface IntroViewProps {
  onStart: () => void;
  onOpenHowItWorks: () => void;
  onOpenPrivacy: () => void;
}

export const IntroView: React.FC<IntroViewProps> = ({
  onStart,
  onOpenHowItWorks,
  onOpenPrivacy,
}) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [currentRot, setCurrentRot] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [isSpacePressed, setIsSpacePressed] = useState<boolean>(false);

  const isHoveredRef = useRef(false);
  const lastInteractionRef = useRef(0);
  const activeIdxRef = useRef(activeIdx);
  const currentRotRef = useRef(currentRot);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  activeIdxRef.current = activeIdx;
  currentRotRef.current = currentRot;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const count = ARCHETYPES.length; // 12
  const stepAngle = 360 / count; // 30 deg

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // 3D Carousel Cylinder Dimensions - calibrated for bold presence with generous spacing
  const radius = isMobile ? 275 : isTablet ? 320 : 355; // px
  const cardW = isMobile ? 142 : isTablet ? 154 : 166; // px
  const cardH = isMobile ? 200 : isTablet ? 218 : 234; // px

  // Rotate smoothly to a specific archetype by shortest path
  const rotateTo = (targetIdx: number) => {
    const curRot = currentRotRef.current;
    const currentStep = Math.round(-curRot / stepAngle);
    const currentNorm = ((currentStep % count) + count) % count;
    let diff = targetIdx - currentNorm;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    const newStep = currentStep + diff;
    setActiveIdx(targetIdx);
    setCurrentRot(-newStep * stepAngle);
  };

  // Auto-rotation timer: gently advances to the next archetype in sequence.
  // Pauses completely when mouse/pointer hovers over the carousel, and resumes only after 3.5s of idle time.
  useEffect(() => {
    const timer = setInterval(() => {
      // Pause completely while user has mouse hovered over carousel
      if (isHoveredRef.current) return;

      // Resume transition when user has been idle for 3.5s
      if (Date.now() - lastInteractionRef.current < 3500) return;

      const curRot = currentRotRef.current;
      const currentStep = Math.round(-curRot / stepAngle);
      const nextStep = currentStep + 1;
      const nextIdx = ((nextStep % count) + count) % count;
      setActiveIdx(nextIdx);
      setCurrentRot(-nextStep * stepAngle);
    }, 3200);

    return () => clearInterval(timer);
  }, [count, stepAngle]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      lastInteractionRef.current = Date.now();
      if (e.key === 'ArrowLeft') {
        rotateTo((activeIdx - 1 + count) % count);
      } else if (e.key === 'ArrowRight') {
        rotateTo((activeIdx + 1) % count);
      } else if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsSpacePressed(true);
        setTimeout(() => {
          setIsSpacePressed(false);
          onStart();
        }, 120);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ' || e.key === 'Enter') {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeIdx, currentRot, onStart]);

  // Handle card click: clicking a side card rotates it to center; clicking center card starts quiz
  const handleCardClick = (idx: number, isFront: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    lastInteractionRef.current = Date.now();

    if (isFront) {
      onStart();
    } else {
      rotateTo(idx);
    }
  };

  // Touch swipe handling for mobile devices (discrete swipe to next/previous, no continuous wheel drag)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    lastInteractionRef.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    lastInteractionRef.current = Date.now();

    // Significant horizontal swipe
    if (Math.abs(deltaX) > 36 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
      if (deltaX < 0) {
        // Swiped left -> next card
        rotateTo((activeIdxRef.current + 1) % count);
      } else {
        // Swiped right -> prev card
        rotateTo((activeIdxRef.current - 1 + count) % count);
      }
    }
  };

  const activeArchetype = ARCHETYPES[activeIdx];

  return (
    <div className="min-h-dvh lg:h-dvh lg:max-h-dvh w-full flex flex-col justify-between px-3.5 py-2 sm:px-8 sm:py-5 lg:px-12 max-w-7xl mx-auto z-10 select-none overflow-x-hidden overflow-y-auto sm:overflow-hidden pb-[max(1.5rem,env(safe-area-inset-bottom,24px))] lg:pb-5">
      {/* Top Header */}
      <header className="relative flex justify-between items-center w-full shrink-0 pt-1 pb-2 sm:pb-3">
        {/* Left: 100% Private On-Device badge */}
        <GlassPanel className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-sm">
          <ShieldCheck size={14} className="text-[#10B981]" />
          <span className="text-[11px] font-mono text-[#94A3B8] font-medium hidden sm:inline">
            100% private. Zero data stored.
          </span>
          <span className="text-[11px] font-mono text-[#94A3B8] font-medium sm:hidden">
            100% Private
          </span>
        </GlassPanel>

        {/* Center: Signature HERETIQ Brand Logo (HERETIQ above dual dots) */}
        <GlassPanel className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] select-none" aria-label="HERETIQ">
          <span className="font-heading text-xs sm:text-[13px] font-black tracking-widest text-white uppercase leading-none">
            HERETIQ
          </span>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2 h-2 rounded-full bg-[#FF2A54] shadow-[0_0_8px_#FF2A54] animate-pulse" />
            <span
              className="w-2 h-2 rounded-full bg-[#0066FF] shadow-[0_0_8px_#0066FF] animate-pulse"
              style={{ animationDelay: '1.2s' }}
            />
          </div>
        </GlassPanel>

        {/* Right: Clean Utility Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <GlassButton
            onClick={onOpenHowItWorks}
            title="How it works & Methodology"
            aria-label="How it works & Methodology"
            className="p-2 text-[#94A3B8] hover:text-white rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all cursor-pointer"
          >
            <HelpCircle size={19} />
          </GlassButton>
          <GlassButton
            onClick={onOpenPrivacy}
            title="Privacy (100% on device)"
            aria-label="Privacy policy"
            className="p-2 text-[#94A3B8] hover:text-white rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all cursor-pointer"
          >
            <ShieldCheck size={19} />
          </GlassButton>
        </div>
      </header>

      {/* Main Center Stage: 3D Cylindrical Carousel */}
      <main className="my-auto flex flex-col items-center text-center justify-between sm:justify-center grow py-2 sm:py-3 w-full max-w-6xl mx-auto">
        {/* Headline with Elegant Tilted Stamp Label */}
        <div className="relative inline-flex flex-col items-center justify-center max-w-4xl mx-auto mb-2.5 sm:mb-6 lg:mb-10 px-2 shrink-0">
          {/* Mobile Eyebrow Stamp - bold, crisp, perfectly placed above headline */}
          <GlassPanel className="sm:hidden inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0C1018]/95 border border-dashed border-[#FF2A54]/60 shadow-[0_6px_20px_-5px_rgba(255,42,84,0.35)] backdrop-blur-md mb-2.5 transform -rotate-[2deg] select-none">
            <span className="w-2 h-2 rounded-full bg-[#FF2A54] shadow-[0_0_8px_#FF2A54] animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-[#94A3B8] uppercase flex items-center gap-1">
              UNDER <span className="font-display font-black text-xs text-white tracking-tight">3 MINUTES</span>
            </span>
          </GlassPanel>

          <div className="relative">
            <h1 className="text-[28px] xs:text-[34px] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-display font-black tracking-tight leading-[1.22] sm:leading-[1.08] text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3F4F6] to-white/90 block sm:inline pb-1">
                What is your
              </span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A54] via-[#FF637D] to-[#0066FF] drop-shadow-[0_0_35px_rgba(255,42,84,0.4)] block sm:inline pb-1">
                political archetype?
              </span>
            </h1>

            {/* Desktop Corner Tilted Stamp */}
            <div className="hidden sm:inline-flex absolute -top-6 -right-6 lg:-right-12 transform rotate-[6deg] hover:rotate-0 transition-transform duration-300 pointer-events-none select-none">
              <GlassPanel className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0C1018]/95 border border-dashed border-[#FF2A54]/60 shadow-[0_8px_25px_-5px_rgba(255,42,84,0.35)] backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A54] shadow-[0_0_8px_#FF2A54] animate-pulse" />
                <span className="text-[11px] font-mono tracking-wider text-[#94A3B8] uppercase flex items-center gap-1">
                  UNDER <span className="font-display font-black text-sm text-white tracking-tight">3 MINUTES</span>
                </span>
              </GlassPanel>
            </div>
          </div>
        </div>

        {/* 3D Round Carousel Stage - Generously sized for bold cards with ample clearance */}
        <div className="relative w-full max-w-4xl lg:max-w-5xl h-[240px] sm:h-[305px] lg:h-[340px] flex items-center justify-center mb-2 sm:mb-4 lg:mb-6 shrink-0">
          {/* Ambient Lighting Dome */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[660px] h-[260px] sm:h-[340px] rounded-full blur-[90px] pointer-events-none transition-colors duration-700 opacity-30"
            style={{ backgroundColor: activeArchetype?.cardColor || '#0066FF' }}
          />

          {/* Glowing Floor Reflection Disk */}
          <div
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[320px] sm:w-[500px] h-[36px] sm:h-[48px] rounded-full blur-xl pointer-events-none transition-all duration-700 opacity-40"
            style={{
              backgroundColor: activeArchetype?.cardColor || '#0066FF',
              transform: 'rotateX(80deg)',
            }}
          />

          {/* Left / Right Carousel Navigation Buttons (Desktop only - floating side arrows) */}
          <GlassButton
            type="button"
            onClick={() => {
              lastInteractionRef.current = Date.now();
              rotateTo((activeIdx - 1 + count) % count);
            }}
            className="hidden sm:flex absolute left-4 lg:left-8 z-40 w-11 h-11 items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.2] active:bg-white/[0.25] border border-white/15 hover:border-white/30 text-white/80 hover:text-white backdrop-blur-md transition-all active:scale-90 cursor-pointer shadow-lg group"
            aria-label="Previous archetype"
          >
            <ChevronLeft size={22} className="transition-transform group-hover:-translate-x-0.5" />
          </GlassButton>

          <GlassButton
            type="button"
            onClick={() => {
              lastInteractionRef.current = Date.now();
              rotateTo((activeIdx + 1) % count);
            }}
            className="hidden sm:flex absolute right-4 lg:right-8 z-40 w-11 h-11 items-center justify-center rounded-full bg-white/[0.08] hover:bg-white/[0.2] active:bg-white/[0.25] border border-white/15 hover:border-white/30 text-white/80 hover:text-white backdrop-blur-md transition-all active:scale-90 cursor-pointer shadow-lg group"
            aria-label="Next archetype"
          >
            <ChevronRight size={22} className="transition-transform group-hover:translate-x-0.5" />
          </GlassButton>

          {/* 3D Perspective Viewport */}
          <div
            style={{ perspective: `${isMobile ? 1050 : 1200}px` }}
            className="relative w-full h-full flex items-center justify-center select-none"
            onMouseEnter={() => {
              isHoveredRef.current = true;
              lastInteractionRef.current = Date.now();
            }}
            onMouseMove={() => {
              lastInteractionRef.current = Date.now();
            }}
            onMouseLeave={() => {
              isHoveredRef.current = false;
              lastInteractionRef.current = Date.now();
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* 3D Rotating Cylinder Rotor - Aligned at Eye Level (rotateX 0deg) */}
            <div
              style={{
                width: `${cardW}px`,
                height: `${cardH}px`,
                transformStyle: 'preserve-3d',
                transform: `rotateX(0deg) rotateY(${currentRot}deg)`,
                transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="relative"
            >
              {ARCHETYPES.map((arch, idx) => {
                const cardAngle = idx * stepAngle;
                // Calculate relative angular distance to front
                let relAngle = ((cardAngle + currentRot) % 360 + 540) % 360 - 180;
                const isFront = Math.abs(relAngle) < 16;
                const themeColor = arch.cardColor || '#0066FF';

                // Distance falloff: keep visible cards solid and opaque so outlines are crisp
                const angleFromFront = Math.abs(relAngle);
                const opacity = angleFromFront > 85 ? 0 : angleFromFront > 65 ? 0.75 : 1;
                const brightness = isFront
                  ? 1.05
                  : Math.max(0.52, 1 - (angleFromFront / 90) * 0.48);

                const extraZ = isFront ? (isMobile ? 8 : 24) : 0;
                const cardScale = isFront ? (isMobile ? 'scale(1.04)' : 'scale(1.08)') : 'scale(1)';

                return (
                  <div
                    key={arch.id}
                    onClick={(e) => handleCardClick(idx, isFront, e)}
                    role="button"
                    tabIndex={angleFromFront > 82 ? -1 : 0}
                    title={isFront ? 'Start quiz' : `View ${arch.personaName || arch.title}`}
                    aria-label={isFront ? `Start quiz as ${arch.title}` : `Rotate to ${arch.title}`}
                    style={{
                      width: `${cardW}px`,
                      height: `${cardH}px`,
                      transform: `rotateY(${cardAngle}deg) translateZ(${radius + extraZ}px) ${cardScale}`,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      opacity,
                      filter: `brightness(${brightness})`,
                      background: `radial-gradient(circle at 50% 45%, ${themeColor}26 0%, ${themeColor}0c 50%, #0B0F19 82%)`,
                      pointerEvents: angleFromFront > 82 ? 'none' : 'auto',
                      transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, filter 0.4s ease',
                      borderColor: isFront ? themeColor : undefined,
                      boxShadow: isFront
                        ? `0 0 0 2px #FFFFFF, 0 0 22px 2px rgba(255, 255, 255, 0.65), 0 0 45px 6px ${themeColor}70, inset 0 0 16px 1px ${themeColor}30, 0 20px 45px -5px rgba(0, 0, 0, 0.95)`
                        : undefined,
                    }}
                    className={`intro-carousel-card absolute inset-0 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between p-2 sm:p-3 select-none group transition-all duration-300 ${
                      isFront
                        ? 'border-2 z-30'
                        : 'border-[1.5px] border-white/25 hover:border-white/60 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.85)] z-10 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02]'
                    }`}
                  >
                    {/* Seamless Organic Card Backlight Aura (Card-Level, no square clipping) */}
                    <div
                      className="intro-card-aura absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-44 sm:h-44 rounded-full blur-2xl pointer-events-none opacity-45"
                      style={{ backgroundColor: themeColor }}
                    />

                    {/* Inner collectible card hairline border */}
                    <div className="absolute inset-1 rounded-xl border border-white/[0.07] pointer-events-none" />

                    {/* Top: Code & Pip */}
                    <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-black z-10 shrink-0 px-0.5">
                      <span style={{ color: themeColor }}>{arch.code}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px]"
                        style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }}
                      />
                    </div>

                    {/* Center: Character Persona Cutout (Unclipped, seamless, constrained) */}
                    <div className="relative grow min-h-0 flex items-center justify-center my-0.5 z-10">
                      <img
                        src={arch.thumbnailImagePath || arch.cardImagePath || `/archetypes/thumbs/${arch.id}.webp`}
                        alt={arch.title}
                        width={166}
                        height={234}
                        className="h-full w-full max-h-full max-w-full object-contain pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105"
                        loading="eager"
                        decoding="async"
                      />
                    </div>

                    {/* Bottom: Persona Name & Archetype Subtitle - Securely grounded inside card */}
                    <div className="flex flex-col items-center justify-center text-center z-10 shrink-0 px-1 pt-1 pb-1 min-h-[38px] sm:min-h-[42px] leading-tight w-full">
                      <span className="text-[13px] sm:text-[15px] font-display font-black tracking-wider text-white uppercase drop-shadow-md leading-none">
                        {arch.personaName || arch.title.replace(/^The /, '')}
                      </span>
                      <span className="text-[9.5px] sm:text-[11px] font-display text-[#94A3B8] font-semibold tracking-tight text-center max-w-full leading-tight mt-1 whitespace-nowrap">
                        {arch.title.replace(/^The /, '')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 12 Archetypes Navigator with Integrated Mobile Thumb Chevrons */}
        <div className="flex items-center justify-center gap-3.5 sm:gap-2.5 my-3 sm:my-4 lg:my-5 shrink-0">
          {/* Mobile Thumb Prev Button - Enlarger for easier tapping */}
          <GlassButton
            type="button"
            onClick={() => {
              lastInteractionRef.current = Date.now();
              rotateTo((activeIdx - 1 + count) % count);
            }}
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.1] active:bg-white/25 border border-white/20 text-white active:scale-90 transition-all cursor-pointer shadow-md"
            aria-label="Previous archetype"
          >
            <ChevronLeft size={18} />
          </GlassButton>

          {/* 12 Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {ARCHETYPES.map((arch, i) => (
              <button
                key={arch.id}
                onClick={() => {
                  lastInteractionRef.current = Date.now();
                  rotateTo(i);
                }}
                title={`${arch.personaName ? arch.personaName + ' • ' : ''}${arch.title}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeIdx === i ? 'w-7 shadow-sm' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                style={{
                  backgroundColor: activeIdx === i ? arch.cardColor : undefined,
                }}
              />
            ))}
          </div>

          {/* Mobile Thumb Next Button */}
          <GlassButton
            type="button"
            onClick={() => {
              lastInteractionRef.current = Date.now();
              rotateTo((activeIdx + 1) % count);
            }}
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.1] active:bg-white/25 border border-white/20 text-white active:scale-90 transition-all cursor-pointer shadow-md"
            aria-label="Next archetype"
          >
            <ChevronRight size={18} />
          </GlassButton>
        </div>

        {/* Dynamic Archetype Inspector Banner / Pill - Bigger on mobile, generous padding */}
        <div className="min-h-[80px] sm:min-h-[96px] flex items-center justify-center mb-2 sm:mb-5 lg:mb-6 px-2 w-full shrink-0">
          {activeArchetype ? (
            <div
              key={activeArchetype.id}
              className="w-full h-full max-w-[380px] sm:max-w-xl lg:max-w-2xl flex flex-col items-center justify-center text-center px-5 py-2 sm:px-7 sm:py-3 rounded-2xl bg-white/[0.04] border backdrop-blur-md shadow-lg transition-all duration-300 animate-fadeIn"
              style={{
                borderColor: `${activeArchetype.cardColor}45`,
                boxShadow: `0 4px 20px -4px ${activeArchetype.cardColor}25`,
              }}
            >
              {/* Archetype Title with glowing indicator & Persona Name */}
              <div className="flex items-center justify-center gap-2 mb-1 shrink-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 transition-colors duration-500"
                  style={{
                    backgroundColor: activeArchetype.cardColor,
                    boxShadow: `0 0 10px ${activeArchetype.cardColor}`,
                  }}
                />
                <span className="font-display font-extrabold text-white text-sm sm:text-base lg:text-[17px] tracking-wide leading-tight">
                  {activeArchetype.personaName && (
                    <span style={{ color: activeArchetype.cardColor }} className="mr-1.5 font-black uppercase">
                      {activeArchetype.personaName}
                    </span>
                  )}
                  <span className="text-white/40 font-normal mr-1.5">•</span>
                  {activeArchetype.title}
                </span>
              </div>

              {/* Archetype Description - full text, clear and readable on mobile */}
              <p className="text-[#94A3B8] text-xs sm:text-sm leading-snug text-center font-sans max-w-[360px] sm:max-w-lg lg:max-w-xl">
                {activeArchetype.description}
              </p>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 text-xs text-[#64748B] font-mono">
              <Sparkles size={13} className="text-[#0066FF]" />
              <span>Click or tap cards to explore 12 archetypes</span>
            </div>
          )}
        </div>

        {/* Primary CTA: 3D Sculpted Spacebar Keycap */}
        <div className="flex flex-col items-center w-full max-w-[340px] sm:max-w-md mx-auto mb-1.5 sm:mb-4 shrink-0 relative group">
          {/* Ambient Deep Radiant Under-Glow (Bilateral Crimson to Cobalt Aura) */}
          <div
            className="absolute inset-x-6 -bottom-2 h-16 rounded-2xl blur-2xl opacity-60 group-hover:opacity-90 group-active:opacity-40 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, rgba(255, 42, 84, 0.75) 0%, rgba(139, 92, 246, 0.75) 50%, rgba(0, 102, 255, 0.75) 100%)',
            }}
          />

          {/* 3D Extruded Chassis Base (Anchored bottom layer) */}
          <div
            className="relative w-full rounded-2xl transition-all duration-150 ease-out"
            style={{
              background: 'linear-gradient(90deg, #5B081E 0%, #2A0547 50%, #082154 100%)',
              boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.85), 0 0 45px -8px rgba(124, 58, 237, 0.4)',
            }}
          >
            {/* The Moving 3D Keycap (Pushes down mechanically into the base) */}
            <button
              type="button"
              onClick={onStart}
              aria-label="Discover your Archetype"
              className={`relative w-full py-4 sm:py-4.5 px-6 sm:px-8 rounded-2xl flex items-center justify-center cursor-pointer select-none overflow-hidden transition-transform duration-120 ease-out border border-white/25 ${
                isSpacePressed
                  ? 'translate-y-0 shadow-none'
                  : '-translate-y-[5px] group-hover:-translate-y-[7px] group-active:translate-y-0 shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
              }`}
              style={{
                background: 'linear-gradient(135deg, #FF2A54 0%, #7928CA 50%, #0066FF 100%)',
              }}
            >
              {/* Cylindrical Keycap Top Convex Highlight */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl opacity-40 mix-blend-overlay"
                style={{
                  background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%)',
                }}
              />

              {/* Specular Top Lip Bevel */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-white/30 via-white/80 to-white/30 pointer-events-none" />

              {/* Specular Holographic Sheen Sweep on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

              {/* Centered Primary Label */}
              <div className="flex items-center justify-center gap-2.5 z-10">
                <span className="font-display font-black text-xs sm:text-sm md:text-[15px] uppercase tracking-wider text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                  Discover your Archetype
                </span>
                <ArrowRight
                  size={18}
                  strokeWidth={2.5}
                  className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] transition-transform duration-200 group-hover:translate-x-1.5"
                />
              </div>

              {/* Desktop Spacebar Indicator Badge (Docked cleanly on the right, does not displace center text) */}
              <div className="hidden sm:flex items-center gap-1.5 absolute right-4 text-[10px] font-mono font-bold text-white/85 bg-black/30 px-2.5 py-1 rounded-lg border border-white/20 backdrop-blur-sm shadow-inner z-10 tracking-wider">
                <span className="text-[12px] leading-none">␣</span>
                <span>SPACE</span>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Breathing room bottom */}
      <div className="h-1 sm:h-2 shrink-0" />
    </div>
  );
};
