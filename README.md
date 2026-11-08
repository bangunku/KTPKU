# KTP Search & Data Management (React + TypeScript)

Aplikasi web modern, modular, dan responsif untuk pencarian, verifikasi lapangan, visualisasi silsilah keluarga (Family Tree Graph), analisis astrologi/zodiak, serta validasi data KTP (Kartu Tanda Penduduk) dan KK (Kartu Keluarga) di Indonesia.

---

## 🌟 Fitur Utama

### 1. Manajemen & Pemrosesan Data KTP / KK
- **Upload & Export CSV (RFC 4180)**: Mendukung file CSV kependudukan dengan kutip ganda, koma di dalam alamat, dan penanganan baris kosong.
- **Penyimpanan Lokal & Backup JSON**: Fitur *Save Storage*, *Load Storage*, dan *Delete Storage* untuk menyimpan dan memulihkan data CSV beserta seluruh status verifikasi lapangan ke/dari file `.json`.
- **Data Contoh Otomatis**: Dilengkapi dataset contoh realistis 12 warga dalam 4 Kartu Keluarga (Bandung, Jakarta, Surabaya) yang langsung siap pakai.

### 2. Deteksi Zodiak Otomatis dari Tanggal Lahir (`getZodiacInfo`)
- Otomatis mengekstrak hari dan bulan dari kolom `TEMPAT/TGL LAHIR` (format `TEMPAT, DD-MM-YYYY`, `DD-MM-YYYY`, atau `YYYY-MM-DD`).
- Menghitung **12 Zodiak** lengkap dengan simbol astronomi, rentang tanggal, dan elemennya (*Api, Tanah, Udara, Air*):
  - ♈ **Aries** (21 Mar – 19 Apr) · Api
  - ♉ **Taurus** (20 Apr – 20 Mei) · Tanah
  - ♊ **Gemini** (21 Mei – 20 Jun) · Udara
  - ♋ **Cancer** (21 Jun – 22 Jul) · Air
  - ♌ **Leo** (23 Jul – 22 Agu) · Api
  - ♍ **Virgo** (23 Agu – 22 Sep) · Tanah
  - ♎ **Libra** (23 Sep – 22 Okt) · Udara
  - ♏ **Scorpio** (23 Okt – 21 Nov) · Air
  - ♐ **Sagittarius** (22 Nov – 21 Des) · Api
  - ♑ **Capricorn** (22 Des – 19 Jan) · Tanah
  - ♒ **Aquarius** (20 Jan – 18 Feb) · Udara
  - ♓ **Pisces** (19 Feb – 20 Mar) · Air
- Zodiak ditampilkan pada tabel desktop, kartu mobile, diagram hierarki keluarga, formulir penambahan data baru, serta tersedia dropdown **Filter Zodiak**.

### 3. Family Graph View (Diagram Silsilah Kartu Keluarga)
- Mengelompokkan seluruh anggota keluarga dalam 1 KK secara terstruktur:
  - **Root Hub KK**: Ringkasan nomor KK, alamat, jumlah pemilih, dan status pencocokan.
  - **Tingkat 1 (Orang Tua / Pasangan)**: Kepala Keluarga, Istri, atau Suami.
  - **Tingkat 2 (Anak & Keturunan)**: Anak, Menantu, atau Cucu.
  - **Tingkat 3 (Keluarga Besar)**: Anggota keluarga lainnya dalam KK.
- Dapat diakses melalui tombol **View Family** (modal dengan tab *Graph Keluarga* & *Daftar Detail*) atau beralih ke mode layar penuh **Graph Keluarga** pada toolbar.

### 4. Validasi Struktur NIK & Deteksi Duplikat
- **Validasi Struktur NIK 16 Digit**:
  - Mengecek panjang 16 digit angka.
  - Mengekstrak kode wilayah (Provinsi, Kabupaten/Kota, Kecamatan).
  - Mengekstrak tanggal lahir dan jenis kelamin secara otomatis (pada perempuan, nilai tanggal ditambah 40 sesuai standar Dukcapil Indonesia).
- **Deteksi NIK Ganda**: Muncul peringatan otomatis jika ada NIK duplikat di dalam data, lengkap dengan tombol pintas untuk langsung menyaring entri bermasalah.

### 5. Kelayakan Pemilih & Status Verifikasi Lapangan
- **Kalkulasi Usia Real-Time**: Otomatis menghitung umur saat ini dari tanggal lahir.
- **Status Pemilih (≥ 17 Tahun)**: Menentukan hak pilih pemilu (*Bisa Memilih* vs *Tidak Bisa Memilih*).
- **Checklist & Pencocokan Lapangan**:
  - Checklist per individu atau per seluruh hasil filter (*Check Hasil Filter* / *Uncheck All*).
  - Toggle Matching Status (*Sesuai* / *Tidak Sesuai*).
  - Status Perubahan Data (*Edited (Green)*, *Added (Blue)*, *Not Edited*).

