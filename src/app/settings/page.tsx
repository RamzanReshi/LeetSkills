"use client";

import { useEffect } from "react";
import AppShell from "@/components/shell/AppShell";
import ProfileSettingsView from "@/components/profile/ProfileSettingsView";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function SettingsPage() {
  const { t } = useLanguage();
  useEffect(() => {
    document.title = t("settings.metaTitle");
  }, [t]);
  return (
    <AppShell>
      <ProfileSettingsView />
    </AppShell>
  );
}
