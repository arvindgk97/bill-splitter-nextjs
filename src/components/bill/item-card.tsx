"use client";

import { BillItem } from "@/types/bill";
import { useBillStore } from "@/store/bill-store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

type ItemCardProps = {
  item: BillItem;
  onEdit?: (item: BillItem) => void;
};

export function ItemCard({ item, onEdit }: ItemCardProps) {
  const people = useBillStore((state) => state.people);
  const removeItem = useBillStore((state) => state.removeItem);

  const ids = item.personIds || item.assignedMemberIds || [];
  const participants = people.filter((person) => ids.includes(person.id));
  const participantNames = participants.map((p) => p.name).join(" · ");

  const total = item.price * item.quantity;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm transition hover:border-slate-300">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{item.name}</h3>
          <p className="mt-1 text-sm text-slate-600">
            <span className="font-medium">{formatCurrency(item.price)}</span> × {item.quantity}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-base font-bold text-slate-950">
              {formatCurrency(total)}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Item options"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit?.(item)} className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" />
                Edit item
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => removeItem(item.id)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Shared by
        </p>
        <p className="mt-1 text-xs font-medium text-slate-600">
          {participantNames || "Nobody assigned"}
        </p>
      </div>
    </div>
  );
}
