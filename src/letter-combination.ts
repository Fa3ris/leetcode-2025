const LETTERS_FOR = {
  "2": ["a", "b", "c"],
  "3": ["d", "e", "f"],
  "4": ["g", "h", "i"],
  "5": ["j", "k", "l"],
  "6": ["m", "n", "o"],
  "7": ["p", "q", "r", "s"],
  "8": ["t", "u", "v"],
  "9": ["w", "x", "y", "z"],
};
export function letterCombinations(digits: string): string[] {
  if (digits.length === 0) return [];
  if (digits.length === 1) return LETTERS_FOR[digits.at(0)];

  const suffixes = letterCombinations(digits.slice(1));

  const res = LETTERS_FOR[digits.at(0)].flatMap((letter: string) =>
    suffixes.map((letters) => letter + letters)
  );
  return res;
}
