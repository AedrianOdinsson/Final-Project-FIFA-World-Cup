"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Columna izquierda — imagen estadio */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/stadium.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col justify-end p-12 pb-16">
          <h1 className="text-5xl font-black text-white uppercase leading-tight tracking-tight">
            FIFA 2026
            <br />
            ANALYTICS
          </h1>
          <p className="mt-4 text-gray-300 text-sm max-w-xs leading-relaxed">
            Plataforma de inteligencia táctica y rendimiento. Accede a la matriz
            de datos más completa del torneo.
          </p>
        </div>
      </div>

      {/* Columna derecha — formulario */}
      <div className="w-full lg:w-1/2 bg-[#0f0f0f] flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Accede a tu cuenta para consultar métricas y seguimiento del torneo.
          </p>

          <div className="flex flex-col gap-5">
            {/* Correo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Correo Electrónico
              </label>
              <div className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus-within:border-gray-400 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="bg-transparent text-white text-sm placeholder-gray-600 outline-none w-full"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Contraseña
                </label>
                <Link
                  href="/recuperar"
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus-within:border-gray-400 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-gray-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-transparent text-white text-sm placeholder-gray-600 outline-none w-full"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-300 shrink-0 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Botón */}
            <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-bold text-sm py-4 rounded-lg transition-colors duration-150 mt-1">
              Iniciar Sesión
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-white font-semibold hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
