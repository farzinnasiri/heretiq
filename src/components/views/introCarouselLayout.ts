export function getIntroCarouselLayout(viewportWidth: number, viewportHeight: number) {
  // Keep the cards readable on short screens; the page can scroll below that limit.
  const cardWidth = Math.max(112, Math.min(166, viewportWidth * 0.36, viewportHeight * 0.2));
  const cardHeight = cardWidth * 234 / 166;
  const radius = cardWidth * 2;
  const perspective = 1200;
  const frontLift = 12;
  const frontScale = 1.06;

  // A rotating corner can be closer to the viewer than the center of the front card.
  // Reserve its projected height plus 12px of clearance above and below the cards.
  const nearestDepth = Math.hypot(radius + frontLift, cardWidth * frontScale / 2);
  const stageHeight = Math.ceil(cardHeight * frontScale * perspective / (perspective - nearestDepth)) + 24;

  return { cardWidth, cardHeight, radius, perspective, frontLift, frontScale, stageHeight };
}
