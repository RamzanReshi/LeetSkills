import Link from "next/link";

const DIMENSIONS = [
  {
    name: "Decomposition",
    desc: "Break any problem into its fundamental parts before acting.",
    color: "#3B82F6",
    bg: "#EFF6FF",
    icon: "⊞",
  },
  {
    name: "Hypothesis Quality",
    desc: "Form specific, testable explanations — not vague guesses.",
    color: "#7C3AED",
    bg: "#F5F3FF",
    icon: "◈",
  },
  {
    name: "Reasoning Depth",
    desc: "Connect evidence to conclusions with rigorous logic.",
    color: "#D97706",
    bg: "#FFFBEB",
    icon: "⬡",
  },
  {
    name: "Honesty",
    desc: "Name your uncertainty and limits clearly and confidently.",
    color: "#1F8A5B",
    bg: "#ECFDF3",
    icon: "◎",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Read a scenario",
    desc: "Real-world engineering and analytical challenges — timed, focused, no filler.",
  },
  {
    step: "02",
    title: "Think, then respond",
    desc: "Write your thinking trace first. Then craft your structured final response.",
  },
  {
    step: "03",
    title: "Get AI evaluation",
    desc: "Claude scores you on all 4 dimensions and gives specific, actionable feedback.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 py-20 sm:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-mint/70 via-white to-white pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary mb-5">
            Train Smarter
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-brand-deep leading-tight">
            Build the cognitive skills
            <br className="hidden sm:block" />
            <span className="text-brand-primary"> behind AI-era engineering.</span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Practice real-world scenarios. Get instant AI evaluation.
            Track your cognitive fingerprint across 4 dimensions.
          </p>
          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/dashboard"
              className="btn-primary inline-flex items-center justify-center gap-2 text-base group"
            >
              Open Dashboard
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/scenarios"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-neutral-300 bg-white text-sm font-semibold text-neutral-700 hover:border-brand-primary hover:text-brand-primary transition-colors"
            >
              Browse Scenarios
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Dimensions */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-brand-primary mb-3">
            The Framework
          </p>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-brand-deep mb-10 sm:mb-12">
            4 dimensions of analytical thinking
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DIMENSIONS.map((d) => (
              <div
                key={d.name}
                className="rounded-2xl p-5 sm:p-6 transition-shadow hover:shadow-md"
                style={{ backgroundColor: d.bg, outline: `1px solid ${d.color}22` }}
              >
                <div
                  className="mb-4 w-10 h-10 flex items-center justify-center rounded-xl text-xl"
                  style={{ color: d.color, backgroundColor: `${d.color}18` }}
                >
                  {d.icon}
                </div>
                <h3 className="font-bold text-sm mb-1.5" style={{ color: d.color }}>
                  {d.name}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-mint/40 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-brand-primary mb-3">
            The Loop
          </p>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-brand-deep mb-10 sm:mb-12">
            How it works
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {HOW_IT_WORKS.map((s) => (
              <div
                key={s.step}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200 shadow-sm"
              >
                <p className="font-mono text-3xl font-black text-brand-mint mb-3">{s.step}</p>
                <h3 className="font-bold text-brand-deep mb-2 text-sm sm:text-base">{s.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-deep mb-4">
            Ready to train your analytical mind?
          </h2>
          <p className="text-neutral-600 mb-8 text-sm sm:text-base">
            Start with a 10-minute scenario and see exactly where you stand.
          </p>
          <Link
            href="/scenarios"
            className="btn-primary inline-flex items-center gap-2 text-base group"
          >
            Start your first scenario
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
