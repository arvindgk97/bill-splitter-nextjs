"use client";

import { useState } from "react";
import { BillItem } from "@/types/bill";
import { useBillStore } from "@/store/bill-store";
import { formatCurrency } from "@/lib/format-currency";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";

const AVATAR_PALETTE = [
  "bg-[#2563eb]", // Blue
  "bg-[#10b981]", // Emerald Green
  "bg-[#0d9488]", // Teal
  "bg-[#8b5cf6]", // Purple
  "bg-[#f59e0b]", // Amber
  "bg-[#ec4899]", // Pink
];

type ItemCardProps = {
  item: BillItem;
  onEdit?: (item: BillItem) => void;
};

export function ItemCard({ item, onEdit }: ItemCardProps) {
  const people = useBillStore((state) => state.people);
  const removeItem = useBillStore((state) => state.removeItem);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const ids = item.personIds || item.assignedMemberIds || [];
  const participants = people.filter((person) => ids.includes(person.id));
  const participantNames = participants.map((p) => p.name).join(" · ");

  return (
    <>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-extrabold text-slate-950 text-lg sm:text-xl">
              {item.name}
            </h3>
            <p className="mt-1 text-base font-medium text-slate-700">
              {formatCurrency(item.price)} × {item.quantity}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                  aria-label="Item options"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => onEdit?.(item)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit item
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setIsConfirmOpen(true)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Shared by / Participants Section */}
        <div className="mt-4 pt-3 border-t border-slate-100/80 space-y-2">
          <span className="inline-block rounded-md bg-slate-100/90 px-2 py-0.5 text-xs font-medium text-slate-500">
            Shared by
          </span>

          {participants.length > 0 ? (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                {participants.map((person) => {
                  const globalIndex = people.findIndex((p) => p.id === person.id);
                  const bgClass = person.avatarColor
                    ? ""
                    : AVATAR_PALETTE[
                        (globalIndex >= 0 ? globalIndex : 0) %
                          AVATAR_PALETTE.length
                      ];

                  return (
                    <div
                      key={person.id}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${bgClass}`}
                      style={
                        person.avatarColor
                          ? { backgroundColor: person.avatarColor }
                          : undefined
                      }
                      title={person.name}
                    >
                      {person.name ? person.name.charAt(0).toUpperCase() : "?"}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs font-normal text-slate-500">
                {participantNames}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/60">
              <span>⚠ This item has no participants.</span>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Delete item?"
        description={`Are you sure you want to delete "${item.name}"?`}
        onConfirm={() => removeItem(item.id)}
      />
    </>
  );
}
