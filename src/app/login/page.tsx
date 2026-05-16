import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Sign in - LeetSkills",
};

export default function LoginPage() {
  return (
    <AuthCard title="Sign in" subtitle="Use your LeetSkills account to continue.">
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </AuthCard>
  );
}
