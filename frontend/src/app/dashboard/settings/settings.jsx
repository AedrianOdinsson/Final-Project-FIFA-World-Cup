"use client";
import { useEffect, useState } from "react";
import styles from "./settings.module.css";
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
      const res = await fetch(
        `http://localhost:5000/api/user/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            ...(password ? { password } : {}),
          }),
        },
      );
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
    <div className={styles.page}>
      <h1 className={styles.title}>Configuración de la Cuenta</h1>
      <p className={styles.subtitle}>
        Administra tu nombre, email y contraseña.
      </p>

      {error && (
        <p
          style={{
            marginBottom: "1.25rem",
            padding: "0.5rem 1rem",
            background: "rgba(220,38,38,0.1)",
            color: "#dc2626",
            borderRadius: "8px",
            fontSize: "0.85rem",
          }}
        >
          {error}
        </p>
      )}
      {success && (
        <p
          style={{
            marginBottom: "1.25rem",
            padding: "0.5rem 1rem",
            background: "rgba(22,163,74,0.1)",
            color: "#16a34a",
            borderRadius: "8px",
            fontSize: "0.85rem",
          }}
        >
          {success}
        </p>
      )}

      {/* Tarjeta Perfil */}
      <div className={styles.card}>
        <div className={styles.profileRow}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>{getInitials(name)}</div>
          </div>
          <div className={styles.profileInfo}>
            <strong className={styles.profileName}>
              {name || "Sin nombre"}
            </strong>
            <span className={styles.profileMeta}>
              {user ? `ID de usuario: ${user.id}` : "Sesión no iniciada"}
            </span>
          </div>
          <div className={styles.statusBadge}>
            <span className={styles.statusLabel}>ESTADO</span>
            <span className={styles.statusValue}>EN LÍNEA</span>
          </div>
        </div>
      </div>

      {/* Tarjeta Información Personal */}
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>👤 Información Personal</h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>NOMBRE COMPLETO</label>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>CORREO ELECTRÓNICO</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>NUEVA CONTRASEÑA</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Dejar en blanco para no cambiarla"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>CONFIRMAR CONTRASEÑA</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Repite la nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.saveRow}>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
            style={{ opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}