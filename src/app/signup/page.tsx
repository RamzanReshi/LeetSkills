import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";
import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Create account - LeetSkills",
};

export default function SignupPage() {
  return (
    <AuthCard title="Create account" subtitle="Start a Supabase-backed profile for your practice.">
      <Suspense>
        <AuthForm mode="signup" />
      </Suspense>
    </AuthCard>
  );
}
