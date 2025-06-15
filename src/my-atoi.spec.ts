import { expect, test } from "vitest";
import { myAtoi } from "./my-atoi";

test("atoi 42", () => {
  expect(myAtoi("42")).toBe(42);
});

test("atoi  -042", () => {
  expect(myAtoi(" -042")).toBe(-42);
});

test("atoi 1337c0d3", () => {
  expect(myAtoi("1337c0d3")).toBe(1337);
});

test("atoi 0-1", () => {
  expect(myAtoi("0-1")).toBe(0);
});

test("atoi words and 987", () => {
  expect(myAtoi("words and 987")).toBe(0);
});
