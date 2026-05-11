/**
 * Tarjeta reutilizable para mostrar un valor numérico destacado en
 * el dashboard ("Total de Mascotas: 42").
 *
 * Props:
 *   label  — texto descriptivo arriba
 *   value  — el número grande
 *   accent — color del borde/texto (clases Tailwind, default azul)
 *   icon   — emoji o JSX opcional para acompañar
 */
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  accent?: string;
  icon?: ReactNode;
}

export default function StatCard({
  label,
  value,
  accent = 'border-blue-500 text-blue-600',
  icon,
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow p-5 border-l-4 ${accent.split(' ')[0]}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">
            {label}
          </p>
          <p className={`text-3xl font-bold mt-2 ${accent.split(' ')[1] ?? ''}`}>
            {value}
          </p>
        </div>
        {icon && <div className="text-3xl opacity-70">{icon}</div>}
      </div>
    </div>
  );
}
