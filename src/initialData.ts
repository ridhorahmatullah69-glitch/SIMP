/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  WANotification
} from './types';

export const initialGuru: Guru[] = [
  {
    id: 'guru-kepala',
    nip: '197508122002121003',
    nama: 'KH. Ahmad Syauqi, S.Ag., M.Pd.I',
    jenisKelamin: 'Laki-laki',
    email: 'ahmadsyauqi@mts-mertapada.sch.id',
    telepon: '081234567890',
    statusKepegawaian: 'PNS',
    mapelUtama: 'Quran Hadits'
  },
  {
    id: 'guru-amin',
    nip: '198104052008011005',
    nama: 'Drs. H. Aminuddin',
    jenisKelamin: 'Laki-laki',
    email: 'aminuddin@mts-mertapada.sch.id',
    telepon: '085298765432',
    statusKepegawaian: 'PNS',
    mapelUtama: 'Akidah Akhlak'
  },
  {
    id: 'guru-masitoh',
    nip: '198811222015042001',
    nama: 'Hj. Siti Masitoh, S.Pd.',
    jenisKelamin: 'Perempuan',
    email: 'sitimasitoh@mts-mertapada.sch.id',
    telepon: '081399887766',
    statusKepegawaian: 'GTT',
    mapelUtama: 'Bahasa Arab'
  },
  {
    id: 'guru-ridho',
    nip: '199203152020121008',
    nama: 'Muhammad Ridho, S.Si.',
    jenisKelamin: 'Laki-laki',
    email: 'ridhomuhammad@mts-mertapada.sch.id',
    telepon: '082155667788',
    statusKepegawaian: 'Honorer',
    mapelUtama: 'IPA Terpadu'
  },
  {
    id: 'guru-halim',
    nip: '198506302010011004',
    nama: 'Ustadz Abdul Halim, S.Sy.',
    jenisKelamin: 'Laki-laki',
    email: 'abdulhalim@mts-mertapada.sch.id',
    telepon: '087711223344',
    statusKepegawaian: 'PNS',
    mapelUtama: 'Fiqih'
  }
];

export const initialKelas: Kelas[] = [
  { id: 'kelas-7a', nama: 'VII-A', waliKelasId: 'guru-amin', tingkat: 'VII' },
  { id: 'kelas-8a', nama: 'VIII-A', waliKelasId: 'guru-masitoh', tingkat: 'VIII' },
  { id: 'kelas-9a', nama: 'IX-A', waliKelasId: 'guru-ridho', tingkat: 'IX' }
];

export const initialSiswa: Siswa[] = [
  // Kelas VII-A
  {
    id: 'siswa-fauzi',
    nis: '240101',
    nisn: '0123456781',
    nama: 'Ahmad Fauzi Al-Ghazali',
    kelasId: 'kelas-7a',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '2013-05-14',
    alamat: 'Mertapada Kulon, Cirebon',
    namaOrangTua: 'H. Suherman',
    teleponOrangTua: '081234123412'
  },
  {
    id: 'siswa-budi',
    nis: '240102',
    nisn: '0123456782',
    nama: 'Budi Santoso',
    kelasId: 'kelas-7a',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '2013-08-22',
    alamat: 'Mertapada Wetan, Cirebon',
    namaOrangTua: 'Suparno',
    teleponOrangTua: '085712345678'
  },
  {
    id: 'siswa-citra',
    nis: '240103',
    nisn: '0123456783',
    nama: 'Citra Kirana Azzahra',
    kelasId: 'kelas-7a',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2013-11-03',
    alamat: 'Astana Japura, Cirebon',
    namaOrangTua: 'Rudi Hermawan',
    teleponOrangTua: '089988887777'
  },
  // Kelas VIII-A
  {
    id: 'siswa-dwi',
    nis: '230101',
    nisn: '0113456781',
    nama: 'Dwi Cahyo Prasetyo',
    kelasId: 'kelas-8a',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '2012-04-12',
    alamat: 'Lemahabang, Cirebon',
    namaOrangTua: 'Sutrisno',
    teleponOrangTua: '082233445566'
  },
  {
    id: 'siswa-elga',
    nis: '230102',
    nisn: '0113456782',
    nama: 'Elga Pratama Kusuma',
    kelasId: 'kelas-8a',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '2012-09-19',
    alamat: 'Sindanglaut, Cirebon',
    namaOrangTua: 'Bambang Kusuma',
    teleponOrangTua: '081122334455'
  },
  {
    id: 'siswa-fatimah',
    nis: '230103',
    nisn: '0113456783',
    nama: 'Fatimah Azzahra Siregar',
    kelasId: 'kelas-8a',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2012-12-01',
    alamat: 'Mertapada Kulon, Cirebon',
    namaOrangTua: 'Irwan Siregar',
    teleponOrangTua: '081344556677'
  },
  // Kelas IX-A
  {
    id: 'siswa-gibran',
    nis: '220101',
    nisn: '0103456781',
    nama: 'Gibran Rakabuming Sanjaya',
    kelasId: 'kelas-9a',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '2011-02-15',
    alamat: 'Karangsembung, Cirebon',
    namaOrangTua: 'H. Joko Widodo',
    teleponOrangTua: '088899990000'
  },
  {
    id: 'siswa-hana',
    nis: '220102',
    nisn: '0103456782',
    nama: 'Hana Salsabila',
    kelasId: 'kelas-9a',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2011-06-30',
    alamat: 'Susukan Lebak, Cirebon',
    namaOrangTua: 'Akhmad Fauzi',
    teleponOrangTua: '081277665544'
  }
];

