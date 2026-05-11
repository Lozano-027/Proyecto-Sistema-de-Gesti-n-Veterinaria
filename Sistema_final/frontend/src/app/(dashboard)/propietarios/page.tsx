/**
 * ============================================================
 * PÁGINA CRUD DE PROPIETARIOS (/propietarios)
 * ============================================================
 *
 * Esta página es el ejemplo completo del patrón CRUD en el frontend.
 * Las páginas de mascotas, citas, etc. seguirán este mismo patrón.
 *
 * ARQUITECTURA:
 *   ESTADOS:
 *     propietarios[] → Lista del backend
 *     loading        → Indicador de carga
 *     showForm       → Mostrar/ocultar formulario
 *     editingId      → ID del propietario en edición (null = modo crear)
 *     form           → Datos del formulario
 *     error          → Mensaje de error (si hay)
 *
 *   FLUJO:
 *     Cargar:   useEffect → load() → propietariosService.findAll()
 *     Crear:    handleSubmit (sin editingId) → service.create
 *     Editar:   handleEdit carga datos → handleSubmit con editingId → service.update
 *     Eliminar: confirm() → handleDelete → service.remove
 *
 *   PATRÓN FORMULARIO DUAL: el mismo formulario sirve para crear y editar,
 *     diferenciado solo por `editingId`.
 */
'use client';

import { useEffect, useState } from 'react';
import { propietariosService } from '@/services/propietarios.service';
import type { Propietario } from '@/interfaces/propietario.interface';

const emptyForm = {
  nombres: '',
  apellidos: '',
  telefono: '',
  correo: '',
  direccion: '',
};

export default function PropietariosPage() {
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
      const data = await propietariosService.findAll();
      setPropietarios(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar propietarios');
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
    try {
      if (editingId) {
        await propietariosService.update(editingId, form);
      } else {
        await propietariosService.create(form);
      }
      resetForm();
      load();
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    }
  };

  const handleEdit = (p: Propietario) => {
    setForm({
      nombres: p.nombres,
      apellidos: p.apellidos,
      telefono: p.telefono,
      correo: p.correo,
      direccion: p.direccion,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este propietario?')) return;
    try {
      await propietariosService.remove(id);
      load();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Propietarios</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo Propietario
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
            placeholder="Nombres"
            value={form.nombres}
            onChange={(e) => setForm({ ...form, nombres: e.target.value })}
            className="border rounded p-2"
          />
          <input
            required
            placeholder="Apellidos"
            value={form.apellidos}
            onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
            className="border rounded p-2"
          />
          <input
            required
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            className="border rounded p-2"
          />
          <input
            required
            type="email"
            placeholder="Correo"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            className="border rounded p-2"
          />
          <input
            required
            placeholder="Dirección"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            className="border rounded p-2 col-span-2"
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
                <th className="text-left p-3">Nombres</th>
                <th className="text-left p-3">Apellidos</th>
                <th className="text-left p-3">Teléfono</th>
                <th className="text-left p-3">Correo</th>
                <th className="text-left p-3">Dirección</th>
                <th className="text-left p-3">Mascotas</th>
                <th className="text-left p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {propietarios.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">{p.nombres}</td>
                  <td className="p-3">{p.apellidos}</td>
                  <td className="p-3">{p.telefono}</td>
                  <td className="p-3">{p.correo}</td>
                  <td className="p-3">{p.direccion}</td>
                  <td className="p-3 text-center">{p._count?.mascotas ?? 0}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {propietarios.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-3 text-center text-gray-500">
                    No hay propietarios registrados
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
