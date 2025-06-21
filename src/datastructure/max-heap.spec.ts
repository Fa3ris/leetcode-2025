import { describe, it, expect, beforeEach } from "vitest";
import { MinHeap } from "./min-heap";
import { MaxHeap } from "./max-heap";

describe("MinHeap", () => {
  let heap: MaxHeap;

  beforeEach(() => {
    heap = new MaxHeap();
  });

  it("starts empty", () => {
    expect(heap.isEmpty()).toBe(true);
  });

  it("inserts a single element", () => {
    heap.insert(5);
    expect(heap.peek()).toBe(5);
    expect(heap.isEmpty()).toBe(false);
  });

  it("keep size", () => {
    heap.insert(5);
    expect(heap.size()).toBe(1);
    heap.insert(5);
    expect(heap.size()).toBe(2);
  });

  it("maintains min at the top after multiple inserts", () => {
    heap.insert(10);
    heap.insert(4);
    heap.insert(7);
    expect(heap.peek()).toBe(10);
  });

  it("extracts the minimum element", () => {
    heap.insert(10);
    heap.insert(4);
    heap.insert(7);
    expect(heap.pop()).toBe(10);

    expect(heap.peek()).toBe(7);
  });

  it("extracts all elements in sorted order", () => {
    heap.insert(3);

    heap.insert(1);

    heap.insert(6);

    heap.insert(2);

    expect(heap.pop()).toBe(6);

    expect(heap.pop()).toBe(3);

    expect(heap.pop()).toBe(2);

    expect(heap.pop()).toBe(1);

    expect(heap.isEmpty()).toBe(true);
  });

  it("handles duplicate values correctly", () => {
    heap.insert(5);
    heap.insert(3);
    heap.insert(5);
    heap.insert(3);
    expect(heap.pop()).toBe(5);
    expect(heap.pop()).toBe(5);
    expect(heap.pop()).toBe(3);
    expect(heap.pop()).toBe(3);
  });

  it("handles negative and zero values", () => {
    heap.insert(0);
    heap.insert(-2);
    heap.insert(4);
    heap.insert(-10);

    expect(heap.pop()).toBe(4);
    expect(heap.pop()).toBe(0);
    expect(heap.pop()).toBe(-2);
    expect(heap.pop()).toBe(-10);
  });

  it("handle long replaces", () => {
    heap.insert(3);
    heap.insert(5);
    heap.insert(2);
    heap.insert(1);
    heap.insert(4);
    heap.insert(7);
    heap.insert(6);
    heap.insert(0);

    console.log(heap);
    expect(heap.pop()).toBe(7);
    console.log(heap);
    expect(heap.pop()).toBe(6);
    console.log(heap);
    expect(heap.pop()).toBe(5);
  });
});
