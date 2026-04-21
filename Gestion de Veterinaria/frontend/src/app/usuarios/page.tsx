'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Alert, PageHeader, Spinner, EmptyState } from '@/components/ui';
import api from '@/lib/api';
import { Usuario } from '@/interfaces';

export default function UsuariosPage() {
  const [lista, setLista]     = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    api.get('/usuarios')
      .then(r => setLista(r.data.data))
      .catch(() => setError('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <PageHeader title="Usuarios del sistema" description="Personal registrado en la plataforma" />
      {error && <div className="mb-4"><Alert type="error" message={error} /></div>}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : lista.length === 0 ? (
        <EmptyState icon="⚙️" title="No hay usuarios registrados" />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Nombre', 'Correo', 'Rol', 'Estado'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lista.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">{u.nombre}</td>
                  <td className="px-5 py-4 text-gray-600">{u.correo}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      u.rol === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>{u.rol}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
