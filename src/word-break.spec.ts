import { expect, test } from "vitest";
import { wordBreak } from "./word-break";

test("word break 1", () => {
  expect(wordBreak("leetcode", ["leet", "code"])).toBe(true);
});

test("word break 2", () => {
  expect(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"])).toBe(
    false
  );
});

test("word break 3", () => {
  expect(wordBreak("applepenapple", ["apple", "pen"])).toBe(true);
});

test("word break 4", () => {
  expect(wordBreak("aaaaaaa", ["aaaa", "aaa"])).toBe(true);
});

test("word break 5", () => {
  expect(wordBreak("abcd", ["a", "abc", "b", "cd"])).toBe(true);
});
