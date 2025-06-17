type Key = number;
type Value = number;
// I did not figure that on my own
// the regular way is to use a map to track the nodes of a doubly linked-list
// TODO reimplement using linked list -- if I ever want to bang my head
export class LRUCache {
  private map = new Map<Key, Value>();

  constructor(private capacity: number) {}

  get(key: number): number {
    if (!this.map.has(key)) return -1;

    const value = this.map.get(key)!;
    // Re-insert to move to end (most recent)
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) {
      // Update existing - delete and re-add to move to end
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      // Remove LRU (first item)
      const firstKey = this.map.keys().next().value;
      this.map.delete(firstKey);
    }

    this.map.set(key, value);
  }
}
