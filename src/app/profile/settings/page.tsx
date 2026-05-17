import { redirect } from "next/navigation";

export const metadata = {
  title: "Settings - LeetSkills",
};

export default function ProfileSettingsPage() {
  redirect("/settings");
}
