"use client";

import React from "react";
import SidebarNav from "./SidebarNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full">
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-neutral-300 bg-brand-card md:block">
        <SidebarNav />
      </aside>

      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}