export const initialMataPelajaran: MataPelajaran[] = [
  { id: 'mapel-quran', kode: 'QRH', nama: 'Quran Hadits', kkm: 75 },
  { id: 'mapel-akidah', kode: 'AKD', nama: 'Akidah Akhlak', kkm: 75 },
  { id: 'mapel-fiqih', kode: 'FIQ', nama: 'Fiqih', kkm: 75 },
  { id: 'mapel-arab', kode: 'ARB', nama: 'Bahasa Arab', kkm: 70 },
  { id: 'mapel-ipa', kode: 'IPA', nama: 'IPA Terpadu', kkm: 70 },
  { id: 'mapel-indonesia', kode: 'IND', nama: 'Bahasa Indonesia', kkm: 72 },
  { id: 'mapel-matematika', kode: 'MAT', nama: 'Matematika', kkm: 68 }
];

export const initialSemester: Semester[] = [
  { id: 'sem-ganjil', nama: 'Ganjil', status: 'Tidak Aktif' },
  { id: 'sem-genap', nama: 'Genap', status: 'Aktif' }
];

export const initialTahunAjaran: TahunAjaran[] = [
  { id: 'ta-2024-2025', tahun: '2024/2025', status: 'Tidak Aktif' },
  { id: 'ta-2025-2026', tahun: '2025/2026', status: 'Aktif' }
];

export const initialJadwal: Jadwal[] = [
  // VII-A Schedules
  { id: 'jadwal-1', kelasId: 'kelas-7a', mapelId: 'mapel-akidah', guruId: 'guru-amin', hari: 'Senin', jamMulai: '07:30', jamSelesai: '09:00' },
  { id: 'jadwal-2', kelasId: 'kelas-7a', mapelId: 'mapel-fiqih', guruId: 'guru-halim', hari: 'Senin', jamMulai: '09:15', jamSelesai: '10:45' },
  { id: 'jadwal-3', kelasId: 'kelas-7a', mapelId: 'mapel-matematika', guruId: 'guru-ridho', hari: 'Selasa', jamMulai: '07:30', jamSelesai: '09:00' },
  { id: 'jadwal-4', kelasId: 'kelas-7a', mapelId: 'mapel-quran', guruId: 'guru-kepala', hari: 'Rabu', jamMulai: '07:30', jamSelesai: '09:00' },
  
  // VIII-A Schedules
  { id: 'jadwal-5', kelasId: 'kelas-8a', mapelId: 'mapel-arab', guruId: 'guru-masitoh', hari: 'Senin', jamMulai: '07:30', jamSelesai: '09:00' },
  { id: 'jadwal-6', kelasId: 'kelas-8a', mapelId: 'mapel-ipa', guruId: 'guru-ridho', hari: 'Rabu', jamMulai: '09:15', jamSelesai: '10:45' },
  
  // IX-A Schedules
  { id: 'jadwal-7', kelasId: 'kelas-9a', mapelId: 'mapel-ipa', guruId: 'guru-ridho', hari: 'Senin', jamMulai: '11:00', jamSelesai: '12:30' },
  { id: 'jadwal-8', kelasId: 'kelas-9a', mapelId: 'mapel-fiqih', guruId: 'guru-halim', hari: 'Kamis', jamMulai: '07:30', jamSelesai: '09:00' }
];

