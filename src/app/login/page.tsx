import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <AuthCard titleKey="auth.signInTitle" subtitleKey="auth.signInSubtitle">
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </AuthCard>
  );
}
