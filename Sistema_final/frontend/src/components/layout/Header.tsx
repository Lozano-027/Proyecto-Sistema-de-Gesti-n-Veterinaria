/**
 * COMPONENTE HEADER (top bar)
 *
 * Solo visible en móvil (<768px). Contiene el botón "hamburguesa"
 * que abre el drawer del Sidebar.
 *
 * En desktop (md+) se oculta porque la navegación va siempre visible
 * en la sidebar lateral.
 */
'use client';

interface HeaderProps {
  onOpenSidebar: () => void;
}

export default function Header({ onOpenSidebar }: HeaderProps) {
  return (
    <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <button
        onClick={onOpenSidebar}
        className="text-gray-700 hover:text-gray-900"
        aria-label="Abrir menú"
      >
        {/* Icono hamburguesa hecho con divs para no depender de librería */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <h1 className="text-sm font-semibold text-gray-700">🐾 Veterinaria</h1>
      <div className="w-6" /> {/* spacer para centrar el título */}
    </header>
  );
}
