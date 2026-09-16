export function motionDuration(reduceMotion: boolean, duration: number) {
  return reduceMotion ? 0 : duration;
}

export function motionStartValue(reduceMotion: boolean, animatedValue: number) {
  return reduceMotion ? 1 : animatedValue;
}
