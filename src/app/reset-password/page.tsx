import AuthCard from "@/components/auth/AuthCard";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthCard titleKey="auth.resetTitle" subtitleKey="auth.resetSubtitle">
      <ResetPasswordForm />
    </AuthCard>
  );
}
