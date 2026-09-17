import React, { useState, useEffect } from 'react';
import { Exemplar } from '../../domain/types';
import { ExternalLink, User } from 'lucide-react';

interface NotableFiguresProps {
  exemplars?: Exemplar[];
  archetypeTitle: string;
  accentColor?: string;
  isOpen?: boolean;
}

// In-memory thumbnail cache across component mounts
const thumbnailCache = new Map<string, string | null>();

const ExemplarCard: React.FC<{
  exemplar: Exemplar;
  accentColor: string;
}> = ({ exemplar, accentColor }) => {
  const slug = exemplar.wikipediaUrl.split('/wiki/')[1] || '';
  const [thumbUrl, setThumbUrl] = useState<string | null>(
    exemplar.thumbnailUrl || thumbnailCache.get(slug) || null
  );
  const [imgError, setImgError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(
    !exemplar.thumbnailUrl && !thumbnailCache.has(slug)
  );

  useEffect(() => {
    if (exemplar.thumbnailUrl) {
      setThumbUrl(exemplar.thumbnailUrl);
      setIsLoading(false);
      return;
    }

    if (!slug) {
      setIsLoading(false);
      return;
    }

    if (thumbnailCache.has(slug)) {
      setThumbUrl(thumbnailCache.get(slug) ?? null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          const src = data.thumbnail?.source || data.originalimage?.source || null;
          thumbnailCache.set(slug, src);
          setThumbUrl(src);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          thumbnailCache.set(slug, null);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [slug, exemplar.thumbnailUrl]);

  // Generate 2 initials for fallback avatar
  const initials = exemplar.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase();

  return (
    <a
      href={exemplar.wikipediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative glass-panel p-2 lg:p-1.5 xl:p-2.5 rounded-xl border border-white/[0.08] hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] transition-all duration-300 flex items-center gap-2 sm:gap-2.5 lg:gap-1.5 xl:gap-2.5 cursor-pointer overflow-hidden shadow-sm hover:shadow-[0_0_25px_rgba(255,255,255,0.08)] min-w-0"
      title={`Read about ${exemplar.name} on Wikipedia`}
    >
      {/* Face Thumbnail / Fallback Avatar */}
      <div className="relative w-8 h-8 sm:w-8.5 sm:h-8.5 lg:w-7.5 lg:h-7.5 xl:w-10 xl:h-10 rounded-lg shrink-0 overflow-hidden border border-white/15 group-hover:border-white/30 bg-[#0E121B] shadow-inner flex items-center justify-center">
        {thumbUrl && !imgError ? (
          <img
            src={thumbUrl}
            alt={exemplar.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        ) : isLoading ? (
          <div className="w-full h-full animate-pulse bg-white/10 flex items-center justify-center">
            <User size={13} className="text-white/30" />
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-inner"
            style={{
              background: `linear-gradient(135deg, ${accentColor}33, rgba(255,255,255,0.05))`,
            }}
          >
            {initials || <User size={13} className="text-white/60" />}
          </div>
        )}
      </div>

      {/* Details: Name & Role */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-1">
          <span className="text-[11px] sm:text-xs xl:text-[13px] font-bold text-white group-hover:text-white truncate">
            {exemplar.name}
          </span>
          <ExternalLink
            size={10}
            className="text-white/35 group-hover:text-white/80 shrink-0 transition-colors"
          />
        </div>
        <p className="text-[9px] sm:text-[10px] xl:text-[11px] text-[#94A3B8] group-hover:text-white/80 line-clamp-1 leading-tight mt-0.5">
          {exemplar.role}
        </p>
      </div>
    </a>
  );
};

export const NotableFigures: React.FC<NotableFiguresProps> = ({
  exemplars,
  archetypeTitle,
  accentColor = '#0066FF',
  isOpen = true,
}) => {
  if (!exemplars || exemplars.length === 0) {
    return null;
  }

  return (
    <section className="w-full min-w-0">
      <div className="flex items-center justify-between gap-2 mb-2 lg:mb-2.5">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-[11px] xl:text-xs font-mono tracking-widest text-[#64748B] uppercase font-bold">
            SHARED MINDS & FIGURES
          </span>
        </div>
        <span className="text-[10px] xl:text-[11px] font-mono text-[#94A3B8]/60">
          5 notable {archetypeTitle}s
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 xl:gap-3 w-full">
        {exemplars.slice(0, 5).map((exemplar, index) => (
          <div
            key={exemplar.name}
            className="min-w-0"
            style={{
              transitionDelay: isOpen ? `${300 + index * 40}ms` : '0ms',
              transform: isOpen ? 'translateY(0)' : 'translateY(8px)',
              opacity: isOpen ? 1 : 0,
              transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease',
            }}
          >
            <ExemplarCard
              exemplar={exemplar}
              accentColor={accentColor}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
