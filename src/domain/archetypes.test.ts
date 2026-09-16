import { describe, it, expect } from 'vitest';
import { assignArchetype, computeArchetypeDistance, ARCHETYPES } from './archetypes';
import { STUDIO_FIXTURES } from './fixtures';
import { Coverage } from './types';

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
});
