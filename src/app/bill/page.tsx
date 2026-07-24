import Link from "next/link";

export default function BillPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Editor Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            ← SplitBill
          </Link>
        </div>
      </header>

      {/* Editor Content Shell */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            New Bill
          </h1>
          <p className="mt-1 text-slate-600">
            Start by adding everyone who&apos;s sharing this bill.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {/* PEOPLE SECTION */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              People
            </h2>
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <h3 className="font-semibold text-slate-900">
                No people added yet
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Add everyone who&apos;s sharing this bill.
              </p>
              <button className="mt-6 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                + Add Person
              </button>
            </div>
          </section>

          {/* ITEMS SECTION */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Items
            </h2>
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <h3 className="font-semibold text-slate-900">
                No items yet
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Add your first item to start splitting the bill.
              </p>
              <button className="mt-6 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                + Add Item
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
