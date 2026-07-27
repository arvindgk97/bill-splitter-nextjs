import Link from "next/link";

export function Hero() {
  return (
    <section className="px-6 pt-10 pb-6 text-center">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
          Split bills without the headache.
        </h1>

        <p className="mt-3.5 text-base sm:text-lg text-slate-500 font-normal leading-relaxed">
          Add your friends, items, and let us do the math.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            href="/bill"
            className="inline-flex rounded-full bg-[#2563eb] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 active:scale-95"
          >
            Create New Bill
          </Link>
        </div>
      </div>
    </section>
  );
}
