/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store';
import { Smartphone, Send, Clock, User, X, CheckCheck, ShieldCheck } from 'lucide-react';

interface WhatsAppSimulationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppSimulation: React.FC<WhatsAppSimulationProps> = ({ isOpen, onClose }) => {
  const { state } = useApp();
  const [selectedNotifId, setSelectedNotifId] = useState<string | null>(null);

  if (!isOpen) return null;

  const notifications = state.waNotifications;
  const activeNotif = notifications.find(n => n.id === selectedNotifId) || notifications[0];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300">
      <div className="bg-emerald-900/40 w-full max-w-4xl h-full flex flex-col md:flex-row shadow-2xl overflow-hidden animate-slide-in">
        
        {/* Left Side: Log List */}
        <div className="flex-1 bg-white flex flex-col h-1/2 md:h-full border-r border-gray-200">
          <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-amber-400" />
                Simulasi WhatsApp Gateway
              </h2>
              <p className="text-xs text-emerald-100">Pemantauan Terpadu Notifikasi Orang Tua</p>
            </div>
            <button 
              id="btn-close-wa-sim"
              onClick={onClose} 
              className="text-white hover:text-amber-400 p-1 rounded-full hover:bg-emerald-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 mt-0.5 text-amber-600 shrink-0" />
            <span>
              <strong>Info Sistem:</strong> Fitur ini memicu pesan otomatis dari WhatsApp Gateway sekolah ke nomor Orang Tua/Wali ketika Guru menginput kehadiran siswa sebagai <strong>Sakit</strong>, <strong>Izin</strong>, atau <strong>Alpa</strong>.
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Daftar Antrean Pesan Terkirim</h3>
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Smartphone className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm">Belum ada notifikasi WhatsApp yang dikirim hari ini.</p>
                <p className="text-xs mt-1">Lakukan absensi Guru/Siswa untuk memicu pengiriman.</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isActive = activeNotif?.id === notif.id;
                return (
                  <div
                    key={notif.id}
                    id={`notif-item-${notif.id}`}
                    onClick={() => setSelectedNotifId(notif.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isActive 
                        ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600 shadow' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <div className="font-bold text-sm text-emerald-950 flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-emerald-700" />
                        {notif.namaOrangTua}
                      </div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notif.waktu}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      <span className="font-semibold text-gray-700">Siswa:</span> {notif.siswaNama}
                    </p>
                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-dashed border-gray-100">
                      <span className="text-[10px] text-emerald-700 font-medium bg-emerald-100 px-2 py-0.5 rounded-full">
                        WA: {notif.teleponOrangTua}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCheck className="h-3.5 w-3.5" />
                        Delivered
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Phone View Mockup */}
        <div className="w-full md:w-[380px] bg-emerald-950/20 p-4 flex items-center justify-center h-1/2 md:h-full">
          <div className="bg-[#e5ddd5] w-full max-w-[340px] h-[520px] rounded-[36px] border-[10px] border-gray-900 shadow-2xl flex flex-col overflow-hidden relative">
            
            {/* Phone Speaker & Camera Bar */}
            <div className="absolute top-0 inset-x-0 h-5 bg-gray-900 rounded-b-xl flex items-center justify-center z-20">
              <div className="w-16 h-3.5 bg-black rounded-full flex items-center justify-center">
                <div className="w-8 h-1 bg-gray-800 rounded-full"></div>
              </div>
            </div>

            {/* Phone Status Bar */}
            <div className="bg-emerald-800 text-white text-[10px] pt-5 px-5 pb-1 flex justify-between items-center shrink-0 z-10">
              <span>08:45 AM</span>
              <div className="flex items-center gap-1">
                <span>LTE</span>
                <div className="w-4 h-2 bg-white rounded-xs"></div>
              </div>
            </div>

            {/* WhatsApp Contact Header */}
            {activeNotif ? (
              <div className="bg-emerald-800 text-white px-3 py-2.5 flex items-center gap-2 shrink-0 border-b border-emerald-900">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow">
                  {activeNotif.namaOrangTua.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs truncate leading-tight">{activeNotif.namaOrangTua}</div>
                  <div className="text-[9px] text-emerald-200">Orang Tua/Wali</div>
                </div>
                <div className="text-[9px] text-white/80 bg-emerald-900 px-1.5 py-0.5 rounded-sm">
                  Online
                </div>
              </div>
            ) : (
              <div className="bg-emerald-800 text-white px-3 py-2.5 text-center text-xs shrink-0 font-medium">
                Pilih pesan untuk melihat pratinjau
              </div>
            )}

            {/* WhatsApp Chat Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#efe7dd] relative flex flex-col justify-end">
              {activeNotif ? (
                <>
                  <div className="mx-auto my-1.5 bg-yellow-100/90 text-[9px] text-yellow-800 px-2.5 py-1 rounded-md text-center max-w-[90%] leading-relaxed shadow-xs">
                    🔒 Pesan terenkripsi secara simulasi. Dipicu oleh SIPMT Madrasah Tsanawiyah Agama Islam Mertapada.
                  </div>
                  
                  <div className="bg-white text-gray-800 text-xs p-3 rounded-lg rounded-tl-none self-start max-w-[85%] shadow-md leading-relaxed relative border-l-4 border-amber-500">
                    <pre className="whitespace-pre-wrap font-sans text-[11px]">{activeNotif.pesan}</pre>
                    <div className="text-[9px] text-gray-400 text-right mt-1.5 flex items-center justify-end gap-1 font-mono">
                      <span>{activeNotif.waktu.split(' ')[1] || '08:45'}</span>
                      <CheckCheck className="h-3.5 w-3.5 text-emerald-600 inline" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400 text-xs my-auto font-sans">
                  Belum ada pesan yang dipilih.
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="bg-[#f0f0f0] p-2 flex items-center gap-1.5 shrink-0 border-t border-gray-200">
              <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[11px] text-gray-400 border border-gray-200 flex justify-between items-center">
                <span>Ketik tanggapan wali murid...</span>
              </div>
              <div className="bg-emerald-700 p-2 rounded-full text-white cursor-not-allowed">
                <Send className="h-3.5 w-3.5" />
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};
