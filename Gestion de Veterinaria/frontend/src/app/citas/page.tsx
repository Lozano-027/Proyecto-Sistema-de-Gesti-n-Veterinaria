'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { citasService } from '@/services/index';
import { Cita } from '@/interfaces';
import { PageHeader, EmptyState, Spinner, Alert, ConfirmModal, BadgeEstado } from '@/components/ui';

export default function CitasPage() {
  const [lista, setLista]       = useState<Cita[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setLista(await citasService.findAll()); }
    catch { setError('Error al cargar citas'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await citasService.remove(deleteId);
      setLista(prev => prev.filter(c => c.id !== deleteId));
      setDeleteId(null);
    } catch { setError('Error al eliminar cita'); }
    finally { setDeleting(false); }
  };

  const formatFecha = (iso: string) =>
    new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <DashboardLayout>
      <PageHeader
        title="Citas médicas"
        description="Gestión de citas y consultas veterinarias"
        action={<Link href="/citas/new" className="btn-primary text-sm">+ Nueva cita</Link>}
      />

      {error && <div className="mb-4"><Alert type="error" message={error} /></div>}

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : lista.length === 0 ? (
        <EmptyState icon="📅" title="No hay citas registradas" description="Agenda la primera cita con el botón de arriba" />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Fecha / Hora', 'Mascota', 'Veterinario', 'Motivo', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lista.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{formatFecha(c.fecha)}</p>
                    <p className="text-xs text-gray-400">{c.hora}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{c.mascota?.nombre ?? `#${c.mascotaId}`}</p>
                    <p className="text-xs text-gray-400">{c.mascota?.especie}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{c.usuario?.nombre ?? `#${c.usuarioId}`}</td>
                  <td className="px-5 py-4 text-gray-600 max-w-[180px] truncate">{c.motivo}</td>
                  <td className="px-5 py-4"><BadgeEstado estado={c.estado} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/citas/${c.id}`} className="text-xs text-primary-600 hover:underline font-medium">Editar</Link>
                      <button onClick={() => setDeleteId(c.id)} className="text-xs text-red-500 hover:underline font-medium">Eliminar</button>
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
        title="¿Eliminar cita?"
        message="Esta acción eliminará permanentemente la cita del sistema."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </DashboardLayout>
  );
}
