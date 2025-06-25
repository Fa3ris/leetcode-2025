import { describe, expect, test } from "vitest";

const startPoints = [
  { row: 0, col: 0 },
  { row: 0, col: 3 },
  { row: 0, col: 6 },
  { row: 3, col: 0 },
  { row: 3, col: 3 },
  { row: 3, col: 6 },
  { row: 6, col: 0 },
  { row: 6, col: 3 },
  { row: 6, col: 6 },
];

function isValidSudoku(board: string[][]): boolean {
  for (let row = 0; row < 9; row++) {
    const valuesSeen = new Set<string>();
    for (let col = 0; col < 9; col++) {
      const cell = board[row][col];

      if (cell === ".") continue;
      if (valuesSeen.has(cell)) return false;
      valuesSeen.add(cell);
    }
  }

  for (let col = 0; col < 9; col++) {
    const valuesSeen = new Set<string>();
    for (let row = 0; row < 9; row++) {
      const cell = board[row][col];
      if (cell === ".") continue;
      if (valuesSeen.has(cell)) return false;
      valuesSeen.add(cell);
    }
  }

  for (const { row: startRow, col: startCol } of startPoints) {
    const valuesSeen = new Set<string>();
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cell = board[startRow + row][startCol + col];
        if (cell === ".") continue;
        if (valuesSeen.has(cell)) return false;
        valuesSeen.add(cell);
      }
    }
  }
  return true;
}

describe("valid sudoku", () => {
  test("valid", () => {
    const board = [
      ["5", "3", ".", ".", "7", ".", ".", ".", "."],
      ["6", ".", ".", "1", "9", "5", ".", ".", "."],
      [".", "9", "8", ".", ".", ".", ".", "6", "."],
      ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
      ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
      ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
      [".", "6", ".", ".", ".", ".", "2", "8", "."],
      [".", ".", ".", "4", "1", "9", ".", ".", "5"],
      [".", ".", ".", ".", "8", ".", ".", "7", "9"],
    ];
    expect(isValidSudoku(board)).toBe(true);
  });

  test("invalid", () => {
    const board = [
      ["8", "3", ".", ".", "7", ".", ".", ".", "."],
      ["6", ".", ".", "1", "9", "5", ".", ".", "."],
      [".", "9", "8", ".", ".", ".", ".", "6", "."],
      ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
      ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
      ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
      [".", "6", ".", ".", ".", ".", "2", "8", "."],
      [".", ".", ".", "4", "1", "9", ".", ".", "5"],
      [".", ".", ".", ".", "8", ".", ".", "7", "9"],
    ];

    expect(isValidSudoku(board)).toBe(false);
  });

  test("description", () => {
    // test body
    const board = [
      [".", ".", ".", ".", "5", ".", ".", "1", "."],
      [".", "4", ".", "3", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", "3", ".", ".", "1"],
      ["8", ".", ".", ".", ".", ".", ".", "2", "."],
      [".", ".", "2", ".", "7", ".", ".", ".", "."],
      [".", "1", "5", ".", ".", ".", ".", ".", "."],
      [".", ".", ".", ".", ".", "2", ".", ".", "."],
      [".", "2", ".", "9", ".", ".", ".", ".", "."],
      [".", ".", "4", ".", ".", ".", ".", ".", "."],
    ];
    expect(isValidSudoku(board)).toBe(false);
  });
});
