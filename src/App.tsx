/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './store';
import { LoginPage } from './components/LoginPage';
import { RoleSwitcher } from './components/RoleSwitcher';
import { WhatsAppSimulation } from './components/WhatsAppSimulation';
import { DashboardAdmin } from './components/DashboardAdmin';
import { DashboardGuru } from './components/DashboardGuru';
import { DashboardWaliKelas } from './components/DashboardWaliKelas';
import { DashboardKepalaMadrasah } from './components/DashboardKepalaMadrasah';
import { DashboardOrangTuaSiswa } from './components/DashboardOrangTuaSiswa';
import { School, LogOut, ShieldCheck, User } from 'lucide-react';

const AppContent: React.FC = () => {
  const { state, logout } = useApp();

  // If not logged in, show LoginPage
  if (!state.currentUser.isAuthenticated) {
    return <LoginPage />;
  }

  const user = state.currentUser;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      
      {/* Top Application Bar */}
      <header className="bg-emerald-950 text-white border-b-4 border-amber-500 shadow-lg px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-40">
        
        {/* Brand Stamp */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 text-emerald-950 rounded-full flex items-center justify-center font-black shadow border border-amber-400">
            <School className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-wider uppercase">SIPMT Madrasah</h1>
              <span className="bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-amber-500/40 font-mono">
                v1.2 Stable
              </span>
            </div>
            <p className="text-[10px] text-emerald-200 uppercase font-semibold">
              MTs Agama Islam Mertapada
            </p>
          </div>
        </div>

        {/* User Identity Banner */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-emerald-900 border border-emerald-800 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-emerald-100 leading-tight">
              <span className="text-[10px] text-emerald-400 block font-bold uppercase tracking-wider">Aktif Sebagai</span>
              <strong className="text-white font-black">{user.name} ({user.role})</strong>
            </div>
          </div>

          <button
            id="btn-global-logout"
            onClick={logout}
            className="bg-red-800/80 hover:bg-red-700 text-white font-bold p-2.5 rounded-xl text-xs uppercase flex items-center gap-1.5 transition-colors border border-red-900 shadow-xs"
            title="Keluar dari sistem"
          >
            <LogOut className="h-4 w-4 text-amber-300" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </header>

      {/* Role Switcher Toolbar (Visible for testing simulation purposes) */}
      <RoleSwitcher />

      {/* Main Container Layout */}
      <main className="flex-1 flex flex-col xl:flex-row min-w-0">
        
        {/* Dynamic Dashboard Loader */}
        <div className="flex-1 min-w-0 bg-gray-50">
          
          {user.role === 'Administrator' && <DashboardAdmin />}
          
          {user.role === 'Guru' && <DashboardGuru />}
          
          {user.role === 'Wali Kelas' && <DashboardWaliKelas />}
          
          {user.role === 'Kepala Madrasah' && (
            <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
              <DashboardKepalaMadrasah />
            </div>
          )}
          
          {(user.role === 'Orang Tua' || user.role === 'Siswa') && <DashboardOrangTuaSiswa />}

        </div>

        {/* Live WhatsApp Notifications Feed Sidebar */}
        <div className="w-full xl:w-[380px] shrink-0 border-t xl:border-t-0 xl:border-l border-gray-200 bg-white">
          <WhatsAppSimulation />
        </div>

      </main>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
