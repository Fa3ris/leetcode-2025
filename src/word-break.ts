export function wordBreak(s: string, wordDict: string[]): boolean {
  const set = new Set(wordDict);
  const resolvedBreakdown = new Map<number, boolean>();
  return canBreakWord(s, set, 0, 1, resolvedBreakdown);
}

function canBreakWord(
  s: string,
  set: Set<string>,
  start: number,
  end: number,
  resolvedBreakdown: Map<number, boolean>
): boolean {
  const memo = resolvedBreakdown.get(start);
  if (memo !== undefined) return memo;
  if (start >= s.length) {
    // no more word to break down
    resolvedBreakdown.set(start, true);
    return true;
  }

  if (end > s.length) {
    // cannot complete last word
    resolvedBreakdown.set(start, false);
    return false;
  }

  const testWord = s.substring(start, end);
  if (testWord.length > 20) {
    resolvedBreakdown.set(start, false);
    return false;
  }

  return (
    (set.has(testWord) &&
      canBreakWord(s, set, end, end + 1, resolvedBreakdown)) ||
    canBreakWord(s, set, start, end + 1, resolvedBreakdown)
  );
}
