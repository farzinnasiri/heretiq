import { GlassButton } from '../ui/Glass';
import React, { useState, useEffect, useRef } from 'react';
import { PresentedItem, Choice } from '../../domain/types';
import { QUESTION_BANK } from '../../domain/questions';
import { ArrowLeft, Check } from 'lucide-react';

interface QuestionViewProps {
  presentedItem: PresentedItem;
  itemIndex: number;
  totalCoreCount?: number;
  onRecordAnswer: (questionId: string, choice: Choice) => void;
  onBack: () => void;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  presentedItem,
  itemIndex,
  totalCoreCount = 18,
  onRecordAnswer,
  onBack,
}) => {
  const q = QUESTION_BANK[presentedItem.questionId];
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(presentedItem.choice);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const promptHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setSelectedChoice(presentedItem.choice);
    setIsTransitioning(false);
    promptHeadingRef.current?.focus();
  }, [presentedItem.questionId]);

  const handleSelect = (choice: 'A' | 'B') => {
    if (isTransitioning) return;
    setSelectedChoice(choice);
    setIsTransitioning(true);
    onRecordAnswer(q.id, choice);

    // Failsafe: automatically unblock transition lock after 500ms
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === '1' || e.code === 'Digit1' || e.code === 'Numpad1') {
        e.preventDefault();
        handleSelect(presentedItem.displayOrder[0]);
      } else if (e.key === 'ArrowRight' || e.key === '2' || e.code === 'Digit2' || e.code === 'Numpad2') {
        e.preventDefault();
        handleSelect(presentedItem.displayOrder[1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentedItem.displayOrder, isTransitioning]);

  if (!q) return null;

  const progressFraction = Math.min(1, (itemIndex + 1) / totalCoreCount);

  return (
    <div className="min-h-dvh sm:h-dvh sm:max-h-dvh overflow-x-hidden overflow-y-auto sm:overflow-hidden flex flex-col justify-between px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom,16px))] sm:p-5 lg:px-8 lg:py-5 max-w-5xl mx-auto select-none">
      {/* Header & Neutral Progress Bar */}
      <header className="flex flex-col gap-2.5 sm:gap-3 shrink-0 pt-0.5 sm:pt-0">
        <div className="flex justify-between items-center">
          {/* Left: Desktop Back button + HERETIQ brand / Mobile HERETIQ brand only */}
          <div className="flex items-center gap-3">
            <GlassButton
              onClick={onBack}
              className="hidden sm:flex px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/25 hover:text-white transition-all items-center gap-1.5 text-xs font-mono text-[#94A3B8] bg-white/[0.02] cursor-pointer"
              aria-label="Previous question"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </GlassButton>
            <div className="flex flex-col items-center justify-center gap-1 select-none" aria-label="HERETIQ">
              <span className="font-heading text-sm sm:text-base font-black tracking-widest text-white uppercase leading-none">
                HERETIQ
              </span>
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A54] shadow-[0_0_8px_#FF2A54]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] shadow-[0_0_8px_#0066FF]" />
              </div>
            </div>
          </div>

          {/* Right: Counter badge */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="bg-[#0E121B] text-white px-3 py-0.5 rounded-full border border-white/10 font-bold tracking-wider text-xs">
              <span className="text-white">{itemIndex + 1}</span>
              <span className="text-[#64748B] mx-1">/</span>
              <span className="text-[#94A3B8]">{totalCoreCount}</span>
            </span>
          </div>
        </div>

        {/* Neutral Progress Bar */}
        <div className="w-full bg-[#0E121B] h-1.5 rounded-full overflow-hidden border border-white/[0.06]">
          <div
            className="bg-white/80 h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.round(progressFraction * 100)}%` }}
          />
        </div>
      </header>

      {/* Main Question Arena:
          - Mobile (< sm): Question at eye level (flex-1 my-auto), Buttons down in bottom thumb zone (shrink-0)
          - Desktop (>= sm): Question + Buttons clustered closely together at eye-line level (sm:justify-center, sm:gap-7, sm:my-0)
      */}
      <main className="flex-1 flex flex-col justify-between sm:justify-center sm:gap-7 md:gap-8 items-center max-w-3xl mx-auto w-full min-h-0 py-3 sm:py-0 sm:-translate-y-4">
        {/* Eye-Level Question Prompt (upper-middle on mobile, tight to buttons on desktop) */}
        <div className="flex-1 sm:flex-none flex items-center justify-center w-full px-2 sm:px-4 text-center my-auto sm:my-0 min-h-0 sm:min-h-0">
          <h2
            ref={promptHeadingRef}
            tabIndex={-1}
            className="text-[21px] xs:text-[24px] sm:text-2xl md:text-3xl lg:text-[32px] font-display font-extrabold leading-snug sm:leading-tight text-white outline-hidden max-w-2xl text-balance"
          >
            {q.prompt}
          </h2>
        </div>

        {/* Choices & Controls: Bottom thumb zone on mobile, directly under title in eye line on desktop */}
        <div className="shrink-0 flex flex-col w-full pb-1 sm:pb-0">
          {/* Neutral Choices: Option 1 vs Option 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 w-full mb-3 sm:mb-4">
            {presentedItem.displayOrder.map((choiceKey, displayIndex) => {
              const text = q.choices[choiceKey];
              const isSelected = selectedChoice === choiceKey;
              const optionNumber = displayIndex + 1;

              return (
                <GlassButton
                  key={choiceKey}
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(choiceKey)}
                  disabled={isTransitioning}
                  className={`choice-card group relative p-4.5 xs:p-5 sm:p-5 md:p-6 min-h-[84px] xs:min-h-[96px] sm:min-h-[140px] md:min-h-[155px] text-left rounded-2xl flex flex-col justify-between select-none cursor-pointer transition-all active:scale-[0.98] ${
                    isSelected ? 'selected' : ''
                  }`}
                >
                  {/* Card Header with '1' or '2' Badge */}
                  <div className="flex justify-between items-center w-full shrink-0">
                    <span
                      className={`text-xs font-mono px-2.5 py-0.5 rounded-md font-bold border transition-colors flex items-center gap-1 ${
                        isSelected
                          ? 'bg-white text-[#05060A] border-white'
                          : 'bg-white/[0.05] text-[#94A3B8] border-white/10 group-hover:border-white/25 group-hover:text-white'
                      }`}
                    >
                      <span>{optionNumber}</span>
                    </span>

                    {isSelected && (
                      <div className="p-1 rounded-full bg-white text-[#05060A] shadow-xs">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Choice Text */}
                  <div className="text-sm xs:text-[15px] sm:text-base md:text-lg font-semibold text-white mt-2.5 sm:mt-3 leading-snug">
                    {text}
                  </div>
                </GlassButton>
              );
            })}
          </div>

          {/* Mobile Back Button - Grounded down in the thumb reach area */}
          <div className="flex sm:hidden items-center justify-center w-full pt-1 pb-1">
            <GlassButton
              onClick={onBack}
              className="inline-flex items-center gap-2 py-2.5 px-6 rounded-full border border-white/[0.08] active:border-white/25 text-xs font-mono text-[#94A3B8] active:text-white bg-white/[0.03] active:bg-white/[0.08] backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-sm"
              aria-label="Previous question"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </GlassButton>
          </div>

          {/* Desktop Keyboard hint */}
          <div className="hidden sm:flex flex-col items-center gap-1 shrink-0 mt-2">
            <p className="text-[11px] font-mono text-[#64748B]">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white text-[10px]">1</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white text-[10px]">2</kbd> on keyboard
            </p>
          </div>
        </div>
      </main>

      {/* Subtle bottom spacer for safe area clearance */}
      <div className="h-1 sm:h-2 shrink-0" />
    </div>
  );
};
