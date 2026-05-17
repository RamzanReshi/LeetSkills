import AuthCard from "@/components/auth/AuthCard";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Reset password - LeetSkills",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Reset password" subtitle="Get a secure link to choose a new password.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
