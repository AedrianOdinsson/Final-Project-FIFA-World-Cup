"use client";

import {
  Users,
  Building2,
  Target,
  Map as MapIcon,
  LifeBuoy,
  LogOut,
  Search,
  Bell,
  Settings,
  User,
  Plane,
  Bus,
  ArrowRight,
  SlidersHorizontal,
  Crosshair,
  Goal,
} from "lucide-react";
import { useState } from "react";

/**
 * TeamsLiveRoutesPanel
 * --------------------
 * Conversión 1:1 a React + Tailwind del archivo wc2026_panel_right_updated.html
 *
 * NOTA PARA BACKEND:
 * - `routes` es la data mockeada que reemplaza la lista de tarjetas de ruta.
 *   Reemplazar por el fetch real (ej: GET /api/routes) y mapear al mismo shape.
 * - `teamTabs` son los filtros de pestañas (All Teams / ARG / FRA / ENG).
 */

type RouteStatus = "EN ROUTE" | "LANDED";

type RouteCard = {
  id: string;
  team: string;
  mode: "plane" | "bus";
  status: RouteStatus;
  depCode: string;
  arrCode: string;
  progress: number; // 0 - 100
  eta?: string;
};

const teamTabs = ["All Teams", "ARG", "FRA", "ENG"];

const routes: RouteCard[] = [
  {
    id: "arg-1",
    team: "ARG",
    mode: "plane",
    status: "EN ROUTE",
    depCode: "LAX",
    arrCode: "MEX",
    progress: 58,
    eta: "ETA: 2h 15m",
  },
  {
    id: "fra-1",
    team: "FRA",
    mode: "plane",
    status: "LANDED",
    depCode: "YYZ",
    arrCode: "JFK",
    progress: 100,
  },
  {
    id: "usa-1",
    team: "USA",
    mode: "bus",
    status: "EN ROUTE",
    depCode: "HOTEL",
    arrCode: "STAD",
    progress: 65,
    eta: "ETA: 45m",
  },
];

const navItems = [
  { label: "Teams", icon: Users, active: true },
  { label: "Host Cities", icon: Building2, active: false },
  { label: "Matches", icon: Target, active: false },
  { label: "Map", icon: MapIcon, active: false },
];

