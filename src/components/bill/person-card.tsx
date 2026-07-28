"use client";

import { useState } from "react";
import { Person } from "@/types/bill";
import { useBillStore } from "@/store/bill-store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, User, Pencil, Trash2 } from "lucide-react";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";

const AVATAR_PALETTE = [
  "bg-[#2563eb]", // Blue
  "bg-[#10b981]", // Emerald Green
  "bg-[#0d9488]", // Teal
  "bg-[#8b5cf6]", // Purple
  "bg-[#f59e0b]", // Amber
  "bg-[#ec4899]", // Pink
];

type PersonCardProps = {
  person: Person;
  index?: number;
  onEdit?: (person: Person) => void;
};

export function PersonCard({ person, index = 0, onEdit }: PersonCardProps) {
  const removePerson = useBillStore((state) => state.removePerson);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const bgClass = person.avatarColor
    ? ""
    : AVATAR_PALETTE[index % AVATAR_PALETTE.length];

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-white transition hover:bg-slate-50/60">
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-base font-bold text-white shadow-xs shrink-0 ${bgClass}`}
            style={
              person.avatarColor
                ? { backgroundColor: person.avatarColor }
                : undefined
            }
          >
            {person.name ? (
              person.name.charAt(0).toUpperCase()
            ) : (
              <User className="h-5 w-5" />
            )}
          </div>
          <span className="font-semibold text-slate-900 text-base">
            {person.name}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                aria-label="Person options"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => onEdit?.(person)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit name
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setIsConfirmOpen(true)}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete person
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDeleteDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Delete person?"
        description={`Are you sure you want to delete ${person.name}?`}
        onConfirm={() => removePerson(person.id)}
      />
    </>
  );
}
