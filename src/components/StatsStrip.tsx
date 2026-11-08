import React from 'react';
import { KtpStatsSummary } from '../utils/ktpUtils';
import { FilterState } from '../types/ktp';

interface StatsStripProps {
  stats: KtpStatsSummary;
  filteredCount: number;
  filters: FilterState;
  duplicateCount?: number;
  onApplyQuickFilter: (patch: Partial<FilterState>) => void;
  onFilterDuplicates?: () => void;
}

export const StatsStrip: React.FC<StatsStripProps> = ({
  stats,
  filteredCount,
  filters,
  duplicateCount = 0,
  onApplyQuickFilter,
  onFilterDuplicates,
}) => {
  return (
    <section aria-label="Ringkasan Statistik Data KTP" className="mb-6 space-y-2.5">
      {duplicateCount > 0 && (
        <div
          role="status"
          className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold">⚠ Terdeteksi {duplicateCount} NIK Duplikat</span>
            <span className="text-amber-700 hidden sm:inline">
              Ada entri dengan NIK sama dalam data yang mungkin perlu diperiksa.
            </span>
          </div>
          {onFilterDuplicates && (
            <button
              type="button"
              onClick={onFilterDuplicates}
              className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 rounded-md font-semibold text-amber-950 transition-colors cursor-pointer"
            >
              Lihat Duplikat
            </button>
          )}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 overflow-hidden">
        {/* Metric 1: Total Records */}
        <button
          type="button"
          onClick={() =>
            onApplyQuickFilter({
              checklistFilter: 'all',
              matchingFilter: 'all',
              voterFilter: 'all',
              editFilter: 'all',
            })
          }
          className="p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-slate-900"
        >
          <div className="text-xs font-medium text-slate-500">Total Data KTP</div>
          <div
            id="totalRecords"
            className="mt-1.5 text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums"
          >
            {stats.totalRecords}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="tabular-nums">{stats.totalFamilies} KK</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{filteredCount} ditampilkan</span>
          </div>
        </button>

        {/* Metric 2: Eligible Voters */}
        <button
          type="button"
          onClick={() =>
            onApplyQuickFilter({
              voterFilter: filters.voterFilter === 'eligible' ? 'all' : 'eligible',
            })
          }
          className={`p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
            filters.voterFilter === 'eligible' ? 'bg-emerald-50/60' : ''
          }`}
        >
          <div className="text-xs font-medium text-slate-500">Bisa Memilih (≥17 Thn)</div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-bold text-emerald-700 font-mono tabular-nums">
            {stats.eligibleVoters}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="tabular-nums">{stats.nonEligibleVoters} belum cukup umur</span>
          </div>
        </button>

        {/* Metric 3: Checklist Progress */}
        <button
          type="button"
          onClick={() =>
            onApplyQuickFilter({
              checklistFilter:
                filters.checklistFilter === 'checked' ? 'all' : 'checked',
            })
          }
          className={`p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
            filters.checklistFilter === 'checked' ? 'bg-blue-50/60' : ''
          }`}
        >
          <div className="text-xs font-medium text-slate-500">Sudah Dicek (Checklist)</div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {stats.checkedCount}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="tabular-nums">
              {stats.totalRecords - stats.checkedCount} belum dicek
            </span>
          </div>
        </button>

        {/* Metric 4: Matching Status */}
        <button
          type="button"
          onClick={() =>
            onApplyQuickFilter({
              matchingFilter: filters.matchingFilter === 'sesuai' ? 'all' : 'sesuai',
            })
          }
          className={`p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
            filters.matchingFilter === 'sesuai' ? 'bg-emerald-50/60' : ''
          }`}
        >
          <div className="text-xs font-medium text-slate-500">Status Sesuai</div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-bold text-emerald-700 font-mono tabular-nums">
            {stats.matchedCount}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="tabular-nums">
              {stats.totalRecords - stats.matchedCount} tidak sesuai
            </span>
          </div>
        </button>

        {/* Metric 5: Edited / Added Records */}
        <button
          type="button"
          onClick={() =>
            onApplyQuickFilter({
              editFilter: filters.editFilter === 'edited' ? 'all' : 'edited',
            })
          }
          className={`col-span-2 sm:col-span-1 p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
            filters.editFilter !== 'all' ? 'bg-amber-50/60' : ''
          }`}
        >
          <div className="text-xs font-medium text-slate-500">Riwayat Perubahan</div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
            {stats.editedCount}
          </div>
          <div className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
            <span>Diedit / Ditambahkan</span>
          </div>
        </button>
      </div>
    </section>
  );
};
