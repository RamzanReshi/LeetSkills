"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from "@/components/ui/Icons";
import ProfileDropdown from "@/components/navbar/ProfileDropdown";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-[50px] max-w-[1200px] items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
        >
          <div className="relative h-8 w-8">
            <Image
              src="/logo-v2.png"
              alt="LeetSkills Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-brand-deep">
            Leet<span className="text-brand-primary font-normal">Skills</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="h-8 w-40 rounded-md bg-neutral-100 pl-9 pr-3 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-300 transition-all"
            />
          </div>
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
}
