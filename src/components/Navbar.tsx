"use client";

import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "@/components/ui/Icons";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-300 bg-brand-card/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-neutral-100">
            <Image
              src="/logo-light.png"
              alt="LeetSkills Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-brand-deep group-hover:text-brand-primary transition-colors">
            Leet<span className="text-brand-primary">Skills</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-neutral-700 hover:text-brand-primary transition-colors"
          >
            Dashboard
          </Link>
          <div className="h-4 w-[1px] bg-neutral-300" />
          <button className="rounded-full bg-neutral-100 p-1.5 text-neutral-700 hover:bg-brand-mint hover:text-brand-primary transition-all">
            <UserIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
