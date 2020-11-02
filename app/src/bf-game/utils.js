/**
 * @file Utility functions.
 */

export function times(n, value) {
  return Array.from(Array(n)).map(() => value);
}

/** Returns a shuffled version of an array using the Fisher-Yates algorithm. */
export function shuffle(array) {
  const resultArray = array.slice();
  for (let i = resultArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = resultArray[i];
    resultArray[i] = resultArray[j];
    resultArray[j] = temp;
  }
  return resultArray;
}
