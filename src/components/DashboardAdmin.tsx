/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../store';
import { Guru, Siswa, Kelas, MataPelajaran, Jadwal, Semester, TahunAjaran, Pengguna, AbsensiGuru, AbsensiSiswa, Nilai, Izin, Pelanggaran, Pengumuman } from '../types';
import { 
  Users, UserCheck, BookOpen, Calendar, Settings, Award, 
  AlertTriangle, Bell, FileText, Database, Shield, Trash2, 
  Edit, Plus, Save, RotateCcw, Check, CheckCircle2, XCircle, 
  Download, Upload, Play, Clock, HelpCircle, FileSpreadsheet, Eye
} from 'lucide-react';

export const DashboardAdmin: React.FC = () => {
  const { state, ...actions } = useApp();
  
  // Tab Management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'master' | 'akademik' | 'laporan' | 'system'>('dashboard');
  const [masterSubTab, setMasterSubTab] = useState<'guru' | 'siswa' | 'kelas' | 'mapel' | 'jadwal' | 'semester' | 'ta' | 'pengguna'>('guru');
  const [akadSubTab, setAkadSubTab] = useState<'absensi-guru' | 'absensi-siswa' | 'nilai' | 'izin' | 'pelanggaran' | 'pengumuman'>('absensi-guru');
  const [laporSubTab, setLaporSubTab] = useState<'absensi-g' | 'absensi-s' | 'nilai' | 'izin' | 'pelanggaran'>('absensi-g');

  // Backup / Restore Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CRUD Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Generic state for form inputs
  const [formData, setFormData] = useState<any>({});

  // Filters for Laporan
  const [filterKelas, setFilterKelas] = useState<string>('semua');
  const [filterMapel, setFilterMapel] = useState<string>('semua');
  const [filterHari, setFilterHari] = useState<string>('semua');

  // Trigger JSON file upload for Restore
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const success = actions.restoreDatabase(text);
      if (success) {
        alert('Database berhasil dipulihkan!');
      } else {
        alert('Gagal memulihkan database. Pastikan format file JSON valid.');
      }
    };
    reader.readAsText(file);
  };

  // Helper getters
  const getTeacherName = (id: string) => state.gurus.find(g => g.id === id)?.nama || 'Tidak Ada';
  const getClassName = (id: string) => state.kelas.find(c => c.id === id)?.nama || 'Belum Ditentukan';
  const getMapelName = (id: string) => state.mapels.find(m => m.id === id)?.nama || 'Tidak Ada';
  const getStudentName = (id: string) => state.siswas.find(s => s.id === id)?.nama || 'Tidak Ada';
  const getSemesterName = (id: string) => state.semesters.find(s => s.id === id)?.nama || 'Tidak Ada';

  // State stats
  const totalGurus = state.gurus.length;
  const totalSiswas = state.siswas.length;
  const totalKelas = state.kelas.length;
  const totalMapels = state.mapels.length;

  const getAttendanceGuruStat = () => {
    const today = new Date().toISOString().slice(0, 10);
    const todayAbs = state.absensiGurus.filter(a => a.tanggal === today);
    const hadir = todayAbs.filter(a => a.status === 'Hadir' || a.status === 'Terlambat').length;
    const terlambat = todayAbs.filter(a => a.status === 'Terlambat').length;
    const absen = todayAbs.filter(a => a.status === 'Alpa' || a.status === 'Izin' || a.status === 'Sakit').length;
    return { total: todayAbs.length, hadir, terlambat, absen };
  };

  const getAttendanceSiswaStat = () => {
    const today = new Date().toISOString().slice(0, 10);
    const todayAbs = state.absensiSiswas.filter(a => a.tanggal === today);
    const hadir = todayAbs.filter(a => a.status === 'Hadir').length;
    const absen = todayAbs.filter(a => a.status !== 'Hadir').length;
    return { total: todayAbs.length, hadir, absen };
  };

  const gStat = getAttendanceGuruStat();
  const sStat = getAttendanceSiswaStat();

  // Handle Form Submission for CRUD
  const handleSave = (entity: string) => {
    if (editingId === 'new') {
      // Create new
      switch (entity) {
        case 'guru':
          actions.addGuru(formData as any);
          break;
        case 'siswa':
          actions.addSiswa(formData as any);
          break;
        case 'kelas':
          actions.addKelas(formData as any);
          break;
        case 'mapel':
          actions.addMapel(formData as any);
          break;
        case 'jadwal':
          actions.addJadwal(formData as any);
          break;
        case 'semester':
          actions.addSemester(formData as any);
          break;
        case 'ta':
          actions.addTahunAjaran(formData as any);
          break;
        case 'pengguna':
          actions.addPengguna(formData as any);
          break;
        case 'nilai':
          actions.addNilai({
            siswaId: formData.siswaId || state.siswas[0]?.id || '',
            kelasId: formData.kelasId || state.kelas[0]?.id || '',
            mapelId: formData.mapelId || state.mapels[0]?.id || '',
            semesterId: state.semesters.find(s => s.status === 'Aktif')?.id || state.semesters[0]?.id || '',
            tugas: Number(formData.tugas) || 0,
            uh: Number(formData.uh) || 0,
            uts: Number(formData.uts) || 0,
            uas: Number(formData.uas) || 0,
          });
          break;
        case 'pelanggaran':
          actions.addPelanggaran({
            siswaId: formData.siswaId || state.siswas[0]?.id || '',
            jenisPelanggaran: formData.jenisPelanggaran || '',
            poin: Number(formData.poin) || 5,
            tanggal: formData.tanggal || new Date().toISOString().slice(0, 10),
            catatan: formData.catatan || '',
          });
          break;
        case 'pengumuman':
          actions.addPengumuman({
            judul: formData.judul || '',
            isi: formData.isi || '',
            tanggal: formData.tanggal || new Date().toISOString().slice(0, 10),
            target: formData.target || 'Semua',
            kelasId: formData.kelasId || '',
          });
          break;
      }
    } else if (editingId) {
      // Update existing
      switch (entity) {
        case 'guru':
          actions.updateGuru(editingId, formData);
          break;
        case 'siswa':
          actions.updateSiswa(editingId, formData);
          break;
        case 'kelas':
          actions.updateKelas(editingId, formData);
          break;
        case 'mapel':
          actions.updateMapel(editingId, formData);
          break;
        case 'jadwal':
          actions.updateJadwal(editingId, formData);
          break;
        case 'pengguna':
          actions.updatePengguna(editingId, formData);
          break;
        case 'nilai':
          actions.updateNilai(editingId, {
            ...formData,
            tugas: Number(formData.tugas),
            uh: Number(formData.uh),
            uts: Number(formData.uts),
            uas: Number(formData.uas),
          });
          break;
        case 'pelanggaran':
          actions.updatePelanggaran(editingId, {
            ...formData,
            poin: Number(formData.poin),
          });
          break;
        case 'pengumuman':
          actions.updatePengumuman(editingId, formData);
          break;
      }
    }
    setEditingId(null);
    setFormData({});
  };

  const startCreate = (defaultVals: any) => {
    setEditingId('new');
    setFormData(defaultVals);
  };

  const startEdit = (id: string, currentVals: any) => {
    setEditingId(id);
    setFormData({ ...currentVals });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-800">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-emerald-900 text-white shrink-0 shadow-lg flex flex-col">
        
        {/* Admin Header */}
        <div className="p-5 border-b border-emerald-800 bg-emerald-950 flex items-center gap-3">
          <div className="bg-amber-500 p-2 rounded-lg text-emerald-950 font-black text-sm">
            ADM
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Portal Administrator</h2>
            <p className="text-[10px] text-emerald-200">ID: admin | {state.currentUser.nama}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            id="nav-admin-dashboard"
            onClick={() => { setActiveTab('dashboard'); setEditingId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-amber-500 text-emerald-950 shadow-md font-bold' 
                : 'hover:bg-emerald-800 text-emerald-100'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>DASHBOARD STATISTIK</span>
          </button>

          <button
            id="nav-admin-master"
            onClick={() => { setActiveTab('master'); setEditingId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'master' 
                ? 'bg-amber-500 text-emerald-950 shadow-md font-bold' 
                : 'hover:bg-emerald-800 text-emerald-100'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>KELOLA MASTER DATA</span>
          </button>

          <button
            id="nav-admin-akademik"
            onClick={() => { setActiveTab('akademik'); setEditingId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'akademik' 
                ? 'bg-amber-500 text-emerald-950 shadow-md font-bold' 
                : 'hover:bg-emerald-800 text-emerald-100'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>KONTROL AKADEMIK</span>
          </button>

          <button
            id="nav-admin-laporan"
            onClick={() => { setActiveTab('laporan'); setEditingId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'laporan' 
                ? 'bg-amber-500 text-emerald-950 shadow-md font-bold' 
                : 'hover:bg-emerald-800 text-emerald-100'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>LAPORAN & EKSPOR</span>
          </button>

          <button
            id="nav-admin-system"
            onClick={() => { setActiveTab('system'); setEditingId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'system' 
                ? 'bg-amber-500 text-emerald-950 shadow-md font-bold' 
                : 'hover:bg-emerald-800 text-emerald-100'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>SISTEM, BACKUP & LOGS</span>
          </button>
        </div>

        {/* Institution Stamp */}
        <div className="p-4 bg-emerald-950 text-center text-[10px] text-emerald-300 border-t border-emerald-800">
          <p className="font-semibold">MTs Agama Islam Mertapada</p>
          <p className="text-[8px] opacity-75 mt-0.5">Sistem Informasi Pemantauan Terpadu</p>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 mb-6 gap-3">
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">Sistem Integrasi</div>
            <h1 className="text-2xl font-black text-emerald-900 tracking-tight uppercase">
              {activeTab === 'dashboard' && 'Dashboard Pemantauan'}
              {activeTab === 'master' && `Master Data: ${masterSubTab.toUpperCase()}`}
              {activeTab === 'akademik' && `Akademik: ${akadSubTab.replace('-', ' ').toUpperCase()}`}
              {activeTab === 'laporan' && `Pusat Cetak Laporan`}
              {activeTab === 'system' && 'Keamanan & Cadangan Database'}
            </h1>
          </div>
          <div className="text-right text-xs text-gray-500 font-mono">
            <span>Hari Ini: </span>
            <span className="font-bold text-emerald-800">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: DASHBOARD STATISTIK */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:shadow transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Guru</span>
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-gray-900">{totalGurus}</div>
                <div className="text-[10px] text-gray-500 mt-1">
                  PNS: <span className="font-bold">{state.gurus.filter(g => g.statusKepegawaian === 'PNS').length}</span> | GTT: <span className="font-bold">{state.gurus.filter(g => g.statusKepegawaian === 'GTT').length}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:shadow transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Siswa</span>
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-gray-900">{totalSiswas}</div>
                <div className="text-[10px] text-gray-500 mt-1">
                  Lk: <span className="font-bold">{state.siswas.filter(s => s.jenisKelamin === 'Laki-laki').length}</span> | Pr: <span className="font-bold">{state.siswas.filter(s => s.jenisKelamin === 'Perempuan').length}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:shadow transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Hadir Hari Ini</span>
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <UserCheck className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-gray-900">
                  {sStat.hadir} <span className="text-xs text-gray-400 font-normal">/ {totalSiswas} Siswa</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-bold mt-1">
                  Persentase: {totalSiswas > 0 ? Math.round((sStat.hadir / totalSiswas) * 100) : 0}%
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:shadow transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Guru Presensi</span>
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-2xl font-black text-gray-900">
                  {gStat.hadir} <span className="text-xs text-gray-400 font-normal">/ {totalGurus} Guru</span>
                </div>
                <div className="text-[10px] text-red-600 font-bold mt-1">
                  Terlambat: {gStat.terlambat} | Izin/Sakit: {gStat.absen}
                </div>
              </div>
            </div>

            {/* Quick Insights Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Academic quick check */}
              <div className="bg-emerald-950 text-white p-6 rounded-xl border border-emerald-800 shadow md:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Sistem Informasi Pemantauan Terpadu (SIPMT)
                  </h3>
                  <p className="text-xs text-emerald-100 mt-2 leading-relaxed">
                    Aplikasi SIPMT dirancang untuk meningkatkan mutu pengajaran di Madrasah Tsanawiyah Agama Islam Mertapada. Sistem memantau kedisiplinan guru di setiap jam KBM, mendeteksi potensi kelas kosong secara real-time, mengamankan absensi siswa, dan mendistribusikan notifikasi kehadiran langsung ke gadget orang tua.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-emerald-800 text-center">
                  <div>
                    <div className="text-lg font-bold text-amber-400">{state.kelas.length}</div>
                    <div className="text-[9px] text-emerald-300 uppercase">Kelas Aktif</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-400">{state.mapels.length}</div>
                    <div className="text-[9px] text-emerald-300 uppercase">Mata Pelajaran</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-400">{state.jadwals.length}</div>
                    <div className="text-[9px] text-emerald-300 uppercase">Jadwal / Minggu</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Active System Info */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Informasi Akademik Aktif</h3>
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Tahun Ajaran</span>
                    <span className="font-bold text-emerald-900">
                      {state.tahunAjarans.find(t => t.status === 'Aktif')?.tahun || 'Tidak Ada'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Semester Aktif</span>
                    <span className="font-bold text-emerald-900">
                      {state.semesters.find(s => s.status === 'Aktif')?.nama || 'Tidak Ada'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">Izin Pending</span>
                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      {state.izins.filter(i => i.statusPersetujuan === 'Pending').length} Berkas
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-gray-500">Total Pelanggaran Siswa</span>
                    <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      {state.pelanggarans.length} Kasus
                    </span>
                  </div>
                </div>
                <div className="mt-5 p-3 bg-gray-50 rounded-lg text-[10px] text-gray-500 text-center">
                  Gunakan menu sidebar untuk mengakses kendali penuh.
                </div>
              </div>
            </div>

            {/* Quick Activity Logs */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="h-4.5 w-4.5 text-emerald-700" />
                  Log Aktivitas Sistem Terkini
                </h3>
                <span className="text-[10px] text-gray-400 uppercase font-bold font-mono">10 LOG TERAKHIR</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold">
                      <th className="py-2.5">Waktu</th>
                      <th className="py-2.5">Pengguna</th>
                      <th className="py-2.5">Aktivitas</th>
                      <th className="py-2.5">Rincian Deskripsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                    {state.logs.slice(0, 10).map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="py-2.5 text-gray-500">{log.waktu}</td>
                        <td className="py-2.5">
                          <span className="font-bold text-emerald-800">{log.pengguna}</span>
                          <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded ml-1 uppercase">{log.role}</span>
                        </td>
                        <td className="py-2.5 text-amber-700 font-bold">{log.aktivitas}</td>
                        <td className="py-2.5 text-gray-600">{log.rincian}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MASTER DATA CRUD PANEL */}
        {/* ========================================================= */}
        {activeTab === 'master' && (
          <div className="space-y-6">
            
            {/* Master Data Sub navigation */}
            <div className="flex flex-wrap gap-1 bg-white p-1.5 border border-gray-200 rounded-lg">
              {(['guru', 'siswa', 'kelas', 'mapel', 'jadwal', 'semester', 'ta', 'pengguna'] as const).map(sub => (
                <button
                  key={sub}
                  id={`btn-master-sub-${sub}`}
                  onClick={() => { setMasterSubTab(sub); setEditingId(null); setFormData({}); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                    masterSubTab === sub 
                      ? 'bg-emerald-800 text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {sub === 'ta' ? 'Tahun Ajaran' : sub}
                </button>
              ))}
            </div>

            {/* Editing Form Section (If editingId is not null) */}
            {editingId !== null && (
              <div className="bg-amber-50/60 p-6 rounded-xl border-2 border-amber-500 shadow-sm animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-emerald-950 flex items-center gap-1.5">
                    <Edit className="h-4 w-4 text-amber-600" />
                    {editingId === 'new' ? 'Tambah Data Baru' : `Edit Data #${editingId}`}
                  </h3>
                  <button 
                    onClick={() => { setEditingId(null); setFormData({}); }}
                    className="text-gray-500 hover:text-red-600 text-xs font-semibold uppercase"
                  >
                    Batal
                  </button>
                </div>

                {/* Form Builders per SubTab */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {masterSubTab === 'guru' && (
                    <>
                      <div>
                        <label className="block font-bold mb-1">NIP / NUPTK</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="contoh: 1980..."
                          value={formData.nip || ''} onChange={e => setFormData({...formData, nip: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Nama Lengkap & Gelar</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="Nama..."
                          value={formData.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Jenis Kelamin</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.jenisKelamin || 'Laki-laki'} onChange={e => setFormData({...formData, jenisKelamin: e.target.value})}
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Email Sekolah</label>
                        <input 
                          type="email" className="w-full p-2 border rounded bg-white" placeholder="email@mts..."
                          value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">No. Telepon / WA</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="08..."
                          value={formData.telepon || ''} onChange={e => setFormData({...formData, telepon: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Status Kepegawaian</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.statusKepegawaian || 'PNS'} onChange={e => setFormData({...formData, statusKepegawaian: e.target.value})}
                        >
                          <option value="PNS">PNS</option>
                          <option value="GTT">GTT (Guru Tidak Tetap)</option>
                          <option value="Honorer">Honorer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Mata Pelajaran Utama</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="contoh: Fiqih"
                          value={formData.mapelUtama || ''} onChange={e => setFormData({...formData, mapelUtama: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  {masterSubTab === 'siswa' && (
                    <>
                      <div>
                        <label className="block font-bold mb-1">NIS (Nomor Induk Siswa)</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="NIS..."
                          value={formData.nis || ''} onChange={e => setFormData({...formData, nis: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">NISN</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="NISN..."
                          value={formData.nisn || ''} onChange={e => setFormData({...formData, nisn: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Nama Lengkap Siswa</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="Nama Siswa..."
                          value={formData.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Kelas</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.kelasId || ''} onChange={e => setFormData({...formData, kelasId: e.target.value})}
                        >
                          <option value="">Pilih Kelas</option>
                          {state.kelas.map(c => (
                            <option key={c.id} value={c.id}>{c.nama}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Jenis Kelamin</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.jenisKelamin || 'Laki-laki'} onChange={e => setFormData({...formData, jenisKelamin: e.target.value})}
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Tanggal Lahir</label>
                        <input 
                          type="date" className="w-full p-2 border rounded bg-white"
                          value={formData.tanggalLahir || ''} onChange={e => setFormData({...formData, tanggalLahir: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-bold mb-1">Alamat Domisili</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="Alamat..."
                          value={formData.alamat || ''} onChange={e => setFormData({...formData, alamat: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Nama Orang Tua / Wali</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="Nama Wali..."
                          value={formData.namaOrangTua || ''} onChange={e => setFormData({...formData, namaOrangTua: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">No. HP Orang Tua (WhatsApp)</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="Contoh: 08..."
                          value={formData.teleponOrangTua || ''} onChange={e => setFormData({...formData, teleponOrangTua: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  {masterSubTab === 'kelas' && (
                    <>
                      <div>
                        <label className="block font-bold mb-1">Nama Kelas</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="Contoh: VII-A, VIII-B"
                          value={formData.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Tingkat Madrasah</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.tingkat || 'VII'} onChange={e => setFormData({...formData, tingkat: e.target.value as any})}
                        >
                          <option value="VII">Tingkat VII (7)</option>
                          <option value="VIII">Tingkat VIII (8)</option>
                          <option value="IX">Tingkat IX (9)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Wali Kelas (Guru)</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.waliKelasId || ''} onChange={e => setFormData({...formData, waliKelasId: e.target.value})}
                        >
                          <option value="">Pilih Guru Wali</option>
                          {state.gurus.map(g => (
                            <option key={g.id} value={g.id}>{g.nama}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {masterSubTab === 'mapel' && (
                    <>
                      <div>
                        <label className="block font-bold mb-1">Kode Mata Pelajaran</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="Contoh: FIQ, MAT"
                          value={formData.kode || ''} onChange={e => setFormData({...formData, kode: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Nama Mata Pelajaran</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="Nama Mapel..."
                          value={formData.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">KKM (Kriteria Ketuntasan Minimal)</label>
                        <input 
                          type="number" className="w-full p-2 border rounded bg-white" placeholder="contoh: 75"
                          value={formData.kkm || 75} onChange={e => setFormData({...formData, kkm: Number(e.target.value)})}
                        />
                      </div>
                    </>
                  )}

                  {masterSubTab === 'jadwal' && (
                    <>
                      <div>
                        <label className="block font-bold mb-1">Pilih Kelas</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.kelasId || ''} onChange={e => setFormData({...formData, kelasId: e.target.value})}
                        >
                          <option value="">Pilih Kelas</option>
                          {state.kelas.map(c => (
                            <option key={c.id} value={c.id}>{c.nama}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Pilih Mata Pelajaran</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.mapelId || ''} onChange={e => setFormData({...formData, mapelId: e.target.value})}
                        >
                          <option value="">Pilih Mapel</option>
                          {state.mapels.map(m => (
                            <option key={m.id} value={m.id}>{m.nama}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Guru Pengajar</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.guruId || ''} onChange={e => setFormData({...formData, guruId: e.target.value})}
                        >
                          <option value="">Pilih Guru</option>
                          {state.gurus.map(g => (
                            <option key={g.id} value={g.id}>{g.nama}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Hari</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.hari || 'Senin'} onChange={e => setFormData({...formData, hari: e.target.value as any})}
                        >
                          <option value="Senin">Senin</option>
                          <option value="Selasa">Selasa</option>
                          <option value="Rabu">Rabu</option>
                          <option value="Kamis">Kamis</option>
                          <option value="Jumat">Jumat</option>
                          <option value="Sabtu">Sabtu</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Jam Mulai</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="Contoh: 07:30"
                          value={formData.jamMulai || ''} onChange={e => setFormData({...formData, jamMulai: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Jam Selesai</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="Contoh: 09:00"
                          value={formData.jamSelesai || ''} onChange={e => setFormData({...formData, jamSelesai: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  {masterSubTab === 'semester' && (
                    <>
                      <div>
                        <label className="block font-bold mb-1">Nama Semester</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.nama || 'Ganjil'} onChange={e => setFormData({...formData, nama: e.target.value as any})}
                        >
                          <option value="Ganjil">Ganjil</option>
                          <option value="Genap">Genap</option>
                        </select>
                      </div>
                    </>
                  )}

                  {masterSubTab === 'ta' && (
                    <>
                      <div>
                        <label className="block font-bold mb-1">Tahun Ajaran</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="Contoh: 2025/2026"
                          value={formData.tahun || ''} onChange={e => setFormData({...formData, tahun: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  {masterSubTab === 'pengguna' && (
                    <>
                      <div>
                        <label className="block font-bold mb-1">Username Login</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="username..."
                          value={formData.username || ''} onChange={e => setFormData({...formData, username: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Nama Tampilan</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="Nama lengkap..."
                          value={formData.nama || ''} onChange={e => setFormData({...formData, nama: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Hak Akses (Role)</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.role || 'Siswa'} onChange={e => setFormData({...formData, role: e.target.value as any})}
                        >
                          <option value="Administrator">Administrator</option>
                          <option value="Guru">Guru</option>
                          <option value="Wali Kelas">Wali Kelas</option>
                          <option value="Kepala Madrasah">Kepala Madrasah</option>
                          <option value="Orang Tua">Orang Tua</option>
                          <option value="Siswa">Siswa</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2 justify-end mt-5 pt-4 border-t border-amber-200">
                  <button 
                    onClick={() => { setEditingId(null); setFormData({}); }}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-colors text-xs uppercase"
                  >
                    Batal
                  </button>
                  <button 
                    id="btn-save-master-item"
                    onClick={() => handleSave(masterSubTab)}
                    className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors text-xs uppercase flex items-center gap-1.5 shadow"
                  >
                    <Save className="h-4 w-4" />
                    Simpan Data
                  </button>
                </div>
              </div>
            )}

            {/* List Table and Actions */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h3 className="text-sm font-black text-emerald-950 uppercase tracking-tight">
                  Tabel Data {masterSubTab === 'ta' ? 'Tahun Ajaran' : masterSubTab} ({
                    masterSubTab === 'guru' ? state.gurus.length :
                    masterSubTab === 'siswa' ? state.siswas.length :
                    masterSubTab === 'kelas' ? state.kelas.length :
                    masterSubTab === 'mapel' ? state.mapels.length :
                    masterSubTab === 'jadwal' ? state.jadwals.length :
                    masterSubTab === 'semester' ? state.semesters.length :
                    masterSubTab === 'ta' ? state.tahunAjarans.length :
                    state.penggunas.length
                  } Baris)
                </h3>
                {editingId === null && (
                  <button
                    id="btn-add-master-item"
                    onClick={() => startCreate(
                      masterSubTab === 'guru' ? { jenisKelamin: 'Laki-laki', statusKepegawaian: 'PNS' } :
                      masterSubTab === 'siswa' ? { jenisKelamin: 'Laki-laki', kelasId: state.kelas[0]?.id || '' } :
                      masterSubTab === 'kelas' ? { tingkat: 'VII', waliKelasId: state.gurus[0]?.id || '' } :
                      masterSubTab === 'mapel' ? { kkm: 75 } :
                      masterSubTab === 'jadwal' ? { hari: 'Senin', kelasId: state.kelas[0]?.id || '', mapelId: state.mapels[0]?.id || '', guruId: state.gurus[0]?.id || '' } :
                      masterSubTab === 'semester' ? { nama: 'Ganjil', status: 'Tidak Aktif' } :
                      masterSubTab === 'ta' ? { status: 'Tidak Aktif' } :
                      { role: 'Siswa' }
                    )}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shadow"
                  >
                    <Plus className="h-4 w-4 text-amber-400" />
                    <span>Tambah {masterSubTab.toUpperCase()} Baru</span>
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  
                  {/* Table Header based on SubTab */}
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                      {masterSubTab === 'guru' && (
                        <>
                          <th className="p-3">NIP</th>
                          <th className="p-3">Nama Lengkap</th>
                          <th className="p-3">Kepegawaian</th>
                          <th className="p-3">Mapel Utama</th>
                          <th className="p-3">Email & Telp</th>
                          <th className="p-3 text-center">Aksi</th>
                        </>
                      )}
                      {masterSubTab === 'siswa' && (
                        <>
                          <th className="p-3">NIS/NISN</th>
                          <th className="p-3">Nama Siswa</th>
                          <th className="p-3">Kelas</th>
                          <th className="p-3">Gender & Tgl Lahir</th>
                          <th className="p-3">Wali & Kontak</th>
                          <th className="p-3 text-center">Aksi</th>
                        </>
                      )}
                      {masterSubTab === 'kelas' && (
                        <>
                          <th className="p-3">Nama Kelas</th>
                          <th className="p-3">Tingkat</th>
                          <th className="p-3">Wali Kelas</th>
                          <th className="p-3 text-center">Aksi</th>
                        </>
                      )}
                      {masterSubTab === 'mapel' && (
                        <>
                          <th className="p-3">Kode</th>
                          <th className="p-3">Nama Mata Pelajaran</th>
                          <th className="p-3">KKM Kelulusan</th>
                          <th className="p-3 text-center">Aksi</th>
                        </>
                      )}
                      {masterSubTab === 'jadwal' && (
                        <>
                          <th className="p-3">Hari</th>
                          <th className="p-3">Jam KBM</th>
                          <th className="p-3">Kelas</th>
                          <th className="p-3">Mata Pelajaran</th>
                          <th className="p-3">Guru Pengajar</th>
                          <th className="p-3 text-center">Aksi</th>
                        </>
                      )}
                      {masterSubTab === 'semester' && (
                        <>
                          <th className="p-3">Nama Semester</th>
                          <th className="p-3">Status Sistem</th>
                          <th className="p-3 text-center">Aktivasi</th>
                          <th className="p-3 text-center">Aksi</th>
                        </>
                      )}
                      {masterSubTab === 'ta' && (
                        <>
                          <th className="p-3">Tahun Ajaran</th>
                          <th className="p-3">Status Sistem</th>
                          <th className="p-3 text-center">Aktivasi</th>
                          <th className="p-3 text-center">Aksi</th>
                        </>
                      )}
                      {masterSubTab === 'pengguna' && (
                        <>
                          <th className="p-3">Username</th>
                          <th className="p-3">Nama Tampilan</th>
                          <th className="p-3">Hak Akses Role</th>
                          <th className="p-3 text-center">Aksi</th>
                        </>
                      )}
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-gray-100 font-sans">
                    
                    {/* GURU */}
                    {masterSubTab === 'guru' && state.gurus.map(g => (
                      <tr key={g.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-mono font-bold text-gray-500">{g.nip || 'HONORER'}</td>
                        <td className="p-3 font-bold text-emerald-950">{g.nama}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            g.statusKepegawaian === 'PNS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>{g.statusKepegawaian}</span>
                        </td>
                        <td className="p-3 text-gray-600 font-semibold">{g.mapelUtama}</td>
                        <td className="p-3">
                          <div className="text-[10px] text-gray-500">{g.email}</div>
                          <div className="text-[11px] font-bold text-gray-700">{g.telepon}</div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => startEdit(g.id, g)} className="p-1.5 hover:bg-amber-100 rounded text-amber-700" title="Edit"><Edit className="h-3.5 w-3.5" /></button>
                            <button onClick={() => actions.deleteGuru(g.id)} className="p-1.5 hover:bg-red-100 rounded text-red-600" title="Hapus"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* SISWA */}
                    {masterSubTab === 'siswa' && state.siswas.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-mono text-gray-500">
                          <div>NIS: <span className="font-bold">{s.nis}</span></div>
                          <div>NISN: {s.nisn}</div>
                        </td>
                        <td className="p-3 font-bold text-emerald-950">{s.nama}</td>
                        <td className="p-3 font-bold text-gray-700">{getClassName(s.kelasId)}</td>
                        <td className="p-3">
                          <div>{s.jenisKelamin}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{s.tanggalLahir}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-gray-700">{s.namaOrangTua}</div>
                          <div className="text-[10px] text-emerald-700 font-mono font-bold">{s.teleponOrangTua}</div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => startEdit(s.id, s)} className="p-1.5 hover:bg-amber-100 rounded text-amber-700" title="Edit"><Edit className="h-3.5 w-3.5" /></button>
                            <button onClick={() => actions.deleteSiswa(s.id)} className="p-1.5 hover:bg-red-100 rounded text-red-600" title="Hapus"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* KELAS */}
                    {masterSubTab === 'kelas' && state.kelas.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-bold text-emerald-900 text-sm">{c.nama}</td>
                        <td className="p-3 font-mono text-gray-500">Tingkat {c.tingkat}</td>
                        <td className="p-3 font-semibold text-gray-800">{getTeacherName(c.waliKelasId)}</td>
                        <td className="p-3 text-center">
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => startEdit(c.id, c)} className="p-1.5 hover:bg-amber-100 rounded text-amber-700" title="Edit"><Edit className="h-3.5 w-3.5" /></button>
                            <button onClick={() => actions.deleteKelas(c.id)} className="p-1.5 hover:bg-red-100 rounded text-red-600" title="Hapus"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* MATA PELAJARAN */}
                    {masterSubTab === 'mapel' && state.mapels.map(m => (
                      <tr key={m.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-mono font-bold text-amber-700">{m.kode}</td>
                        <td className="p-3 font-bold text-emerald-950">{m.nama}</td>
                        <td className="p-3 font-bold text-gray-700 text-sm">{m.kkm}</td>
                        <td className="p-3 text-center">
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => startEdit(m.id, m)} className="p-1.5 hover:bg-amber-100 rounded text-amber-700" title="Edit"><Edit className="h-3.5 w-3.5" /></button>
                            <button onClick={() => actions.deleteMapel(m.id)} className="p-1.5 hover:bg-red-100 rounded text-red-600" title="Hapus"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* JADWAL */}
                    {masterSubTab === 'jadwal' && state.jadwals.map(j => (
                      <tr key={j.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-bold text-emerald-800">{j.hari}</td>
                        <td className="p-3 font-mono font-bold">{j.jamMulai} - {j.jamSelesai}</td>
                        <td className="p-3 font-semibold text-gray-700">{getClassName(j.kelasId)}</td>
                        <td className="p-3 font-bold text-gray-800">{getMapelName(j.mapelId)}</td>
                        <td className="p-3 text-gray-500 text-[11px]">{getTeacherName(j.guruId)}</td>
                        <td className="p-3 text-center">
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => startEdit(j.id, j)} className="p-1.5 hover:bg-amber-100 rounded text-amber-700" title="Edit"><Edit className="h-3.5 w-3.5" /></button>
                            <button onClick={() => actions.deleteJadwal(j.id)} className="p-1.5 hover:bg-red-100 rounded text-red-600" title="Hapus"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* SEMESTER */}
                    {masterSubTab === 'semester' && state.semesters.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-bold text-emerald-950">Semester {s.nama}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            s.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-500' : 'bg-gray-100 text-gray-400'
                          }`}>{s.status}</span>
                        </td>
                        <td className="p-3 text-center">
                          {s.status === 'Tidak Aktif' && (
                            <button
                              onClick={() => actions.toggleSemesterStatus(s.id)}
                              className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black px-3 py-1 rounded text-[10px] uppercase transition-colors"
                            >
                              Aktifkan
                            </button>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => actions.deleteSemester(s.id)} className="p-1.5 hover:bg-red-100 rounded text-red-600" title="Hapus"><Trash2 className="h-3.5 w-3.5" /></button>
                        </td>
                      </tr>
                    ))}

                    {/* TAHUN AJARAN */}
                    {masterSubTab === 'ta' && state.tahunAjarans.map(t => (
                      <tr key={t.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-bold text-emerald-950">{t.tahun}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            t.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-500' : 'bg-gray-100 text-gray-400'
                          }`}>{t.status}</span>
                        </td>
                        <td className="p-3 text-center">
                          {t.status === 'Tidak Aktif' && (
                            <button
                              onClick={() => actions.toggleTahunAjaranStatus(t.id)}
                              className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black px-3 py-1 rounded text-[10px] uppercase transition-colors"
                            >
                              Aktifkan
                            </button>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button onClick={() => actions.deleteTahunAjaran(t.id)} className="p-1.5 hover:bg-red-100 rounded text-red-600" title="Hapus"><Trash2 className="h-3.5 w-3.5" /></button>
                        </td>
                      </tr>
                    ))}

                    {/* PENGGUNA */}
                    {masterSubTab === 'pengguna' && state.penggunas.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-mono font-bold text-amber-700">@{u.username}</td>
                        <td className="p-3 font-semibold text-gray-800">{u.nama}</td>
                        <td className="p-3 font-bold text-emerald-950">
                          <span className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase text-[9px] tracking-wide">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex gap-1 justify-center">
                            <button onClick={() => startEdit(u.id, u)} className="p-1.5 hover:bg-amber-100 rounded text-amber-700" title="Edit"><Edit className="h-3.5 w-3.5" /></button>
                            <button onClick={() => actions.deletePengguna(u.id)} className="p-1.5 hover:bg-red-100 rounded text-red-600" title="Hapus"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: KONTROL AKADEMIK */}
        {/* ========================================================= */}
        {activeTab === 'akademik' && (
          <div className="space-y-6">
            
            {/* Academic sub tab bar */}
            <div className="flex flex-wrap gap-1 bg-white p-1.5 border border-gray-200 rounded-lg">
              {(['absensi-guru', 'absensi-siswa', 'nilai', 'izin', 'pelanggaran', 'pengumuman'] as const).map(sub => (
                <button
                  key={sub}
                  id={`btn-akad-sub-${sub}`}
                  onClick={() => { setAkadSubTab(sub); setEditingId(null); setFormData({}); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                    akadSubTab === sub 
                      ? 'bg-emerald-800 text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {sub.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Content Switcher */}
            {akadSubTab === 'absensi-guru' && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-black text-emerald-950 uppercase text-sm">Pemantauan Presensi Guru Hari Ini</h3>
                    <p className="text-xs text-gray-500">Mencatat atau merevisi kehadiran staf pengajar.</p>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded">Tanggal: {new Date().toISOString().slice(0, 10)}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5">Nama Guru</th>
                        <th className="py-2.5">Jam Mengajar Utama</th>
                        <th className="py-2.5">Status Kehadiran</th>
                        <th className="py-2.5">Waktu Presensi</th>
                        <th className="py-2.5">Catatan / Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {state.gurus.map(g => {
                        const todayStr = new Date().toISOString().slice(0, 10);
                        const attendRecord = state.absensiGurus.find(a => a.guruId === g.id && a.tanggal === todayStr);
                        const activeStatus = attendRecord?.status || 'Belum Absen';
                        return (
                          <tr key={g.id} className="hover:bg-gray-50">
                            <td className="py-3">
                              <div className="font-bold text-emerald-950">{g.nama}</div>
                              <div className="text-[10px] text-gray-500 font-mono">NIP: {g.nip || '-'} | Mapel: {g.mapelUtama}</div>
                            </td>
                            <td className="py-3 text-gray-600 font-semibold">
                              {state.jadwals.filter(j => j.guruId === g.id).map(j => `${j.hari} (${j.jamMulai}-${j.jamSelesai})`).join(', ') || 'Piket / Tidak mengajar'}
                            </td>
                            <td className="py-3">
                              <div className="flex gap-1.5 flex-wrap">
                                {(['Hadir', 'Izin', 'Sakit', 'Alpa', 'Terlambat'] as const).map(st => (
                                  <button
                                    key={st}
                                    id={`btn-attend-guru-${g.id}-${st}`}
                                    onClick={() => actions.upsertAbsensiGuru(g.id, todayStr, st, attendRecord?.catatan || 'Presensi Admin')}
                                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                                      activeStatus === st 
                                        ? 'bg-emerald-700 text-white shadow-xs scale-105' 
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                  >
                                    {st}
                                  </button>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 font-mono font-bold text-emerald-800 text-center">
                              {attendRecord?.waktuPresensi || '-'}
                            </td>
                            <td className="py-3">
                              <input
                                type="text"
                                placeholder="Ketik catatan..."
                                value={attendRecord?.catatan || ''}
                                onChange={(e) => actions.upsertAbsensiGuru(g.id, todayStr, activeStatus as any, e.target.value)}
                                className="border border-gray-200 bg-white p-1 rounded w-full text-xs"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {akadSubTab === 'absensi-siswa' && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                  <div>
                    <h3 className="font-black text-emerald-950 uppercase text-sm">Input Kehadiran Siswa</h3>
                    <p className="text-xs text-gray-500">Gunakan filter untuk memilih kelas siswa.</p>
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="text-xs font-bold p-2 border rounded bg-white"
                      value={filterKelas}
                      onChange={e => setFilterKelas(e.target.value)}
                    >
                      <option value="semua">Semua Kelas</option>
                      {state.kelas.map(c => (
                        <option key={c.id} value={c.id}>{c.nama}</option>
                      ))}
                    </select>
                    <span className="text-xs font-mono bg-emerald-50 text-emerald-800 font-bold p-2 rounded">Tanggal: {new Date().toISOString().slice(0, 10)}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5">Siswa</th>
                        <th className="py-2.5">Kelas</th>
                        <th className="py-2.5">Ubah Status Kehadiran</th>
                        <th className="py-2.5">Keterangan / Catatan</th>
                        <th className="py-2.5 text-center">Notifikasi WA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {state.siswas
                        .filter(s => filterKelas === 'semua' ? true : s.kelasId === filterKelas)
                        .map(s => {
                          const todayStr = new Date().toISOString().slice(0, 10);
                          const att = state.absensiSiswas.find(a => a.siswaId === s.id && a.tanggal === todayStr);
                          const activeStatus = att?.status || 'Belum Absen';
                          return (
                            <tr key={s.id} className="hover:bg-gray-50">
                              <td className="py-3">
                                <div className="font-bold text-emerald-950">{s.nama}</div>
                                <div className="text-[10px] text-gray-500 font-mono">NIS: {s.nis} | Wali: {s.namaOrangTua}</div>
                              </td>
                              <td className="py-3 font-bold text-gray-700">{getClassName(s.kelasId)}</td>
                              <td className="py-3">
                                <div className="flex gap-1">
                                  {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as const).map(st => (
                                    <button
                                      key={st}
                                      id={`btn-attend-siswa-${s.id}-${st}`}
                                      onClick={() => actions.upsertAbsensiSiswa(s.id, s.kelasId, todayStr, st, att?.catatan || 'Presensi Piket')}
                                      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                                        activeStatus === st 
                                          ? 'bg-emerald-700 text-white shadow-xs scale-105' 
                                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                      }`}
                                    >
                                      {st}
                                    </button>
                                  ))}
                                </div>
                              </td>
                              <td className="py-3">
                                <input
                                  type="text"
                                  placeholder="Sakit demam / Tanpa kabar..."
                                  value={att?.catatan || ''}
                                  onChange={(e) => actions.upsertAbsensiSiswa(s.id, s.kelasId, todayStr, activeStatus as any, e.target.value)}
                                  className="border border-gray-200 bg-white p-1 rounded w-full text-xs"
                                />
                              </td>
                              <td className="py-3 text-center">
                                {att?.waSentStatus ? (
                                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ring-1 ring-emerald-500">
                                    Terkirim ✓
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-gray-400">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {akadSubTab === 'nilai' && (
              <div className="space-y-6">
                
                {/* Grading CRUD Forms */}
                {editingId !== null && (
                  <div className="bg-amber-50 p-6 rounded-xl border-2 border-amber-500 shadow-sm">
                    <h3 className="text-sm font-bold text-emerald-950 mb-3">Input / Revisi Nilai Siswa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <label className="block font-bold mb-1">Pilih Siswa</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.siswaId || ''} onChange={e => {
                            const selectedS = state.siswas.find(s => s.id === e.target.value);
                            setFormData({...formData, siswaId: e.target.value, kelasId: selectedS?.kelasId || ''});
                          }}
                        >
                          <option value="">Pilih Siswa</option>
                          {state.siswas.map(s => (
                            <option key={s.id} value={s.id}>{s.nama} ({getClassName(s.kelasId)})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Pilih Mata Pelajaran</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.mapelId || ''} onChange={e => setFormData({...formData, mapelId: e.target.value})}
                        >
                          <option value="">Pilih Mapel</option>
                          {state.mapels.map(m => (
                            <option key={m.id} value={m.id}>{m.nama}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Semester</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.semesterId || ''} onChange={e => setFormData({...formData, semesterId: e.target.value})}
                        >
                          {state.semesters.map(s => (
                            <option key={s.id} value={s.id}>{s.nama} {s.status === 'Aktif' ? '(Aktif)' : ''}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-4 gap-1 md:col-span-1">
                        <div>
                          <label className="block font-bold mb-1">Tugas</label>
                          <input type="number" className="w-full p-1 border rounded bg-white text-center" value={formData.tugas || 0} onChange={e => setFormData({...formData, tugas: Number(e.target.value)})} />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">UH</label>
                          <input type="number" className="w-full p-1 border rounded bg-white text-center" value={formData.uh || 0} onChange={e => setFormData({...formData, uh: Number(e.target.value)})} />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">UTS</label>
                          <input type="number" className="w-full p-1 border rounded bg-white text-center" value={formData.uts || 0} onChange={e => setFormData({...formData, uts: Number(e.target.value)})} />
                        </div>
                        <div>
                          <label className="block font-bold mb-1">UAS</label>
                          <input type="number" className="w-full p-1 border rounded bg-white text-center" value={formData.uas || 0} onChange={e => setFormData({...formData, uas: Number(e.target.value)})} />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-amber-200">
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded font-bold">Batal</button>
                      <button onClick={() => handleSave('nilai')} className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded font-bold">Simpan Nilai</button>
                    </div>
                  </div>
                )}

                {/* Nilai List Table */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-emerald-950 uppercase text-xs">Arsip Buku Nilai Siswa</h3>
                    {editingId === null && (
                      <button 
                        onClick={() => startCreate({ tugas: 80, uh: 80, uts: 80, uas: 80, semesterId: state.semesters.find(s => s.status === 'Aktif')?.id })}
                        className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded font-bold flex items-center gap-1 shadow"
                      >
                        <Plus className="h-4 w-4" /> Input Nilai Baru
                      </button>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                          <th className="p-3">Siswa</th>
                          <th className="p-3">Kelas</th>
                          <th className="p-3">Mata Pelajaran</th>
                          <th className="p-3 text-center">Tugas</th>
                          <th className="p-3 text-center">UH</th>
                          <th className="p-3 text-center">UTS</th>
                          <th className="p-3 text-center">UAS</th>
                          <th className="p-3 text-center">Nilai Akhir</th>
                          <th className="p-3 text-center">Predikat</th>
                          <th className="p-3">Keterangan Capaian</th>
                          <th className="p-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {state.nilais.map(n => (
                          <tr key={n.id} className="hover:bg-gray-50">
                            <td className="p-3 font-bold text-emerald-950">{getStudentName(n.siswaId)}</td>
                            <td className="p-3 font-semibold text-gray-600">{getClassName(n.kelasId)}</td>
                            <td className="p-3 font-bold text-gray-800">{getMapelName(n.mapelId)}</td>
                            <td className="p-3 text-center font-mono">{n.tugas}</td>
                            <td className="p-3 text-center font-mono">{n.uh}</td>
                            <td className="p-3 text-center font-mono">{n.uts}</td>
                            <td className="p-3 text-center font-mono">{n.uas}</td>
                            <td className="p-3 text-center font-mono font-bold text-emerald-800 text-sm">{n.nilaiAkhir}</td>
                            <td className="p-3 text-center font-bold">
                              <span className={`px-2 py-0.5 rounded text-white text-[10px] font-black ${
                                n.predikat === 'A' ? 'bg-emerald-600' :
                                n.predikat === 'B' ? 'bg-amber-500' :
                                n.predikat === 'C' ? 'bg-yellow-600' :
                                'bg-red-500'
                              }`}>{n.predikat}</span>
                            </td>
                            <td className="p-3 text-[10px] text-gray-500 max-w-xs truncate" title={n.deskripsi}>{n.deskripsi}</td>
                            <td className="p-3 text-center">
                              <div className="flex gap-1 justify-center">
                                <button onClick={() => startEdit(n.id, n)} className="p-1 hover:bg-amber-100 rounded text-amber-700"><Edit className="h-3.5 w-3.5" /></button>
                                <button onClick={() => actions.deleteNilai(n.id)} className="p-1 hover:bg-red-100 rounded text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {akadSubTab === 'izin' && (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">Pengajuan & Persetujuan Surat Izin</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                        <th className="p-3">Tipe</th>
                        <th className="p-3">Nama Pemohon</th>
                        <th className="p-3">Tanggal Izin</th>
                        <th className="p-3">Alasan Izin</th>
                        <th className="p-3">Lampiran Berkasi</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Keputusan Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {state.izins.map(iz => {
                        const targetName = iz.tipe === 'Guru' 
                          ? state.gurus.find(g => g.id === iz.targetId)?.nama 
                          : state.siswas.find(s => s.id === iz.targetId)?.nama;
                        return (
                          <tr key={iz.id} className="hover:bg-gray-50">
                            <td className="p-3 font-bold text-gray-500">{iz.tipe.toUpperCase()}</td>
                            <td className="p-3 font-bold text-emerald-950">{targetName || 'N/A'}</td>
                            <td className="p-3 font-mono font-bold text-gray-700">{iz.tanggal}</td>
                            <td className="p-3 text-gray-600 max-w-sm">{iz.alasan}</td>
                            <td className="p-3 font-mono text-[10px] text-amber-700 font-bold underline flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5 inline text-gray-400" />
                              <a href="#" onClick={(e) => { e.preventDefault(); alert(`Membuka simulasi file lampiran: ${iz.lampiran}`); }}>
                                {iz.lampiran}
                              </a>
                            </td>
                            <td className="p-3 text-center font-bold">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${
                                iz.statusPersetujuan === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' :
                                iz.statusPersetujuan === 'Ditolak' ? 'bg-red-100 text-red-800' :
                                'bg-amber-100 text-amber-800 animate-pulse'
                              }`}>{iz.statusPersetujuan}</span>
                            </td>
                            <td className="p-3 text-center">
                              {iz.statusPersetujuan === 'Pending' ? (
                                <div className="flex gap-1 justify-center">
                                  <button
                                    id={`btn-approve-izin-${iz.id}`}
                                    onClick={() => actions.approveIzin(iz.id, 'Disetujui')}
                                    className="bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-bold uppercase transition-all shadow"
                                  >
                                    Terima ✓
                                  </button>
                                  <button
                                    id={`btn-reject-izin-${iz.id}`}
                                    onClick={() => actions.approveIzin(iz.id, 'Ditolak')}
                                    className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase transition-all shadow"
                                  >
                                    Tolak ✗
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-[10px]">Telah Diproses</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {akadSubTab === 'pelanggaran' && (
              <div className="space-y-6">
                
                {/* Form to Input Violations */}
                {editingId !== null && (
                  <div className="bg-amber-50 p-6 rounded-xl border-2 border-amber-500 shadow-sm text-xs">
                    <h3 className="font-bold text-emerald-950 mb-3">Catat Pelanggaran Kedisiplinan Siswa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold mb-1">Nama Siswa</label>
                        <select 
                          className="w-full p-2 border rounded bg-white"
                          value={formData.siswaId || ''} onChange={e => setFormData({...formData, siswaId: e.target.value})}
                        >
                          <option value="">Pilih Siswa</option>
                          {state.siswas.map(s => (
                            <option key={s.id} value={s.id}>{s.nama} ({getClassName(s.kelasId)})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Jenis Pelanggaran</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="Contoh: Merokok, Terlambat..."
                          value={formData.jenisPelanggaran || ''} onChange={e => setFormData({...formData, jenisPelanggaran: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Bobot Poin Pelanggaran</label>
                        <input 
                          type="number" className="w-full p-2 border rounded bg-white" placeholder="Poin: 5, 10, 25..."
                          value={formData.poin || 5} onChange={e => setFormData({...formData, poin: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Tanggal</label>
                        <input 
                          type="date" className="w-full p-2 border rounded bg-white"
                          value={formData.tanggal || ''} onChange={e => setFormData({...formData, tanggal: e.target.value})}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-bold mb-1">Catatan Tambahan</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white" placeholder="Ketik keterangan kejadian..."
                          value={formData.catatan || ''} onChange={e => setFormData({...formData, catatan: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-amber-200">
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded font-bold">Batal</button>
                      <button onClick={() => handleSave('pelanggaran')} className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded font-bold">Simpan Catatan</button>
                    </div>
                  </div>
                )}

                {/* Violations List Table */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-emerald-950 uppercase text-xs">Arsip Pelanggaran Siswa (Disiplin)</h3>
                    {editingId === null && (
                      <button 
                        onClick={() => startCreate({ poin: 10, tanggal: new Date().toISOString().slice(0, 10) })}
                        className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded font-bold flex items-center gap-1 shadow"
                      >
                        <Plus className="h-4 w-4" /> Catat Kasus Baru
                      </button>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                          <th className="p-3">Siswa</th>
                          <th className="p-3">Kelas</th>
                          <th className="p-3">Jenis Pelanggaran</th>
                          <th className="p-3 text-center">Poin Sanksi</th>
                          <th className="p-3">Tanggal Kejadian</th>
                          <th className="p-3">Keterangan Catatan</th>
                          <th className="p-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {state.pelanggarans.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="p-3 font-bold text-emerald-950">{getStudentName(p.siswaId)}</td>
                            <td className="p-3 font-semibold text-gray-600">
                              {getClassName(state.siswas.find(s => s.id === p.siswaId)?.kelasId || '')}
                            </td>
                            <td className="p-3 font-semibold text-amber-800 flex items-center gap-1">
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 inline shrink-0" />
                              {p.jenisPelanggaran}
                            </td>
                            <td className="p-3 text-center">
                              <span className="bg-red-100 text-red-800 font-black font-mono px-2.5 py-0.5 rounded-full text-[11px] ring-1 ring-red-500">
                                {p.poin} Poin
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold text-gray-700">{p.tanggal}</td>
                            <td className="p-3 text-gray-500">{p.catatan || '-'}</td>
                            <td className="p-3 text-center">
                              <div className="flex gap-1 justify-center">
                                <button onClick={() => startEdit(p.id, p)} className="p-1 hover:bg-amber-100 rounded text-amber-700"><Edit className="h-3.5 w-3.5" /></button>
                                <button onClick={() => actions.deletePelanggaran(p.id)} className="p-1 hover:bg-red-100 rounded text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {akadSubTab === 'pengumuman' && (
              <div className="space-y-6">
                
                {/* Form to Create/Edit Announcement */}
                {editingId !== null && (
                  <div className="bg-amber-50 p-6 rounded-xl border-2 border-amber-500 shadow-sm text-xs">
                    <h3 className="font-bold text-emerald-950 mb-3">Tulis Pengumuman Baru Sekolah</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block font-bold mb-1">Judul Pengumuman</label>
                        <input 
                          type="text" className="w-full p-2 border rounded bg-white text-xs font-bold text-emerald-950" placeholder="Ketik judul utama..."
                          value={formData.judul || ''} onChange={e => setFormData({...formData, judul: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">Target Audiens</label>
                        <select 
                          className="w-full p-2 border rounded bg-white text-xs"
                          value={formData.target || 'Semua'} onChange={e => setFormData({...formData, target: e.target.value as any})}
                        >
                          <option value="Semua">Semua (Siswa, Wali, Guru)</option>
                          <option value="Guru">Staf & Guru</option>
                          <option value="Kelas">Siswa Kelas Tertentu</option>
                        </select>
                      </div>

                      {formData.target === 'Kelas' && (
                        <div>
                          <label className="block font-bold mb-1">Target Kelas</label>
                          <select 
                            className="w-full p-2 border rounded bg-white"
                            value={formData.kelasId || ''} onChange={e => setFormData({...formData, kelasId: e.target.value})}
                          >
                            <option value="">Pilih Kelas</option>
                            {state.kelas.map(c => (
                              <option key={c.id} value={c.id}>{c.nama}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block font-bold mb-1">Tanggal Rilis</label>
                        <input 
                          type="date" className="w-full p-2 border rounded bg-white"
                          value={formData.tanggal || ''} onChange={e => setFormData({...formData, tanggal: e.target.value})}
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block font-bold mb-1">Isi Pengumuman</label>
                        <textarea 
                          rows={4} className="w-full p-2 border rounded bg-white" placeholder="Tulis isi pengumuman secara formal..."
                          value={formData.isi || ''} onChange={e => setFormData({...formData, isi: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-amber-200">
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded font-bold">Batal</button>
                      <button onClick={() => handleSave('pengumuman')} className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded font-bold">Terbitkan</button>
                    </div>
                  </div>
                )}

                {/* Announcement list */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-black text-emerald-950 uppercase text-xs">Arsip Papan Pengumuman Madrasah</h3>
                    {editingId === null && (
                      <button 
                        onClick={() => startCreate({ target: 'Semua', tanggal: new Date().toISOString().slice(0, 10) })}
                        className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded font-bold flex items-center gap-1 shadow"
                      >
                        <Plus className="h-4 w-4" /> Tulis Pengumuman
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {state.pengumumans.map(ann => (
                      <div key={ann.id} className="p-4 border border-gray-200 rounded-lg hover:border-emerald-600 transition-colors relative bg-gray-50/50">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <div>
                            <span className="text-[9px] bg-emerald-800 text-amber-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              Target: {ann.target} {ann.target === 'Kelas' && getClassName(ann.kelasId || '')}
                            </span>
                            <h4 className="text-sm font-bold text-emerald-950 mt-1">{ann.judul}</h4>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">{ann.tanggal}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{ann.isi}</p>
                        
                        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-dashed border-gray-200">
                          <span className="text-[10px] text-gray-400">ID Pengumuman: {ann.id}</span>
                          <div className="flex gap-2">
                            <button onClick={() => startEdit(ann.id, ann)} className="text-xs text-amber-700 hover:underline flex items-center gap-0.5"><Edit className="h-3 w-3" /> Edit</button>
                            <button onClick={() => actions.deletePengumuman(ann.id)} className="text-xs text-red-600 hover:underline flex items-center gap-0.5"><Trash2 className="h-3 w-3" /> Hapus</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: LAPORAN & EKSPOR */}
        {/* ========================================================= */}
        {activeTab === 'laporan' && (
          <div className="space-y-6">
            
            {/* Laporan Sub tabs */}
            <div className="flex flex-wrap gap-1 bg-white p-1.5 border border-gray-200 rounded-lg">
              {(['absensi-g', 'absensi-s', 'nilai', 'izin', 'pelanggaran'] as const).map(sub => (
                <button
                  key={sub}
                  id={`btn-lapor-sub-${sub}`}
                  onClick={() => { setLaporSubTab(sub); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                    laporSubTab === sub 
                      ? 'bg-amber-500 text-emerald-950 shadow-sm font-black' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {sub === 'absensi-g' ? 'Absensi Guru' : sub === 'absensi-s' ? 'Absensi Siswa' : sub}
                </button>
              ))}
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 text-xs text-amber-900 flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold">Eksportasi Laporan Resmi Sekolah:</span>
                  <p className="text-[10px] text-amber-800">Cetak laporan langsung atau ekspor ke berkas Excel/PDF yang siap saji untuk rapat evaluasi.</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => { alert('Mengekspor laporan ke format Microsoft Excel (.xlsx)... Berhasil diunduh secara simulasi!'); }} className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3 py-2 rounded text-[11px] uppercase transition-colors shadow">
                  Ekspor Excel
                </button>
                <button onClick={() => { window.print(); }} className="bg-red-700 hover:bg-red-600 text-white font-bold px-3 py-2 rounded text-[11px] uppercase transition-colors shadow">
                  Cetak PDF
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
              
              {laporSubTab === 'absensi-g' && (
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm mb-4">Laporan Kehadiran Mengajar Guru</h3>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                        <th className="p-3">Nama Guru</th>
                        <th className="p-3">Total Hadir</th>
                        <th className="p-3">Total Terlambat</th>
                        <th className="p-3">Total Izin/Sakit</th>
                        <th className="p-3">Persentase Disiplin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {state.gurus.map(g => {
                        const totalRecords = state.absensiGurus.filter(a => a.guruId === g.id);
                        const hadir = totalRecords.filter(a => a.status === 'Hadir').length;
                        const terlambat = totalRecords.filter(a => a.status === 'Terlambat').length;
                        const absen = totalRecords.filter(a => a.status !== 'Hadir' && a.status !== 'Terlambat').length;
                        const percent = totalRecords.length > 0 ? Math.round(((hadir + terlambat) / totalRecords.length) * 100) : 100;
                        return (
                          <tr key={g.id} className="hover:bg-gray-50">
                            <td className="p-3 font-bold text-emerald-950">{g.nama}</td>
                            <td className="p-3 text-emerald-700 font-bold">{hadir} kali</td>
                            <td className="p-3 text-amber-600 font-bold">{terlambat} kali</td>
                            <td className="p-3 text-red-600 font-bold">{absen} kali</td>
                            <td className="p-3 font-mono font-black text-emerald-800">{percent}% disiplin</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {laporSubTab === 'absensi-s' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-emerald-950 text-sm">Laporan Kehadiran Harian Siswa</h3>
                    <select
                      className="text-xs font-bold p-1.5 border rounded bg-white"
                      value={filterKelas}
                      onChange={e => setFilterKelas(e.target.value)}
                    >
                      <option value="semua">Semua Kelas</option>
                      {state.kelas.map(c => (
                        <option key={c.id} value={c.id}>{c.nama}</option>
                      ))}
                    </select>
                  </div>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                        <th className="p-3">Siswa</th>
                        <th className="p-3">Kelas</th>
                        <th className="p-3">Total Hadir</th>
                        <th className="p-3">Total Sakit</th>
                        <th className="p-3">Total Izin</th>
                        <th className="p-3">Total Alpa</th>
                        <th className="p-3">Rasio Kehadiran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {state.siswas
                        .filter(s => filterKelas === 'semua' ? true : s.kelasId === filterKelas)
                        .map(s => {
                          const records = state.absensiSiswas.filter(a => a.siswaId === s.id);
                          const hadir = records.filter(a => a.status === 'Hadir').length;
                          const sakit = records.filter(a => a.status === 'Sakit').length;
                          const izin = records.filter(a => a.status === 'Izin').length;
                          const alpa = records.filter(a => a.status === 'Alpa').length;
                          const percent = records.length > 0 ? Math.round((hadir / records.length) * 100) : 100;
                          return (
                            <tr key={s.id} className="hover:bg-gray-50">
                              <td className="p-3 font-bold text-emerald-950">{s.nama}</td>
                              <td className="p-3 font-semibold text-gray-600">{getClassName(s.kelasId)}</td>
                              <td className="p-3 text-emerald-700 font-bold">{hadir} kali</td>
                              <td className="p-3 text-amber-600 font-bold">{sakit} kali</td>
                              <td className="p-3 text-blue-600 font-bold">{izin} kali</td>
                              <td className="p-3 text-red-600 font-bold">{alpa} kali</td>
                              <td className="p-3 font-mono font-black text-emerald-800">{percent}%</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}

              {laporSubTab === 'nilai' && (
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm mb-4">Laporan Rerata Nilai per Siswa</h3>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                        <th className="p-3">Nama Siswa</th>
                        <th className="p-3">Kelas</th>
                        <th className="p-3 text-center">Jumlah Nilai Terinput</th>
                        <th className="p-3 text-center">Rerata Nilai Akhir</th>
                        <th className="p-3 text-center">Predikat Rerata</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {state.siswas.map(s => {
                        const scores = state.nilais.filter(n => n.siswaId === s.id);
                        const avgScore = scores.length > 0 
                          ? Math.round((scores.reduce((acc, curr) => acc + curr.nilaiAkhir, 0) / scores.length) * 10) / 10 
                          : 0;
                        const pred = avgScore >= 85 ? 'A' : avgScore >= 75 ? 'B' : avgScore >= 60 ? 'C' : 'D';
                        return (
                          <tr key={s.id} className="hover:bg-gray-50">
                            <td className="p-3 font-bold text-emerald-950">{s.nama}</td>
                            <td className="p-3 font-semibold text-gray-600">{getClassName(s.kelasId)}</td>
                            <td className="p-3 text-center text-gray-500 font-bold">{scores.length} Mapel</td>
                            <td className="p-3 text-center font-mono font-black text-emerald-800 text-sm">{avgScore || '-'}</td>
                            <td className="p-3 text-center font-bold">
                              {scores.length > 0 ? (
                                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black">{pred}</span>
                              ) : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {laporSubTab === 'izin' && (
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm mb-4">Rekapitulasi Izin yang Disetujui</h3>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                        <th className="p-3">Tipe</th>
                        <th className="p-3">Nama Lengkap</th>
                        <th className="p-3">Tanggal Izin</th>
                        <th className="p-3">Alasan</th>
                        <th className="p-3 text-center">Persetujuan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {state.izins.map(i => {
                        const targetName = i.tipe === 'Guru' 
                          ? state.gurus.find(g => g.id === i.targetId)?.nama 
                          : state.siswas.find(s => s.id === i.targetId)?.nama;
                        return (
                          <tr key={i.id} className="hover:bg-gray-50">
                            <td className="p-3 font-mono text-gray-500">{i.tipe.toUpperCase()}</td>
                            <td className="p-3 font-bold text-emerald-950">{targetName}</td>
                            <td className="p-3 font-mono">{i.tanggal}</td>
                            <td className="p-3 text-gray-600">{i.alasan}</td>
                            <td className="p-3 text-center">
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                {i.statusPersetujuan}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {laporSubTab === 'pelanggaran' && (
                <div>
                  <h3 className="font-bold text-emerald-950 text-sm mb-4">Akumulasi Poin Pelanggaran Kedisiplinan</h3>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                        <th className="p-3">Nama Siswa</th>
                        <th className="p-3">Kelas</th>
                        <th className="p-3 text-center">Total Kasus Tercatat</th>
                        <th className="p-3 text-center">Akumulasi Poin</th>
                        <th className="p-3">Status Konseling</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-sans">
                      {state.siswas.map(s => {
                        const cases = state.pelanggarans.filter(p => p.siswaId === s.id);
                        const totalPoin = cases.reduce((acc, curr) => acc + curr.poin, 0);
                        return (
                          <tr key={s.id} className="hover:bg-gray-50">
                            <td className="p-3 font-bold text-emerald-950">{s.nama}</td>
                            <td className="p-3 font-semibold text-gray-600">{getClassName(s.kelasId)}</td>
                            <td className="p-3 text-center font-bold text-gray-500">{cases.length} Kasus</td>
                            <td className="p-3 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full font-mono font-black ${
                                totalPoin > 20 ? 'bg-red-100 text-red-800 ring-1 ring-red-500' :
                                totalPoin > 0 ? 'bg-amber-100 text-amber-800' :
                                'bg-gray-100 text-gray-400'
                              }`}>{totalPoin} Poin</span>
                            </td>
                            <td className="p-3 font-semibold">
                              {totalPoin > 30 ? (
                                <span className="text-red-700 animate-pulse font-black">Panggil Orang Tua (Surat SP-1)</span>
                              ) : totalPoin > 10 ? (
                                <span className="text-amber-700">Teguran Wali Kelas & BK</span>
                              ) : (
                                <span className="text-emerald-700">Disiplin Sangat Baik</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: SYSTEM & DATABASE TOOLS */}
        {/* ========================================================= */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Database Backup Section */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                <h3 className="text-base font-black text-emerald-950 uppercase mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5 text-emerald-800" />
                  Cadangkan & Ekspor Database (Backup)
                </h3>
                <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                  Semua transaksi absensi, nilai, riwayat pelajaran, dan data log aktivitas disimpan secara lokal di dalam browser Anda. Anda dapat mengekspor seluruh status sistem ini menjadi satu file cadangan berformat JSON untuk diarsipkan di drive komputer Anda.
                </p>
                <button
                  id="btn-backup-db-action"
                  onClick={actions.backupDatabase}
                  className="bg-emerald-800 hover:bg-emerald-700 text-amber-400 font-bold px-4 py-2.5 rounded-lg text-xs uppercase flex items-center gap-2 transition-all shadow"
                >
                  <Download className="h-4 w-4" />
                  Unduh File Cadangan (.json)
                </button>
              </div>

              {/* Database Restore Section */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
                <h3 className="text-base font-black text-emerald-950 uppercase mb-3 flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-amber-500" />
                  Pulihkan Database (Restore)
                </h3>
                <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                  Unggah file cadangan JSON yang telah diekspor sebelumnya untuk menimpa kondisi database saat ini. Fitur ini sangat berguna untuk sinkronisasi data demo atau pemulihan setelah pembersihan cache.
                </p>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".json" 
                  className="hidden" 
                />
                
                <button
                  id="btn-restore-db-action"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black px-4 py-2.5 rounded-lg text-xs uppercase flex items-center gap-2 transition-all shadow"
                >
                  <Upload className="h-4 w-4" />
                  Pilih & Unggah File Cadangan (.json)
                </button>
              </div>

            </div>

            {/* Complete Log table */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
              <h3 className="text-sm font-black text-emerald-950 uppercase mb-4 flex items-center gap-1.5">
                <Clock className="h-4.5 w-4.5 text-emerald-700" />
                Arsip Lengkap Log Aktivitas SIPMT
              </h3>
              <div className="overflow-y-auto max-h-[360px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                      <th className="p-3">Waktu Transaksi</th>
                      <th className="p-3">Pengguna Pengoperasi</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Deskripsi Rincian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                    {state.logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="p-3 text-gray-500">{log.waktu}</td>
                        <td className="p-3">
                          <span className="font-bold text-emerald-950">{log.pengguna}</span>
                          <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.2 rounded ml-1.5 uppercase">{log.role}</span>
                        </td>
                        <td className="p-3 font-bold text-amber-700">{log.aktivitas}</td>
                        <td className="p-3 text-gray-600">{log.rincian}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
