/**
 * ============================================================
 * PÁGINA TRATAMIENTOS (/tratamientos) — Sprint 4
 * ============================================================
 *
 * REGLA UI: el usuario elige el tipo de asociación con un radio
 *   (Cita / Historial) y aparece el dropdown correspondiente.
 *   Cuando guarda, solo viaja la FK relevante (la otra es undefined).
 *
 *   Esto cumple la regla del backend "al menos uno de citaId o
 *   historialClinicoId requerido", de forma muy explícita en la UI.
 *
 * COLUMNA "ASOCIADO A" en la tabla:
 *   Muestra "Cita #N (Mascota)" o "Historial #N (Mascota)" según
 *   cuál de las dos FKs esté presente.
 */
'use client';

import { useEffect, useState } from 'react';
import { tratamientosService } from '@/services/tratamientos.service';
import { citasService } from '@/services/citas.service';
import { historialService } from '@/services/historial.service';
import type { Tratamiento } from '@/interfaces/tratamiento.interface';
import type { Cita } from '@/interfaces/cita.interface';
import type { HistorialClinico } from '@/interfaces/historial.interface';

type TipoAsociacion = 'cita' | 'historial';

const emptyForm = {
  tipo: 'cita' as TipoAsociacion,
  asociadoId: 0,
  medicamento: '',
  dosis: '',
  duracion: '',
  indicaciones: '',
};

export default function TratamientosPage() {
  const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [historiales, setHistoriales] = useState<HistorialClinico[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [tData, cData, hData] = await Promise.all([
        tratamientosService.findAll(),
        citasService.findAll(),
        historialService.findAll(),
      ]);
      setTratamientos(tData);
      setCitas(cData);
      setHistoriales(hData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.asociadoId) {
      setError(
        `Debe seleccionar ${form.tipo === 'cita' ? 'una cita' : 'un historial'}`,
      );
      return;
    }
    try {
      const payload = {
        citaId: form.tipo === 'cita' ? form.asociadoId : undefined,
        historialClinicoId:
          form.tipo === 'historial' ? form.asociadoId : undefined,
        medicamento: form.medicamento,
        dosis: form.dosis,
        duracion: form.duracion,
        indicaciones: form.indicaciones.trim() || undefined,
      };
      if (editingId) {
        await tratamientosService.update(editingId, payload);
      } else {
        await tratamientosService.create(payload);
      }
      resetForm();
      load();
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    }
  };

  const handleEdit = (t: Tratamiento) => {
    setForm({
      tipo: t.citaId ? 'cita' : 'historial',
      asociadoId: t.citaId ?? t.historialClinicoId ?? 0,
      medicamento: t.medicamento,
      dosis: t.dosis,
      duracion: t.duracion,
      indicaciones: t.indicaciones ?? '',
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este tratamiento?')) return;
    try {
      await tratamientosService.remove(id);
      load();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar');
    }
  };

  /** Texto descriptivo de "asociado a" para mostrar en la tabla. */
  const asociadoTexto = (t: Tratamiento): string => {
    if (t.cita) {
      const m = t.cita.mascota?.nombre ?? `mascota ID ${t.cita.mascotaId}`;
      return `Cita #${t.cita.id} (${m} — ${t.cita.fecha.slice(0, 10)} ${t.cita.hora})`;
    }
    if (t.historialClinico) {
      const m =
        t.historialClinico.mascota?.nombre ??
        `mascota ID ${t.historialClinico.mascotaId}`;
      return `Historial #${t.historialClinico.id} (${m} — ${t.historialClinico.fecha.slice(0, 10)})`;
    }
    return '—';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tratamientos</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={citas.length === 0 && historiales.length === 0}
          title={
            citas.length === 0 && historiales.length === 0
              ? 'Necesitas al menos una cita o un historial registrado'
              : ''
          }
        >
          + Nuevo Tratamiento
        </button>
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
          {/* Selector de tipo de asociación */}
          <div className="col-span-2 flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tipo"
                value="cita"
                checked={form.tipo === 'cita'}
                onChange={() =>
                  setForm({ ...form, tipo: 'cita', asociadoId: 0 })
                }
              />
              Asociar a una Cita
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tipo"
                value="historial"
                checked={form.tipo === 'historial'}
                onChange={() =>
                  setForm({ ...form, tipo: 'historial', asociadoId: 0 })
                }
              />
              Asociar a un Historial
            </label>
          </div>

          {/* Dropdown según tipo */}
          {form.tipo === 'cita' ? (
            <select
              required
              value={form.asociadoId}
              onChange={(e) =>
                setForm({ ...form, asociadoId: Number(e.target.value) })
              }
              className="border rounded p-2 col-span-2"
            >
              <option value={0}>-- Seleccionar Cita --</option>
              {citas.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id} — {c.mascota?.nombre ?? 'Mascota'} ({c.fecha.slice(0, 10)} {c.hora})
                </option>
              ))}
            </select>
          ) : (
            <select
              required
              value={form.asociadoId}
              onChange={(e) =>
                setForm({ ...form, asociadoId: Number(e.target.value) })
              }
              className="border rounded p-2 col-span-2"
            >
              <option value={0}>-- Seleccionar Historial --</option>
              {historiales.map((h) => (
                <option key={h.id} value={h.id}>
                  #{h.id} — {h.mascota?.nombre ?? 'Mascota'} ({h.fecha.slice(0, 10)})
                </option>
              ))}
            </select>
          )}

          <input
            required
            placeholder="Medicamento"
            value={form.medicamento}
            onChange={(e) =>
              setForm({ ...form, medicamento: e.target.value })
            }
            className="border rounded p-2"
          />
          <input
            required
            placeholder="Dosis (ej: 1 tableta cada 8h)"
            value={form.dosis}
            onChange={(e) => setForm({ ...form, dosis: e.target.value })}
            className="border rounded p-2"
          />
          <input
            required
            placeholder="Duración (ej: 7 días)"
            value={form.duracion}
            onChange={(e) => setForm({ ...form, duracion: e.target.value })}
            className="border rounded p-2 col-span-2"
          />
          <textarea
            placeholder="Indicaciones (opcional)"
            value={form.indicaciones}
            onChange={(e) =>
              setForm({ ...form, indicaciones: e.target.value })
            }
            className="border rounded p-2 col-span-2"
            rows={2}
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
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Medicamento</th>
                <th className="text-left p-3">Dosis</th>
                <th className="text-left p-3">Duración</th>
                <th className="text-left p-3">Asociado a</th>
                <th className="text-left p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tratamientos.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-3">{t.id}</td>
                  <td className="p-3">{t.medicamento}</td>
                  <td className="p-3">{t.dosis}</td>
                  <td className="p-3">{t.duracion}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {asociadoTexto(t)}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(t)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {tratamientos.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-gray-500">
                    No hay tratamientos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
