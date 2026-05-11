/**
 * ============================================================
 * LAYOUT DEL DASHBOARD (Sprint 4 — RESPONSIVO)
 * ============================================================
 *
 * En desktop:
 *   ┌──────────────────────────────────────────┐
 *   │  Sidebar  │         Main Content         │
 *   │ (240px)   │  (flex-1, scroll vertical)   │
 *   └──────────────────────────────────────────┘
 *
 * En móvil:
 *   ┌──────────────────────────────────────────┐
 *   │  Header con botón hamburguesa            │
 *   ├──────────────────────────────────────────┤
 *   │            Main Content                  │
 *   │            (full width)                  │
 *   └──────────────────────────────────────────┘
 *   El Sidebar aparece como overlay al abrir.
 *
 * ESTADO sidebarOpen:
 *   El layout es ahora un Client Component porque maneja el estado de
 *   apertura del drawer móvil. En desktop el sidebar siempre está
 *   visible, así que el estado solo importa en pantallas <md.
 */
'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
