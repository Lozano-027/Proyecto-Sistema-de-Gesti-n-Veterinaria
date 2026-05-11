/**
 * ============================================================
 * PÁGINA HISTORIAL CLÍNICO (/historial) — Sprint 3
 * ============================================================
 *
 * MODOS DE VISTA:
 *   1. SIN FILTRO (mascotaSeleccionada = 0):
 *      - Llama a historialService.findAll() — lista TODOS los historiales
 *      - No muestra controles de paginación
 *      - Muestra columna "Mascota" para identificar a quién pertenece cada uno
 *
 *   2. CON FILTRO (mascotaSeleccionada > 0):
 *      - Llama a historialService.findByMascota(mascotaId, page, limit)
 *      - Muestra controles de paginación (Anterior / Siguiente / "Página X de Y")
 *      - El backend retorna { items, meta: { page, limit, total, totalPages } }
 *
 * UNICIDAD mascotaId + fecha:
 *   Si el usuario intenta crear dos historiales en la misma fecha para la
 *   misma mascota, el backend retorna 409 con el mensaje
 *   "Ya existe un historial para esa mascota en esa fecha", que se muestra
 *   en el banner de error.
 *
 * RESET DE PÁGINA:
 *   Cuando el usuario cambia el filtro de mascota, la paginación vuelve
 *   a página 1 (page=1) — de lo contrario podría quedar en una página
 *   vacía (ej. página 5 de una mascota que solo tiene 3 historiales).
 */
'use client';

import { useEffect, useState } from 'react';
import { historialService } from '@/services/historial.service';
import { mascotasService } from '@/services/mascotas.service';
import type { HistorialClinico } from '@/interfaces/historial.interface';
import type { Mascota } from '@/interfaces/mascota.interface';

const emptyForm = {
  mascotaId: 0,
  fecha: '',
  diagnostico: '',
  observaciones: '',
};

const LIMIT = 5; // Registros por página

export default function HistorialPage() {
  const [historiales, setHistoriales] = useState<HistorialClinico[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);

  // Filtro y paginación
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Estados generales
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  /** Cargar la lista de mascotas (una sola vez al montar el componente). */
  const loadMascotas = async () => {
    try {
      const data = await mascotasService.findAll();
      setMascotas(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar mascotas');
    }
  };

  /**
   * Cargar la lista de historiales según el modo activo:
   *   - Sin filtro → findAll (lista completa, sin paginación)
   *   - Con filtro → findByMascota (paginado)
   */
  const loadHistoriales = async () => {
    try {
      setLoading(true);
      setError('');

      if (mascotaSeleccionada === 0) {
        const data = await historialService.findAll();
        setHistoriales(data);
        setTotalPages(1);
        setTotal(data.length);
      } else {
        const result = await historialService.findByMascota(
          mascotaSeleccionada,
          page,
          LIMIT,
        );
        setHistoriales(result.items);
        setTotalPages(result.meta.totalPages);
        setTotal(result.meta.total);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  // Cargar mascotas una vez
  useEffect(() => {
    loadMascotas();
  }, []);

  // Recargar historiales cuando cambia el filtro o la página
  useEffect(() => {
    loadHistoriales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mascotaSeleccionada, page]);

  /** Cambio de filtro: reiniciar a página 1. */
  const handleFilterChange = (mascotaId: number) => {
    setMascotaSeleccionada(mascotaId);
    setPage(1);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.mascotaId) {
      setError('Debe seleccionar una mascota');
      return;
    }
    try {
      const payload = {
        mascotaId: form.mascotaId,
        fecha: form.fecha,
        diagnostico: form.diagnostico,
        // Si está vacío, enviamos undefined para que NO viaje el campo
        // (el DTO lo marca como @IsOptional)
        observaciones: form.observaciones.trim() || undefined,
      };
      if (editingId) {
        await historialService.update(editingId, payload);
      } else {
        await historialService.create(payload);
      }
      resetForm();
      loadHistoriales();
    } catch (err: any) {
      // Aquí cae el 409 de unicidad (mascotaId + fecha duplicado)
      setError(err.message || 'Error al guardar');
    }
  };

  const handleEdit = (h: HistorialClinico) => {
    setForm({
      mascotaId: h.mascotaId,
      fecha: h.fecha.slice(0, 10),
      diagnostico: h.diagnostico,
      observaciones: h.observaciones ?? '',
    });
    setEditingId(h.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este historial?')) return;
    try {
      await historialService.remove(id);
      loadHistoriales();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Historial Clínico</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={mascotas.length === 0}
          title={
            mascotas.length === 0
              ? 'Primero registra al menos una mascota'
              : ''
          }
        >
          + Nuevo Registro
        </button>
      </div>

      {/* Filtro por mascota */}
      <div className="bg-white p-4 rounded shadow mb-4 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">
          Filtrar por mascota:
        </label>
        <select
          value={mascotaSeleccionada}
          onChange={(e) => handleFilterChange(Number(e.target.value))}
          className="border rounded p-2 flex-1 max-w-md"
        >
          <option value={0}>-- Todas las mascotas --</option>
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
        {mascotaSeleccionada > 0 && (
          <span className="text-sm text-gray-500">
            {total} registro{total === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 border border-red-200">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mb-6 grid grid-cols-2 gap-4"
        >
          <select
            required
            value={form.mascotaId}
            onChange={(e) =>
              setForm({ ...form, mascotaId: Number(e.target.value) })
            }
            className="border rounded p-2"
          >
            <option value={0}>-- Seleccionar Mascota --</option>
            {mascotas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre} ({m.especie})
              </option>
            ))}
          </select>
          <input
            required
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            className="border rounded p-2"
          />
          <input
            required
            placeholder="Diagnóstico"
            value={form.diagnostico}
            onChange={(e) =>
              setForm({ ...form, diagnostico: e.target.value })
            }
            className="border rounded p-2 col-span-2"
          />
          <textarea
            placeholder="Observaciones (opcional)"
            value={form.observaciones}
            onChange={(e) =>
              setForm({ ...form, observaciones: e.target.value })
            }
            className="border rounded p-2 col-span-2"
            rows={3}
          />
          <div className="col-span-2 flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Fecha</th>
                  {mascotaSeleccionada === 0 && (
                    <th className="text-left p-3">Mascota</th>
                  )}
                  <th className="text-left p-3">Diagnóstico</th>
                  <th className="text-left p-3">Observaciones</th>
                  <th className="text-left p-3">Tratamientos</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {historiales.map((h) => (
                  <tr key={h.id} className="border-t">
                    <td className="p-3">{h.id}</td>
                    <td className="p-3">{h.fecha.slice(0, 10)}</td>
                    {mascotaSeleccionada === 0 && (
                      <td className="p-3">
                        {h.mascota
                          ? `${h.mascota.nombre} (${h.mascota.especie})`
                          : `ID ${h.mascotaId}`}
                      </td>
                    )}
                    <td className="p-3">{h.diagnostico}</td>
                    <td className="p-3 text-gray-600">
                      {h.observaciones || '—'}
                    </td>
                    <td className="p-3 text-center">
                      {h._count?.tratamientos ?? 0}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(h)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(h.id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {historiales.length === 0 && (
                  <tr>
                    <td
                      colSpan={mascotaSeleccionada === 0 ? 7 : 6}
                      className="p-3 text-center text-gray-500"
                    >
                      No hay historiales registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Controles de paginación — solo cuando hay filtro activo */}
          {mascotaSeleccionada > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
