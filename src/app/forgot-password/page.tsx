import AuthCard from "@/components/auth/AuthCard";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthCard titleKey="auth.forgotTitle" subtitleKey="auth.forgotSubtitle">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
