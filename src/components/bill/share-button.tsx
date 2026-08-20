"use client";

import { useState } from "react";
import { useBillStore } from "@/store/bill-store";
import { createShareUrl } from "@/lib/share/create-share-url";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { Share2, Check } from "lucide-react";

export function ShareButton() {
  const people = useBillStore((state) => state.people);
  const items = useBillStore((state) => state.items);
  const adjustments = useBillStore((state) => state.adjustments);

  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    try {
      const bill = {
        people,
        items,
        adjustments,
      };

      const shareUrl = createShareUrl(bill);

      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "Bill Split",
          text: "Here's the bill split.",
          url: shareUrl,
        });

        return;
      }

      // Fallback to Copy URL if Web Share API is not available
      const success = await copyToClipboard(shareUrl);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (error: any) {
      if (error?.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={isSharing}
      className="w-full rounded-2xl border border-blue-200 bg-blue-50/50 py-3 text-center text-xs font-semibold text-blue-700 hover:bg-blue-100/50 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-emerald-600">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5 text-blue-600" />
          <span>{isSharing ? "Sharing..." : "Share Bill"}</span>
        </>
      )}
    </button>
  );
}
