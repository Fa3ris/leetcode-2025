import { test } from "vitest";

import { expectArraysToHaveSameElements } from "./test-util";
import { letterCombinations } from "./letter-combination";

test("combination 23", () => {
  expectArraysToHaveSameElements(letterCombinations("23"), [
    "ad",
    "ae",
    "af",
    "bd",
    "be",
    "bf",
    "cd",
    "ce",
    "cf",
  ]);
});

test("combination ''", () => {
  expectArraysToHaveSameElements(letterCombinations(""), []);
});

test("combination '2'", () => {
  expectArraysToHaveSameElements(letterCombinations("2"), ["a", "b", "c"]);
});
