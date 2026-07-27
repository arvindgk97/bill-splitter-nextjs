"use client";

import { useState } from "react";
import { Person } from "@/types/bill";
import { useBillStore } from "@/store/bill-store";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { AddPersonDialog } from "./add-person-dialog";
import { EditPersonDialog } from "./edit-person-dialog";
import { PersonCard } from "./person-card";

export function PeopleSection() {
  const isMounted = useIsMounted();
  const people = useBillStore((state) => state.people);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const displayPeople = isMounted ? people : [];

  return (
    <section>
      {displayPeople.length === 0 ? (
        <>
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              PEOPLE
            </h2>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white px-6 py-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center">
            <h3 className="text-2xl font-extrabold text-slate-950">No people yet</h3>
            <p className="mt-2 text-sm font-normal text-slate-400">
              Add everyone sharing bill.
            </p>
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#2563eb] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 active:scale-95"
            >
              + Add Person
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              PEOPLE
            </h2>
            <p className="text-sm font-normal text-slate-500">
              Add everyone sharing this bill.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] divide-y divide-slate-100 overflow-hidden">
              {displayPeople.map((person, index) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  index={index}
                  onEdit={(p) => setEditingPerson(p)}
                />
              ))}
            </div>

            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="rounded-xl border border-[#2563eb] bg-white px-5 py-2.5 text-sm font-semibold text-[#2563eb] shadow-xs hover:bg-blue-50/40 transition inline-flex items-center gap-1.5 active:scale-95"
            >
              + Add Person
            </button>
          </div>
        </>
      )}

      <AddPersonDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      <EditPersonDialog
        person={editingPerson}
        open={Boolean(editingPerson)}
        onOpenChange={(open) => {
          if (!open) setEditingPerson(null);
        }}
      />
    </section>
  );
}
