import { describe, expect, test } from "vitest";
import { kSmallestPairs } from "./k-smallest-sums";

describe("k smallest sums", () => {
  test("1", () => {
    expect(kSmallestPairs([1, 7, 11], [2, 4, 6], 3)).toStrictEqual([
      [1, 2],
      [1, 4],
      [1, 6],
    ]);
  });
});
