"use client";

import { useState } from "react";
import { Person } from "@/types/bill";
import { BillCalculation } from "@/lib/calculations/types";
import { generateSummary } from "@/lib/generate-summary";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { Copy, Check } from "lucide-react";

type SharedCopyButtonProps = {
  calculation: BillCalculation;
  people: Person[];
};

export function SharedCopyButton({
  calculation,
  people,
}: SharedCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const summaryText = generateSummary(calculation, people);
    const success = await copyToClipboard(summaryText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-emerald-600">Summary Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-slate-500" />
          <span>Copy Summary</span>
        </>
      )}
    </button>
  );
}