export const initialPengguna: Pengguna[] = [
  { id: 'u-admin', username: 'admin', nama: 'Administrator SIPMT', role: 'Administrator' },
  { id: 'u-ridho', username: 'guru.ridho', nama: 'Muhammad Ridho, S.Si.', role: 'Guru', targetId: 'guru-ridho' },
  { id: 'u-amin', username: 'wali.amin', nama: 'Drs. H. Aminuddin', role: 'Wali Kelas', targetId: 'guru-amin' },
  { id: 'u-kepala', username: 'kepala.syauqi', nama: 'KH. Ahmad Syauqi, S.Ag., M.Pd.I', role: 'Kepala Madrasah', targetId: 'guru-kepala' },
  { id: 'u-ortu-fauzi', username: 'ortu.fauzi', nama: 'H. Suherman (Wali Fauzi)', role: 'Orang Tua', targetId: 'siswa-fauzi' },
  { id: 'u-siswa-fauzi', username: 'siswa.fauzi', nama: 'Ahmad Fauzi Al-Ghazali', role: 'Siswa', targetId: 'siswa-fauzi' }
];

// Seed Attendance (Absensi Guru) - let's set current date as 2026-06-30 (referring to current local time in prompt metadata)
export const initialAbsensiGuru: AbsensiGuru[] = [
  { id: 'ab-g-1', guruId: 'guru-kepala', tanggal: '2026-06-30', status: 'Hadir', waktuPresensi: '07:05', catatan: 'Membuka Kegiatan KBM Pagi' },
  { id: 'ab-g-2', guruId: 'guru-amin', tanggal: '2026-06-30', status: 'Hadir', waktuPresensi: '07:15', catatan: 'Tepat Waktu' },
  { id: 'ab-g-3', guruId: 'guru-masitoh', tanggal: '2026-06-30', status: 'Terlambat', waktuPresensi: '07:45', catatan: 'Terjebak macet di perlintasan kereta' },
  { id: 'ab-g-4', guruId: 'guru-ridho', tanggal: '2026-06-30', status: 'Hadir', waktuPresensi: '07:20', catatan: 'Hadir mengajar IPA' },
  { id: 'ab-g-5', guruId: 'guru-halim', tanggal: '2026-06-30', status: 'Izin', waktuPresensi: '-', catatan: 'Menghadiri Bahtsul Masail PCNU' }
];

// Seed Student Attendance for 2026-06-30 (Mertapada)
export const initialAbsensiSiswa: AbsensiSiswa[] = [
  // VII-A
  { id: 'ab-s-1', siswaId: 'siswa-fauzi', kelasId: 'kelas-7a', tanggal: '2026-06-30', status: 'Hadir', catatan: 'Mengikuti KBM dengan aktif' },
  { id: 'ab-s-2', siswaId: 'siswa-budi', kelasId: 'kelas-7a', tanggal: '2026-06-30', status: 'Sakit', catatan: 'Demam tinggi, surat dokter terlampir', waSentStatus: true },
  { id: 'ab-s-3', siswaId: 'siswa-citra', kelasId: 'kelas-7a', tanggal: '2026-06-30', status: 'Hadir', catatan: 'Sangat baik' },
  
  // VIII-A
  { id: 'ab-s-4', siswaId: 'siswa-dwi', kelasId: 'kelas-8a', tanggal: '2026-06-30', status: 'Hadir', catatan: 'Hadir' },
  { id: 'ab-s-5', siswaId: 'siswa-elga', kelasId: 'kelas-8a', tanggal: '2026-06-30', status: 'Alpa', catatan: 'Tanpa keterangan dari pagi', waSentStatus: true },
  { id: 'ab-s-6', siswaId: 'siswa-fatimah', kelasId: 'kelas-8a', tanggal: '2026-06-30', status: 'Hadir', catatan: 'Hadir' },

  // IX-A
  { id: 'ab-s-7', siswaId: 'siswa-gibran', kelasId: 'kelas-9a', tanggal: '2026-06-30', status: 'Hadir', catatan: 'Hadir' },
  { id: 'ab-s-8', siswaId: 'siswa-hana', kelasId: 'kelas-9a', tanggal: '2026-06-30', status: 'Izin', catatan: 'Acara keluarga pernikahan kakak', waSentStatus: true }
];

