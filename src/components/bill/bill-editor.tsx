import { PeopleSection } from "./people-section";
import { ItemsSection } from "./items-section";

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

      <div className="space-y-10">
        <PeopleSection />

        <ItemsSection />

        {/* Adjustments Section */}
        <section>
          <div className="mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Adjustments
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Tax, service charges, and discounts (Coming soon).
            </p>
          </div>
          <div className="rounded-xl border border-dashed bg-white p-6 text-center text-sm text-slate-400">
            Adjustments will be configured in the next step.
          </div>
        </section>
      </div>
    </div>
  );
}
