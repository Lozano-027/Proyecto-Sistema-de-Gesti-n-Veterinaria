'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { citasService, mascotasService } from '@/services/index';
import { Mascota, EstadoCita } from '@/interfaces';
import { Alert, Spinner, PageHeader } from '@/components/ui';

const ESTADOS: EstadoCita[] = ['PENDIENTE', 'CONFIRMADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA'];
const ESTADO_LABELS: Record<EstadoCita, string> = {
  PENDIENTE: 'Pendiente', CONFIRMADA: 'Confirmada',
  EN_CURSO: 'En curso', COMPLETADA: 'Completada', CANCELADA: 'Cancelada',
};

export default function CitaForm({ isEdit = false }: { isEdit?: boolean }) {
  const router = useRouter();
  const params = useParams();
  const id     = params?.id ? Number(params.id) : null;

  const [form, setForm] = useState({
    fecha: '', hora: '', motivo: '', estado: 'PENDIENTE' as EstadoCita,
    notas: '', mascotaId: '', usuarioId: '',
  });
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [usuario, setUsuario]   = useState<any>(null);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('usuario');
      if (u) {
        const parsed = JSON.parse(u);
        setUsuario(parsed);
        setForm(f => ({ ...f, usuarioId: String(parsed.id) }));
      }
    }
    async function init() {
      try {
        const mascs = await mascotasService.findAll();
        setMascotas(mascs);
        if (id) {
          const c = await citasService.findOne(id);
          setForm({
            fecha: c.fecha.split('T')[0], hora: c.hora, motivo: c.motivo,
            estado: c.estado, notas: c.notas || '',
            mascotaId: String(c.mascotaId), usuarioId: String(c.usuarioId),
          });
        }
      } catch { setError('Error al cargar datos'); }
      finally { setFetching(false); }
    }
    init();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const dto = {
      fecha: form.fecha, hora: form.hora, motivo: form.motivo,
      estado: form.estado, notas: form.notas || undefined,
      mascotaId: Number(form.mascotaId), usuarioId: Number(form.usuarioId),
    };
    try {
      if (id) { await citasService.update(id, dto); setSuccess('Cita actualizada correctamente'); }
      else    { await citasService.create(dto);     setSuccess('Cita creada correctamente'); setTimeout(() => router.push('/citas'), 1200); }
    } catch (err: any) {
      setError(err?.response?.data?.message?.[0] || 'Error al guardar cita');
    } finally { setLoading(false); }
  };

  if (fetching) return <DashboardLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <PageHeader title={id ? 'Editar cita' : 'Nueva cita'} description="Agenda o modifica una cita médica" />
      <div className="max-w-lg">
        {error   && <div className="mb-4"><Alert type="error"   message={error}   /></div>}
        {success && <div className="mb-4"><Alert type="success" message={success} /></div>}
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mascota <span className="text-red-500">*</span></label>
            <select required className="input-field" value={form.mascotaId} onChange={e => setForm({ ...form, mascotaId: e.target.value })}>
              <option value="">Selecciona una mascota</option>
              {mascotas.map(m => <option key={m.id} value={m.id}>{m.nombre} ({m.especie})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha <span className="text-red-500">*</span></label>
              <input type="date" required className="input-field"
                value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora <span className="text-red-500">*</span></label>
              <input type="time" required className="input-field"
                value={form.hora} onChange={e => setForm({ ...form, hora: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo <span className="text-red-500">*</span></label>
            <input type="text" required className="input-field" placeholder="Ej: Control de vacunas"
              value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select className="input-field" value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value as EstadoCita })}>
              {ESTADOS.map(s => <option key={s} value={s}>{ESTADO_LABELS[s]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
            <textarea rows={3} className="input-field resize-none" placeholder="Observaciones opcionales..."
              value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.push('/citas')} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <><Spinner size="sm" /> Guardando...</> : id ? 'Actualizar' : 'Crear cita'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
