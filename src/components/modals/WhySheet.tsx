import { GlassPanel, GlassButton } from '../ui/Glass';
import React, { useEffect, useState } from 'react';
import { X, Check, Edit3, HelpCircle } from 'lucide-react';
import { PresentedItem, Choice } from '../../domain/types';
import { DIMENSIONS, DIMENSION_META, QUESTION_BANK } from '../../domain/questions';

interface WhySheetProps {
  isOpen: boolean;
  onClose: () => void;
  presented: PresentedItem[];
  onEditAnswer: (questionId: string, choice: Choice) => void;
}

export const WhySheet: React.FC<WhySheetProps> = ({
  isOpen,
  onClose,
  presented,
  onEditAnswer,
}) => {
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingQuestionId) {
          setEditingQuestionId(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, editingQuestionId]);

  if (!isOpen) return null;

  const grouped = DIMENSIONS.map(d => {
    const items = presented.filter(p => {
      const q = QUESTION_BANK[p.questionId];
      return q && q.dimension === d;
    });
    return {
      dimension: d,
      meta: DIMENSION_META[d],
      items,
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#05060A]/68 backdrop-blur-[4px] flex items-center justify-center p-4 select-none">
      <GlassPanel
        role="dialog"
        aria-modal="true"
        aria-labelledby="why-title"
        className="glass-sheet max-w-3xl w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 md:p-8 rounded-2xl flex flex-col gap-6 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="text-[10px] font-mono text-[#0066FF] uppercase tracking-wider font-bold">
              MODEL v0.1 · EVIDENCE LEDGER
            </div>
            <h2 id="why-title" className="text-2xl font-display font-extrabold text-white">
              Your choices, connected.
            </h2>
          </div>
          <GlassButton
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 border border-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </GlassButton>
        </div>

        <p className="text-sm text-[#94A3B8]">
          Each choice directly informs one dimension. Tap "Edit" to modify any decision and watch your card recalibrate immediately.
        </p>

        <div className="flex flex-col gap-4">
          {grouped.map(({ dimension, meta, items }) => (
            <div key={dimension} className="border border-white/10 p-4 rounded-xl bg-white/[0.02]">
              <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
                <h3 className="font-display font-bold text-sm text-white">
                  {dimension} · {meta.name}
                </h3>
                <span className="text-[10px] font-mono text-[#64748B]">
                  <span className="text-[#FF2A54]">{meta.score0End}</span> ↔ <span className="text-[#0066FF]">{meta.score100End}</span>
                </span>
              </div>

              {items.length === 0 ? (
                <div className="text-xs italic text-[#64748B] py-1">
                  No questions answered on this dimension yet.
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {items.map(item => {
                    const q = QUESTION_BANK[item.questionId];
                    if (!q) return null;
                    const isEditing = editingQuestionId === q.id;
                    const isSkip = item.choice === 'skip' || item.choice === null;
                    const chosenChoice = item.choice;
                    const isPositive = chosenChoice === q.positiveChoice;
                    const poleDirection = isPositive ? meta.score100End : meta.score0End;

                    return (
                      <div
                        key={q.id}
                        className="p-3 bg-[#0A0D14] border border-white/[0.08] rounded-lg flex flex-col gap-1.5"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="text-xs text-white">
                            <span className="font-mono text-[10px] text-[#0066FF] mr-2 font-bold">
                              {q.id}
                            </span>
                            {q.prompt}
                          </div>
                          {!isEditing && (
                            <button
                              onClick={() => setEditingQuestionId(q.id)}
                              className="text-[11px] font-mono flex items-center gap-1 text-[#0066FF] hover:text-white hover:underline shrink-0 cursor-pointer"
                            >
                              <Edit3 size={11} /> Edit
                            </button>
                          )}
                        </div>

                        {!isEditing ? (
                          <div className="text-xs">
                            {isSkip ? (
                              <span className="font-mono text-[#64748B] italic">
                                Skipped · no effect
                              </span>
                            ) : (
                              <div>
                                <span className="text-[#F3F4F6] font-medium">
                                  "{q.choices[chosenChoice as 'A' | 'B']}"
                                </span>
                                <span className="ml-2 font-mono text-[10px] text-[#0066FF] font-bold">
                                  → {poleDirection}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(['A', 'B'] as const).map(c => (
                                <GlassButton
                                  key={c}
                                  aria-pressed={chosenChoice === c}
                                  onClick={() => {
                                    onEditAnswer(q.id, c);
                                    setEditingQuestionId(null);
                                  }}
                                  className={`p-2 text-left text-xs rounded-lg border flex items-start justify-between gap-1.5 transition-colors cursor-pointer ${
                                    chosenChoice === c
                                      ? 'border-[#0066FF] bg-[#0066FF]/20 text-white font-semibold'
                                      : 'border-white/10 bg-white/[0.03] text-[#94A3B8] hover:border-white/25'
                                  }`}
                                >
                                  <span>{q.choices[c]}</span>
                                  {chosenChoice === c && <Check size={14} className="shrink-0 text-[#0066FF]" />}
                                </GlassButton>
                              ))}
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <button
                                onClick={() => {
                                  onEditAnswer(q.id, 'skip');
                                  setEditingQuestionId(null);
                                }}
                                className="text-xs font-mono text-[#64748B] hover:text-[#94A3B8] cursor-pointer"
                              >
                                Skip choice
                              </button>
                              <GlassButton
                                onClick={() => setEditingQuestionId(null)}
                                className="text-xs font-mono border border-white/10 px-2.5 py-0.5 rounded text-[#94A3B8] hover:text-white cursor-pointer"
                              >
                                Cancel
                              </GlassButton>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/10 text-xs text-[#94A3B8] flex items-start gap-2.5">
          <HelpCircle size={15} className="shrink-0 mt-0.5 text-[#0066FF]" />
          <span>
            This is an uncalibrated 6-dimensional model. The numbers describe leanings on our authored scale, not personality types or political party alignments.
          </span>
        </div>

        <div className="pt-2 border-t border-white/10 flex justify-end">
          <GlassButton
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-[#05060A] font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F3F4F6] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            Done
          </GlassButton>
        </div>
      </GlassPanel>
    </div>
  );
};
