import { GlassPanel, GlassButton } from '../ui/Glass';
import React, { useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacySheet: React.FC<PrivacySheetProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#05060A]/68 backdrop-blur-[4px] flex items-center justify-center p-4 select-none">
      <GlassPanel
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        className="glass-sheet max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-2xl flex flex-col gap-5 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-white" />
            <h2 id="privacy-title" className="text-xl font-display font-extrabold text-white">
              Your choices stay here.
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

        <div className="flex flex-col gap-3.5 text-sm leading-relaxed text-[#94A3B8]">
          <p>
            HERETIQ calculates your archetype results entirely on-device in your browser. We never send your answers to a server or external database.
          </p>
          <p>
            A shared link includes only your 6 computed dimension leanings and question seed so a recipient's browser can render your collectible card.
          </p>
          <p>
            "Start fresh" clears this tab's memory immediately.
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 flex justify-end">
          <GlassButton
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-[#05060A] font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F3F4F6] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            Understood
          </GlassButton>
        </div>
      </GlassPanel>
    </div>
  );
};
