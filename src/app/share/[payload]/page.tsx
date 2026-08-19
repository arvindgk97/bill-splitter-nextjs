import Link from "next/link";
import { decodeBill } from "@/lib/share/decode-bill";
import { calculateBill } from "@/lib/calculations/calculate-bill";
import { formatCurrency } from "@/lib/format-currency";
import { SharedCopyButton } from "@/components/share/shared-copy-button";
import { Receipt, AlertCircle, ArrowLeft, PlusCircle, Share2 } from "lucide-react";

type PageProps = {
  params: Promise<{ payload: string }>;
};

export default async function SharedBillPage({ params }: PageProps) {
  const { payload } = await params;

  console.log("SHARE PAYLOAD:", payload);

  let bill = null;
  try {
    bill = decodeBill(payload);
    console.log("DECODED BILL:", bill);
  } catch (error) {
    console.error("FAILED TO DECODE BILL:", error);
    bill = null;
  }

  if (!bill) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mx-auto">
            <AlertCircle className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-extrabold text-slate-900">
              Unable to open this bill
            </h1>
            <p className="text-sm text-slate-500">
              The shared bill link is invalid or corrupted.
            </p>
          </div>
          <Link
            href="/bill"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563eb] py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Bill</span>
          </Link>
        </div>
      </main>
    );
  }

  // Calculate bill using calculation engine
  let calculation;
  try {
    calculation = calculateBill(bill.people, bill.items, {
      taxRate: bill.adjustments.taxRate,
      serviceChargeRate: bill.adjustments.serviceChargeRate,
      discountAmount: bill.adjustments.discountAmount,
    });
  } catch (error) {
    console.error("CALCULATION ERROR:", error);
    calculation = null;
  }

  const personMap = new Map(bill.people.map((p) => [p.id, p]));

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/bill"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go to Editor</span>
          </Link>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            <Share2 className="h-3 w-3" />
            Read-Only Shared Bill
          </span>
        </div>

        {/* Title Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb]">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                {bill.title || "Shared Bill"}
              </h1>
              <p className="text-xs text-slate-400">
                {bill.people.length} people • {bill.items.length} items
              </p>
            </div>
          </div>
        </div>

        {/* Bill Summary */}
        {calculation ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                BILL BREAKDOWN
              </h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Subtotal</span>
                  <span className="font-bold text-slate-950">
                    {formatCurrency(calculation.subtotal)}
                  </span>
                </div>

                {calculation.tax > 0 && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Tax ({bill.adjustments.taxRate}%)</span>
                    <span>{formatCurrency(calculation.tax)}</span>
                  </div>
                )}

                {calculation.serviceCharge > 0 && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Service ({bill.adjustments.serviceChargeRate}%)</span>
                    <span>{formatCurrency(calculation.serviceCharge)}</span>
                  </div>
                )}

                {calculation.discount > 0 && (
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Discount</span>
                    <span className="font-semibold text-emerald-600">
                      -{formatCurrency(calculation.discount)}
                    </span>
                  </div>
                )}

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

            {/* Each Person Breakdown */}
            {calculation.people.length > 0 && (
              <div className="pt-5 border-t border-slate-100 space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  EACH PERSON
                </h2>
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
                          <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                            {person?.avatarColor && (
                              <span
                                className="h-3 w-3 rounded-full inline-block"
                                style={{ backgroundColor: person.avatarColor }}
                              />
                            )}
                            {name}
                          </span>
                          <span className="font-extrabold text-slate-950 text-sm">
                            {formatCurrency(pBreakdown.grandTotal)}
                          </span>
                        </div>

                        {/* Items listed for person */}
                        {pBreakdown.items && pBreakdown.items.length > 0 && (
                          <div className="space-y-1 text-slate-600 pt-1 pb-1">
                            {pBreakdown.items.map((item) => (
                              <div
                                key={item.itemId}
                                className="flex items-center justify-between text-[11px]"
                              >
                                <span className="truncate max-w-[200px]">
                                  {item.itemName} ({item.itemQuantity}x)
                                </span>
                                <span>{formatCurrency(item.amount)}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="space-y-1 text-slate-500 font-medium pt-1 border-t border-slate-200/40">
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

            {/* Copy Summary Action */}
            <div className="pt-4 border-t border-slate-100">
              <SharedCopyButton calculation={calculation} people={bill.people} />
            </div>
          </div>
        ) : null}

        {/* CTA to Editor */}
        <div className="pt-6 border-t border-slate-200/60 text-center space-y-3">
          <p className="text-sm font-medium text-slate-500">
            Want to split your own bill?
          </p>
          <Link
            href="/bill"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563eb] py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create New Bill</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