export default function TeamsLiveRoutesPanel() {
  const [activeTab, setActiveTab] = useState("All Teams");

  const filteredRoutes =
    activeTab === "All Teams"
      ? routes
      : routes.filter((r) => r.team === activeTab);

  return (
    <div className="flex h-[680px] overflow-hidden rounded-2xl bg-[#0d0d0d] text-[13px] text-white">
      {/* SIDEBAR */}
      <aside className="flex h-full w-[220px] flex-shrink-0 flex-col border-r border-[#2a2a2a]/50 bg-[#111111]">
        <div className="flex-shrink-0 px-4 pb-4 pt-3.5">
          <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg border border-[#333333]/50 bg-[#1a1a1a]">
            <Goal size={18} className="text-[#aaaaaa]" />
          </div>
          <div className="text-[13px] font-semibold text-[#e8e8e8]">
            FIFA World Cup
          </div>
          <div className="mt-px text-[11px] text-[#555555]">
            2026 Tracking
          </div>
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

      {/* MAIN */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TOPBAR */}
        <div className="flex h-[52px] flex-shrink-0 items-center gap-4 border-b border-[#2a2a2a]/50 bg-[#0d0d0d] px-5">
          <div className="flex-1 text-[15px] font-medium tracking-[0.08em] text-[#cccccc]">
            WC2026 ANALYTICS
          </div>
          <div className="flex w-[180px] items-center gap-1.5 rounded-md border border-[#2a2a2a]/50 bg-[#1a1a1a] px-3 py-1.5 text-[12px] text-[#888888]">
            <Search size={14} />
            Search routes...
          </div>
          <div className="flex items-center gap-3 text-[#666666]">
            <Bell size={18} />
            <Settings size={18} />
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#444444]/50 bg-[#2a2a2a]">
              <User size={14} className="text-[#888888]" />
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* MAP */}
          <div className="relative flex-1 overflow-hidden bg-[#0d0f1a]">
            <svg
              viewBox="0 0 460 580"
              className="h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="460" height="580" fill="#0d0f1a" />
              <circle cx="90" cy="310" r="8" fill="none" stroke="#555" strokeWidth="1.5" />
              <circle cx="90" cy="310" r="3" fill="#555" />
              <circle cx="230" cy="200" r="8" fill="none" stroke="#555" strokeWidth="1.5" />
              <circle cx="230" cy="200" r="3" fill="#555" />
              <line
                x1="90" y1="310" x2="460" y2="150"
                stroke="#555" strokeWidth="1" strokeDasharray="6,5" opacity="0.5"
              />
              <line
                x1="230" y1="200" x2="460" y2="420"
                stroke="#555" strokeWidth="1" strokeDasharray="6,5" opacity="0.4"
              />
              <rect
                x="300" y="270" width="90" height="70" rx="6"
                fill="#1a1c2e" stroke="#2a2e50" strokeWidth="1.5"
              />
              <text x="345" y="312" textAnchor="middle" fill="#4a5080" fontSize="22">
                ⛰
              </text>
            </svg>
            <div className="absolute bottom-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-[#2a2a3a]/50 bg-[#1a1a2a] text-[#888888]">
              <Crosshair size={16} />
            </div>
          </div>

          {/* PANEL DERECHO */}
          <div className="flex w-[290px] flex-shrink-0 flex-col overflow-hidden border-l border-[#1e2030]/50 bg-[#0d0f1a]">
            <div className="flex flex-shrink-0 items-center justify-between px-4 pb-3 pt-4">
              <div className="flex items-center text-[12px] font-semibold tracking-[0.1em] text-[#cccccc]">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#ef4444]" />
                LIVE ROUTES
              </div>
              <SlidersHorizontal size={16} className="text-[#555555]" />
            </div>

            {/* FILTROS */}
            <div className="flex flex-shrink-0 gap-2 px-4 pb-3.5">
              {teamTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full border px-3.5 py-[5px] text-[12px] ${
                    activeTab === tab
                      ? "border-white bg-white font-semibold text-black"
                      : "border-[#333333] text-[#888888] hover:border-[#555555] hover:text-[#bbbbbb]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* LISTA DE RUTAS */}
            <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-3 pb-3">
              {filteredRoutes.map((route) => (
                <RouteCardItem key={route.id} route={route} />
              ))}
              {filteredRoutes.length === 0 && (
                <div className="px-2 py-6 text-center text-[12px] text-[#555555]">
                  No hay rutas para este equipo.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RouteCardItem({ route }: { route: RouteCard }) {
  const ModeIcon = route.mode === "plane" ? Plane : Bus;

  return (
    <div className="cursor-pointer rounded-[10px] border border-[#1e2235] bg-[#13151f] p-3.5 hover:border-[#2a2e45]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[14px] font-semibold text-[#dddddd]">
          <ModeIcon size={15} className="text-[#aaaaaa]" />
          {route.team}
        </div>
        <span className="rounded border border-[#333333] px-2 py-[3px] text-[10px] font-medium tracking-[0.05em] text-[#cccccc]">
          {route.status}
        </span>
      </div>

      <div className="mb-2.5 grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <div>
          <div className="mb-0.5 text-[10px] tracking-[0.05em] text-[#555555]">
            DEP
          </div>
          <div className="text-[15px] font-bold text-[#e0e0e0]">
            {route.depCode}
          </div>
        </div>

        <div className="flex items-center justify-center px-1">
          <div className="relative h-px w-full bg-[#2a2a3a]">
            <div
              className="absolute -top-[2.5px] h-1.5 w-1.5 rounded-full bg-white"
              style={{ left: `${route.progress}%` }}
            />
          </div>
        </div>

        <div className="text-right">
          <div className="mb-0.5 text-[10px] tracking-[0.05em] text-[#555555]">
            ARR
          </div>
          <div className="text-[15px] font-bold text-[#e0e0e0]">
            {route.arrCode}
          </div>
        </div>
      </div>

      {route.eta && (
        <div className="flex items-center justify-between">
          <div className="text-[12px] text-[#666666]">{route.eta}</div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#2a2a3a] text-[#666666]">
            <ArrowRight size={13} />
          </div>
        </div>
      )}
    </div>
  );
}
