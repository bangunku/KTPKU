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

### 3. Kalkulator Weton & Hari Lahir Jawa (`getWetonInfo`)
- Menghitung secara otomatis hari (*Saptawara*) dan pasaran (*Pancawara*) dari tanggal lahir menggunakan algoritma kalender Jawa historis yang akurat (dengan referensi jangkar hari Kamis Wage, 1 Januari 1970 UTC):
  - **Hari (Saptawara)**: Minggu (Neptu 5), Senin (4), Selasa (3), Rabu (7), Kamis (8), Jumat (6), Sabtu (9).
  - **Pasaran (Pancawara)**: Legi (Neptu 5), Pahing (9), Pon (7), Wage (4), Kliwon (8).
  - **Perhitungan Neptu Total**: `Neptu Total = Neptu Hari + Neptu Pasaran` (misal: *Jumat Legi* = 6 + 5 = 11; *Kamis Wage* = 8 + 4 = 12).
  - **Watak / Karakteristik Neptu**: Dilengkapi deskripsi watak Jawa tradisional (*Lakuning Pandhita, Lakuning Geni, Lakuning Angin, Lakuning Pendhita Sakti, Lakuning Bintang, Lakuning Kembang, Lakuning Lintang, Lakuning Rembulan, Lakuning Srengenge, Lakuning Bumi, Lakuning Gunung, Lakuning Paripurna*).
- Integrasi menyeluruh:
  - **Badge Weton di Tabel Desktop & Kartu Mobile** lengkap dengan popover/tooltip nilai neptu dan watak.
  - **Filter Pasaran Jawa**: Memfilter warga berdasarkan pasaran (*Legi, Pahing, Pon, Wage, Kliwon*).
  - **Live Preview di Form Tambah/Edit Data**: Langsung menampilkan hari pasaran, breakdown neptu, dan watak saat tanggal lahir diketik.
  - **Visualisasi di Graph Keluarga & Modal Detail KK**.

### 4. Family Graph View (Diagram Silsilah Kartu Keluarga)
- Mengelompokkan seluruh anggota keluarga dalam 1 KK secara terstruktur:
  - **Root Hub KK**: Ringkasan nomor KK, alamat, jumlah pemilih, dan status pencocokan.
  - **Tingkat 1 (Orang Tua / Pasangan)**: Kepala Keluarga, Istri, atau Suami.
  - **Tingkat 2 (Anak & Keturunan)**: Anak, Menantu, atau Cucu.
  - **Tingkat 3 (Keluarga Besar)**: Anggota keluarga lainnya dalam KK.
- Dapat diakses melalui tombol **View Family** (modal dengan tab *Graph Keluarga* & *Daftar Detail*) atau beralih ke mode layar penuh **Graph Keluarga** pada toolbar.

### 5. Validasi Struktur NIK & Deteksi Duplikat
- **Validasi Struktur NIK 16 Digit**:
  - Mengecek panjang 16 digit angka.
  - Mengekstrak kode wilayah (Provinsi, Kabupaten/Kota, Kecamatan).
  - Mengekstrak tanggal lahir dan jenis kelamin secara otomatis (pada perempuan, nilai tanggal ditambah 40 sesuai standar Dukcapil Indonesia).
- **Deteksi NIK Ganda**: Muncul peringatan otomatis jika ada NIK duplikat di dalam data, lengkap dengan tombol pintas untuk langsung menyaring entri bermasalah.

### 6. Kelayakan Pemilih & Status Verifikasi Lapangan
- **Kalkulasi Usia Real-Time**: Otomatis menghitung umur saat ini dari tanggal lahir.
- **Status Pemilih (≥ 17 Tahun)**: Menentukan hak pilih pemilu (*Bisa Memilih* vs *Tidak Bisa Memilih*).
- **Checklist & Pencocokan Lapangan**:
  - Checklist per individu atau per seluruh hasil filter (*Check Hasil Filter* / *Uncheck All*).
  - Toggle Matching Status (*Sesuai* / *Tidak Sesuai*).
  - Status Perubahan Data (*Edited (Green)*, *Added (Blue)*, *Not Edited*).

### 7. Petung Jodoh Weton Jawa (Primbon Tradisional)
- **Kalkulator Kecocokan Pasangan**: Menghitung akumulasi Neptu hari & pasaran antara dua pasangan berdasarkan Primbon Jawa tradisional (`(Neptu 1 + Neptu 2) mod 8`).
- **8 Kategori Petung Primbon**:
  1. **Pegat (Sisa 1)**: Potensi perselisihan ekonomi atau komunikasi, dianjurkan memperkuat musyawarah keluarga.
  2. **Ratu (Sisa 2)**: Pasangan disegani dan dihormati masyarakat, rezeki mengalir lancar.
  3. **Jodoh (Sisa 3)**: Sangat serasi, rukun, dan saling melengkapi hingga usia senja.
  4. **Topo (Sisa 4)**: Awal pernikahan penuh perjuangan, namun bahagia dan sukses di kemudian hari.
  5. **Tinari (Sisa 5)**: Keberuntungan berlimpah, rezeki mudah didapat dan keluarga tenteram.
  6. **Padu (Sisa 6)**: Sering berdebat karena hal kecil namun tidak berpisah; perlu sikap saling mengalah.
  7. **Sujanan (Sisa 7)**: Rentan perselisihan pihak luar; disarankan saling setia dan transparan.
  8. **Pesthi (Sisa 0 / 8)**: Sangat rukun, tentram, damai lahir batin, dan langgeng seumur hidup.
