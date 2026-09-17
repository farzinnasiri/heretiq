import { describe, it, expect } from 'vitest';
import { assignArchetype, computeArchetypeDistance, ARCHETYPES } from './archetypes';
import { STUDIO_FIXTURES } from './fixtures';
import { Coverage, Scores } from './types';
import { DIMENSIONS } from './questions';

describe('Archetypes & Prototypes', () => {
  const fullCoverage: Coverage = { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 };

  it('assigns Techno-Cosmopolitan to exact prototype match with distance 0', () => {
    const tcProto = ARCHETYPES.find(a => a.id === 'techno-cosmopolitan')!;
    const distance = computeArchetypeDistance(tcProto.prototype, tcProto.prototype);
    expect(distance).toBe(0);

    const result = assignArchetype(tcProto.prototype, fullCoverage);
    expect(result.archetype.id).toBe('techno-cosmopolitan');
    expect(result.isComplete).toBe(true);
    expect(result.distance).toBe(0);
  });

  it('assigns The Unfinished Portrait when coverage is incomplete', () => {
    const f20 = STUDIO_FIXTURES.find(f => f.id === 'F20')!;
    const result = assignArchetype(f20.scores, f20.coverage);
    expect(result.archetype.id).toBe('unfinished-portrait');
    expect(result.isComplete).toBe(false);
    expect(result.archetype.code).toBe('UP');
  });

  it('assigns The Mixed Signal when all scores are within 5 points of 50', () => {
    const neutralScores = { M: 50, A: 50, I: 50, G: 50, E: 50, T: 50 };
    const result = assignArchetype(neutralScores, fullCoverage);
    expect(result.archetype.id).toBe('mixed-signal');
    expect(result.archetype.code).toBe('MX');
  });

  it('assigns The Mixed Signal when best distance exceeds 0.18', () => {
    // Highly discordant scores far from any single prototype
    const extremeScores = { M: 0, A: 100, I: 0, G: 100, E: 0, T: 100 };
    const result = assignArchetype(extremeScores, fullCoverage);
    expect(result.archetype.id).toBe('mixed-signal');
  });

  it('keeps every named archetype reachable from the core-question score lattice', () => {
    // Three binary questions per dimension can only produce these four visible scores.
    const reachableScores = [25, 40, 60, 75];
    const reached = new Set<string>();

    for (let encoded = 0; encoded < reachableScores.length ** DIMENSIONS.length; encoded += 1) {
      let remaining = encoded;
      const scores = {} as Scores;
      for (const dimension of DIMENSIONS) {
        scores[dimension] = reachableScores[remaining % reachableScores.length];
        remaining = Math.floor(remaining / reachableScores.length);
      }

      const result = assignArchetype(scores, fullCoverage);
      if (!result.isFallback) reached.add(result.archetype.id);
    }

    expect([...reached].sort()).toEqual(ARCHETYPES.map((archetype) => archetype.id).sort());
  });
});