### 6. Desain Responsif & Privasi Data
- **Mode Tampilan**:
  - **Otomatis**: Menampilkan tabel presisi pada desktop dan beralih ke kartu ramah sentuhan pada mobile (`< 768px`).
  - **Tabel**: Tampilan tabular berdensitas tinggi dengan tipografi angka tabular (`tabular-nums`).
  - **Kartu Mobile**: Kartu sentuh ergonomis dengan ukuran tombol minimal 44×44px.
  - **Graph Keluarga**: Visualisasi bagan pohon silsilah keluarga.
- **Sensor NIK & KK**: Tombol toggle untuk menyembunyikan (*masking* `327301******0001`) atau menampilkan NIK penuh.
- **Clipboard 1-Klik**: Klik NIK, No. KK, atau Alamat untuk menyalin ke clipboard tanpa pop-up yang mengganggu.

---

## 📁 Struktur Arsitektur Modular

```
/
├── index.html                   # HTML entry point dengan Google Fonts (Plus Jakarta Sans & JetBrains Mono)
├── package.json                 # Konfigurasi dependensi React 19, Tailwind CSS v4, Lucide Icons
├── metadata.json                # Metadata aplikasi AI Studio
├── README.md                    # Dokumentasi lengkap aplikasi
└── src/
    ├── main.tsx                 # React DOM root entry
    ├── App.tsx                  # Komponen induk, state global, sinkronisasi LocalStorage & Modal
    ├── index.css                # Tailwind CSS v4 rules & konfigurasi tipografi
    ├── types/
    │   └── ktp.ts               # Interface TypeScript (KTP, FilterState, ZodiacInfo, dll.)
    ├── components/
    │   ├── Header.tsx           # Navigasi atas (Top Bar Contract 3-zona)
    │   ├── StatsStrip.tsx       # Strip ringkasan KPI (Total data, pemilih, checklist, duplikat)
    │   ├── FilterToolbar.tsx    # Filter pencarian, zodiak, status, dan menu file CSV/JSON
    │   ├── DataTable.tsx        # Tampilan tabel desktop, kartu mobile, dan bagan keluarga
    │   ├── FamilyGraphView.tsx  # Komponen visualisasi pohon silsilah keluarga
    │   ├── FamilyModal.tsx      # Modal detail KK dengan tab Graph & Daftar
    │   ├── EditRecordModal.tsx  # Formulir tambah/edit dengan live preview usia, zodiak & validasi NIK
    │   ├── Pagination.tsx       # Navigasi halaman dengan nomor halaman aktif
    │   └── ConfirmModal.tsx     # Dialog konfirmasi aksi berbahaya (hapus data)
    └── utils/
        ├── ktpUtils.ts          # Fungsi logika murni: kalkulasi umur, zodiak, parser CSV, validasi NIK
        └── ktpUtils.test.ts     # 11 unit test untuk memverifikasi logika bisnis
```

---

## 🛠️ Menjalankan & Menguji Aplikasi

### Menjalankan Development Server
```bash
npm run dev
```
Aplikasi berjalan pada `http://localhost:3000`.

### Menjalankan Unit Test (Node Test Runner)
```bash
npx --yes tsx --test src/utils/ktpUtils.test.ts
```

### Memeriksa Lint & Tipe TypeScript
```bash
npm run lint
```

---

## 💡 Rekomendasi Fitur Baru untuk Pengembangan Selanjutnya

Berikut adalah usulan fitur inovatif yang dapat ditambahkan agar aplikasi semakin lengkap dan profesional:

1. **Pemindaian OCR Foto KTP (Camera / Image Upload)**:
   - Menggunakan model multimodal untuk mengekstrak data teks langsung dari foto e-KTP secara otomatis ke formulir tanpa perlu input manual.

2. **Ekspor Laporan PDF Rekapitulasi per RT/RW**:
   - Menghasilkan berkas PDF siap cetak berisi daftar pemilih, rekapitulasi keluarga, dan statistik warga untuk keperluan petugas sensus atau panitia pemilihan.

3. **Peta Sebaran Penduduk (Geolokasi & Alamat)**:
   - Visualisasi pin lokasi keluarga pada peta interaktif untuk melihat konsentrasi warga per rukun warga atau kelurahan.

4. **Kalkulator Weton / Hari Lahir Jawa**:
   - Melengkapi fitur zodiak Barat dengan perhitungan kalender Jawa (Legi, Pahing, Pon, Wage, Kliwon) yang banyak digunakan pada pencatatan adat di Indonesia.

5. **Pencarian Suara & Fuzzy Search (Pencarian Mirip Bunyi)**:
   - Mempermudah petugas di lapangan menemukan nama warga meskipun terdapat sedikit perbedaan ejaan huruf.
