/** 
if version1 < version2, return -1.

If version1 > version2, return 1.

Otherwise, return 0.
*/
export function compareVersion(version1: string, version2: string): number {
  const revisions1 = version1.split(".");
  const revisions2 = version2.split(".");

  for (let i = 0; i < Math.max(revisions1.length, revisions2.length); i++) {
    const rev1 = Number(revisions1[i] ?? 0);
    const rev2 = Number(revisions2[i] ?? 0);
    const diff = rev1 - rev2;
    if (diff !== 0) return diff < 0 ? -1 : 1;
  }

  return 0;
}
