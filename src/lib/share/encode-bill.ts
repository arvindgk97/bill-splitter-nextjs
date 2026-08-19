import type { ShareableBill } from "./types";

/**
 * Encodes a ShareableBill object into a URL-safe encoded base64 string.
 * Uses double encodeURIComponent + btoa to ensure +, /, and = are safely escaped for URL paths.
 */
export function encodeBill(bill: ShareableBill): string {
  const json = JSON.stringify(bill);
  const uriEncoded = encodeURIComponent(json);

  let base64: string;
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    base64 = window.btoa(uriEncoded);
  } else {
    base64 = Buffer.from(uriEncoded, "utf-8").toString("base64");
  }

  return encodeURIComponent(base64);
}
