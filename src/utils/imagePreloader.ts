/**
 * Image Preloader Utility
 * Provides background fetching and cache tracking for archetype assets.
 */

const loadedImages = new Set<string>();
const inFlightPromises = new Map<string, Promise<HTMLImageElement>>();

/**
 * Checks synchronously if an image source has already completed loading.
 */
export function isImagePreloaded(src?: string): boolean {
  if (!src) return false;
  return loadedImages.has(src);
}

/**
 * Preloads an image into browser memory cache.
 * Safe to call multiple times with the same URL (deduplicates in-flight requests).
 */
export function preloadImage(src?: string): Promise<HTMLImageElement | null> {
  if (!src || typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (loadedImages.has(src)) {
    const cachedImg = new Image();
    cachedImg.src = src;
    return Promise.resolve(cachedImg);
  }

  if (inFlightPromises.has(src)) {
    return inFlightPromises.get(src)!;
  }

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      loadedImages.add(src);
      inFlightPromises.delete(src);
      resolve(img);
    };

    img.onerror = (err) => {
      inFlightPromises.delete(src);
      // Non-permanent failure to allow retry
      reject(err);
    };

    img.src = src;
  });

  inFlightPromises.set(src, promise);
  return promise;
}

/**
 * Preloads both the full-resolution archetype artwork and card back artwork.
 */
export function preloadArchetypeAssets(fullCardImagePath?: string): void {
  if (!fullCardImagePath || typeof window === 'undefined') return;

  // Preload hero card artwork
  preloadImage(fullCardImagePath).catch(() => {
    // Non-blocking catch
  });

  // Preload card back
  preloadImage('/archetypes/card-back.webp').catch(() => {
    // Non-blocking catch
  });
}
