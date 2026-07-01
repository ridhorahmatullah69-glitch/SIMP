/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Administrator' | 'Guru' | 'Wali Kelas' | 'Kepala Madrasah' | 'Orang Tua' | 'Siswa';

export interface Pengguna {
  id: string;
  username: string;
  nama: string;
  role: UserRole;
  password?: string;
  targetId?: string; // Menyambung ke Guru ID, Siswa ID, atau Wali Kelas ID
}

export interface Guru {
  id: string;
  nip: string;
  nama: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  email: string;
  telepon: string;
  statusKepegawaian: 'PNS' | 'GTT' | 'Honorer';
  mapelUtama: string;
}

export interface Siswa {
  id: string;
  nis: string;
  nisn: string;
  nama: string;
  kelasId: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  tanggalLahir: string;
  alamat: string;
  namaOrangTua: string;
  teleponOrangTua: string;
}

export interface Kelas {
  id: string;
  nama: string; // Contoh: VII-A, VIII-B, IX-C
  waliKelasId: string; // ID Guru
  tingkat: 'VII' | 'VIII' | 'IX';
}

export interface MataPelajaran {
  id: string;
  kode: string;
  nama: string;
  kkm: number;
}

export interface Semester {
  id: string;
  nama: 'Ganjil' | 'Genap';
  status: 'Aktif' | 'Tidak Aktif';
}

export interface TahunAjaran {
  id: string;
  tahun: string; // Contoh: 2025/2026
  status: 'Aktif' | 'Tidak Aktif';
}

export interface Jadwal {
  id: string;
  kelasId: string;
  mapelId: string;
  guruId: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamMulai: string; // Contoh: "07:30"
  jamSelesai: string; // Contoh: "09:00"
}

export interface AbsensiGuru {
  id: string;
  guruId: string;
  tanggal: string; // YYYY-MM-DD
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa' | 'Terlambat';
  waktuPresensi: string; // HH:MM atau "-"
  catatan: string;
}

export interface AbsensiSiswa {
  id: string;
  siswaId: string;
  kelasId: string;
  tanggal: string; // YYYY-MM-DD
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  catatan: string;
  waSentStatus?: boolean; // Apakah simulasi WA sudah terkirim ke ortu
}

export interface Nilai {
  id: string;
  siswaId: string;
  kelasId: string;
  mapelId: string;
  semesterId: string;
  tugas: number;
  uh: number; // Ulangan Harian
  uts: number;
  uas: number;
  nilaiAkhir: number;
  predikat: 'A' | 'B' | 'C' | 'D';
  deskripsi: string;
}

export interface Izin {
  id: string;
  tipe: 'Guru' | 'Siswa';
  targetId: string; // Guru ID atau Siswa ID
  tanggal: string;
  alasan: string;
  lampiran: string; // Nama File Simulasi atau URL
  statusPersetujuan: 'Pending' | 'Disetujui' | 'Ditolak';
}

export interface Pelanggaran {
  id: string;
  siswaId: string;
  jenisPelanggaran: string;
  poin: number;
  tanggal: string;
  catatan: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
  lampiran?: string;
  target: 'Semua' | 'Guru' | 'Kelas';
  kelasId?: string; // Jika target adalah Kelas tertentu
}

export interface LogAktivitas {
  id: string;
  waktu: string; // YYYY-MM-DD HH:MM:SS
  pengguna: string; // Username atau Nama
  role: string;
  aktivitas: string;
  rincian: string;
}

export interface WANotification {
  id: string;
  waktu: string;
  teleponOrangTua: string;
  namaOrangTua: string;
  pesan: string;
  status: 'Terkirim' | 'Gagal';
  siswaNama: string;
}
