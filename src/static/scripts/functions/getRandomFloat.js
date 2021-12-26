/* eslint-disable */

/**
 * Get a random floating point number between `min` and `max`.
 * https://gist.github.com/kerimdzhanov/7529623
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random floating point number
 */

export function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
