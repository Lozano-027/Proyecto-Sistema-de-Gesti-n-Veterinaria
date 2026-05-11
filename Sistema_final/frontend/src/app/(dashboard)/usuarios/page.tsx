'use client';

import { useEffect, useState } from 'react';
import { usuariosService } from '@/services/usuarios.service';
import type { Usuario } from '@/interfaces/usuario.interface';

const emptyForm = {
  nombre: '',
  correo: '',
  rol: 'veterinario' as 'veterinario' | 'admin',
};

const rolStyles: Record<string, string> = {
  veterinario: 'bg-green-100 text-green-700',
  admin: 'bg-purple-100 text-purple-700',
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await usuariosService.findAll();
      setUsuarios(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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
        await usuariosService.update(editingId, form);
      } else {
        await usuariosService.create(form);
      }
      resetForm();
      load();
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    }
  };

  const handleEdit = (u: Usuario) => {
    setForm({
      nombre: u.nombre,
      correo: u.correo,
      rol: (u.rol === 'admin' ? 'admin' : 'veterinario') as 'veterinario' | 'admin',
    });
    setEditingId(u.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await usuariosService.remove(id);
      load();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo Usuario
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Personal de la veterinaria. Los veterinarios pueden ser asignados a las citas.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 border border-red-200">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-2 gap-4">
          <input
            required
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="border rounded p-2 col-span-2"
          />
          <input
            required
            type="email"
            placeholder="Correo"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            className="border rounded p-2"
          />
          <select
            required
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value as 'veterinario' | 'admin' })}
            className="border rounded p-2"
          >
            <option value="veterinario">Veterinario</option>
            <option value="admin">Administrador</option>
          </select>
          <div className="col-span-2 flex gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
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
                <th className="text-left p-3">Correo</th>
                <th className="text-left p-3">Rol</th>
                <th className="text-left p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.id}</td>
                  <td className="p-3">{u.nombre}</td>
                  <td className="p-3">{u.correo}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${rolStyles[u.rol] || 'bg-gray-100 text-gray-700'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleEdit(u)} className="text-blue-600 hover:underline">Editar</button>
                    <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">No hay usuarios registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}