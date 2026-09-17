import { describe, expect, it } from 'vitest';
import { getIntroCarouselLayout } from './introCarouselLayout';

describe('intro carousel layout', () => {
  it('keeps rotating card corners inside the reserved stage across viewport sizes', () => {
    const widths = [320, 360, 375, 390, 412, 430, 568, 640, 768, 900, 1023, 1024, 1280, 1440];
    const heights = [320, 375, 568, 667, 699, 700, 740, 844, 932, 1024];

    for (const width of widths) {
      for (const height of heights) {
        const layout = getIntroCarouselLayout(width, height);
        let furthestVerticalCorner = 0;

        // Check the actual corner projection as the card rotates and its front
        // emphasis interpolates. The old fixed 200/240px stages fail this bound.
        for (let degrees = -90; degrees <= 90; degrees += 1) {
          const angle = degrees * Math.PI / 180;
          for (const emphasis of [0, 0.25, 0.5, 0.75, 1]) {
            const scale = 1 + (layout.frontScale - 1) * emphasis;
            const depth = layout.radius + layout.frontLift * emphasis;
            for (const side of [-1, 1]) {
              const x = side * layout.cardWidth * scale / 2;
              const z = depth * Math.cos(angle) - x * Math.sin(angle);
              const projectedY = layout.cardHeight * scale / 2 * layout.perspective / (layout.perspective - z);
              furthestVerticalCorner = Math.max(furthestVerticalCorner, projectedY);
            }
          }
        }

        expect(furthestVerticalCorner, `${width}x${height}: card enters heading or controls`)
          .toBeLessThanOrEqual(layout.stageHeight / 2 - 12);

        const frontWidth = layout.cardWidth * layout.frontScale * layout.perspective
          / (layout.perspective - layout.radius - layout.frontLift);
        expect(frontWidth, `${width}x${height}: front card clips at viewport edge`).toBeLessThan(width - 28);
        expect(layout.cardWidth).toBeGreaterThanOrEqual(112);
      }
    }
  });

  it('does not jump at former mobile, height, or desktop cutoffs', () => {
    for (const [width, height] of [[390, 700], [640, 844], [900, 768], [1024, 768]]) {
      const layout = getIntroCarouselLayout(width, height);
      const narrower = getIntroCarouselLayout(width - 1, height);
      const shorter = getIntroCarouselLayout(width, height - 1);
      expect(Math.abs(layout.stageHeight - narrower.stageHeight)).toBeLessThanOrEqual(1);
      expect(Math.abs(layout.stageHeight - shorter.stageHeight)).toBeLessThanOrEqual(1);
    }
  });
});
