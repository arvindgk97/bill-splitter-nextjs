const features = [
  {
    title: "Split by person",
    description: "Easily assign items to each person.",
  },
  {
    title: "Shared items",
    description: "Split shared expenses automatically.",
  },
  {
    title: "Automatic calculations",
    description: "Calculate tax, service charges, and discounts.",
  },
  {
    title: "Easy sharing",
    description: "Copy the final result and send it to your group.",
  },
];

export function Features() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
