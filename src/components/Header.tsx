import React from 'react';
import { Heart, Plus, Printer, ShieldAlert, ShieldCheck } from 'lucide-react';
import { FilterState } from '../types/ktp';

interface HeaderProps {
  filters: FilterState;
  onQuickNav: (preset: 'all' | 'eligible' | 'checked' | 'sesuai') => void;
  onAddNewRecord: () => void;
  onOpenPetungJodoh: () => void;
  onOpenDataQuality: () => void;
  onOpenPrintReport: () => void;
  anomalyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  filters,
  onQuickNav,
  onAddNewRecord,
  onOpenPetungJodoh,
  onOpenDataQuality,
  onOpenPrintReport,
  anomalyCount,
}) => {
  const isAll =
    filters.voterFilter === 'all' &&
    filters.checklistFilter === 'all' &&
    filters.matchingFilter === 'all';
  const isEligible = filters.voterFilter === 'eligible';
  const isChecked = filters.checklistFilter === 'checked';
  const isSesuai = filters.matchingFilter === 'sesuai';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onQuickNav('all');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          KTP Search
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav
          aria-label="Filter Cepat"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          <a
            href="#semua-data"
            onClick={(e) => {
              e.preventDefault();
              onQuickNav('all');
            }}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              isAll
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Semua Data
          </a>
          <a
            href="#pemilih-aktif"
            onClick={(e) => {
              e.preventDefault();
              onQuickNav('eligible');
            }}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              isEligible
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Pemilih Aktif
          </a>
          <a
            href="#sudah-dicek"
            onClick={(e) => {
              e.preventDefault();
              onQuickNav('checked');
            }}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              isChecked
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Sudah Dicek
          </a>
          <a
            href="#data-sesuai"
            onClick={(e) => {
              e.preventDefault();
              onQuickNav('sesuai');
            }}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              isSesuai
                ? 'border-slate-900 text-slate-900 font-semibold'
                : 'border-transparent'
            }`}
          >
            Data Sesuai
          </a>
        </nav>

        {/* Zone 3: Utility & Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Petung Jodoh Jawa Button */}
          <button
            type="button"
            onClick={onOpenPetungJodoh}
            title="Kalkulator Petung Jodoh Weton Jawa (Primbon)"
            className="min-h-[38px] px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-600 stroke-rose-600" />
            <span className="hidden sm:inline">Petung Jodoh</span>
          </button>

          {/* Audit Kualitas Data Button */}
          <button
            type="button"
            onClick={onOpenDataQuality}
            title="Inspeksi Kualitas & Deteksi Anomali Data KTP"
            className={`min-h-[38px] px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border ${
              anomalyCount > 0
                ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-200'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
            }`}
          >
            {anomalyCount > 0 ? (
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span className="hidden sm:inline">Audit Data</span>
            {anomalyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-200 text-amber-900 rounded-full">
                {anomalyCount}
              </span>
            )}
          </button>

          {/* Cetak Laporan Lapangan Button */}
          <button
            type="button"
            onClick={onOpenPrintReport}
            title="Cetak Lembar Verifikasi Lapangan / PDF"
            className="min-h-[38px] px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Cetak</span>
          </button>

          {/* Tambah Data Button */}
          <button
            type="button"
            onClick={onAddNewRecord}
            className="min-h-[38px] px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
