'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { propietariosService } from '@/services/propietarios.service';
import { Propietario } from '@/interfaces';
import { PageHeader, EmptyState, Spinner, Alert, ConfirmModal } from '@/components/ui';

export default function PropietariosPage() {
  const [lista, setLista]       = useState<Propietario[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setLista(await propietariosService.findAll()); }
    catch { setError('Error al cargar propietarios'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await propietariosService.remove(deleteId);
      setLista(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
    } catch { setError('Error al eliminar propietario'); }
    finally { setDeleting(false); }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Propietarios"
        description="Gestiona los clientes de la veterinaria"
        action={
          <Link href="/propietarios/new" className="btn-primary text-sm">+ Nuevo propietario</Link>
        }
      />

      {error && <div className="mb-4"><Alert type="error" message={error} /></div>}

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : lista.length === 0 ? (
        <EmptyState icon="👥" title="No hay propietarios registrados" description="Crea el primer propietario con el botón de arriba" />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Nombre', 'Teléfono', 'Correo', 'Mascotas', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lista.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{p.nombres} {p.apellidos}</p>
                    {p.direccion && <p className="text-xs text-gray-400 mt-0.5">{p.direccion}</p>}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{p.telefono}</td>
                  <td className="px-5 py-4 text-gray-600">{p.correo}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
                      🐾 {p.mascotas?.length ?? 0}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/propietarios/${p.id}`} className="text-xs text-primary-600 hover:underline font-medium">Editar</Link>
                      <button onClick={() => setDeleteId(p.id)} className="text-xs text-red-500 hover:underline font-medium">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!deleteId} loading={deleting}
        title="¿Eliminar propietario?"
        message="Esta acción desactivará al propietario. Sus mascotas seguirán en el sistema."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </DashboardLayout>
  );
}
