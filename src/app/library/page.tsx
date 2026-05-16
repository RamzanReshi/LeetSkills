import { Suspense } from "react";
import AppShell from "@/components/shell/AppShell";
import LibraryView from "@/components/library/LibraryView";

export const metadata = {
  title: "Practice Library — LeetSkills",
};

export default function LibraryPage() {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <LibraryView />
      </Suspense>
    </AppShell>
  );
}
