export function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b); // sort by alphabetical order by default - bruh. O(n*logn)

  const res: number[][] = [];
  for (let i = 0; i <= nums.length - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    const firstNum = nums[i];

    let low = i + 1;
    let high = nums.length - 1;

    // need to use converging pointers for efficiency O(n^2)
    // otherwise we get O(n^3) which is not enough
    // other techniques using 2 pointers are
    /*
    fast and slow pointers (cycle detection, hare and tortoise)
    sliding window - start with window size then expand / contract the sides
    fixed distance - the 2 pointers move in the same direction at same speed
    partition - define a region within the array
    */
    while (low < high) {
      const secondNumber = nums[low];
      const thirdNumber = nums[high];
      let increaseLow = false;
      let decreaseHigh = false;
      const sum = secondNumber + thirdNumber + firstNum;
      if (sum === 0) {
        res.push([firstNum, secondNumber, thirdNumber]);

        decreaseHigh = true;
        increaseLow = true;
      } else if (sum > 0) {
        decreaseHigh = true;
      } else {
        increaseLow = true;
      }

      if (increaseLow) {
        while (secondNumber === nums[low] && low < nums.length - 1) {
          low++;
        }
      }

      if (decreaseHigh) {
        while (thirdNumber === nums[high] && high > 0) {
          high--;
        }
      }
    }
  }
  return res;
}
