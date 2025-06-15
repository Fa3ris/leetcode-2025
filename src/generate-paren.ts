export function generateParenthesis(n: number): string[] {
  if (n > 1) {
    return generateParenthesis(n - 1).flatMap((parenList) =>
      addParen(parenList)
    );
  }
  return ["()"];
}

function addParen(pattern: string): string[] {
  const res: string[] = [];

  // add closing paren only after all previous pairs have already been closed
  let count = 0;

  for (let i = 0; i < pattern.length; i++) {
    if (count === 0)
      res.push(`(${pattern.substring(0, i)})${pattern.substring(i)}`);

    if (pattern[i] === "(") {
      count++;
    } else if (pattern[i] === ")") {
      count--;
    }
  }

  res.push(`(${pattern})`);

  return res;
}
