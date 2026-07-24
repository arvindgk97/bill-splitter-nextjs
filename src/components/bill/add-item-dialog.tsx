"use client";

import { useState, useEffect } from "react";
import { BillItem } from "@/types/bill";
import { useBillStore } from "@/store/bill-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

  const handleSelectAll = () => {
    if (selectedPersonIds.length === people.length) {
      setSelectedPersonIds([]);
    } else {
      setSelectedPersonIds(people.map((p) => p.id));
      setErrors((err) => ({ ...err, people: undefined }));
    }
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Item Name */}
          <div className="space-y-1.5">
            <label htmlFor="item-name" className="text-sm font-medium text-slate-700">
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
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                errors.name
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-slate-300 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
              }`}
              autoFocus
            />
            {errors.name && <p className="text-xs font-medium text-red-600">⚠ {errors.name}</p>}
          </div>

          {/* Price & Quantity Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <label htmlFor="item-price" className="text-sm font-medium text-slate-700">
                Price per item (Rp)
              </label>
              <input
                id="item-price"
                type="number"
                min="0"
                step="500"
                placeholder="e.g. 120000"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (Number(e.target.value) > 0) setErrors((prev) => ({ ...prev, price: undefined }));
                }}
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                  errors.price
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-slate-300 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                }`}
              />
              {errors.price && <p className="text-xs font-medium text-red-600">⚠ {errors.price}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="item-qty" className="text-sm font-medium text-slate-700">
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
                className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                  errors.quantity
                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-slate-300 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                }`}
              />
              {errors.quantity && <p className="text-xs font-medium text-red-600">⚠ {errors.quantity}</p>}
            </div>
          </div>

          {/* Who had this? */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                Who had this?
              </label>
              {people.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  {selectedPersonIds.length === people.length ? "Deselect all" : "Select all"}
                </button>
              )}
            </div>

            {people.length === 0 ? (
              <div className="rounded-lg border border-dashed p-3 text-center text-xs text-slate-500">
                No people added yet. Add people first to assign this item.
              </div>
            ) : (
              <div
                className={`max-h-40 space-y-2 overflow-y-auto rounded-lg border p-2.5 transition ${
                  errors.people ? "border-red-500 bg-red-50/20" : "border-slate-200"
                }`}
              >
                {people.map((person) => {
                  const isChecked = selectedPersonIds.includes(person.id);
                  return (
                    <label
                      key={person.id}
                      className="flex cursor-pointer items-center justify-between rounded-md p-1.5 transition hover:bg-slate-50"
                    >
                      <span className="text-sm text-slate-900">{person.name}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePerson(person.id)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-950"
                      />
                    </label>
                  );
                })}
              </div>
            )}
            {errors.people && <p className="text-xs font-medium text-red-600">⚠ {errors.people}</p>}
          </div>

          <DialogFooter className="gap-2 pt-3">
            <DialogClose render={
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            } />
            <button
              type="submit"
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {isEditing ? "Save Changes" : "Add Item"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
