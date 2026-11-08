import React from 'react';
import { Plus } from 'lucide-react';
import { FilterState } from '../types/ktp';

interface HeaderProps {
  filters: FilterState;
  onQuickNav: (preset: 'all' | 'eligible' | 'checked' | 'sesuai') => void;
  onAddNewRecord: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  filters,
  onQuickNav,
  onAddNewRecord,
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

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onAddNewRecord}
            className="min-h-[40px] px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
