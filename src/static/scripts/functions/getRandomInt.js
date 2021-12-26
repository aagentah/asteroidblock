/* eslint-disable */

/**
 * Get a random integer between `min` and `max`.
 * https://gist.github.com/kerimdzhanov/7529623
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random integer
 */

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
