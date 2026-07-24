"use client";

import { useState } from "react";
import { useBillStore } from "@/store/bill-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

type AddPersonDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
};

export function AddPersonDialog({ open, onOpenChange, trigger }: AddPersonDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen;

  const addPerson = useBillStore((state) => state.addPerson);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName("");
      setError("");
    }
    setIsOpen(newOpen);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (val.trim()) {
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("⚠ Name is required.");
      return;
    }
    addPerson(trimmed);
    setName("");
    setError("");
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger render={trigger as React.ReactElement} />}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Person</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="person-name" className="text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="person-name"
              type="text"
              placeholder="e.g. Yasukaze"
              value={name}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-slate-300 focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
              }`}
              autoFocus
            />
            {error && (
              <p className="text-xs font-medium text-red-600">{error}</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <DialogClose render={
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            } />
            <button
              type="submit"
              className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Add
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
