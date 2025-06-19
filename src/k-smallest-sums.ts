export function kSmallestPairs(
  nums1: number[],
  nums2: number[],
  k: number
): number[][] {
  let i = 0;
  let j = 0;

  const res = [];

  // suppose no duplicate inside and between arrays
  // handle if duplicates in any of the array
  // handle if duplicates between arrays
  while (k > 0) {
    res.push([nums1[i], nums2[j]]);
    let sum1 = Infinity;
    let sum2 = Infinity;
    if (i + 1 < nums1.length) {
      sum1 = nums1[i + 1] + nums2[j];
    }
    if (j + 1 < nums2.length) {
      sum2 = nums1[i] + nums2[j + 1];
    }
    if (sum1 < sum2) {
      i++;
    } else if (sum1 > sum2) {
      j++;
    }
    k--;
  }

  return res;
}
