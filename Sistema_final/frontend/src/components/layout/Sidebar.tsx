/**
 * ============================================================
 * COMPONENTE SIDEBAR RESPONSIVO — Sprint 4
 * ============================================================
 *
 * COMPORTAMIENTO RESPONSIVO:
 *   - Pantallas md+ (≥768px): sidebar fija de 240px a la izquierda.
 *   - Pantallas sm (<768px): sidebar oculta por defecto, se muestra
 *     como overlay/drawer desde la izquierda al pulsar el botón
 *     "hamburguesa" del Header.
 *
 * COMUNICACIÓN CON LAYOUT:
 *   El layout pasa `open` y `onClose` como props. El padre controla
 *   el estado para que el botón hamburguesa del Header pueda abrirla.
 *
 * USO de usePathname():
 *   Para resaltar el item activo. Cierra el drawer al navegar (en móvil)
 *   llamando a onClose() en el onClick del Link.
 */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard',     label: 'Dashboard' },
  { href: '/usuarios',      label: 'Usuarios' },
  { href: '/propietarios',  label: 'Propietarios' },
  { href: '/mascotas',      label: 'Mascotas' },
  { href: '/citas',         label: 'Citas' },
  { href: '/historial',     label: 'Historial Clínico' },
  { href: '/tratamientos',  label: 'Tratamientos' },
  { href: '/reportes',      label: 'Reportes' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay oscuro (solo en móvil cuando está abierto) */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-60 bg-white border-r border-gray-200
          flex flex-col
          transform transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            🐾 Veterinaria
          </h2>
          {/* Botón cerrar (solo en móvil) */}
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-gray-600 text-xl"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 py-4 border-t border-gray-200 text-xs text-gray-400">
          Programación Web — 2026A
        </div>
      </aside>
    </>
  );
}