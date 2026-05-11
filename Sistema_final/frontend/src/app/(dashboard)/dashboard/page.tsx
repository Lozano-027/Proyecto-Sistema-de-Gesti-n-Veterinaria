/**
 * ============================================================
 * DASHBOARD ADMINISTRATIVO (/dashboard) — Sprint 4
 * ============================================================
 *
 * Muestra:
 *   1. SECCIÓN DE TARJETAS:
 *      - Total Propietarios
 *      - Total Mascotas
 *      - Citas Hoy
 *      - Citas Programadas
 *      - Total Historiales
 *      - Total Citas
 *
 *   2. SECCIÓN DE PRÓXIMAS CITAS:
 *      Tabla con las próximas 5 citas no canceladas (fecha >= hoy).
 *
 * EFICIENCIA:
 *   Hace 2 peticiones en paralelo (resumen + próximas citas) para que
 *   la página cargue rápido. Los conteos vienen del endpoint del backend
 *   /reportes/resumen, que ejecuta los counts en una sola transacción.
 *
 * RESPONSIVE GRID:
 *   - Móvil (default): 1 columna
 *   - Tablet (sm:): 2 columnas
 *   - Desktop (lg:): 3 columnas
 */
'use client';

import { useEffect, useState } from 'react';
import StatCard from '@/components/StatCard';
import { reportesService } from '@/services/reportes.service';
import type { ResumenDashboard } from '@/interfaces/resumen.interface';
import type { Cita } from '@/interfaces/cita.interface';

const estadoStyles: Record<string, string> = {
  programada: 'bg-blue-100 text-blue-700',
  completada: 'bg-green-100 text-green-700',
  cancelada: 'bg-gray-200 text-gray-600',
};

export default function DashboardPage() {
  const [resumen, setResumen] = useState<ResumenDashboard | null>(null);
  const [proximas, setProximas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const [r, p] = await Promise.all([
          reportesService.getResumen(),
          reportesService.proximasCitas(5),
        ]);
        setResumen(r);
        setProximas(p);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Cargando dashboard...</p>;
  if (error)
    return (
      <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200">
        {error}
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Tarjetas de resumen */}
      {resumen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Propietarios"
            value={resumen.totalPropietarios}
            accent="border-blue-500 text-blue-600"
            icon="👥"
          />
          <StatCard
            label="Mascotas"
            value={resumen.totalMascotas}
            accent="border-green-500 text-green-600"
            icon="🐾"
          />
          <StatCard
            label="Citas Hoy"
            value={resumen.citasHoy}
            accent="border-yellow-500 text-yellow-600"
            icon="📅"
          />
          <StatCard
            label="Citas Programadas"
            value={resumen.citasProgramadas}
            accent="border-indigo-500 text-indigo-600"
            icon="🗓️"
          />
          <StatCard
            label="Historiales Clínicos"
            value={resumen.totalHistoriales}
            accent="border-purple-500 text-purple-600"
            icon="📋"
          />
          <StatCard
            label="Total Citas"
            value={resumen.totalCitas}
            accent="border-gray-500 text-gray-600"
            icon="📊"
          />
        </div>
      )}

      {/* Próximas citas */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Próximas Citas</h2>
        {proximas.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No hay citas programadas próximamente.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="py-2">Fecha</th>
                  <th className="py-2">Hora</th>
                  <th className="py-2">Mascota</th>
                  <th className="py-2">Veterinario</th>
                  <th className="py-2">Motivo</th>
                  <th className="py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {proximas.map((c) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="py-2">{c.fecha.slice(0, 10)}</td>
                    <td className="py-2">{c.hora}</td>
                    <td className="py-2">
                      {c.mascota?.nombre ?? `ID ${c.mascotaId}`}
                    </td>
                    <td className="py-2">
                      {c.usuario?.nombre ?? `ID ${c.usuarioId}`}
                    </td>
                    <td className="py-2">{c.motivo}</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          estadoStyles[c.estado] ?? 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {c.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
