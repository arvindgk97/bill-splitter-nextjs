import Link from "next/link";
import { BillEditor } from "@/components/bill/bill-editor";

export default function BillPage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900 flex flex-col">
      {/* Editor Header */}
      <header className="w-full bg-[#f6f8fb]">
        <div className="mx-auto flex h-16 max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl items-center px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-950 hover:opacity-80 transition"
          >
            <span className="h-3.5 w-3.5 rounded-full bg-[#2563eb] inline-block" />
            SplitBill
          </Link>
        </div>
      </header>

      {/* Editor Content */}
      <main className="flex-1 pb-16">
        <BillEditor />
      </main>
    </div>
  );
}
