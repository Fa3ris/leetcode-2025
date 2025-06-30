import { describe, expect, test } from "vitest";

type Player = "X" | "O";

let countToWin: number;
let allBuckets: Map<Player, number>[];

/*
 * Same player going twice in a row -> does not pass player as argument

Moving outside of the board -> do nothing

Moving on top of another X or O -> do nothing
but then need to keep grid
or change lookup

Negative dimensions -> default to 3

Decimal values -> default to 3

Non-winnable situation, can’t win the game, stalemate -> isGridFilled()
 */

const createGameBoard = (boardDimension: number = 3) => {
  countToWin = boardDimension;
  const totalBuckets = 2 * boardDimension + 2;
  allBuckets = Array.from({ length: totalBuckets }).map(initBucket);
};

function initBucket() {
  return new Map<Player, number>([
    ["X", 0],
    ["O", 0],
  ]);
}

/**
 * This function should track a player move on the game board.
 * The player is either X or O.
 * The row and column are zero-based.
 * The function should return true if the player has won the game.
 */
const trackPlayerMove = (isX: boolean, row: number, col: number): boolean => {
  const player: Player = isX ? "X" : "O";

  const bucketIndices = [
    row, // row
    countToWin + col, // col
    row === col ? -1 : undefined, // first diagonal
    row + col === countToWin - 1 ? -2 : undefined, // second diagonal
  ].filter((i) => i !== undefined);

  for (const index of bucketIndices) {
    const bucket = allBuckets.at(index);
    bucket.set(player, bucket.get(player) + 1);
    if (bucket.get(player) >= countToWin) return true;
  }
  return false;
};

describe("tic-tac-toe", () => {
  test("X wins on 1st column", () => {
    createGameBoard();
    expect(trackPlayerMove(true, 0, 0)).toBe(false);
    expect(trackPlayerMove(false, 0, 1)).toBe(false);
    expect(trackPlayerMove(true, 1, 0)).toBe(false);
    expect(trackPlayerMove(false, 1, 1)).toBe(false);
    expect(trackPlayerMove(true, 2, 0)).toBe(true);
  });

  test("O wins on second row", () => {
    createGameBoard();

    expect(trackPlayerMove(true, 0, 0)).toBe(false);
    expect(trackPlayerMove(false, 1, 0)).toBe(false);

    expect(trackPlayerMove(true, 0, 1)).toBe(false);
    expect(trackPlayerMove(false, 1, 1)).toBe(false);

    expect(trackPlayerMove(true, 2, 0)).toBe(false);
    expect(trackPlayerMove(false, 1, 2)).toBe(true);
  });

  test("X wins on first diagonal", () => {
    createGameBoard();

    expect(trackPlayerMove(true, 0, 0)).toBe(false);
    expect(trackPlayerMove(false, 0, 1)).toBe(false);

    expect(trackPlayerMove(true, 1, 1)).toBe(false);
    expect(trackPlayerMove(false, 0, 2)).toBe(false);

    expect(trackPlayerMove(true, 2, 2)).toBe(true);
  });

  test("O wins on second diagonal", () => {
    createGameBoard();

    expect(trackPlayerMove(true, 0, 0)).toBe(false);
    expect(trackPlayerMove(false, 0, 2)).toBe(false);

    expect(trackPlayerMove(true, 0, 1)).toBe(false);
    expect(trackPlayerMove(false, 1, 1)).toBe(false);

    expect(trackPlayerMove(true, 1, 0)).toBe(false);
    expect(trackPlayerMove(false, 2, 0)).toBe(true);
  });

  test("X wins on first row in 4x4 board", () => {
    createGameBoard(4);

    expect(trackPlayerMove(true, 0, 0)).toBe(false);
    expect(trackPlayerMove(false, 1, 0)).toBe(false);

    expect(trackPlayerMove(true, 0, 1)).toBe(false);
    expect(trackPlayerMove(false, 1, 1)).toBe(false);

    expect(trackPlayerMove(true, 0, 2)).toBe(false);
    expect(trackPlayerMove(false, 1, 2)).toBe(false);

    expect(trackPlayerMove(true, 0, 3)).toBe(true);
  });
});
