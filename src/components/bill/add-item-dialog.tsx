"use client";

import { useState, useEffect } from "react";
import { BillItem } from "@/types/bill";
import { useBillStore } from "@/store/bill-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

type AddItemDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialItem?: BillItem | null;
};

export function AddItemDialog({ open, onOpenChange, initialItem }: AddItemDialogProps) {
  const people = useBillStore((state) => state.people);
  const addItem = useBillStore((state) => state.addItem);
  const updateItem = useBillStore((state) => state.updateItem);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    quantity?: string;
    people?: string;
  }>({});

  const isEditing = Boolean(initialItem);

  useEffect(() => {
    if (open) {
      if (initialItem) {
        setName(initialItem.name);
        setPrice(String(initialItem.price));
        setQuantity(initialItem.quantity);
        setSelectedPersonIds(initialItem.personIds || initialItem.assignedMemberIds || []);
      } else {
        setName("");
        setPrice("");
        setQuantity(1);
        setSelectedPersonIds(people.map((p) => p.id));
      }
      setErrors({});
    }
  }, [open, initialItem, people]);

  const togglePerson = (personId: string) => {
    setSelectedPersonIds((prev) => {
      const updated = prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId];
      if (updated.length > 0) {
        setErrors((err) => ({ ...err, people: undefined }));
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; price?: string; quantity?: string; people?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Item name is required.";
    }

    const numPrice = Number(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (!quantity || quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1.";
    }

    if (selectedPersonIds.length === 0) {
      newErrors.people = "Select at least one person.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditing && initialItem) {
      updateItem(initialItem.id, {
        name: name.trim(),
        price: numPrice,
        quantity: Math.max(1, quantity),
        personIds: selectedPersonIds,
        assignedMemberIds: selectedPersonIds,
      });
    } else {
      addItem(name.trim(), numPrice, Math.max(1, quantity), selectedPersonIds);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-7 border-none shadow-2xl bg-white">
        <DialogHeader className="p-0 mb-4">
          <DialogTitle className="text-2xl font-extrabold text-slate-950 tracking-tight">
            {isEditing ? "Edit Item" : "Add Item"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Name */}
          <div className="space-y-1.5">
            <label htmlFor="item-name" className="text-sm font-medium text-slate-400">
              Item name
            </label>
            <input
              id="item-name"
              type="text"
              placeholder="e.g. Pizza"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className={`w-full rounded-xl border px-4 py-3 text-base text-slate-900 outline-none transition ${
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-slate-200 focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
              }`}
              autoFocus
            />
            {errors.name && <p className="text-xs font-medium text-red-600">⚠ {errors.name}</p>}
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label htmlFor="item-price" className="text-sm font-medium text-slate-400">
              Price
            </label>
            <input
              id="item-price"
              type="number"
              min="0"
              step="500"
              placeholder="120000"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (Number(e.target.value) > 0) setErrors((prev) => ({ ...prev, price: undefined }));
              }}
              className={`w-full rounded-xl border px-4 py-3 text-base text-slate-900 outline-none transition ${
                errors.price
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-slate-200 focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
              }`}
            />
            {errors.price && <p className="text-xs font-medium text-red-600">⚠ {errors.price}</p>}
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <label htmlFor="item-qty" className="text-sm font-medium text-slate-400">
              Quantity
            </label>
            <input
              id="item-qty"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setQuantity(val);
                if (val >= 1) setErrors((prev) => ({ ...prev, quantity: undefined }));
              }}
              className={`w-28 rounded-xl border px-4 py-3 text-base text-slate-900 outline-none transition ${
                errors.quantity
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-slate-200 focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
              }`}
            />
            {errors.quantity && <p className="text-xs font-medium text-red-600">⚠ {errors.quantity}</p>}
          </div>

          {/* Who had this? */}
          <div className="space-y-2.5 pt-1">
            <label className="text-sm font-medium text-slate-400">
              Who had this?
            </label>

            {people.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                No people added yet. Add people first to assign this item.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {people.map((person) => {
                  const isChecked = selectedPersonIds.includes(person.id);
                  return (
                    <label
                      key={person.id}
                      className="flex cursor-pointer items-center gap-3 py-1 transition select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePerson(person.id)}
                        className="h-5 w-5 rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb] cursor-pointer"
                      />
                      <span className="text-base font-medium text-slate-900">{person.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
            {errors.people && <p className="text-xs font-medium text-red-600">⚠ {errors.people}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <DialogClose render={
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            } />
            <button
              type="submit"
              className="rounded-full bg-[#2563eb] px-7 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95"
            >
              {isEditing ? "Save" : "Add Item"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
