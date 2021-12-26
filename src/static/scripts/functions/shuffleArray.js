/* eslint-disable */

// Shuffle an array
// http://www.jstips.co/en/shuffle-an-array/
export function shuffleArray(arr) {
  let i, j, temp;
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}
