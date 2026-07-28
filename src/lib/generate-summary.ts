import { Person } from "@/types/bill";
import { BillCalculation } from "@/lib/calculations/types";
import { formatCurrency } from "@/lib/format-currency";

export function generateSummary(
  calculation: BillCalculation,
  people: Person[]
): string {
  const personMap = new Map(people.map((p) => [p.id, p]));

  let text = `BILL SUMMARY\n\n`;

  calculation.people.forEach((p) => {
    const person = personMap.get(p.personId);
    const name = person ? person.name : "Unknown";

    text += `${name}\n`;
    text += `Subtotal: ${formatCurrency(p.subtotal)}\n`;
    if (p.tax > 0) text += `Tax: ${formatCurrency(p.tax)}\n`;
    if (p.serviceCharge > 0) text += `Service: ${formatCurrency(p.serviceCharge)}\n`;
    if (p.discount > 0) text += `Discount: -${formatCurrency(p.discount)}\n`;
    text += `Total: ${formatCurrency(p.grandTotal)}\n\n`;
  });

  text += `─────────────────────────\n`;
  text += `Grand Total: ${formatCurrency(calculation.grandTotal)}`;

  return text;
}
