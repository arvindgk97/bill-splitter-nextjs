export function splitItemAmount(
  totalAmount: number,
  participantCount: number,
): number {
  if (participantCount <= 0) {
    return 0;
  }

  return totalAmount / participantCount;
}
