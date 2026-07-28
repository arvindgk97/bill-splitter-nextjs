"use client";

import { useState, useEffect } from "react";
import { Person } from "@/types/bill";
import { useBillStore } from "@/store/bill-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

type EditPersonDialogProps = {
  person: Person | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditPersonDialog({
  person,
  open,
  onOpenChange,
}: EditPersonDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const updatePerson = useBillStore((state) => state.updatePerson);

  useEffect(() => {
    if (person) {
      setName(person.name);
      setError("");
    }
  }, [person]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (val.trim()) {
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!person) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setError("⚠ Name is required.");
      return;
    }
    updatePerson(person.id, trimmed);
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-7 border-none shadow-2xl bg-white">
        <DialogHeader className="p-0 mb-4">
          <DialogTitle className="text-2xl font-extrabold text-slate-950 tracking-tight">
            Edit Person
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="edit-person-name"
              className="text-sm font-medium text-slate-400"
            >
              Name
            </label>
            <input
              id="edit-person-name"
              type="text"
              placeholder="Enter name"
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
            <DialogClose
              render={
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              }
            />
            <button
              type="submit"
              className="rounded-full bg-[#2563eb] px-7 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95"
            >
              Save
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
