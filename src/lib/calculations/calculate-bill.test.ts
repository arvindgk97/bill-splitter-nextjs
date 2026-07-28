import { describe, expect, it } from "vitest";
import { calculateBill } from "./calculate-bill";

describe("calculateBill", () => {
  it("splits an item equally between participants", () => {
    const people = [
      { id: "1", name: "Yasukaze" },
      { id: "2", name: "Andi" },
    ];

    const items = [
      {
        id: "item-1",
        name: "Pizza",
        price: 100000,
        quantity: 1,
        personIds: ["1", "2"],
        assignedMemberIds: ["1", "2"],
      },
    ];

    const result = calculateBill(people, items);

    expect(result.subtotal).toBe(100000);
    expect(
      result.people.find((person) => person.personId === "1")?.subtotal,
    ).toBe(50000);
    expect(
      result.people.find((person) => person.personId === "2")?.subtotal,
    ).toBe(50000);
  });

  it("handles quantity correctly (Step 6)", () => {
    const people = [
      { id: "1", name: "Yasukaze" },
      { id: "2", name: "Andi" },
    ];

    const items = [
      {
        id: "item-1",
        name: "Pizza",
        price: 100000,
        quantity: 2, // Total = 200.000
        personIds: ["1", "2"],
        assignedMemberIds: ["1", "2"],
      },
    ];

    const result = calculateBill(people, items);

    expect(result.subtotal).toBe(200000);
    expect(
      result.people.find((person) => person.personId === "1")?.subtotal,
    ).toBe(100000);
    expect(
      result.people.find((person) => person.personId === "2")?.subtotal,
    ).toBe(100000);
  });

  it("handles multiple items and maintains sum invariant (Step 7)", () => {
    const people = [
      { id: "1", name: "Yasukaze" },
      { id: "2", name: "Andi" },
      { id: "3", name: "Budi" },
    ];

    const items = [
      {
        id: "item-1",
        name: "Pizza",
        price: 120000,
        quantity: 1,
        personIds: ["1", "2", "3"],
        assignedMemberIds: ["1", "2", "3"],
      },
      {
        id: "item-2",
        name: "Nasi Goreng",
        price: 30000,
        quantity: 1,
        personIds: ["1"],
        assignedMemberIds: ["1"],
      },
    ];

    const result = calculateBill(people, items);

    expect(result.subtotal).toBe(150000);

    const sumOfPersonSubtotals = result.people.reduce(
      (acc, p) => acc + p.subtotal,
      0,
    );
    expect(sumOfPersonSubtotals).toBe(result.subtotal);
  });

  it("allocates Tax, Service Charge, and Discount proportionally (Steps 12, 13, 14)", () => {
    const people = [
      { id: "1", name: "Yasukaze" },
      { id: "2", name: "Andi" },
      { id: "3", name: "Budi" },
    ];

    const items = [
      {
        id: "item-1",
        name: "Nasi Goreng",
        price: 30000,
        quantity: 1,
        personIds: ["1"],
        assignedMemberIds: ["1"],
      },
      {
        id: "item-2",
        name: "Pizza",
        price: 120000,
        quantity: 1,
        personIds: ["1", "2", "3"],
        assignedMemberIds: ["1", "2", "3"],
      },
    ];

    // Subtotal = 150.000 (Yasukaze: 70k, Andi: 40k, Budi: 40k)
    // Tax = 10% (15.000)
    // Service Charge = 5% (7.500)
    // Discount = 15.000
    const result = calculateBill(people, items, {
      taxRate: 10,
      serviceChargeRate: 5,
      discountAmount: 15000,
    });

    expect(result.subtotal).toBe(150000);
    expect(result.tax).toBe(15000);
    expect(result.serviceCharge).toBe(7500);
    expect(result.discount).toBe(15000);
    expect(result.grandTotal).toBe(157500);

    const yasukaze = result.people.find((p) => p.personId === "1")!;
    const andi = result.people.find((p) => p.personId === "2")!;
    const budi = result.people.find((p) => p.personId === "3")!;

    // Tax allocation
    expect(yasukaze.tax).toBe(7000);
    expect(andi.tax).toBe(4000);
    expect(budi.tax).toBe(4000);

    // Service charge allocation
    expect(yasukaze.serviceCharge).toBe(3500);
    expect(andi.serviceCharge).toBe(2000);
    expect(budi.serviceCharge).toBe(2000);

    // Discount allocation
    expect(yasukaze.discount).toBe(7000);
    expect(andi.discount).toBe(4000);
    expect(budi.discount).toBe(4000);

    // Per person totals
    expect(yasukaze.grandTotal).toBe(73500); // 70000 + 7000 + 3500 - 7000
    expect(andi.grandTotal).toBe(42000); // 40000 + 4000 + 2000 - 4000
    expect(budi.grandTotal).toBe(42000); // 40000 + 4000 + 2000 - 4000
  });

  it("handles rounding remainder so that SUM(person.grandTotal) === grandTotal (Step 15)", () => {
    const people = [
      { id: "1", name: "Yasukaze" },
      { id: "2", name: "Andi" },
      { id: "3", name: "Budi" },
    ];

    const items = [
      {
        id: "item-1",
        name: "Juice",
        price: 100,
        quantity: 1,
        personIds: ["1", "2", "3"],
        assignedMemberIds: ["1", "2", "3"],
      },
    ];

    const result = calculateBill(people, items);

    expect(result.subtotal).toBe(100);
    expect(result.grandTotal).toBe(100);

    const sumPersonTotals = result.people.reduce(
      (acc, p) => acc + p.grandTotal,
      0,
    );

    // Invariant: SUM(person totals) === grandTotal
    expect(sumPersonTotals).toBe(result.grandTotal);
  });
});
