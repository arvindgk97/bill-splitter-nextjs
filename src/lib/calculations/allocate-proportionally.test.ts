import { describe, expect, it } from "vitest";
import { allocateProportionally } from "./allocate-proportionally";

describe("allocateProportionally", () => {
  it("allocates amount proportionally based on weights", () => {
    // Tax 15.000 for subtotals [70.000, 40.000, 40.000]
    const result = allocateProportionally(15000, [70000, 40000, 40000]);
    expect(result).toEqual([7000, 4000, 4000]);
  });

  it("handles rounding remainder by adjusting the last person", () => {
    // 100 split equally 3 ways [1, 1, 1] => [33, 33, 34]
    const result = allocateProportionally(100, [1, 1, 1]);
    expect(result).toEqual([33, 33, 34]);
    expect(result.reduce((a, b) => a + b, 0)).toBe(100);
  });

  it("returns zeros when total weight is zero", () => {
    const result = allocateProportionally(100, [0, 0, 0]);
    expect(result).toEqual([0, 0, 0]);
  });

  it("returns empty array for empty weights", () => {
    const result = allocateProportionally(100, []);
    expect(result).toEqual([]);
  });
});
