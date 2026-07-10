"use client";

import {
  Users,
  Building2,
  Target,
  Map as MapIcon,
  LifeBuoy,
  LogOut,
  Goal,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearCurrentUser, getCurrentUser } from "../../lib/auth";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Aside() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  function handleLogout() {
    clearCurrentUser();
    router.push("/login");
  }

  const navItems = [
    { label: "Teams", href: "/dashboard", icon: Users },
    { label: "Analysis", href: "/dashboard/analysis", icon: BarChart3 },
    { label: "Host Cities", href: "/dashboard/host-cities", icon: Building2 },
    { label: "Matches", href: "/dashboard/matches", icon: Target },
    { label: "Map", href: "/dashboard", icon: MapIcon },
  ];

  return (
    <aside className="flex h-screen w-[220px] flex-shrink-0 flex-col border-r border-[#2a2a2a]/50 bg-[#111111]">
      <Link
        href="/"
        className="flex-shrink-0 block px-4 pb-4 pt-3.5 transition hover:bg-[#1a1a1a]"
      >
        <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg border border-[#333333]/50 bg-[#1a1a1a]">
          <Goal size={18} className="text-[#aaaaaa]" />
        </div>
        <div className="text-[13px] font-semibold text-[#e8e8e8]">
          FIFA World Cup
        </div>
        <div className="mt-px text-[11px] text-[#555555]">2026 Tracking</div>
      </Link>

      <nav className="flex-shrink-0 py-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex cursor-pointer items-center gap-2.5 px-4 py-2.5 ${
                active
                  ? "bg-[#1c1c1c] text-white"
                  : "text-[#777777] hover:bg-[#1a1a1a] hover:text-[#cccccc]"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="min-h-0 flex-1" />

      <div className="flex-shrink-0 border-t border-[#2a2a2a]/50 px-4 pb-4 pt-3">
        {user && (
          <Link
            href={"/dashboard/settings"}
            className="mb-3 flex items-center gap-2.5 rounded-lg border border-[#2a2a2a]/70 bg-[#161616] px-2.5 py-2"
          >
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-black">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-semibold text-[#e8e8e8]">
                {user.name}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#4ade80]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                Sesión activa
              </div>
            </div>
          </Link>
        )}
        <div className="flex cursor-pointer items-center gap-2.5 py-2.5 text-[13px] text-[#666666]">
          <LifeBuoy size={17} /> Support
        </div>
        <div
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-2.5 py-2.5 text-[13px] text-[#666666] hover:text-[#cccccc]"
        >
          <LogOut size={17} /> Logout
        </div>
      </div>
    </aside>
  );
}
