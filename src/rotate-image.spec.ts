import { expect, test } from "vitest";

/**
 Do not return anything, modify matrix in-place instead.
 rotate matrix 90 degrees clock wise
 */
function rotate(matrix: number[][]): void {
  const n = matrix.length - 1;

  const upperDiag = Math.ceil(n / 2);

  for (let diagonal = 0; diagonal < upperDiag; diagonal++) {
    const top = diagonal;
    const left = diagonal;
    const right = n - diagonal;
    const bottom = n - diagonal;
    const topLeft = [top, left];
    const topRight = [top, right];
    const bottomRight = [bottom, right];
    const bottomLeft = [bottom, left];
    for (let line = 0; line < n - 2 * diagonal; line++) {
      const temp = matrix[topLeft[0]][topLeft[1]];
      matrix[topLeft[0]][topLeft[1]] = matrix[bottomLeft[0]][bottomLeft[1]];
      matrix[bottomLeft[0]][bottomLeft[1]] =
        matrix[bottomRight[0]][bottomRight[1]];
      matrix[bottomRight[0]][bottomRight[1]] = matrix[topRight[0]][topRight[1]];
      matrix[topRight[0]][topRight[1]] = temp;

      topLeft[1]++;
      topRight[0]++;
      bottomRight[1]--;
      bottomLeft[0]--;
    }
  }
}

test("3x3 matrix", () => {
  const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  rotate(matrix);

  const expected = [
    [7, 4, 1],
    [8, 5, 2],
    [9, 6, 3],
  ];
  expect(matrix).toStrictEqual(expected);
});

test("4x4", () => {
  const mat = [
    [5, 1, 9, 11],
    [2, 4, 8, 10],
    [13, 3, 6, 7],
    [15, 14, 12, 16],
  ];
  const expected = [
    [15, 13, 2, 5],
    [14, 3, 4, 1],
    [12, 6, 8, 9],
    [16, 7, 10, 11],
  ];

  rotate(mat);
  expect(mat).toStrictEqual(expected);
});
