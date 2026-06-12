import styles from "./settings.module.css";

export default function SettingsPage() {
  return (
    <div className={styles.page}>

      <h1 className={styles.title}>Configuración del Sistema</h1>
      <p className={styles.subtitle}>
        Administre sus credenciales, preferencias de interfaz y parámetros de
        operación para la flota de TransFlow.
      </p>

      {/* Tarjeta Perfil */}
      <div className={styles.card}>
        <div className={styles.profileRow}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>JR</div>
            <span className={styles.cameraBtn}>📷</span>
          </div>
          <div className={styles.profileInfo}>
            <strong className={styles.profileName}>Javier Rodríguez</strong>
            <span className={styles.profileMeta}>
              Gestor de Operaciones Senior • ID: TF-4492
            </span>
            <button className={styles.changePhotoBtn}>Cambiar Foto de Perfil</button>
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
            <input className={styles.input} defaultValue="Javier Rodriguez" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>CORREO ELECTRÓNICO</label>
            <input className={styles.input} defaultValue="j.rodriguez@transflow.tech" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>ROL OPERATIVO</label>
            <input className={`${styles.input} ${styles.inputDisabled}`} defaultValue="Fleet Manager" disabled />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>NÚMERO DE TELÉFONO</label>
            <input className={styles.input} defaultValue="+34 612 345 678" />
          </div>
        </div>
        <div className={styles.saveRow}>
          <button className={styles.saveBtn}>Guardar Cambios</button>
        </div>
      </div>

      {/* Tarjeta Preferencias */}
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>⊞ Preferencias del Sistema</h2>
        <div className={styles.prefsGrid}>
          <div>
            <label className={styles.label}>IDIOMA Y REGIÓN</label>
            <p className={styles.prefDesc}>
              Personalice el idioma de la interfaz y formatos de datos.
            </p>
            <select className={styles.select}>
              <option>Español (España)</option>
              <option>Español (México)</option>
              <option>English (US)</option>
            </select>
          </div>
          <div>
            <label className={styles.label}>INTERFAZ VISUAL</label>
            <p className={styles.prefDesc}>
              Configure la densidad de datos y el modo visual.
            </p>
            <div className={styles.themeToggle}>
              <button className={`${styles.themeBtn} ${styles.themeBtnActive}`}>
                ☀️ CLARO
              </button>
              <button className={`${styles.themeBtn} ${styles.themeBtnDark}`}>
                🌙 OSCURO
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}