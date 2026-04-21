'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { propietariosService } from '@/services/propietarios.service';
import { mascotasService, citasService } from '@/services/index';
import { Spinner } from '@/components/ui';

interface Stats { propietarios: number; mascotas: number; citas: number; citasHoy: number; }

export default function DashboardPage() {
  const [stats, setStats]   = useState<Stats>({ propietarios: 0, mascotas: 0, citas: 0, citasHoy: 0 });
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('usuario');
      if (u) setUsuario(JSON.parse(u));
    }
    async function load() {
      try {
        const [props, mascs, cits] = await Promise.all([
          propietariosService.findAll(),
          mascotasService.findAll(),
          citasService.findAll(),
        ]);
        const hoy = new Date().toISOString().split('T')[0];
        const citasHoy = cits.filter(c => c.fecha.startsWith(hoy)).length;
        setStats({ propietarios: props.length, mascotas: mascs.length, citas: cits.length, citasHoy });
      } catch { /* sin datos aún */ } finally { setLoading(false); }
    }
    load();
  }, []);

  const cards = [
    { label: 'Propietarios',  value: stats.propietarios, icon: '👥', color: 'bg-blue-50 text-blue-700',   border: 'border-blue-100'   },
    { label: 'Mascotas',      value: stats.mascotas,     icon: '🐾', color: 'bg-green-50 text-green-700', border: 'border-green-100' },
    { label: 'Citas totales', value: stats.citas,        icon: '📅', color: 'bg-purple-50 text-purple-700', border: 'border-purple-100' },
    { label: 'Citas hoy',     value: stats.citasHoy,     icon: '🗓️', color: 'bg-orange-50 text-orange-700', border: 'border-orange-100' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {usuario?.nombre || 'usuario'} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Resumen general del sistema veterinario</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map(c => (
            <div key={c.label} className={`card border ${c.border}`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl ${c.color} mb-4`}>
                {c.icon}
              </div>
              <p className="text-3xl font-bold text-gray-900">{c.value}</p>
              <p className="text-sm text-gray-500 mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 card">
        <h2 className="font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/propietarios/new', label: 'Nuevo propietario', icon: '➕' },
            { href: '/mascotas/new',     label: 'Nueva mascota',     icon: '🐶' },
            { href: '/citas/new',        label: 'Nueva cita',        icon: '📆' },
            { href: '/citas',            label: 'Ver todas las citas', icon: '📋' },
          ].map(a => (
            <a key={a.href} href={a.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-center">
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs text-gray-600 font-medium">{a.label}</span>
            </a>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
