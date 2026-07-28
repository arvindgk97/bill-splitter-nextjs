import type { BillItem, Person } from "@/types/bill";
import type {
  BillCalculation,
  CalculateBillOptions,
  PersonItemShare,
} from "./types";
import { splitItemAmount } from "./split-items";
import { allocateProportionally } from "./allocate-proportionally";

/**
 * Final Calculation Flow for SplitBill
 * ------------------------------------
 * 1. Calculate Item Totals & Split Items Among Participants
 * 2. Calculate Subtotal Per Person & Overall Bill Subtotal
 * 3. Calculate Tax, Service Charge, and Discount
 * 4. Allocate Tax, Service Charge, and Discount Proportionally
 * 5. Round & Reconcile Remainder (Guaranteeing SUM(person.grandTotal) === grandTotal)
 * 6. Return Final Person Totals & Bill Summary
 */
export function calculateBill(
  people: Person[],
  items: BillItem[],
  options: CalculateBillOptions = {},
): BillCalculation {
  const { taxRate = 0, serviceChargeRate = 0, discountAmount = 0 } = options;

  const personSubtotals = new Map<string, number>();
  const personItemsMap = new Map<string, PersonItemShare[]>();

  for (const person of people) {
    personSubtotals.set(person.id, 0);
    personItemsMap.set(person.id, []);
  }

  let subtotal = 0;

  // Step 1: Calculate Item Totals & Split Items Among Participants
  for (const item of items) {
    const itemTotal = Math.round(item.price) * Math.round(item.quantity);
    subtotal += itemTotal;

    const personIds = item.personIds || item.assignedMemberIds || [];
    const participantCount = personIds.length;

    if (participantCount === 0) {
      throw new Error(`Item "${item.name}" has no participants`);
    }

    const amountPerPerson = splitItemAmount(itemTotal, participantCount);

    // Step 2: Calculate Subtotal Per Person
    for (const personId of personIds) {
      const currentAmount = personSubtotals.get(personId) ?? 0;
      personSubtotals.set(personId, currentAmount + amountPerPerson);

      const personShares = personItemsMap.get(personId) ?? [];
      personShares.push({
        itemId: item.id,
        itemName: item.name,
        itemPrice: Math.round(item.price),
        itemQuantity: Math.round(item.quantity),
        itemTotal: itemTotal,
        participantCount: participantCount,
        amount: amountPerPerson,
      });
      personItemsMap.set(personId, personShares);
    }
  }

  // Step 3: Calculate Overall Tax, Service Charge, Discount, and Grand Total
  const tax = Math.round(subtotal * (taxRate / 100));
  const serviceCharge = Math.round(subtotal * (serviceChargeRate / 100));
  const discount = Math.round(discountAmount);
  const grandTotal = subtotal + tax + serviceCharge - discount;

  // Step 4: Allocate Tax, Service Charge, and Discount Proportionally
  const personSubtotalArray = people.map((p) => personSubtotals.get(p.id) ?? 0);
  const allocatedTaxes = allocateProportionally(tax, personSubtotalArray);
  const allocatedServices = allocateProportionally(
    serviceCharge,
    personSubtotalArray,
  );
  const allocatedDiscounts = allocateProportionally(
    discount,
    personSubtotalArray,
  );

  const peopleBreakdown = people.map((person, index) => {
    const pSubtotal = Math.round(personSubtotals.get(person.id) ?? 0);
    const pTax = allocatedTaxes[index] ?? 0;
    const pServiceCharge = allocatedServices[index] ?? 0;
    const pDiscount = allocatedDiscounts[index] ?? 0;
    const pGrandTotal = pSubtotal + pTax + pServiceCharge - pDiscount;

    return {
      personId: person.id,
      items: personItemsMap.get(person.id) ?? [],
      subtotal: pSubtotal,
      tax: pTax,
      serviceCharge: pServiceCharge,
      discount: pDiscount,
      grandTotal: pGrandTotal,
    };
  });

  // Step 5: Round & Reconcile Remainder (Guaranteeing SUM(person.grandTotal) === grandTotal)
  if (peopleBreakdown.length > 0) {
    const sumPersonTotals = peopleBreakdown.reduce(
      (acc, p) => acc + p.grandTotal,
      0,
    );
    const remainder = grandTotal - sumPersonTotals;
    if (remainder !== 0) {
      const lastIndex = peopleBreakdown.length - 1;
      peopleBreakdown[lastIndex].grandTotal += remainder;
    }
  }

  // Step 6: Return Final Person Totals & Bill Summary
  return {
    subtotal,
    tax,
    serviceCharge,
    discount,
    grandTotal,
    people: peopleBreakdown,
  };
}
