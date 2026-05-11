/**
 * LAYOUT RAÍZ DE LA APLICACIÓN.
 * Define <html>, <body> y los estilos globales.
 */
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistema de Gestión Veterinaria',
  description: 'Administración veterinaria — clínica de mascotas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
