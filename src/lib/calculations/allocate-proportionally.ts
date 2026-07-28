export function allocateProportionally(
  amount: number,
  weights: number[],
): number[] {
  if (weights.length === 0) {
    return [];
  }

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);

  if (totalWeight <= 0) {
    return weights.map(() => 0);
  }

  const targetAmount = Math.round(amount);
  const allocated = weights.map((w) =>
    Math.round((w / totalWeight) * targetAmount),
  );

  const sumAllocated = allocated.reduce((sum, val) => sum + val, 0);
  const remainder = targetAmount - sumAllocated;

  if (remainder !== 0) {
    allocated[allocated.length - 1] += remainder;
  }

  return allocated;
}
