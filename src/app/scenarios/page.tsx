import { Suspense } from "react";
import AppShell from "@/components/shell/AppShell";
import ScenariosView from "@/components/scenarios/ScenariosView";

export const metadata = {
  title: "Scenarios - LeetSkills",
};

export default function ScenariosPage() {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <ScenariosView />
      </Suspense>
    </AppShell>
  );
}
