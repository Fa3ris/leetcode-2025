// just follow the specs!!!


const MAX_INT = 2 ** 31 - 1;
const MIN_INT = -(2 ** 31);
export function myAtoi(s: string): number {
  const notWhitespace = s.search(/\S/);

  s = s.substring(notWhitespace);

  let sign = 1;
  if (s.startsWith("+")) {
    s = s.substring(1);
  } else if (s.startsWith("-")) {
    s = s.substring(1);
    sign = -1;
  }

  if (/\D/.test(s.at(0))) {
    return 0;
  }

  const firstNonDigitAfterNumber = s.search(/\D/);

  const pattern =
    firstNonDigitAfterNumber > -1
      ? s.substring(0, firstNonDigitAfterNumber)
      : s;

  const res = stringToInteger(pattern) * sign;

  return Math.min(Math.max(MIN_INT, res), MAX_INT);
}

function stringToInteger(s: string): number {
  let num = 0;

  // ascii '0' is 48
  for (const digit of s.split("").map((c) => c.charCodeAt(0) - 48)) {
    num *= 10;
    num += digit;
  }

  return num;
}
