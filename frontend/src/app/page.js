"use client";

import { Fragment, useState } from "react";
 import {
  Plane,
  MapPin,
  TrendingUp,
  Globe2,
  Shield,
  ChevronDown,
  Satellite,
  Activity,
  Building2,
  Map as MapIcon,
} from "lucide-react";
import Link from "next/link";

const EDT = [
  {
    pais: "Argentina",
    bandera: "🇦🇷",
    base: "Miami, FL",
    viajes: [
      {
        desde: "MIA",
        hacia: "DFW",
        vs: "Arabia Saudita",
        km: 1780,
        fecha: "14 JUN",
      },
      { desde: "DFW", hacia: "HOU", vs: "México", km: 370, fecha: "18 JUN" },
    ],
    totalKm: 2150,
    partidos: 3,
  },
  {
    pais: "Brasil",
    bandera: "🇧🇷",
    base: "Orlando, FL",
    viajes: [
      { desde: "MCO", hacia: "LAX", vs: "Suecia", km: 3540, fecha: "13 JUN" },
      { desde: "LAX", hacia: "SFO", vs: "Suiza", km: 540, fecha: "17 JUN" },
      { desde: "SFO", hacia: "SEA", vs: "Camerún", km: 1090, fecha: "21 JUN" },
    ],
    totalKm: 5170,
    partidos: 3,
  },
  {
    pais: "Francia",
    bandera: "🇫🇷",
    base: "NYC, NY",
    viajes: [
      { desde: "JFK", hacia: "BOS", vs: "Perú", km: 300, fecha: "15 JUN" },
      { desde: "BOS", hacia: "PHL", vs: "Japón", km: 450, fecha: "19 JUN" },
    ],
    totalKm: 750,
    partidos: 3,
  },
  {
    pais: "Inglaterra",
    bandera: "🏴",
    base: "Atlanta, GA",
    viajes: [
      {
        desde: "ATL",
        hacia: "MCI",
        vs: "Dinamarca",
        km: 1100,
        fecha: "14 JUN",
      },
      { desde: "MCI", hacia: "SEA", vs: "Irán", km: 2410, fecha: "18 JUN" },
      { desde: "SEA", hacia: "YVR", vs: "Senegal", km: 190, fecha: "22 JUN" },
    ],
    totalKm: 3700,
    partidos: 3,
  },
  {
    pais: "España",
    bandera: "🇪🇸",
    base: "Washington, DC",
    viajes: [
      {
        desde: "IAD",
        hacia: "MIA",
        vs: "Costa Rica",
        km: 1480,
        fecha: "13 JUN",
      },
      { desde: "MIA", hacia: "DFW", vs: "Alemania", km: 1780, fecha: "17 JUN" },
    ],
    totalKm: 3260,
    partidos: 3,
  },
  {
    pais: "Alemania",
    bandera: "🇩🇪",
    base: "Chicago, IL",
    viajes: [
      { desde: "ORD", hacia: "YYZ", vs: "Marruecos", km: 700, fecha: "14 JUN" },
      {
        desde: "YYZ",
        hacia: "YVR",
        vs: "Corea del Sur",
        km: 3350,
        fecha: "18 JUN",
      },
    ],
    totalKm: 4050,
    partidos: 3,
  },
  {
    pais: "Estados Unidos",
    bandera: "🇺🇸",
    base: "Los Ángeles, CA",
    viajes: [
      { desde: "LAX", hacia: "SEA", vs: "Ghana", km: 1530, fecha: "12 JUN" },
      { desde: "SEA", hacia: "JFK", vs: "Portugal", km: 3880, fecha: "16 JUN" },
      { desde: "JFK", hacia: "PHL", vs: "Egipto", km: 150, fecha: "20 JUN" },
    ],
    totalKm: 5560,
    partidos: 3,
  },
  {
    pais: "México",
    bandera: "🇲🇽",
    base: "Ciudad de México",
    viajes: [
      { desde: "MEX", hacia: "GDL", vs: "Polonia", km: 460, fecha: "11 JUN" },
      { desde: "GDL", hacia: "MTY", vs: "Australia", km: 680, fecha: "15 JUN" },
    ],
    totalKm: 1140,
    partidos: 3,
  },
  {
    pais: "Portugal",
    bandera: "🇵🇹",
    base: "San Francisco, CA",
    viajes: [
      { desde: "SFO", hacia: "LAX", vs: "Serbia", km: 540, fecha: "14 JUN" },
      { desde: "LAX", hacia: "MCI", vs: "Nigeria", km: 2180, fecha: "18 JUN" },
    ],
    totalKm: 2720,
    partidos: 3,
  },
  {
    pais: "Japón",
    bandera: "🇯🇵",
    base: "Vancouver, CA",
    viajes: [
      { desde: "YVR", hacia: "SEA", vs: "Croacia", km: 190, fecha: "13 JUN" },
      { desde: "SEA", hacia: "SFO", vs: "Colombia", km: 1090, fecha: "17 JUN" },
    ],
    totalKm: 1280,
    partidos: 3,
  },
  {
    pais: "Países Bajos",
    bandera: "🇳🇱",
    base: "Boston, MA",
    viajes: [
      { desde: "BOS", hacia: "PHL", vs: "Ecuador", km: 450, fecha: "12 JUN" },
      { desde: "PHL", hacia: "JFK", vs: "Uruguay", km: 150, fecha: "16 JUN" },
    ],
    totalKm: 600,
    partidos: 3,
  },
  {
    pais: "Croacia",
    bandera: "🇭🇷",
    base: "Filadelfia, PA",
    viajes: [
      { desde: "PHL", hacia: "YYZ", vs: "Bélgica", km: 540, fecha: "13 JUN" },
      { desde: "YYZ", hacia: "BOS", vs: "Chile", km: 690, fecha: "17 JUN" },
    ],
    totalKm: 1230,
    partidos: 3,
  },
  {
    pais: "Canadá",
    bandera: "🇨🇦",
    base: "Toronto, ON",
    viajes: [
      { desde: "YYZ", hacia: "YVR", vs: "Paraguay", km: 3350, fecha: "12 JUN" },
      { desde: "YVR", hacia: "SEA", vs: "Egipto", km: 190, fecha: "16 JUN" },
    ],
    totalKm: 3540,
    partidos: 3,
  },
  {
    pais: "Senegal",
    bandera: "🇸🇳",
    base: "Kansas City, MO",
    viajes: [
      {
        desde: "MCI",
        hacia: "ATL",
        vs: "Inglaterra",
        km: 1100,
        fecha: "14 JUN",
      },
      {
        desde: "ATL",
        hacia: "MIA",
        vs: "Corea del Sur",
        km: 960,
        fecha: "18 JUN",
      },
    ],
    totalKm: 2060,
    partidos: 3,
  },
  {
    pais: "Uruguay",
    bandera: "🇺🇾",
    base: "Houston, TX",
    viajes: [
      { desde: "HOU", hacia: "DFW", vs: "Serbia", km: 370, fecha: "13 JUN" },
      { desde: "DFW", hacia: "MEX", vs: "Ecuador", km: 1520, fecha: "17 JUN" },
    ],
    totalKm: 1890,
    partidos: 3,
  },
  {
    pais: "Colombia",
    bandera: "🇨🇴",
    base: "Miami, FL",
    viajes: [
      { desde: "MIA", hacia: "ATL", vs: "Japón", km: 960, fecha: "13 JUN" },
      { desde: "ATL", hacia: "MCO", vs: "Suiza", km: 650, fecha: "17 JUN" },
    ],
    totalKm: 1610,
    partidos: 3,
  },
];

