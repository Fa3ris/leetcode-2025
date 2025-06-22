import { describe, expect, it } from "vitest";

const maxInteger = 2 ** 31 - 1;
const minInteger = -(2 ** 31);

function divide(dividend: number, divisor: number): number {
  if (divisor === 1) {
    return dividend;
  }

  // Handle the problematic case directly
  if (dividend === minInteger && divisor === minInteger) {
    return 1;
  }
  const signDividend = Math.sign(dividend);
  const signDivisor = Math.sign(divisor);

  dividend = Math.abs(dividend);
  divisor = Math.abs(divisor);
  let quotient = 0;
  while (dividend >= divisor) {
    let powerOf2 = 0;

    // try to substract divisor, 2 * divisor, 4 * divisor, 8 * divisor, without overflowing
    let testDivisor = divisor << (powerOf2 + 1);

    while (
      dividend >= testDivisor &&
      testDivisor < maxInteger &&
      testDivisor > 0
    ) {
      powerOf2++;
      testDivisor = divisor << (powerOf2 + 1);
    }

    dividend -= divisor << powerOf2;
    quotient += 1 << powerOf2;
  }
  quotient = Math.min(maxInteger, quotient);
  quotient = Math.max(minInteger, quotient);
  return signDividend === signDivisor ? quotient : -quotient;
}

describe("divide 32 bit integers", () => {
  it("10 / 3 = 3", () => {
    expect(divide(10, 3)).toBe(3);
  });
  it("7 / (-3) = -2", () => {
    expect(divide(7, -3)).toBe(-2);
  });
  it("2_147_483_647 / 1 = 2_147_483_647", () => {
    expect(divide(2_147_483_647, 1)).toBe(2_147_483_647);
  });
  it("-2147483648 / 2 = 2_147_483_647", () => {
    expect(divide(-2_147_483_648, 2)).toBe(-1_073_741_824);
  });

  it("-2147483648 / -2147483648", () => {
    expect(divide(-2_147_483_648, -2_147_483_648)).toBe(1);
  });
});
