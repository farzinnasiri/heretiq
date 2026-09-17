import { SharedCardResult, Scores, Coverage, Choice, PresentedItem } from './types';
import { DIMENSIONS, CORE_QUESTION_SEQUENCE } from './questions';
import { computeLedgerState } from './scoring';

export interface ShortSharePayload {
  answers: Record<string, Choice>;
  visualSeed: number;
  archetypeSlug?: string;
}

export interface ShareUrlOptions {
  archetypeSlug?: string;
  answers?: Record<string, Choice>;
  visualSeed: number;
}

/**
 * Encodes 18 answers and a 32-bit visual seed into an ultra-compact, human-readable string.
 * Uses base-3 positional encoding for answers (fits in < 29 bits) and base-36 representation.
 * Example: "techno-cosmopolitan-2gbeu3-21i3v9" (~35 chars vs ~480 chars legacy base64)
 */
export function encodeShortShare(options: ShareUrlOptions): string {
  const { archetypeSlug, answers = {}, visualSeed } = options;

  let val = 0;
  for (let i = 0; i < CORE_QUESTION_SEQUENCE.length; i++) {
    const qId = CORE_QUESTION_SEQUENCE[i];
    const choice = answers[qId] ?? answers[`Q_${qId}`];
    const code = choice === 'B' ? 1 : choice === 'skip' ? 2 : 0; // A=0, B=1, skip=2
    val += code * Math.pow(3, i);
  }

  const ansStr = val.toString(36);
  const seedStr = (visualSeed >>> 0).toString(36);
  const cleanSlug = archetypeSlug ? archetypeSlug.toLowerCase().replace(/[^a-z0-9-]+/g, '') : '';

  if (cleanSlug) {
    return `${cleanSlug}-${ansStr}-${seedStr}`;
  }
  return `${ansStr}-${seedStr}`;
}

/**
 * Decodes an ultra-compact short share payload.
 */
