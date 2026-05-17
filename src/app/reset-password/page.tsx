import AuthCard from "@/components/auth/AuthCard";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Choose a new password - LeetSkills",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Choose a new password" subtitle="Enter a new password for your account.">
      <ResetPasswordForm />
    </AuthCard>
  );
}
