"use client";

import { useBillStore } from "@/store/bill-store";
import { useIsMounted } from "@/hooks/use-is-mounted";

export function AdjustmentsSection() {
  const isMounted = useIsMounted();
  const adjustments = useBillStore((state) => state.adjustments);
  const updateAdjustments = useBillStore((state) => state.updateAdjustments);

  const currentAdjustments = isMounted
    ? adjustments
    : { taxRate: 0, serviceChargeRate: 0, discountAmount: 0 };

  return (
    <section>
      <div className="mb-4 space-y-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          ADJUSTMENTS
        </h2>
        <p className="text-sm font-normal text-slate-500">
          Tax, service charge, and discounts.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Tax Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="tax-rate"
              className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Tax (%)
            </label>
            <input
              id="tax-rate"
              type="number"
              min="0"
              step="0.5"
              placeholder="0"
              value={currentAdjustments.taxRate || ""}
              onChange={(e) =>
                updateAdjustments({
                  taxRate: Math.max(0, Number(e.target.value) || 0),
                })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base font-medium text-slate-900 outline-none transition focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
            />
          </div>

          {/* Service Charge Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="service-rate"
              className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Service (%)
            </label>
            <input
              id="service-rate"
              type="number"
              min="0"
              step="0.5"
              placeholder="0"
              value={currentAdjustments.serviceChargeRate || ""}
              onChange={(e) =>
                updateAdjustments({
                  serviceChargeRate: Math.max(0, Number(e.target.value) || 0),
                })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base font-medium text-slate-900 outline-none transition focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
            />
          </div>

          {/* Discount Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="discount-amount"
              className="text-xs font-semibold text-slate-400 uppercase tracking-wider"
            >
              Discount (Rp)
            </label>
            <input
              id="discount-amount"
              type="number"
              min="0"
              step="500"
              placeholder="0"
              value={currentAdjustments.discountAmount || ""}
              onChange={(e) =>
                updateAdjustments({
                  discountAmount: Math.max(0, Number(e.target.value) || 0),
                })
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base font-medium text-slate-900 outline-none transition focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
