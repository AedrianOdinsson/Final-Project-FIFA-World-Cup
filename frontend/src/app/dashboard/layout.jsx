"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import Aside from "../components/aside/aside";
import PageTransition from "../components/PageTransition";
import { getCurrentUser } from "../lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#050510] text-gray-400 text-sm">
        Verificando sesión...
      </div>
    );
  }

  return (
    <div className="flex-1 flex min-h-0 overflow-y-auto bg-[#050510]">
      <Aside />
      <div className="flex-1 w-full overflow-hidden">
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}