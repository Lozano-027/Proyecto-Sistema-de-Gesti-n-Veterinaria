'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { propietariosService } from '@/services/propietarios.service';
import { Alert, Spinner, PageHeader } from '@/components/ui';

export default function PropietarioFormPage({ isEdit = false }: { isEdit?: boolean }) {
  const router = useRouter();
  const params = useParams();
  const id     = params?.id ? Number(params.id) : null;

  const [form, setForm]     = useState({ nombres: '', apellidos: '', telefono: '', correo: '', direccion: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!id) return;
    propietariosService.findOne(id)
      .then(p => setForm({ nombres: p.nombres, apellidos: p.apellidos, telefono: p.telefono, correo: p.correo, direccion: p.direccion || '' }))
      .catch(() => setError('No se pudo cargar el propietario'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (id) {
        await propietariosService.update(id, form);
        setSuccess('Propietario actualizado correctamente');
      } else {
        await propietariosService.create(form);
        setSuccess('Propietario creado correctamente');
        setTimeout(() => router.push('/propietarios'), 1200);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message?.[0] || 'Error al guardar propietario');
    } finally { setLoading(false); }
  };

  if (fetching) return <DashboardLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <PageHeader
        title={id ? 'Editar propietario' : 'Nuevo propietario'}
        description={id ? 'Modifica los datos del propietario' : 'Registra un nuevo cliente en el sistema'}
      />

      <div className="max-w-lg">
        {error   && <div className="mb-4"><Alert type="error"   message={error}   /></div>}
        {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

        <form onSubmit={handleSubmit} className="card space-y-4">
          {[
            { label: 'Nombres',   key: 'nombres',   type: 'text',  placeholder: 'Carlos Andrés', required: true  },
            { label: 'Apellidos', key: 'apellidos', type: 'text',  placeholder: 'Martínez López', required: true  },
            { label: 'Teléfono', key: 'telefono',  type: 'tel',   placeholder: '3001234567',      required: true  },
            { label: 'Correo',   key: 'correo',    type: 'email', placeholder: 'correo@email.com',required: true  },
            { label: 'Dirección',key: 'direccion', type: 'text',  placeholder: 'Cra 5 # 10-20',  required: false },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {f.label} {f.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={f.type} required={f.required}
                className="input-field" placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              />
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.push('/propietarios')} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <><Spinner size="sm" /> Guardando...</> : id ? 'Actualizar' : 'Crear propietario'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
