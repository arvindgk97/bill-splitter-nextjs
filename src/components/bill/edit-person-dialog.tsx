"use client";

import { useState, useEffect } from "react";
import { Person } from "@/types/bill";
import { useBillStore } from "@/store/bill-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

type EditPersonDialogProps = {
  person: Person | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditPersonDialog({ person, open, onOpenChange }: EditPersonDialogProps) {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Person</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="edit-person-name" className="text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="edit-person-name"
              type="text"
              placeholder="Enter name"
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
              Save Changes
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
