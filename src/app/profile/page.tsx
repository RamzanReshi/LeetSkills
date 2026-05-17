"use client";

import { useEffect } from "react";
import AppShell from "@/components/shell/AppShell";
import ProfileView from "@/components/profile/ProfileView";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function ProfilePage() {
  const { t } = useLanguage();
  useEffect(() => {
    document.title = t("profile.metaTitle");
  }, [t]);
  return (
    <AppShell>
      <ProfileView />
    </AppShell>
  );
}