- **Dual Mode Interaktif**:
  - **Pilih Pasangan dari Data Warga**: Dropdown warga KTP dengan deteksi otomatis pasangan (Kepala Keluarga & Istri) dari modal keluarga.
  - **Kalkulator Bebas**: Input manual tanggal lahir untuk mengecek jodoh siapapun di luar database.
- **Glosarium 8 Kategori**: Penjelasan makna, skor kecocokan (%), dan wejangan tradisi.

### 8. Inspeksi Kualitas & Deteksi Anomali Data KTP (Data Quality Inspector)
- **Skor Kesehatan Dataset (0 – 100%)**: Indikator persentase kebersihan data kependudukan.
- **Audit Otomatis 5 Jenis Anomali**:
  - NIK ganda / duplikat.
  - NIK tidak memenuhi format baku 16 digit angka.
  - Diskrepansi tanggal lahir: Tanggal pada NIK berbeda dengan tanggal lahir pada kolom TTL.
  - Kepala Keluarga di bawah umur (< 17 tahun).
  - Usia tidak lazim (> 110 tahun).
- **Metrik Demografi Cepat**: Pemilih pemula (17–21 thn) dan lansia (≥ 60 thn).
- **Pintasan 1-Klik**: Tombol untuk langsung menyaring tabel utama ke NIK yang mengalami anomali.

### 9. Cetak Lembar Verifikasi Lapangan (PDF / Kertas)
- **Dokumen Resmi Berstandar Lapangan**: Tampilan cetak khusus dengan CSS `@media print` yang menghilangkan navigasi dan tombol aplikasi, menyajikan tabel kontras tinggi dengan kolom paraf fisik, kolom catatan lapangan, dan kolom tanda tangan resmi RT / RW dan Petugas Verifikator.
- **Dukungan Filter Cetak**: Opsi mencetak hanya data yang sedang difilter atau mencetak seluruh data warga.

### 10. Desain Responsif, Filter Rentang Usia & Privasi Data
- **Filter Kategori Usia**: Dropdown baru untuk menyaring *Pemilih Pemula (17–21 thn)*, *Usia Produktif (22–59 thn)*, *Lansia (≥60 thn)*, dan *Anak-anak (<17 thn)*.
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
    ├── index.css                # Tailwind CSS v4 rules & konfigurasi cetak (@media print)
    ├── types/
    │   └── ktp.ts               # Interface TypeScript (KTP, FilterState, Petung, DataAnomaly, dll.)
    ├── components/
    │   ├── Header.tsx           # Navigasi atas dengan tombol Petung Jodoh, Audit Data, Cetak & Tambah Data
    │   ├── StatsStrip.tsx       # Strip ringkasan KPI (Total data, pemilih, checklist, status data)
    │   ├── FilterToolbar.tsx    # Filter pencarian, zodiak, pasaran, kategori usia, status, dan menu file
    │   ├── DataTable.tsx        # Tampilan tabel desktop, kartu mobile, dan bagan keluarga
    │   ├── FamilyGraphView.tsx  # Komponen visualisasi pohon silsilah keluarga
    │   ├── FamilyModal.tsx      # Modal detail KK dengan tab Graph & tombol Petung Pasangan langsung
    │   ├── PetungJodohModal.tsx # Modal interaktif kalkulator jodoh weton Primbon Jawa
    │   ├── DataQualityModal.tsx # Modal inspeksi anomali dan kesehatan dataset kependudukan
    │   ├── PrintReportModal.tsx # Modal & preview lembar verifikasi lapangan siap cetak PDF
    │   ├── EditRecordModal.tsx  # Formulir tambah/edit dengan live preview usia, zodiak & validasi NIK
    │   ├── Pagination.tsx       # Navigasi halaman dengan nomor halaman aktif
    │   └── ConfirmModal.tsx     # Dialog konfirmasi aksi berbahaya (hapus data)
    └── utils/
        ├── ktpUtils.ts          # Fungsi logika murni: umur, zodiak, weton, petung jodoh, audit anomali, CSV
        └── ktpUtils.test.ts     # 14 unit test komprehensif (akurasi umur, zodiak, weton, petung, audit)
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
   - Menggunakan model vision multimodal untuk mengekstrak data teks langsung dari foto e-KTP secara otomatis ke formulir tanpa perlu input manual.

2. **Peta Sebaran Penduduk (Geolokasi & Alamat)**:
   - Visualisasi pin lokasi keluarga pada peta interaktif untuk melihat konsentrasi warga per rukun warga atau kelurahan.

3. **Pencetakan Kartu Pemilih / Label QR Code NIK**:
   - Menghasilkan kartu tanda pemilih atau label QR Code berisi ringkasan data kependudukan dan status verifikasi lapangan untuk ditempel pada arsip fisik.

4. **Pencarian Suara & Fuzzy Search (Pencarian Mirip Bunyi)**:
   - Mempermudah petugas di lapangan menemukan nama warga meskipun terdapat sedikit perbedaan ejaan huruf atau logat daerah.

