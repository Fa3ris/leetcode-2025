function maxAdjacentDistance(nums: number[]): number {
  const absolutes = nums.map((_, index, array) =>
    index === 0
      ? Math.abs(array[0] - array.at(-1)!)
      : Math.abs(array[index] - array[index - 1])
  );

  return Math.max(...absolutes);
}

/**
 * Definition for singly-linked list.
 */

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}
function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  const headRes = new ListNode();

  let resNode = headRes;

  let node1 = l1;
  let node2 = l2;
  let carry = 0;

  while (true) {
    let sum = node1.val + node2.val + carry;
    carry = 0;

    if (sum >= 10) {
      sum -= 10;
      carry = 1;
    }

    resNode.val = sum;

    if (node1.next === null && node2.next === null && carry === 0) {
      return headRes;
    }

    node1 = node1.next ?? new ListNode();
    node2 = node2.next ?? new ListNode();

    resNode.next = new ListNode();

    resNode = resNode.next;
  }
}

export function longestPalindrome(s: string): string {
  let best = "";

  // iterate from the longest to shortest substrings
  // the first valid found is the best

  // or yor you can start from short to longest (which is dumb a posteriori)
  // stop when you reach a substring that is shorter than your current best
  for (let length = s.length; length >= 0; length--) {
    for (let start = 0; start <= s.length - length; start++) {
      const test = s.slice(start, start + length);

      if (isPalindrome(test) && test.length > best.length) {
        return test;
      }
    }
  }

  return best;
}

function isPalindrome(s: string): boolean {
  let i = 0;
  let j = s.length - 1;

  while (i < j) {
    if (s.charAt(i) !== s.charAt(j)) {
      return false;
    }
    i++;
    j--;
  }
  return true;
}

export function convert(s: string, numRows: number): string {
  if (numRows === 1) return s;
  const res: string[] = [];
  const roundtripLength = (numRows - 1) * 2;
  for (let i = 0; i < numRows; i++) {
    let shift = (numRows - 1 - i) * 2;

    if (shift === 0) {
      shift = roundtripLength;
    }

    const shift1 = shift === roundtripLength ? 0 : roundtripLength - shift;

    const shifts = [shift, shift1].filter(Boolean);

    let currentShiftIndex = 0;

    let currentIndex = i;
    while (currentIndex < s.length) {
      res.push(s[currentIndex]);

      currentIndex += shifts[currentShiftIndex];

      currentShiftIndex = (currentShiftIndex + 1) % shifts.length;
    }
  }

  return res.join("");
}
