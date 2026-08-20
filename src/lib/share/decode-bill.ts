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
    // Clean up payload if extra text/spaces were appended by external apps or share sheets
    let rawPayload = encoded.trim().split(/\s+/)[0];
    
    // Safely URL-decode base64 string
    try {
      rawPayload = decodeURIComponent(rawPayload);
    } catch {
      // Use rawPayload as is if decodeURIComponent fails
    }

    let uriEncoded: string;
    if (typeof window !== "undefined" && typeof window.atob === "function") {
      uriEncoded = window.atob(rawPayload);
    } else {
      uriEncoded = Buffer.from(rawPayload, "base64").toString("utf-8");
    }

    // Safely URL-decode the JSON string
    let json: string;
    try {
      json = decodeURIComponent(uriEncoded);
    } catch {
      json = uriEncoded;
    }

    // Extract valid JSON object substring if trailing text exists
    const firstBrace = json.indexOf("{");
    const lastBrace = json.lastIndexOf("}");
    const cleanJson =
      firstBrace !== -1 && lastBrace !== -1
        ? json.slice(firstBrace, lastBrace + 1)
        : json;

    const data = JSON.parse(cleanJson);

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
