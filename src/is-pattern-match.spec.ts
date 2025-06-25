/**
Let's write a function with the following signature:

bool isMatch(string pattern, string word)

This function returns true if (and only if) `word` is a complete match for `pattern`.

If pattern contains only letters, this function should just do a string comparison:

isMatch("datadog", "datadog") => true
isMatch("datadog", "datadogs") => false

If `pattern` contains a number, we'll treat it as a wildcard. In the number's position, a matching `word` can contain any letters, as long as there are as many letters as the number.

isMatch("d3dog", "datadog") => true
isMatch("d3dog", "dtdog") => false
*/

import { describe, test, expect } from "vitest";

export function isMatch(pattern: string, word: string): boolean {
  let patternIndex = 0;
  let wordIndex = 0;

  while (patternIndex < pattern.length) {
    const patternChar = pattern.charAt(patternIndex);
    const maybeWildCard = Number(patternChar);
    if (Number.isNaN(maybeWildCard)) {
      const wordChar = word.charAt(wordIndex);
      if (patternChar !== wordChar) return false;
    } else {
      const startOfNumber = patternIndex;
      let endOfNumber = startOfNumber + 1;
      let possibleNumber = Number(pattern.charAt(endOfNumber));

      while (endOfNumber < pattern.length && !Number.isNaN(possibleNumber)) {
        endOfNumber++;
        possibleNumber = Number(pattern.charAt(endOfNumber));
        patternIndex++;
      }

      const wildCard = Number(pattern.substring(startOfNumber, endOfNumber));
      wordIndex += wildCard - 1;
      if (wordIndex >= word.length) return false;
    }
    patternIndex++;
    wordIndex++;
  }

  return patternIndex === pattern.length && wordIndex === word.length;
}

describe("isMatch", () => {
  test("should match", () => {
    expect(isMatch("datadog", "datadog")).toBe(true);
  });

  test("should not match", () => {
    expect(isMatch("datadog", "datadogs")).toBe(false);
  });
  test("should match wildcard", () => {
    expect(isMatch("3", "aaa")).toBe(true);
  });

  test("should not match wildcard", () => {
    expect(isMatch("3", "aa")).toBe(false);
  });

  test("should match wildcard within word", () => {
    expect(isMatch("d3dog", "datadog")).toBe(true);
  });

  test("should match 4 aaaa", () => {
    expect(isMatch("4", "aaaa")).toBe(true);
  });

  test("should not match a3 abc", () => {
    expect(isMatch("a3", "abc")).toBe(false);
  });

  test("wildcard on multiple locations", () => {
    expect(isMatch("a3", "abcde")).toBe(false);

    expect(isMatch("4dog", "datadog")).toBe(true);
    expect(isMatch("data3", "datadog")).toBe(true);
    expect(isMatch("4d2", "datadog")).toBe(true);
  });

  test("wildcard has multiple digits", () => {
    expect(isMatch("a11y", "accessibility")).toBe(true);
    expect(isMatch("a11y", "army")).toBe(false);
    expect(isMatch("f11", "functionally")).toBe(true);
    expect(isMatch("10", "chartreuse")).toBe(true);
  });
});
