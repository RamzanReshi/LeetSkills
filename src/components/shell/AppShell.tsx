"use client";

import React, { useState, useEffect } from "react";
import SidebarNav from "./SidebarNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebar_collapsed", String(isCollapsed));
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed((current) => !current);
  };

  return (
    <div className="flex w-full">
      <aside
        className={`sticky top-[50px] hidden h-[calc(100vh-50px)] shrink-0 border-r border-neutral-200 bg-brand-card md:block transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-60"
        }`}
      >
        <SidebarNav
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
      </aside>

      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}
