import { SharedCardResult, Scores, Coverage, Choice, PresentedItem } from './types';
import { DIMENSIONS, CORE_QUESTION_SEQUENCE } from './questions';

function toBase64Url(str: string): string {
  // Convert UTF-8 string to base64url in browser / node
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
  const json = JSON.stringify(card);
  return toBase64Url(json);
}

export function generateShareUrl(card: SharedCardResult, origin?: string): string {
  const payload = encodeSharedCard(card);
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/#card=${payload}`;
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

export function parseSharedCard(hashString: string): ParseResult {
  if (!hashString) {
    return { valid: false, card: null, error: 'malformed' };
  }

  // Strip leading '#' or '#/' if present
  let cleanHash = hashString.startsWith('#') ? hashString.slice(1) : hashString;
  if (cleanHash.startsWith('/')) cleanHash = cleanHash.slice(1);

  // Expect card={payload}, result={payload}, or legacy s={payload}
  const match = cleanHash.match(/(?:^|[&?])(?:card|result|s)=([^&]+)/);
  if (!match) {
    return { valid: false, card: null, error: 'malformed' };
  }

  const payload = match[1];
  if (payload.length > 4096) {
    return { valid: false, card: null, error: 'malformed' };
  }

  try {
    const jsonStr = fromBase64Url(payload);
    const parsed = JSON.parse(jsonStr);

    if (parsed.schema !== 1 || parsed.modelVersion !== '0.1') {
      return { valid: false, card: null, error: 'unsupported_version' };
    }

    if (parsed.renderVersion !== '1') {
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

    // Verify all 6 dimensions
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

    // Optional answers map verification
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
