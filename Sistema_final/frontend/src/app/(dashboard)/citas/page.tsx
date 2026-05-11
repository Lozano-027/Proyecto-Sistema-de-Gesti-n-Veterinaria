/**
 * ============================================================
 * PÁGINA CRUD DE CITAS (/citas)
 * ============================================================
 *
 * Esta página hace 3 peticiones GET en paralelo:
 *   - GET /citas       (la lista)
 *   - GET /mascotas    (para el dropdown)
 *   - GET /usuarios    (para el dropdown del veterinario)
 *
 * VALIDACIÓN DE DISPONIBILIDAD:
 *   La validación real ocurre en el backend (CitasService.assertNoConflict).
 *   Si hay conflicto, el backend retorna 409 con un mensaje claro:
 *     "El veterinario ya tiene una cita asignada el 2026-04-15 a las 14:30"
 *     "La mascota ya tiene una cita asignada el 2026-04-15 a las 14:30"
 *
 *   Ese mensaje viaja por nuestro lib/api.ts (que extrae .message del JSON
 *   de error) y se muestra en el banner rojo de la UI.
 *
 * BADGE DE ESTADO:
 *   Cada cita muestra su estado con un color: programada (azul),
 *   completada (verde), cancelada (gris).
 */
'use client';

import { useEffect, useState } from 'react';
import { citasService } from '@/services/citas.service';
import { mascotasService } from '@/services/mascotas.service';
import { usuariosService } from '@/services/usuarios.service';
import type { Cita } from '@/interfaces/cita.interface';
import type { Mascota } from '@/interfaces/mascota.interface';
import type { Usuario } from '@/interfaces/usuario.interface';

const emptyForm = {
  mascotaId: 0,
  usuarioId: 0,
  fecha: '',
  hora: '',
  motivo: '',
  estado: 'programada' as 'programada' | 'completada' | 'cancelada',
};

const estadoStyles: Record<string, string> = {
  programada: 'bg-blue-100 text-blue-700',
  completada: 'bg-green-100 text-green-700',
  cancelada: 'bg-gray-200 text-gray-600',
};

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [veterinarios, setVeterinarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const [citasData, mascotasData, usuariosData] = await Promise.all([
        citasService.findAll(),
        mascotasService.findAll(),
        usuariosService.findAll(),
      ]);
      setCitas(citasData);
      setMascotas(mascotasData);
      // Solo veterinarios pueden atender citas
      setVeterinarios(usuariosData.filter((u) => u.rol === 'veterinario'));
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
    if (!form.mascotaId || !form.usuarioId) {
      setError('Debe seleccionar mascota y veterinario');
      return;
    }
    try {
      if (editingId) {
        await citasService.update(editingId, form);
      } else {
        await citasService.create(form);
      }
      resetForm();
      load();
    } catch (err: any) {
      // Aquí cae el 409 de conflicto de horario
      setError(err.message || 'Error al guardar');
    }
  };

  const handleEdit = (c: Cita) => {
    setForm({
      mascotaId: c.mascotaId,
      usuarioId: c.usuarioId,
      fecha: c.fecha.slice(0, 10),
      hora: c.hora,
      motivo: c.motivo,
      estado: c.estado as 'programada' | 'completada' | 'cancelada',
    });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta cita?')) return;
    try {
      await citasService.remove(id);
      load();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Citas</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={mascotas.length === 0 || veterinarios.length === 0}
          title={
            mascotas.length === 0 || veterinarios.length === 0
              ? 'Necesitas al menos una mascota y un veterinario registrados'
              : ''
          }
        >
          + Nueva Cita
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
                {m.nombre} ({m.especie}
                {m.propietario
                  ? ` — ${m.propietario.nombres} ${m.propietario.apellidos}`
                  : ''}
                )
              </option>
            ))}
          </select>
          <select
            required
            value={form.usuarioId}
            onChange={(e) =>
              setForm({ ...form, usuarioId: Number(e.target.value) })
            }
            className="border rounded p-2"
          >
            <option value={0}>-- Seleccionar Veterinario --</option>
            {veterinarios.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nombre}
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
            type="time"
            value={form.hora}
            onChange={(e) => setForm({ ...form, hora: e.target.value })}
            className="border rounded p-2"
          />
          <input
            required
            placeholder="Motivo (ej: Vacunación, Control)"
            value={form.motivo}
            onChange={(e) => setForm({ ...form, motivo: e.target.value })}
            className="border rounded p-2 col-span-2"
          />
          <select
            value={form.estado}
            onChange={(e) =>
              setForm({
                ...form,
                estado: e.target.value as
                  | 'programada'
                  | 'completada'
                  | 'cancelada',
              })
            }
            className="border rounded p-2 col-span-2"
          >
            <option value="programada">Programada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
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
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3">Hora</th>
                <th className="text-left p-3">Mascota</th>
                <th className="text-left p-3">Veterinario</th>
                <th className="text-left p-3">Motivo</th>
                <th className="text-left p-3">Estado</th>
                <th className="text-left p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.fecha.slice(0, 10)}</td>
                  <td className="p-3">{c.hora}</td>
                  <td className="p-3">
                    {c.mascota ? c.mascota.nombre : `ID ${c.mascotaId}`}
                  </td>
                  <td className="p-3">
                    {c.usuario ? c.usuario.nombre : `ID ${c.usuarioId}`}
                  </td>
                  <td className="p-3">{c.motivo}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        estadoStyles[c.estado] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {c.estado}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {citas.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-3 text-center text-gray-500">
                    No hay citas registradas
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
