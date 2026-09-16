import { Scores, Coverage, Foil } from './types';
import { DIMENSIONS, DIMENSION_META } from './questions';
import { ARCHETYPES, computeArchetypeDistance } from './archetypes';

export interface FoilEvaluation {
  hasFoil: boolean;
  foil: Foil | null;
  emptyReason: string | null;
}

export function evaluateFoil(
  scores: Scores,
  coverage: Coverage,
  userArchetypeId: string
): FoilEvaluation {
  const isComplete = DIMENSIONS.every(d => coverage[d] >= 2 && scores[d] !== null);
  if (!isComplete) {
    return {
      hasFoil: false,
      foil: null,
      emptyReason: 'Complete the core choices to reveal your foil.',
    };
  }

  // Check if every user score is within 10 points of 50
  const allWithin10Of50 = DIMENSIONS.every(d => {
    const s = scores[d]!;
    return Math.abs(s - 50) <= 10;
  });

  if (allWithin10Of50) {
    return {
      hasFoil: false,
      foil: null,
      emptyReason: 'Your choices are too mixed for a clean opposite.',
    };
  }

  // Mirror scores: 100 - S
  const mirrorScores: Scores = {
    M: 100 - scores.M!,
    A: 100 - scores.A!,
    I: 100 - scores.I!,
    G: 100 - scores.G!,
    E: 100 - scores.E!,
    T: 100 - scores.T!,
  };

  // Find nearest different prototype
  const candidates = ARCHETYPES.filter(a => a.id !== userArchetypeId).map(arch => ({
    archetype: arch,
    distance: computeArchetypeDistance(mirrorScores, arch.prototype),
  }));

  candidates.sort((a, b) => {
    if (Math.abs(a.distance - b.distance) > 1e-6) {
      return a.distance - b.distance;
    }
    return a.archetype.id.localeCompare(b.archetype.id);
  });

  const bestFoilArchetype = candidates[0].archetype;

  // Calculate gaps between user score and foil prototype score
  const gaps = DIMENSIONS.map(d => {
    const userS = scores[d]!;
    const foilS = bestFoilArchetype.prototype[d];
    return {
      dimension: d,
      gap: Math.abs(userS - foilS),
      userScore: userS,
      foilScore: foilS,
      dimensionName: DIMENSION_META[d].publicName,
    };
  });

  // Sort by gap descending, tie-break by DIMENSIONS order
  gaps.sort((a, b) => {
    if (b.gap !== a.gap) {
      return b.gap - a.gap;
    }
    return DIMENSIONS.indexOf(a.dimension) - DIMENSIONS.indexOf(b.dimension);
  });

  const topTwo = [gaps[0], gaps[1]];

  return {
    hasFoil: true,
    foil: {
      archetype: bestFoilArchetype,
      gapDimensions: [topTwo[0].dimension, topTwo[1].dimension],
      gapDetails: topTwo,
    },
    emptyReason: null,
  };
}
