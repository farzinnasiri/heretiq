import { GlassButton, GlassPanel } from '../ui/Glass';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Scores,
  Coverage,
  Heresy,
} from '../../domain/types';
import { DIMENSIONS, DIMENSION_META } from '../../domain/questions';
import { ArchetypeResult } from '../../domain/archetypes';
import { TraitItem } from '../../domain/personalRead';
import { EvaluatedTension } from '../../domain/tensions';
import { FoilEvaluation } from '../../domain/foil';
import { ExportFormat } from '../../canvas/cardRenderer';
import {
  createShareAsset,
  shareResult,
  shareQuizInvite,
  downloadAsset,
  isMobileDevice,
  canShareFiles,
  ShareAsset,
} from '../../canvas/exportUtils';
import { calculateClassicalCompass } from '../../domain/classicalCompass';
import { ClassicalCompassWidget } from '../results/ClassicalCompassWidget';
import { NotableFigures } from '../results/NotableFigures';
import { ArchetypeCard, ForgePhase } from '../cards/ArchetypeCard';
import { ShareModal } from '../modals/ShareModal';
import { ResetConfirmModal } from '../modals/ResetConfirmModal';
import { preloadArchetypeAssets } from '../../utils/imagePreloader';
import {
  Share2,
  Download,
  Check,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Activity,
  Compass,
  RotateCcw,
  RotateCw,
  Sparkles,
  X,
  HelpCircle,
  ShieldCheck,
  Send,
} from 'lucide-react';

// All deep-dive sections shown in a single continuous view (no tabs)

