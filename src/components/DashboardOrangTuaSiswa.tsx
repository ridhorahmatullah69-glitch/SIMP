/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store';
import { 
  Users, CheckSquare, Award, AlertTriangle, Bell, 
  Smartphone, MessageSquare, Info, Send, Calendar, CheckCircle, Save, UserCheck, HelpCircle
} from 'lucide-react';

export const DashboardOrangTuaSiswa: React.FC = () => {
  const { state, ...actions } = useApp();
  const currentRole = state.currentUser.role; // 'Orang Tua' or 'Siswa'

  // Resolve target student: Muhammad Fadhil is our default testing student
  const activeStudentId = 'siswa-fadhil';
  const studentObj = state.siswas.find(s => s.id === activeStudentId) || state.siswas[0];
  const studentClass = state.kelas.find(c => c.id === studentObj?.kelasId) || state.kelas[0];
  const studentWaliKelas = state.gurus.find(g => g.id === studentClass?.waliKelasId);

  // Tab State
  const [activeTab, setActiveTab] = useState<'beranda' | 'nilai' | 'kehadiran' | 'izin' | 'disiplin' | 'pengumuman' | 'jadwal'>('beranda');

  // Submit Parent Permit Slips for Child
  const [permitDate, setPermitDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [permitReason, setPermitReason] = useState<string>('');
  const [permitAttachment, setPermitAttachment] = useState<string>('surat_dokter_anak.pdf');

  // WhatsApp template contact for Parent
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [chatTemplate, setChatTemplate] = useState('');

  if (!studentObj) {
    return (
      <div className="p-8 text-center bg-white border rounded-xl max-w-xl mx-auto my-12 shadow">
        <h2 className="text-xl font-bold text-red-600 mb-2">Data Tidak Ditemukan</h2>
        <p className="text-gray-600 text-sm">Akun Anda tidak terhubung dengan biodata siswa aktif MTs Mertapada.</p>
      </div>
    );
  }

  // Filter relevant academic files for this student
  const grades = state.nilais.filter(n => n.siswaId === studentObj.id);
  const attendanceList = state.absensiSiswas.filter(a => a.siswaId === studentObj.id);
  const violations = state.pelanggarans.filter(p => p.siswaId === studentObj.id);
  const permits = state.izins.filter(i => i.targetId === studentObj.id);

  // Filter schedules taught for this student's class
  const classSchedules = state.jadwals.filter(j => j.kelasId === studentObj.kelasId);

  // Summary Metrics
  const avgGrade = grades.length > 0 
    ? Math.round(grades.reduce((sum, curr) => sum + curr.nilaiAkhir, 0) / grades.length) 
    : 85;
  
  const presentCount = attendanceList.filter(a => a.status === 'Hadir').length;
  const attendanceRate = attendanceList.length > 0 
    ? Math.round((presentCount / attendanceList.length) * 100) 
    : 100;

  const totalViolationsPoin = violations.reduce((sum, curr) => sum + curr.poin, 0);

  const getMapelName = (id: string) => state.mapels.find(m => m.id === id)?.nama || 'N/A';
  const getTeacherName = (id: string) => state.gurus.find(g => g.id === id)?.nama || 'N/A';
  const getClassName = (id: string) => state.kelas.find(c => c.id === id)?.nama || 'N/A';

  const handlePostPermitByParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permitReason) {
      alert('Tulis alasan tidak masuk sekolah terlebih dahulu.');
      return;
    }

    actions.addIzin({
      tipe: 'Siswa',
      targetId: studentObj.id,
      tanggal: permitDate,
      alasan: permitReason,
      lampiran: permitAttachment
    });

    alert('Surat keterangan izin / sakit murid berhasil diajukan ke Wali Kelas!');
    setPermitReason('');
  };

  const openWaliKelasChat = () => {
    setChatTemplate(`Assalamu'alaikum Wr. Wb.

Yth. Bapak/Ibu ${studentWaliKelas?.nama} (Wali Kelas dari ${studentObj.nama} di Kelas ${studentClass?.nama}).

Saya selaku Orang Tua/Wali dari ${studentObj.nama} bermaksud untuk bersilaturahmi dan berkoordinasi mengenai aktivitas belajar anak kami di sekolah.

Semoga Bapak/Ibu Wali Kelas senantiasa dalam keadaan sehat wal 'afiat.

Hormat saya,
${studentObj.namaOrangTua}`);
    setContactModalOpen(true);
  };

  const handleSimulateChatSubmit = () => {
    alert(`Pesan WhatsApp Berhasil Dikirim (Simulasi) ke Wali Kelas: ${studentWaliKelas?.nama}!`);
    setContactModalOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-800 animate-fade-in">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-emerald-800 text-white shrink-0 shadow-lg flex flex-col">
        
        {/* Header Profile */}
        <div className="p-5 border-b border-emerald-700 bg-emerald-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-emerald-950 flex items-center justify-center font-black text-sm uppercase shrink-0 shadow">
            {studentObj.nama.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold truncate leading-tight">
              {currentRole === 'Orang Tua' ? `Wali: ${studentObj.namaOrangTua}` : studentObj.nama}
            </h2>
            <p className="text-[10px] text-emerald-200 truncate">
              {currentRole === 'Orang Tua' ? `Anak: ${studentObj.nama}` : `Siswa | Kelas ${studentClass?.nama}`}
            </p>
          </div>
        </div>

        {/* Menu items */}
        <div className="flex-1 p-3 space-y-1">
          <button
            id="nav-user-beranda"
            onClick={() => setActiveTab('beranda')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'beranda' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>IKHTISAR PORTAL</span>
          </button>

          {currentRole === 'Siswa' && (
            <button
              id="nav-user-jadwal"
              onClick={() => setActiveTab('jadwal')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'jadwal' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>JADWAL KBM KELAS</span>
            </button>
          )}

          <button
            id="nav-user-nilai"
            onClick={() => setActiveTab('nilai')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'nilai' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>RAPORT & BUKU NILAI</span>
          </button>

          <button
            id="nav-user-kehadiran"
            onClick={() => setActiveTab('kehadiran')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'kehadiran' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            <span>RIWAYAT KEHADIRAN</span>
          </button>

          {currentRole === 'Orang Tua' && (
            <button
              id="nav-user-izin"
              onClick={() => setActiveTab('izin')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'izin' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
              }`}
            >
              <Send className="h-4 w-4" />
              <span>AJUKAN IZIN SISWA</span>
            </button>
          )}

          <button
            id="nav-user-disiplin"
            onClick={() => setActiveTab('disiplin')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'disiplin' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>CATATAN KEDISIPLINAN</span>
          </button>

          <button
            id="nav-user-pengumuman"
            onClick={() => setActiveTab('pengumuman')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'pengumuman' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>MADING SEKOLAH</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-emerald-900 border-t border-emerald-700 text-[10px] text-emerald-300 text-center">
          <p className="font-bold">MTs Agama Islam Mertapada</p>
          <p className="opacity-75">Portal {currentRole}</p>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Workspace Title & Greeting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 mb-6 gap-3">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">SIPMT Portal Madrasah</span>
            <h1 className="text-2xl font-black text-emerald-950 uppercase tracking-tight">
              {currentRole === 'Orang Tua' ? 'Laporan Perkembangan Anak' : 'Ruang Siswa'}
            </h1>
          </div>

          {currentRole === 'Orang Tua' && (
            <button
              onClick={openWaliKelasChat}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-lg text-xs uppercase flex items-center gap-1.5 shadow transition-colors"
            >
              <Smartphone className="h-4 w-4 text-amber-400" /> Hubungi Wali Kelas ({studentWaliKelas?.nama})
            </button>
          )}
        </div>

        {/* ========================================================= */}
        {/* SUB VIEW: BERANDA (OVERVIEW CARD) */}
        {/* ========================================================= */}
        {activeTab === 'beranda' && (
          <div className="space-y-6">
            
            {/* Identity Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-black text-emerald-950">
                  {studentObj.nama}
                </h2>
                <div className="text-xs text-gray-500 mt-1 font-mono">
                  NIS: {studentObj.nis} | NISN: {studentObj.nisn} | Kelas Aktif: <strong className="text-emerald-800">{studentClass?.nama}</strong>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Terdaftar resmi pada Semester Ganjil, Tahun Ajaran 2025/2026 MTs Agama Islam Mertapada.
                </p>
              </div>

              <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                Wali Kelas: {studentWaliKelas?.nama || 'N/A'}
              </div>
            </div>

            {/* Micro KPI Scoreboard */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Nilai Rata-rata</span>
                  <strong className="text-2xl font-black text-emerald-950">{avgGrade}</strong>
                </div>
                <Award className="h-8 w-8 text-amber-500" />
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Persentase Hadir</span>
                  <strong className="text-2xl font-black text-emerald-950">{attendanceRate}%</strong>
                </div>
                <CheckSquare className="h-8 w-8 text-emerald-700" />
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Poin Pelanggaran</span>
                  <strong className={`text-2xl font-black ${totalViolationsPoin > 0 ? 'text-red-600' : 'text-emerald-950'}`}>
                    {totalViolationsPoin} Poin
                  </strong>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>

            {/* Quick school messages board shortcut */}
            <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-4">
              <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong>Informasi Penting Portal Siswa & Orang Tua:</strong>
                <p className="leading-relaxed">
                  Gunakan portal ini untuk memantau catatan presensi harian secara transparan. Jika anak berhalangan hadir dikarenakan sakit atau keperluan mendesak, Orang Tua dapat mengajukan surat keterangan digital langsung melalui menu <strong>Ajukan Izin Siswa</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUB VIEW: CLASS SCHEDULE (FOR STUDENT ONLY) */}
        {/* ========================================================= */}
        {activeTab === 'jadwal' && (
          <div className="space-y-6">
            <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">
              Jadwal Kegiatan Belajar Mengajar (KBM) Kelas {studentClass?.nama}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {classSchedules.length === 0 ? (
                <div className="bg-white p-8 text-center text-gray-500 border rounded-xl col-span-3">
                  Jadwal KBM belum dipublikasikan oleh kurikulum.
                </div>
              ) : (
                classSchedules.map(sch => (
                  <div key={sch.id} className="bg-white p-5 rounded-xl border-l-4 border-emerald-700 border-y border-r border-gray-200 shadow-xs">
                    <div className="flex justify-between items-center mb-2 text-xs">
                      <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase">{sch.hari}</span>
                      <span className="font-mono text-gray-400 font-bold">{sch.jamMulai} - {sch.jamSelesai}</span>
                    </div>
                    <h4 className="text-base font-black text-emerald-950">{getMapelName(sch.mapelId)}</h4>
                    <p className="text-[11px] text-gray-500 mt-1">Guru: {getTeacherName(sch.guruId)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SUB VIEW: GRADES AND REPORT CARD */}
        {/* ========================================================= */}
        {activeTab === 'nilai' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
            <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">
              Laporan Hasil Belajar Semester Ganjil - {studentObj.nama}
            </h3>

            {grades.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Info className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                <p className="font-bold text-emerald-950">Nilai Belum Terinput</p>
                <p className="text-xs text-gray-500">Nilai tugas dan ujian Anda sedang dalam proses penginputan oleh guru bidang studi.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                      <th className="p-3">Mata Pelajaran</th>
                      <th className="p-3 text-center">Tugas</th>
                      <th className="p-3 text-center">UH</th>
                      <th className="p-3 text-center">UTS</th>
                      <th className="p-3 text-center">UAS</th>
                      <th className="p-3 text-center">Nilai Akhir</th>
                      <th className="p-3 text-center">Predikat</th>
                      <th className="p-3">Keterangan Capaian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {grades.map(g => (
                      <tr key={g.id} className="hover:bg-gray-50">
                        <td className="p-3 font-bold text-emerald-950">{getMapelName(g.mapelId)}</td>
                        <td className="p-3 text-center font-mono">{g.tugas}</td>
                        <td className="p-3 text-center font-mono">{g.uh}</td>
                        <td className="p-3 text-center font-mono">{g.uts}</td>
                        <td className="p-3 text-center font-mono">{g.uas}</td>
                        <td className="p-3 text-center font-mono font-black text-emerald-800 text-sm">{g.nilaiAkhir}</td>
                        <td className="p-3 text-center">
                          <span className="bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded text-[10px]">
                            {g.predikat}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500 text-[11px] max-w-xs truncate">
                          {g.nilaiAkhir >= 75 ? 'Tuntas. Sangat baik dalam menguasai kompetensi dasar.' : 'Butuh bimbingan intensif.'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* SUB VIEW: DAILY ATTENDANCE HISTORY */}
        {/* ========================================================= */}
        {activeTab === 'kehadiran' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
            <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">
              Daftar Presensi Harian Siswa
            </h3>

            {attendanceList.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Belum ada rekaman absensi digital terdaftar pada hari ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                      <th className="p-3">Tanggal Absensi</th>
                      <th className="p-3">Status Kehadiran</th>
                      <th className="p-3">Catatan / Keterangan</th>
                      <th className="p-3 text-center">Otomatis WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {attendanceList.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="p-3 font-mono font-bold text-gray-500">{a.tanggal}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                            a.status === 'Hadir' ? 'bg-emerald-100 text-emerald-800' :
                            a.status === 'Sakit' ? 'bg-blue-100 text-blue-800' :
                            a.status === 'Izin' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600 italic">"{a.catatan || 'Presensi kelas'}"</td>
                        <td className="p-3 text-center">
                          {a.waSentStatus ? (
                            <span className="text-[9px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 uppercase font-bold inline-block">
                              WhatsApp Terkirim
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[10px]">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* SUB VIEW: SUBMIT PERMITS BY PARENT */}
        {/* ========================================================= */}
        {activeTab === 'izin' && currentRole === 'Orang Tua' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Input Form */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs h-fit text-xs">
              <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">Kirim Izin Sakit Anak</h3>
              
              <form onSubmit={handlePostPermitByParent} className="space-y-4">
                <div>
                  <label className="block font-bold mb-1 text-gray-600">Tanggal Berhalangan Hadir</label>
                  <input type="date" className="w-full p-2 border rounded bg-white text-xs font-mono font-bold" value={permitDate} onChange={e => setPermitDate(e.target.value)} required />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-gray-600">Alasan / Keterangan Tidak Masuk</label>
                  <textarea rows={4} placeholder="Contoh: Demam tinggi, diare, rawat inap di puskesmas..." className="w-full p-2 border rounded bg-white text-xs" value={permitReason} onChange={e => setPermitReason(e.target.value)} required />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-gray-600">File Pendukung (Ketik Nama Dokumen/Foto)</label>
                  <input type="text" className="w-full p-2 border rounded bg-white text-xs" value={permitAttachment} onChange={e => setPermitAttachment(e.target.value)} />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-black p-2.5 rounded-lg text-xs uppercase flex items-center justify-center gap-1.5 transition-colors shadow"
                >
                  <Send className="h-4 w-4 text-amber-400" /> Ajukan Surat Izin
                </button>
              </form>
            </div>

            {/* List Submitted Permits */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs md:col-span-2">
              <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">Riwayat Pengajuan Surat Keterangan</h3>
              <div className="space-y-3">
                {permits.map(p => (
                  <div key={p.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-center flex-wrap gap-2 text-xs">
                    <div>
                      <div className="font-mono font-bold text-gray-500">Izin Tanggal: {p.tanggal}</div>
                      <p className="font-semibold text-gray-800 mt-1">Sebab: {p.alasan}</p>
                      <div className="text-[10px] text-emerald-700 underline mt-1">Lampiran: {p.lampiran}</div>
                    </div>

                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        p.statusPersetujuan === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' :
                        p.statusPersetujuan === 'Ditolak' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800 animate-pulse'
                      }`}>
                        {p.statusPersetujuan}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* SUB VIEW: DISCIPLINE & PENALTY RECORDS */}
        {/* ========================================================= */}
        {activeTab === 'disiplin' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
            <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">
              Laporan Catatan Ketertiban & Sanksi Sanksi
            </h3>

            {violations.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-emerald-950">Disiplin Luar Biasa!</p>
                <p className="text-xs text-gray-500 mt-0.5">Tidak ada sanksi pelanggaran tata tertib tercatat pada semester ini.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {violations.map(v => (
                  <div key={v.id} className="p-4 border border-red-100 rounded-lg bg-red-50/20 flex justify-between items-start text-xs">
                    <div>
                      <div className="font-mono font-bold text-gray-400">Tanggal Sanksi: {v.tanggal}</div>
                      <div className="font-bold text-red-800 mt-1 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        {v.jenisPelanggaran}
                      </div>
                      <p className="text-gray-500 italic mt-0.5">Catatan guru: "{v.catatan}"</p>
                    </div>
                    <span className="bg-red-100 text-red-800 font-black font-mono px-3 py-1 rounded-full text-xs">
                      {v.poin} Poin
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* SUB VIEW: ANNOUNCEMENTS */}
        {/* ========================================================= */}
        {activeTab === 'pengumuman' && (
          <div className="space-y-4">
            {state.pengumumans
              .filter(ann => 
                ann.target === 'Semua' || 
                (ann.target === 'Kelas' && ann.kelasId === studentObj.kelasId)
              )
              .map(ann => (
                <div key={ann.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-emerald-600 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] bg-emerald-800 text-amber-400 font-bold px-2 py-0.5 rounded uppercase">
                      Target: {ann.target} {ann.kelasId ? `Kelas ${getClassName(ann.kelasId)}` : ''}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{ann.tanggal}</span>
                  </div>
                  <h3 className="text-base font-black text-emerald-950 mb-2">{ann.judul}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{ann.isi}</p>
                </div>
              ))}
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL: MOCK WHATSAPP CHAT FROM PARENT TO WALI KELAS */}
      {/* ========================================================= */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#e5ddd5] w-full max-w-md rounded-2xl border-[4px] border-emerald-900 shadow-2xl overflow-hidden flex flex-col h-[520px]">
            
            {/* Header */}
            <div className="bg-emerald-800 text-white p-3 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm uppercase">
                {studentWaliKelas?.nama.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs truncate">{studentWaliKelas?.nama}</div>
                <div className="text-[9px] text-emerald-200 truncate">Wali Kelas {studentClass?.nama}</div>
              </div>
              <button 
                onClick={() => setContactModalOpen(false)} 
                className="text-white/80 hover:text-white text-xs font-bold uppercase shrink-0 px-2 py-1 rounded hover:bg-emerald-700 transition-colors"
              >
                Tutup ✗
              </button>
            </div>

            {/* Chat Body Mockup */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#efe7dd] relative flex flex-col justify-end">
              <div className="mx-auto bg-emerald-100 text-emerald-900 text-[10px] py-1 px-3 rounded-lg text-center shadow-xs">
                💬 Hubungi Wali Kelas via WhatsApp
              </div>
              
              <div className="bg-white text-gray-800 text-xs p-3.5 rounded-lg rounded-tl-none self-start max-w-[90%] shadow-md leading-relaxed border-l-4 border-amber-500">
                <textarea
                  className="w-full bg-transparent border-none focus:outline-none resize-none font-sans text-[11px] h-48 text-gray-800 leading-relaxed"
                  value={chatTemplate}
                  onChange={e => setChatTemplate(e.target.value)}
                />
              </div>
            </div>

            {/* Send Control */}
            <div className="bg-gray-100 p-2.5 flex justify-end shrink-0 border-t border-gray-200">
              <button
                id="btn-confirm-parent-chat"
                onClick={handleSimulateChatSubmit}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-black px-4 py-2 rounded-lg text-xs uppercase flex items-center gap-1.5 shadow transition-colors"
              >
                <Send className="h-3.5 w-3.5 text-amber-300" /> Kirim Pesan WA
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
