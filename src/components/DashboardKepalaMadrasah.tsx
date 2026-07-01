/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../store';
import { 
  Users, BookOpen, GraduationCap, Clock, AlertTriangle, 
  TrendingUp, CheckCircle, HelpCircle, Activity, LayoutGrid, ListTodo
} from 'lucide-react';

export const DashboardKepalaMadrasah: React.FC = () => {
  const { state } = useApp();

  const todayStr = new Date().toISOString().slice(0, 10);

  // Stats
  const totalGuru = state.gurus.length;
  const totalSiswa = state.siswas.length;

  // Active Daily Attendance (Teachers)
  const todayGuruAbs = state.absensiGurus.filter(a => a.tanggal === todayStr);
  const guruHadir = todayGuruAbs.filter(a => a.status === 'Hadir' || a.status === 'Terlambat').length;
  const guruTidakHadir = totalGuru - guruHadir;
  const guruTerlambatList = todayGuruAbs.filter(a => a.status === 'Terlambat');

  // Active Daily Attendance (Students)
  const todaySiswaAbs = state.absensiSiswas.filter(a => a.tanggal === todayStr);
  const siswaHadir = todaySiswaAbs.filter(a => a.status === 'Hadir').length;
  const siswaTidakHadir = totalSiswa - siswaHadir;

  // Miscellaneous statistics
  const totalIzinPending = state.izins.filter(i => i.statusPersetujuan === 'Pending').length;
  const totalPelanggaran = state.pelanggarans.length;

  // Dynamic "Kelas Kosong" Calculation:
  // Find schedules for "Hari Ini" based on the Indonesian day.
  const daysIndo: { [key: number]: string } = {
    0: 'Minggu', 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu'
  };
  const activeDayIndo = daysIndo[new Date().getDay()] || 'Senin';
  
  // Schedules matching today's day
  const todaySchedules = state.jadwals.filter(j => j.hari === activeDayIndo);
  
  // A "Kelas Kosong" is a schedule today where the assigned teacher is marked as Sakit, Izin, or Alpa today!
  const kelasKosongList = todaySchedules.filter(sch => {
    const teacherAbs = state.absensiGurus.find(a => a.guruId === sch.guruId && a.tanggal === todayStr);
    return teacherAbs && (teacherAbs.status === 'Sakit' || teacherAbs.status === 'Izin' || teacherAbs.status === 'Alpa');
  });

  const getClassName = (id: string) => state.kelas.find(c => c.id === id)?.nama || 'N/A';
  const getMapelName = (id: string) => state.mapels.find(m => m.id === id)?.nama || 'N/A';
  const getTeacherName = (id: string) => state.gurus.find(g => g.id === id)?.nama || 'N/A';

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Principal Welcome Card */}
      <div className="bg-emerald-950 text-white p-6 rounded-2xl border border-emerald-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <GraduationCap className="h-4 w-4" />
            Laporan Kinerja Madrasah
          </div>
          <h2 className="text-xl font-black">KH. Ahmad Syauqi, S.Ag., M.Pd.I</h2>
          <p className="text-xs text-emerald-200 mt-1">Kepala Madrasah Tsanawiyah Agama Islam Mertapada</p>
        </div>
        
        <div className="text-xs text-emerald-100 font-mono bg-emerald-900 px-4 py-2.5 rounded-lg border border-emerald-800 self-stretch md:self-auto flex items-center justify-center">
          🕒 Live Database Monitoring Active
        </div>
      </div>

      {/* Real-time KPI Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Guru Stats */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Sumber Daya Manusia</div>
          <div className="flex justify-between items-baseline">
            <div className="text-3xl font-black text-emerald-950">{totalGuru}</div>
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Staf Guru</div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-4 pt-3 border-t border-gray-100 text-[11px]">
            <div>Hadir: <strong className="text-emerald-700 font-black">{guruHadir}</strong></div>
            <div>Absen: <strong className="text-red-600 font-black">{guruTidakHadir}</strong></div>
          </div>
        </div>

        {/* Siswa Stats */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Kapasitas Murid</div>
          <div className="flex justify-between items-baseline">
            <div className="text-3xl font-black text-emerald-950">{totalSiswa}</div>
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Siswa Aktif</div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-4 pt-3 border-t border-gray-100 text-[11px]">
            <div>Hadir: <strong className="text-emerald-700 font-black">{siswaHadir}</strong></div>
            <div>Absen: <strong className="text-red-600 font-black">{siswaTidakHadir}</strong></div>
          </div>
        </div>

        {/* Kelas Kosong Detection KPI */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Potensi Kelas Kosong</div>
          <div className="flex justify-between items-baseline">
            <div className={`text-3xl font-black ${kelasKosongList.length > 0 ? 'text-red-600 animate-pulse' : 'text-emerald-950'}`}>
              {kelasKosongList.length}
            </div>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
              kelasKosongList.length > 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {kelasKosongList.length > 0 ? 'Waspada' : 'Aman ✓'}
            </span>
          </div>
          <div className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100 truncate">
            {kelasKosongList.length > 0 ? `Kelas: ${kelasKosongList.map(k => getClassName(k.kelasId)).join(', ')}` : 'Semua kelas terpantau terisi.'}
          </div>
        </div>

        {/* Disciplinary flags KPI */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Penegakan Disiplin</div>
          <div className="flex justify-between items-baseline">
            <div className="text-3xl font-black text-emerald-950">{totalPelanggaran}</div>
            <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Poin Sanksi
            </span>
          </div>
          <div className="text-[10px] text-gray-500 mt-4 pt-3 border-t border-gray-100 flex justify-between">
            <span>Izin Pending: <strong className="text-amber-600 font-black">{totalIzinPending}</strong></span>
            <span>Total Poin: <strong className="text-red-600 font-black">{state.pelanggarans.reduce((s,c)=>s+c.poin,0)}</strong></span>
          </div>
        </div>

      </div>

      {/* DUAL COLUMN: CHARTS & WARNING LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: hand-crafted interactive SVG charts */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs lg:col-span-2 space-y-6">
          
          {/* Chart 1: Kehadiran Hari Ini */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                Analisis Rasio Kehadiran Hari Ini ({todayStr})
              </h3>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Rasio Real-Time</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              
              {/* Hand-crafted Custom SVG Bar Chart */}
              <div className="h-44 flex flex-col justify-end space-y-2.5 p-3 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                    <span>Siswa Hadir ({siswaHadir} anak)</span>
                    <span className="font-bold text-emerald-800">{totalSiswa > 0 ? Math.round((siswaHadir/totalSiswa)*100) : 100}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${totalSiswa > 0 ? (siswaHadir/totalSiswa)*100 : 100}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                    <span>Guru Hadir ({guruHadir} guru)</span>
                    <span className="font-bold text-emerald-800">{totalGuru > 0 ? Math.round((guruHadir/totalGuru)*100) : 100}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${totalGuru > 0 ? (guruHadir/totalGuru)*100 : 100}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                    <span>Tingkat Kedisiplinan Guru Tepat Waktu</span>
                    <span className="font-bold text-emerald-800">
                      {guruHadir > 0 ? Math.round(((guruHadir - guruTerlambatList.length)/guruHadir)*100) : 100}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-3.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-850 h-full rounded-full transition-all duration-500" style={{ width: `${guruHadir > 0 ? ((guruHadir - guruTerlambatList.length)/guruHadir)*100 : 100}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Stat breakdown list */}
              <div className="text-xs space-y-2 pt-2 md:pt-0">
                <div className="p-2.5 bg-emerald-50 rounded border-l-4 border-emerald-600 flex justify-between">
                  <span className="text-gray-600 font-medium">Siswa Presensi Terhitung</span>
                  <strong className="text-emerald-950 font-black">{siswaHadir} / {totalSiswa} Siswa</strong>
                </div>
                <div className="p-2.5 bg-amber-50 rounded border-l-4 border-amber-500 flex justify-between">
                  <span className="text-gray-600 font-medium">Guru Presensi Terhitung</span>
                  <strong className="text-emerald-950 font-black">{guruHadir} / {totalGuru} Guru</strong>
                </div>
                <div className="p-2.5 bg-red-50 rounded border-l-4 border-red-500 flex justify-between">
                  <span className="text-gray-600 font-medium">Siswa Absen/Alpa/Sakit</span>
                  <strong className="text-red-700 font-black">{siswaTidakHadir} Siswa</strong>
                </div>
              </div>

            </div>
          </div>

          {/* Chart 2: Kehadiran Bulanan */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">Grafik Tren Absensi Bulanan (Persentase Rata-rata)</h3>
            
            {/* Custom Responsive SVG Chart Line/Bars representing Jan - Jun */}
            <div className="h-40 w-full flex items-end gap-5 pt-6 pb-2 px-4 bg-gray-50 rounded-lg relative">
              
              {/* Grid guide lines */}
              <div className="absolute inset-y-0 inset-x-0 flex flex-col justify-between pointer-events-none p-3 text-[9px] text-gray-300 font-mono">
                <div className="border-b border-gray-200/50 w-full">100%</div>
                <div className="border-b border-gray-200/50 w-full">80%</div>
                <div className="border-b border-gray-200/50 w-full">60%</div>
                <div className="w-full">0%</div>
              </div>

              {/* Bars representing January to June */}
              {[
                { label: 'Jan', value: 92, color: 'bg-emerald-800' },
                { label: 'Feb', value: 89, color: 'bg-emerald-800' },
                { label: 'Mar', value: 94, color: 'bg-emerald-800' },
                { label: 'Apr', value: 95, color: 'bg-emerald-800' },
                { label: 'Mei', value: 91, color: 'bg-emerald-800' },
                { label: 'Jun', value: 96, color: 'bg-amber-500' }
              ].map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end z-10">
                  <span className="text-[10px] font-mono font-bold text-emerald-950 mb-1">{m.value}%</span>
                  <div 
                    className={`${m.color} w-full rounded-t transition-all duration-75 hover:opacity-80 cursor-pointer shadow-xs`}
                    style={{ height: `${m.value}%` }}
                    title={`${m.label}: Kehadiran rata-rata ${m.value}%`}
                  ></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase mt-1.5 font-mono">{m.label}</span>
                </div>
              ))}

            </div>
          </div>

        </div>

        {/* Right column: active real-time warnings (Void classes & teacher tardiness) */}
        <div className="space-y-6">
          
          {/* Warning 1: Kelas Kosong Alert */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <h3 className="text-xs font-black text-red-600 uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <AlertTriangle className="h-4.5 w-4.5 text-red-500 animate-bounce shrink-0" />
              Deteksi Kelas Kosong ({kelasKosongList.length} Jam)
            </h3>

            {kelasKosongList.length === 0 ? (
              <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Seluruh jam pengajaran terpantau aman dan terisi oleh staf pengajar.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-red-50 text-red-900 border border-red-200 rounded-lg text-xs leading-relaxed">
                  <strong>Peringatan!</strong> Guru pengajar berikut tidak dapat mengajar hari ini. Segera tunjuk guru piket pengganti!
                </div>
                {kelasKosongList.map((sch) => {
                  const teacherAbs = state.absensiGurus.find(a => a.guruId === sch.guruId && a.tanggal === todayStr);
                  return (
                    <div key={sch.id} className="p-3 border border-red-100 bg-red-50/20 rounded-lg text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-emerald-950 text-[11px]">{getMapelName(sch.mapelId)}</span>
                        <span className="text-[9px] font-mono bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-bold uppercase">{teacherAbs?.status}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">Kelas: <strong className="text-emerald-900 font-bold">{getClassName(sch.kelasId)}</strong> | Jam: {sch.jamMulai} - {sch.jamSelesai}</p>
                      <p className="text-[10px] text-red-700 mt-1">Guru: {getTeacherName(sch.guruId)} <span className="italic">({teacherAbs?.catatan || 'Tanpa keterangan'})</span></p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Warning 2: Staf terlambat log */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs text-xs">
            <h3 className="font-black text-emerald-950 uppercase text-xs mb-3 flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-amber-500 shrink-0" />
              Guru Terlambat Hari Ini ({guruTerlambatList.length} Staf)
            </h3>

            {guruTerlambatList.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-xs">
                Belum ada staf guru yang terlambat melakukan presensi hari ini.
              </div>
            ) : (
              <div className="space-y-2">
                {guruTerlambatList.map(a => (
                  <div key={a.id} className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-emerald-950">{getTeacherName(a.guruId)}</span>
                      <span className="font-mono text-amber-700 font-bold bg-amber-100 px-1.5 py-0.2 rounded text-[10px]">{a.waktuPresensi} WIB</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 italic">Sebab: "{a.catatan}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
