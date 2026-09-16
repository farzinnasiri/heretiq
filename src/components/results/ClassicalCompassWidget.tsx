import React from 'react';
import { ClassicalCompassResult } from '../../domain/types';

interface ClassicalCompassWidgetProps {
  result: ClassicalCompassResult;
  className?: string;
}

const ECONOMIC_MARKERS = [
  {
    key: 'far-left',
    pct: 10,
    labelFull: 'FAR LEFT',
    labelShort: 'FAR LEFT',
    color: '#FF2A54',
    borderColor: 'border-[#FF2A54]/30',
    textColor: 'text-[#FF2A54]',
  },
  {
    key: 'center-left',
    pct: 30,
    labelFull: 'CENTER LEFT',
    labelShort: 'CTR LEFT',
    color: '#FF6B8B',
    borderColor: 'border-[#FF6B8B]/25',
    textColor: 'text-[#FF6B8B]',
  },
  {
    key: 'center',
    pct: 50,
    labelFull: 'CENTER',
    labelShort: 'CENTER',
    color: '#FFFFFF',
    borderColor: 'border-white/25',
    textColor: 'text-white/90',
  },
  {
    key: 'center-right',
    pct: 70,
    labelFull: 'CENTER RIGHT',
    labelShort: 'CTR RIGHT',
    color: '#38BDF8',
    borderColor: 'border-[#38BDF8]/25',
    textColor: 'text-[#38BDF8]',
  },
  {
    key: 'far-right',
    pct: 90,
    labelFull: 'FAR RIGHT',
    labelShort: 'FAR RIGHT',
    color: '#0066FF',
    borderColor: 'border-[#0066FF]/30',
    textColor: 'text-[#0066FF]',
  },
];

export const ClassicalCompassWidget: React.FC<ClassicalCompassWidgetProps> = ({
  result,
  className = '',
}) => {
  // Map coordinates (-10 to +10) to percentages (0% to 100%)
  // Clamped so the marker dot never overlaps the border or outer text
  const pinX = Math.max(9, Math.min(91, ((result.economicScore + 10) / 20) * 100));
  const pinY = Math.max(14, Math.min(86, ((10 - result.socialScore) / 20) * 100));

  // Determine dot accent based on economic leaning
  const pinColor = result.economicScore < 0 ? '#FF2A54' : '#0066FF';

  return (
    <div className={`w-full flex justify-center ${className}`}>
      {/* 2-Axis Classical Compass Box */}
      <div
        className="relative w-full max-w-[390px] sm:max-w-[420px] aspect-[4/3.2] bg-[#060810] border border-white/20 rounded-2xl overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] select-none"
        role="img"
        aria-label={`Classical Political Compass: ${result.quadrantTitle}`}
      >
        {/* Dual Radial Glow Background (Red Left, Blue Right) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 25% 50%, rgba(255, 42, 84, 0.16) 0%, transparent 68%), radial-gradient(ellipse at 75% 50%, rgba(0, 102, 255, 0.22) 0%, transparent 68%)',
          }}
        />

        {/* Subtle Quadrant Corner Tags */}
        <span className="absolute top-2.5 left-3 text-[8px] sm:text-[8.5px] font-mono uppercase tracking-wider text-white/30 pointer-events-none">
          AUTH-LEFT
        </span>
        <span className="absolute top-2.5 right-3 text-[8px] sm:text-[8.5px] font-mono uppercase tracking-wider text-white/30 pointer-events-none">
          AUTH-RIGHT
        </span>
        <span className="absolute bottom-2.5 left-3 text-[8px] sm:text-[8.5px] font-mono uppercase tracking-wider text-white/30 pointer-events-none">
          LIB-LEFT
        </span>
        <span className="absolute bottom-2.5 right-3 text-[8px] sm:text-[8.5px] font-mono uppercase tracking-wider text-white/30 pointer-events-none">
          LIB-RIGHT
        </span>

        {/* Center Crosshairs */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-1/2 pointer-events-none" />

        {/* Vertical Axis Top/Bottom Labels */}
        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[8.5px] sm:text-[9.5px] font-mono font-bold uppercase tracking-wider text-white pointer-events-none bg-[#060810]/80 px-1.5 py-0.5 rounded">
          AUTHORITARIAN
        </span>
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8.5px] sm:text-[9.5px] font-mono font-bold uppercase tracking-wider text-white pointer-events-none bg-[#060810]/80 px-1.5 py-0.5 rounded">
          LIBERTARIAN
        </span>

        {/* 5 Economic Axis Markers (Far Left, Center Left, Center, Center Right, Far Right) */}
        {ECONOMIC_MARKERS.map((m) => (
          <React.Fragment key={m.key}>
            {/* Tick mark on axis line */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-px h-2.5 sm:h-3 bg-white/40 pointer-events-none z-0"
              style={{ left: `${m.pct}%` }}
            />
            {/* Marker dot on axis line */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full pointer-events-none z-0 shadow-sm"
              style={{ left: `${m.pct}%`, backgroundColor: m.color }}
            />
            {/* Position Badge Label below axis */}
            <span
              className={`absolute top-[calc(50%+6px)] sm:top-[calc(50%+7px)] -translate-x-1/2 text-[7px] sm:text-[7.5px] md:text-[8px] font-mono font-bold tracking-wider uppercase px-1 py-0.5 rounded bg-[#060810]/85 border ${m.borderColor} ${m.textColor} pointer-events-none z-0 whitespace-nowrap shadow-sm select-none`}
              style={{ left: `${m.pct}%` }}
            >
              <span className="hidden xs:inline">{m.labelFull}</span>
              <span className="xs:hidden">{m.labelShort}</span>
            </span>
          </React.Fragment>
        ))}

        {/* User Coordinate Marker (Glowing Ring Dot) */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 ease-out z-10"
          style={{ left: `${pinX}%`, top: `${pinY}%` }}
        >
          {/* Radial Bloom Glow */}
          <div
            className="absolute -inset-3 rounded-full blur-md opacity-80 animate-pulse pointer-events-none"
            style={{ backgroundColor: pinColor }}
          />
          {/* White Outer Ring with Solid Accent Fill */}
          <div
            className="relative w-4 h-4 rounded-full border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.8)]"
            style={{ backgroundColor: pinColor }}
          />
        </div>
      </div>
    </div>
  );
};