export function decodeShortShare(payload: string): ShortSharePayload | null {
  if (!payload || typeof payload !== 'string') return null;

  // Strip route prefix if included (e.g. "r/...", "card/...", "result/...")
  let clean = payload.trim();
  clean = clean.replace(/^#?\/?(?:r|card|result)\//i, '');
  clean = clean.replace(/^[#/?]+/, '');

  const parts = clean.split('-');
  if (parts.length < 2) return null;

  const seedStr = parts[parts.length - 1];
  const ansStr = parts[parts.length - 2];
  const slug = parts.length > 2 ? parts.slice(0, parts.length - 2).join('-') : undefined;

  let val = parseInt(ansStr, 36);
  const seed = parseInt(seedStr, 36) >>> 0;

  if (isNaN(val) || isNaN(seed) || val < 0 || val > Math.pow(3, CORE_QUESTION_SEQUENCE.length)) {
    return null;
  }

  const answers: Record<string, Choice> = {};
  for (let i = 0; i < CORE_QUESTION_SEQUENCE.length; i++) {
    const rem = val % 3;
    val = Math.floor(val / 3);
    const qId = CORE_QUESTION_SEQUENCE[i];
    answers[qId] = rem === 1 ? 'B' : rem === 2 ? 'skip' : 'A';
  }

  return {
    answers,
    visualSeed: seed,
    archetypeSlug: slug,
  };
}

/**
 * Legacy Base64Url Helpers for backwards compatibility
 */
function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64Url(base64url: string): string {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function encodeSharedCard(card: SharedCardResult): string {
  return toBase64Url(JSON.stringify(card));
}

/**
 * Generates an ultra-short, human-readable shareable URL.
 * Produces format: https://heretiq.app/#r/techno-cosmopolitan-2gbeu3-21i3v9
 */
export function generateShareUrl(
  input: ShareUrlOptions | SharedCardResult,
  origin?: string
): string {
  let payload: string;

  if ('schema' in input && input.schema === 1) {
    // SharedCardResult object passed
    payload = encodeShortShare({
      answers: input.answers,
      visualSeed: input.visualSeed,
    });
  } else {
    payload = encodeShortShare(input as ShareUrlOptions);
  }

  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/#r/${payload}`;
}

export function reconstructPresentedFromAnswers(answers?: Record<string, Choice>): PresentedItem[] {
  if (!answers) return [];
  const items: PresentedItem[] = [];
  for (const qId of CORE_QUESTION_SEQUENCE) {
    const choice = answers[qId] ?? answers[`Q_${qId}`];
    if (choice !== undefined) {
      items.push({
        questionId: qId,
        choice,
        displayOrder: ['A', 'B'],
      });
    }
  }
  return items;
}

export interface ParseResult {
  valid: boolean;
  card: SharedCardResult | null;
  error: 'malformed' | 'unsupported_version' | null;
}

/**
 * Parses both modern compact URLs (#r/techno-cosmopolitan-2gbeu3-21i3v9)
 * and legacy base64 query payloads (#card=... / #result=...).
 */
export function parseSharedCard(hashOrUrl: string): ParseResult {
  if (!hashOrUrl) {
    return { valid: false, card: null, error: 'malformed' };
  }

  // Strip protocol and origin if full URL was passed
  let clean = hashOrUrl;
  const hashIdx = clean.indexOf('#');
  if (hashIdx !== -1) {
    clean = clean.slice(hashIdx + 1);
  }
  if (clean.startsWith('/')) clean = clean.slice(1);

  // 1. Check for modern compact short route: #r/{payload} or /r/{payload} or direct payload
  const shortMatch = clean.match(/^(?:r|result|c|card)\/([a-z0-9-]+)/i);
  const potentialCompact = shortMatch ? shortMatch[1] : clean.includes('-') && !clean.includes('=') ? clean : null;

  if (potentialCompact) {
    const decoded = decodeShortShare(potentialCompact);
    if (decoded) {
      const presented = reconstructPresentedFromAnswers(decoded.answers);
      const { scores, coverage } = computeLedgerState(presented);
      return {
        valid: true,
        card: {
          schema: 1,
          modelVersion: '0.1',
          renderVersion: '1',
          scores,
          coverage,
          visualSeed: decoded.visualSeed,
          answers: decoded.answers,
        },
        error: null,
      };
    }
  }

  // 2. Legacy fallback: card={payload}, result={payload}, or s={payload}
  const legacyMatch = clean.match(/(?:^|[&?])(?:card|result|s)=([^&]+)/);
  if (legacyMatch) {
    const payload = legacyMatch[1];
    if (payload.length > 4096) {
      return { valid: false, card: null, error: 'malformed' };
    }

    try {
      const jsonStr = fromBase64Url(payload);
      const parsed = JSON.parse(jsonStr);

      if (parsed.schema !== 1 || parsed.modelVersion !== '0.1' || parsed.renderVersion !== '1') {
        return { valid: false, card: null, error: 'unsupported_version' };
      }

      if (typeof parsed.visualSeed !== 'number') {
        return { valid: false, card: null, error: 'malformed' };
      }

      const scores = parsed.scores as Partial<Scores>;
      const coverage = parsed.coverage as Partial<Coverage>;

      if (!scores || !coverage) {
        return { valid: false, card: null, error: 'malformed' };
      }

      for (const d of DIMENSIONS) {
        const c = coverage[d];
        const s = scores[d];

        if (typeof c !== 'number' || c < 0 || c > 18 || !Number.isInteger(c)) {
          return { valid: false, card: null, error: 'malformed' };
        }

        if (c === 0) {
          if (s !== null) return { valid: false, card: null, error: 'malformed' };
        } else {
          if (typeof s !== 'number' || s < 0 || s > 100 || s % 5 !== 0) {
            return { valid: false, card: null, error: 'malformed' };
          }
        }
      }

      if (parsed.answers && typeof parsed.answers === 'object') {
        for (const [k, v] of Object.entries(parsed.answers)) {
          if (typeof k !== 'string' || (v !== 'A' && v !== 'B' && v !== 'skip')) {
            return { valid: false, card: null, error: 'malformed' };
          }
        }
      }

      return {
        valid: true,
        card: parsed as SharedCardResult,
        error: null,
      };
    } catch {
      return { valid: false, card: null, error: 'malformed' };
    }
  }

  return { valid: false, card: null, error: 'malformed' };
}
