import type { ShareableBill } from "./types";

/**
 * Decodes an encoded string back into a ShareableBill object.
 * Safely decodes URL-escaped base64 strings and validates data structure.
 */
export function decodeBill(encoded: string): ShareableBill | null {
  if (!encoded || typeof encoded !== "string") {
    return null;
  }

  try {
    const decodedBase64 = decodeURIComponent(encoded);

    let uriEncoded: string;
    if (typeof window !== "undefined" && typeof window.atob === "function") {
      uriEncoded = window.atob(decodedBase64);
    } else {
      uriEncoded = Buffer.from(decodedBase64, "base64").toString("utf-8");
    }

    const json = decodeURIComponent(uriEncoded);
    const data = JSON.parse(json);

    // Basic structure validation
    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray(data.people) ||
      !Array.isArray(data.items)
    ) {
      return null;
    }

    return {
      title: typeof data.title === "string" ? data.title : "Shared Bill",
      people: data.people,
      items: data.items,
      adjustments: data.adjustments || {
        taxRate: 0,
        serviceChargeRate: 0,
        discountAmount: 0,
      },
    };
  } catch (err) {
    console.error("FAILED TO DECODE BILL:", err);
    return null;
  }
}
