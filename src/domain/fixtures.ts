import { Scores, Coverage, PresentedItem } from './types';

export interface VisualFixture {
  id: string;
  name: string;
  stance: string;
  scores: Scores;
  coverage: Coverage;
  visualSeed: number;
  whatItReveals: string;
}

export const STUDIO_FIXTURES: VisualFixture[] = [
  {
    id: 'F01',
    name: 'Ari',
    stance: 'open-market technologist',
    scores: { M: 70, A: 70, I: 60, G: 70, E: 40, T: 75 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 101,
    whatItReveals: 'Open, outward, sharp, relatively light engraving.',
  },
  {
    id: 'F02',
    name: 'Bea',
    stance: 'public-service progressive',
    scores: { M: 35, A: 65, I: 70, G: 70, E: 70, T: 60 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 102,
    whatItReveals: 'Dense, distributed, outward, mostly continuous.',
  },
  {
    id: 'F03',
    name: 'Cam',
    stance: 'market rebel',
    scores: { M: 75, A: 75, I: 25, G: 55, E: 30, T: 65 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 103,
    whatItReveals: 'Open but fragmented, with concentrated visual weight.',
  },
  {
    id: 'F04',
    name: 'Dev',
    stance: 'solidarity organiser',
    scores: { M: 30, A: 65, I: 25, G: 65, E: 75, T: 45 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 104,
    whatItReveals: 'Dense, distributed, segmented.',
  },
  {
    id: 'F05',
    name: 'Eli',
    stance: 'protectionist traditionalist',
    scores: { M: 45, A: 25, I: 60, G: 25, E: 45, T: 25 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 105,
    whatItReveals: 'Closed, inward, rounded.',
  },
  {
    id: 'F06',
    name: 'Fran',
    stance: 'local public builder',
    scores: { M: 35, A: 45, I: 65, G: 30, E: 65, T: 70 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 106,
    whatItReveals: 'Dense, inward, sharp, broadly distributed.',
  },
  {
    id: 'F07',
    name: 'Gray',
    stance: 'open-society reformer',
    scores: { M: 50, A: 75, I: 65, G: 75, E: 60, T: 55 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 107,
    whatItReveals: 'Strong openness and outward orientation with continuous ribs.',
  },
  {
    id: 'F08',
    name: 'Haru',
    stance: 'cautious egalitarian',
    scores: { M: 30, A: 50, I: 60, G: 55, E: 75, T: 25 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 108,
    whatItReveals: 'Dense, distributed, blunt outer points.',
  },
  {
    id: 'F09',
    name: 'Ivo',
    stance: 'sovereign entrepreneur',
    scores: { M: 75, A: 50, I: 40, G: 25, E: 30, T: 70 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 109,
    whatItReveals: 'Light, inward, sharp, centrally weighted.',
  },
  {
    id: 'F10',
    name: 'Jules',
    stance: 'order liberal',
    scores: { M: 70, A: 30, I: 70, G: 60, E: 35, T: 50 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 110,
    whatItReveals: 'More closed, light engraving, orderly continuity.',
  },
  {
    id: 'F11',
    name: 'Kit',
    stance: 'techno-populist',
    scores: { M: 50, A: 45, I: 25, G: 35, E: 65, T: 75 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 111,
    whatItReveals: 'Sharp, fragmented, with distributed nodes.',
  },
  {
    id: 'F12',
    name: 'Lou',
    stance: 'independent humanist',
    scores: { M: 45, A: 75, I: 30, G: 75, E: 65, T: 30 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 112,
    whatItReveals: 'Open, outward, rounded, discontinuous.',
  },
  {
    id: 'F13',
    name: 'Max',
    stance: 'markets with a strong state',
    scores: { M: 75, A: 30, I: 75, G: 25, E: 30, T: 75 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 113,
    whatItReveals: 'Sharp, closed, regular, inward.',
  },
  {
    id: 'F14',
    name: 'Noor',
    stance: 'egalitarian technology sceptic',
    scores: { M: 25, A: 75, I: 25, G: 75, E: 75, T: 25 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 114,
    whatItReveals: 'Dense and open, with blunt, fragmented outward forms.',
  },
  {
    id: 'F15',
    name: 'Oren',
    stance: 'mixed across everything',
    scores: { M: 50, A: 50, I: 50, G: 50, E: 50, T: 50 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 115,
    whatItReveals: 'Balanced geometry, mixed glyph, no forced strong traits.',
  },
  {
    id: 'F16',
    name: 'Paz',
    stance: 'selective middle',
    scores: { M: 60, A: 40, I: 60, G: 40, E: 60, T: 40 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 116,
    whatItReveals: 'A recognisably different emblem from F15 despite nearby values.',
  },
  {
    id: 'F17',
    name: 'Quinn',
    stance: 'all high-pole renderer stress',
    scores: { M: 100, A: 100, I: 100, G: 100, E: 100, T: 100 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 117,
    whatItReveals: 'Maximum openness and points stay inside the safe bounds.',
  },
  {
    id: 'F18',
    name: 'Remy',
    stance: 'all low-pole renderer stress',
    scores: { M: 0, A: 0, I: 0, G: 0, E: 0, T: 0 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 118,
    whatItReveals: 'Maximum density remains readable at 64px.',
  },
  {
    id: 'F19',
    name: 'Sol',
    stance: 'same scores as Ari',
    scores: { M: 70, A: 70, I: 60, G: 70, E: 40, T: 75 },
    coverage: { M: 3, A: 3, I: 3, G: 3, E: 3, T: 3 },
    visualSeed: 119,
    whatItReveals: 'Same structure as F01, visibly different fine engraving only.',
  },
  {
    id: 'F20',
    name: 'Val',
    stance: 'unfinished portrait',
    scores: { M: 70, A: null, I: 50, G: null, E: 30, T: 60 },
    coverage: { M: 3, A: 0, I: 3, G: 0, E: 3, T: 3 },
    visualSeed: 120,
    whatItReveals: 'Incomplete treatment; absent traits remain absent.',
  },
];

export const LEDGER_FIXTURE_L01: {
  id: string;
  name: string;
  visualSeed: number;
  presented: PresentedItem[];
  expectedScores: Scores;
} = {
  id: 'L01',
  name: 'Ledger 01',
  visualSeed: 201,
  presented: [
    { questionId: 'M1', choice: 'A', displayOrder: ['A', 'B'] },
    { questionId: 'A1', choice: 'B', displayOrder: ['A', 'B'] },
    { questionId: 'I1', choice: 'A', displayOrder: ['A', 'B'] },
    { questionId: 'G1', choice: 'B', displayOrder: ['A', 'B'] },
    { questionId: 'E1', choice: 'A', displayOrder: ['A', 'B'] },
    { questionId: 'T1', choice: 'A', displayOrder: ['A', 'B'] },
    { questionId: 'M2', choice: 'B', displayOrder: ['A', 'B'] },
    { questionId: 'A2', choice: 'A', displayOrder: ['A', 'B'] },
    { questionId: 'I2', choice: 'B', displayOrder: ['A', 'B'] },
    { questionId: 'G2', choice: 'A', displayOrder: ['A', 'B'] },
    { questionId: 'E2', choice: 'B', displayOrder: ['A', 'B'] },
    { questionId: 'T2', choice: 'B', displayOrder: ['A', 'B'] },
  ],
  expectedScores: { M: 70, A: 70, I: 70, G: 70, E: 50, T: 70 },
};

export const LEDGER_FIXTURE_L02: {
  id: string;
  name: string;
  visualSeed: number;
  presented: PresentedItem[];
  expectedScores: Scores;
} = {
  id: 'L02',
  name: 'Ledger 02',
  visualSeed: 202,
  presented: [
    { questionId: 'M1', choice: 'A', displayOrder: ['A', 'B'] },
    { questionId: 'A1', choice: 'B', displayOrder: ['A', 'B'] },
    { questionId: 'I1', choice: 'A', displayOrder: ['A', 'B'] },
    { questionId: 'G1', choice: 'B', displayOrder: ['A', 'B'] },
    { questionId: 'E1', choice: 'A', displayOrder: ['A', 'B'] },
    { questionId: 'T1', choice: 'A', displayOrder: ['A', 'B'] },
    { questionId: 'M2', choice: 'A', displayOrder: ['A', 'B'] },
    { questionId: 'A2', choice: 'B', displayOrder: ['A', 'B'] },
    { questionId: 'I2', choice: 'A', displayOrder: ['A', 'B'] },
    { questionId: 'G2', choice: 'B', displayOrder: ['A', 'B'] },
    { questionId: 'E2', choice: 'B', displayOrder: ['A', 'B'] },
    { questionId: 'T2', choice: 'A', displayOrder: ['A', 'B'] },
  ],
  expectedScores: { M: 50, A: 50, I: 50, G: 50, E: 50, T: 50 },
};
