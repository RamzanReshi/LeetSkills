"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarNav from "./SidebarNav";
import { MenuIcon, CloseIcon } from "@/components/ui/Icons";

function getPageTitle(pathname: string | null): string {
  if (pathname?.startsWith("/dashboard")) return "Dashboard";
  if (pathname?.startsWith("/scenarios")) return "Scenarios";
  if (pathname?.startsWith("/path") || pathname?.startsWith("/quest")) return "Learning Path";
  if (pathname?.startsWith("/profile")) return "Profile";
  return "LeetSkills";
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="flex w-full">
      <aside className="sticky top-[50px] hidden h-[calc(100vh-50px)] w-60 shrink-0 border-r border-neutral-300 bg-brand-card md:block">
        <SidebarNav />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-neutral-900/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 border-r border-neutral-300 bg-brand-card shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-300">
              <span className="text-sm font-semibold text-brand-deep">Navigation</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-neutral-700 hover:bg-neutral-100"
                aria-label="Close menu"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 border-b border-neutral-300 bg-brand-card px-4 py-2.5 md:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-md p-1.5 text-neutral-700 hover:bg-neutral-100"
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-brand-deep">{pageTitle}</span>
        </div>
        {children}
      </div>
    </div>
  );
}
