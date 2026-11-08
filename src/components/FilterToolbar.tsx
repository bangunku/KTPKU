import React, { useRef, useState } from 'react';
import {
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FolderDown,
  FolderUp,
  GitFork,
  LayoutGrid,
  RotateCcw,
  Search,
  SquareCheckBig,
  Table as TableIcon,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { FilterState } from '../types/ktp';
import { PASARAN_LIST, ZODIAC_LIST } from '../utils/ktpUtils';

export type WorkspaceViewMode = 'auto' | 'table' | 'cards' | 'graph';

interface FilterToolbarProps {
  filters: FilterState;
  onUpdateFilters: (patch: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onUploadCSV: (file: File) => void;
  onExportCSV: () => void;
  onSaveStorageJSON: () => void;
  onLoadStorageJSON: (file: File) => void;
  onDeleteStorage: () => void;
  onLoadSampleData: () => void;
  onUncheckAll: () => void;
  onCheckAllVisible: () => void;
  maskSensitive: boolean;
  onToggleMaskSensitive: () => void;
  viewMode: WorkspaceViewMode;
  onChangeViewMode: (mode: WorkspaceViewMode) => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  onUploadCSV,
  onExportCSV,
  onSaveStorageJSON,
  onLoadStorageJSON,
  onDeleteStorage,
  onLoadSampleData,
  onUncheckAll,
  onCheckAllVisible,
  maskSensitive,
  onToggleMaskSensitive,
  viewMode,
  onChangeViewMode,
}) => {
  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const jsonInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedCsvFile, setSelectedCsvFile] = useState<File | null>(null);
  const [mobileToolsExpanded, setMobileToolsExpanded] = useState<boolean>(false);

  const hasActiveFilters =
    filters.searchTerm.trim() !== '' ||
    filters.addressFilter.trim() !== '' ||
    filters.checklistFilter !== 'all' ||
    filters.matchingFilter !== 'all' ||
    filters.voterFilter !== 'all' ||
    filters.ageFilter !== 'all' ||
    filters.editFilter !== 'all' ||
    filters.zodiacFilter !== 'all' ||
    filters.pasaranFilter !== 'all';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCsvFile(file);
      onUploadCSV(file);
    }
  };

  const handleManualUploadClick = () => {
    if (selectedCsvFile) {
      onUploadCSV(selectedCsvFile);
    } else {
      csvInputRef.current?.click();
    }
  };

  return (
    <section
      aria-label="Filter dan Manajemen Data"
      className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-6 space-y-4"
    >
      {/* Mobile Quick Toggle for File & Storage Actions */}
      <div className="flex sm:hidden items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-700">
          Pencarian & Filter Data
        </span>
        <button
          type="button"
          onClick={() => setMobileToolsExpanded((prev) => !prev)}
          aria-expanded={mobileToolsExpanded}
          className="min-h-[36px] px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          {mobileToolsExpanded ? 'Sembunyikan Menu CSV/Storage' : 'Menu CSV & Storage'}
        </button>
      </div>

      {/* Top Row: CSV File Upload/Export & JSON Data Storage Actions */}
      <div
        className={`${
          mobileToolsExpanded ? 'flex' : 'hidden sm:flex'
        } flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-4 border-b border-slate-200`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={csvInputRef}
            id="csvFile"
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="text-xs text-slate-600 file:mr-2.5 file:py-2 file:px-3 file:rounded-lg file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-slate-50 file:text-slate-800 hover:file:bg-slate-100 cursor-pointer max-w-[230px] sm:max-w-xs"
            aria-label="Pilih file CSV"
          />
          <button
            type="button"
            onClick={handleManualUploadClick}
            className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload CSV</span>
          </button>
          <button
            type="button"
            onClick={onExportCSV}
            className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save CSV</span>
          </button>
        </div>

        {/* Storage Backup / Restore / Sample / Delete */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={jsonInputRef}
            type="file"
            accept=".json,application/json"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onLoadStorageJSON(file);
                e.target.value = '';
              }
            }}
            className="hidden"
            aria-label="Muat file JSON Backup"
          />
          <button
            type="button"
            onClick={onSaveStorageJSON}
            className="min-h-[40px] px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            title="Unduh cadangan data + checklist + status matching ke file JSON"
          >
            <FolderDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Save Storage</span>
          </button>
          <button
            type="button"
            onClick={() => jsonInputRef.current?.click()}
            className="min-h-[40px] px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            title="Muat file JSON cadangan penyimpanan"
          >
            <FolderUp className="w-3.5 h-3.5 text-slate-500" />
            <span>Load Storage</span>
          </button>
          <button
            type="button"
            onClick={onLoadSampleData}
            className="min-h-[40px] px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            title="Muat ulang data contoh KTP & KK"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Data Contoh</span>
          </button>
          <button
            type="button"
            onClick={onDeleteStorage}
            className="min-h-[40px] px-3 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            title="Hapus semua data penyimpanan"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Storage</span>
          </button>
        </div>
      </div>

      {/* Middle Row: Search & Filter Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-7 gap-3">
        {/* Global Search Input */}
        <div className="sm:col-span-2 md:col-span-1 lg:col-span-1 relative">
          <label htmlFor="searchInput" className="block text-xs font-medium text-slate-600 mb-1">
            Cari Nama / NIK / KK
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="searchInput"
              type="text"
              value={filters.searchTerm}
              onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
              placeholder="Nama, NIK, KK..."
              className="w-full min-h-[42px] pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            {filters.searchTerm && (
              <button
                type="button"
                onClick={() => onUpdateFilters({ searchTerm: '' })}
                aria-label="Bersihkan pencarian"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Address Filter Input */}
        <div className="relative">
          <label htmlFor="addressInput" className="block text-xs font-medium text-slate-600 mb-1">
            Filter Alamat
          </label>
          <div className="relative">
            <input
              id="addressInput"
              type="text"
              value={filters.addressFilter}
              onChange={(e) => onUpdateFilters({ addressFilter: e.target.value })}
              placeholder="RT/RW, jalan..."
              className="w-full min-h-[42px] px-3 pr-8 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            {filters.addressFilter && (
              <button
                type="button"
                onClick={() => onUpdateFilters({ addressFilter: '' })}
                aria-label="Bersihkan filter alamat"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Zodiac Filter */}
        <div>
          <label htmlFor="zodiacFilter" className="block text-xs font-medium text-slate-600 mb-1">
            Filter Zodiak
          </label>
          <select
            id="zodiacFilter"
            value={filters.zodiacFilter}
            onChange={(e) =>
              onUpdateFilters({
                zodiacFilter: e.target.value as FilterState['zodiacFilter'],
              })
            }
            className="w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">Semua Zodiak</option>
            {ZODIAC_LIST.map((z) => (
              <option key={z.name} value={z.name}>
                {z.symbol} {z.name} ({z.dateRange})
              </option>
            ))}
          </select>
        </div>

        {/* Pasaran Jawa (Weton) Filter */}
        <div>
          <label htmlFor="pasaranFilter" className="block text-xs font-medium text-slate-600 mb-1">
            Pasaran Jawa
          </label>
          <select
            id="pasaranFilter"
            value={filters.pasaranFilter}
            onChange={(e) =>
              onUpdateFilters({
                pasaranFilter: e.target.value as FilterState['pasaranFilter'],
              })
            }
            className="w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">Semua Pasaran</option>
            {PASARAN_LIST.map((p) => (
              <option key={p} value={p}>
                {p} (Neptu {p === 'Pahing' ? 9 : p === 'Kliwon' ? 8 : p === 'Pon' ? 7 : p === 'Legi' ? 5 : 4})
              </option>
            ))}
          </select>
        </div>

        {/* Checklist Filter */}
        <div>
          <label htmlFor="checklistFilter" className="block text-xs font-medium text-slate-600 mb-1">
            Status Checklist
          </label>
          <select
            id="checklistFilter"
            value={filters.checklistFilter}
            onChange={(e) =>
              onUpdateFilters({
                checklistFilter: e.target.value as FilterState['checklistFilter'],
              })
            }
            className="w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">Semua Checklist</option>
            <option value="checked">Sudah Dicek (Checked)</option>
            <option value="unchecked">Belum Dicek (Unchecked)</option>
          </select>
        </div>

        {/* Matching Status Filter */}
        <div>
          <label htmlFor="matchingFilter" className="block text-xs font-medium text-slate-600 mb-1">
            Status Matching
          </label>
          <select
            id="matchingFilter"
            value={filters.matchingFilter}
            onChange={(e) =>
              onUpdateFilters({
                matchingFilter: e.target.value as FilterState['matchingFilter'],
              })
            }
            className="w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">Semua Matching</option>
            <option value="sesuai">Sesuai</option>
            <option value="tidak-sesuai">Tidak Sesuai</option>
          </select>
        </div>

        {/* Voter Eligibility Filter */}
        <div>
          <label htmlFor="voterFilter" className="block text-xs font-medium text-slate-600 mb-1">
            Status Pemilih
          </label>
          <select
            id="voterFilter"
            value={filters.voterFilter}
            onChange={(e) =>
              onUpdateFilters({
                voterFilter: e.target.value as FilterState['voterFilter'],
              })
            }
            className="w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">Semua Hak Pilih</option>
            <option value="eligible">Bisa Memilih (≥17 Thn)</option>
            <option value="non-eligible">Tidak Bisa Memilih (&lt;17 Thn)</option>
          </select>
        </div>

        {/* Age Generation Category Filter */}
        <div>
          <label htmlFor="ageFilter" className="block text-xs font-medium text-slate-600 mb-1">
            Kategori Usia
          </label>
          <select
            id="ageFilter"
            value={filters.ageFilter}
            onChange={(e) =>
              onUpdateFilters({
                ageFilter: e.target.value as FilterState['ageFilter'],
              })
            }
            className="w-full min-h-[42px] px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
          >
            <option value="all">Semua Usia</option>
            <option value="first-time">Pemilih Pemula (17–21 Thn)</option>
            <option value="productive">Usia Produktif (22–59 Thn)</option>
            <option value="elderly">Lansia (≥60 Thn)</option>
            <option value="under17">Anak-anak (&lt;17 Thn)</option>
          </select>
        </div>
      </div>

      {/* Bottom Row: Batch Controls, Mask Toggle, Per-Page & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onUncheckAll}
            className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Uncheck All</span>
          </button>

          <button
            type="button"
            onClick={onCheckAllVisible}
            className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SquareCheckBig className="w-3.5 h-3.5" />
            <span>Check Hasil Filter</span>
          </button>

          <button
            type="button"
            onClick={onToggleMaskSensitive}
            className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {maskSensitive ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Tampilkan NIK Penuh</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Sensor NIK/KK</span>
              </>
            )}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="min-h-[38px] px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Items Per Page Select */}
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-xs font-medium text-slate-600 whitespace-nowrap">
              Baris:
            </label>
            <select
              id="itemsPerPage"
              value={filters.itemsPerPage}
              onChange={(e) =>
                onUpdateFilters({ itemsPerPage: parseInt(e.target.value, 10) })
              }
              className="min-h-[38px] px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg text-slate-900 cursor-pointer"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          {/* Responsive Layout Mode Selector */}
          <div
            role="group"
            aria-label="Mode Tampilan"
            className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg"
          >
            <button
              type="button"
              onClick={() => onChangeViewMode('auto')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'auto'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Otomatis
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('table')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('cards')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kartu Mobile</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('graph')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === 'graph'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Graph Keluarga</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
