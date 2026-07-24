import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight"
        >
          SplitBill
        </Link>

        <a
          href="https://github.com/arvindgk97/bill-splitter-nextjs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-slate-600 transition hover:text-slate-900"
        >
          GitHub ↗
        </a>
      </div>
    </header>
  );
}
