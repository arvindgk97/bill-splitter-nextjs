import { encodeBill } from "./encode-bill";
import type { ShareableBill } from "./types";

/**
 * Creates a full shareable URL from a ShareableBill object.
 * Uses window.location.origin when in browser, or an optional baseUrl parameter.
 */
export function createShareUrl(
  bill: ShareableBill,
  baseUrl?: string
): string {
  const encoded = encodeBill(bill);

  if (baseUrl) {
    const cleanBase = baseUrl.replace(/\/$/, "");
    return `${cleanBase}/share/${encoded}`;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/share/${encoded}`;
  }

  return `/share/${encoded}`;
}
