"use client";

import { Person } from "@/types/bill";
import { useBillStore } from "@/store/bill-store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, User, Pencil, Trash2 } from "lucide-react";

type PersonCardProps = {
  person: Person;
  onEdit?: (person: Person) => void;
};

export function PersonCard({ person, onEdit }: PersonCardProps) {
  const removePerson = useBillStore((state) => state.removePerson);

  return (
    <div className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:border-slate-300">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white shadow-xs"
          style={{ backgroundColor: person.avatarColor || "#2563eb" }}
        >
          {person.name ? person.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
        </div>
        <span className="font-medium text-slate-900">{person.name}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              aria-label="Person options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          }
        />
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => onEdit?.(person)} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Edit name
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => removePerson(person.id)}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete person
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
