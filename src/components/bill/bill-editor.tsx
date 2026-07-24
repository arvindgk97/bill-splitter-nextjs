import { PeopleSection } from "./people-section";

export function BillEditor() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-500">
          New Bill
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Start splitting your bill
        </h1>

        <p className="mt-2 text-slate-600">
          Add people and items to calculate everyone&apos;s share.
        </p>
      </div>

      <div className="space-y-8">
        <PeopleSection />

        {/* Items */}

        {/* Adjustments */}
      </div>
    </div>
  );
}
