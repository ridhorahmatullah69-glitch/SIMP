/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store';
import { School, Lock, User, Key, ShieldAlert, GraduationCap, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { state, login } = useApp();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !password) {
      setErrorMsg('Username dan Password wajib diisi.');
      return;
    }

    const success = login(username, password);
    if (!success) {
      setErrorMsg('Kredensial salah. Silakan coba lagi atau gunakan Akses Cepat di bawah.');
    }
  };

  const handleQuickLogin = (roleName: string) => {
    // Find matching user in state
    const user = state.penggunas.find(p => p.role === roleName);
    if (user) {
      login(user.username, user.password);
    } else {
      setErrorMsg(`User dengan peran ${roleName} tidak ditemukan.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      
      {/* Login Frame */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-emerald-900 text-white p-6 text-center space-y-2.5 relative border-b-4 border-amber-500">
          <div className="w-14 h-14 bg-amber-500 text-emerald-950 rounded-full flex items-center justify-center mx-auto shadow-md">
            <School className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight uppercase">SIPMT Madrasah</h1>
            <p className="text-[10px] text-emerald-200 uppercase font-bold tracking-wider">
              Sistem Informasi Pemantauan Terpadu
            </p>
            <p className="text-[11px] font-medium text-amber-300 mt-1">
              MTs Agama Islam Mertapada
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="p-6 md:p-8 space-y-5 text-xs">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg flex items-start gap-2 font-bold leading-relaxed">
              <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="block text-gray-500 font-bold uppercase tracking-wider text-[10px]">Username Pengguna</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <User className="h-4 w-4" />
                </span>
                <input
                  id="login-username-input"
                  type="text"
                  placeholder="Ketik username Anda..."
                  className="w-full pl-9 pr-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs text-gray-800 font-bold font-mono"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-gray-500 font-bold uppercase tracking-wider text-[10px]">Kata Sandi (Password)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="login-password-input"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs text-gray-800 font-mono"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-black py-2.5 rounded-lg text-xs uppercase flex items-center justify-center gap-1.5 transition-colors shadow-md mt-2 border-b-2 border-emerald-950"
            >
              Sign In Ke Sistem <ArrowRight className="h-4 w-4 text-amber-400" />
            </button>
          </form>

          {/* Quick Shortcuts for Simulation */}
          <div className="border-t border-gray-100 pt-5 space-y-3">
            <div className="text-center">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Shorcut Login Peran (Akses Cepat)
              </span>
              <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                Gunakan tombol di bawah untuk masuk ke dashboard peran tertentu secara instan untuk simulasi evaluasi.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Administrator', role: 'Administrator', color: 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100' },
                { label: 'Guru Mapel', role: 'Guru', color: 'bg-amber-50 text-amber-900 hover:bg-amber-100' },
                { label: 'Wali Kelas', role: 'Wali Kelas', color: 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100' },
                { label: 'Kepala Madrasah', role: 'Kepala Madrasah', color: 'bg-slate-100 text-slate-900 hover:bg-slate-200' },
                { label: 'Orang Tua Murid', role: 'Orang Tua', color: 'bg-blue-50 text-blue-900 hover:bg-blue-100' },
                { label: 'Siswa Aktif', role: 'Siswa', color: 'bg-purple-50 text-purple-900 hover:bg-purple-100' },
              ].map(item => (
                <button
                  key={item.role}
                  id={`btn-quick-login-${item.role.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleQuickLogin(item.role)}
                  className={`p-2 rounded-lg text-[10px] font-black uppercase text-center transition-all border border-gray-200/50 flex items-center justify-center gap-1 ${item.color}`}
                >
                  <GraduationCap className="h-3.5 w-3.5 opacity-70" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      <div className="text-[10px] text-gray-400 text-center mt-6 max-w-xs leading-normal">
        <strong>Sistem Informasi Pemantauan Terpadu (SIPMT)</strong><br />
        MTs Agama Islam Mertapada &copy; 2026. All rights reserved.
      </div>
      
    </div>
  );
};
