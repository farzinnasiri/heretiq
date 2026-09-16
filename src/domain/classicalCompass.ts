import { Scores, ClassicalCompassResult, ClassicalQuadrant, Classical1DSpectrum } from './types';

/**
 * Calculates traditional 2-axis Political Compass coordinates and 1D spectrum placement
 * from HERETIQ's 6-dimensional scoring vector.
 *
 * Coordinates:
 * - Economic X: -10.0 (Far-Left / Collectivist) to +10.0 (Far-Right / Free Market)
 * - Social Y:   -10.0 (Libertarian / Civil Autonomy) to +10.0 (Authoritarian / Social Order)
 */
export function calculateClassicalCompass(scores: Scores): ClassicalCompassResult {
  const m = scores.M ?? 50; // Markets vs Public Delivery (0 = 100% Public, 100 = 100% Market)
  const e = scores.E ?? 50; // Equity vs Merit (0 = 100% Merit, 100 = 100% Universal floor)
  const a = scores.A ?? 50; // Autonomy vs Authority (0 = 100% Authority, 100 = 100% Autonomy)
  const i = scores.I ?? 50; // Institutions vs Distributed (0 = 100% Distributed, 100 = 100% Institutions)

  // 1. Economic Score X: Markets (M) + Anti-Equity (100 - E)
  // When M=0 and E=100 -> xRaw = 0 -> X = -10 (Far Left)
  // When M=100 and E=0 -> xRaw = 100 -> X = +10 (Far Right)
  const xRaw = (m + (100 - e)) / 2;
  const economicScore = Math.round(((xRaw - 50) / 5) * 10) / 10;

  // 2. Social / Authority Score Y: Anti-Autonomy (100 - A) [75%] + Institutions (I) [25%]
  // When A=0 (Order) and I=100 (Formal state) -> yRaw = 100 -> Y = +10 (Authoritarian)
  // When A=100 (Autonomy) and I=0 (Decentralized) -> yRaw = 0 -> Y = -10 (Libertarian)
  const yRaw = (100 - a) * 0.75 + i * 0.25;
  const socialScore = Math.round(((yRaw - 50) / 5) * 10) / 10;

  // 3. 1D Spectrum Classification (Left to Right)
  let spectrum1D: Classical1DSpectrum;
  let spectrum1DLabel: string;

  if (economicScore <= -6.0) {
    spectrum1D = 'far-left';
    spectrum1DLabel = 'Far-Left';
  } else if (economicScore <= -2.2) {
    spectrum1D = 'left';
    spectrum1DLabel = 'Left-Wing';
  } else if (economicScore <= -0.8) {
    spectrum1D = 'center-left';
    spectrum1DLabel = 'Center-Left';
  } else if (economicScore < 0.8) {
    spectrum1D = 'center';
    spectrum1DLabel = 'Centrist';
  } else if (economicScore < 2.2) {
    spectrum1D = 'center-right';
    spectrum1DLabel = 'Center-Right';
  } else if (economicScore < 6.0) {
    spectrum1D = 'right';
    spectrum1DLabel = 'Right-Wing';
  } else {
    spectrum1D = 'far-right';
    spectrum1DLabel = 'Far-Right';
  }

  // 4. Quadrant Determination
  let quadrant: ClassicalQuadrant;
  let quadrantTitle: string;

  const isEconCenter = Math.abs(economicScore) < 1.8;
  const isSocialCenter = Math.abs(socialScore) < 1.8;

  if (isEconCenter && isSocialCenter) {
    quadrant = 'centrist';
    quadrantTitle = 'Centrist / Syncretic';
  } else if (socialScore >= 1.8 && economicScore <= -1.8) {
    quadrant = 'authoritarian-left';
    quadrantTitle = 'Authoritarian Left';
  } else if (socialScore >= 1.8 && economicScore >= 1.8) {
    quadrant = 'authoritarian-right';
    quadrantTitle = 'Authoritarian Right';
  } else if (socialScore <= -1.8 && economicScore <= -1.8) {
    quadrant = 'libertarian-left';
    quadrantTitle = 'Libertarian Left';
  } else if (socialScore <= -1.8 && economicScore >= 1.8) {
    quadrant = 'libertarian-right';
    quadrantTitle = 'Libertarian Right';
  } else if (socialScore >= 1.8) {
    quadrant = economicScore >= 0 ? 'authoritarian-right' : 'authoritarian-left';
    quadrantTitle = economicScore >= 0 ? 'Authoritarian Center-Right' : 'Authoritarian Center-Left';
  } else if (socialScore <= -1.8) {
    quadrant = economicScore >= 0 ? 'libertarian-right' : 'libertarian-left';
    quadrantTitle = economicScore >= 0 ? 'Libertarian Center-Right' : 'Libertarian Center-Left';
  } else {
    // Social is centered, economic is non-centered
    quadrant = economicScore >= 0 ? 'authoritarian-right' : 'libertarian-left';
    quadrantTitle = economicScore >= 0 ? 'Center-Right Market' : 'Center-Left Public';
  }

  // 5. Plain English Explanation
  const econText =
    economicScore <= -2.2
      ? 'public provisioning and wealth equalization'
      : economicScore >= 2.2
      ? 'market competition and incentive-based merit'
      : 'a balance between market delivery and safety nets';

  const socialText =
    socialScore <= -2.2
      ? 'personal autonomy and civil decentralization'
      : socialScore >= 2.2
      ? 'institutional cohesion and social order'
      : 'measured institutional oversight';

  const explanation = `In the classical framework, your choices align with ${econText}, paired with ${socialText}.`;

  return {
    economicScore,
    socialScore,
    quadrant,
    quadrantTitle,
    spectrum1D,
    spectrum1DLabel,
    explanation,
  };
}
