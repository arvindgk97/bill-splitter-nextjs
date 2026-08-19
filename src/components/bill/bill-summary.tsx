"use client";

import { useState } from "react";
import { Person, BillItem } from "@/types/bill";
import { BillCalculation } from "@/lib/calculations/types";
import { formatCurrency } from "@/lib/format-currency";
import { generateSummary } from "@/lib/generate-summary";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { createShareUrl } from "@/lib/share/create-share-url";
import { ShareableBill } from "@/lib/share/types";
import { useBillStore } from "@/store/bill-store";
import { Copy, Check, Calculator, Share2 } from "lucide-react";

type BillSummaryProps = {
  calculation: BillCalculation | null;
  people: Person[];
  itemsCount?: number;
  onCalculate?: () => void;
  taxRate?: number;
  serviceChargeRate?: number;
  discountAmount?: number;
  isDisabled?: boolean;
};

export function BillSummary({
  calculation,
  people,
  itemsCount = 0,
  onCalculate,
  taxRate = 0,
  serviceChargeRate = 0,
  discountAmount = 0,
  isDisabled,
}: BillSummaryProps) {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const title = useBillStore((state) => state.title);
  const storeItems = useBillStore((state) => state.items);

  const isCalculateDisabled =
    isDisabled ?? (people.length === 0 || itemsCount === 0);

  const personMap = new Map(people.map((p) => [p.id, p]));

  const handleCopySummary = async () => {
    if (!calculation) return;

    const text = generateSummary(calculation, people);
    const success = await copyToClipboard(text);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareLink = async () => {
    const storeState = useBillStore.getState();
    const activePeople = storeState.people.length ? storeState.people : people;
    const activeItems = storeState.items;
    const activeAdjustments = storeState.adjustments || {
      taxRate,
      serviceChargeRate,
      discountAmount,
    };

    if (activePeople.length === 0 || activeItems.length === 0) return;

    const payload: ShareableBill = {
      title: storeState.title || "Shared Bill",
      people: activePeople,
      items: activeItems,
      adjustments: activeAdjustments,
    };

    const url = createShareUrl(payload);

    // Mobile: Native Share Sheet
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: payload.title || "Bill Split",
          text: `Rincian tagihan "${payload.title || "Bill Split"}"`,
          url,
        });
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          // Fallback to copy if native share fails unexpectedly
          const success = await copyToClipboard(url);
          if (success) {
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2500);
          }
        }
      }
    } else {
      // Desktop / Unsupported: Copy URL to clipboard
      const success = await copyToClipboard(url);
      if (success) {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          BILL SUMMARY
        </h2>
      </div>

      {!calculation ? (
        <div className="rounded-3xl border border-slate-100 bg-white px-6 py-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2563eb] mb-2">
            <Calculator className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Your bill hasn't been calculated yet.
          </h3>
          <p className="text-sm text-slate-500 max-w-xs">
            Add people and items, then calculate the bill.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              BILL BREAKDOWN
            </h3>

            {/* Breakdown Items */}
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Subtotal</span>
                <span className="font-bold text-slate-950">
                  {formatCurrency(calculation.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                <span>Tax ({taxRate}%)</span>
                <span>{formatCurrency(calculation.tax)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                <span>Service ({serviceChargeRate}%)</span>
                <span>{formatCurrency(calculation.serviceCharge)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-500">
                <span>Discount</span>
                <span className="font-semibold text-emerald-600">
                  -{formatCurrency(calculation.discount)}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-base font-extrabold text-slate-950">
                  Total
                </span>
                <span className="text-lg font-extrabold text-slate-950">
                  {formatCurrency(calculation.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Each Person Section */}
          {people.length > 0 && (
            <div className="pt-5 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                EACH PERSON
              </h3>

              <div className="space-y-3">
                {calculation.people.map((pBreakdown) => {
                  const person = personMap.get(pBreakdown.personId);
                  const name = person ? person.name : "Unknown";

                  return (
                    <div
                      key={pBreakdown.personId}
                      className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {name}
                        </span>
                        <span className="font-extrabold text-slate-950 text-sm">
                          {formatCurrency(pBreakdown.grandTotal)}
                        </span>
                      </div>

                      <div className="space-y-1 text-slate-500 font-medium">
                        <div className="flex items-center justify-between">
                          <span>Subtotal</span>
                          <span>{formatCurrency(pBreakdown.subtotal)}</span>
                        </div>
                        {pBreakdown.tax > 0 && (
                          <div className="flex items-center justify-between">
                            <span>Tax</span>
                            <span>{formatCurrency(pBreakdown.tax)}</span>
                          </div>
                        )}
                        {pBreakdown.serviceCharge > 0 && (
                          <div className="flex items-center justify-between">
                            <span>Service</span>
                            <span>{formatCurrency(pBreakdown.serviceCharge)}</span>
                          </div>
                        )}
                        {pBreakdown.discount > 0 && (
                          <div className="flex items-center justify-between text-emerald-600">
                            <span>Discount</span>
                            <span>-{formatCurrency(pBreakdown.discount)}</span>
                          </div>
                        )}
                        <div className="pt-1.5 border-t border-slate-200/40 flex items-center justify-between font-bold text-slate-900">
                          <span>Total</span>
                          <span>{formatCurrency(pBreakdown.grandTotal)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calculate Bill Button */}
      <div className="space-y-2">
        <button
          type="button"
          disabled={isCalculateDisabled}
          onClick={onCalculate}
          className="w-full rounded-2xl bg-[#2563eb] py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#2563eb] disabled:active:scale-100 disabled:shadow-none"
        >
          Calculate Bill
        </button>
        {isCalculateDisabled && (
          <p className="text-center text-xs font-normal text-slate-400">
            Add at least one person and one item to calculate.
          </p>
        )}
      </div>

      {/* Actions when calculation exists */}
      {calculation && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
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

          <button
            type="button"
            onClick={handleShareLink}
            className="w-full rounded-2xl border border-blue-200 bg-blue-50/50 py-3 text-center text-xs font-semibold text-blue-700 hover:bg-blue-100/50 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {shareCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-blue-600" />
                <span>Share Bill</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

