export function calculateTotalAmount({ base, multiplier = 1, extra = 0, discount = 0 }: { base: number; multiplier?: number; extra?: number; discount?: number }) {
  return (base * multiplier + extra - discount) * 100;
}
