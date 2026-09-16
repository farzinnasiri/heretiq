export type Dimension = 'M' | 'A' | 'I' | 'G' | 'E' | 'T';

export type Choice = 'A' | 'B' | 'skip';

export type Scores = Record<Dimension, number | null>;
export type Coverage = Record<Dimension, number>;

export interface Question {
  id: string;
  dimension: Dimension;
  phase: 'core' | 'optional';
  context: string;
  prompt: string;
  choices: { A: string; B: string };
  positiveChoice: 'A' | 'B';
  discrimination: number; // 1.2
  threshold: number; // 0
}

export interface PresentedItem {
  questionId: string;
  choice: Choice | null;
  displayOrder: ['A', 'B'] | ['B', 'A'];
}

export interface Run {
  modelVersion: '0.1';
  renderVersion: '1';
  visualSeed: number;
  presented: PresentedItem[];
}

export interface SharedCardResult {
  schema: 1;
  modelVersion: '0.1';
  renderVersion: '1';
  scores: Scores;
  coverage: Coverage;
  visualSeed: number;
  answers?: Record<string, Choice>;
}

export interface Exemplar {
  name: string;
  role: string;
  wikipediaUrl: string;
  thumbnailUrl?: string;
}

export type ClassicalQuadrant =
  | 'authoritarian-left'
  | 'authoritarian-right'
  | 'libertarian-left'
  | 'libertarian-right'
  | 'centrist';

export type Classical1DSpectrum =
  | 'far-left'
  | 'left'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'right'
  | 'far-right';

export interface ClassicalCompassResult {
  economicScore: number; // -10 to +10
  socialScore: number;   // -10 to +10
  quadrant: ClassicalQuadrant;
  quadrantTitle: string;
  spectrum1D: Classical1DSpectrum;
  spectrum1DLabel: string;
  explanation: string;
}

export interface Archetype {
  id: string;
  code: string;
  title: string;
  personaName?: string;
  prototype: Record<Dimension, number>;
  description: string;
  cardImagePath?: string;
  cardColor?: string;
  exemplars?: Exemplar[];
}

export interface Tension {
  id: string;
  copy: string;
  requiredAnswers: Array<{ questionId: string; choice: 'A' | 'B' }>;
}

export interface Heresy {
  questionId: string;
  chosenAnswerText: string;
  poleLabel: string;
  copy: string;
}

export interface Foil {
  archetype: Archetype;
  gapDimensions: [Dimension, Dimension];
  gapDetails: Array<{ dimension: Dimension; gap: number; userScore: number; foilScore: number; dimensionName: string }>;
}

export interface DimensionMeta {
  id: Dimension;
  name: string;
  score0End: string;
  score100End: string;
  whatItDescribes: string;
  whatItDoesNotEstablish: string;
  shareLineLow: string;
  shareLineHigh: string;
  strongTraitLow: string;
  strongTraitHigh: string;
  publicName: string;
}
