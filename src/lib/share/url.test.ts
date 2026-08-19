import { describe, it, expect } from "vitest";
import { encodeBill } from "./encode-bill";
import { decodeBill } from "./decode-bill";
import { calculateBill } from "../calculations/calculate-bill";
import type { ShareableBill } from "./types";

describe("encodeBill & decodeBill", () => {
  const sampleBill: ShareableBill = {
    title: "Makan Malam Resto Bintang 🌟",
    people: [
      { id: "p1", name: "Budi", avatarColor: "#38BDF8" },
      { id: "p2", name: "Siti 🍕", avatarColor: "#F472B6" },
    ],
    items: [
      {
        id: "i1",
        name: "Nasi Goreng Spesial",
        price: 35000,
        quantity: 2,
        personIds: ["p1", "p2"],
        assignedMemberIds: ["p1", "p2"],
      },
    ],
    adjustments: {
      taxRate: 11,
      serviceChargeRate: 5,
      discountAmount: 10000,
    },
  };

  it("should encode and decode a valid bill accurately", () => {
    const encoded = encodeBill(sampleBill);
    expect(typeof encoded).toBe("string");
    expect(encoded.length).toBeGreaterThan(0);

    const decoded = decodeBill(encoded);
    expect(decoded).not.toBeNull();
    expect(decoded?.title).toBe(sampleBill.title);
    expect(decoded?.people).toEqual(sampleBill.people);
    expect(decoded?.items).toEqual(sampleBill.items);
    expect(decoded?.adjustments).toEqual(sampleBill.adjustments);
  });

  it("should guarantee identical calculation results between editor and decoded payload", () => {
    const originalCalculation = calculateBill(
      sampleBill.people,
      sampleBill.items,
      sampleBill.adjustments
    );

    const encoded = encodeBill(sampleBill);
    const decoded = decodeBill(encoded)!;

    const decodedCalculation = calculateBill(
      decoded.people,
      decoded.items,
      decoded.adjustments
    );

    expect(decodedCalculation).toEqual(originalCalculation);
  });

  it("should return null for invalid or corrupted payloads", () => {
    expect(decodeBill("")).toBeNull();
    expect(decodeBill("invalid-base64-payload!!!")).toBeNull();
    expect(decodeBill("e30")).toBeNull(); // empty object "{}" missing people/items
  });
});
