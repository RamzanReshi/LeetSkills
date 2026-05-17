import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <AuthCard titleKey="auth.signUpTitle" subtitleKey="auth.signUpSubtitle">
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
    </AuthCard>
  );
}