interface ResultViewProps {
  scores: Scores;
  coverage: Coverage;
  archetypeResult: ArchetypeResult;
  personalRead: string;
  strongTraits: TraitItem[];
  shareLine: string;
  tensions: EvaluatedTension[];
  heresy: Heresy | null;
  foilEval: FoilEvaluation;
  cardSerial: string;
  shareableUrl: string;
  includeHeresyOnExport: boolean;
  setIncludeHeresyOnExport: (include: boolean) => void;
  isSharedLink?: boolean;
  triggerForge?: boolean;
  onFinishForge?: () => void;
  onReplayForge?: () => void;
  onTakeQuizToCompare?: () => void;
  onOpenHowItWorks: () => void;
  onOpenPrivacy: () => void;
  onStartAgain: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  scores,
  coverage,
  archetypeResult,
  personalRead,
  strongTraits,
  shareLine,
  tensions: _tensions,
  heresy: _heresy,
  foilEval: _foilEval,
  cardSerial,
  shareableUrl,
  includeHeresyOnExport: _includeHeresyOnExport,
  setIncludeHeresyOnExport: _setIncludeHeresyOnExport,
  isSharedLink = false,
  triggerForge = false,
  onFinishForge,
  onReplayForge,
  onTakeQuizToCompare,
  onOpenHowItWorks,
  onOpenPrivacy,
  onStartAgain,
}) => {
  // Cinema Forge reveal state machine
  const [forgePhase, setForgePhase] = useState<ForgePhase>(
    triggerForge ? 'oracle_intro' : 'settled'
  );
  const [oracleStep, setOracleStep] = useState<1 | 2>(1);
  const [isOracleFadingOut, setIsOracleFadingOut] = useState<boolean>(false);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  // Side panel open state (desktop 2-column or mobile bottom sheet)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  );

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event: MediaQueryListEvent) => setIsDesktopViewport(event.matches);
    setIsDesktopViewport(query.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  // Drag-to-dismiss gesture state for mobile bottom sheet
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    if (deltaY > 0) {
      setDragOffsetY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (dragOffsetY > 65) {
      setIsSidePanelOpen(false);
    }
    setDragOffsetY(0);
    touchStartYRef.current = null;
  };

  // Lock background scroll when mobile bottom sheet is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isSidePanelOpen && window.innerWidth < 1024) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isSidePanelOpen]);

  // Export & sharing state
  const [copiedQuizLink, setCopiedQuizLink] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  const classicalResult = useMemo(() => calculateClassicalCompass(scores), [scores]);
  const themeColor = archetypeResult.archetype.cardColor || '#0066FF';
  const assetPromisesRef = useRef<Partial<Record<ExportFormat, Promise<ShareAsset>>>>({});

  const onFinishForgeRef = useRef(onFinishForge);
  onFinishForgeRef.current = onFinishForge;
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const runForgeSequence = useCallback(() => {
    clearAllTimers();

    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setForgePhase('settled');
      setOracleStep(2);
      setIsOracleFadingOut(false);
      setIsCardFlipped(false);
      onFinishForgeRef.current?.();
      return;
    }

    // Step 1: Oracle Proclamation Phase 1 - "IDENTITY SYNTHESIS COMPLETE" / "YOU ARE" (0ms -> 1800ms)
    setForgePhase('oracle_intro');
    setOracleStep(1);
    setIsOracleFadingOut(false);
    setIsCardFlipped(false);

    // Step 1b: Oracle Proclamation Phase 2 - Dramatic Big & Bold Identity Reveal (1800ms -> 4400ms)
    const oraclePhase2Timer = setTimeout(() => {
      setOracleStep(2);
    }, 1800);
    timersRef.current.push(oraclePhase2Timer);

    // Smooth fade-out of oracle overlay before card border trace
    const oracleFadeTimer = setTimeout(() => {
      setIsOracleFadingOut(true);
    }, 4100);
    timersRef.current.push(oracleFadeTimer);

    // Step 2: Glowing spark traces border outline (4400ms -> 6200ms, duration 1800ms)
    const traceTimer = setTimeout(() => {
      setForgePhase('trace_border');
    }, 4400);
    timersRef.current.push(traceTimer);

    // Step 3: Cutout slams in with camera shake (6200ms -> 7200ms, duration 1000ms)
    const impactTimer = setTimeout(() => {
      setForgePhase('cutout_impact');
    }, 6200);
    timersRef.current.push(impactTimer);

    // Step 4: Card front details hold (7200ms -> 8400ms, duration 1200ms)
    const fillFrontTimer = setTimeout(() => {
      setForgePhase('fill_front');
    }, 7200);
    timersRef.current.push(fillFrontTimer);

    // Step 5: Smooth 3D flip to back face (8400ms -> 9500ms, duration 1100ms)
    const flipBackTimer = setTimeout(() => {
      setForgePhase('flip_to_back');
      setIsCardFlipped(true);
    }, 8400);
    timersRef.current.push(flipBackTimer);

    // Step 6: Back spectrums cascade in and counters roll up (9500ms -> 13100ms, duration 3600ms)
    const countTimer = setTimeout(() => {
      setForgePhase('count_matrix');
    }, 9500);
    timersRef.current.push(countTimer);

    // Step 7: Smooth 3D flip back to front face (13100ms -> 14200ms, duration 1100ms)
    const flipFrontTimer = setTimeout(() => {
      setForgePhase('flip_to_front');
      setIsCardFlipped(false);
    }, 13100);
    timersRef.current.push(flipFrontTimer);

    // Step 8: Settle, reveal buttons deck, enable interactions (14200ms)
    const settleTimer = setTimeout(() => {
      setForgePhase('settled');
      onFinishForgeRef.current?.();
    }, 14200);
    timersRef.current.push(settleTimer);
  }, [clearAllTimers]);

  const handleSkipForge = useCallback(() => {
    clearAllTimers();
    setForgePhase('settled');
    setOracleStep(2);
    setIsOracleFadingOut(false);
    setIsCardFlipped(false);
    onFinishForgeRef.current?.();
  }, [clearAllTimers]);

  const handleCardFlip = useCallback((flipped: boolean) => {
    if (forgePhase !== 'settled') {
      clearAllTimers();
      setForgePhase('settled');
      setOracleStep(2);
      setIsOracleFadingOut(false);
      onFinishForgeRef.current?.();
    }
    setIsCardFlipped(flipped);
  }, [clearAllTimers, forgePhase]);

  // Proactively preload the full-resolution archetype artwork during oracle proclamation animation
  useEffect(() => {
    const fullImg = archetypeResult.archetype.fullCardImagePath || `/archetypes/${archetypeResult.archetype.id}.webp`;
    preloadArchetypeAssets(fullImg);
  }, [archetypeResult.archetype]);

  // Handle cinematic forge card reveal choreography on mount - runs strictly once if triggerForge is true
  useEffect(() => {
    if (triggerForge) {
      runForgeSequence();
    }
    return () => {
      clearAllTimers();
    };
  }, []);

  // Keyboard navigation: Escape closes deep dive or skips forge, Space skips forge
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (forgePhase !== 'settled') {
        if (e.key === 'Escape' || e.key === ' ') {
          e.preventDefault();
          handleSkipForge();
          return;
        }
      }
      if (e.key === 'Escape') {
        setIsSidePanelOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [forgePhase, handleSkipForge]);

  const handleReplayForge = useCallback(() => {
    if (forgePhase !== 'settled') return;
    setIsSidePanelOpen(false);
    onReplayForge?.();
    runForgeSequence();
  }, [forgePhase, onReplayForge, runForgeSequence]);

  const getShareAsset = useCallback((format: ExportFormat): Promise<ShareAsset> => {
    const cached = assetPromisesRef.current[format];
    if (cached) return cached;

    const hostname = typeof window !== 'undefined'
      ? window.location.hostname || 'heretiq.app'
      : 'heretiq.app';

    const promise = createShareAsset(format, {
      cardSerial,
      archetype: archetypeResult.archetype,
      isFallbackArchetype: archetypeResult.isFallback,
      shareLine,
      strongTraits,
      hostname,
      classicalResult,
    }).catch((error) => {
      delete assetPromisesRef.current[format];
      throw error;
    });

    assetPromisesRef.current[format] = promise;
    return promise;
  }, [archetypeResult, cardSerial, classicalResult, shareLine, strongTraits]);

  useEffect(() => {
    assetPromisesRef.current = {};
    if (forgePhase !== 'settled') return;

    const timer = window.setTimeout(() => {
      void getShareAsset('portrait');
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [cardSerial, forgePhase, getShareAsset]);

  const showExportMessage = useCallback((message: string) => {
    setExportMessage(message);
    window.setTimeout(() => setExportMessage(null), 3500);
  }, []);

  const handleShareResult = async () => {
    if (!canShareFiles() && !isMobileDevice()) {
      setIsShareModalOpen(true);
      return;
    }

    setIsExporting(true);
    setExportMessage('Preparing portrait image…');

    try {
      const asset = await getShareAsset('portrait');
      const result = await shareResult(asset, shareableUrl);

      if (result === 'shared') {
        showExportMessage('Result shared.');
      } else if (result === 'unsupported' || result === 'failed') {
        setIsShareModalOpen(true);
      } else {
        setExportMessage(null);
      }
    } catch (error) {
      console.error(error);
      showExportMessage('Could not prepare the image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveImage = async () => {
    setIsExporting(true);
    setExportMessage('Preparing portrait image…');

    try {
      const asset = await getShareAsset('portrait');

      if (isMobileDevice() && canShareFiles()) {
        const result = await shareResult(asset, shareableUrl);
        if (result === 'shared') {
          showExportMessage('Image shared.');
        } else if (result === 'failed') {
          downloadAsset(asset);
          showExportMessage('Portrait image saved.');
        } else {
          setExportMessage(null);
        }
      } else {
        downloadAsset(asset);
        showExportMessage('Portrait image saved.');
      }
    } catch (error) {
      console.error(error);
      showExportMessage('Could not prepare the image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };


  const handleInviteFriend = async () => {
    const homeUrl = typeof window !== 'undefined' ? window.location.origin : 'https://heretiq.app';
    const result = await shareQuizInvite(homeUrl);

    if (result === 'copied') {
      setCopiedQuizLink(true);
      showExportMessage('Quiz link copied to clipboard!');
      window.setTimeout(() => setCopiedQuizLink(false), 3000);
    } else if (result === 'shared') {
      showExportMessage('Quiz invitation sent.');
    } else if (result === 'failed') {
      try {
        await navigator.clipboard.writeText(homeUrl);
        setCopiedQuizLink(true);
        window.setTimeout(() => setCopiedQuizLink(false), 3000);
      } catch {
        prompt('Share quiz link:', homeUrl);
      }
    }
  };

  const isForging = forgePhase !== 'settled';

  return (
    <div className="min-h-dvh lg:h-dvh lg:max-h-dvh w-full flex flex-col items-center justify-center px-2 pt-[max(0.6rem,env(safe-area-inset-top,10px))] pb-[max(1rem,env(safe-area-inset-bottom,16px))] sm:p-3 lg:px-5 lg:py-3 max-w-[1720px] mx-auto select-none relative overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      {/* Skip Forge Animation Button - Bottom centered so it never collides with top header buttons */}
      {isForging && (
        <button
          type="button"
          onClick={handleSkipForge}
          className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/90 hover:bg-black border border-white/25 hover:border-white/45 text-xs font-mono text-white/90 hover:text-white backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.85)] active:scale-95 group"
          title="Skip reveal animation (or press Space / Esc)"
        >
          <span>Skip Forge</span>
          <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* Shared Link Banner (if viewing someone else's result) */}
      {isSharedLink && (
        <div className="mb-2 p-2 rounded-xl bg-gradient-to-r from-[#FF2A54]/15 via-[#0E121B] to-[#0066FF]/15 border border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs font-mono shrink-0 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-ping" />
            <span className="text-white/90">
              Viewing <strong>{archetypeResult.archetype.title}</strong>'s Collectible Card
            </span>
          </div>
          <GlassButton
            onClick={onTakeQuizToCompare}
            className="px-3 py-1 bg-white text-[#05060A] font-extrabold text-[10px] uppercase tracking-wider rounded-lg hover:bg-[#F3F4F6] active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer shrink-0"
          >
            Take Quiz to Compare & Clash →
          </GlassButton>
        </div>
      )}

      {/* Result controls */}
      <div className="relative flex justify-center items-center w-full shrink-0 px-1 xs:px-2 py-0.5 sm:py-1 mb-2 sm:mb-2.5 lg:mb-3 z-40">
        <div className="grid grid-cols-[1fr_1fr_1.4fr_1fr_1fr] items-start gap-2 xs:gap-3 sm:gap-4 lg:gap-6 w-full max-w-[430px] lg:max-w-[520px] py-0.5">
          {/* 1. Animate Button */}
          <div className="flex flex-col items-center gap-0.5 xs:gap-1">
            <GlassButton
              onClick={handleReplayForge}
              disabled={isForging}
              className="w-9 h-9 xs:w-10 xs:h-10 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full liquid-glass-button liquid-glass-amber flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 group"
              title="Re-forge card (replay reveal animation)"
              aria-label="Re-forge card"
            >
              <RotateCw size={15} className="text-[#F59E0B] group-hover:rotate-45 transition-transform xs:w-[16px] xs:h-[16px] lg:w-5 lg:h-5" />
            </GlassButton>
            <span className="text-[10px] xs:text-[11px] sm:text-xs lg:text-sm font-sans font-semibold text-[#F59E0B] tracking-tight">
              Animate
            </span>
          </div>

          {/* 2. Reset Button (Opens Confirmation Modal) */}
          <div className="flex flex-col items-center gap-0.5 xs:gap-1">
            <GlassButton
              onClick={() => setIsResetConfirmOpen(true)}
              className="w-9 h-9 xs:w-10 xs:h-10 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full liquid-glass-button liquid-glass-crimson flex items-center justify-center transition-all cursor-pointer group"
              title="Reset progress (start fresh)"
              aria-label="Reset progress"
            >
              <RotateCcw size={15} className="text-[#FF2A54] group-hover:-rotate-45 transition-transform xs:w-[15px] xs:h-[15px] lg:w-5 lg:h-5" />
            </GlassButton>
            <span className="text-[10px] xs:text-[11px] sm:text-xs lg:text-sm font-sans font-semibold text-[#FF2A54] tracking-tight">
              Reset
            </span>
          </div>

          <div className="h-9 xs:h-10 sm:h-10 lg:h-12 flex flex-col items-center justify-center gap-1.5 xs:gap-1.5" aria-label="HERETIQ">
            <span className="font-heading text-xs xs:text-sm sm:base lg:text-base font-black tracking-widest text-white uppercase">HERETIQ</span>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-[#FF2A54] shadow-[0_0_10px_#FF2A54]" />
              <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-[#0066FF] shadow-[0_0_10px_#0066FF]" />
            </div>
          </div>

          {/* 4. Help Button */}
          <div className="flex flex-col items-center gap-0.5 xs:gap-1">
            <GlassButton
              onClick={onOpenHowItWorks}
              className="w-9 h-9 xs:w-10 xs:h-10 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full liquid-glass-button text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Methodology & How it works"
              aria-label="Methodology"
            >
              <HelpCircle size={15} className="xs:w-[16px] xs:h-[16px] lg:w-5 lg:h-5" />
            </GlassButton>
            <span className="text-[10px] xs:text-[11px] sm:text-xs lg:text-sm font-sans font-semibold text-slate-300 tracking-tight">
              Help
            </span>
          </div>

          {/* 5. Privacy Button */}
          <div className="flex flex-col items-center gap-0.5 xs:gap-1">
            <GlassButton
              onClick={onOpenPrivacy}
              className="w-9 h-9 xs:w-10 xs:h-10 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full liquid-glass-button liquid-glass-emerald flex items-center justify-center transition-all cursor-pointer"
              title="Privacy (100% on device)"
              aria-label="Privacy"
            >
              <ShieldCheck size={15} className="text-[#10B981] xs:w-[16px] xs:h-[16px] lg:w-5 lg:h-5" />
            </GlassButton>
            <span className="text-[10px] xs:text-[11px] sm:text-xs lg:text-sm font-sans font-semibold text-[#10B981] tracking-tight">
              Privacy
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace: Hero Card & Actions Deck / Desktop 2-Column Expansion */}
      <main className="relative z-30 flex-1 flex flex-col items-center justify-center min-h-0 w-full overflow-visible px-2 sm:px-4">
        <div
          className={`w-full flex flex-col lg:flex-row items-center justify-center transition-[max-width,gap] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isSidePanelOpen
              ? 'lg:max-w-[980px] xl:max-w-[1400px] 2xl:max-w-[1600px] gap-4 xl:gap-8'
              : 'max-w-[440px] sm:max-w-[460px] md:max-w-[480px] lg:max-w-[380px] xl:max-w-[420px] 2xl:max-w-[450px] gap-0'
          }`}
        >
          {/* Left Column: Hero Card & Actions Deck - Rock-solid vertical anchor, smoothly glides left */}
          <div
            className={`w-full max-w-[340px] sm:max-w-[360px] md:max-w-[370px] shrink-0 flex flex-col items-center justify-center gap-2 lg:gap-3 relative z-30 ${
              isSidePanelOpen
                ? 'lg:max-w-[300px] xl:max-w-[390px] 2xl:max-w-[430px]'
                : 'lg:max-w-[380px] xl:max-w-[420px] 2xl:max-w-[450px]'
            }`}
          >
            {/* Collectible Playing Card (Hero) */}
            <div className="result-card-stage relative z-40 group filter drop-shadow-[0_0_35px_rgba(255,255,255,0.12)] w-full flex justify-center items-center pb-1 sm:pb-2">
              {/* Oracle Proclamation Intro Overlay: 2-Phase Cinematic Reveal */}
              {forgePhase === 'oracle_intro' && (
                <div
                  className={`absolute inset-0 z-40 flex flex-col items-center justify-center text-center px-4 pointer-events-none select-none transition-all duration-300 ease-out ${
                    isOracleFadingOut ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100 blur-0'
                  }`}
                >
                  {/* Phase 1: Proclamation Header & "YOU ARE" */}
                  <div
                    className="flex flex-col items-center justify-center transition-all duration-700 ease-out"
                    style={{
                      transform: oracleStep === 2 ? 'translateY(-10px)' : 'translateY(20px)',
                    }}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF2A54] shadow-[0_0_15px_#FF2A54] animate-pulse" />
                      <span className="text-xs sm:text-sm md:text-base font-mono font-black tracking-[0.3em] sm:tracking-[0.35em] uppercase text-white/85 drop-shadow-md">
                        IDENTITY SYNTHESIS COMPLETE
                      </span>
                      <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#0066FF] shadow-[0_0_15px_#0066FF] animate-pulse" />
                    </div>

                    <h2 className="text-base sm:text-xl md:text-2xl font-mono font-black text-white uppercase tracking-[0.35em] sm:tracking-[0.4em] mb-1 sm:mb-2 drop-shadow-lg">
                      YOU ARE
                    </h2>
                  </div>

                  {/* Phase 2: Dramatic Identity Reveal (Bigger, Bolder Name & Archetype Title) */}
                  <div
                    className={`flex flex-col items-center justify-center transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
                      oracleStep === 2
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-90 translate-y-8 pointer-events-none'
                    }`}
                  >
                    <h1
                      className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight uppercase filter drop-shadow-[0_0_50px_rgba(255,255,255,0.45)] my-1.5 sm:my-2.5 leading-none"
                      style={{ color: archetypeResult.archetype.cardColor || '#0066FF' }}
                    >
                      {archetypeResult.archetype.personaName || archetypeResult.archetype.title}
                    </h1>

                    <div className="h-1 w-24 sm:w-36 my-2.5 sm:my-3.5 bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full shadow-[0_0_20px_white]" />

                    <p className="text-base sm:text-xl md:text-2xl font-heading font-black text-white tracking-[0.2em] sm:tracking-[0.25em] uppercase drop-shadow-lg">
                      {archetypeResult.archetype.personaName ? archetypeResult.archetype.title : 'ARCHETYPE FORGED'}
                    </p>
                  </div>
                </div>
              )}

              {/* Clean, Subtle Ambient Archetype Glow behind Card */}
              <div
                className={`absolute inset-0 -z-10 pointer-events-none flex items-center justify-center transition-all duration-700 ${
                  isForging ? 'opacity-70 scale-105' : 'opacity-35 scale-100'
                }`}
              >
                <div
                  className="result-card-ambient w-80 sm:w-96 h-96 sm:h-[440px] rounded-full blur-[85px] pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${themeColor}40 0%, ${themeColor}12 55%, transparent 75%)`,
                  }}
                />
              </div>

              <ArchetypeCard
                archetype={archetypeResult.archetype}
                classicalResult={classicalResult}
                scores={scores}
                interactive
                isFlipped={isCardFlipped}
                onFlipChange={handleCardFlip}
                isPopping={forgePhase === 'cutout_impact' || forgePhase === 'fill_front'}
                forgePhase={forgePhase}
                className="w-full"
              />
            </div>

            {/* Action CTAs & Drawer Trigger (Staggered High-Tech Entry) - z-10 layered behind card */}
            <div
              className={`flex flex-col gap-1.5 sm:gap-2 w-full shrink-0 relative z-10 transition-opacity duration-300 ${
                isForging ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {/* Row 1: Primary Action Buttons: Share my result & Save image */}
              <div className={`grid grid-cols-2 gap-1.5 sm:gap-2 relative ${
                !isForging ? 'animate-deck-module-1' : 'opacity-0'
              }`}>
                <GlassButton
                  type="button"
                  onClick={handleShareResult}
                  disabled={isExporting}
                  className="relative overflow-hidden py-2 sm:py-2.5 lg:py-3 px-2.5 sm:px-3.5 bg-white text-[#05060A] font-extrabold text-xs sm:text-[13px] lg:text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#F3F4F6] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(255,255,255,0.22)] cursor-pointer group disabled:opacity-50"
                >
                  <Share2 size={13} strokeWidth={2.5} />
                  <span className="truncate">Share result</span>
                </GlassButton>
                <GlassButton
                  type="button"
                  onClick={handleSaveImage}
                  disabled={isExporting}
                  className="py-2 sm:py-2.5 lg:py-3 px-2.5 sm:px-3.5 liquid-glass-button text-white font-extrabold text-xs sm:text-[13px] lg:text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <Download size={13} strokeWidth={2.5} />
                  <span className="truncate">Save image</span>
                </GlassButton>
              </div>

              {/* Row 2: Secondary Action - Invite a Friend */}
              <div className={`w-full ${!isForging ? 'animate-deck-module-2' : 'opacity-0'}`}>
                <GlassButton
                  type="button"
                  onClick={handleInviteFriend}
                  className="w-full py-1.5 sm:py-2 lg:py-2.5 px-3 liquid-glass-button text-[11px] sm:text-xs lg:text-sm font-mono text-[#CBD5E1] hover:text-white rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.99]"
                >
                  {copiedQuizLink ? (
                    <>
                      <Check size={12} className="text-emerald-400 shrink-0" />
                      <span className="text-emerald-400 font-bold truncate">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Send size={11} className="text-[#0066FF] shrink-0" />
                      <span className="truncate">Invite a friend to take the quiz</span>
                    </>
                  )}
                </GlassButton>
              </div>

              {exportMessage && (
                <div className="text-xs font-mono text-white text-center py-1 px-3 bg-white/[0.06] rounded-xl flex items-center justify-center gap-2">
                  <Sparkles size={12} className="text-[#F59E0B] animate-spin" />
                  <span>{exportMessage}</span>
                </div>
              )}

              {/* Row 3: Trigger Button to Open/Close Deep Dive - High visibility */}
              <div className={!isForging ? 'animate-deck-module-3' : 'opacity-0'}>
                <GlassButton
                  type="button"
                  onClick={() => setIsSidePanelOpen(prev => !prev)}
                  className="w-full py-2 sm:py-2.5 lg:py-3 px-3 sm:px-3.5 rounded-xl text-white font-sans text-xs sm:text-[13px] lg:text-sm font-semibold flex items-center justify-between shadow-[0_0_20px_rgba(255,255,255,0.06)] cursor-pointer group active:scale-[0.99] bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 transition-all"
                >
                  <div className="flex items-center gap-1.5 truncate mr-2">
                    <Sparkles size={13} className="text-[#F59E0B] group-hover:rotate-12 transition-transform shrink-0" />
                    <span className="truncate">
                      {isSidePanelOpen ? 'Close Detailed Breakdown' : 'Detailed Spectrum Breakdown'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#94A3B8] shrink-0 font-mono">
                    <span className="font-semibold text-white">{isSidePanelOpen ? 'Close' : 'View'}</span>
                    {isSidePanelOpen ? (
                      <>
                        <ChevronDown size={13} className="lg:hidden group-hover:translate-y-0.5 transition-transform text-white" />
                        <ChevronLeft size={13} className="hidden lg:inline group-hover:-translate-x-0.5 transition-transform text-white" />
                      </>
                    ) : (
                      <>
                        <ChevronUp size={13} className="lg:hidden group-hover:translate-y-0.5 transition-transform text-white" />
                        <ChevronRight size={13} className="hidden lg:inline group-hover:translate-x-0.5 transition-transform text-white" />
                      </>
                    )}
                  </div>
                </GlassButton>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* DESKTOP IN-CANVAS DEEP DIVE: Fluid Responsive Panel                       */}
          {/* ========================================================================= */}
          <div
            className={`hidden lg:block z-10 overflow-hidden transition-[max-width,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isSidePanelOpen
                ? 'flex-1 min-w-0 max-w-[650px] xl:max-w-[920px] 2xl:max-w-[1080px] opacity-100 pointer-events-auto'
                : 'max-w-0 opacity-0 pointer-events-none'
            }`}
          >
            {/* Right Panel Inner Wrapper - fixed width prevents wrapping during animation */}
            <div className="w-full flex flex-col justify-start min-w-0">
              {/* Desktop Close Button (No title, no separator) */}
              <div className="flex justify-end shrink-0 mb-1">
                <GlassButton
                  type="button"
                  onClick={() => setIsSidePanelOpen(false)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.14] border border-white/[0.10] hover:border-white/25 text-[11px] font-mono text-[#CBD5E1] hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Close Deep Dive"
                >
                  <span>Close</span>
                  <X size={13} />
                </GlassButton>
              </div>

              {isSidePanelOpen && isDesktopViewport && renderAllSections(true)}
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MOBILE ONLY: Bottom Sheet Drawer (< lg screens)                          */}
      {/* ========================================================================= */}
      {isSidePanelOpen && !isDesktopViewport && (
        <>
          <div
            onClick={() => setIsSidePanelOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-[6px] transition-opacity duration-300 ease-out opacity-100"
          />

          <GlassPanel
            className={`glass-sheet animate-sheet-up lg:hidden fixed z-50 flex flex-col will-change-transform inset-x-0 bottom-0 max-h-[88dvh] w-full rounded-t-3xl bg-[#080B14]/96 backdrop-blur-2xl border-t border-white/20 shadow-[0_-20px_60px_rgba(0,0,0,0.9)] ${
              dragOffsetY > 0 ? 'duration-0' : 'duration-350 ease-[cubic-bezier(0.32,0.72,0,1)]'
            }`}
            style={dragOffsetY > 0 ? { transform: `translateY(${dragOffsetY}px)` } : undefined}
          >
            {/* Mobile Grab Handle Bar: True Centered Pill Handle & Absolute Close Button */}
            <div
              className="relative flex items-center justify-center pt-3 pb-2.5 px-4 shrink-0 cursor-grab active:cursor-grabbing select-none border-b border-white/[0.06]"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Centered Grab Handle Pill */}
              <div
                className="w-12 h-1.5 rounded-full bg-white/30 hover:bg-white/50 active:bg-white/60 transition-colors cursor-pointer"
                onClick={() => setIsSidePanelOpen(false)}
                aria-label="Drag down to close"
              />
              {/* Absolute Right Close Button */}
              <GlassButton
                type="button"
                onClick={() => setIsSidePanelOpen(false)}
                className="absolute right-4 top-2 w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={15} />
              </GlassButton>
            </div>

            {/* Scrollable Content inside Drawer for Mobile */}
            <div className="overflow-y-auto px-4 py-3 no-scrollbar space-y-4 pb-[max(2.5rem,env(safe-area-inset-bottom,28px))]">
              {renderAllSections(true)}
            </div>
          </GlassPanel>
        </>
      )}

      {/* Unified Result Sharing & Fallback Sheet */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareableUrl}
        archetypeTitle={archetypeResult.archetype.title}
        personaName={archetypeResult.archetype.personaName}
        cardSerial={cardSerial}
        accentColor={themeColor}
        isBusy={isExporting}
        message={exportMessage}
        onSharePortrait={canShareFiles() ? handleShareResult : undefined}
        onDownloadPortrait={() => {
          void (async () => {
            setIsExporting(true);
            try {
              const asset = await getShareAsset('portrait');
              downloadAsset(asset);
              showExportMessage('Portrait image saved.');
            } catch {
              showExportMessage('Could not save portrait image.');
            } finally {
              setIsExporting(false);
            }
          })();
        }}
      />

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={onStartAgain}
      />
    </div>
  );

  function renderAllSections(isOpen: boolean = true) {
    return (
      <div className="flex flex-col justify-start gap-2 sm:gap-2.5 lg:gap-2 xl:gap-3 w-full py-0.5 lg:py-0">
        {/* TOP ROW: Two-Column Workspace (Political Spectrums on left, Classical Compass on right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6 items-start w-full">
          {/* SECTION 1: Political Spectrums */}
          <section className="flex flex-col justify-start min-w-0">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 lg:mb-1 xl:mb-2">
                <Activity size={14} className="text-[#0066FF] xl:w-4 xl:h-4" />
                <span className="text-[11px] xl:text-xs font-mono tracking-widest text-[#64748B] uppercase font-bold">
                  POLITICAL SPECTRUMS
                </span>
              </div>

              {/* 6 Dimension Sliders */}
              <div className="flex flex-col divide-y divide-white/[0.06]">
                {DIMENSIONS.map((d, index) => {
                  const s = scores[d];
                  const meta = DIMENSION_META[d];
                  const count = coverage[d];
                  let badgeText = '—';
                  let badgeColor = 'text-white/60 bg-white/5 border-white/10';

                  if (count === 1) {
                    badgeText = '1 choice';
                    badgeColor = 'text-white/50 bg-white/5 border-white/10';
                  } else if (s !== null) {
                    if (s === 50) {
                      badgeText = 'Balanced';
                      badgeColor = 'text-white/70 bg-white/5 border-white/10';
                    } else if (s < 50) {
                      const pct = 100 - s;
                      badgeText = `${pct}% ${meta.score0End.split(' ')[0]}`;
                      badgeColor = 'text-[#FF2A54] bg-[#FF2A54]/10 border-[#FF2A54]/25';
                    } else {
                      badgeText = `${s}% ${meta.score100End.split(' ')[0]}`;
                      badgeColor = 'text-[#0066FF] bg-[#0066FF]/10 border-[#0066FF]/25';
                    }
                  }

                  const dotColorClass =
                    s !== null
                      ? s < 50
                        ? 'bg-[#FF2A54] shadow-[0_0_8px_#FF2A54]'
                        : s > 50
                        ? 'bg-[#0066FF] shadow-[0_0_8px_#0066FF]'
                        : 'bg-white shadow-[0_0_8px_white]'
                      : 'bg-white';

                  return (
                    <div
                      key={d}
                      className="py-1 lg:py-1 xl:py-1.5 first:pt-0 last:pb-0 flex flex-col gap-0.5 xl:gap-1"
                      style={{
                        opacity: isOpen ? 1 : 0,
                        transform: isOpen ? 'translateX(0)' : 'translateX(15px)',
                        transition: 'opacity 350ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                        transitionDelay: isOpen ? `${70 + index * 30}ms` : '0ms',
                      }}
                    >
                      {/* Top line: Dimension Name (left) & Score Leaning Badge (right) */}
                      <div className="flex items-center justify-between text-[10.5px] xl:text-xs font-mono leading-tight">
                        <span className="font-bold text-[#64748B] uppercase tracking-wider">
                          {meta.name}
                        </span>
                        <span className={`text-[9.5px] lg:text-[10px] xl:text-[11px] font-mono font-bold px-2 xl:px-2.5 py-0.5 rounded-full border shrink-0 ${badgeColor}`}>
                          {badgeText}
                        </span>
                      </div>

                      {/* Spectrum Endpoints: Full text, ZERO truncation */}
                      <div className="flex items-center justify-between text-[11px] lg:text-xs xl:text-sm font-semibold gap-1.5 leading-tight">
                        <span className={s !== null && s < 50 ? 'text-[#FF2A54] font-bold' : 'text-[#FF2A54]/80'}>
                          {meta.score0End}
                        </span>
                        <span className={`text-right ${s !== null && s > 50 ? 'text-[#0066FF] font-bold' : 'text-[#0066FF]/80'}`}>
                          {meta.score100End}
                        </span>
                      </div>

                      {/* Full-width Precision Spectrum Track */}
                      <div className="relative h-1.5 lg:h-2 xl:h-2.5 w-full rounded-full spectrum-track border border-white/10 mt-0.5">
                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/35 -translate-x-1/2 z-0" />
                        {s !== null && (
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 rounded-full z-10 transition-all duration-300 ${dotColorClass}`}
                            style={{ left: `calc(${s}% - 6px)` }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {personalRead && (
              <div
                className="mt-1.5 lg:mt-2 xl:mt-3 p-2 lg:p-2.5 xl:p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[10.5px] lg:text-[11.5px] xl:text-[13px] text-[#94A3B8] leading-snug shadow-sm"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'opacity 350ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: isOpen ? '250ms' : '0ms',
                }}
              >
                <div className="flex items-center gap-1.5 text-white font-bold mb-0.5">
                  <Sparkles size={12} className="text-[#F59E0B]" />
                  <span className="text-[11px] lg:text-xs xl:text-sm">Priority Synthesis</span>
                </div>
                <p>{personalRead}</p>
              </div>
            )}
          </section>

          {/* SECTION 2: Classical Compass */}
          <section
            className="flex flex-col justify-start min-w-0"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'scale(1)' : 'scale(0.96)',
              transition: 'opacity 400ms ease, transform 450ms cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: isOpen ? '180ms' : '0ms',
            }}
          >
            <div className="w-full flex flex-col">
              {/* Above: Header */}
              <div className="flex items-center gap-1.5 mb-1.5 lg:mb-1 xl:mb-2">
                <Compass size={14} className="text-[#38BDF8] xl:w-4 xl:h-4" />
                <span className="text-[11px] xl:text-xs font-mono tracking-[0.2em] font-bold text-[#38BDF8] uppercase">
                  CLASSICAL COMPASS
                </span>
              </div>

              {/* The Compass Plot Box */}
              <div className="w-full flex justify-center sm:justify-start">
                <ClassicalCompassWidget result={classicalResult} />
              </div>

              {/* Below: Title & Distinct Subheaders */}
              <div className="mt-1.5 lg:mt-2 flex flex-col gap-1.5 w-full max-w-[420px]">
                <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-display font-black text-white tracking-tight leading-tight">
                  {classicalResult.quadrantTitle}
                </div>

                {/* Subheader Value Pills: Clean, non-duplicate, no raw coordinates */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold border ${
                      classicalResult.economicScore < -0.8
                        ? 'text-[#FF2A54] bg-[#FF2A54]/10 border-[#FF2A54]/30'
                        : classicalResult.economicScore > 0.8
                        ? 'text-[#0066FF] bg-[#0066FF]/10 border-[#0066FF]/30'
                        : 'text-white/90 bg-white/[0.06] border-white/20'
                    }`}
                  >
                    {classicalResult.spectrum1DLabel} Economic
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/15 text-[10px] sm:text-[11px] font-mono font-semibold text-white/85">
                    {classicalResult.socialScore >= 1.8
                      ? 'Authoritarian Social'
                      : classicalResult.socialScore <= -1.8
                      ? 'Libertarian Social'
                      : 'Moderate Social'}
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle spacer */}
            <div className="hidden lg:block h-0.5" />
          </section>
        </div>

        {/* Subtle Divider between Top Grid & Notable Figures */}
        <div className="w-full h-px bg-white/[0.08] my-1.5 lg:my-1.5" />

        {/* BOTTOM ROW: Shared Minds & Figures (5 columns horizontal with comfortable breathing room) */}
        <NotableFigures
          exemplars={archetypeResult.archetype.exemplars}
          archetypeTitle={archetypeResult.archetype.title}
          accentColor={archetypeResult.archetype.cardColor || '#0066FF'}
          isOpen={isOpen}
        />
      </div>
    );
  }
};
