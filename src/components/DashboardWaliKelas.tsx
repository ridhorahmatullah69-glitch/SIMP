/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../store';
import { 
  Users, CheckSquare, Award, AlertTriangle, Bell, 
  Smartphone, MessageSquare, Info, Send, Calendar, CheckCircle
} from 'lucide-react';

export const DashboardWaliKelas: React.FC = () => {
  const { state, ...actions } = useApp();

  // Resolve Homeroom class
  const activeWaliKelasId = state.currentUser.targetId || 'guru-amin';
  const homeroomTeacher = state.gurus.find(g => g.id === activeWaliKelasId) || state.gurus[0];
  const homeroomClass = state.kelas.find(c => c.waliKelasId === activeWaliKelasId) || state.kelas[0];

  // Tab State
  const [activeTab, setActiveTab] = useState<'roster' | 'absensi' | 'nilai' | 'pelanggaran' | 'pengumuman'>('roster');

  // WhatsApp Contact Modal State
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedParentNum, setSelectedParentNum] = useState('');
  const [selectedParentName, setSelectedParentName] = useState('');
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [chatTemplate, setChatTemplate] = useState('');

  // Class Announcement States
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  if (!homeroomClass) {
    return (
      <div className="p-8 text-center bg-white border rounded-xl max-w-xl mx-auto my-12 shadow">
        <h2 className="text-xl font-bold text-red-600 mb-2">Akses Terbatas</h2>
        <p className="text-gray-600 text-sm">Akun Anda tidak tercatat sebagai Wali Kelas aktif pada semester ini. Hubungi Administrator Kurikulum.</p>
      </div>
    );
  }

  // Filter students under this Wali Kelas
  const students = state.siswas.filter(s => s.kelasId === homeroomClass.id);
  
  // Custom Stats
  const totalStudents = students.length;
  
  const classViolations = state.pelanggarans.filter(p => 
    students.some(s => s.id === p.siswaId)
  );

  const totalClassPoin = classViolations.reduce((sum, curr) => sum + curr.poin, 0);

  const getMapelName = (id: string) => state.mapels.find(m => m.id === id)?.nama || 'N/A';
  const getStudentName = (id: string) => state.siswas.find(s => s.id === id)?.nama || 'N/A';

  // Trigger Chat Template Modal
  const openChatModal = (parentName: string, studentName: string, parentNum: string) => {
    setSelectedParentName(parentName);
    setSelectedStudentName(studentName);
    setSelectedParentNum(parentNum);
    
    setChatTemplate(`Assalamu'alaikum Wr. Wb.

Yth. Bapak/Ibu ${parentName} (Orang Tua/Wali dari ${studentName}).

Perkenalkan saya ${homeroomTeacher?.nama}, selaku Wali Kelas dari putra/putri Anda di Kelas ${homeroomClass.nama} MTs Agama Islam Mertapada.

Kami bermaksud untuk menghubungi Bapak/Ibu terkait perkembangan akademik dan disiplin ${studentName} di sekolah.

Mohon kesediaan waktunya untuk saling berkoordinasi.

Terima kasih.
Wassalamu'alaikum Wr. Wb.`);
    setContactModalOpen(true);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) {
      alert('Tulis judul dan konten pengumuman.');
      return;
    }

    actions.addPengumuman({
      judul: annTitle,
      isi: annContent,
      tanggal: new Date().toISOString().slice(0, 10),
      target: 'Kelas',
      kelasId: homeroomClass.id
    });

    alert(`Pengumuman berhasil disiarkan khusus untuk Kelas ${homeroomClass.nama}.`);
    setAnnTitle('');
    setAnnContent('');
  };

  const handleSimulateChatSubmit = () => {
    alert(`Pesan WhatsApp Berhasil Dikirim secara Simulasi ke ${selectedParentName} (${selectedParentNum})!`);
    setContactModalOpen(false);
    
    // Log the action
    actions.logAction(
      homeroomTeacher.nama,
      'Wali Kelas',
      'Hubungi Orang Tua',
      `Menghubungi Wali Murid dari ${selectedStudentName} via chat template.`
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-800">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-emerald-800 text-white shrink-0 shadow-lg flex flex-col">
        
        {/* Homeroom Header */}
        <div className="p-5 border-b border-emerald-700 bg-emerald-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-emerald-950 flex items-center justify-center font-bold text-sm uppercase shrink-0 shadow">
            {homeroomClass.nama}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold truncate leading-tight">{homeroomTeacher?.nama}</h2>
            <p className="text-[10px] text-emerald-200 truncate">Wali Kelas: {homeroomClass.nama}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 p-3 space-y-1">
          <button
            id="nav-wali-roster"
            onClick={() => setActiveTab('roster')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'roster' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>DAFTAR SISWA KELAS</span>
          </button>

          <button
            id="nav-wali-absensi"
            onClick={() => setActiveTab('absensi')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'absensi' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            <span>MONITOR ABSENSI</span>
          </button>

          <button
            id="nav-wali-nilai"
            onClick={() => setActiveTab('nilai')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'nilai' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <Award className="h-4 w-4" />
            <span>NILAI AKADEMIK SISWA</span>
          </button>

          <button
            id="nav-wali-pelanggaran"
            onClick={() => setActiveTab('pelanggaran')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'pelanggaran' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>DAFTAR PELANGGARAN</span>
          </button>

          <button
            id="nav-wali-pengumuman"
            onClick={() => setActiveTab('pengumuman')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'pengumuman' ? 'bg-amber-500 text-emerald-950 shadow font-bold' : 'hover:bg-emerald-700 text-emerald-100'
            }`}
          >
            <Bell className="h-4 w-4" />
            <span>KIRIM PENGUMUMAN KELAS</span>
          </button>
        </div>

        {/* Brand stamp */}
        <div className="p-4 bg-emerald-900 border-t border-emerald-700 text-[10px] text-emerald-300 text-center">
          <p className="font-bold">MTs Agama Islam Mertapada</p>
          <p className="opacity-75">SIPMT Homeroom Portal</p>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Workspace Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 mb-6 gap-3">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Ruang Wali Kelas</span>
            <h1 className="text-2xl font-black text-emerald-950 uppercase tracking-tight">
              Kelas Binaan: {homeroomClass.nama}
            </h1>
          </div>
          
          <div className="flex gap-4 text-xs font-mono">
            <div className="bg-emerald-50 px-3 py-1.5 rounded-lg text-emerald-900 border border-emerald-200 font-bold">
              Total Siswa: {totalStudents} Anak
            </div>
            <div className="bg-red-50 px-3 py-1.5 rounded-lg text-red-950 border border-red-200 font-bold">
              Akumulasi Poin Kelas: {totalClassPoin} Poin
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ROSTER & PARENT CONTACTS */}
        {/* ========================================================= */}
        {activeTab === 'roster' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
              <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">
                Daftar Biodata Siswa & Wali Murid Kelas {homeroomClass.nama}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                      <th className="p-3">NIS/NISN</th>
                      <th className="p-3">Nama Lengkap</th>
                      <th className="p-3">Jenis Kelamin</th>
                      <th className="p-3">Alamat Rumah</th>
                      <th className="p-3">Nama Orang Tua / Wali</th>
                      <th className="p-3 text-center">Hubungi Orang Tua</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="p-3 font-mono text-gray-500">
                          <div>NIS: {s.nis}</div>
                          <div className="text-[10px]">NISN: {s.nisn}</div>
                        </td>
                        <td className="p-3 font-bold text-emerald-950">{s.nama}</td>
                        <td className="p-3 font-medium text-gray-600">{s.jenisKelamin}</td>
                        <td className="p-3 text-gray-500 max-w-xs truncate" title={s.alamat}>{s.alamat}</td>
                        <td className="p-3">
                          <div className="font-bold text-gray-800">{s.namaOrangTua}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{s.teleponOrangTua}</div>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            id={`btn-contact-parent-${s.id}`}
                            onClick={() => openChatModal(s.namaOrangTua, s.nama, s.teleponOrangTua)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase flex items-center justify-center gap-1 mx-auto transition-colors shadow-xs"
                          >
                            <Smartphone className="h-3 w-3 text-amber-300" /> Hubungi WA
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Simulated WhatsApp Prompt */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Koordinasi Berkala Wali Kelas:</strong>
                <p className="leading-relaxed mt-1">
                  Wali Kelas bertanggung jawab memantau kedisiplinan dan capaian materi murid secara rutin. Gunakan tombol <strong>Hubungi WA</strong> untuk mengirim pesan koordinasi yang sopan langsung ke nomor orang tua/wali murid apabila murid menunjukkan gejala penurunan motivasi atau akumulasi sanksi poin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ABSENSI MONITOR */}
        {/* ========================================================= */}
        {activeTab === 'absensi' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs animate-fade-in">
            <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">
              Rekap Log Kehadiran Murid Kelas {homeroomClass.nama} (Semester Aktif)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3 text-center">Total Hadir</th>
                    <th className="p-3 text-center">Total Sakit</th>
                    <th className="p-3 text-center">Total Izin</th>
                    <th className="p-3 text-center">Total Alpa</th>
                    <th className="p-3 text-center">Rasio Kehadiran</th>
                    <th className="p-3">Izin Terakhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map(s => {
                    const recs = state.absensiSiswas.filter(a => a.siswaId === s.id);
                    const h = recs.filter(a => a.status === 'Hadir').length;
                    const sk = recs.filter(a => a.status === 'Sakit').length;
                    const iz = recs.filter(a => a.status === 'Izin').length;
                    const al = recs.filter(a => a.status === 'Alpa').length;
                    const pct = recs.length > 0 ? Math.round((h / recs.length) * 100) : 100;
                    
                    const lastPermit = state.izins.filter(i => i.targetId === s.id && i.statusPersetujuan === 'Disetujui').pop();

                    return (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="p-3 font-bold text-emerald-950">{s.nama}</td>
                        <td className="p-3 text-center text-emerald-700 font-bold">{h} kali</td>
                        <td className="p-3 text-center text-amber-600 font-bold">{sk} kali</td>
                        <td className="p-3 text-center text-blue-600 font-bold">{iz} kali</td>
                        <td className="p-3 text-center text-red-600 font-bold">{al} kali</td>
                        <td className="p-3 text-center font-mono font-black text-emerald-800 text-sm">{pct}%</td>
                        <td className="p-3 text-gray-500 text-[10px] max-w-xs truncate">
                          {lastPermit ? `Tgl ${lastPermit.tanggal}: "${lastPermit.alasan}"` : 'Tidak Ada Izin'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ACADEMIC GRADES VIEW */}
        {/* ========================================================= */}
        {activeTab === 'nilai' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs animate-fade-in">
            <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">
              Buku Raport & Penilaian Mapel Kelas {homeroomClass.nama}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-emerald-950 font-bold uppercase text-[10px]">
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">Mata Pelajaran</th>
                    <th className="p-3 text-center">Tugas</th>
                    <th className="p-3 text-center">UH</th>
                    <th className="p-3 text-center">UTS</th>
                    <th className="p-3 text-center">UAS</th>
                    <th className="p-3 text-center">Nilai Akhir</th>
                    <th className="p-3 text-center">Predikat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map(s => {
                    const studentGrades = state.nilais.filter(n => n.siswaId === s.id);
                    if (studentGrades.length === 0) {
                      return (
                        <tr key={s.id} className="hover:bg-gray-50">
                          <td className="p-3 font-bold text-emerald-950">{s.nama}</td>
                          <td colSpan={7} className="p-3 text-gray-400 text-center italic text-[11px]">Belum ada nilai terinput semester ini</td>
                        </tr>
                      );
                    }
                    return studentGrades.map((grade, idx) => (
                      <tr key={grade.id} className="hover:bg-gray-50">
                        {idx === 0 ? (
                          <td className="p-3 font-bold text-emerald-950 border-r border-gray-100" rowSpan={studentGrades.length}>
                            {s.nama}
                          </td>
                        ) : null}
                        <td className="p-3 font-semibold text-gray-700">{getMapelName(grade.mapelId)}</td>
                        <td className="p-3 text-center font-mono">{grade.tugas}</td>
                        <td className="p-3 text-center font-mono">{grade.uh}</td>
                        <td className="p-3 text-center font-mono">{grade.uts}</td>
                        <td className="p-3 text-center font-mono">{grade.uas}</td>
                        <td className="p-3 text-center font-mono font-black text-emerald-800 text-sm">{grade.nilaiAkhir}</td>
                        <td className="p-3 text-center font-bold">
                          <span className={`px-2 py-0.5 rounded text-white text-[10px] font-black ${
                            grade.predikat === 'A' ? 'bg-emerald-600' :
                            grade.predikat === 'B' ? 'bg-amber-500' :
                            'bg-yellow-600'
                          }`}>{grade.predikat}</span>
                        </td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: DISCIPLINE VIOLATIONS */}
        {/* ========================================================= */}
        {activeTab === 'pelanggaran' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs animate-fade-in">
            <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">
              Rekapitulasi Pelanggaran Tata Tertib Kelas {homeroomClass.nama}
            </h3>

            {classViolations.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-emerald-950">Selamat! Kelas Anda Bersih.</p>
                <p className="text-xs text-gray-500 mt-0.5">Belum ada sanksi pelanggaran kedisiplinan tercatat untuk siswa VII-A.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {classViolations.map(pel => (
                  <div key={pel.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-emerald-950">{getStudentName(pel.siswaId)}</div>
                      <div className="text-[10px] text-gray-400 font-mono">Tgl Kejadian: {pel.tanggal}</div>
                      <div className="text-xs text-red-800 font-bold mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        {pel.jenisPelanggaran}
                      </div>
                      <p className="text-xs text-gray-500 italic mt-0.5">Catatan piket: "{pel.catatan || 'N/A'}"</p>
                    </div>
                    <span className="bg-red-100 text-red-800 font-black font-mono px-3 py-1 rounded-full text-xs">
                      {pel.poin} Poin
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: BROADCAST CLASS ANNOUNCEMENTS */}
        {/* ========================================================= */}
        {activeTab === 'pengumuman' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            
            {/* Form */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs h-fit">
              <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">Kirim Pesan Kelas</h3>
              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold mb-1 text-gray-600">Judul Pesan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Info Pembagian Raport Khas..."
                    className="w-full p-2 border rounded bg-white text-xs font-bold text-emerald-950"
                    value={annTitle}
                    onChange={e => setAnnTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-gray-600">Konten Pengumuman</label>
                  <textarea
                    rows={5}
                    placeholder="Tulis pesan lengkap untuk siswa & orang tua kelas VII-A..."
                    className="w-full p-2 border rounded bg-white text-xs"
                    value={annContent}
                    onChange={e => setAnnContent(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold p-2.5 rounded-lg text-xs uppercase flex items-center justify-center gap-1.5 transition-colors shadow"
                >
                  <Send className="h-4 w-4 text-amber-400" /> Siarkan Pengumuman
                </button>
              </form>
            </div>

            {/* Broadcast lists */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs md:col-span-2">
              <h3 className="font-black text-emerald-950 uppercase text-xs mb-4">Pengumuman Terkirim Khusus Kelas {homeroomClass.nama}</h3>
              <div className="space-y-3">
                {state.pengumumans
                  .filter(ann => ann.target === 'Kelas' && ann.kelasId === homeroomClass.id)
                  .map(ann => (
                    <div key={ann.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] text-gray-400 font-mono">ID: {ann.id} | Tanggal: {ann.tanggal}</span>
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase">Kelas Broadcast</span>
                      </div>
                      <h4 className="text-xs font-black text-emerald-950">{ann.judul}</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed whitespace-pre-line">{ann.isi}</p>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL: WHATSAPP CHAT PREVIEW & SUBMISSION */}
      {/* ========================================================= */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#e5ddd5] w-full max-w-md rounded-2xl border-[4px] border-emerald-900 shadow-2xl overflow-hidden flex flex-col h-[520px]">
            
            {/* Header */}
            <div className="bg-emerald-800 text-white p-3 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm uppercase">
                {selectedParentName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs truncate">{selectedParentName} (Wali {selectedStudentName})</div>
                <div className="text-[9px] text-emerald-200 truncate">No. HP: {selectedParentNum}</div>
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
                💬 Template WhatsApp Wali Kelas - MTs Mertapada
              </div>
              
              <div className="bg-white text-gray-800 text-xs p-3.5 rounded-lg rounded-tl-none self-start max-w-[90%] shadow-md leading-relaxed border-l-4 border-amber-500">
                <textarea
                  className="w-full bg-transparent border-none focus:outline-none resize-none font-sans text-[11px] h-48 text-gray-800 leading-relaxed"
                  value={chatTemplate}
                  onChange={e => setChatTemplate(e.target.value)}
                />
                <div className="text-[9px] text-gray-400 text-right mt-1.5">
                  Editable Template
                </div>
              </div>
            </div>

            {/* Send Control */}
            <div className="bg-gray-100 p-2.5 flex justify-end shrink-0 border-t border-gray-200">
              <button
                id="btn-confirm-sim-chat"
                onClick={handleSimulateChatSubmit}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-black px-4 py-2 rounded-lg text-xs uppercase flex items-center gap-1.5 shadow transition-colors"
              >
                <Send className="h-3.5 w-3.5 text-amber-300" /> Kirim Simulasi WA
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
