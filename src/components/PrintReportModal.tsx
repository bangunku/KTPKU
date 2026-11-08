import React from 'react';
import {
  FileText,
  Printer,
  X,
} from 'lucide-react';
import { IndexedCsvRow } from '../types/ktp';
import { calculateAge, isEligibleVoter } from '../utils/ktpUtils';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredRows: IndexedCsvRow[];
  totalRecords: number;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  filteredRows,
  totalRecords,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="printReportTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[94vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Control Bar (Hidden when printing via print:hidden) */}
        <div className="print:hidden px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="printReportTitle"
                className="text-base sm:text-lg font-bold text-slate-900 tracking-tight"
              >
                Cetak Lembar Verifikasi Lapangan (PDF / Kertas)
              </h2>
              <p className="text-xs text-slate-600">
                Format standar untuk pemeriksaan fisik door-to-door, verifikasi data pemilih, dan arsip RT/RW.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[38px] px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (Ctrl+P)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup pratinjau cetak"
              className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div id="printableArea" className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white text-slate-900">
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-4 text-center">
            <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-900">
              LEMBAR VERIFIKASI & DAFTAR DATA PENDUDUK / PEMILIH
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
              Sistem Manajemen Data KTP & Kartu Keluarga (KK) Lapangan
            </p>
            <div className="mt-2 text-xs text-slate-600 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span>Tanggal Cetak: <strong>{currentDateStr}</strong></span>
              <span>·</span>
              <span>Jumlah Data: <strong>{filteredRows.length} Warga</strong> (dari total {totalRecords})</span>
            </div>
          </div>

          {/* Verification Table */}
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-bold text-slate-800">
                <th className="py-2 px-2 border-r border-slate-300 text-center w-8">No</th>
                <th className="py-2 px-2.5 border-r border-slate-300 w-36 font-mono">No. KK</th>
                <th className="py-2 px-2.5 border-r border-slate-300 w-36 font-mono">NIK</th>
                <th className="py-2 px-2.5 border-r border-slate-300 min-w-[140px]">Nama Lengkap</th>
                <th className="py-2 px-2 border-r border-slate-300 text-center w-12">L/P</th>
                <th className="py-2 px-2.5 border-r border-slate-300 w-28">TTL / Umur</th>
                <th className="py-2 px-2.5 border-r border-slate-300 min-w-[170px]">Alamat</th>
                <th className="py-2 px-2 border-r border-slate-300 text-center w-20">Hak Pilih</th>
                <th className="py-2 px-2 border-r border-slate-300 text-center w-16">Ceklis Fisik</th>
                <th className="py-2 px-2 text-center w-24">Paraf Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {filteredRows.map(({ originalIndex, row }, idx) => {
                const kk = row[1] || '-';
                const nik = row[2] || '-';
                const nama = row[3] || '-';
                const gender = row[4] === 'LAKI-LAKI' ? 'L' : row[4] === 'PEREMPUAN' ? 'P' : '-';
                const alamat = row[5] || '-';
                const ttl = row[6] || '-';
                const fallbackAge = row[7];
                const age = calculateAge(ttl, fallbackAge);
                const eligible = isEligibleVoter(age);

                return (
                  <tr key={`print-row-${originalIndex}`} className="even:bg-slate-50/50">
                    <td className="py-2 px-2 border-r border-slate-300 text-center font-mono tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-300 font-mono text-[11px] tabular-nums">
                      {kk}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-300 font-mono text-[11px] tabular-nums font-semibold">
                      {nik}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-300 font-bold">
                      {nama}
                      <span className="block text-[10px] font-normal text-slate-500">
                        {row[10] || ''}
                      </span>
                    </td>
                    <td className="py-2 px-2 border-r border-slate-300 text-center font-bold">
                      {gender}
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-300 text-[11px]">
                      <div>{ttl}</div>
                      <div className="text-slate-500 font-mono">{age !== null ? `${age} thn` : '-'}</div>
                    </td>
                    <td className="py-2 px-2.5 border-r border-slate-300 text-[11px] leading-snug">
                      {alamat}
                    </td>
                    <td className="py-2 px-2 border-r border-slate-300 text-center text-[10px] font-semibold">
                      {eligible ? (
                        <span className="text-emerald-800">Pemilih</span>
                      ) : (
                        <span className="text-slate-500">Non-Pemilih</span>
                      )}
                    </td>
                    <td className="py-2 px-2 border-r border-slate-300 text-center">
                      <div className="w-4 h-4 border border-slate-400 mx-auto rounded-xs" />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <div className="h-6" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Signature & Verification Footer */}
          <div className="mt-8 pt-4 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-center">
            <div>
              <p className="text-slate-600 mb-12">Mengetahui, Pengurus RT / RW Setempat</p>
              <div className="border-b border-slate-400 w-44 mx-auto mb-1" />
              <p className="text-slate-500 text-[11px]">Nama & Tanda Tangan</p>
            </div>
            <div>
              <p className="text-slate-600 mb-12">Petugas Verifikator Lapangan</p>
              <div className="border-b border-slate-400 w-44 mx-auto mb-1" />
              <p className="text-slate-500 text-[11px]">Nama & Tanda Tangan</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="print:hidden px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <span className="text-xs text-slate-500">
            *Tip: Gunakan opsi &quot;Save as PDF&quot; pada dialog cetak untuk menyimpan arsip PDF digital.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[38px] px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[38px] px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
