/**
 * ============================================================
 * PÁGINA DE REPORTES (/reportes) — Sprint 5
 * ============================================================
 *
 * Tiene 2 pestañas:
 *
 *   1. REPORTE DE CITAS:
 *      Filtros: fechaInicio, fechaFin, veterinario, estado.
 *      Tabla de resultados con todas las citas que cumplan los filtros.
 *
 *   2. HISTORIAL COMPLETO POR MASCOTA:
 *      Selecciona una mascota y se carga su:
 *      - Información general (especie, raza, propietario)
 *      - Lista de historiales clínicos (con sus tratamientos)
 *      - Lista de citas (con sus tratamientos y veterinario)
 *
 * Las dos vistas usan los endpoints del backend:
 *   GET /reportes/citas?fechaInicio=&fechaFin=&usuarioId=&estado=
 *   GET /reportes/historial-completo/:mascId
 */
'use client';

import { useEffect, useState } from 'react';
import {
  reportesService,
  type FiltrosCitas,
  type HistorialCompleto,
} from '@/services/reportes.service';
import { mascotasService } from '@/services/mascotas.service';
import { usuariosService } from '@/services/usuarios.service';
import type { Cita } from '@/interfaces/cita.interface';
import type { Mascota } from '@/interfaces/mascota.interface';
import type { Usuario } from '@/interfaces/usuario.interface';

type Tab = 'citas' | 'historial';

const estadoStyles: Record<string, string> = {
  programada: 'bg-blue-100 text-blue-700',
  completada: 'bg-green-100 text-green-700',
  cancelada: 'bg-gray-200 text-gray-600',
};

