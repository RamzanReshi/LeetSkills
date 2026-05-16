import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-[calc(100vh-50px)] bg-brand-bg px-4 py-8 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <section className="hidden lg:block">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/logo-v2.png" alt="LeetSkills Logo" width={44} height={44} priority />
            <span className="text-3xl font-bold tracking-tight text-brand-deep">
              Leet<span className="font-normal text-brand-primary">Skills</span>
            </span>
          </Link>
          <h1 className="mt-10 max-w-xl text-5xl font-black leading-tight tracking-tight text-brand-deep">
            Build a private skill profile as you practice.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-neutral-700">
            Your account keeps progress, evaluations, and profile details tied to a Supabase user.
          </p>
        </section>

        <section className="rounded-lg border border-neutral-300 bg-brand-card p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">
              Account
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-deep">{title}</h2>
            <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
