import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, Image, MessageCircle, Send, Share2, X } from 'lucide-react';
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
  onDownloadPortrait: () => void;
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

  const persona = personaName || archetypeTitle;
  const shareText = `I got ${persona} on HERETIQ. Discover your political archetype:`;

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4">
      <div
        className="fixed inset-0 bg-black/68 backdrop-blur-[4px] transition-opacity duration-300"
        onClick={onClose}
      />

      <GlassPanel
        className="relative w-full max-w-lg glass-sheet lg:rounded-3xl rounded-t-3xl overflow-hidden z-10 flex flex-col max-h-[90dvh] animate-sheet-up"
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
              Share your result
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

        <div className="p-5 pb-[max(1.5rem,env(safe-area-inset-bottom,20px))] flex flex-col gap-4 overflow-y-auto no-scrollbar">
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

          {/* Primary Action: Download Image */}
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
              <span className="block text-sm font-extrabold text-[#05060A]">Download card image</span>
              <span className="block text-xs text-black/60 mt-0.5">High-resolution 4:5 portrait (1080×1350)</span>
            </span>
          </GlassButton>

          {/* Social Media Share Actions */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] px-1">
              Share to social media
            </span>
            <div className="grid grid-cols-3 gap-2">
              {/* X / Twitter */}
              <GlassButton
                type="button"
                onClick={handleShareTwitter}
                className="p-3 rounded-2xl liquid-glass-button text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-white/30 transition-all"
              >
                <span className="text-base font-black font-sans text-white">𝕏</span>
                <span className="text-[11px] font-bold text-[#E2E8F0]">Post to X</span>
              </GlassButton>

              {/* Telegram */}
              <GlassButton
                type="button"
                onClick={handleShareTelegram}
                className="p-3 rounded-2xl liquid-glass-button text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-white/30 transition-all"
              >
                <Send size={16} className="text-[#38BDF8]" />
                <span className="text-[11px] font-bold text-[#E2E8F0]">Telegram</span>
              </GlassButton>

              {/* WhatsApp */}
              <GlassButton
                type="button"
                onClick={handleShareWhatsApp}
                className="p-3 rounded-2xl liquid-glass-button text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-white/30 transition-all"
              >
                <MessageCircle size={16} className="text-[#4ADE80]" />
                <span className="text-[11px] font-bold text-[#E2E8F0]">WhatsApp</span>
              </GlassButton>
            </div>
          </div>

          {/* System Share (if supported) */}
          {onSharePortrait && (
            <GlassButton
              type="button"
              onClick={onSharePortrait}
              disabled={isBusy}
              className="w-full p-3.5 rounded-2xl liquid-glass-button flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 text-xs font-bold text-white"
            >
              <Share2 size={16} className="text-[#94A3B8]" />
              <span>Open system share sheet</span>
            </GlassButton>
          )}

          {/* Copy Result Link Bar */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
            <Image size={15} className="ml-2.5 text-[#64748B] shrink-0" />
            <span className="flex-1 text-xs font-mono text-[#94A3B8] truncate">{shareUrl}</span>
            <GlassButton
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl liquid-glass-button text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy link'}</span>
            </GlassButton>
          </div>

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
