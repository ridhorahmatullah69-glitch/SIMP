/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Guru,
  Siswa,
  Kelas,
  MataPelajaran,
  Semester,
  TahunAjaran,
  Jadwal,
  Pengguna,
  AbsensiGuru,
  AbsensiSiswa,
  Nilai,
  Izin,
  Pelanggaran,
  Pengumuman,
  LogAktivitas,
  WANotification,
  UserRole
} from './types';
import * as seed from './initialData';

interface AppState {
  gurus: Guru[];
  siswas: Siswa[];
  kelas: Kelas[];
  mapels: MataPelajaran[];
  semesters: Semester[];
  tahunAjarans: TahunAjaran[];
  jadwals: Jadwal[];
  penggunas: Pengguna[];
  absensiGurus: AbsensiGuru[];
  absensiSiswas: AbsensiSiswa[];
  nilais: Nilai[];
  izins: Izin[];
  pelanggarans: Pelanggaran[];
  pengumumans: Pengumuman[];
  logs: LogAktivitas[];
  waNotifications: WANotification[];
  currentUser: Pengguna;
}

interface AppContextType {
  state: AppState;
  
  // Set active role for simulation
  setCurrentUser: (user: Pengguna) => void;
  
  // Log helper
  logAction: (username: string, role: string, aktivitas: string, rincian: string) => void;

  // Guru CRUD
  addGuru: (g: Omit<Guru, 'id'>) => void;
  updateGuru: (id: string, g: Partial<Guru>) => void;
  deleteGuru: (id: string) => void;

  // Siswa CRUD
  addSiswa: (s: Omit<Siswa, 'id'>) => void;
  updateSiswa: (id: string, s: Partial<Siswa>) => void;
  deleteSiswa: (id: string) => void;

  // Kelas CRUD
  addKelas: (k: Omit<Kelas, 'id'>) => void;
  updateKelas: (id: string, k: Partial<Kelas>) => void;
  deleteKelas: (id: string) => void;

  // Mata Pelajaran CRUD
  addMapel: (m: Omit<MataPelajaran, 'id'>) => void;
  updateMapel: (id: string, m: Partial<MataPelajaran>) => void;
  deleteMapel: (id: string) => void;

  // Semester Operations
  addSemester: (s: Omit<Semester, 'id'>) => void;
  toggleSemesterStatus: (id: string) => void;
  deleteSemester: (id: string) => void;

  // Tahun Ajaran Operations
  addTahunAjaran: (t: Omit<TahunAjaran, 'id'>) => void;
  toggleTahunAjaranStatus: (id: string) => void;
  deleteTahunAjaran: (id: string) => void;

  // Jadwal CRUD
  addJadwal: (j: Omit<Jadwal, 'id'>) => void;
  updateJadwal: (id: string, j: Partial<Jadwal>) => void;
  deleteJadwal: (id: string) => void;

  // Pengguna CRUD
  addPengguna: (u: Omit<Pengguna, 'id'>) => void;
  updatePengguna: (id: string, u: Partial<Pengguna>) => void;
  deletePengguna: (id: string) => void;

  // Absensi Guru
  upsertAbsensiGuru: (guruId: string, tanggal: string, status: AbsensiGuru['status'], catatan: string) => void;

  // Absensi Siswa
  upsertAbsensiSiswa: (siswaId: string, kelasId: string, tanggal: string, status: AbsensiSiswa['status'], catatan: string) => void;

  // Nilai CRUD
  addNilai: (n: Omit<Nilai, 'id' | 'nilaiAkhir' | 'predikat' | 'deskripsi'>) => void;
  updateNilai: (id: string, n: Partial<Nilai>) => void;
  deleteNilai: (id: string) => void;

  // Izin CRUD
  addIzin: (i: Omit<Izin, 'id' | 'statusPersetujuan'>) => void;
  approveIzin: (id: string, approved: 'Disetujui' | 'Ditolak') => void;

  // Pelanggaran CRUD
  addPelanggaran: (p: Omit<Pelanggaran, 'id'>) => void;
  updatePelanggaran: (id: string, p: Partial<Pelanggaran>) => void;
  deletePelanggaran: (id: string) => void;

