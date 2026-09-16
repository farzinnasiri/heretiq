import { Scores, Coverage } from './types';
import { DIMENSIONS } from './questions';
import { sha256Sync } from './cryptoUtils';

export function generateCardSerial(
  archetypeCode: string,
  scores: Scores,
  coverage: Coverage,
  visualSeed: number
): string {
  const serialized = `scores:${DIMENSIONS.map(d => scores[d] ?? 'null').join(',')}|cov:${DIMENSIONS.map(d => coverage[d]).join(',')}|seed:${visualSeed}|model:0.1|render:1`;
  const hash = sha256Sync(serialized);
  const hex8 = hash.slice(0, 8).toUpperCase();
  return `${archetypeCode}-${hex8.slice(0, 4)}-${hex8.slice(4, 8)}`;
}

export function calculateAccentColor(uG: number): string {
  // Linear RGB mix: Crimson #FF2A54 (255, 42, 84) to Cobalt #0066FF (0, 102, 255)
  const r = Math.round((1 - uG) * 255 + uG * 0);
  const g = Math.round((1 - uG) * 42 + uG * 102);
  const b = Math.round((1 - uG) * 84 + uG * 255);

  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');
  return `#${hexR}${hexG}${hexB}`.toUpperCase();
}
