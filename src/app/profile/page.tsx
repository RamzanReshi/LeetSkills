import AppShell from "@/components/shell/AppShell";
import ProfileView from "@/components/profile/ProfileView";

export const metadata = {
  title: "Profile - LeetSkills",
};

export default function ProfilePage() {
  return (
    <AppShell>
      <ProfileView />
    </AppShell>
  );
}
