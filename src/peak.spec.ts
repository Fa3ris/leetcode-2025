import { expect, test } from "vitest";

function findPeakElement(nums: number[]): number {
  if (nums.length === 1) return 0;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < nums[i - 1]) {
      return i - 1;
    }
  }
  // if ever increasing the peak is the last element since nums[nums.lenth] = -Infinity
  return nums.length - 1;
}

test("description", () => {
  expect(findPeakElement([1, 2, 3, 1])).toBe(2);
});

test("description", () => {
  expect(findPeakElement([1, 2, 1, 3, 5, 6, 4])).toBe(1);
});
