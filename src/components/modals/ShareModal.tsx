import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, Image, Share2, Smartphone, X } from 'lucide-react';
import { GlassButton, GlassPanel } from '../ui/Glass';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  archetypeTitle: string;
  personaName?: string;
  cardSerial?: string;
  accentColor?: string;
  isBusy: boolean;
  message: string | null;
  onSharePortrait?: () => void;
  onShareStory: () => void;
  onDownloadPortrait: () => void;
  onDownloadStory?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareUrl,
  archetypeTitle,
  personaName,
  cardSerial,
  accentColor = '#0066FF',
  isBusy,
  message,
  onSharePortrait,
  onShareStory,
  onDownloadPortrait,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      prompt('Copy your result link:', shareUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4">
      <div
        className="fixed inset-0 bg-black/68 backdrop-blur-[4px] transition-opacity duration-300"
        onClick={onClose}
      />

      <GlassPanel
        className="relative w-full max-w-lg glass-sheet lg:rounded-3xl rounded-t-3xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-sheet-up"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="lg:hidden flex items-center justify-center pt-3 pb-1">
          <div className="w-12 h-1 rounded-full bg-white/25" />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}
            />
            <h3 className="text-base font-display font-extrabold text-white tracking-tight">
              Share my result
            </h3>
          </div>
          <GlassButton
            onClick={onClose}
            className="w-8 h-8 rounded-full liquid-glass-button text-[#94A3B8] hover:text-white flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </GlassButton>
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto no-scrollbar">
          {/* Identity Snippet */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-black font-display text-white shrink-0"
              style={{ backgroundColor: `${accentColor}25` }}
            >
              {(personaName || archetypeTitle).charAt(0)}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white truncate">
                {personaName || archetypeTitle}
              </h4>
              <p className="text-xs font-mono text-[#94A3B8] truncate mt-0.5">
                {archetypeTitle} {cardSerial ? `· ${cardSerial}` : ''}
              </p>
            </div>
          </div>

          {/* Primary Action in Fallback / Share flow: Download Image */}
          <GlassButton
            type="button"
            onClick={onDownloadPortrait}
            disabled={isBusy}
            className="w-full p-4 rounded-2xl bg-white text-[#05060A] text-left flex items-center gap-3.5 cursor-pointer disabled:opacity-50 hover:bg-[#F3F4F6] transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <span className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center shrink-0">
              <Download size={18} className="text-[#05060A]" />
            </span>
            <span>
              <span className="block text-sm font-extrabold text-[#05060A]">Download image</span>
              <span className="block text-xs text-black/60 mt-0.5">Canonical 4:5 portrait (1080×1350)</span>
            </span>
          </GlassButton>

          {/* Secondary Actions Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <GlassButton
              type="button"
              onClick={onShareStory}
              disabled={isBusy}
              className="p-3.5 rounded-2xl liquid-glass-button text-left flex items-center gap-3 cursor-pointer disabled:opacity-50"
            >
              <Smartphone size={18} className="text-[#F3F4F6] shrink-0" />
              <span>
                <span className="block text-xs font-bold text-white">Share to Stories</span>
                <span className="block text-[10px] text-[#94A3B8] mt-0.5">9:16 composition</span>
              </span>
            </GlassButton>

            {onSharePortrait ? (
              <GlassButton
                type="button"
                onClick={onSharePortrait}
                disabled={isBusy}
                className="p-3.5 rounded-2xl liquid-glass-button text-left flex items-center gap-3 cursor-pointer disabled:opacity-50"
              >
                <Share2 size={18} className="text-[#F3F4F6] shrink-0" />
                <span>
                  <span className="block text-xs font-bold text-white">System share</span>
                  <span className="block text-[10px] text-[#94A3B8] mt-0.5">Open share sheet</span>
                </span>
              </GlassButton>
            ) : (
              <GlassButton
                type="button"
                onClick={handleCopy}
                className="p-3.5 rounded-2xl liquid-glass-button text-left flex items-center gap-3 cursor-pointer"
              >
                {copied ? <Check size={18} className="text-emerald-400 shrink-0" /> : <Copy size={18} className="text-[#F3F4F6] shrink-0" />}
                <span>
                  <span className="block text-xs font-bold text-white">{copied ? 'Link copied' : 'Copy link'}</span>
                  <span className="block text-[10px] text-[#94A3B8] mt-0.5">Direct result URL</span>
                </span>
              </GlassButton>
            )}
          </div>

          {/* Copy Result Link Bar */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <Image size={15} className="ml-2.5 text-[#64748B] shrink-0" />
            <span className="flex-1 text-xs font-mono text-[#94A3B8] truncate">{shareUrl}</span>
            <GlassButton
              type="button"
              onClick={handleCopy}
              className="px-3 py-2.5 rounded-xl liquid-glass-button text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy result link'}</span>
            </GlassButton>
          </div>

          <p className="text-[10.5px] font-mono text-[#64748B] text-center">
            Story sharing prepares a 9:16 composition. Choose Instagram or another app from your share sheet.
          </p>

          {message && (
            <div className="text-xs font-mono text-center py-2.5 px-3 bg-white/[0.06] rounded-xl text-white">
              {message}
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  );
};
