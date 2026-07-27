import { UserPlus, ReceiptText, Percent, Check } from "lucide-react";

const featuresList = [
  {
    title: "Split by person",
    description: "Easily assign items to each person.",
    icon: UserPlus,
    badgeBg: "bg-blue-50/80",
    iconColor: "text-[#2563eb]",
  },
  {
    title: "Add shared items",
    description: "Split shared expenses automatically.",
    icon: ReceiptText,
    badgeBg: "bg-emerald-50/80",
    iconColor: "text-emerald-600",
  },
  {
    title: "Automatic calculations",
    description: "Tax, service charge, and discounts included.",
    icon: Percent,
    badgeBg: "bg-blue-50/80",
    iconColor: "text-[#2563eb]",
  },
  {
    title: "Easy to share",
    description: "Copy the result and send it to your group.",
    icon: Check,
    badgeBg: "bg-emerald-50/80",
    iconColor: "text-emerald-600",
  },
];

export function Features() {
  return (
    <section className="px-6 py-6">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {featuresList.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition hover:shadow-md"
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.badgeBg} ${item.iconColor}`}
                >
                  <Icon className="h-7 w-7 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs sm:text-sm text-slate-500 font-normal leading-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-12 text-center text-xs sm:text-sm font-medium text-slate-400">
          Built for group expenses
        </p>
      </div>
    </section>
  );
}