// Student Grades
export const initialNilai: Nilai[] = [
  {
    id: 'n-1',
    siswaId: 'siswa-fauzi',
    kelasId: 'kelas-7a',
    mapelId: 'mapel-quran',
    semesterId: 'sem-genap',
    tugas: 88,
    uh: 85,
    uts: 90,
    uas: 92,
    nilaiAkhir: 89.2,
    predikat: 'A',
    deskripsi: 'Sangat menguasai hafalan Surat-surat pendek dan kaidah tajwid mad jaiz.'
  },
  {
    id: 'n-2',
    siswaId: 'siswa-fauzi',
    kelasId: 'kelas-7a',
    mapelId: 'mapel-akidah',
    semesterId: 'sem-genap',
    tugas: 80,
    uh: 78,
    uts: 85,
    uas: 82,
    nilaiAkhir: 81.7,
    predikat: 'B',
    deskripsi: 'Menunjukkan pemahaman baik pada akhlak terpuji tasamuh dan taawun.'
  },
  {
    id: 'n-3',
    siswaId: 'siswa-budi',
    kelasId: 'kelas-7a',
    mapelId: 'mapel-quran',
    semesterId: 'sem-genap',
    tugas: 74,
    uh: 70,
    uts: 72,
    uas: 76,
    nilaiAkhir: 73.2,
    predikat: 'C',
    deskripsi: 'Cukup lancar dalam membaca Al-Quran, perlu peningkatan di kelancaran tajwid makhraj.'
  },
  {
    id: 'n-4',
    siswaId: 'siswa-citra',
    kelasId: 'kelas-7a',
    mapelId: 'mapel-quran',
    semesterId: 'sem-genap',
    tugas: 95,
    uh: 92,
    uts: 94,
    uas: 96,
    nilaiAkhir: 94.6,
    predikat: 'A',
    deskripsi: 'Sangat baik dalam hafalan, tartil, tajwid, dan mengaplikasikan hikmah ayat pilihan.'
  },
  // VIII-A
  {
    id: 'n-5',
    siswaId: 'siswa-fatimah',
    kelasId: 'kelas-8a',
    mapelId: 'mapel-arab',
    semesterId: 'sem-genap',
    tugas: 90,
    uh: 88,
    uts: 85,
    uas: 89,
    nilaiAkhir: 87.8,
    predikat: 'A',
    deskripsi: 'Sangat baik dalam percakapan (hiwar) bertema fil-madrasah dan memahami qawaid dasar.'
  }
];

// Student Permission Slips (Izin)
export const initialIzin: Izin[] = [
  {
    id: 'iz-1',
    tipe: 'Guru',
    targetId: 'guru-halim',
    tanggal: '2026-06-30',
    alasan: 'Menghadiri Bahtsul Masail PCNU di Pondok Pesantren Babakan Ciwaringin.',
    lampiran: 'surat_tugas_pcnu.pdf',
    statusPersetujuan: 'Disetujui'
  },
  {
    id: 'iz-2',
    tipe: 'Siswa',
    targetId: 'siswa-hana',
    tanggal: '2026-06-30',
    alasan: 'Acara keluarga, mendampingi pernikahan kakak kandung luar kota.',
    lampiran: 'surat_izin_orang_tua.jpg',
    statusPersetujuan: 'Disetujui'
  },
  {
    id: 'iz-3',
    tipe: 'Siswa',
    targetId: 'siswa-budi',
    tanggal: '2026-06-30',
    alasan: 'Sakit demam, mohon izin beristirahat di rumah.',
    lampiran: 'surat_dokter_budi.jpg',
    statusPersetujuan: 'Disetujui'
  }
];

// Student Violations (Pelanggaran)
export const initialPelanggaran: Pelanggaran[] = [
  {
    id: 'pel-1',
    siswaId: 'siswa-budi',
    jenisPelanggaran: 'Terlambat Masuk Madrasah',
    poin: 5,
    tanggal: '2026-06-25',
    catatan: 'Terlambat 20 menit tanpa alasan yang sah.'
  },
  {
    id: 'pel-2',
    siswaId: 'siswa-elga',
    jenisPelanggaran: 'Tidak memakai atribut lengkap (Kopiah/Peci)',
    poin: 10,
    tanggal: '2026-06-29',
    catatan: 'Ditemukan oleh guru piket saat upacara pagi.'
  }
];

// Announcements (Pengumuman)
export const initialPengumuman: Pengumuman[] = [
  {
    id: 'ann-1',
    judul: 'Persiapan Penilaian Akhir Semester (PAS) Genap',
    isi: 'Diberitahukan kepada seluruh guru dan siswa MTs Agama Islam Mertapada bahwa PAS Genap akan diselenggarakan mulai tanggal 15 Juli 2026. Harap mempersiapkan kelengkapan kisi-kisi soal dan administrasi.',
    tanggal: '2026-06-28',
    lampiran: 'jadwal_pas_genap.pdf',
    target: 'Semua'
  },
  {
    id: 'ann-2',
    judul: 'Rapat Koordinasi Evaluasi Kehadiran Guru',
    isi: 'Undangan rapat dinas guru untuk mengevaluasi ketertiban mengajar dan menekan angka kelas kosong. Rapat dipimpin langsung oleh Kepala Madrasah di ruang guru pada hari Sabtu, 4 Juli 2026 pukul 13.00 WIB.',
    tanggal: '2026-06-29',
    target: 'Guru'
  },
  {
    id: 'ann-3',
    judul: 'Kerja Bakti Kebersihan Kelas VII-A',
    isi: 'Himbauan kepada seluruh siswa VII-A untuk membawa alat kebersihan (sapu, pel, dan kemoceng) guna persiapan akreditasi madrasah.',
    tanggal: '2026-06-29',
    target: 'Kelas',
    kelasId: 'kelas-7a'
  }
];

