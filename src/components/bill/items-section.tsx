"use client";

import { useState } from "react";
import { BillItem } from "@/types/bill";
import { useBillStore } from "@/store/bill-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { EmptyState } from "./empty-state";
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
      <div className="mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Items
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Add everything ordered in this bill.
        </p>
      </div>

      {displayItems.length === 0 ? (
        <EmptyState
          title="No items yet"
          description="Add your first item to start splitting the bill."
          actionLabel="Add Item"
          onAction={() => {
            setEditingItem(null);
            setIsAddDialogOpen(true);
          }}
        />
      ) : (
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
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            + Add Item
          </button>
        </div>
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
