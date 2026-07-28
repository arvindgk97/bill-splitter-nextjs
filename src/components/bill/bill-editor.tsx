"use client";

import { useState, useEffect } from "react";
import { useBillStore } from "@/store/bill-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { calculateBill } from "@/lib/calculations/calculate-bill";
import { BillCalculation } from "@/lib/calculations/types";
import { PeopleSection } from "./people-section";
import { ItemsSection } from "./items-section";
import { AdjustmentsSection } from "./adjustments-section";
import { BillSummary } from "./bill-summary";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { RotateCcw, Sparkles } from "lucide-react";

export function BillEditor() {
  const isMounted = useIsMounted();
  const people = useBillStore((state) => state.people);
  const items = useBillStore((state) => state.items);
  const adjustments = useBillStore((state) => state.adjustments);
  const resetStore = useBillStore((state) => state.resetStore);
  const loadSampleData = useBillStore((state) => state.loadSampleData);

  const [calculation, setCalculation] = useState<BillCalculation | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const displayPeople = isMounted ? people : [];
  const displayItems = isMounted ? items : [];

  // Invalidate old calculation result whenever data changes
  useEffect(() => {
    setCalculation(null);
  }, [people, items, adjustments]);

  const handleCalculateBill = () => {
    if (displayPeople.length === 0 || displayItems.length === 0) {
      setCalculation(null);
      return;
    }

    try {
      const result = calculateBill(displayPeople, displayItems, adjustments);
      setCalculation(result);
    } catch (err: any) {
      console.error("Calculation Error:", err);
      alert(err.message || "Failed to calculate bill.");
    }
  };

  const handleConfirmReset = () => {
    resetStore();
    setCalculation(null);
  };

  const handleLoadSample = () => {
    loadSampleData();
    setCalculation(null);
  };

  return (
    <div className="w-full max-w-md sm:max-w-xl md:max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 overflow-x-hidden">
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 w-full">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          BILL EDITOR
        </span>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Load Sample
          </button>
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-red-600 transition cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Bill
          </button>
        </div>
      </div>

      {/* Main Layout Grid: Single column on Mobile, 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
        {/* Column 1: People, Items, Adjustments */}
        <div className="lg:col-span-7 space-y-8 lg:space-y-10 w-full">
          <PeopleSection />
          <ItemsSection />
          <AdjustmentsSection />
        </div>

        {/* Column 2: Bill Summary & Action Button */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 w-full">
          <BillSummary
            calculation={calculation}
            people={displayPeople}
            itemsCount={displayItems.length}
            onCalculate={handleCalculateBill}
            taxRate={adjustments.taxRate}
            serviceChargeRate={adjustments.serviceChargeRate}
            discountAmount={adjustments.discountAmount}
          />
        </div>
      </div>

      <ConfirmDeleteDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        title="Reset this bill?"
        description="This will remove all people, items, and adjustments."
        onConfirm={handleConfirmReset}
      />
    </div>
  );
}