export default function ReportesPage() {
  const [tab, setTab] = useState<Tab>('citas');

  // ── Datos compartidos (mascotas + veterinarios para los filtros) ──
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [veterinarios, setVeterinarios] = useState<Usuario[]>([]);

  // ── Estado del reporte de citas ──
  const [filtros, setFiltros] = useState<FiltrosCitas>({});
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loadingCitas, setLoadingCitas] = useState(false);

  // ── Estado del historial completo ──
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(0);
  const [historial, setHistorial] = useState<HistorialCompleto | null>(null);
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  const [error, setError] = useState('');

  // Cargar mascotas y veterinarios una sola vez
  useEffect(() => {
    (async () => {
      try {
        const [mData, uData] = await Promise.all([
          mascotasService.findAll(),
          usuariosService.findAll(),
        ]);
        setMascotas(mData);
        setVeterinarios(uData.filter((u) => u.rol === 'veterinario'));
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos auxiliares');
      }
    })();
  }, []);

  /** Ejecutar el reporte de citas con los filtros actuales. */
  const ejecutarReporteCitas = async () => {
    try {
      setLoadingCitas(true);
      setError('');
      const data = await reportesService.reporteCitas(filtros);
      setCitas(data);
    } catch (err: any) {
      setError(err.message || 'Error al generar reporte');
    } finally {
      setLoadingCitas(false);
    }
  };

  /** Cargar historial completo cuando se selecciona una mascota. */
  useEffect(() => {
    if (mascotaSeleccionada === 0) {
      setHistorial(null);
      return;
    }
    (async () => {
      try {
        setLoadingHistorial(true);
        setError('');
        const data = await reportesService.historialCompleto(
          mascotaSeleccionada,
        );
        setHistorial(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar historial');
      } finally {
        setLoadingHistorial(false);
      }
    })();
  }, [mascotaSeleccionada]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6">
        <button
          onClick={() => setTab('citas')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            tab === 'citas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Reporte de Citas
        </button>
        <button
          onClick={() => setTab('historial')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            tab === 'historial'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Historial Completo
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 border border-red-200">
          {error}
        </div>
      )}

      {/* ── PESTAÑA: Reporte de Citas ──────────────────── */}
      {tab === 'citas' && (
        <div>
          <div className="bg-white p-4 rounded shadow mb-4">
            <h2 className="font-semibold mb-3">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Fecha inicio
                </label>
                <input
                  type="date"
                  value={filtros.fechaInicio ?? ''}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      fechaInicio: e.target.value || undefined,
                    })
                  }
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Fecha fin
                </label>
                <input
                  type="date"
                  value={filtros.fechaFin ?? ''}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      fechaFin: e.target.value || undefined,
                    })
                  }
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Veterinario
                </label>
                <select
                  value={filtros.usuarioId ?? ''}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      usuarioId: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className="border rounded p-2 w-full"
                >
                  <option value="">Todos</option>
                  {veterinarios.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Estado
                </label>
                <select
                  value={filtros.estado ?? ''}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      estado:
                        (e.target.value as
                          | 'programada'
                          | 'completada'
                          | 'cancelada') || undefined,
                    })
                  }
                  className="border rounded p-2 w-full"
                >
                  <option value="">Todos</option>
                  <option value="programada">Programada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={ejecutarReporteCitas}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Generar reporte
              </button>
              <button
                onClick={() => {
                  setFiltros({});
                  setCitas([]);
                }}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Limpiar
              </button>
            </div>
          </div>

          {loadingCitas ? (
            <p>Cargando reporte...</p>
          ) : citas.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hay datos. Ajusta los filtros y pulsa &quot;Generar reporte&quot;.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded shadow text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Hora</th>
                    <th className="p-3">Mascota</th>
                    <th className="p-3">Propietario</th>
                    <th className="p-3">Veterinario</th>
                    <th className="p-3">Motivo</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Tratam.</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="p-3">{c.id}</td>
                      <td className="p-3">{c.fecha.slice(0, 10)}</td>
                      <td className="p-3">{c.hora}</td>
                      <td className="p-3">
                        {c.mascota?.nombre ?? `ID ${c.mascotaId}`}
                      </td>
                      <td className="p-3">
                        {c.mascota?.propietario
                          ? `${c.mascota.propietario.nombres} ${c.mascota.propietario.apellidos}`
                          : '—'}
                      </td>
                      <td className="p-3">
                        {c.usuario?.nombre ?? `ID ${c.usuarioId}`}
                      </td>
                      <td className="p-3">{c.motivo}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            estadoStyles[c.estado] ??
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {c.estado}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {(c as any).tratamientos?.length ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-500 mt-2">
                Total: {citas.length} cita{citas.length === 1 ? '' : 's'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── PESTAÑA: Historial Completo ─────────────────── */}
      {tab === 'historial' && (
        <div>
          <div className="bg-white p-4 rounded shadow mb-4">
            <label className="block text-xs text-gray-500 mb-1">
              Selecciona una mascota
            </label>
            <select
              value={mascotaSeleccionada}
              onChange={(e) =>
                setMascotaSeleccionada(Number(e.target.value))
              }
              className="border rounded p-2 w-full md:w-1/2"
            >
              <option value={0}>-- Seleccionar Mascota --</option>
              {mascotas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} ({m.especie}
                  {m.propietario
                    ? ` — ${m.propietario.nombres} ${m.propietario.apellidos}`
                    : ''}
                  )
                </option>
              ))}
            </select>
          </div>

          {loadingHistorial ? (
            <p>Cargando historial...</p>
          ) : !historial ? (
            <p className="text-gray-500 text-sm">
              Selecciona una mascota para ver su historial completo.
            </p>
          ) : (
            <div className="space-y-6">
              {/* Datos de la mascota */}
              <div className="bg-white rounded shadow p-5">
                <h2 className="text-lg font-semibold mb-3">
                  {historial.nombre}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Especie</p>
                    <p className="font-medium">{historial.especie}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Raza</p>
                    <p className="font-medium">{historial.raza}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fecha nac.</p>
                    <p className="font-medium">
                      {historial.fechaNacimiento.slice(0, 10)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Propietario</p>
                    <p className="font-medium">
                      {historial.propietario
                        ? `${historial.propietario.nombres} ${historial.propietario.apellidos}`
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Historiales clínicos */}
              <div className="bg-white rounded shadow p-5">
                <h3 className="font-semibold mb-3">
                  Historiales clínicos ({historial.historiales.length})
                </h3>
                {historial.historiales.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Sin historiales registrados.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {historial.historiales.map((h) => (
                      <div
                        key={h.id}
                        className="border rounded p-3 bg-gray-50"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">
                            {h.fecha.slice(0, 10)} — {h.diagnostico}
                          </span>
                          <span className="text-xs text-gray-500">
                            #{h.id}
                          </span>
                        </div>
                        {h.observaciones && (
                          <p className="text-sm text-gray-600 mb-2">
                            {h.observaciones}
                          </p>
                        )}
                        {h.tratamientos.length > 0 && (
                          <div className="text-xs">
                            <p className="font-medium text-gray-700 mb-1">
                              Tratamientos:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              {h.tratamientos.map((t: any) => (
                                <li key={t.id}>
                                  {t.medicamento} — {t.dosis} ({t.duracion})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Citas */}
              <div className="bg-white rounded shadow p-5">
                <h3 className="font-semibold mb-3">
                  Citas ({historial.citas.length})
                </h3>
                {historial.citas.length === 0 ? (
                  <p className="text-gray-500 text-sm">Sin citas registradas.</p>
                ) : (
                  <div className="space-y-3">
                    {historial.citas.map((c) => (
                      <div
                        key={c.id}
                        className="border rounded p-3 bg-gray-50"
                      >
                        <div className="flex justify-between mb-2 items-start">
                          <div>
                            <p className="font-medium">
                              {c.fecha.slice(0, 10)} — {c.hora}
                            </p>
                            <p className="text-sm text-gray-600">
                              {c.motivo} — Veterinario:{' '}
                              {c.usuario?.nombre ?? '—'}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              estadoStyles[c.estado] ??
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {c.estado}
                          </span>
                        </div>
                        {c.tratamientos.length > 0 && (
                          <div className="text-xs">
                            <p className="font-medium text-gray-700 mb-1">
                              Tratamientos:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              {c.tratamientos.map((t: any) => (
                                <li key={t.id}>
                                  {t.medicamento} — {t.dosis} ({t.duracion})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
