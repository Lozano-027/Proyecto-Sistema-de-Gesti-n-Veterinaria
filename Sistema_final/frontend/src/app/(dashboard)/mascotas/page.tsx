/**
 * ============================================================
 * PÁGINA CRUD DE MASCOTAS (/mascotas)
 * ============================================================
 *
 * Sigue el mismo patrón que la página de propietarios, con dos
 * diferencias clave:
 *
 *   1. CARGA EN PARALELO con Promise.all:
 *      Necesitamos las mascotas Y la lista de propietarios para llenar
 *      el <select>. Las pedimos en paralelo para que la página cargue
 *      más rápido.
 *
 *   2. SELECT DE PROPIETARIO:
 *      El campo propietarioId NO es texto libre, sino un dropdown que
 *      muestra todos los propietarios disponibles. Se convierte a número
 *      con Number() antes de enviar al backend (parseint del value).
 */
'use client';

import { useEffect, useState } from 'react';
import { mascotasService } from '@/services/mascotas.service';
import { propietariosService } from '@/services/propietarios.service';
import type { Mascota } from '@/interfaces/mascota.interface';
import type { Propietario } from '@/interfaces/propietario.interface';

const emptyForm = {
  nombre: '',
  especie: '',
  raza: '',
  fechaNacimiento: '',
  propietarioId: 0,
};

export default function MascotasPage() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      // Cargar mascotas y propietarios en paralelo
      const [mascotasData, propietariosData] = await Promise.all([
        mascotasService.findAll(),
        propietariosService.findAll(),
      ]);
      setMascotas(mascotasData);
      setPropietarios(propietariosData);
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
    if (!form.propietarioId) {
      setError('Debe seleccionar un propietario');
      return;
    }
    try {
      if (editingId) {
        await mascotasService.update(editingId, form);
      } else {
        await mascotasService.create(form);
      }
      resetForm();
      load();
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    }
  };

  const handleEdit = (m: Mascota) => {
    setForm({
      nombre: m.nombre,
      especie: m.especie,
      raza: m.raza,
      // El backend retorna fechaNacimiento como ISO completo;
      // el <input type="date"> requiere "YYYY-MM-DD".
      fechaNacimiento: m.fechaNacimiento.slice(0, 10),
      propietarioId: m.propietarioId,
    });
    setEditingId(m.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta mascota?')) return;
    try {
      await mascotasService.remove(id);
      load();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mascotas</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={propietarios.length === 0}
          title={
            propietarios.length === 0
              ? 'Primero registra al menos un propietario'
              : ''
          }
        >
          + Nueva Mascota
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
          <input
            required
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="border rounded p-2"
          />
          <input
            required
            placeholder="Especie (ej: Perro, Gato)"
            value={form.especie}
            onChange={(e) => setForm({ ...form, especie: e.target.value })}
            className="border rounded p-2"
          />
          <input
            required
            placeholder="Raza"
            value={form.raza}
            onChange={(e) => setForm({ ...form, raza: e.target.value })}
            className="border rounded p-2"
          />
          <input
            required
            type="date"
            value={form.fechaNacimiento}
            onChange={(e) =>
              setForm({ ...form, fechaNacimiento: e.target.value })
            }
            className="border rounded p-2"
          />
          <select
            required
            value={form.propietarioId}
            onChange={(e) =>
              setForm({ ...form, propietarioId: Number(e.target.value) })
            }
            className="border rounded p-2 col-span-2"
          >
            <option value={0}>-- Seleccionar Propietario --</option>
            {propietarios.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombres} {p.apellidos} ({p.correo})
              </option>
            ))}
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
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Especie</th>
                <th className="text-left p-3">Raza</th>
                <th className="text-left p-3">Fecha Nac.</th>
                <th className="text-left p-3">Propietario</th>
                <th className="text-left p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mascotas.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="p-3">{m.id}</td>
                  <td className="p-3">{m.nombre}</td>
                  <td className="p-3">{m.especie}</td>
                  <td className="p-3">{m.raza}</td>
                  <td className="p-3">{m.fechaNacimiento.slice(0, 10)}</td>
                  <td className="p-3">
                    {m.propietario
                      ? `${m.propietario.nombres} ${m.propietario.apellidos}`
                      : `ID ${m.propietarioId}`}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(m)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {mascotas.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-3 text-center text-gray-500">
                    No hay mascotas registradas
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
