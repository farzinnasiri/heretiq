import { Dimension, Scores, Coverage, PresentedItem } from './types';
import { DIMENSIONS, QUESTION_BANK } from './questions';

export const GRID_POINTS = 61;
export const THETA_MIN = -3.0;
export const THETA_MAX = 3.0;
export const THETA_STEP = 0.1;
export const PRIOR_SIGMA = 1.2;
export const ITEM_DISCRIMINATION = 1.2;
export const ITEM_THRESHOLD = 0.0;
export const STOPPING_GAIN_CUTOFF = 0.095; // In natural log units

export const THETA_GRID: number[] = Array.from({ length: GRID_POINTS }, (_, i) => {
  return Number((THETA_MIN + i * THETA_STEP).toFixed(2));
});

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function createPriorDistribution(): number[] {
  const unnormalized = THETA_GRID.map(theta => {
    return Math.exp(-(theta * theta) / (2 * PRIOR_SIGMA * PRIOR_SIGMA));
  });
  const sum = unnormalized.reduce((acc, val) => acc + val, 0);
  return unnormalized.map(val => val / sum);
}

export const L_PLUS: number[] = THETA_GRID.map(theta => {
  return sigmoid(ITEM_DISCRIMINATION * (theta - ITEM_THRESHOLD));
});

export const L_MINUS: number[] = L_PLUS.map(val => 1 - val);

export const SIGMOID_THETA: number[] = THETA_GRID.map(theta => sigmoid(theta));

export function normalizeDistribution(dist: number[]): number[] {
  const sum = dist.reduce((acc, val) => acc + val, 0);
  if (sum === 0) {
    return createPriorDistribution();
  }
  return dist.map(val => val / sum);
}

export function calculateEntropy(p: number[]): number {
  let h = 0;
  for (let i = 0; i < p.length; i++) {
    if (p[i] > 1e-12) {
      h -= p[i] * Math.log(p[i]);
    }
  }
  return h;
}

export function updateDistribution(
  currentDist: number[],
  isPositive: boolean
): number[] {
  const likelihood = isPositive ? L_PLUS : L_MINUS;
  const updated = currentDist.map((p, i) => p * likelihood[i]);
  return normalizeDistribution(updated);
}

export function calculateLeaningIndex(p: number[]): number {
  let sum = 0;
  for (let i = 0; i < p.length; i++) {
    sum += p[i] * SIGMOID_THETA[i];
  }
  return 100 * sum;
}

export function calculateVisibleScore(internalScore: number | null): number | null {
  if (internalScore === null) return null;
  return 5 * Math.round(internalScore / 5);
}

export interface DimensionState {
  distribution: number[];
  internalScore: number | null;
  visibleScore: number | null;
  coverageCount: number;
}

export function computeLedgerState(presented: PresentedItem[]): {
  distributions: Record<Dimension, number[]>;
  internalScores: Record<Dimension, number | null>;
  scores: Scores;
  coverage: Coverage;
} {
  const distributions: Record<Dimension, number[]> = {
    M: createPriorDistribution(),
    A: createPriorDistribution(),
    I: createPriorDistribution(),
    G: createPriorDistribution(),
    E: createPriorDistribution(),
    T: createPriorDistribution(),
  };

  const coverage: Coverage = { M: 0, A: 0, I: 0, G: 0, E: 0, T: 0 };

  for (const item of presented) {
    if (!item.choice || item.choice === 'skip') continue;

    const q = QUESTION_BANK[item.questionId];
    if (!q) continue;

    const isPositive = item.choice === q.positiveChoice;
    distributions[q.dimension] = updateDistribution(distributions[q.dimension], isPositive);
    coverage[q.dimension] += 1;
  }

  const internalScores: Record<Dimension, number | null> = {
    M: null, A: null, I: null, G: null, E: null, T: null
  };
  const scores: Scores = {
    M: null, A: null, I: null, G: null, E: null, T: null
  };

  for (const d of DIMENSIONS) {
    if (coverage[d] > 0) {
      const s = calculateLeaningIndex(distributions[d]);
      internalScores[d] = s;
      scores[d] = calculateVisibleScore(s);
    } else {
      internalScores[d] = null;
      scores[d] = null;
    }
  }

  return { distributions, internalScores, scores, coverage };
}

export function calculateInformationGain(p: number[]): number {
  const hp = calculateEntropy(p);

  let qPlus = 0;
  for (let i = 0; i < p.length; i++) {
    qPlus += p[i] * L_PLUS[i];
  }

  const pPlusUn = p.map((val, i) => val * L_PLUS[i]);
  const pMinusUn = p.map((val, i) => val * L_MINUS[i]);

  const pPlus = normalizeDistribution(pPlusUn);
  const pMinus = normalizeDistribution(pMinusUn);

  const gain = hp - qPlus * calculateEntropy(pPlus) - (1 - qPlus) * calculateEntropy(pMinus);
  return gain;
}

export function selectNextOptionalQuestion(
  presented: PresentedItem[],
  optionalPresentedCount: number
): string | null {
  if (optionalPresentedCount >= 6) {
    return null;
  }

  const presentedIds = new Set(presented.map(p => p.questionId));
  const { distributions, coverage } = computeLedgerState(presented);

  // Remaining unused optional items
  const eligibleQuestions = Object.values(QUESTION_BANK).filter(
    q => q.phase === 'optional' && !presentedIds.has(q.id)
  );

  if (eligibleQuestions.length === 0) {
    return null;
  }

  // Calculate gains for eligible questions
  const gainsByDim: Record<Dimension, number> = {
    M: calculateInformationGain(distributions.M),
    A: calculateInformationGain(distributions.A),
    I: calculateInformationGain(distributions.I),
    G: calculateInformationGain(distributions.G),
    E: calculateInformationGain(distributions.E),
    T: calculateInformationGain(distributions.T),
  };

  const allHaveAtLeastTwo = DIMENSIONS.every(d => coverage[d] >= 2);
  const maxGain = Math.max(...Object.values(gainsByDim));

  if (allHaveAtLeastTwo && maxGain < STOPPING_GAIN_CUTOFF) {
    return null;
  }

  const lastPresented = presented[presented.length - 1];
  const lastDimension = lastPresented ? QUESTION_BANK[lastPresented.questionId]?.dimension : null;

  // Filter pool: if any dimension has < 2 substantive answers, prioritize items from those dimensions
  const undercoveredDims = new Set(DIMENSIONS.filter(d => coverage[d] < 2));
  const candidatePool = undercoveredDims.size > 0
    ? eligibleQuestions.filter(q => undercoveredDims.has(q.dimension))
    : eligibleQuestions;

  // Sort candidate pool by rules:
  // 1. Expected gain descending
  // 2. Fewer substantive answers in dimension ascending
  // 3. Different dimension from immediately previous question
  // 4. Lexicographic question ID
  candidatePool.sort((a, b) => {
    const gainA = gainsByDim[a.dimension];
    const gainB = gainsByDim[b.dimension];
    if (Math.abs(gainA - gainB) > 1e-6) {
      return gainB - gainA;
    }

    if (coverage[a.dimension] !== coverage[b.dimension]) {
      return coverage[a.dimension] - coverage[b.dimension];
    }

    const aDifferentFromLast = a.dimension !== lastDimension ? 1 : 0;
    const bDifferentFromLast = b.dimension !== lastDimension ? 1 : 0;
    if (aDifferentFromLast !== bDifferentFromLast) {
      return bDifferentFromLast - aDifferentFromLast;
    }

    return a.id.localeCompare(b.id);
  });

  return candidatePool[0]?.id ?? null;
}
