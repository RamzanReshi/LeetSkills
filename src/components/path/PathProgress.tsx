interface Props {
  completed: number;
  total: number;
}

export default function PathProgress({ completed, total }: Props) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-brand-primary transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-neutral-500">
        {completed === 0
          ? "Start with your first scenario and build momentum."
          : `${completed} of ${total} completed`}
      </p>
    </div>
  );
}
