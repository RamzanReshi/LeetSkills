"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserIcon, SearchIcon } from "@/components/ui/Icons";

const navLinks: { name: string; href: string; color?: string }[] = [
  { name: "Problems", href: "/library" },
  { name: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-[50px] max-w-[1200px] items-center justify-between px-4">
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-6 h-full">
          <Link href="/" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <div className="relative h-6 w-6">
              <Image
                src="/logo-v2.png"
                alt="LeetSkills Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-neutral-900">
              Leet<span className="text-neutral-500 font-medium">Skills</span>
            </span>
          </Link>

          <div className="flex items-center h-full gap-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex h-full items-center text-[14px] font-medium transition-colors ${
                    isActive 
                      ? "text-neutral-900 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-neutral-900" 
                      : link.color || "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Side: Search, Icons, Profile */}
        <div className="flex items-center gap-4">
          {/* Search Box */}
          <div className="relative hidden md:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="h-8 w-40 rounded-md bg-neutral-100 pl-9 pr-3 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-300 transition-all"
            />
          </div>

          <Link
            href="/profile"
            aria-label="Open profile"
            className="h-8 w-8 overflow-hidden rounded-full bg-neutral-100 p-1 hover:ring-2 hover:ring-neutral-200 transition-all"
          >
            <UserIcon className="h-full w-full text-neutral-400" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
