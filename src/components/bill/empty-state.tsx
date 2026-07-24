type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed bg-white p-8 text-center">
      <h3 className="font-semibold text-slate-900">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {description}
      </p>

      {action ? (
        <div className="mt-6">{action}</div>
      ) : actionLabel ? (
        <button
          onClick={onAction}
          className="mt-6 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          + {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
