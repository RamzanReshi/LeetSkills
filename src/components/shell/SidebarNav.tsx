"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, CompassIcon, DashboardIcon, SettingsIcon, UserIcon } from "@/components/ui/Icons";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/scenarios", label: "Scenarios", icon: BookIcon },
  { href: "/path", label: "Paths", icon: CompassIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function SidebarNav({
  onNavigate,
  isCollapsed = false,
  onToggleCollapse,
}: {
  onNavigate?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();
  const activeHref =
    pathname?.startsWith("/dashboard")
      ? "/dashboard"
      : pathname?.startsWith("/path") || pathname?.startsWith("/quest")
      ? "/path"
      : pathname?.startsWith("/settings") || pathname?.startsWith("/profile/settings")
      ? "/settings"
      : pathname?.startsWith("/profile")
      ? "/profile"
      : "/scenarios";

  return (
    <nav className={`h-full flex flex-col gap-1 transition-all duration-300 ${isCollapsed ? "items-center p-2" : "p-4"}`}>
      {/* Toggle button — always at the top, same position */}
      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`mb-1 flex items-center rounded-lg text-neutral-400 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-600 ${
            isCollapsed ? "h-10 w-10 justify-center" : "gap-2 px-3 py-2"
          }`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!isCollapsed && <span className="text-xs font-medium">Collapse</span>}
        </button>
      )}

      {!isCollapsed && (
        <p className="px-3 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
          Navigation
        </p>
      )}

      <div className={`flex flex-col gap-1 ${isCollapsed ? "items-center" : ""}`}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === activeHref;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-label={label}
              title={isCollapsed ? label : undefined}
              className={[
                "flex items-center rounded-lg text-sm font-medium transition-colors",
                isCollapsed ? "h-10 w-10 justify-center" : "gap-3 px-3 py-2",
                active
                  ? isCollapsed
                    ? "bg-brand-mint text-brand-primary"
                    : "border-l-2 border-brand-primary bg-brand-mint pl-[10px] text-brand-primary"
                  : "text-neutral-700 hover:bg-neutral-100",
              ].join(" ")}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
