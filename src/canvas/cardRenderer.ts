import { Archetype, ClassicalCompassResult } from '../domain/types';
import { TraitItem } from '../domain/personalRead';
import { formatVerifiedDate } from '../domain/dateUtils';

export type ExportFormat = 'portrait' | 'story';

export interface CardRenderOptions {
  cardSerial: string;
  archetype: Archetype;
  isFallbackArchetype: boolean;
  shareLine: string;
  strongTraits: TraitItem[];
  hostname: string;
  format: ExportFormat;
  classicalResult?: ClassicalCompassResult;
}

export const EXPORT_DIMENSIONS: Record<ExportFormat, { width: number; height: number }> = {
  portrait: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
};

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = `${currentLine} ${word}`;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
    setTimeout(() => resolve(null), 4000);
  });
}

function drawCollectibleCard(
  ctx: CanvasRenderingContext2D,
  archetype: Archetype,
  characterImg: HTMLImageElement | null,
  _classicalResult: ClassicalCompassResult | undefined,
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 32,
  _cardSerial?: string
) {
  const themeColor = archetype.cardColor || '#0066FF';

  ctx.save();

  // Card drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;

  // Outer Card Body
  drawRoundedRect(ctx, x, y, width, height, radius);
  const cardBg = ctx.createRadialGradient(
    x + width * 0.5,
    y + height * 0.45,
    10,
    x + width * 0.5,
    y + height * 0.45,
    width * 0.85
  );
  cardBg.addColorStop(0, `${themeColor}26`);
  cardBg.addColorStop(0.5, `${themeColor}0c`);
  cardBg.addColorStop(0.85, '#07090E');
  cardBg.addColorStop(1, '#05060A');
  ctx.fillStyle = cardBg;
  ctx.fill();

  // Reset shadow for inner elements
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Clip content inside the card
  ctx.save();
  drawRoundedRect(ctx, x, y, width, height, radius);
  ctx.clip();

  // Outer Card Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Inner Dashed Framing
  const innerMargin = Math.max(14, Math.round(width * 0.035));
  drawRoundedRect(
    ctx,
    x + innerMargin,
    y + innerMargin,
    width - 2 * innerMargin,
    height - 2 * innerMargin,
    radius - 10
  );
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
  ctx.lineWidth = 1.2;
  ctx.setLineDash([10, 8]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Ambient Backlight Aura behind character
  const auraCenterX = x + width / 2;
  const auraCenterY = y + height * 0.44;
  const auraRadius = width * 0.45;
  const auraGrad = ctx.createRadialGradient(
    auraCenterX,
    auraCenterY,
    10,
    auraCenterX,
    auraCenterY,
    auraRadius
  );
  auraGrad.addColorStop(0, `${themeColor}55`);
  auraGrad.addColorStop(0.6, `${themeColor}15`);
  auraGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(auraCenterX, auraCenterY, auraRadius, 0, Math.PI * 2);
  ctx.fill();

  // Card Header: Persona Name ONLY (e.g. HAVEN), matching the front card in the UI
  const personaName = (archetype.personaName || archetype.title).toUpperCase();
  const personaFontSize = Math.round(width * 0.046);
  ctx.font = `800 ${personaFontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = themeColor;
  ctx.textAlign = 'left';
  const headerY = y + innerMargin + Math.round(width * 0.052);
  ctx.fillText(personaName, x + innerMargin + 18, headerY);

  // Bottom Frosted Plaque position calculated first so character aligns behind it
  const plaqueMarginX = innerMargin + Math.round(width * 0.015);
  const plaqueMarginBottom = innerMargin + Math.round(height * 0.02);
  const plaqueW = width - 2 * plaqueMarginX;
  const plaqueH = Math.round(height * 0.175);
  const plaqueY = y + height - plaqueMarginBottom - plaqueH;
  const plaqueRadius = Math.round(width * 0.038);

  // Draw Character Cutout Image (tucked behind the bottom frosted plaque, object-bottom)
  const imgBoxX = x + innerMargin;
  const imgBoxY = y + innerMargin + Math.round(width * 0.06);
  const imgBoxW = width - 2 * innerMargin;
  const imgBoxH = plaqueY + Math.round(plaqueH * 0.45) - imgBoxY;

  if (characterImg) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 14;

    const imgAspect = characterImg.naturalWidth / characterImg.naturalHeight;
    const boxAspect = imgBoxW / imgBoxH;

    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

    if (imgAspect > boxAspect) {
      drawW = imgBoxW;
      drawH = imgBoxW / imgAspect;
      drawX = imgBoxX;
      drawY = imgBoxY + imgBoxH - drawH; // align bottom
    } else {
      drawH = imgBoxH;
      drawW = imgBoxH * imgAspect;
      drawX = imgBoxX + (imgBoxW - drawW) / 2;
      drawY = imgBoxY + imgBoxH - drawH; // align bottom
    }

    ctx.drawImage(characterImg, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  // Bottom Frosted Plaque (Matching UI ArchetypeCard front face)
  drawRoundedRect(ctx, x + plaqueMarginX, plaqueY, plaqueW, plaqueH, plaqueRadius);
  ctx.fillStyle = 'rgba(7, 9, 14, 0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Plaque Padding
  const plaquePadX = Math.round(plaqueW * 0.045);
  const plaqueInnerW = plaqueW - 2 * plaquePadX;

  // 1. Archetype Title (e.g. "The Cautious Egalitarian")
  const titleFontSize = Math.round(width * 0.036);
  ctx.font = `800 ${titleFontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  const titleY = plaqueY + titleFontSize + Math.round(plaqueH * 0.1);
  ctx.fillText(archetype.title, x + plaqueMarginX + plaquePadX, titleY);

  // 2. Archetype Description
  const descFontSize = Math.round(width * 0.026);
  ctx.font = `400 ${descFontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = '#CBD5E1';
  ctx.textAlign = 'left';
  const descLines = wrapText(ctx, archetype.description, plaqueInnerW);
  const descLineHeight = Math.round(descFontSize * 1.35);
  let descLineY = titleY + descFontSize + Math.round(plaqueH * 0.06);
  for (let i = 0; i < Math.min(2, descLines.length); i++) {
    ctx.fillText(descLines[i], x + plaqueMarginX + plaquePadX, descLineY);
    descLineY += descLineHeight;
  }

  // 3. Hairline Divider
  const dividerY = plaqueY + plaqueH - Math.round(plaqueH * 0.28);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + plaqueMarginX + plaquePadX, dividerY);
  ctx.lineTo(x + plaqueMarginX + plaqueW - plaquePadX, dividerY);
  ctx.stroke();

  // 4. Verification Footer (Dual dots + VERIFIED BY HERETIQ · [DATE])
  const verifyY = plaqueY + plaqueH - Math.round(plaqueH * 0.1);
  const verifyFontSize = Math.round(width * 0.022);
  const dotRadius = Math.round(verifyFontSize * 0.28);
  const dotCenterY = verifyY - Math.round(verifyFontSize * 0.35);
  const dot1X = x + plaqueMarginX + plaquePadX + dotRadius;
  const dot2X = dot1X + dotRadius * 2 + 8;

  // Crimson dot
  ctx.fillStyle = '#FF2A54';
  ctx.beginPath();
  ctx.arc(dot1X, dotCenterY, dotRadius, 0, Math.PI * 2);
  ctx.fill();

  // Cobalt dot
  ctx.fillStyle = '#0066FF';
  ctx.beginPath();
  ctx.arc(dot2X, dotCenterY, dotRadius, 0, Math.PI * 2);
  ctx.fill();

  // Monospace verification label
  ctx.font = `600 ${verifyFontSize}px "JetBrains Mono", monospace`;
  ctx.fillStyle = '#64748B';
  ctx.textAlign = 'left';
  const verifiedStr = `VERIFIED BY HERETIQ · ${formatVerifiedDate().toUpperCase()}`;
  ctx.fillText(verifiedStr, dot2X + dotRadius + 12, verifyY);

  // Corner Pips (Drawn on top to ensure all 4 are crisply visible & glowing)
  const pipOffset = innerMargin + Math.round(width * 0.016);
  const pipRadius = Math.max(5, Math.round(width * 0.0075));
  const pips = [
    { px: x + pipOffset, py: y + pipOffset },
    { px: x + width - pipOffset, py: y + pipOffset },
    { px: x + pipOffset, py: y + height - pipOffset },
    { px: x + width - pipOffset, py: y + height - pipOffset },
  ];
  ctx.fillStyle = themeColor;
  ctx.shadowColor = themeColor;
  ctx.shadowBlur = 10;
  for (const pip of pips) {
    ctx.beginPath();
    ctx.arc(pip.px, pip.py, pipRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';

  ctx.restore();
  ctx.restore();
}

export async function renderCardToCanvas(
  options: CardRenderOptions,
  canvasElement?: HTMLCanvasElement
): Promise<HTMLCanvasElement> {
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }

  const {
    format,
    cardSerial,
    archetype,
    classicalResult,
  } = options;

  const dim = EXPORT_DIMENSIONS[format];
  const canvas = canvasElement || document.createElement('canvas');
  canvas.width = dim.width;
  canvas.height = dim.height;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Preload archetype character image
  const imageSrc = archetype.cardImagePath || `/archetypes/${archetype.id}.png`;
  const characterImg = await loadImage(imageSrc);

  // Background deep obsidian void
  const bgGrad = ctx.createLinearGradient(0, 0, dim.width, dim.height);
  bgGrad.addColorStop(0, '#090B10');
  bgGrad.addColorStop(0.5, '#05060A');
  bgGrad.addColorStop(1, '#020306');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, dim.width, dim.height);

  if (format === 'story') {
    // 9:16 Story format: Cleanly centered card preserving true 3:4 aspect ratio
    const cardH = 1310;
    const cardW = Math.round(cardH * 0.75); // 982.5 -> 983
    const cardX = (dim.width - cardW) / 2;
    const cardY = (dim.height - cardH) / 2;
    drawCollectibleCard(ctx, archetype, characterImg, classicalResult, cardX, cardY, cardW, cardH, 36, cardSerial);
    return canvas;
  }

  // Canonical 4:5 portrait format: Centered card preserving true 3:4 aspect ratio
  const cardH = 1300;
  const cardW = Math.round(cardH * 0.75); // 975
  const cardX = (dim.width - cardW) / 2;
  const cardY = (dim.height - cardH) / 2;
  drawCollectibleCard(ctx, archetype, characterImg, classicalResult, cardX, cardY, cardW, cardH, 36, cardSerial);

  return canvas;
}
