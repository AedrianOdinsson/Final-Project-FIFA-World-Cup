export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-3 flex items-center justify-between shrink-0">
      <span className="text-xs text-gray-400">
        TransFlow Fleet Management v2.4.0-pro
      </span>
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <a href="/terminos" className="hover:text-gray-600 transition-colors">
          Términos de Servicio
        </a>
        <a href="/privacidad" className="hover:text-gray-600 transition-colors">
          Privacidad
        </a>
      </div>
    </footer>
  );
}
