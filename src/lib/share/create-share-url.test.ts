import { describe, it, expect } from "vitest";
import { createShareUrl } from "./create-share-url";
import { decodeBill } from "./decode-bill";
import type { ShareableBill } from "./types";

describe("createShareUrl", () => {
  const sampleBill: ShareableBill = {
    title: "Makan Siang",
    people: [{ id: "p1", name: "Andi" }],
    items: [
      {
        id: "i1",
        name: "Bakso",
        price: 15000,
        quantity: 1,
        personIds: ["p1"],
        assignedMemberIds: ["p1"],
      },
    ],
    adjustments: { taxRate: 0, serviceChargeRate: 0, discountAmount: 0 },
  };

  it("should create a share URL with specified baseUrl", () => {
    const url = createShareUrl(sampleBill, "https://bill-splitter.com");
    expect(url).toContain("https://bill-splitter.com/share/");

    const payload = url.split("/share/")[1];
    const decoded = decodeBill(payload);
    expect(decoded?.title).toBe("Makan Siang");
  });

  it("should fallback gracefully when no origin is present", () => {
    const url = createShareUrl(sampleBill);
    expect(url).toMatch(/^\/share\//);
  });
});