const SQUARE = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-red-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-lime-500",
  "bg-orange-500",
  "bg-sky-500",
  "bg-fuchsia-500",
  "bg-teal-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-yellow-500",
  "bg-green-500",
];

function fatiga(km) {
  const idx = +(km / 1300).toFixed(1);
  if (idx < 1.8) return { label: `BAJA (${idx})`, color: "text-emerald-400" };
  if (idx < 3.2) return { label: `MEDIA (${idx})`, color: "text-amber-400" };
  return { label: `ALTA (${idx})`, color: "text-red-400" };
}

const TOTAL_KM = EDT.reduce((s, e) => s + e.totalKm, 0);
const STATS = [
  {
    label: "SELECCIONES MONITOREADAS",
    valor: String(EDT.length),
    icono: Globe2,
  },
  {
    label: "PARTIDOS RASTREADOS",
    valor: String(EDT.length * 3),
    icono: TrendingUp,
  },
  { label: "CIUDADES SEDE", valor: "16", icono: MapPin },
  { label: "PAÍSES ANFITRIONES", valor: "3", icono: Shield },
];

function HeroVisual() {
  const cols = 14,
    rows = 9;
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({ x: 20 + c * 27, y: 20 + r * 27, key: `${r}-${c}` });
    }
  }
  const arcs = [
    "M40,200 C150,40 280,40 380,140",
    "M80,260 C200,320 300,260 360,80",
    "M30,100 C140,220 250,180 370,240",
  ];
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <style>{`
        @keyframes dashmove { to { stroke-dashoffset: -200; } }
        @keyframes pulse2 { 0%,100% { opacity:.25; r:2; } 50% { opacity:1; r:3.2; } }
      `}</style>
      {dots.map((d) => (
        <circle
          key={d.key}
          cx={d.x}
          cy={d.y}
          r="1.4"
          fill="white"
          opacity="0.12"
        />
      ))}
      {arcs.map((p, i) => (
        <path
          key={i}
          d={p}
          fill="none"
          stroke="white"
          strokeOpacity="0.55"
          strokeWidth="1"
          strokeDasharray="6 6"
          style={{ animation: `dashmove ${6 + i}s linear infinite` }}
        />
      ))}
      {[
        [40, 200],
        [380, 140],
        [80, 260],
        [360, 80],
        [30, 100],
        [370, 240],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="2.5"
          fill="white"
          style={{ animation: `pulse2 ${2 + i * 0.4}s ease-in-out infinite` }}
        />
      ))}
    </svg>
  );
}

