import { CardRenderOptions, ExportFormat, renderCardToCanvas } from './cardRenderer';

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Canvas blob conversion failed'));
      }
    }, 'image/png');
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface ShareAsset {
  format: ExportFormat;
  blob: Blob;
  filename: string;
  title: string;
  text: string;
}

export type ShareFileResult = 'shared' | 'cancelled' | 'unsupported' | 'failed';
export type ShareInviteResult = 'shared' | 'copied' | 'cancelled' | 'failed';

export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function canShareFiles(): boolean {
  if (typeof navigator === 'undefined' || !navigator.share || !navigator.canShare) {
    return false;
  }
  try {
    const file = new File([new Uint8Array(1)], 'test.png', { type: 'image/png' });
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

export function canShareUrl(): boolean {
  if (typeof navigator === 'undefined' || !navigator.share) {
    return false;
  }
  return true;
}

export async function createShareAsset(
  format: ExportFormat,
  options: Omit<CardRenderOptions, 'format'>
): Promise<ShareAsset> {
  const canvas = await renderCardToCanvas({
    ...options,
    format,
  });
  const blob = await canvasToBlob(canvas);
  const persona = options.archetype.personaName || options.archetype.title;
  const slug = persona.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const filename = `heretiq-${slug || options.cardSerial}-${format}.png`;
  const title = `HERETIQ · ${options.archetype.title}`;
  const text = `I got ${persona} on HERETIQ. Discover your political archetype:`;

  return {
    format,
    blob,
    filename,
    title,
    text,
  };
}

export async function shareResult(
  asset: ShareAsset,
  resultUrl: string
): Promise<ShareFileResult> {
  if (!canShareFiles()) {
    return 'unsupported';
  }

  const file = new File([asset.blob], asset.filename, { type: 'image/png' });
  const shareText = `${asset.text} ${resultUrl}`;

  try {
    // Sharing image file with text+URL caption.
    // NOTE: Passing 'url' as a separate property in navigator.share alongside 'files'
    // causes Android intent handlers (Twitter/X, Telegram) to treat it as a link share
    // and discard the file stream. Including the URL in 'text' preserves the image attachment.
    await navigator.share({
      title: asset.title,
      text: shareText,
      files: [file],
    });
    return 'shared';
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return 'cancelled';
    }
    // Fallback: if file sharing throws an unsupported error on this device/browser, try standard link share
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: asset.title,
          text: asset.text,
          url: resultUrl,
        });
        return 'shared';
      }
    } catch (fallbackError) {
      if (fallbackError instanceof DOMException && fallbackError.name === 'AbortError') {
        return 'cancelled';
      }
    }
    return 'failed';
  }
}

export async function shareQuizInvite(
  quizUrl: string
): Promise<ShareInviteResult> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: 'HERETIQ · Political Archetype Quiz',
        text: 'Discover your political archetype on HERETIQ — 18 questions under 5 minutes. Take the quiz:',
        url: quizUrl,
      });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'cancelled';
      }
    }
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(quizUrl);
      return 'copied';
    }
    return 'failed';
  } catch {
    return 'failed';
  }
}

export function downloadAsset(asset: ShareAsset): void {
  downloadBlob(asset.blob, asset.filename);
}

export async function shareImageFile(
  blob: Blob,
  filename: string,
  data: { title: string; text: string; url?: string }
): Promise<ShareFileResult> {
  if (typeof navigator === 'undefined' || !navigator.share || !navigator.canShare) {
    return 'unsupported';
  }

  const file = new File([blob], filename, { type: 'image/png' });
  if (!navigator.canShare({ files: [file] })) return 'unsupported';

  try {
    await navigator.share({ ...data, files: [file] });
    return 'shared';
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
    return 'failed';
  }
}
