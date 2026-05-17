import AppShell from "@/components/shell/AppShell";
import PathHero from "@/components/path/PathHero";
import PathCard from "@/components/path/PathCard";
import { LEARNING_PATHS } from "@/data/paths";

export const metadata = {
  title: "Paths - LeetSkills",
};

export default function PathPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10 animate-fade-in">
        <PathHero />

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-brand-deep">Choose a path</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Each path bundles related scenarios into a focused growth route.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            {LEARNING_PATHS.map((p) => (
              <PathCard key={p.id} path={p} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
