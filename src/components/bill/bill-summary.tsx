"use client";

import { Person } from "@/types/bill";
import { BillCalculation } from "@/lib/calculations/types";

type BillSummaryProps = {
  calculation: BillCalculation | null;
  people: Person[];
  onCalculate?: () => void;
  taxRate?: number;
  serviceChargeRate?: number;
  discountAmount?: number;
};

export function BillSummary({
  calculation,
  people,
  onCalculate,
  taxRate = 0,
  serviceChargeRate = 0,
  discountAmount = 0,
}: BillSummaryProps) {
  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
    return amount < 0 ? `-${formatted}` : formatted;
  };

  const personMap = new Map(people.map((p) => [p.id, p]));

  const displaySubtotal = calculation ? calculation.subtotal : 0;
  const displayTax = calculation ? calculation.tax : 0;
  const displayService = calculation ? calculation.serviceCharge : 0;
  const displayDiscount = calculation ? calculation.discount : discountAmount;
  const displayGrandTotal = calculation ? calculation.grandTotal : 0;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          BILL SUMMARY
        </h2>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          BILL BREAKDOWN
        </h3>

        {/* Breakdown Items */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">Subtotal</span>
            <span className="font-bold text-slate-950">
              {formatCurrency(displaySubtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-500">
            <span>Tax ({taxRate}%)</span>
            <span>{formatCurrency(displayTax)}</span>
          </div>

          <div className="flex items-center justify-between text-slate-500">
            <span>Service ({serviceChargeRate}%)</span>
            <span>{formatCurrency(displayService)}</span>
          </div>

          <div className="flex items-center justify-between text-slate-500">
            <span>Discount</span>
            <span className="font-semibold text-emerald-600">
              -{formatCurrency(displayDiscount)}
            </span>
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <span className="text-base font-extrabold text-slate-950">
              Total
            </span>
            <span className="text-lg font-extrabold text-slate-950">
              {formatCurrency(displayGrandTotal)}
            </span>
          </div>
        </div>

        {/* Each Person Section */}
        {people.length > 0 && calculation && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              EACH PERSON
            </h3>

            <div className="space-y-2.5">
              {calculation.people.map((pBreakdown) => {
                const person = personMap.get(pBreakdown.personId);
                return (
                  <div
                    key={pBreakdown.personId}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="font-semibold text-slate-900">
                      {person ? person.name : "Unknown"}
                    </span>
                    <span className="font-bold text-slate-950">
                      {formatCurrency(pBreakdown.grandTotal)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Calculate Bill Button */}
      <button
        type="button"
        onClick={onCalculate}
        className="w-full rounded-2xl bg-[#2563eb] py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95 cursor-pointer"
      >
        Calculate Bill
      </button>
    </div>
  );
}
