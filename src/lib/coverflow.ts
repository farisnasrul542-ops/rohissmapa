/** Shared geometry keeps agenda and gallery depth consistent as content changes. */
export function getCoverflowState(
  index: number,
  activeIndex: number,
  count: number,
  drag = 0,
  reducedMotion = false,
) {
  const active = count > 0 ? ((activeIndex % count) + count) % count : 0;
  let distance = count > 0 ? (index - active + count) % count : 0;
  if (distance > count / 2) distance -= count;

  const isCenter = count > 0 && distance === 0;
  const isLeft = distance === -1;
  const isRight = distance === 1;
  const isVisible = count > 0 && (isCenter || isLeft || isRight);
  const position = isCenter ? "center" : isLeft ? "left" : isRight ? "right" : "hidden";
  const offset = reducedMotion ? 0 : drag;
  const angle = reducedMotion ? 0 : (offset / 300) * 6;

  let transform = `translate3d(${offset}px, 0, ${reducedMotion ? 0 : 48}px) rotateY(${angle}deg)`;
  if (!isCenter) {
    const sign = distance < 0 ? -1 : 1;
    const translation = isVisible ? "var(--showcase-offset, 68%)" : "110%";
    transform = reducedMotion
      ? `translateX(calc(${sign} * ${translation})) scale(.9)`
      : `translate3d(calc(${sign} * ${translation} + ${offset * .55}px), 12px, -105px) rotateY(${-sign * 22 + angle}deg) scale(.9)`;
  }

  return { active, distance, position, isCenter, isLeft, isRight, isVisible, transform };
}
