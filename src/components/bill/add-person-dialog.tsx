"use client";

import { useState } from "react";
import { useBillStore } from "@/store/bill-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
      <DialogContent className="sm:max-w-md rounded-3xl p-7 border-none shadow-2xl bg-white">
        <DialogHeader className="p-0 mb-4">
          <DialogTitle className="text-2xl font-extrabold text-slate-950 tracking-tight">
            Add Person
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="person-name" className="text-sm font-medium text-slate-400">
              Name
            </label>
            <input
              id="person-name"
              type="text"
              placeholder="e.g. Yasukaze"
              value={name}
              onChange={handleChange}
              className={`w-full rounded-xl border px-4 py-3 text-base text-slate-900 outline-none transition ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-slate-200 focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
              }`}
              autoFocus
            />
            {error && (
              <p className="text-xs font-medium text-red-600">{error}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <DialogClose render={
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            } />
            <button
              type="submit"
              className="rounded-full bg-[#2563eb] px-7 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95"
            >
              Add
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
