import { PeopleSection } from "./people-section";
import { ItemsSection } from "./items-section";

export function BillEditor() {
  return (
    <div className="mx-auto max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl px-6 py-6 space-y-10">
      <PeopleSection />

      <ItemsSection />

      {/* Adjustments Section */}
      <section>
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            ADJUSTMENTS
          </h2>
          <p className="mt-1 text-sm text-slate-500 font-normal">
            Tax, service charges, and discounts (Coming soon).
          </p>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center text-sm font-normal text-slate-400 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          Adjustments will be configured in the next step.
        </div>
      </section>
    </div>
  );
}
