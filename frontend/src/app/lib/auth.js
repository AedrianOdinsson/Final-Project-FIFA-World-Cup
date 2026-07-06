// Helper simple de sesión de usuario.
// Guarda el usuario devuelto por /api/login o /api/user/register en localStorage
// para poder identificar al usuario en el resto de la app (dashboard, selecciones, etc.)

const STORAGE_KEY = "wc_user";

export function setCurrentUser(user) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearCurrentUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}