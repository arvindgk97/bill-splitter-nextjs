import Link from "next/link";
import { BillEditor } from "@/components/bill/bill-editor";

export default function BillPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Editor Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            ← SplitBill
          </Link>
        </div>
      </header>

      {/* Editor Content Shell */}
      <main>
        <BillEditor />
      </main>
    </div>
  );
}
