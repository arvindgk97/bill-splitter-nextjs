"use client";

import { useState } from "react";
import { BillItem } from "@/types/bill";
import { useBillStore } from "@/store/bill-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { ItemCard } from "./item-card";
import { AddItemDialog } from "./add-item-dialog";

export function ItemsSection() {
  const isMounted = useIsMounted();
  const items = useBillStore((state) => state.items);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BillItem | null>(null);

  const displayItems = isMounted ? items : [];

  return (
    <section>
      {displayItems.length === 0 ? (
        <>
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ITEMS
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white px-6 py-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center">
            <h3 className="text-2xl font-extrabold text-slate-950">No items yet</h3>
            <p className="mt-2 text-sm font-normal text-slate-400">
              Add your first item to start splitting bill.
            </p>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsAddDialogOpen(true);
              }}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#2563eb] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 active:scale-95"
            >
              + Add Item
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ITEMS
            </h2>
            <p className="text-sm font-normal text-slate-500">
              Add everything ordered in this bill.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              {displayItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onEdit={(itm) => {
                    setEditingItem(itm);
                    setIsAddDialogOpen(true);
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setIsAddDialogOpen(true);
              }}
              className="rounded-xl border border-[#2563eb] bg-white px-5 py-2.5 text-sm font-semibold text-[#2563eb] shadow-xs hover:bg-blue-50/40 transition inline-flex items-center gap-1.5 active:scale-95"
            >
              + Add Item
            </button>
          </div>
        </>
      )}

      <AddItemDialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingItem(null);
        }}
        initialItem={editingItem}
      />
    </section>
  );
}
