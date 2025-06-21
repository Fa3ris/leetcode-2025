import { describe, expect, test } from "vitest";
import { editDistance, levenshteinDynamicProgramming } from "./edit-distance";

describe("edit distance", () => {
  test("same char", () => {
    expect(editDistance("a", "a")).toBe(0);
  });
  test("replace char", () => {
    expect(editDistance("a", "b")).toBe(1);
  });
  test("delete char", () => {
    expect(editDistance("ab", "a")).toBe(1);
  });
  test("add char", () => {
    expect(editDistance("a", "ab")).toBe(1);
  });
  test("add char", () => {
    expect(levenshteinDynamicProgramming("a", "ab")).toBe(1);
  });

  test("delete char", () => {
    expect(levenshteinDynamicProgramming("ab", "a")).toBe(1);
  });
  test("empty strings", () => {
    expect(levenshteinDynamicProgramming("", "")).toBe(0);
  });

  test("single delete", () => {
    expect(levenshteinDynamicProgramming("a", "")).toBe(1);
  });

  test("multiple deletes", () => {
    expect(levenshteinDynamicProgramming("abc", "")).toBe(3);
  });
  test("single add", () => {
    expect(levenshteinDynamicProgramming("", "a")).toBe(1);
  });

  test("multiple adds", () => {
    expect(levenshteinDynamicProgramming("", "abc")).toBe(3);
  });
  test("empty strings", () => {
    expect(editDistance("", "")).toBe(0);
  });

  test("empty to non-empty", () => {
    expect(editDistance("", "abc")).toBe(3);
  });
  test("non-empty to empty", () => {
    expect(editDistance("abc", "")).toBe(3);
  });

  // Same length strings
  test("completely different same length", () => {
    expect(editDistance("abc", "xyz")).toBe(3);
  });

  test("partially different same length", () => {
    expect(editDistance("abc", "axc")).toBe(1);
  });

  test("intention to execution", () => {
    expect(editDistance("intention", "execution")).toBe(5);
  });

  test("one char vs multiple", () => {
    expect(editDistance("a", "abcd")).toBe(3);
  });

  test("multiple vs one char", () => {
    expect(editDistance("abcd", "a")).toBe(3);
  });

  test("all same to all different", () => {
    expect(editDistance("aaaa", "bbbb")).toBe(4);
  });

  test("reverse strings", () => {
    expect(editDistance("abc", "cba")).toBe(2);
  });

  test("single substitution needed", () => {
    expect(editDistance("cat", "bat")).toBe(1);
  });

  test("single insertion needed", () => {
    expect(editDistance("ple", "pale")).toBe(1);
    expect(editDistance("pale", "ple")).toBe(1);
  });

  test("single insertion needed", () => {
    expect(editDistance("pales", "pale")).toBe(1);
  });

  test("single insertion needed", () => {
    expect(editDistance("pale", "bale")).toBe(1);
  });

  test("single insertion needed", () => {
    expect(editDistance("pale", "bake")).toBe(2);
  });

  // Classic examples
  test("horse to ros", () => {
    expect(editDistance("horse", "ros")).toBe(3);
    // h->r, remove r, remove e
  });

  // Classic examples
  test("horse to ros", () => {
    expect(levenshteinDynamicProgramming("horse", "ros")).toBe(3);
    // h->r, remove r, remove e
  });
});
