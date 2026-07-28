"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
};

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-7 border-none shadow-2xl bg-white">
        <DialogHeader className="p-0 mb-2">
          <DialogTitle className="text-xl font-extrabold text-slate-950 tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-500/20 hover:bg-red-700 transition active:scale-95 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
