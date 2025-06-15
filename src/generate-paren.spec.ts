import { expect, test } from "vitest";
import { generateParenthesis } from "./generate-paren";

test("paren 1", () => {
  expect(generateParenthesis(1)).toStrictEqual(["()"]);
});

test("paren 2", () => {
  expectArraysToHaveSameElements(generateParenthesis(2), ["()()", "(())"]);
});

// Helper function to check if arrays have same elements (ignoring order)
function expectArraysToHaveSameElements<T>(actual: T[], expected: T[]) {
  expect(actual).toHaveLength(expected.length);
  expect(actual.sort()).toEqual(expected.sort());
}

test("paren 3", () => {
  const res = generateParenthesis(3);

  expectArraysToHaveSameElements(res, [
    "((()))",
    "(()())",
    "(())()",
    "()(())",
    "()()()",
  ]);
});
