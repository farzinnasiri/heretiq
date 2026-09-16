import { describe, it, expect } from 'vitest';
import { encodeSharedCard, parseSharedCard, generateShareUrl, reconstructPresentedFromAnswers } from './shareUrl';
import { SharedCardResult } from './types';

describe('Share URL Encoding & Decoding', () => {
  const sampleCard: SharedCardResult = {
    schema: 1,
    modelVersion: '0.1',
    renderVersion: '1',
    scores: { M: 70, A: 70, I: 60, G: 70, E: 40, T: 75 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 123456,
  };

  it('correctly round-trips a valid SharedCardResult', () => {
    const encoded = encodeSharedCard(sampleCard);
    expect(encoded).toBeDefined();
    expect(encoded.length).toBeLessThan(2048);

    const hashString = `#card=${encoded}`;
    const parsed = parseSharedCard(hashString);
    expect(parsed.valid).toBe(true);
    expect(parsed.card).toEqual(sampleCard);
  });

  it('handles full URL with generateShareUrl', () => {
    const url = generateShareUrl(sampleCard, 'https://heretiq.app');
    expect(url.startsWith('https://heretiq.app/#card=')).toBe(true);

    const hash = url.slice(url.indexOf('#'));
    const parsed = parseSharedCard(hash);
    expect(parsed.valid).toBe(true);
    expect(parsed.card?.scores.M).toBe(70);
  });

  it('rejects malformed or invalid version payloads', () => {
    expect(parseSharedCard('').valid).toBe(false);
    expect(parseSharedCard('#garbage').valid).toBe(false);

    // Invalid schema / model version
    const invalidVersion = { ...sampleCard, modelVersion: '9.9' };
    const encoded = encodeSharedCard(invalidVersion as any);
    const result = parseSharedCard(`#card=${encoded}`);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('unsupported_version');
  });

  it('rejects payloads with invalid score increments (not multiple of 5)', () => {
    const invalidScores = {
      ...sampleCard,
      scores: { ...sampleCard.scores, M: 73 },
    };
    const encoded = encodeSharedCard(invalidScores);
    const result = parseSharedCard(`#card=${encoded}`);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('malformed');
  });

  it('correctly round-trips with question answers and reconstructs presented items', () => {
    const cardWithAnswers: SharedCardResult = {
      ...sampleCard,
      answers: {
        M1: 'A',
        M2: 'B',
        A1: 'A',
        A2: 'B',
      },
    };

    const encoded = encodeSharedCard(cardWithAnswers);
    const parsed = parseSharedCard(`#card=${encoded}`);
    expect(parsed.valid).toBe(true);
    expect(parsed.card?.answers).toEqual(cardWithAnswers.answers);

    const reconstructed = reconstructPresentedFromAnswers(parsed.card?.answers);
    expect(reconstructed.length).toBe(4);
    expect(reconstructed[0].questionId).toBe('M1');
    expect(reconstructed[0].choice).toBe('A');
    expect(reconstructed[1].questionId).toBe('A1');
    expect(reconstructed[1].choice).toBe('A');
    expect(reconstructed[2].questionId).toBe('M2');
    expect(reconstructed[2].choice).toBe('B');
    expect(reconstructed[3].questionId).toBe('A2');
    expect(reconstructed[3].choice).toBe('B');
  });

  it('supports result=, card=, and legacy s= prefixes', () => {
    const encoded = encodeSharedCard(sampleCard);
    expect(parseSharedCard(`#result=${encoded}`).valid).toBe(true);
    expect(parseSharedCard(`#card=${encoded}`).valid).toBe(true);
    expect(parseSharedCard(`#s=${encoded}`).valid).toBe(true);
  });
});
