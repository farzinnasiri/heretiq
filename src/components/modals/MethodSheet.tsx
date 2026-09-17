import { GlassPanel, GlassButton } from '../ui/Glass';
import React, { useEffect, useState } from 'react';
import { X, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { DIMENSIONS, DIMENSION_META } from '../../domain/questions';

interface MethodSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodSheet: React.FC<MethodSheetProps> = ({ isOpen, onClose }) => {
  const [openSection, setOpenSection] = useState<'dims' | 'scoring' | 'artwork' | null>(null);

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
        aria-labelledby="method-title"
        className="glass-sheet max-w-2xl w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 md:p-8 rounded-2xl flex flex-col gap-6 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-white" />
            <h2 id="method-title" className="text-xl font-display font-extrabold text-white">
              How your card takes shape.
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

        <div className="flex flex-col gap-4 text-sm leading-relaxed text-[#94A3B8]">
          <p>
            You make choices in everyday policy dilemmas. Each informs one of six dimensions. We map those leanings into your collectible archetype card and deep dive telemetry.
          </p>
          <p>
            This model runs client-side in browser memory without sending your choices to a server.
          </p>

          {/* Expandable: The Six Dimensions */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'dims' ? null : 'dims')}
              className="w-full flex justify-between items-center p-3.5 bg-white/[0.03] font-display font-bold text-sm text-white text-left hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <span>The Six Dimensions</span>
              {openSection === 'dims' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSection === 'dims' && (
              <div className="p-3.5 bg-[#0A0D14] border-t border-white/10 flex flex-col gap-3 text-xs">
                {DIMENSIONS.map(d => {
                  const m = DIMENSION_META[d];
                  return (
                    <div key={d} className="border-b border-white/5 pb-2.5 last:border-0">
                      <div className="font-bold font-mono text-white">
                        {d} · {m.name} ({m.score0End} ↔ {m.score100End})
                      </div>
                      <div className="text-white/90 mt-0.5">{m.whatItDescribes}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Expandable: How scoring works */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'scoring' ? null : 'scoring')}
              className="w-full flex justify-between items-center p-3.5 bg-white/[0.03] font-display font-bold text-sm text-white text-left hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <span>How Scoring Works</span>
              {openSection === 'scoring' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSection === 'scoring' && (
              <div className="p-3.5 bg-[#0A0D14] border-t border-white/10 text-xs text-[#94A3B8] space-y-2">
                <p>
                  Each dimension maintains a 61-point Bayesian distribution on θ ∈ [-3, +3] with prior σ = 1.2.
                </p>
                <div className="font-mono bg-white/[0.03] p-2.5 rounded border border-white/10 text-white">
                  s = 100 × ∑ p(θ) × σ(θ)<br />
                  S = 5 × round(s / 5)
                </div>
              </div>
            )}
          </div>

          {/* Expandable: How the artwork works */}
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'artwork' ? null : 'artwork')}
              className="w-full flex justify-between items-center p-3.5 bg-white/[0.03] font-display font-bold text-sm text-white text-left hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <span>How the Artwork Works</span>
              {openSection === 'artwork' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openSection === 'artwork' && (
              <div className="p-3.5 bg-[#0A0D14] border-t border-white/10 text-xs text-[#94A3B8] space-y-1.5">
                <div><strong>M (Provision):</strong> Modulates rib engraving density (5 to 12 ribs).</div>
                <div><strong>E (Distribution):</strong> Center vs peripheral node weighting.</div>
                <div><strong>G (Belonging):</strong> Kite orientation and spot ink linear blend.</div>
                <div><strong>A (Freedom):</strong> Top arc gap opening and radial offset.</div>
                <div><strong>I (Institutions):</strong> Continuity vs broken interval omissions.</div>
                <div><strong>T (Change):</strong> Point sharpness and accent stroke share.</div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 flex justify-end">
          <GlassButton
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-[#05060A] font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-[#F3F4F6] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            Close
          </GlassButton>
        </div>
      </GlassPanel>
    </div>
  );
};
