import { expect } from "vitest";

// Helper function to check if arrays have same elements (ignoring order)
export function expectArraysToHaveSameElements<T>(actual: T[], expected: T[]) {
  expect(actual).toHaveLength(expected.length);
  expect(actual.sort()).toEqual(expected.sort());
}
