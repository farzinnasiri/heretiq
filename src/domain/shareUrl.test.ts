import { describe, it, expect } from 'vitest';
import {
  encodeShortShare,
  decodeShortShare,
  encodeSharedCard,
  parseSharedCard,
  generateShareUrl,
  reconstructPresentedFromAnswers,
} from './shareUrl';
import { SharedCardResult } from './types';
import { CORE_QUESTION_SEQUENCE } from './questions';

describe('Share URL Encoding & Decoding (Short, Pretty & Resilient)', () => {
  const sampleAnswers: Record<string, 'A' | 'B'> = {
    M1: 'A', A1: 'B', I1: 'A', G1: 'B', E1: 'A', T1: 'B',
    M2: 'B', A2: 'A', I2: 'B', G2: 'A', E2: 'B', T2: 'A',
    M3: 'A', A3: 'A', I3: 'B', G3: 'B', E3: 'A', T3: 'B',
  };
  const sampleSeed = 987654321;

  it('generates an ultra-short, human-readable share URL with archetype slug', () => {
    const url = generateShareUrl({
      archetypeSlug: 'techno-cosmopolitan',
      answers: sampleAnswers,
      visualSeed: sampleSeed,
    }, 'https://heretiq.app');

    expect(url.startsWith('https://heretiq.app/#r/techno-cosmopolitan-')).toBe(true);
    // Crucial check: entire URL must be under 65 characters! (vs previous ~480 chars)
    expect(url.length).toBeLessThan(65);
    expect(url).not.toContain('%');
    expect(url).not.toContain('=');
  });

  it('correctly round-trips all 18 answers and visualSeed through compact encoding', () => {
    const encoded = encodeShortShare({
      archetypeSlug: 'the-technocrat',
      answers: sampleAnswers,
      visualSeed: sampleSeed,
    });

    const decoded = decodeShortShare(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded?.visualSeed).toBe(sampleSeed);
    expect(decoded?.archetypeSlug).toBe('the-technocrat');

    for (const qId of CORE_QUESTION_SEQUENCE) {
      expect(decoded?.answers[qId]).toBe(sampleAnswers[qId]);
    }
  });

  it('parses a modern short URL into a valid SharedCardResult with calculated scores', () => {
    const url = generateShareUrl({
      archetypeSlug: 'market-rebel',
      answers: sampleAnswers,
      visualSeed: sampleSeed,
    }, 'https://heretiq.app');

    const result = parseSharedCard(url);
    expect(result.valid).toBe(true);
    expect(result.card).not.toBeNull();
    expect(result.card?.visualSeed).toBe(sampleSeed);
    expect(result.card?.answers?.M1).toBe('A');
    expect(result.card?.answers?.T3).toBe('B');

    // Scores and coverage should be automatically derived
    expect(result.card?.scores).toBeDefined();
    expect(result.card?.coverage.M).toBe(3);
    expect(result.card?.coverage.A).toBe(3);
    expect(result.card?.coverage.T).toBe(3);
  });

  it('supports path-style /r/ and hash-style #r/ variants seamlessly', () => {
    const shortCode = encodeShortShare({
      archetypeSlug: 'civic-progressive',
      answers: sampleAnswers,
      visualSeed: sampleSeed,
    });

    expect(parseSharedCard(`#r/${shortCode}`).valid).toBe(true);
    expect(parseSharedCard(`/r/${shortCode}`).valid).toBe(true);
    expect(parseSharedCard(`#card/${shortCode}`).valid).toBe(true);
    expect(parseSharedCard(`#${shortCode}`).valid).toBe(true);
  });

  it('correctly reconstructs presented items from decoded answers', () => {
    const url = generateShareUrl({
      answers: sampleAnswers,
      visualSeed: sampleSeed,
    });

    const parsed = parseSharedCard(url);
    const reconstructed = reconstructPresentedFromAnswers(parsed.card?.answers);

    expect(reconstructed.length).toBe(18);
    expect(reconstructed[0].questionId).toBe(CORE_QUESTION_SEQUENCE[0]);
    expect(reconstructed[0].choice).toBe(sampleAnswers[CORE_QUESTION_SEQUENCE[0]]);
    expect(reconstructed[17].questionId).toBe(CORE_QUESTION_SEQUENCE[17]);
    expect(reconstructed[17].choice).toBe(sampleAnswers[CORE_QUESTION_SEQUENCE[17]]);
  });

  it('preserves backwards compatibility with legacy base64 payloads (#card=...) if encountered', () => {
    const legacyCard: SharedCardResult = {
      schema: 1,
      modelVersion: '0.1',
      renderVersion: '1',
      scores: { M: 70, A: 70, I: 60, G: 70, E: 40, T: 75 },
      coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
      visualSeed: 123456,
      answers: { M1: 'A', M2: 'B' },
    };

    const legacyEncoded = encodeSharedCard(legacyCard);
    const parsed = parseSharedCard(`#card=${legacyEncoded}`);
    expect(parsed.valid).toBe(true);
    expect(parsed.card?.visualSeed).toBe(123456);
    expect(parsed.card?.scores.M).toBe(70);
  });

  it('gracefully rejects corrupted or invalid hash strings', () => {
    expect(parseSharedCard('').valid).toBe(false);
    expect(parseSharedCard('#garbage_no_hyphen').valid).toBe(false);
    expect(parseSharedCard('#r/invalid-nonexistent').valid).toBe(false);
  });
});
