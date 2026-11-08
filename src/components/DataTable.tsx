import React, { useMemo } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  FilePlus2,
  GitFork,
  Pencil,
  User,
  XCircle,
} from 'lucide-react';
import {
  EditedRecordsMap,
  IndexedCsvRow,
  MatchingStatusMap,
  ViewedRecordsMap,
} from '../types/ktp';
import {
  calculateAge,
  getWetonInfo,
  getZodiacInfo,
  isEligibleVoter,
  maskNumber,
} from '../utils/ktpUtils';
import { WorkspaceViewMode } from './FilterToolbar';
import { FamilyGraphView } from './FamilyGraphView';

interface DataTableProps {
  paginatedRows: IndexedCsvRow[];
  allFilteredRows: IndexedCsvRow[];
  startIndex: number;
  viewedRecords: ViewedRecordsMap;
  editedRecords: EditedRecordsMap;
  matchingStatus: MatchingStatusMap;
  maskSensitive: boolean;
  viewMode: WorkspaceViewMode;
  onToggleChecklist: (nik: string) => void;
  onToggleMatchingStatus: (nik: string) => void;
  onOpenFamilyModal: (kkNumber: string) => void;
  onOpenEditModal: (originalIndex: number) => void;
  onOpenPersonDetail: (originalIndex: number) => void;
  onAddFamilyMember: (kkNumber: string) => void;
  onCopyToClipboard: (text: string, label: string) => void;
  onAddNewRecord: () => void;
  onLoadSampleData: () => void;
  hasAnyData: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  paginatedRows,
  allFilteredRows,
  startIndex,
  viewedRecords,
  editedRecords,
  matchingStatus,
  maskSensitive,
  viewMode,
  onToggleChecklist,
  onToggleMatchingStatus,
  onOpenFamilyModal,
  onOpenEditModal,
  onOpenPersonDetail,
  onAddFamilyMember,
  onCopyToClipboard,
  onAddNewRecord,
  onLoadSampleData,
  hasAnyData,
}) => {
  // Group filtered records by KK for full-page Graph View mode
  const familyGroups = useMemo(() => {
    const map = new Map<string, IndexedCsvRow[]>();
    for (const item of allFilteredRows) {
      const kk = (item.row[1] || 'TANPA_KK').trim();
      const existing = map.get(kk) || [];
      existing.push(item);
      map.set(kk, existing);
    }
    return Array.from(map.entries());
  }, [allFilteredRows]);

  if (paginatedRows.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
        <h3 className="text-base font-semibold text-slate-900">
          {hasAnyData
            ? 'Tidak ada data KTP yang cocok dengan filter pencarian'
            : 'Belum ada data KTP yang dimuat'}
        </h3>
        <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
          {hasAnyData
            ? 'Coba ubah kata kunci pencarian, alamat, zodiak, atau reset filter untuk melihat seluruh data penduduk.'
            : 'Unggah file CSV data KTP/KK Anda, muat data contoh, atau tambahkan data penduduk baru secara manual.'}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {!hasAnyData && (
            <button
              type="button"
              onClick={onLoadSampleData}
              className="min-h-[42px] px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              Muat Data Contoh (12 Penduduk)
            </button>
          )}
          <button
            type="button"
            onClick={onAddNewRecord}
            className="min-h-[42px] px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>Tambah Data Baru</span>
          </button>
        </div>
      </div>
    );
  }

  if (viewMode === 'graph') {
    return (
      <div className="space-y-6">
        {familyGroups.map(([kkNumber, members]) => (
          <FamilyGraphView
            key={`graph-kk-${kkNumber}`}
            kkNumber={kkNumber}
            familyMembers={members}
            matchingStatus={matchingStatus}
            maskSensitive={maskSensitive}
            onEditMember={onOpenEditModal}
            onToggleMatchingStatus={onToggleMatchingStatus}
            onAddFamilyMember={onAddFamilyMember}
            onCopyToClipboard={onCopyToClipboard}
            onOpenPersonDetail={onOpenPersonDetail}
          />
        ))}
      </div>
    );
  }

  const showTableClass =
    viewMode === 'table'
      ? 'block'
      : viewMode === 'cards'
      ? 'hidden'
      : 'hidden md:block';

  const showCardsClass =
    viewMode === 'cards'
      ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
      : viewMode === 'table'
      ? 'hidden'
      : 'grid grid-cols-1 gap-3.5 md:hidden';

  return (
    <div>
      {/* Desktop / Full Table View */}
      <div
        className={`${showTableClass} bg-white border border-slate-200 rounded-xl overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table id="dataTable" className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                <th className="py-3 px-2.5 w-10 text-right shrink-0">No</th>
                <th className="py-3 px-2.5 min-w-[145px] shrink-0">No. KK</th>
                <th className="py-3 px-2.5 min-w-[145px] shrink-0">NIK</th>
                <th className="py-3 px-2.5 min-w-[170px]">Nama Lengkap</th>
                <th className="py-3 px-2.5 min-w-[200px]">Alamat</th>
                <th className="py-3 px-2.5 min-w-[185px]">Umur, Zodiak & Weton</th>
                <th className="py-3 px-2.5 min-w-[110px]">Status Edit</th>
                <th className="py-3 px-2 text-center min-w-[70px]">Checklist</th>
                <th className="py-3 px-2.5 min-w-[110px]">Matching</th>
                <th className="py-3 px-2.5 text-right min-w-[130px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
              {paginatedRows.map(({ originalIndex, row }, idx) => {
                const rowNumber = startIndex + idx + 1;
                const kk = row[1] || '';
                const nik = row[2] || '';
                const nama = row[3] || '-';
                const gender = row[4] || '';
                const alamat = row[5] || '-';
                const ttl = row[6] || '';
                const fallbackAge = row[7] || '';
                const shdk = row[10] || '';

                const age = calculateAge(ttl, fallbackAge);
                const eligible = isEligibleVoter(age);
                const zodiac = getZodiacInfo(ttl);
                const weton = getWetonInfo(ttl);
                const isChecked = Boolean(viewedRecords[nik]);
                const matchVal = matchingStatus[nik] || 'tidak-sesuai';
                const editInfo = editedRecords[nik] || { status: 'Not Edited' };

                const rowBgClass =
                  editInfo.status === 'Edited (Green)'
                    ? 'bg-emerald-50/40 hover:bg-emerald-50/70'
                    : editInfo.status === 'Added (Blue)'
                    ? 'bg-sky-50/40 hover:bg-sky-50/70'
                    : 'hover:bg-slate-50/90';

                return (
                  <tr
                    key={`${nik}-${originalIndex}`}
                    className={`transition-colors ${rowBgClass}`}
                  >
                    {/* NO */}
                    <td className="py-3 px-2.5 font-mono text-xs text-slate-500 text-right tabular-nums">
                      {rowNumber}
                    </td>

                    {/* NO. KK */}
                    <td className="py-3 px-2.5 font-mono text-xs text-slate-700 tabular-nums whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onCopyToClipboard(kk, 'No. KK')}
                        title="Klik untuk menyalin No. KK lengkap"
                        className="inline-flex items-center gap-1 hover:text-slate-900 underline decoration-slate-300 hover:decoration-slate-700 cursor-pointer"
                      >
                        <span>{maskNumber(kk, maskSensitive)}</span>
                        <Copy className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>
                    </td>

                    {/* NIK */}
                    <td className="py-3 px-2.5 font-mono text-xs text-slate-700 tabular-nums whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onCopyToClipboard(nik, 'NIK')}
                        title="Klik untuk menyalin NIK lengkap"
                        className="inline-flex items-center gap-1 hover:text-slate-900 underline decoration-slate-300 hover:decoration-slate-700 cursor-pointer"
                      >
                        <span>{maskNumber(nik, maskSensitive)}</span>
                        <Copy className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>
                    </td>

                    {/* NAMA & Subtitle Metadata (Clickable to view detail modal) */}
                    <td className="py-3 px-2.5">
                      <button
                        type="button"
                        onClick={() => onOpenPersonDetail(originalIndex)}
                        title={`Klik untuk melihat detail lengkap & biodata KTP ${nama}`}
                        className="text-left font-bold text-slate-900 hover:text-blue-700 underline decoration-slate-300 hover:decoration-blue-600 transition-colors cursor-pointer group inline-flex flex-wrap items-center gap-1.5 leading-snug break-words"
                      >
                        <span className="break-words">{nama}</span>
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200/70 group-hover:bg-blue-100 transition-colors shrink-0">
                          Detail
                        </span>
                      </button>
                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-1 gap-y-0.5 mt-0.5">
                        {gender && (
                          <span className="whitespace-nowrap">{gender}</span>
                        )}
                        {gender && shdk && <span aria-hidden="true">·</span>}
                        {shdk && (
                          <span className="whitespace-nowrap">{shdk}</span>
                        )}
                      </div>
                    </td>

                    {/* ALAMAT (Tidak terpotong paksa, dengan tombol salin & klik) */}
                    <td className="py-3 px-2.5 min-w-[200px] max-w-[280px]">
                      <button
                        type="button"
                        onClick={() => onCopyToClipboard(alamat, 'Alamat')}
                        title="Klik untuk menyalin Alamat lengkap"
                        className="text-left text-xs text-slate-700 hover:text-slate-950 hover:underline decoration-slate-300 cursor-pointer block leading-relaxed break-words"
                      >
                        {alamat}
                      </button>
                    </td>

                    {/* VOTER STATUS, AGE, ZODIAC & WETON JAWA */}
                    <td className="py-3 px-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        {eligible ? (
                          <span className="text-emerald-700">Bisa Memilih</span>
                        ) : (
                          <span className="text-blue-700">
                            Tidak Bisa Memilih
                          </span>
                        )}
                        <span className="text-slate-300 font-normal">·</span>
                        <span className="font-mono tabular-nums text-slate-700">
                          {age !== null ? `${age} thn` : 'Umur -'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-1.5 mt-1">
                        {zodiac && (
                          <span
                            className="font-medium text-amber-800"
                            title={`Zodiak ${zodiac.name} (${zodiac.dateRange}) · Elemen ${zodiac.element}`}
                          >
                            {zodiac.symbol} {zodiac.name}
                          </span>
                        )}
                        {zodiac && weton && (
                          <span className="text-slate-300 font-normal" aria-hidden="true">
                            ·
                          </span>
                        )}
                        {weton && (
                          <span
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10.5px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/80 cursor-help"
                            title={`Weton Jawa: ${weton.wetonText} (Neptu ${weton.neptuHari} + ${weton.neptuPasaran} = ${weton.neptuTotal})\nWatak: ${weton.watak}`}
                          >
                            {weton.wetonText} ({weton.neptuTotal})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* STATUS EDIT */}
                    <td className="py-3 px-2.5 whitespace-nowrap">
                      <div
                        className={`text-xs font-medium ${
                          editInfo.status === 'Edited (Green)'
                            ? 'text-emerald-800 font-semibold'
                            : editInfo.status === 'Added (Blue)'
                            ? 'text-sky-800 font-semibold'
                            : 'text-slate-500'
                        }`}
                      >
                        {editInfo.status}
                      </div>
                      {editInfo.date && (
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          {editInfo.date}
                        </div>
                      )}
                      {editInfo.remarks && (
                        <div
                          className="text-[11px] text-slate-600 truncate max-w-[120px]"
                          title={editInfo.remarks}
                        >
                          Catatan: {editInfo.remarks}
                        </div>
                      )}
                    </td>

                    {/* CHECKLIST */}
                    <td className="py-3 px-2 text-center">
                      <label className="inline-flex items-center justify-center min-w-[34px] min-h-[34px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleChecklist(nik)}
                          aria-label={`Checklist ${nama}`}
                          className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                      </label>
                    </td>

                    {/* MATCHING STATUS (Interactive Button Toggle) */}
                    <td className="py-3 px-2.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onToggleMatchingStatus(nik)}
                        aria-label={`Ubah status matching ${nama}`}
                        className={`min-h-[32px] px-2 py-1 rounded-md text-xs font-semibold inline-flex items-center gap-1 border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          matchVal === 'sesuai'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {matchVal === 'sesuai' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Sesuai</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>Tidak Sesuai</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* ACTIONS: VIEW FAMILY & EDIT */}
                    <td className="py-3 px-2.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenFamilyModal(kk)}
                          className="min-h-[32px] px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <GitFork className="w-3.5 h-3.5 shrink-0" />
                          <span>View Family</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(originalIndex)}
                          aria-label={`Edit ${nama}`}
                          className="min-h-[32px] px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 shrink-0" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile / Touch-First Card View */}
      <div className={showCardsClass}>
        {paginatedRows.map(({ originalIndex, row }, idx) => {
          const rowNumber = startIndex + idx + 1;
          const kk = row[1] || '';
          const nik = row[2] || '';
          const nama = row[3] || '-';
          const gender = row[4] || '';
          const alamat = row[5] || '-';
          const ttl = row[6] || '';
          const fallbackAge = row[7] || '';
          const shdk = row[10] || '';
          const pekerjaan = row[12] || '';

          const age = calculateAge(ttl, fallbackAge);
          const eligible = isEligibleVoter(age);
          const zodiac = getZodiacInfo(ttl);
          const weton = getWetonInfo(ttl);
          const isChecked = Boolean(viewedRecords[nik]);
          const matchVal = matchingStatus[nik] || 'tidak-sesuai';
          const editInfo = editedRecords[nik] || { status: 'Not Edited' };

          return (
            <article
              key={`mobile-${nik}-${originalIndex}`}
              className={`bg-white border rounded-2xl p-4 transition-colors ${
                isChecked
                  ? 'border-slate-300 bg-slate-50/40'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Header: Number, Voter Status, Age, Zodiac, Weton, Name, and Checklist */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-slate-500 font-mono tabular-nums">
                    <span>#{rowNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        eligible
                          ? 'text-emerald-700 font-sans font-semibold'
                          : 'text-blue-700 font-sans font-semibold'
                      }
                    >
                      {eligible ? 'Bisa Memilih' : 'Tidak Bisa Memilih'}
                    </span>
                    {age !== null && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{age} thn</span>
                      </>
                    )}
                    {zodiac && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-sans font-semibold text-amber-800">
                          {zodiac.symbol} {zodiac.name}
                        </span>
                      </>
                    )}
                    {weton && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-sans font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/70 text-[11px]">
                          {weton.wetonText} ({weton.neptuTotal})
                        </span>
                      </>
                    )}
                  </div>
                  <div className="mt-1">
                    <button
                      type="button"
                      onClick={() => onOpenPersonDetail(originalIndex)}
                      title={`Klik untuk melihat detail lengkap & biodata ${nama}`}
                      className="text-left text-base font-bold text-slate-900 hover:text-blue-700 transition-colors break-words cursor-pointer flex items-baseline justify-between gap-2 w-full group"
                    >
                      <span className="break-words">{nama}</span>
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 group-hover:bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200/80 shrink-0 transition-colors">
                        Detail →
                      </span>
                    </button>
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                    {gender && <span>{gender}</span>}
                    {gender && shdk && <span aria-hidden="true">·</span>}
                    {shdk && <span>{shdk}</span>}
                    {pekerjaan && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-600">{pekerjaan}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Touch-friendly 44x44 Checklist Toggle Button */}
                <button
                  type="button"
                  onClick={() => onToggleChecklist(nik)}
                  aria-label={`Checklist ${nama}`}
                  className={`min-h-[44px] min-w-[44px] rounded-xl border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                    isChecked
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-300 text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>

              {/* Card Body: Copyable NIK, KK, Tanggal Lahir + Zodiak, and Alamat */}
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">NIK:</span>
                  <button
                    type="button"
                    onClick={() => onCopyToClipboard(nik, 'NIK')}
                    className="font-mono font-medium text-slate-800 hover:text-slate-950 inline-flex items-center gap-1.5 py-1 px-2 rounded bg-slate-100 tabular-nums cursor-pointer"
                  >
                    <span>{maskNumber(nik, maskSensitive)}</span>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">No. KK:</span>
                  <button
                    type="button"
                    onClick={() => onCopyToClipboard(kk, 'No. KK')}
                    className="font-mono font-medium text-slate-800 hover:text-slate-950 inline-flex items-center gap-1.5 py-1 px-2 rounded bg-slate-100 tabular-nums cursor-pointer"
                  >
                    <span>{maskNumber(kk, maskSensitive)}</span>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Tgl Lahir & Zodiak:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {ttl || '-'}
                    {zodiac ? ` · ${zodiac.symbol} ${zodiac.name} (${zodiac.element})` : ''}
                  </span>
                </div>

                {weton && (
                  <div className="flex items-start justify-between gap-2 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                    <span className="text-slate-600 font-medium">Weton Jawa:</span>
                    <div className="text-right">
                      <span className="font-semibold text-amber-950">
                        {weton.wetonText} (Neptu {weton.neptuTotal})
                      </span>
                      <div className="text-[11px] text-amber-800 mt-0.5">
                        {weton.watak}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onCopyToClipboard(alamat, 'Alamat')}
                    title="Klik untuk menyalin Alamat lengkap"
                    className="text-left text-slate-800 hover:text-slate-950 flex items-start justify-between gap-2 w-full cursor-pointer leading-relaxed break-words"
                  >
                    <span className="break-words">{alamat}</span>
                    <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  </button>
                </div>

                {editInfo.status !== 'Not Edited' && (
                  <div className="pt-1 text-[11px] text-slate-600 flex items-center gap-1.5">
                    <span className="font-semibold text-emerald-700">
                      {editInfo.status}
                    </span>
                    {editInfo.date && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {editInfo.date}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Actions: Full-width detail button + touch actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onOpenPersonDetail(originalIndex)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-700 shrink-0" />
                  <span>Lihat Detail Lengkap & Biodata KTP</span>
                </button>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleMatchingStatus(nik)}
                    className={`min-h-[44px] px-2 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      matchVal === 'sesuai'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {matchVal === 'sesuai' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Sesuai</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-slate-500 shrink-0" />
                        <span>Tidak Sesuai</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenFamilyModal(kk)}
                    className="min-h-[44px] px-2 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <GitFork className="w-4 h-4 shrink-0" />
                    <span>Keluarga</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenEditModal(originalIndex)}
                    className="min-h-[44px] px-2 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Pencil className="w-4 h-4 shrink-0" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
