'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mascotasService } from '@/services/index';
import { propietariosService } from '@/services/propietarios.service';
import { Propietario } from '@/interfaces';
import { Alert, Spinner, PageHeader } from '@/components/ui';

export default function MascotaForm({ isEdit = false }: { isEdit?: boolean }) {
  const router = useRouter();
  const params = useParams();
  const id     = params?.id ? Number(params.id) : null;

  const [form, setForm] = useState({ nombre: '', especie: '', raza: '', fechaNacimiento: '', propietarioId: '' });
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  useEffect(() => {
    async function init() {
      try {
        const props = await propietariosService.findAll();
        setPropietarios(props);
        if (id) {
          const m = await mascotasService.findOne(id);
          setForm({
            nombre: m.nombre, especie: m.especie, raza: m.raza || '',
            fechaNacimiento: m.fechaNacimiento ? m.fechaNacimiento.split('T')[0] : '',
            propietarioId: String(m.propietarioId),
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
      nombre: form.nombre, especie: form.especie,
      raza: form.raza || undefined,
      fechaNacimiento: form.fechaNacimiento || undefined,
      propietarioId: Number(form.propietarioId),
    };
    try {
      if (id) { await mascotasService.update(id, dto); setSuccess('Mascota actualizada'); }
      else    { await mascotasService.create(dto);     setSuccess('Mascota creada'); setTimeout(() => router.push('/mascotas'), 1200); }
    } catch (err: any) {
      setError(err?.response?.data?.message?.[0] || 'Error al guardar mascota');
    } finally { setLoading(false); }
  };

  if (fetching) return <DashboardLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <PageHeader title={id ? 'Editar mascota' : 'Nueva mascota'} description="Registra o actualiza una mascota" />
      <div className="max-w-lg">
        {error   && <div className="mb-4"><Alert type="error"   message={error}   /></div>}
        {success && <div className="mb-4"><Alert type="success" message={success} /></div>}
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Propietario <span className="text-red-500">*</span></label>
            <select required className="input-field" value={form.propietarioId} onChange={e => setForm({ ...form, propietarioId: e.target.value })}>
              <option value="">Selecciona un propietario</option>
              {propietarios.map(p => (
                <option key={p.id} value={p.id}>{p.nombres} {p.apellidos}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre <span className="text-red-500">*</span></label>
            <input type="text" required className="input-field" placeholder="Ej: Rocky"
              value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Especie <span className="text-red-500">*</span></label>
            <select required className="input-field" value={form.especie} onChange={e => setForm({ ...form, especie: e.target.value })}>
              <option value="">Selecciona especie</option>
              {['Perro', 'Gato', 'Ave', 'Conejo', 'Reptil', 'Otro'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raza</label>
            <input type="text" className="input-field" placeholder="Ej: Labrador"
              value={form.raza} onChange={e => setForm({ ...form, raza: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
            <input type="date" className="input-field"
              value={form.fechaNacimiento} onChange={e => setForm({ ...form, fechaNacimiento: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.push('/mascotas')} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <><Spinner size="sm" /> Guardando...</> : id ? 'Actualizar' : 'Crear mascota'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