export default function Home() {
  const [open, setOpen] = useState(null);
  const ordenadas = [...EDT].sort((a, b) => b.totalKm - a.totalKm);
  const top5 = ordenadas.slice(0, 5);
  const maxKm = top5[0].totalKm;

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{`
        @keyframes riseIn { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* NAVBAR */}
      <header className="sticky top-0 z-10 border-b border-neutral-900 bg-black/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-sm font-black leading-tight tracking-tight">
            FIFA 2026
            <br />
            ANALYTICS
          </div>
          <nav className="hidden items-center gap-7 text-[13px] font-medium text-neutral-400 md:flex"></nav>
          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <button className="rounded-md border border-neutral-700 px-4 py-1.5 text-[13px] font-semibold text-white transition hover:border-neutral-500">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="rounded-md bg-white px-4 py-1.5 text-[13px] font-semibold text-black transition hover:bg-neutral-200">
                Register
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-neutral-900">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-950 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-neutral-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              LIVE LOGISTICS ENGINE 2026
            </div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              El Futuro de la Logística Deportiva
            </h1>
            <p className="mt-5 max-w-md leading-relaxed text-neutral-400">
              Anticipamos cada movimiento. Una plataforma de análisis predictivo
              diseñada para optimizar el rendimiento de las selecciones a través
              de los tres países anfitriones.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/dashboard/analysis">
                <button className="rounded-md bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:bg-neutral-200">
                  Empezar Análisis →
                </button>
              </Link>
              <Link href="/login">
                <button className="flex items-center gap-2 rounded-md border border-neutral-700 px-5 py-2.5 text-sm font-bold text-white transition hover:border-neutral-500">
                  <MapIcon size={15} /> Ver Mapa en Vivo
                </button>
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b border-neutral-900">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-6 py-10 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="px-2 text-center sm:border-l sm:border-neutral-900 sm:first:border-l-0"
              style={{
                animation: "riseIn .5s ease forwards",
                animationDelay: `${i * 70}ms`,
                opacity: 0,
              }}
            >
              <div className="text-3xl font-black md:text-4xl">{s.valor}</div>
              <div className="mt-1 text-[10px] font-semibold tracking-[0.12em] text-neutral-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ECOSISTEMA DE DATOS */}
      <section className="border-b border-neutral-900">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-neutral-500">
            PLATAFORMA
          </p>
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">
            Ecosistema de Datos
          </h2>
          <div className="mt-3 h-0.5 w-12 bg-white" />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
              <Satellite size={20} className="mb-4 text-neutral-400" />
              <h3 className="text-base font-bold">
                Seguimiento en Tiempo Real
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-500">
                Monitorea cada kilómetro de las selecciones. Rastreo de
                traslados terrestres y aéreos en tiempo real.
              </p>
              <div className="mt-6 grid grid-cols-12 gap-1">
                {Array.from({ length: 36 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-1 w-1 rounded-full bg-neutral-700"
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
              <Activity size={20} className="mb-4 text-neutral-400" />
              <h3 className="text-base font-bold">Métricas de Fatiga</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-500">
                Algoritmos para predecir el rendimiento físico en base a viajes,
                husos horarios y altitud de cada sede.
              </p>
              <div className="mt-6 flex h-16 items-end gap-2">
                {top5.map((t) => (
                  <div
                    key={t.pais}
                    className="flex-1 rounded-sm bg-neutral-700"
                    style={{ height: `${(t.totalKm / maxKm) * 100}%` }}
                    title={t.pais}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
              <Building2 size={20} className="mb-4 text-neutral-400" />
              <h3 className="text-base font-bold">Optimización de Sedes</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-500">
                Análisis de bases de entrenamiento en las 16 ciudades
                anfitrionas para minimizar el impacto del traslado.
              </p>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {EDT.slice(0, 6).map((e) => (
                  <span
                    key={e.pais}
                    className="rounded border border-neutral-800 px-2 py-1 text-[11px] text-neutral-400"
                  >
                    {e.base.split(",")[0]}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-teal-950 via-neutral-950 to-neutral-950 p-6">
              <div>
                <h3 className="text-base font-bold">
                  Explora el Mapa Interactivo
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-neutral-400">
                  Visualización completa de la infraestructura del torneo 2026
                  en tiempo real.
                </p>
              </div>
              <Link href="/login" className="mt-6 w-fit">
                <button className="w-fit rounded-md border border-neutral-600 bg-black/40 px-4 py-2 text-[13px] font-bold text-white transition hover:border-neutral-400">
                  Abrir Mapa Completo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TABLA */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-neutral-500">
                RESUMEN OPERATIVO
              </p>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                Estado Logístico por Selección
              </h2>
            </div>
            <span className="font-mono text-[11px] text-neutral-500">
              ACTUALIZADO: {String(new Date().getUTCHours()).padStart(2, "0")}:
              {String(new Date().getUTCMinutes()).padStart(2, "0")} UTC
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950 text-[10px] font-bold tracking-[0.14em] text-neutral-500">
                  <th className="px-5 py-4">SELECCIÓN</th>
                  <th className="hidden px-5 py-4 md:table-cell">
                    BASE DE ENTRENAMIENTO
                  </th>
                  <th className="px-5 py-4">KM RECORRIDOS</th>
                  <th className="px-5 py-4">FATIGA INDEX</th>
                  <th className="px-5 py-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {ordenadas.map((e, i) => {
                  const f = fatiga(e.totalKm);
                  const enTransito = i < 4;
                  const isOpen = open === e.pais;
                  return (
                    <Fragment key={e.pais}>
                      <tr
                        onClick={() => setOpen(isOpen ? null : e.pais)}
                        className="cursor-pointer transition hover:bg-neutral-950"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`h-2.5 w-2.5 rounded-sm ${SQUARE[i % SQUARE.length]}`}
                            />
                            <span className="text-base">{e.bandera}</span>
                            <span className="font-bold">{e.pais}</span>
                            <ChevronDown
                              size={13}
                              className={`text-neutral-500 transition ${isOpen ? "rotate-180" : ""}`}
                            />
                          </div>
                        </td>
                        <td className="hidden px-5 py-4 text-neutral-400 md:table-cell">
                          {e.base}
                        </td>
                        <td className="px-5 py-4 font-mono font-bold">
                          {e.totalKm.toLocaleString()} km
                        </td>
                        <td
                          className={`px-5 py-4 font-mono text-xs font-bold ${f.color}`}
                        >
                          {f.label}
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded border border-neutral-700 px-2 py-1 text-[10px] font-bold tracking-wide text-neutral-300">
                            {enTransito ? "IN TRANSIT" : "STATIONARY"}
                          </span>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr key={`${e.pais}-d`} className="bg-neutral-950">
                          <td colSpan={5} className="px-5 py-5">
                            <div className="flex flex-wrap gap-2.5">
                              {e.viajes.map((v, j) => (
                                <div
                                  key={j}
                                  className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-black px-3 py-2 text-xs"
                                >
                                  <Plane
                                    size={12}
                                    className="text-neutral-500"
                                  />
                                  <span className="font-semibold">
                                    {v.desde} → {v.hacia}
                                  </span>
                                  <span className="text-neutral-500">
                                    vs {v.vs}
                                  </span>
                                  <span className="font-mono text-neutral-500">
                                    {v.km}km
                                  </span>
                                  <span className="text-neutral-600">
                                    {v.fecha}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-neutral-500">
            Total monitoreado: {TOTAL_KM.toLocaleString()} km · Clic en una fila
            para ver el itinerario.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-10 text-[12px] text-neutral-500">
          <div className="font-black tracking-tight text-white">
            FIFA 2026 ANALYTICS
          </div>
          <p>
            © 2026 FIFA World Cup Logistics Division. Datos estimados de
            desplazamiento.
          </p>
          <div className="flex gap-5">
            <a className="transition hover:text-white" href="#">
              Privacy Policy
            </a>
            <a className="transition hover:text-white" href="#">
              Terms of Service
            </a>
            <a className="transition hover:text-white" href="#">
              API Documentation
            </a>
            <a className="transition hover:text-white" href="#">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