// Simulated WhatsApp Notification History
export const initialWANotifications: WANotification[] = [
  {
    id: 'wa-1',
    waktu: '2026-06-30 08:15',
    teleponOrangTua: '085712345678',
    namaOrangTua: 'Suparno',
    siswaNama: 'Budi Santoso',
    status: 'Terkirim',
    pesan: `Assalamu'alaikum Wr. Wb.

Yth. Bapak/Ibu Orang Tua/Wali

Kami informasikan bahwa putra/putri Anda:

Nama: Budi Santoso
Kelas: VII-A

Pada tanggal: 2026-06-30

Status Kehadiran: Sakit (Demam tinggi, surat dokter terlampir)

Mohon perhatian dan kerjasamanya.

Terima kasih.

Madrasah Tsanawiyah Agama Islam Mertapada.`
  },
  {
    id: 'wa-2',
    waktu: '2026-06-30 08:30',
    teleponOrangTua: '081122334455',
    namaOrangTua: 'Bambang Kusuma',
    siswaNama: 'Elga Pratama Kusuma',
    status: 'Terkirim',
    pesan: `Assalamu'alaikum Wr. Wb.

Yth. Bapak/Ibu Orang Tua/Wali

Kami informasikan bahwa putra/putri Anda:

Nama: Elga Pratama Kusuma
Kelas: VIII-A

Pada tanggal: 2026-06-30

Status Kehadiran: Alpa (Tanpa keterangan dari pagi)

Mohon perhatian dan kerjasamanya.

Terima kasih.

Madrasah Tsanawiyah Agama Islam Mertapada.`
  },
  {
    id: 'wa-3',
    waktu: '2026-06-30 08:45',
    teleponOrangTua: '081277665544',
    namaOrangTua: 'Akhmad Fauzi',
    siswaNama: 'Hana Salsabila',
    status: 'Terkirim',
    pesan: `Assalamu'alaikum Wr. Wb.

Yth. Bapak/Ibu Orang Tua/Wali

Kami informasikan bahwa putra/putri Anda:

Nama: Hana Salsabila
Kelas: IX-A

Pada tanggal: 2026-06-30

Status Kehadiran: Izin (Acara keluarga pernikahan kakak)

Mohon perhatian dan kerjasamanya.

Terima kasih.

Madrasah Tsanawiyah Agama Islam Mertapada.`
  }
];

// Activity Logs
export const initialLogAktivitas: LogAktivitas[] = [
  {
    id: 'log-1',
    waktu: '2026-06-30 07:15:22',
    pengguna: 'admin',
    role: 'Administrator',
    aktivitas: 'Login Pengguna',
    rincian: 'Admin masuk ke sistem utama SIPMT.'
  },
  {
    id: 'log-2',
    waktu: '2026-06-30 08:05:10',
    pengguna: 'Drs. H. Aminuddin',
    role: 'Guru',
    aktivitas: 'Input Absensi Siswa',
    rincian: 'Melakukan presensi kelas VII-A. 2 Hadir, 1 Sakit.'
  },
  {
    id: 'log-3',
    waktu: '2026-06-30 08:05:11',
    pengguna: 'Sistem WhatsApp',
    role: 'System',
    aktivitas: 'Kirim Notifikasi WA',
    rincian: 'Mengirim notifikasi otomatis ke Wali murid Budi Santoso (Sakit).'
  },
  {
    id: 'log-4',
    waktu: '2026-06-30 08:30:15',
    pengguna: 'Hj. Siti Masitoh, S.Pd.',
    role: 'Guru',
    aktivitas: 'Input Absensi Siswa',
    rincian: 'Melakukan presensi kelas VIII-A. 2 Hadir, 1 Alpa.'
  },
  {
    id: 'log-5',
    waktu: '2026-06-30 08:30:16',
    pengguna: 'Sistem WhatsApp',
    role: 'System',
    aktivitas: 'Kirim Notifikasi WA',
    rincian: 'Mengirim notifikasi otomatis ke Wali murid Elga Pratama Kusuma (Alpa).'
  }
];
