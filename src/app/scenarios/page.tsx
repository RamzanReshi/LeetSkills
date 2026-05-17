"use client";

import { Suspense, useEffect } from "react";
import AppShell from "@/components/shell/AppShell";
import ScenariosView from "@/components/scenarios/ScenariosView";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function ScenariosPage() {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t("scenarios.metaTitle");
  }, [t]);

  return (
    <AppShell>
      <Suspense fallback={null}>
        <ScenariosView />
      </Suspense>
    </AppShell>
  );
}
