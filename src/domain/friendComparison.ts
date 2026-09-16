import { Dimension, Scores, Coverage } from './types';
import { DIMENSIONS, DIMENSION_META } from './questions';

export interface DimensionComparisonItem {
  dimension: Dimension;
  gap: number;
  phrase: string;
  youScore: number;
  friendScore: number;
  dimensionName: string;
}

export interface ComparisonResult {
  canCompare: boolean;
  sharedDimensionsCount: number;
  alignment: number | null;
  pairCategory: 'high' | 'medium' | 'low' | 'partial';
  items: DimensionComparisonItem[];
  faultLine: string;
  allianceOrClosest: {
    type: 'unlikely-alliance' | 'closest' | 'none';
    text: string;
  };
  summary: string;
}

export function compareFriends(
  youScores: Scores,
  youCoverage: Coverage,
  friendScores: Scores,
  friendCoverage: Coverage
): ComparisonResult {
  const sharedDims: Dimension[] = [];

  for (const d of DIMENSIONS) {
    if (
      youCoverage[d] >= 2 &&
      friendCoverage[d] >= 2 &&
      youScores[d] !== null &&
      friendScores[d] !== null
    ) {
      sharedDims.push(d);
    }
  }

  const items: DimensionComparisonItem[] = sharedDims.map(d => {
    const youS = youScores[d]!;
    const friendS = friendScores[d]!;
    const gap = Math.abs(youS - friendS);
    let phrase = `Far apart on ${DIMENSION_META[d].publicName}`;
    if (gap <= 10) {
      phrase = `Close on ${DIMENSION_META[d].publicName}`;
    } else if (gap <= 25) {
      phrase = `Some distance on ${DIMENSION_META[d].publicName}`;
    }

    return {
      dimension: d,
      gap,
      phrase,
      youScore: youS,
      friendScore: friendS,
      dimensionName: DIMENSION_META[d].publicName,
    };
  });

  if (sharedDims.length < 4) {
    return {
      canCompare: false,
      sharedDimensionsCount: sharedDims.length,
      alignment: null,
      pairCategory: 'partial',
      items,
      faultLine: 'Answer a few more to compare more of the picture.',
      allianceOrClosest: { type: 'none', text: '' },
      summary: 'A partial comparison',
    };
  }

  // Calculate alignment = round(100 - mean(gap))
  const meanGap = items.reduce((acc, item) => acc + item.gap, 0) / items.length;
  const alignment = Math.round(100 - meanGap);

  let pairCategory: 'high' | 'medium' | 'low' = 'low';
  if (alignment >= 85) {
    pairCategory = 'high';
  } else if (alignment >= 70) {
    pairCategory = 'medium';
  }

  // Fault line
  // Largest measured gap
  const sortedByGapDesc = [...items].sort((a, b) => {
    if (b.gap !== a.gap) return b.gap - a.gap;
    return DIMENSIONS.indexOf(a.dimension) - DIMENSIONS.indexOf(b.dimension);
  });

  const largestGapItem = sortedByGapDesc[0];
  let faultLine = 'No major fault line in these choices.';
  if (largestGapItem && largestGapItem.gap >= 20) {
    faultLine = `Your fault line: ${largestGapItem.dimensionName}.`;
  }

  // Check unlikely alliance:
  // Requires:
  // 1. Largest gap >= 20 elsewhere
  // 2. Gap <= 10 in the alliance dimension
  // 3. Both profiles leaning at least 10 points away from 50 toward the same pole
  let allianceOrClosest: { type: 'unlikely-alliance' | 'closest' | 'none'; text: string } = {
    type: 'none',
    text: '',
  };

  if (largestGapItem && largestGapItem.gap >= 20) {
    const allianceCandidates = items.filter(item => {
      if (item.gap > 10) return false;
      const bothHigh = item.youScore >= 60 && item.friendScore >= 60;
      const bothLow = item.youScore <= 40 && item.friendScore <= 40;
      return bothHigh || bothLow;
    });

    if (allianceCandidates.length > 0) {
      allianceCandidates.sort((a, b) => {
        const leanA = Math.min(Math.abs(a.youScore - 50), Math.abs(a.friendScore - 50));
        const leanB = Math.min(Math.abs(b.youScore - 50), Math.abs(b.friendScore - 50));
        if (leanB !== leanA) return leanB - leanA;
        return DIMENSIONS.indexOf(a.dimension) - DIMENSIONS.indexOf(b.dimension);
      });
      allianceOrClosest = {
        type: 'unlikely-alliance',
        text: `Your unlikely alliance: ${allianceCandidates[0].dimensionName}.`,
      };
    }
  }

  // Fallback to Closest on {dimension} if no unlikely alliance
  if (allianceOrClosest.type === 'none') {
    const sortedByGapAsc = [...items].sort((a, b) => {
      if (a.gap !== b.gap) return a.gap - b.gap;
      return DIMENSIONS.indexOf(a.dimension) - DIMENSIONS.indexOf(b.dimension);
    });

    const allGapsWithin10 = items.every(it => it.gap <= 10);
    if (allGapsWithin10) {
      allianceOrClosest = {
        type: 'closest',
        text: 'Close across the measured dimensions',
      };
    } else if (sortedByGapAsc.length > 0) {
      allianceOrClosest = {
        type: 'closest',
        text: `Closest on ${sortedByGapAsc[0].dimensionName}.`,
      };
    }
  }

  return {
    canCompare: true,
    sharedDimensionsCount: sharedDims.length,
    alignment,
    pairCategory,
    items,
    faultLine,
    allianceOrClosest,
    summary: `${alignment}% ALIGNMENT`,
  };
}
