/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const stack: ListNode[] = [];

  {
    let node = head;
    while (node) {
      stack.push(node);
      node = node.next;
    }
  }

  let nextNode: ListNode | null = null;

  while (n > 1) {
    nextNode = stack.pop();
    n--;
  }

  const nodeToRemove: ListNode | null = stack.pop();

  if (nodeToRemove === head) {
    return nextNode; // link to the rest or the list, which can be null
  }

  const prevNode = stack.pop();

  prevNode.next = nextNode;

  return head;
}
