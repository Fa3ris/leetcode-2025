import { describe, expect, it } from "vitest";
import { LRUCache } from "./lru";

describe("lru", () => {
  it("produces expected results", () => {
    const capacity = 2;
    const inputs = [
      { put: [1, 1] },
      { put: [2, 2] },
      { get: 1 },
      { put: [3, 3] },

      { get: 2 },

      { put: [4, 4] },

      { get: 1 },

      { get: 3 },

      { get: 4 },
    ];

    const expected = [
      undefined,
      undefined,
      1,
      undefined,
      -1,
      undefined,
      -1,
      3,
      4,
    ];

    const lru = new LRUCache(capacity);

    const results = [];
    for (const input of inputs) {
      const [op, arg] = Object.entries(input)[0];

      const res = lru[op].apply(lru, Array.isArray(arg) ? arg : [arg]);
      results.push(res);
    }

    expect(results).toStrictEqual(expected);
  });
});
