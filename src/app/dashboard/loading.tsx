export default function DashboardLoading() {
  return (
    <main className="container mx-auto flex flex-col items-center gap-8 py-12 px-4 sm:px-6">
      {/* FingerprintHero skeleton */}
      <div className="glass-card w-full max-w-4xl p-8 animate-pulse">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-3 w-28 rounded bg-neutral-200" />
            <div className="h-8 w-56 rounded-lg bg-neutral-200" />
          </div>
          <div className="h-20 w-32 rounded-2xl bg-neutral-200" />
        </div>
        <div className="grid gap-12 lg:grid-cols-[1fr_350px]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="space-y-1">
                    <div className="h-4 w-32 rounded bg-neutral-200" />
                    <div className="h-3 w-48 rounded bg-neutral-100" />
                  </div>
                  <div className="h-6 w-8 rounded bg-neutral-200" />
                </div>
                <div className="h-1.5 rounded-full bg-neutral-200" />
              </div>
            ))}
          </div>
          <div className="hidden lg:block h-72 rounded-full bg-neutral-100" />
        </div>
      </div>

      {/* TodayScenarioCTA skeleton */}
      <div className="glass-card w-full max-w-4xl p-8 animate-pulse">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-3">
            <div className="h-3 w-24 rounded bg-neutral-200" />
            <div className="h-8 w-48 rounded-lg bg-neutral-200" />
            <div className="h-4 w-full rounded bg-neutral-100" />
            <div className="h-4 w-4/5 rounded bg-neutral-100" />
          </div>
          <div className="h-12 w-40 flex-shrink-0 rounded-xl bg-neutral-200" />
        </div>
      </div>

      {/* WeakDimensionBanner skeleton */}
      <div className="glass-card w-full max-w-4xl p-6 animate-pulse">
        <div className="flex items-center gap-6">
          <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-neutral-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-28 rounded bg-neutral-200" />
            <div className="h-5 w-56 rounded bg-neutral-200" />
            <div className="h-3 w-72 rounded bg-neutral-100" />
          </div>
          <div className="hidden sm:block h-20 w-20 flex-shrink-0 rounded-full bg-neutral-200" />
        </div>
      </div>
    </main>
  );
}
