"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="w-full bg-[#f6f8fb]">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-950"
        >
          <span className="h-4 w-4 rounded-full bg-[#2563eb] inline-block" />
          SplitBill
        </Link>

        <a
          href="https://github.com/arvindgk97/bill-splitter-nextjs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          [GitHub]
        </a>
      </div>
    </header>
  );
}
