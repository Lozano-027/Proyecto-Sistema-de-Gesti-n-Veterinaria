'use client';
import React from 'react';

// ─── Loading Spinner ──────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-10 w-10' : 'h-6 w-6';
  return <div className={`animate-spin rounded-full border-b-2 border-primary-600 ${s}`} />;
}

// ─── Alert ────────────────────────────────────────────────────────────────────
export function Alert({ type, message }: { type: 'error' | 'success' | 'info'; message: string }) {
  const styles = {
    error:   'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info:    'bg-blue-50 border-blue-200 text-blue-700',
  };
  const icons = { error: '❌', success: '✅', info: 'ℹ️' };
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${styles[type]}`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────
export function PageHeader({
  title, description, action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description }: { icon: string; title: string; description?: string }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
export function ConfirmModal({
  open, title, message, onConfirm, onCancel, loading,
}: {
  open: boolean; title: string; message: string;
  onConfirm: () => void; onCancel: () => void; loading?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary text-sm" disabled={loading}>Cancelar</button>
          <button onClick={onConfirm} className="btn-danger text-sm" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Badge Estado Cita ────────────────────────────────────────────────────────
export function BadgeEstado({ estado }: { estado: string }) {
  const cls: Record<string, string> = {
    PENDIENTE:  'badge-pendiente',
    CONFIRMADA: 'badge-confirmada',
    EN_CURSO:   'badge-en_curso',
    COMPLETADA: 'badge-completada',
    CANCELADA:  'badge-cancelada',
  };
  const labels: Record<string, string> = {
    PENDIENTE: 'Pendiente', CONFIRMADA: 'Confirmada',
    EN_CURSO: 'En curso', COMPLETADA: 'Completada', CANCELADA: 'Cancelada',
  };
  return <span className={cls[estado] || 'badge-pendiente'}>{labels[estado] || estado}</span>;
}
