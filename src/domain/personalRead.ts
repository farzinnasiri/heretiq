import { Dimension, Scores, Coverage } from './types';
import { DIMENSIONS, DIMENSION_META } from './questions';

export const PERSONAL_READ_CLAUSES: Record<Dimension, { low: string; high: string }> = {
  M: {
    low: 'public services doing more of the work',
    high: 'competing providers doing more of the work',
  },
  A: {
    low: 'shared rules when personal choices affect others',
    high: 'personal choice despite its costs to others',
  },
  I: {
    low: 'outside checks on established power',
    high: 'working through established institutions',
  },
  G: {
    low: 'obligations starting with people at home',
    high: 'treating national borders as less decisive',
  },
  E: {
    low: 'allowing rewards and inheritance to create bigger differences',
    high: 'narrowing gaps in resources and opportunity',
  },
  T: {
    low: 'waiting for more evidence before adopting new technology',
    high: 'trying new technology with monitoring',
  },
};

export function computePersonalRead(scores: Scores, coverage: Coverage): string {
  // Rank dimensions with at least 2 answers by abs(S - 50)
  const qualifying: Array<{ dim: Dimension; distance: number; isHigh: boolean }> = [];

  for (const d of DIMENSIONS) {
    const s = scores[d];
    if (coverage[d] >= 2 && s !== null) {
      const distance = Math.abs(s - 50);
      if (s <= 40 || s >= 60) {
        qualifying.push({
          dim: d,
          distance,
          isHigh: s >= 60,
        });
      }
    }
  }

  // Stable sort: distance desc, then M/A/I/G/E/T
  qualifying.sort((a, b) => {
    if (b.distance !== a.distance) {
      return b.distance - a.distance;
    }
    return DIMENSIONS.indexOf(a.dim) - DIMENSIONS.indexOf(b.dim);
  });

  const selected = qualifying.slice(0, 2);

  if (selected.length === 0) {
    return 'Your answers change with the situation. Open the six dimensions to see where.';
  }

  if (selected.length === 1) {
    const clause = selected[0].isHigh
      ? PERSONAL_READ_CLAUSES[selected[0].dim].high
      : PERSONAL_READ_CLAUSES[selected[0].dim].low;
    return `In these choices, you leaned toward ${clause}.`;
  }

  const clause1 = selected[0].isHigh
    ? PERSONAL_READ_CLAUSES[selected[0].dim].high
    : PERSONAL_READ_CLAUSES[selected[0].dim].low;
  const clause2 = selected[1].isHigh
    ? PERSONAL_READ_CLAUSES[selected[1].dim].high
    : PERSONAL_READ_CLAUSES[selected[1].dim].low;

  return `In these choices, you leaned toward ${clause1}; ${clause2}.`;
}

export interface TraitItem {
  dimension: Dimension;
  label: string;
  value: number; // strength toward named end (S for high, 100-S for low)
  isHigh: boolean;
}

export function computeStrongestTraits(scores: Scores, coverage: Coverage): TraitItem[] {
  const candidates: Array<{ dim: Dimension; distance: number; s: number }> = [];

  for (const d of DIMENSIONS) {
    const s = scores[d];
    if (coverage[d] >= 2 && s !== null) {
      const distance = Math.abs(s - 50);
      if (distance >= 10) {
        candidates.push({ dim: d, distance, s });
      }
    }
  }

  // Sort by distance descending, stable tie order M/A/I/G/E/T
  candidates.sort((a, b) => {
    if (b.distance !== a.distance) {
      return b.distance - a.distance;
    }
    return DIMENSIONS.indexOf(a.dim) - DIMENSIONS.indexOf(b.dim);
  });

  const selected = candidates.slice(0, 3);

  return selected.map(item => {
    const isHigh = item.s > 50;
    const meta = DIMENSION_META[item.dim];
    return {
      dimension: item.dim,
      label: isHigh ? meta.strongTraitHigh : meta.strongTraitLow,
      value: isHigh ? item.s : 100 - item.s,
      isHigh,
    };
  });
}

export function computeShareLine(scores: Scores, coverage: Coverage): string {
  const candidates: Array<{ dim: Dimension; distance: number; isHigh: boolean }> = [];

  for (const d of DIMENSIONS) {
    const s = scores[d];
    if (coverage[d] >= 2 && s !== null) {
      const distance = Math.abs(s - 50);
      if (distance >= 10) {
        candidates.push({
          dim: d,
          distance,
          isHigh: s > 50,
        });
      }
    }
  }

  candidates.sort((a, b) => {
    if (b.distance !== a.distance) {
      return b.distance - a.distance;
    }
    return DIMENSIONS.indexOf(a.dim) - DIMENSIONS.indexOf(b.dim);
  });

  const selected = candidates.slice(0, 2);

  if (selected.length === 0) {
    return 'A different answer for a different situation.';
  }

  const getClause = (item: { dim: Dimension; isHigh: boolean }) => {
    const meta = DIMENSION_META[item.dim];
    return item.isHigh ? meta.shareLineHigh : meta.shareLineLow;
  };

  if (selected.length === 1) {
    return `${getClause(selected[0])}.`;
  }

  const clause1 = getClause(selected[0]);
  const clause2 = getClause(selected[1]);
  // Lowercase first letter of second clause
  const formattedClause2 = clause2.charAt(0).toLowerCase() + clause2.slice(1);

  return `${clause1}; ${formattedClause2}.`;
}
