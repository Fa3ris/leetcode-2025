// this is still O(logn)
export function searchRange(nums: number[], target: number): number[] {
  return [
    binarySearchLeft(nums, 0, nums.length - 1, target),
    binarySearchRight(nums, 0, nums.length - 1, target),
  ];
}

function binarySearch(
  nums: number[],
  start: number,
  end: number,
  target: number
): number {
  let mid = 0;
  while (start <= end) {
    mid = Math.floor((start + end) / 2);
    if (nums[mid] === target) {
      return mid;
    }
    if (nums[mid] > target) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
    mid = Math.floor((start + end) / 2);
  }

  return -1;
}

// tweak binary search to continue searching while target is still present toward the beginning of the list
function binarySearchLeft(
  nums: number[],
  start: number,
  end: number,
  target: number
): number {
  let mid = 0;

  while (start <= end) {
    mid = Math.floor((start + end) / 2);
    if (nums[mid] === target) {
      if (mid > 0 && nums[mid - 1] === target) {
        end = mid - 1;
      } else {
        return mid;
      }
    } else if (nums[mid] > target) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
    mid = Math.floor((start + end) / 2);
  }

  return -1;
}

// tweak binary search to continue searching while target is still present toward the end of the list
function binarySearchRight(
  nums: number[],
  start: number,
  end: number,
  target: number
): number {
  let mid = 0;

  while (start <= end) {
    mid = Math.floor((start + end) / 2);
    if (nums[mid] === target) {
      if (mid < nums.length - 1 && nums[mid + 1] === target) {
        start = mid + 1;
      } else {
        return mid;
      }
    } else if (nums[mid] > target) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
    mid = Math.floor((start + end) / 2);
  }

  return -1;
}
