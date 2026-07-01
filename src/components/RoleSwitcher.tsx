/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../store';
import { UserRole, Pengguna } from '../types';
import { Users, Shield, BookOpen, GraduationCap, UserCheck, Activity, Smartphone, RefreshCw } from 'lucide-react';

interface RoleSwitcherProps {
  onOpenWhatsAppLog: () => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onOpenWhatsAppLog }) => {
  const { state, setCurrentUser, resetDatabase } = useApp();

  const rolesConfig: { role: UserRole; label: string; icon: any; color: string; hoverColor: string }[] = [
    { role: 'Administrator', label: 'Admin', icon: Shield, color: 'bg-red-600', hoverColor: 'hover:bg-red-700' },
    { role: 'Guru', label: 'Guru', icon: BookOpen, color: 'bg-emerald-600', hoverColor: 'hover:bg-emerald-700' },
    { role: 'Wali Kelas', label: 'Wali Kelas', icon: UserCheck, color: 'bg-amber-600', hoverColor: 'hover:bg-amber-700' },
    { role: 'Kepala Madrasah', label: 'Kepala Sekolah', icon: GraduationCap, color: 'bg-indigo-600', hoverColor: 'hover:bg-indigo-700' },
    { role: 'Orang Tua', label: 'Orang Tua', icon: Users, color: 'bg-pink-600', hoverColor: 'hover:bg-pink-700' },
    { role: 'Siswa', label: 'Siswa', icon: Activity, color: 'bg-sky-600', hoverColor: 'hover:bg-sky-700' },
  ];

  const handleRoleChange = (role: UserRole) => {
    // Find the first user in penggunas list matching that role
    const user = state.penggunas.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin meriset database ke data bawaan?')) {
      resetDatabase();
    }
  };

  return (
    <div className="bg-emerald-950 text-white border-b-4 border-amber-500 py-3 px-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-2 rounded-full shadow-lg">
            <GraduationCap className="h-6 w-6 text-emerald-950" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-sans tracking-tight flex items-center gap-2">
              SIPMT <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-emerald-950 font-bold uppercase">v1.0</span>
            </h1>
            <p className="text-xs text-emerald-200">Sistem Informasi Pemantauan Terpadu MTs Agama Islam Mertapada</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-center">
          <span className="text-xs font-semibold text-amber-400 mr-1 uppercase tracking-wider hidden lg:inline">Simulasi Role:</span>
          <div className="grid grid-cols-3 sm:flex flex-wrap gap-1.5">
            {rolesConfig.map(config => {
              const isActive = state.currentUser.role === config.role;
              const Icon = config.icon;
              return (
                <button
                  key={config.role}
                  id={`btn-role-${config.role.toLowerCase().replace(' ', '-')}`}
                  onClick={() => handleRoleChange(config.role)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-amber-500 text-emerald-950 scale-105 ring-2 ring-white font-bold' 
                      : 'bg-emerald-900 text-emerald-100 hover:bg-emerald-800'
                  }`}
                  title={`Ganti view sebagai ${config.role}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 border-l border-emerald-800 pl-2 ml-1">
            <button
              id="btn-whatsapp-simulator"
              onClick={onOpenWhatsAppLog}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-2.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
              title="Lihat Log Notifikasi WhatsApp Terkirim ke Orang Tua"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="relative">
                WA
                {state.waNotifications.length > 0 && (
                  <span className="absolute -top-3 -right-3.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white animate-pulse">
                    {state.waNotifications.length}
                  </span>
                )}
              </span>
            </button>
            
            <button
              id="btn-reset-db"
              onClick={handleReset}
              className="bg-emerald-900 hover:bg-red-900 text-white p-1.5 rounded-md text-xs font-medium transition-colors border border-emerald-800"
              title="Reset ke Data Bawaan"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
