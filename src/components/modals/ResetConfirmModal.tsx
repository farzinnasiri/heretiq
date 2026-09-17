import { GlassPanel, GlassButton } from '../ui/Glass';
import React, { useEffect } from 'react';
import { AlertTriangle, X, RotateCcw } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/68 backdrop-blur-[4px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <GlassPanel
        className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] glass-sheet rounded-3xl p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-y-auto z-10 flex flex-col gap-5 transition-all duration-300 animate-sheet-up text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <GlassButton
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full liquid-glass-button text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </GlassButton>

        {/* Icon */}
        <div className="flex justify-center pt-2">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#FF2A54] bg-[#FF2A54]/10 border border-[#FF2A54]/25 shadow-[0_0_30px_rgba(255,42,84,0.3)]">
            <AlertTriangle size={28} />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-display font-extrabold text-white tracking-tight">
            Reset All Progress?
          </h3>
          <p className="text-xs sm:text-[13px] text-[#94A3B8] leading-relaxed font-sans px-2">
            All your quiz answers, spectrum calculations, and forged archetype result will be completely cleared. You will start over from question 1.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <GlassButton
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 liquid-glass-button text-[#CBD5E1] hover:text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer order-2 sm:order-1"
          >
            Keep My Result
          </GlassButton>
          <GlassButton
            type="button"
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="liquid-glass-crimson flex-1 py-3 px-4 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(255,42,84,0.28)] cursor-pointer order-1 sm:order-2"
          >
            <RotateCcw size={14} strokeWidth={2.5} />
            <span>Reset Everything</span>
          </GlassButton>
        </div>
      </GlassPanel>
    </div>
  );
};
