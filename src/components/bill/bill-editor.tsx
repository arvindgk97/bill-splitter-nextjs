"use client";

import { useState } from "react";
import { useBillStore } from "@/store/bill-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { calculateBill } from "@/lib/calculations/calculate-bill";
import { BillCalculation } from "@/lib/calculations/types";
import { PeopleSection } from "./people-section";
import { ItemsSection } from "./items-section";
import { AdjustmentsSection } from "./adjustments-section";
import { BillSummary } from "./bill-summary";

export function BillEditor() {
  const isMounted = useIsMounted();
  const people = useBillStore((state) => state.people);
  const items = useBillStore((state) => state.items);
  const adjustments = useBillStore((state) => state.adjustments);

  const [calculation, setCalculation] = useState<BillCalculation | null>(null);

  const displayPeople = isMounted ? people : [];
  const displayItems = isMounted ? items : [];

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

  return (
    <div className="mx-auto max-w-md sm:max-w-xl md:max-w-4xl lg:max-w-6xl px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: People, Items, Adjustments */}
        <div className="lg:col-span-7 space-y-10">
          <PeopleSection />
          <ItemsSection />
          <AdjustmentsSection />
        </div>

        {/* Right Column: Bill Summary & Calculate Action */}
        <div className="lg:col-span-5 lg:sticky lg:top-8">
          <BillSummary
            calculation={calculation}
            people={displayPeople}
            onCalculate={handleCalculateBill}
            taxRate={adjustments.taxRate}
            serviceChargeRate={adjustments.serviceChargeRate}
            discountAmount={adjustments.discountAmount}
          />
        </div>
      </div>
    </div>
  );
}