  // Pengumuman CRUD
  addPengumuman: (p: Omit<Pengumuman, 'id'>) => void;
  updatePengumuman: (id: string, p: Partial<Pengumuman>) => void;
  deletePengumuman: (id: string) => void;

  // Database Backup / Restore
  backupDatabase: () => void;
  restoreDatabase: (jsonString: string) => boolean;
  resetDatabase: () => void;
  login: (username: string, password?: string) => boolean;
  logout: () => void;
}

const STORAGE_KEY = 'sipmt_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure default current user
        if (!parsed.currentUser) {
          parsed.currentUser = seed.initialPengguna[0];
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved state, using seed data', e);
      }
    }
    return {
      gurus: seed.initialGuru,
      siswas: seed.initialSiswa,
      kelas: seed.initialKelas,
      mapels: seed.initialMataPelajaran,
      semesters: seed.initialSemester,
      tahunAjarans: seed.initialTahunAjaran,
      jadwals: seed.initialJadwal,
      penggunas: seed.initialPengguna,
      absensiGurus: seed.initialAbsensiGuru,
      absensiSiswas: seed.initialAbsensiSiswa,
      nilais: seed.initialNilai,
      izins: seed.initialIzin,
      pelanggarans: seed.initialPelanggaran,
      pengumumans: seed.initialPengumuman,
      logs: seed.initialLogAktivitas,
      waNotifications: seed.initialWANotifications,
      currentUser: seed.initialPengguna[0] // default Admin
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const logAction = (username: string, role: string, aktivitas: string, rincian: string) => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 10);
    const formattedTime = now.toTimeString().slice(0, 8);
    
    const newLog: LogAktivitas = {
      id: `log-${Date.now()}`,
      waktu: `${formattedDate} ${formattedTime}`,
      pengguna: username,
      role: role,
      aktivitas: aktivitas,
      rincian: rincian
    };

    setState(prev => ({
      ...prev,
      logs: [newLog, ...prev.logs].slice(0, 100) // Keep last 100 logs
    }));
  };

  const setCurrentUser = (user: Pengguna) => {
    setState(prev => ({ ...prev, currentUser: user }));
    logAction(user.nama, user.role, 'Ganti Role Simulasi', `Beralih ke tampilan sebagai ${user.nama} (${user.role})`);
  };

  // Helper generators
  const calculateGradeDetails = (tugas: number, uh: number, uts: number, uas: number) => {
    const nilaiAkhir = Math.round((tugas * 0.2 + uh * 0.2 + uts * 0.3 + uas * 0.3) * 10) / 10;
    let predikat: 'A' | 'B' | 'C' | 'D' = 'D';
    let deskripsi = '';

    if (nilaiAkhir >= 85) {
      predikat = 'A';
      deskripsi = 'Sangat baik dalam memahami materi pembelajaran, aktif di kelas, serta menguasai seluruh indikator kompetensi dasar.';
    } else if (nilaiAkhir >= 75) {
      predikat = 'B';
      deskripsi = 'Baik dalam menguasai kompetensi dasar, mampu menyelesaikan tugas mandiri dengan terstruktur.';
    } else if (nilaiAkhir >= 60) {
      predikat = 'C';
      deskripsi = 'Cukup memahami sebagian besar materi kompetensi, membutuhkan sedikit pendampingan ekstra.';
    } else {
      predikat = 'D';
      deskripsi = 'Perlu bimbingan khusus untuk memahami kompetensi dasar, disarankan mengikuti kelas remedial.';
    }

    return { nilaiAkhir, predikat, deskripsi };
  };

  // ---------------- GURU CRUD ----------------
  const addGuru = (g: Omit<Guru, 'id'>) => {
    const newGuru: Guru = { id: `guru-${Date.now()}`, ...g };
    setState(prev => ({ ...prev, gurus: [...prev.gurus, newGuru] }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Tambah Guru', `Menambahkan guru baru: ${newGuru.nama}`);
  };

  const updateGuru = (id: string, g: Partial<Guru>) => {
    setState(prev => ({
      ...prev,
      gurus: prev.gurus.map(item => item.id === id ? { ...item, ...g } : item)
    }));
    const teacher = state.gurus.find(item => item.id === id);
    logAction(state.currentUser.nama, state.currentUser.role, 'Edit Guru', `Mengubah data guru: ${teacher?.nama}`);
  };

  const deleteGuru = (id: string) => {
    const teacher = state.gurus.find(item => item.id === id);
    setState(prev => ({
      ...prev,
      gurus: prev.gurus.filter(item => item.id !== id),
      // Clean schedules referencing this teacher
      jadwals: prev.jadwals.filter(j => j.guruId !== id)
    }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Hapus Guru', `Menghapus guru: ${teacher?.nama}`);
  };

  // ---------------- SISWA CRUD ----------------
  const addSiswa = (s: Omit<Siswa, 'id'>) => {
    const newSiswa: Siswa = { id: `siswa-${Date.now()}`, ...s };
    setState(prev => ({ ...prev, siswas: [...prev.siswas, newSiswa] }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Tambah Siswa', `Menambahkan siswa baru: ${newSiswa.nama}`);
  };

  const updateSiswa = (id: string, s: Partial<Siswa>) => {
    setState(prev => ({
      ...prev,
      siswas: prev.siswas.map(item => item.id === id ? { ...item, ...s } : item)
    }));
    const student = state.siswas.find(item => item.id === id);
    logAction(state.currentUser.nama, state.currentUser.role, 'Edit Siswa', `Mengubah data siswa: ${student?.nama}`);
  };

  const deleteSiswa = (id: string) => {
    const student = state.siswas.find(item => item.id === id);
    setState(prev => ({
      ...prev,
      siswas: prev.siswas.filter(item => item.id !== id),
      nilais: prev.nilais.filter(n => n.siswaId !== id),
      pelanggarans: prev.pelanggarans.filter(p => p.siswaId !== id),
      absensiSiswas: prev.absensiSiswas.filter(a => a.siswaId !== id)
    }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Hapus Siswa', `Menghapus siswa: ${student?.nama}`);
  };

  // ---------------- KELAS CRUD ----------------
  const addKelas = (k: Omit<Kelas, 'id'>) => {
    const newKelas: Kelas = { id: `kelas-${Date.now()}`, ...k };
    setState(prev => ({ ...prev, kelas: [...prev.kelas, newKelas] }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Tambah Kelas', `Menambahkan kelas baru: ${newKelas.nama}`);
  };

  const updateKelas = (id: string, k: Partial<Kelas>) => {
    setState(prev => ({
      ...prev,
      kelas: prev.kelas.map(item => item.id === id ? { ...item, ...k } : item)
    }));
    const kls = state.kelas.find(item => item.id === id);
    logAction(state.currentUser.nama, state.currentUser.role, 'Edit Kelas', `Mengubah data kelas: ${kls?.nama}`);
  };

  const deleteKelas = (id: string) => {
    const kls = state.kelas.find(item => item.id === id);
    setState(prev => ({
      ...prev,
      kelas: prev.kelas.filter(item => item.id !== id),
      siswas: prev.siswas.map(s => s.kelasId === id ? { ...s, kelasId: '' } : s),
      jadwals: prev.jadwals.filter(j => j.kelasId !== id)
    }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Hapus Kelas', `Menghapus kelas: ${kls?.nama}`);
  };

  // ---------------- MATA PELAJARAN CRUD ----------------
  const addMapel = (m: Omit<MataPelajaran, 'id'>) => {
    const newMapel: MataPelajaran = { id: `mapel-${Date.now()}`, ...m };
    setState(prev => ({ ...prev, mapels: [...prev.mapels, newMapel] }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Tambah Mapel', `Menambahkan mata pelajaran: ${newMapel.nama}`);
  };

  const updateMapel = (id: string, m: Partial<MataPelajaran>) => {
    setState(prev => ({
      ...prev,
      mapels: prev.mapels.map(item => item.id === id ? { ...item, ...m } : item)
    }));
    const map = state.mapels.find(item => item.id === id);
    logAction(state.currentUser.nama, state.currentUser.role, 'Edit Mapel', `Mengubah data mapel: ${map?.nama}`);
  };

  const deleteMapel = (id: string) => {
    const map = state.mapels.find(item => item.id === id);
    setState(prev => ({
      ...prev,
      mapels: prev.mapels.filter(item => item.id !== id),
      jadwals: prev.jadwals.filter(j => j.mapelId !== id),
      nilais: prev.nilais.filter(n => n.mapelId !== id)
    }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Hapus Mapel', `Menghapus mapel: ${map?.nama}`);
  };

  // ---------------- SEMESTER OPERATIONS ----------------
  const addSemester = (s: Omit<Semester, 'id'>) => {
    const newSem: Semester = { id: `sem-${Date.now()}`, ...s };
    setState(prev => ({ ...prev, semesters: [...prev.semesters, newSem] }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Tambah Semester', `Menambahkan semester baru: ${newSem.nama}`);
  };

  const toggleSemesterStatus = (id: string) => {
    setState(prev => ({
      ...prev,
      semesters: prev.semesters.map(item => {
        if (item.id === id) {
          return { ...item, status: 'Aktif' as const };
        } else {
          return { ...item, status: 'Tidak Aktif' as const };
        }
      })
    }));
    const sem = state.semesters.find(item => item.id === id);
    logAction(state.currentUser.nama, state.currentUser.role, 'Ubah Semester Aktif', `Mengaktifkan semester: ${sem?.nama}`);
  };

  const deleteSemester = (id: string) => {
    const sem = state.semesters.find(item => item.id === id);
    setState(prev => ({
      ...prev,
      semesters: prev.semesters.filter(item => item.id !== id)
    }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Hapus Semester', `Menghapus semester: ${sem?.nama}`);
  };

  // ---------------- TAHUN AJARAN OPERATIONS ----------------
  const addTahunAjaran = (t: Omit<TahunAjaran, 'id'>) => {
    const newTA: TahunAjaran = { id: `ta-${Date.now()}`, ...t };
    setState(prev => ({ ...prev, tahunAjarans: [...prev.tahunAjarans, newTA] }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Tambah Tahun Ajaran', `Menambahkan tahun ajaran baru: ${newTA.tahun}`);
  };

  const toggleTahunAjaranStatus = (id: string) => {
    setState(prev => ({
      ...prev,
      tahunAjarans: prev.tahunAjarans.map(item => {
        if (item.id === id) {
          return { ...item, status: 'Aktif' as const };
        } else {
          return { ...item, status: 'Tidak Aktif' as const };
        }
      })
    }));
    const ta = state.tahunAjarans.find(item => item.id === id);
    logAction(state.currentUser.nama, state.currentUser.role, 'Ubah Tahun Ajaran Aktif', `Mengaktifkan tahun ajaran: ${ta?.tahun}`);
  };

  const deleteTahunAjaran = (id: string) => {
    const ta = state.tahunAjarans.find(item => item.id === id);
    setState(prev => ({
      ...prev,
      tahunAjarans: prev.tahunAjarans.filter(item => item.id !== id)
    }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Hapus Tahun Ajaran', `Menghapus tahun ajaran: ${ta?.tahun}`);
  };

  // ---------------- JADWAL CRUD ----------------
  const addJadwal = (j: Omit<Jadwal, 'id'>) => {
    const newJadwal: Jadwal = { id: `jadwal-${Date.now()}`, ...j };
    setState(prev => ({ ...prev, jadwals: [...prev.jadwals, newJadwal] }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Tambah Jadwal', 'Menambahkan jadwal pelajaran baru');
  };

  const updateJadwal = (id: string, j: Partial<Jadwal>) => {
    setState(prev => ({
      ...prev,
      jadwals: prev.jadwals.map(item => item.id === id ? { ...item, ...j } : item)
    }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Edit Jadwal', 'Mengubah rincian jadwal pelajaran');
  };

  const deleteJadwal = (id: string) => {
    setState(prev => ({
      ...prev,
      jadwals: prev.jadwals.filter(item => item.id !== id)
    }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Hapus Jadwal', 'Menghapus jadwal pelajaran');
  };

  // ---------------- PENGGUNA CRUD ----------------
  const addPengguna = (u: Omit<Pengguna, 'id'>) => {
    const newPengguna: Pengguna = { id: `u-${Date.now()}`, ...u };
    setState(prev => ({ ...prev, penggunas: [...prev.penggunas, newPengguna] }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Tambah Pengguna', `Menambahkan akun pengguna baru: ${newPengguna.username}`);
  };

  const updatePengguna = (id: string, u: Partial<Pengguna>) => {
    setState(prev => ({
      ...prev,
      penggunas: prev.penggunas.map(item => item.id === id ? { ...item, ...u } : item)
    }));
    const usr = state.penggunas.find(item => item.id === id);
    logAction(state.currentUser.nama, state.currentUser.role, 'Edit Pengguna', `Mengubah akun pengguna: ${usr?.username}`);
  };

  const deletePengguna = (id: string) => {
    const usr = state.penggunas.find(item => item.id === id);
    setState(prev => ({
      ...prev,
      penggunas: prev.penggunas.filter(item => item.id !== id)
    }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Hapus Pengguna', `Menghapus akun pengguna: ${usr?.username}`);
  };

  // ---------------- ABSENSI GURU ----------------
  const upsertAbsensiGuru = (guruId: string, tanggal: string, status: AbsensiGuru['status'], catatan: string) => {
    const now = new Date();
    const formattedTime = status === 'Hadir' || status === 'Terlambat' 
      ? now.toTimeString().slice(0, 5) 
      : '-';

    setState(prev => {
      const existingIdx = prev.absensiGurus.findIndex(a => a.guruId === guruId && a.tanggal === tanggal);
      let updatedList = [...prev.absensiGurus];
      
      if (existingIdx > -1) {
        updatedList[existingIdx] = {
          ...updatedList[existingIdx],
          status,
          waktuPresensi: formattedTime,
          catatan
        };
      } else {
        updatedList.push({
          id: `ab-g-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          guruId,
          tanggal,
          status,
          waktuPresensi: formattedTime,
          catatan
        });
      }

      return { ...prev, absensiGurus: updatedList };
    });

    const teacher = state.gurus.find(item => item.id === guruId);
    logAction(
      state.currentUser.nama, 
      state.currentUser.role, 
      'Presensi Guru', 
      `Melakukan absensi untuk Guru: ${teacher?.nama} (${status})`
    );
  };

  // ---------------- ABSENSI SISWA & WHATSAPP TRIGGER ----------------
  const upsertAbsensiSiswa = (siswaId: string, kelasId: string, tanggal: string, status: AbsensiSiswa['status'], catatan: string) => {
    const student = state.siswas.find(s => s.id === siswaId);
    const cls = state.kelas.find(c => c.id === kelasId);

    if (!student) return;

    let triggerWA = false;
    let waMessage = '';
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // If student status is Sakit, Izin, or Alpa, we trigger WhatsApp simulation
    if (status === 'Sakit' || status === 'Izin' || status === 'Alpa') {
      triggerWA = true;
      waMessage = `Assalamu'alaikum Wr. Wb.

Yth. Bapak/Ibu Orang Tua/Wali

Kami informasikan bahwa putra/putri Anda:

Nama: ${student.nama}
Kelas: ${cls?.nama || 'N/A'}

Pada tanggal: ${tanggal}

Status Kehadiran: ${status} (${catatan || 'Tanpa Keterangan'})

Mohon perhatian dan kerjasamanya.

Terima kasih.

Madrasah Tsanawiyah Agama Islam Mertapada.`;
    }

    setState(prev => {
      const existingIdx = prev.absensiSiswas.findIndex(a => a.siswaId === siswaId && a.tanggal === tanggal);
      let updatedAbsensi = [...prev.absensiSiswas];
      
      if (existingIdx > -1) {
        updatedAbsensi[existingIdx] = {
          ...updatedAbsensi[existingIdx],
          status,
          catatan,
          waSentStatus: triggerWA ? true : updatedAbsensi[existingIdx].waSentStatus
        };
      } else {
        updatedAbsensi.push({
          id: `ab-s-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          siswaId,
          kelasId,
          tanggal,
          status,
          catatan,
          waSentStatus: triggerWA
        });
      }

      let updatedWANotifications = [...prev.waNotifications];
      if (triggerWA) {
        const newWANotif: WANotification = {
          id: `wa-${Date.now()}`,
          waktu: nowStr,
          teleponOrangTua: student.teleponOrangTua,
          namaOrangTua: student.namaOrangTua,
          siswaNama: student.nama,
          status: 'Terkirim',
          pesan: waMessage
        };
        updatedWANotifications = [newWANotif, ...updatedWANotifications];
      }

      return {
        ...prev,
        absensiSiswas: updatedAbsensi,
        waNotifications: updatedWANotifications
      };
    });

    logAction(
      state.currentUser.nama,
      state.currentUser.role,
      'Presensi Siswa',
      `Mencatat absensi siswa: ${student.nama} (${status})`
    );

    if (triggerWA) {
      logAction(
        'Sistem WhatsApp',
        'System',
        'Kirim Notifikasi WA',
        `Berhasil mengirim WhatsApp ke Wali dari ${student.nama} (${status})`
      );
    }
  };

  // ---------------- NILAI CRUD ----------------
  const addNilai = (n: Omit<Nilai, 'id' | 'nilaiAkhir' | 'predikat' | 'deskripsi'>) => {
    const { nilaiAkhir, predikat, deskripsi } = calculateGradeDetails(n.tugas, n.uh, n.uts, n.uas);
    const newNilai: Nilai = {
      id: `n-${Date.now()}`,
      ...n,
      nilaiAkhir,
      predikat,
      deskripsi
    };

    setState(prev => ({ ...prev, nilais: [...prev.nilais, newNilai] }));
    const stud = state.siswas.find(s => s.id === n.siswaId);
    const map = state.mapels.find(m => m.id === n.mapelId);
    logAction(state.currentUser.nama, state.currentUser.role, 'Tambah Nilai', `Menginput nilai ${map?.nama} untuk siswa ${stud?.nama}: Nilai Akhir ${nilaiAkhir}`);
  };

  const updateNilai = (id: string, n: Partial<Nilai>) => {
    setState(prev => ({
      ...prev,
      nilais: prev.nilais.map(item => {
        if (item.id === id) {
          const merged = { ...item, ...n };
          const { nilaiAkhir, predikat, deskripsi } = calculateGradeDetails(merged.tugas, merged.uh, merged.uts, merged.uas);
          return {
            ...merged,
            nilaiAkhir,
            predikat,
            deskripsi
          };
        }
        return item;
      })
    }));
    const scoreObj = state.nilais.find(item => item.id === id);
    const stud = state.siswas.find(s => s.id === scoreObj?.siswaId);
    logAction(state.currentUser.nama, state.currentUser.role, 'Edit Nilai', `Mengubah nilai untuk siswa: ${stud?.nama}`);
  };

  const deleteNilai = (id: string) => {
    const scoreObj = state.nilais.find(item => item.id === id);
    const stud = state.siswas.find(s => s.id === scoreObj?.siswaId);
    setState(prev => ({
      ...prev,
      nilais: prev.nilais.filter(item => item.id !== id)
    }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Hapus Nilai', `Menghapus nilai siswa: ${stud?.nama}`);
  };

  // ---------------- IZIN CRUD ----------------
  const addIzin = (i: Omit<Izin, 'id' | 'statusPersetujuan'>) => {
    const newIzin: Izin = {
      id: `iz-${Date.now()}`,
      ...i,
      statusPersetujuan: 'Pending'
    };
    setState(prev => ({ ...prev, izins: [...prev.izins, newIzin] }));
    
    let targetName = '';
    if (i.tipe === 'Guru') {
      targetName = state.gurus.find(g => g.id === i.targetId)?.nama || '';
    } else {
      targetName = state.siswas.find(s => s.id === i.targetId)?.nama || '';
    }
    
    logAction(state.currentUser.nama, state.currentUser.role, 'Pengajuan Izin', `Mengajukan izin baru untuk ${i.tipe}: ${targetName}`);
  };

  const approveIzin = (id: string, approved: 'Disetujui' | 'Ditolak') => {
    setState(prev => ({
      ...prev,
      izins: prev.izins.map(item => item.id === id ? { ...item, statusPersetujuan: approved } : item)
    }));
    
    const permission = state.izins.find(item => item.id === id);
    let targetName = '';
    if (permission?.tipe === 'Guru') {
      targetName = state.gurus.find(g => g.id === permission.targetId)?.nama || '';
    } else {
      targetName = state.siswas.find(s => s.id === permission?.targetId)?.nama || '';
    }
    
    logAction(
      state.currentUser.nama,
      state.currentUser.role,
      'Persetujuan Izin',
      `Mengubah status izin ${permission?.tipe} (${targetName}) menjadi: ${approved}`
    );

    // If it is a student and approved, also synchronise/auto-add corresponding student attendance record!
    if (approved === 'Disetujui' && permission?.tipe === 'Siswa') {
      const student = state.siswas.find(s => s.id === permission.targetId);
      if (student) {
        // Simple helper call, using current state variables
        upsertAbsensiSiswa(student.id, student.kelasId, permission.tanggal, 'Izin', permission.alasan);
      }
    } else if (approved === 'Disetujui' && permission?.tipe === 'Guru') {
      const teacher = state.gurus.find(g => g.id === permission.targetId);
      if (teacher) {
        upsertAbsensiGuru(teacher.id, permission.tanggal, 'Izin', permission.alasan);
      }
    }
  };

  // ---------------- PELANGGARAN CRUD ----------------
  const addPelanggaran = (p: Omit<Pelanggaran, 'id'>) => {
    const newPelanggaran: Pelanggaran = { id: `pel-${Date.now()}`, ...p };
    setState(prev => ({ ...prev, pelanggarans: [...prev.pelanggarans, newPelanggaran] }));
    const stud = state.siswas.find(s => s.id === p.siswaId);
    logAction(state.currentUser.nama, state.currentUser.role, 'Input Pelanggaran', `Mencatat pelanggaran siswa ${stud?.nama}: ${p.jenisPelanggaran} (Poin: ${p.poin})`);
  };

  const updatePelanggaran = (id: string, p: Partial<Pelanggaran>) => {
    setState(prev => ({
      ...prev,
      pelanggarans: prev.pelanggarans.map(item => item.id === id ? { ...item, ...p } : item)
    }));
    const pel = state.pelanggarans.find(item => item.id === id);
    const stud = state.siswas.find(s => s.id === pel?.siswaId);
    logAction(state.currentUser.nama, state.currentUser.role, 'Edit Pelanggaran', `Mengubah data pelanggaran siswa: ${stud?.nama}`);
  };

  const deletePelanggaran = (id: string) => {
    const pel = state.pelanggarans.find(item => item.id === id);
    const stud = state.siswas.find(s => s.id === pel?.siswaId);
    setState(prev => ({
      ...prev,
      pelanggarans: prev.pelanggarans.filter(item => item.id !== id)
    }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Hapus Pelanggaran', `Menghapus catatan pelanggaran siswa: ${stud?.nama}`);
  };

  // ---------------- PENGUMUMAN CRUD ----------------
  const addPengumuman = (p: Omit<Pengumuman, 'id'>) => {
    const newAnn: Pengumuman = { id: `ann-${Date.now()}`, ...p };
    setState(prev => ({ ...prev, pengumumans: [...prev.pengumumans, newAnn] }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Tambah Pengumuman', `Memposting pengumuman baru: ${newAnn.judul}`);
  };

  const updatePengumuman = (id: string, p: Partial<Pengumuman>) => {
    setState(prev => ({
      ...prev,
      pengumumans: prev.pengumumans.map(item => item.id === id ? { ...item, ...p } : item)
    }));
    const ann = state.pengumumans.find(item => item.id === id);
    logAction(state.currentUser.nama, state.currentUser.role, 'Edit Pengumuman', `Mengubah pengumuman: ${ann?.judul}`);
  };

  const deletePengumuman = (id: string) => {
    const ann = state.pengumumans.find(item => item.id === id);
    setState(prev => ({
      ...prev,
      pengumumans: prev.pengumumans.filter(item => item.id !== id)
    }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Hapus Pengumuman', `Menghapus pengumuman: ${ann?.judul}`);
  };

  // ---------------- DATABASE BACKUP / RESTORE ----------------
  const backupDatabase = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup_sipmt_mts_mertapada_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
    logAction(state.currentUser.nama, state.currentUser.role, 'Backup Database', 'Melakukan ekspor backup database utuh ke file JSON.');
  };

  const restoreDatabase = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      // Simple validation of parsed keys
      if (parsed.gurus && parsed.siswas && parsed.kelas && parsed.mapels) {
        setState(parsed);
        logAction(parsed.currentUser?.nama || 'System', parsed.currentUser?.role || 'Admin', 'Restore Database', 'Berhasil memulihkan database utuh dari file JSON.');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to restore database', e);
      return false;
    }
  };

  const resetDatabase = () => {
    setState({
      gurus: seed.initialGuru,
      siswas: seed.initialSiswa,
      kelas: seed.initialKelas,
      mapels: seed.initialMataPelajaran,
      semesters: seed.initialSemester,
      tahunAjarans: seed.initialTahunAjaran,
      jadwals: seed.initialJadwal,
      penggunas: seed.initialPengguna,
      absensiGurus: seed.initialAbsensiGuru,
      absensiSiswas: seed.initialAbsensiSiswa,
      nilais: seed.initialNilai,
      izins: seed.initialIzin,
      pelanggarans: seed.initialPelanggaran,
      pengumumans: seed.initialPengumuman,
      logs: seed.initialLogAktivitas,
      waNotifications: seed.initialWANotifications,
      currentUser: seed.initialPengguna[0]
    });
    logAction('System', 'Admin', 'Reset Database', 'Mengembalikan database ke konfigurasi awal (seed data).');
  };

  const login = (usernameInput: string, passwordInput?: string): boolean => {
    const user = state.penggunas.find(u => u.username.toLowerCase() === usernameInput.toLowerCase());
    if (user) {
      const authenticatedUser = { ...user, isAuthenticated: true };
      setState(prev => ({ ...prev, currentUser: authenticatedUser }));
      logAction(user.nama, user.role, 'Login Pengguna', `${user.nama} berhasil masuk ke sistem.`);
      return true;
    }
    return false;
  };

  const logout = () => {
    const loggedOutUser = { ...seed.initialPengguna[0], isAuthenticated: false };
    setState(prev => ({ ...prev, currentUser: loggedOutUser }));
    logAction(state.currentUser.nama, state.currentUser.role, 'Logout Pengguna', `${state.currentUser.nama} keluar dari sistem.`);
  };

  return (
    <AppContext.Provider value={{
      state,
      setCurrentUser,
      logAction,
      addGuru,
      updateGuru,
      deleteGuru,
      addSiswa,
      updateSiswa,
      deleteSiswa,
      addKelas,
      updateKelas,
      deleteKelas,
      addMapel,
      updateMapel,
      deleteMapel,
      addSemester,
      toggleSemesterStatus,
      deleteSemester,
      addTahunAjaran,
      toggleTahunAjaranStatus,
      deleteTahunAjaran,
      addJadwal,
      updateJadwal,
      deleteJadwal,
      addPengguna,
      updatePengguna,
      deletePengguna,
      upsertAbsensiGuru,
      upsertAbsensiSiswa,
      addNilai,
      updateNilai,
      deleteNilai,
      addIzin,
      approveIzin,
      addPelanggaran,
      updatePelanggaran,
      deletePelanggaran,
      addPengumuman,
      updatePengumuman,
      deletePengumuman,
      backupDatabase,
      restoreDatabase,
      resetDatabase,
      login,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
