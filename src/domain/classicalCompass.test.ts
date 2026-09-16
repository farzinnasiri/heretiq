import { describe, it, expect } from 'vitest';
import { calculateClassicalCompass } from './classicalCompass';
import { ARCHETYPES } from './archetypes';

describe('calculateClassicalCompass', () => {
  it('identifies pure collectivist socialist as Far-Left Authoritarian Left', () => {
    // M=0 (100% Public), E=100 (100% Equity), A=10 (Strict order), I=90 (State institutions)
    const res = calculateClassicalCompass({
      M: 0,
      E: 100,
      A: 10,
      I: 90,
      G: 50,
      T: 50,
    });

    expect(res.economicScore).toBe(-10);
    expect(res.socialScore).toBeGreaterThan(5);
    expect(res.quadrant).toBe('authoritarian-left');
    expect(res.spectrum1D).toBe('far-left');
    expect(res.spectrum1DLabel).toBe('Far-Left');
  });

  it('identifies radical free-market libertarian as Far-Right Libertarian Right', () => {
    // M=100 (100% Market), E=0 (100% Merit), A=100 (100% Autonomy), I=0 (100% Distributed)
    const res = calculateClassicalCompass({
      M: 100,
      E: 0,
      A: 100,
      I: 0,
      G: 50,
      T: 50,
    });

    expect(res.economicScore).toBe(10);
    expect(res.socialScore).toBe(-10);
    expect(res.quadrant).toBe('libertarian-right');
    expect(res.spectrum1D).toBe('far-right');
    expect(res.spectrum1DLabel).toBe('Far-Right');
  });

  it('identifies democratic socialist / libertarian socialist as Libertarian Left', () => {
    // M=35 (Public-leaning), E=65 (Universal-leaning), A=80 (Autonomy), I=20 (Grassroots)
    const res = calculateClassicalCompass({
      M: 35,
      E: 65,
      A: 80,
      I: 20,
      G: 60,
      T: 50,
    });

    expect(res.economicScore).toBeLessThan(-2);
    expect(res.socialScore).toBeLessThan(-2);
    expect(res.quadrant).toBe('libertarian-left');
    expect(res.spectrum1D).toBe('left');
  });

  it('identifies dead center as Centrist with (0, 0) coordinates', () => {
    const res = calculateClassicalCompass({
      M: 50,
      E: 50,
      A: 50,
      I: 50,
      G: 50,
      T: 50,
    });

    expect(res.economicScore).toBe(0);
    expect(res.socialScore).toBe(0);
    expect(res.quadrant).toBe('centrist');
    expect(res.spectrum1D).toBe('center');
    expect(res.spectrum1DLabel).toBe('Centrist');
  });

  it('correctly maps 1D spectrum labels across various economic scores', () => {
    // Center-left
    const resCenterLeft = calculateClassicalCompass({ M: 45, E: 55, A: 50, I: 50, G: 50, T: 50 });
    expect(resCenterLeft.spectrum1D).toBe('center-left');

    // Center-right
    const resCenterRight = calculateClassicalCompass({ M: 55, E: 45, A: 50, I: 50, G: 50, T: 50 });
    expect(resCenterRight.spectrum1D).toBe('center-right');
  });
});

describe('Archetype Exemplars', () => {
  it('ensures all 12 primary archetypes have 5 exemplars with valid Wikipedia URLs', () => {
    expect(ARCHETYPES).toHaveLength(12);

    for (const arch of ARCHETYPES) {
      expect(arch.exemplars).toBeDefined();
      expect(arch.exemplars).toHaveLength(5);

      for (const ex of arch.exemplars!) {
        expect(ex.name.length).toBeGreaterThan(2);
        expect(ex.role.length).toBeGreaterThan(3);
        expect(ex.wikipediaUrl).toMatch(/^https:\/\/en\.wikipedia\.org\/wiki\/.+/);
      }
    }
  });
});
