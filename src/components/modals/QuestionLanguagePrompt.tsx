import React, { useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, Languages } from 'lucide-react';
import { GlassButton, GlassPanel } from '../ui/Glass';
import { QUESTION_LANGUAGE_OPTIONS } from '../../domain/questionTranslations';
import type { QuestionLanguage } from '../../domain/questionTranslations';

interface QuestionLanguagePromptProps {
  isOpen: boolean;
  language: QuestionLanguage;
  onLanguageChange: (language: QuestionLanguage) => void;
  onContinue: () => void;
  onCancel: () => void;
}

export const QuestionLanguagePrompt: React.FC<QuestionLanguagePromptProps> = ({
  isOpen,
  language,
  onLanguageChange,
  onContinue,
  onCancel,
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    selectRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#05060A]/75 backdrop-blur-[4px] flex items-center justify-center p-4 select-none">
      <GlassPanel
        role="dialog"
        aria-modal="true"
        aria-labelledby="question-language-title"
        className="glass-sheet max-w-md w-full max-h-[calc(100dvh-2rem)] overflow-y-auto p-5 sm:p-6 rounded-2xl flex flex-col gap-5 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <Languages size={21} className="text-white mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <h2 id="question-language-title" className="text-lg sm:text-xl font-display font-extrabold text-white">
              Choose a language
            </h2>
          </div>
        </div>

        <div className="relative">
          <label htmlFor="question-language-prompt-select" className="sr-only">
            Language
          </label>
          <select
            ref={selectRef}
            id="question-language-prompt-select"
            value={language}
            onChange={event => onLanguageChange(event.target.value as QuestionLanguage)}
            className="appearance-none w-full bg-[#0E121B] text-[#F3F4F6] px-3 py-2.5 pr-10 rounded-xl border border-white/15 font-mono text-sm cursor-pointer outline-hidden focus:border-white/40"
          >
            {QUESTION_LANGUAGE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#CBD5E1]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-white/10">
          <GlassButton
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-[#94A3B8] hover:text-white hover:border-white/25 transition-colors cursor-pointer"
          >
            Cancel
          </GlassButton>
          <GlassButton
            type="button"
            onClick={onContinue}
            className="px-4 py-2.5 bg-white text-[#05060A] font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F3F4F6] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)] inline-flex items-center gap-1.5"
          >
            Start quiz
            <ArrowRight size={14} strokeWidth={2.5} />
          </GlassButton>
        </div>
      </GlassPanel>
    </div>
  );
};
