/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store';
import { AbsensiSiswa, Nilai, Izin, Pelanggaran } from '../types';
import { 
  Calendar, CheckSquare, Users, Award, AlertTriangle, 
  Bell, User, Edit, Save, Plus, FileText, CheckCircle2, 
  Clock, CheckCheck, Smartphone, Info
} from 'lucide-react';

export const DashboardGuru: React.FC = () => {
  const { state, ...actions } = useApp();
  
  // Resolve active teacher
  const activeTeacherId = state.currentUser.targetId || 'guru-ridho';
  const teacherObj = state.gurus.find(g => g.id === activeTeacherId) || state.gurus[0];

  // Active view tab
  const [activeTab, setActiveTab] = useState<'jadwal' | 'absensi' | 'nilai' | 'pelanggaran' | 'izin' | 'pengumuman' | 'profil'>('jadwal');

  // Attendance states
  const [selectedKelasId, setSelectedKelasId] = useState<string>(state.kelas[0]?.id || '');
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().slice(0, 10));

  // Grades input states
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedMapelId, setSelectedMapelId] = useState<string>('');
  const [gradeTugas, setGradeTugas] = useState<number>(80);
  const [gradeUH, setGradeUH] = useState<number>(80);
  const [gradeUTS, setGradeUTS] = useState<number>(80);
  const [gradeUAS, setGradeUAS] = useState<number>(80);

  // Disciplinary logging states
  const [violationSiswaId, setViolationSiswaId] = useState<string>('');
  const [violationType, setViolationType] = useState<string>('Terlambat Masuk Kelas');
  const [violationPoin, setViolationPoin] = useState<number>(5);
  const [violationCatatan, setViolationCatatan] = useState<string>('');

  // Permit state for the teacher themselves
  const [permitDate, setPermitDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [permitReason, setPermitReason] = useState<string>('');
  const [permitAttachment, setPermitAttachment] = useState<string>('surat_dokter.jpg');

  // Teacher Profile state
  const [profilePhone, setProfilePhone] = useState<string>(teacherObj?.telepon || '08...');
  const [profileEmail, setProfileEmail] = useState<string>(teacherObj?.email || '...');

  // Helper getters
  const getClassName = (id: string) => state.kelas.find(c => c.id === id)?.nama || 'N/A';
  const getMapelName = (id: string) => state.mapels.find(m => m.id === id)?.nama || 'N/A';
  const getStudentName = (id: string) => state.siswas.find(s => s.id === id)?.nama || 'N/A';

  // Filter schedules taught by this teacher
  const teacherSchedules = state.jadwals.filter(j => j.guruId === activeTeacherId);

  // Filter students in the selected class
  const classStudents = state.siswas.filter(s => s.kelasId === selectedKelasId);

  const handlePostGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !selectedMapelId) {
      alert('Pilih siswa dan mata pelajaran terlebih dahulu.');
      return;
    }
    
    const activeSemId = state.semesters.find(s => s.status === 'Aktif')?.id || state.semesters[0]?.id || '';
    const stud = state.siswas.find(s => s.id === selectedStudentId);

    actions.addNilai({
      siswaId: selectedStudentId,
      kelasId: stud?.kelasId || '',
      mapelId: selectedMapelId,
      semesterId: activeSemId,
      tugas: gradeTugas,
      uh: gradeUH,
      uts: gradeUTS,
      uas: gradeUAS
    });

    alert(`Berhasil menginput nilai untuk ${getStudentName(selectedStudentId)}`);
    setSelectedStudentId('');
    setSelectedMapelId('');
  };

  const handlePostViolation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!violationSiswaId || !violationType) {
      alert('Pilih siswa dan jenis pelanggaran.');
      return;
    }

    actions.addPelanggaran({
      siswaId: violationSiswaId,
      jenisPelanggaran: violationType,
      poin: violationPoin,
      tanggal: new Date().toISOString().slice(0, 10),
      catatan: violationCatatan
    });

    alert(`Pelanggaran siswa ${getStudentName(violationSiswaId)} berhasil dicatat.`);
    setViolationSiswaId('');
    setViolationCatatan('');
  };

  const handlePostPermit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permitReason) {
      alert('Tulis alasan izin pengajuan.');
      return;
    }

    actions.addIzin({
      tipe: 'Guru',
      targetId: activeTeacherId,
      tanggal: permitDate,
      alasan: permitReason,
      lampiran: permitAttachment
    });

    alert('Surat izin pengajuan berhasil dikirim ke Administrator.');
    setPermitReason('');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    actions.updateGuru(activeTeacherId, {
      telepon: profilePhone,
      email: profileEmail
    });
    alert('Profil Anda berhasil diperbarui!');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-800">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-emerald-800 text-white shrink-0 shadow-lg flex flex-col">
        
        {/* Guru Header */}
        <div className="p-5 border-b border-emerald-700 bg-emerald-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-emerald-950 flex items-center justify-center font-black text-sm uppercase">
            {teacherObj?.nama?.charAt(0)}
          </div>
          <div>
            <h2 className="text-sm font-bold truncate leading-tight">{teacherObj?.nama}</h2>
            <p className="text-[10px] text-emerald-200">Role: Guru Staf Pengajar</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-3 space-y-1">
          <button
            id="nav-guru-jadwal"
            onClick={() => setActiveTab('jadwal')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'jadwal' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>JADWAL MENGAJAR</span>
          </button>

          <button
            id="nav-guru-absensi"
            onClick={() => setActiveTab('absensi')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'absensi' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            <span>ABSENSI SISWA</span>
          </button>

          <button
            id="nav-guru-nilai"
            onClick={() => setActiveTab('nilai')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'nilai' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>INPUT NILAI AKADEMIK</span>
          </button>

          <button
            id="nav-guru-pelanggaran"
            onClick={() => setActiveTab('pelanggaran')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'pelanggaran' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>LAPORKAN PELANGGARAN</span>
          </button>

          <button
            id="nav-guru-izin"
            onClick={() => setActiveTab('izin')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'izin' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>PENGAJUAN IZIN DINAS</span>
          </button>

          <button
            id="nav-guru-pengumuman"
            onClick={() => setActiveTab('pengumuman')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'pengumuman' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>PENGUMUMAN SEKOLAH</span>
          </button>

          <button
            id="nav-guru-profil"
            onClick={() => setActiveTab('profil')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'profil' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <User className="h-4 w-4" />
            <span>PENGATURAN PROFIL</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-emerald-900 border-t border-emerald-700 text-[11px] text-emerald-200">
          <div>Madrasah Tsanawiyah</div>
          <div className="font-bold text-white">Agama Islam Mertapada</div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Workspace Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 mb-6 gap-3">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Workspace Akademik</span>
            <h1 className="text-2xl font-black text-emerald-950 uppercase tracking-tight">
              {activeTab === 'jadwal' && 'Jadwal Mengajar Anda'}
              {activeTab === 'absensi' && 'Input Presensi Siswa'}
              {activeTab === 'nilai' && 'Penilaian Akademik Siswa'}
              {activeTab === 'pelanggaran' && 'Lapor Pelanggaran Kedisiplinan'}
              {activeTab === 'izin' && 'Pengajuan Cuti / Izin Dinas'}
              {activeTab === 'pengumuman' && 'Mading Pengumuman Madrasah'}
              {activeTab === 'profil' && 'Kelola Biodata Guru'}
            </h1>
          </div>
          <div className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-900 text-xs font-bold font-mono">
            {teacherObj?.mapelUtama}
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: TEACH SCHEDULE */}
        {/* ========================================================= */}
        {activeTab === 'jadwal' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {teacherSchedules.length === 0 ? (
                <div className="col-span-3 bg-white p-8 text-center text-gray-500 border rounded-xl">
                  Tidak ada jadwal mengajar tetap yang terdaftar untuk Anda pada semester ini.
                </div>
              ) : (
                teacherSchedules.map(sch => (
                  <div key={sch.id} className="bg-white p-5 rounded-xl border-l-4 border-emerald-700 border-y border-r border-gray-200 shadow-xs hover:shadow transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {sch.hari}
                      </span>
                      <span className="text-xs text-gray-400 font-mono font-bold flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {sch.jamMulai} - {sch.jamSelesai}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-emerald-950">{getMapelName(sch.mapelId)}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Kelas: <strong className="text-emerald-900 text-sm">{getClassName(sch.kelasId)}</strong>
                    </p>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                      <span>KBM Madrasah Mertapada</span>
                      <button 
                        onClick={() => { setSelectedKelasId(sch.kelasId); setActiveTab('absensi'); }} 
                        className="text-emerald-700 hover:underline font-bold"
                      >
                        Lakukan Presensi &rarr;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Quick school facts helper */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block mb-0.5">Tata Tertib KBM MTs Agama Islam Mertapada:</strong>
                <p className="leading-relaxed">
                  Guru diwajibkan memasuki kelas tepat waktu (toleransi keterlambatan maksimal 10 menit). Seluruh kehadiran KBM siswa harus diisi secara real-time demi meminimalisir kejadian kelas kosong.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ATTENDANCE INPUT */}
        {/* ========================================================= */}
        {activeTab === 'absensi' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Class & Date Filter */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto">
                <div className="text-xs font-bold text-gray-500 uppercase shrink-0">Pilih Kelas:</div>
                <div className="flex gap-1">
                  {state.kelas.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedKelasId(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                        selectedKelasId === c.id 
                          ? 'bg-emerald-800 text-white shadow' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {c.nama}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 items-center w-full sm:w-auto shrink-0 text-xs">
                <span className="font-bold text-gray-500 uppercase">Tanggal:</span>
                <input 
                  type="date" 
                  value={attendanceDate} 
                  onChange={e => setAttendanceDate(e.target.value)} 
                  className="p-1.5 border rounded bg-white text-xs font-bold font-mono" 
                />
              </div>
            </div>

            {/* Attendance checklist */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h3 className="font-black text-emerald-950 uppercase text-xs">
                  Daftar Absensi Siswa Kelas {getClassName(selectedKelasId)} ({classStudents.length} Siswa)
                </h3>
                <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded uppercase">
                  Automatic WhatsApp Active
                </span>
              </div>

              {classStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Tidak ada siswa terdaftar di dalam kelas ini.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase">
                        <th className="py-2.5">Siswa</th>
                        <th className="py-2.5">Status Kehadiran</th>
                        <th className="py-2.5">Catatan Khusus / Alasan</th>
                        <th className="py-2.5 text-center">Notifikasi Orang Tua</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {classStudents.map(s => {
                        const att = state.absensiSiswas.find(a => a.siswaId === s.id && a.tanggal === attendanceDate);
                        const activeStatus = att?.status || 'Belum Absen';
                        return (
                          <tr key={s.id} className="hover:bg-gray-50">
                            <td className="py-3">
                              <div className="font-bold text-emerald-950">{s.nama}</div>
                              <div className="text-[10px] text-gray-500 font-mono">NIS: {s.nis} | Wali: {s.namaOrangTua}</div>
                            </td>
                            <td className="py-3">
                              <div className="flex gap-1">
                                {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as const).map(st => (
                                  <button
                                    key={st}
                                    id={`btn-guru-attend-${s.id}-${st}`}
                                    onClick={() => actions.upsertAbsensiSiswa(s.id, selectedKelasId, attendanceDate, st, att?.catatan || 'Absen oleh Guru')}
                                    className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                                      activeStatus === st 
                                        ? 'bg-emerald-700 text-white scale-105' 
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
                                placeholder="Izin bepergian / demam / dll..."
                                value={att?.catatan || ''}
                                onChange={(e) => actions.upsertAbsensiSiswa(s.id, selectedKelasId, attendanceDate, activeStatus as any, e.target.value)}
                                className="border border-gray-200 bg-white p-1 rounded w-full text-xs"
                              />
                            </td>
                            <td className="py-3 text-center">
                              {att?.waSentStatus ? (
                                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ring-1 ring-emerald-500 animate-pulse flex items-center justify-center gap-1 max-w-[100px] mx-auto">
                                  <Smartphone className="h-3 w-3" /> Sent WA ✓
                                </span>
                              ) : (
                                <span className="text-gray-400 text-[10px]">-</span>
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
        {/* TAB 3: GRADING */}
        {/* ========================================================= */}
        {activeTab === 'nilai' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Grade Input Form */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs h-fit">
                <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">Input Buku Nilai Baru</h3>
                <form onSubmit={handlePostGrade} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1 text-gray-600">Pilih Siswa</label>
                    <select
                      className="w-full p-2 border rounded bg-white"
                      value={selectedStudentId}
                      onChange={e => setSelectedStudentId(e.target.value)}
                      required
                    >
                      <option value="">-- Pilih Siswa --</option>
                      {state.siswas.map(s => (
                        <option key={s.id} value={s.id}>{s.nama} ({getClassName(s.kelasId)})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-gray-600">Mata Pelajaran</label>
                    <select
                      className="w-full p-2 border rounded bg-white"
                      value={selectedMapelId}
                      onChange={e => setSelectedMapelId(e.target.value)}
                      required
                    >
                      <option value="">-- Pilih Mata Pelajaran --</option>
                      {state.mapels.map(m => (
                        <option key={m.id} value={m.id}>{m.nama}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold mb-1 text-gray-600">Skor Tugas</label>
                      <input type="number" min={0} max={100} className="w-full p-2 border rounded text-center font-mono font-bold bg-white" value={gradeTugas} onChange={e => setGradeTugas(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-gray-600">Skor UH</label>
                      <input type="number" min={0} max={100} className="w-full p-2 border rounded text-center font-mono font-bold bg-white" value={gradeUH} onChange={e => setGradeUH(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-gray-600">Skor UTS</label>
                      <input type="number" min={0} max={100} className="w-full p-2 border rounded text-center font-mono font-bold bg-white" value={gradeUTS} onChange={e => setGradeUTS(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-gray-600">Skor UAS</label>
                      <input type="number" min={0} max={100} className="w-full p-2 border rounded text-center font-mono font-bold bg-white" value={gradeUAS} onChange={e => setGradeUAS(Number(e.target.value))} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg text-xs uppercase flex items-center justify-center gap-1.5 transition-colors shadow"
                  >
                    <Plus className="h-4 w-4" /> Simpan Nilai Siswa
                  </button>
                </form>
              </div>

              {/* Right Column: Grades Archive list */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs md:col-span-2">
                <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">Arsip Penilaian yang Anda Input</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                        <th className="p-3">Siswa</th>
                        <th className="p-3">Mapel</th>
                        <th className="p-3 text-center">Tgs</th>
                        <th className="p-3 text-center">UH</th>
                        <th className="p-3 text-center">UTS</th>
                        <th className="p-3 text-center">UAS</th>
                        <th className="p-3 text-center">Akhir</th>
                        <th className="p-3 text-center">Pred</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {state.nilais.map(n => (
                        <tr key={n.id} className="hover:bg-gray-50">
                          <td className="p-3 font-bold text-emerald-950">
                            <div>{getStudentName(n.siswaId)}</div>
                            <div className="text-[9px] text-gray-400 font-mono">Kelas: {getClassName(n.kelasId)}</div>
                          </td>
                          <td className="p-3 font-semibold text-gray-700">{getMapelName(n.mapelId)}</td>
                          <td className="p-3 text-center font-mono">{n.tugas}</td>
                          <td className="p-3 text-center font-mono">{n.uh}</td>
                          <td className="p-3 text-center font-mono">{n.uts}</td>
                          <td className="p-3 text-center font-mono">{n.uas}</td>
                          <td className="p-3 text-center font-mono font-black text-emerald-800 text-sm">{n.nilaiAkhir}</td>
                          <td className="p-3 text-center">
                            <span className="bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded text-[10px]">
                              {n.predikat}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: DISCIPLINE VIOLATIONS */}
        {/* ========================================================= */}
        {activeTab === 'pelanggaran' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Report form */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs h-fit">
                <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">Laporkan Pelanggaran</h3>
                <form onSubmit={handlePostViolation} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1 text-gray-600">Pilih Siswa Terkait</label>
                    <select
                      className="w-full p-2 border rounded bg-white text-xs"
                      value={violationSiswaId}
                      onChange={e => setViolationSiswaId(e.target.value)}
                      required
                    >
                      <option value="">-- Pilih Siswa --</option>
                      {state.siswas.map(s => (
                        <option key={s.id} value={s.id}>{s.nama} ({getClassName(s.kelasId)})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-gray-600">Jenis Pelanggaran</label>
                    <select
                      className="w-full p-2 border rounded bg-white text-xs"
                      value={violationType}
                      onChange={e => setViolationType(e.target.value)}
                    >
                      <option value="Terlambat Masuk Kelas">Terlambat Masuk Kelas (5 Poin)</option>
                      <option value="Tidak Membawa Atribut Kopiah">Tidak Membawa Atribut Kopiah (10 Poin)</option>
                      <option value="Membuat Keributan KBM">Membuat Keributan Saat KBM (15 Poin)</option>
                      <option value="Kabur Melompati Pagar Madrasah">Kabur Melompati Pagar Madrasah (30 Poin)</option>
                      <option value="Berkelahi / Tawuran">Berkelahi / Tawuran (50 Poin)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-gray-600">Poin Pelanggaran (Sanksi)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded bg-white text-xs font-mono font-bold"
                      value={violationPoin}
                      onChange={e => setViolationPoin(Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-gray-600">Catatan Kejadian Tambahan</label>
                    <textarea
                      rows={3}
                      placeholder="Kronologi kejadian singkat..."
                      className="w-full p-2 border rounded bg-white text-xs"
                      value={violationCatatan}
                      onChange={e => setViolationCatatan(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-700 hover:bg-red-600 text-white font-bold p-2.5 rounded-lg text-xs uppercase flex items-center justify-center gap-1.5 transition-colors shadow"
                  >
                    <AlertTriangle className="h-4 w-4 text-yellow-300" /> Laporkan Kasus
                  </button>
                </form>
              </div>

              {/* Violations log */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs md:col-span-2">
                <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">Kasus Pelanggaran yang Dilaporkan</h3>
                <div className="space-y-3">
                  {state.pelanggarans.map(pel => (
                    <div key={pel.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-start">
                      <div>
                        <div className="text-xs font-bold text-emerald-950">{getStudentName(pel.siswaId)}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Tanggal: {pel.tanggal}</div>
                        <div className="text-xs text-red-800 font-bold mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" /> {pel.jenisPelanggaran}
                        </div>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed italic">"{pel.catatan || 'Tidak ada catatan kronologi.'}"</p>
                      </div>
                      <span className="bg-red-100 text-red-800 text-[10px] font-black font-mono px-2.5 py-1 rounded-full border border-red-300">
                        -{pel.poin} Poin
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: LEAVE SUBMISSION */}
        {/* ========================================================= */}
        {activeTab === 'izin' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Form */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs h-fit">
                <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">Ajukan Surat Izin / Cuti</h3>
                <form onSubmit={handlePostPermit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1 text-gray-600">Tanggal Pengajuan</label>
                    <input type="date" className="w-full p-2 border rounded bg-white text-xs font-mono font-bold" value={permitDate} onChange={e => setPermitDate(e.target.value)} />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-gray-600">Alasan Tidak Mengajar</label>
                    <textarea rows={4} placeholder="Contoh: Sakit, Kepentingan keluarga mendesak..." className="w-full p-2 border rounded bg-white text-xs" value={permitReason} onChange={e => setPermitReason(e.target.value)} required />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-gray-600">Simulasi File Lampiran (Ketik Nama File)</label>
                    <input type="text" className="w-full p-2 border rounded bg-white text-xs" value={permitAttachment} onChange={e => setPermitAttachment(e.target.value)} />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg text-xs uppercase flex items-center justify-center gap-1.5 transition-colors shadow"
                  >
                    <Save className="h-4 w-4" /> Ajukan ke Kurikulum
                  </button>
                </form>
              </div>

              {/* Status checking */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs md:col-span-2">
                <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">Riwayat Pengajuan Izin Anda</h3>
                <div className="space-y-3.5">
                  {state.izins.filter(i => i.targetId === activeTeacherId).map(iz => (
                    <div key={iz.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <div className="text-xs font-mono font-bold text-gray-500">Izin Tanggal: {iz.tanggal}</div>
                        <p className="text-xs text-gray-700 font-semibold mt-1">Sebab: {iz.alasan}</p>
                        <div className="text-[10px] text-amber-700 font-bold mt-1.5 underline">File: {iz.lampiran}</div>
                      </div>
                      
                      <div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          iz.statusPersetujuan === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' :
                          iz.statusPersetujuan === 'Ditolak' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {iz.statusPersetujuan}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: ANNOUNCEMENTS */}
        {/* ========================================================= */}
        {activeTab === 'pengumuman' && (
          <div className="space-y-4 animate-fade-in">
            {state.pengumumans
              .filter(ann => ann.target === 'Semua' || ann.target === 'Guru')
              .map(ann => (
                <div key={ann.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-emerald-600 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] bg-emerald-800 text-amber-400 font-bold px-2 py-0.5 rounded uppercase">
                      Untuk: {ann.target}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{ann.tanggal}</span>
                  </div>
                  <h3 className="text-base font-black text-emerald-950 mb-2">{ann.judul}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{ann.isi}</p>
                </div>
              ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: PROFILE */}
        {/* ========================================================= */}
        {activeTab === 'profil' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs max-w-xl animate-fade-in">
            <h3 className="font-black text-emerald-950 uppercase text-xs mb-5">Biodata Kepegawaian Anda</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Nama Lengkap</label>
                  <input type="text" className="w-full p-2 border rounded bg-gray-100 text-gray-600 font-bold" value={teacherObj?.nama || ''} disabled />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">NIP Kepegawaian</label>
                  <input type="text" className="w-full p-2 border rounded bg-gray-100 text-gray-600 font-mono" value={teacherObj?.nip || ''} disabled />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Status Kepegawaian</label>
                  <input type="text" className="w-full p-2 border rounded bg-gray-100 text-gray-600" value={teacherObj?.statusKepegawaian || ''} disabled />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Mata Pelajaran Utama</label>
                  <input type="text" className="w-full p-2 border rounded bg-gray-100 text-gray-600" value={teacherObj?.mapelUtama || ''} disabled />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-emerald-900 mb-3 uppercase text-[10px]">Kontak yang Dapat Diedit</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold mb-1">No. HP / WhatsApp Pribadi</label>
                    <input type="text" className="w-full p-2 border rounded bg-white text-xs font-mono font-bold" value={profilePhone} onChange={e => setProfilePhone(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Email Sekolah Resmi</label>
                    <input type="email" className="w-full p-2 border rounded bg-white text-xs font-mono" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} required />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase flex items-center gap-1.5 transition-colors shadow"
                >
                  <Save className="h-4 w-4 text-amber-400" /> Perbarui Profil
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
