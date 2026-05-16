"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, CompassIcon, UserIcon } from "@/components/ui/Icons";

const NAV_ITEMS = [
  { href: "/library", label: "Library", icon: BookIcon },
  { href: "/path", label: "Path", icon: CompassIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
];

export default function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const activeHref =
    pathname?.startsWith("/path") || pathname?.startsWith("/quest")
      ? "/path"
      : pathname?.startsWith("/profile")
        ? "/profile"
      : "/library";

  return (
    <nav className="flex flex-col gap-1 p-4">
      <p className="px-3 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
        Practice
      </p>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === activeHref;
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={[
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-brand-mint text-brand-primary border-l-2 border-brand-primary pl-[10px]"
                : "text-neutral-700 hover:bg-neutral-100",
            ].join(" ")}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
