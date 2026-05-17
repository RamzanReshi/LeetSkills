import AppShell from "@/components/shell/AppShell";
import ProfileSettingsView from "@/components/profile/ProfileSettingsView";

export const metadata = {
  title: "Settings - LeetSkills",
};

export default function SettingsPage() {
  return (
    <AppShell>
      <ProfileSettingsView />
    </AppShell>
  );
}
