import Link from "next/link";

export function Hero() {
  return (
    <section className="px-4 py-20 text-center sm:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 inline-flex rounded-full border bg-white px-3 py-1 text-sm text-slate-600">
          Simple bill splitting
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
          Split bills without the headache.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Add your friends, assign items, and let us calculate
          everyone&apos;s share automatically.
        </p>

        <div className="mt-8">
          <Link
            href="/bill"
            className="inline-flex rounded-lg bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Create New Bill
          </Link>
        </div>
      </div>
    </section>
  );
}
