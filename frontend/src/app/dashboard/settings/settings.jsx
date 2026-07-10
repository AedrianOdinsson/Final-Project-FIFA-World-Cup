"use client";
import { useEffect, useState } from "react";
import { getCurrentUser, setCurrentUser } from "../../lib/auth";

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return initials.join("") || "?";
}

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);
    if (current) {
      setName(current.name || "");
      setEmail(current.email || "");
    }
  }, []);

  async function handleSave() {
    setError("");
    setSuccess("");

    if (!user) {
      setError("Tu sesión expiró, vuelve a iniciar sesión");
      return;
    }

    if (!name.trim() || !email.trim()) {
      setError("El nombre y el email no pueden estar vacíos");
      return;
    }

    if (password && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          ...(password ? { password } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || "No se pudo actualizar el perfil");
        return;
      }
      setCurrentUser(data.user);
      setUser(data.user);
      setPassword("");
      setConfirmPassword("");
      setSuccess("Cambios guardados correctamente");
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-[#0f0f0f] px-6 sm:px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-white tracking-tight mb-1">
          Configuración de la Cuenta
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Administra tu nombre, email y contraseña.
        </p>

        {/* Alerta de Error */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-2">
            <svg
              className="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Alerta de Éxito */}
        {success && (
          <div className="mb-6 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm flex items-center gap-2">
            <svg
              className="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
          </div>
        )}

        {/* Tarjeta Perfil */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 rounded-full bg-[#242424] border border-gray-700 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-inner">
              {getInitials(name)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white truncate">
                {name || "Sin nombre"}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5 truncate">
                {user ? `ID de usuario: ${user.id}` : "Sesión no iniciada"}
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end justify-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1">
                Estado
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                En línea
              </span>
            </div>
          </div>
        </div>

        {/* Tarjeta Información Personal */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-5 sm:p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Información Personal
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                Nombre Completo
              </label>
              <input
                className="bg-[#242424] border border-gray-700/50 text-white text-sm rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-500 focus:bg-[#2a2a2a] transition-colors w-full placeholder-gray-600"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                Correo Electrónico
              </label>
              <input
                className="bg-[#242424] border border-gray-700/50 text-white text-sm rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-500 focus:bg-[#2a2a2a] transition-colors w-full placeholder-gray-600"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                Nueva Contraseña
              </label>
              <input
                className="bg-[#242424] border border-gray-700/50 text-white text-sm rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-500 focus:bg-[#2a2a2a] transition-colors w-full placeholder-gray-600"
                type="password"
                placeholder="Dejar en blanco para no cambiarla"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                Confirmar Contraseña
              </label>
              <input
                className="bg-[#242424] border border-gray-700/50 text-white text-sm rounded-md px-3 py-2.5 focus:outline-none focus:border-gray-500 focus:bg-[#2a2a2a] transition-colors w-full placeholder-gray-600"
                type="password"
                placeholder="Repite la nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Fila del botón guardar */}
          <div className="flex justify-end pt-5 border-t border-gray-800/50">
            <button
              className="bg-white text-black text-sm font-semibold px-6 py-2.5 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleSave}
              disabled={saving}
            >
              {saving && (
                <svg
                  className="animate-spin h-4 w-4 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
