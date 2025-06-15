// just follow the specs!!!
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

  const res = Number(pattern) * sign;

  return res < 0 ? Math.max(-(2 ** 31), res) : Math.min(res, 2 ** 31 - 1);
}
