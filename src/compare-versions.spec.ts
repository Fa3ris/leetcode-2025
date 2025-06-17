import { test, expect } from "vitest";
import { compareVersion } from "./compare-versions";

test("compare versions", () => {
  expect(compareVersion("1.2", "1.10")).toBe(-1);
});

test("compare versions", () => {
  expect(compareVersion("1.01", "1.001")).toBe(0);
});
