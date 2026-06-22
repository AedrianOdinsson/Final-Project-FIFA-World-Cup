"use client";

import {
  Users,
  Building2,
  Target,
  Map as MapIcon,
  LifeBuoy,
  LogOut,
  Goal,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Aside() {
  const pathname = usePathname();
  const navItems = [
    { label: "Teams", icon: Users, active: true },
    { label: "Host Cities", icon: Building2, active: false },
    { label: "Matches", icon: Target, active: false },
    { label: "Map", icon: MapIcon, active: false },
  ];

  return (
    <aside className="flex h-screen w-[220px] flex-shrink-0 flex-col border-r border-[#2a2a2a]/50 bg-[#111111]">
      <div className="flex-shrink-0 px-4 pb-4 pt-3.5">
        <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg border border-[#333333]/50 bg-[#1a1a1a]">
          <Goal size={18} className="text-[#aaaaaa]" />
        </div>
        <div className="text-[13px] font-semibold text-[#e8e8e8]">
          FIFA World Cup
        </div>
        <div className="mt-px text-[11px] text-[#555555]">2026 Tracking</div>
      </div>

      <nav className="flex-shrink-0 py-2">
        {navItems.map(({ label, icon: Icon, active }) => (
          <div
            key={label}
            className={`flex cursor-pointer items-center gap-2.5 px-4 py-2.5 ${
              active
                ? "bg-[#1c1c1c] text-white"
                : "text-[#777777] hover:bg-[#1a1a1a] hover:text-[#cccccc]"
            }`}
          >
            <Icon size={17} />
            {label}
          </div>
        ))}
      </nav>

      <div className="min-h-0 flex-1" />

      <div className="flex-shrink-0 border-t border-[#2a2a2a]/50 px-4 pb-4 pt-3">
        <button className="mb-1 block w-full rounded-md bg-white py-[11px] text-center text-[12px] font-semibold tracking-[0.07em] text-black">
          LIVE UPDATES
        </button>
        <div className="flex cursor-pointer items-center gap-2.5 py-2.5 text-[13px] text-[#666666]">
          <LifeBuoy size={17} /> Support
        </div>
        <div className="flex cursor-pointer items-center gap-2.5 py-2.5 text-[13px] text-[#666666]">
          <LogOut size={17} /> Logout
        </div>
      </div>
    </aside>
  );
}
