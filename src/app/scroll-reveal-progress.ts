/** Reveal across 70% of the viewport, and finish at the end of the page. */
export function scrollRevealProgress(
  top: number,
  viewportHeight: number,
  remainingScroll: number,
): number {
  const distance = Math.max(1, viewportHeight * 0.7);
  const start = viewportHeight - 40;
  const sectionProgress = (start - top) / distance;
  const pageEndProgress = 1 - remainingScroll / distance;

  return Math.max(0, Math.min(1, Math.max(sectionProgress, pageEndProgress)));
}
