'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mascotasService } from '@/services/index';
import { Mascota } from '@/interfaces';
import { PageHeader, EmptyState, Spinner, Alert, ConfirmModal } from '@/components/ui';

export default function MascotasPage() {
  const [lista, setLista]       = useState<Mascota[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setLista(await mascotasService.findAll()); }
    catch { setError('Error al cargar mascotas'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await mascotasService.remove(deleteId);
      setLista(prev => prev.filter(m => m.id !== deleteId));
      setDeleteId(null);
    } catch { setError('Error al eliminar mascota'); }
    finally { setDeleting(false); }
  };

  const especieIcon = (e: string) =>
    e.toLowerCase().includes('perro') || e.toLowerCase().includes('can') ? '🐶'
    : e.toLowerCase().includes('gato') || e.toLowerCase().includes('fel') ? '🐱'
    : e.toLowerCase().includes('ave') || e.toLowerCase().includes('loro') ? '🦜'
    : '🐾';

  return (
    <DashboardLayout>
      <PageHeader
        title="Mascotas"
        description="Registro de pacientes de la veterinaria"
        action={<Link href="/mascotas/new" className="btn-primary text-sm">+ Nueva mascota</Link>}
      />

      {error && <div className="mb-4"><Alert type="error" message={error} /></div>}

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : lista.length === 0 ? (
        <EmptyState icon="🐾" title="No hay mascotas registradas" description="Registra la primera mascota con el botón de arriba" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lista.map(m => (
            <div key={m.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{especieIcon(m.especie)}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{m.nombre}</p>
                    <p className="text-xs text-gray-500">{m.especie}{m.raza ? ` · ${m.raza}` : ''}</p>
                  </div>
                </div>
              </div>
              {m.propietario && (
                <p className="text-xs text-gray-500 mt-3">
                  👤 {m.propietario.nombres} {m.propietario.apellidos}
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <Link href={`/mascotas/${m.id}`} className="btn-secondary text-xs flex-1 text-center">Editar</Link>
                <button onClick={() => setDeleteId(m.id)} className="text-xs text-red-500 hover:underline px-2">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId} loading={deleting}
        title="¿Eliminar mascota?"
        message="Se desactivará la mascota del sistema."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </DashboardLayout>
  );
}
