export class MinHeap {
  private holder: number[] = [];
  isEmpty(): boolean {
    return this.holder.length === 0;
  }

  size(): number {
    return this.holder.length;
  }

  private readonly compare = numberAscending;

  private readonly missingValue = Infinity;

  insert(value: number): void {
    this.holder.push(value);

    let index = this.holder.length - 1;
    let parentIndex = Math.floor((index - 1) * 0.5);
    let parentIsNotWellPlaced =
      this.compare(this.holder[parentIndex], this.holder[index]) > 0;

    while (parentIsNotWellPlaced) {
      this.swap(parentIndex, index);

      index = parentIndex;
      parentIndex = Math.floor((index - 1) * 0.5);
      parentIsNotWellPlaced =
        this.compare(this.holder[parentIndex], this.holder[index]) > 0;
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.holder[i];
    this.holder[i] = this.holder[j];
    this.holder[j] = temp;
  }

  /*
   * node i
        left child 2*i + 1 
        right child 2*i + 2 
    
        node i
            parent floor((i - 1) / 2)
        
    insert
        put at last entry then bubble up
    
    extract
        pop first
        put last as first and push down
        when swapping with left or right child - choose to put the lowest one as the new parent
        i.e. sort by the given comparator and take the first
    
    min-heap property
        every node is smaller than its children

   */

  peek(): number {
    return this.holder.at(0);
  }

  pop(): number {
    if (this.holder.length === 1) {
      return this.holder.pop();
    }
    const value = this.holder.at(0);
    this.holder[0] = this.holder.pop();

    let index = 0;
    let left = index * 2 + 1;
    let right = index * 2 + 2;

    let childIndexToSwap =
      this.compare(
        this.holder[left] ?? this.missingValue,
        this.holder[right] ?? this.missingValue
      ) < 0
        ? left
        : right;

    let nodeIsNotWellPlaced =
      this.compare(
        this.holder[index],
        this.holder[childIndexToSwap] ?? this.missingValue
      ) > 0;

    while (nodeIsNotWellPlaced) {
      this.swap(index, childIndexToSwap);

      index = childIndexToSwap;
      left = index * 2 + 1;
      right = index * 2 + 2;

      childIndexToSwap =
        this.compare(
          this.holder[left] ?? this.missingValue,
          this.holder[right] ?? this.missingValue
        ) < 0
          ? left
          : right;

      nodeIsNotWellPlaced =
        this.compare(
          this.holder[index],
          this.holder[childIndexToSwap] ?? this.missingValue
        ) > 0;
    }

    return value;
  }
}

function numericDescending(a: number, b: number): number {
  return b - a;
}

function numberAscending(a: number, b: number): number {
  return a - b;
}
