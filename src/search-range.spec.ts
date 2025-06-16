import { test, expect } from "vitest";
import { searchRange } from "./search-range";

test("empty array", () => {
  expect(searchRange([], 0)).toStrictEqual([-1, -1]);
});

test("not in array", () => {
  expect(searchRange([5, 7, 7, 8, 8, 10], 6)).toStrictEqual([-1, -1]);
});

test("target 8", () => {
  expect(searchRange([5, 7, 7, 8, 8, 10], 8)).toStrictEqual([3, 4]);
});

test("only 8", () => {
  expect(searchRange([8, 8, 8, 8, 8, 8], 8)).toStrictEqual([0, 5]);
});
