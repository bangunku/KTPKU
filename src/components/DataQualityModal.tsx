import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Pencil,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { DataAnomalyItem, DataAuditSummary } from '../types/ktp';
import { auditDataQuality } from '../utils/ktpUtils';

interface DataQualityModalProps {
  isOpen: boolean;
  onClose: () => void;
  csvData: string[][];
  onFilterAnomalyNik: (nik: string) => void;
  onEditRecord: (originalIndex: number) => void;
}

export const DataQualityModal: React.FC<DataQualityModalProps> = ({
  isOpen,
  onClose,
  csvData,
  onFilterAnomalyNik,
  onEditRecord,
}) => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const audit = useMemo<DataAuditSummary>(() => {
    return auditDataQuality(csvData);
  }, [csvData]);

  const filteredAnomalies = useMemo(() => {
    return audit.anomalies.filter((item) => {
      if (selectedTypeFilter !== 'all' && item.type !== selectedTypeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${item.title} ${item.description} ${item.row[3] || ''} ${item.row[2] || ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [audit.anomalies, selectedTypeFilter, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dataQualityTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                audit.anomalies.length === 0
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {audit.anomalies.length === 0 ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2
                id="dataQualityTitle"
                className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2"
              >
                <span>Inspeksi Kualitas & Anomali Data KTP</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    audit.healthScore >= 95
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : audit.healthScore >= 80
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  Skor: {audit.healthScore}%
                </span>
              </h2>
              <p className="text-xs text-slate-600">
                Pemeriksaan otomatis validitas NIK 16 digit, duplikasi, kecocokan tgl lahir, dan struktur keluarga.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup inspeksi data"
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Health Score Summary Banner */}
        <div className="px-5 py-3.5 bg-slate-100/70 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Total Penduduk</span>
            <strong className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
              {audit.totalRecords}
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Data Bersih & Valid</span>
            <strong className="text-sm sm:text-base font-bold text-emerald-700 tabular-nums">
              {audit.cleanCount}
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Pemilih Pemula (17-21)</span>
            <strong className="text-sm sm:text-base font-bold text-blue-700 tabular-nums">
              {audit.firstTimeVoterCount}
            </strong>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[11px]">Lansia (≥60 Thn)</span>
            <strong className="text-sm sm:text-base font-bold text-purple-700 tabular-nums">
              {audit.elderlyCount}
            </strong>
          </div>
        </div>

        {/* Filter Controls for Anomalies */}
        <div className="px-5 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedTypeFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Semua ({audit.anomalies.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('duplicate-nik')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedTypeFilter === 'duplicate-nik'
                  ? 'bg-rose-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              NIK Duplikat
            </button>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('invalid-nik')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedTypeFilter === 'invalid-nik'
                  ? 'bg-amber-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              NIK Tidak 16 Digit
            </button>
            <button
              type="button"
              onClick={() => setSelectedTypeFilter('nik-mismatch')}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedTypeFilter === 'nik-mismatch'
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Beda Tgl NIK vs TTL
            </button>
          </div>

          <div className="w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari anomali..."
              className="w-full sm:w-44 px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
            />
          </div>
        </div>

        {/* Anomalies List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {filteredAnomalies.length > 0 ? (
            filteredAnomalies.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 space-y-2 text-xs transition-colors shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        item.severity === 'high'
                          ? 'bg-rose-500'
                          : item.severity === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <strong className="text-slate-900 font-bold">{item.title}</strong>
                    <span className="text-slate-500 font-mono text-[11px]">
                      Baris #{item.originalIndex}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.row[2] && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onFilterAnomalyNik(item.row[2]);
                        }}
                        className="px-2 py-1 rounded-md text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 inline-flex items-center gap-1 cursor-pointer"
                        title="Tampilkan warga dengan NIK ini di tabel utama"
                      >
                        <Filter className="w-3 h-3" />
                        <span>Filter NIK Ini</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEditRecord(item.originalIndex);
                      }}
                      className="px-2 py-1 rounded-md text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Edit Data</span>
                    </button>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed">{item.description}</p>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Nama:</span>
                    <span className="font-semibold text-slate-900 font-sans truncate block">
                      {item.row[3] || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">NIK:</span>
                    <span className="font-semibold text-slate-800">{item.row[2] || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">No. KK:</span>
                    <span>{item.row[1] || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">TTL:</span>
                    <span>{item.row[6] || '-'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">
                {audit.anomalies.length === 0
                  ? 'Semua Data KTP Sempurna & Valid!'
                  : 'Tidak ada anomali yang cocok dengan filter pencarian.'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {audit.anomalies.length === 0
                  ? 'Format NIK 16 digit terverifikasi, tanggal lahir sinkron, dan tidak ditemukan duplikasi data.'
                  : 'Coba ubah filter kategori anomali di atas.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] text-slate-500">
            Ditemukan {audit.anomalies.length} catatan verifikasi dari {audit.totalRecords} data penduduk.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[38px] px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
