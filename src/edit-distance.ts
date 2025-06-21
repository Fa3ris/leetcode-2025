export function editDistance(s1: string, s2: string): number {
  return levenshtein(s1, 0, s2, 0, new Map());
  return recursiveDist(s1, s2);
}

function recursiveDist(s1: string, s2: string): number {
  if (s1 === "") return s2.length;
  if (s2 === "") return s1.length;

  if (s1[0] === s2[0]) {
    return recursiveDist(s1.slice(1), s2.slice(1));
  }
  const insert = recursiveDist(s1, s2.slice(1));
  const delete_ = recursiveDist(s1.slice(1), s2);
  const replace = recursiveDist(s1.slice(1), s2.slice(1));

  return 1 + Math.min(insert, delete_, replace);
}

function levenshtein(
  s1: string,
  i: number,
  s2: string,
  j: number,
  memo: Map<string, number>
): number {
  const key = `${i};${j}`;

  const memoized = memo.get(key);
  if (memoized !== undefined) return memoized;

  if (i >= s1.length) return s2.length - j;
  if (j >= s2.length) return s1.length - i;

  if (s1[i] === s2[j]) {
    const result = levenshtein(s1, i + 1, s2, j + 1, memo);
    memo.set(key, result);
    return result;
  }

  const insert = levenshtein(s1, i, s2, j + 1, memo);
  const delete_ = levenshtein(s1, i + 1, s2, j, memo);
  const replace = levenshtein(s1, i + 1, s2, j + 1, memo);
  const result = 1 + Math.min(insert, delete_, replace);
  memo.set(key, result);
  return result;
}

export function levenshteinDynamicProgramming(s1: string, s2: string): number {
  const s1LengthPlusEmptyChar = s1.length + 1;
  const s2LengthPlusEmptyChar = s2.length + 1;

  // rows are s1 chars
  // cols are s2 chars
  const matrixDistancesFrom1To2: number[][] = Array.from<number>({
    length: s1LengthPlusEmptyChar,
  }).map(() => Array.from<number>({ length: s2LengthPlusEmptyChar }).fill(0));

  // first col
  // delete every char of s1 to produce empty string
  for (let i = 1; i <= s1.length; i++) {
    matrixDistancesFrom1To2[i][0] = i;
  }

  // first row
  // from empty char, insert every char of s2
  for (let j = 1; j <= s2.length; j++) {
    matrixDistancesFrom1To2[0][j] = j;
  }

  for (let row = 1; row <= s1.length; row++) {
    for (let col = 1; col <= s2.length; col++) {
      // warning row !== col
      // current "a" <-> "ab"
      // we can make them match by
      //    do nothing
      //    replace the current char
      //    insert current char of s2 to s1
      //    delete current char of s1
      //
      const previousReplace = matrixDistancesFrom1To2[row - 1][col - 1];
      const distanceBetweenPrevious = matrixDistancesFrom1To2[row - 1][col - 1];
      if (s1[row - 1] === s2[col - 1]) {
        // same char => no operation needed
        matrixDistancesFrom1To2[row][col] = distanceBetweenPrevious;
        continue;
      }
      const distanceUsingReplace = distanceBetweenPrevious + 1; // s1[row - 2] = s2[col - 2]
      const distanceUsingDelete = matrixDistancesFrom1To2[row - 1][col] + 1; // delete s1[row -2]
      const distanceUsingInsert = matrixDistancesFrom1To2[row][col - 1] + 1; // add s2[col-1] to s2 after s1[row - 1]
      matrixDistancesFrom1To2[row][col] = Math.min(
        distanceUsingDelete,
        distanceUsingReplace,
        distanceUsingInsert
      );
    }
  }

  return matrixDistancesFrom1To2[s1.length][s2.length];
}
