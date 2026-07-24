"use client";

import { useState } from "react";
import { Person } from "@/types/bill";
import { useBillStore } from "@/store/bill-store";
import { EmptyState } from "./empty-state";
import { AddPersonDialog } from "./add-person-dialog";
import { EditPersonDialog } from "./edit-person-dialog";
import { PersonCard } from "./person-card";

export function PeopleSection() {
  const people = useBillStore((state) => state.people);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          People
        </h2>
      </div>

      {people.length === 0 ? (
        <EmptyState
          title="No people yet"
          description="Add everyone sharing this bill."
          actionLabel="Add Person"
          onAction={() => setIsAddDialogOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            {people.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                onEdit={(p) => setEditingPerson(p)}
              />
            ))}
          </div>

          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            + Add Person
          </button>
        </div>
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
