import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  GitFork,
  Heart,
  List,
  Pencil,
  Trash2,
  UserPlus,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import {
  EditedRecordsMap,
  IndexedCsvRow,
  MatchingStatusMap,
} from '../types/ktp';
import {
  calculateAge,
  getWetonInfo,
  getZodiacInfo,
  isEligibleVoter,
  maskNumber,
} from '../utils/ktpUtils';
import { FamilyGraphView } from './FamilyGraphView';

interface FamilyModalProps {
  isOpen: boolean;
  kkNumber: string | null;
  initialTab?: 'graph' | 'list';
  familyMembers: IndexedCsvRow[];
  matchingStatus: MatchingStatusMap;
  editedRecords: EditedRecordsMap;
  maskSensitive: boolean;
  onClose: () => void;
  onEditMember: (originalIndex: number) => void;
  onRemoveMember: (originalIndex: number, memberName: string) => void;
  onToggleMatchingStatus: (nik: string) => void;
  onAddFamilyMember: (kkNumber: string) => void;
  onCopyToClipboard: (text: string, label: string) => void;
  onOpenPersonDetail?: (originalIndex: number) => void;
  onOpenPetungJodoh?: (person1Idx: number, person2Idx: number) => void;
}

export const FamilyModal: React.FC<FamilyModalProps> = ({
  isOpen,
  kkNumber,
  initialTab = 'graph',
  familyMembers,
  matchingStatus,
  editedRecords,
  maskSensitive,
  onClose,
  onEditMember,
  onRemoveMember,
  onToggleMatchingStatus,
  onAddFamilyMember,
  onCopyToClipboard,
  onOpenPersonDetail,
  onOpenPetungJodoh,
}) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'list'>(initialTab);

  if (!isOpen || !kkNumber) return null;

  const familyAddress = familyMembers[0]?.row[5] || '-';

  const headMember = familyMembers.find(
    (m) => (m.row[10] || '').trim().toUpperCase() === 'KEPALA KELUARGA'
  );
  const spouseMember = familyMembers.find(
    (m) => (m.row[10] || '').trim().toUpperCase() === 'ISTRI'
  );

  return (
    <div
      id="familyModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="family-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full sm:max-w-4xl rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users className="w-4 h-4 text-slate-700 shrink-0" />
                <span>Kartu Keluarga (KK)</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums font-semibold text-slate-700">
                  {familyMembers.length} Anggota
                </span>
                {headMember && spouseMember && onOpenPetungJodoh && (
                  <>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenPetungJodoh(
                          headMember.originalIndex,
                          spouseMember.originalIndex
                        )
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                      title="Hitung kecocokan Petung Jodoh Weton Suami & Istri"
                    >
                      <Heart className="w-3 h-3 fill-rose-600 stroke-rose-600" />
                      <span>Petung Pasangan</span>
                    </button>
                  </>
                )}
              </div>
              <h2
                id="family-modal-title"
                className="mt-0.5 text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2"
              >
                <span>No. KK:</span>
                <button
                  type="button"
                  onClick={() => onCopyToClipboard(kkNumber, 'No. KK')}
                  className="font-mono tabular-nums text-slate-900 hover:text-slate-700 underline decoration-slate-300 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{maskNumber(kkNumber, maskSensitive)}</span>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal keluarga"
              className="sm:hidden min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Segmented View Switcher (Graph View vs Daftar Detail) + Close Button */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            <div
              role="group"
              aria-label="Mode Tampilan Keluarga"
              className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl w-full sm:w-auto"
            >
              <button
                type="button"
                onClick={() => setActiveTab('graph')}
                className={`flex-1 sm:flex-initial min-h-[34px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'graph'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Graph Keluarga</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className={`flex-1 sm:flex-initial min-h-[34px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Daftar Detail</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal keluarga"
              className="hidden sm:flex min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 items-center justify-center shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div id="familyContent" className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'graph' ? (
            <FamilyGraphView
              kkNumber={kkNumber}
              familyMembers={familyMembers}
              matchingStatus={matchingStatus}
              maskSensitive={maskSensitive}
              onEditMember={onEditMember}
              onRemoveMember={onRemoveMember}
              onToggleMatchingStatus={onToggleMatchingStatus}
              onAddFamilyMember={onAddFamilyMember}
              onCopyToClipboard={onCopyToClipboard}
              onOpenPersonDetail={onOpenPersonDetail}
            />
          ) : (
            <>
              {familyAddress && familyAddress !== '-' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-600 block mb-0.5">
                      Alamat Kartu Keluarga:
                    </span>
                    <span className="text-slate-800">{familyAddress}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCopyToClipboard(familyAddress, 'Alamat KK')}
                    className="min-h-[34px] px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium inline-flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </button>
                </div>
              )}

              {familyMembers.map(({ originalIndex, row }, idx) => {
                const kk = row[1] || '';
                const nik = row[2] || '';
                const nama = row[3] || 'Tanpa Nama';
                const jenisKelamin = row[4] || '-';
                const alamat = row[5] || '-';
                const ttl = row[6] || '-';
                const umurData = row[7] || '-';
                const agama = row[8] || '-';
                const statusKawin = row[9] || '-';
                const hubungan = row[10] || '-';
                const pendidikan = row[11] || '-';
                const pekerjaan = row[12] || '-';

                const currentAge = calculateAge(ttl, umurData);
                const eligible = isEligibleVoter(currentAge);
                const zodiac = getZodiacInfo(ttl);
                const weton = getWetonInfo(ttl);
                const matchVal = matchingStatus[nik] || 'tidak-sesuai';
                const editInfo = editedRecords[nik];

                return (
                  <div
                    key={`${nik}-${originalIndex}`}
                    className="border border-slate-200 rounded-xl p-4 bg-white"
                  >
                    {/* Member Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                          <span className="font-mono tabular-nums font-semibold text-slate-700">
                            Anggota #{idx + 1}
                          </span>
                          {hubungan && hubungan !== '-' && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-semibold text-slate-700">
                                {hubungan}
                              </span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span
                            className={
                              eligible
                                ? 'text-emerald-700 font-semibold'
                                : 'text-blue-700 font-semibold'
                            }
                          >
                            {eligible ? 'Bisa Memilih' : 'Tidak Bisa Memilih'}
                          </span>
                          {zodiac && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-semibold text-amber-800">
                                {zodiac.symbol} {zodiac.name} ({zodiac.element})
                              </span>
                            </>
                          )}
                          {weton && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/70 text-[11px]">
                                {weton.wetonText} ({weton.neptuTotal})
                              </span>
                            </>
                          )}
                        </div>
                        {onOpenPersonDetail ? (
                          <button
                            type="button"
                            onClick={() => onOpenPersonDetail(originalIndex)}
                            className="mt-0.5 text-base font-bold text-slate-900 hover:text-blue-700 text-left cursor-pointer group flex items-center gap-1.5"
                            title={`Klik untuk melihat detail lengkap & biodata ${nama}`}
                          >
                            <span className="group-hover:underline decoration-blue-500 underline-offset-2">
                              {nama}
                            </span>
                            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              Detail
                            </span>
                          </button>
                        ) : (
                          <h3 className="text-base font-bold text-slate-900 mt-0.5">
                            {nama}
                          </h3>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Matching:</span>
                        <span
                          className={`text-xs font-bold ${
                            matchVal === 'sesuai'
                              ? 'text-emerald-700'
                              : 'text-blue-700'
                          }`}
                        >
                          {matchVal === 'sesuai' ? 'Sesuai' : 'Tidak Sesuai'}
                        </span>
                      </div>
                    </div>

                    {/* Member Demographic Details Grid */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 w-32 shrink-0">NIK:</span>
                        <button
                          type="button"
                          onClick={() => onCopyToClipboard(nik, 'NIK')}
                          className="font-mono font-semibold text-slate-900 underline decoration-slate-300 hover:decoration-slate-800 inline-flex items-center gap-1 tabular-nums cursor-pointer"
                        >
                          <span>{maskNumber(nik, maskSensitive)}</span>
                          <Copy className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 w-32 shrink-0">NO. KK:</span>
                        <button
                          type="button"
                          onClick={() => onCopyToClipboard(kk, 'No. KK')}
                          className="font-mono font-semibold text-slate-900 underline decoration-slate-300 hover:decoration-slate-800 inline-flex items-center gap-1 tabular-nums cursor-pointer"
                        >
                          <span>{maskNumber(kk, maskSensitive)}</span>
                          <Copy className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 w-32 shrink-0">
                          Jenis Kelamin:
                        </span>
                        <span className="font-medium text-slate-800">
                          {jenisKelamin}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 w-32 shrink-0">
                          Tempat/Tgl Lahir:
                        </span>
                        <span className="font-medium text-slate-800">{ttl}</span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 w-32 shrink-0">
                          Umur Saat Ini:
                        </span>
                        <span className="font-mono font-semibold text-slate-900 tabular-nums">
                          {currentAge !== null ? `${currentAge} tahun` : '-'}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 w-32 shrink-0">Zodiak:</span>
                        <span className="font-semibold text-amber-800">
                          {zodiac
                            ? `${zodiac.symbol} ${zodiac.name} (${zodiac.dateRange} · Elemen ${zodiac.element})`
                            : '-'}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 w-32 shrink-0">Weton Jawa:</span>
                        <span className="font-semibold text-amber-900">
                          {weton
                            ? `${weton.wetonText} · Neptu ${weton.neptuTotal} (${weton.neptuHari}+${weton.neptuPasaran})`
                            : '-'}
                        </span>
                      </div>

                      {weton && (
                        <div className="sm:col-span-2 flex items-start gap-2 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                          <span className="text-amber-900 font-medium w-32 shrink-0">
                            Watak Weton:
                          </span>
                          <span className="text-amber-950 font-normal">
                            {weton.watak}
                          </span>
                        </div>
                      )}

                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 w-32 shrink-0">
                          Umur (dari data):
                        </span>
                        <span className="font-mono text-slate-800 tabular-nums">
                          {umurData}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 w-32 shrink-0">Agama:</span>
                        <span className="font-medium text-slate-800">{agama}</span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 w-32 shrink-0">
                          Status Kawin:
                        </span>
                        <span className="font-medium text-slate-800">
                          {statusKawin}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 w-32 shrink-0">
                          Pendidikan:
                        </span>
                        <span className="font-medium text-slate-800">
                          {pendidikan}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-500 w-32 shrink-0">
                          Pekerjaan:
                        </span>
                        <span className="font-medium text-slate-800">
                          {pekerjaan}
                        </span>
                      </div>

                      <div className="sm:col-span-2 flex items-start gap-2 pt-1">
                        <span className="text-slate-500 w-32 shrink-0">Alamat:</span>
                        <button
                          type="button"
                          onClick={() => onCopyToClipboard(alamat, 'Alamat')}
                          className="text-left font-medium text-slate-800 hover:text-slate-950 underline decoration-slate-300 inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{alamat}</span>
                          <Copy className="w-3 h-3 text-slate-400 shrink-0" />
                        </button>
                      </div>

                      {editInfo?.remarks && (
                        <div className="sm:col-span-2 flex items-start gap-2 pt-1 text-emerald-800">
                          <span className="w-32 shrink-0 font-medium">
                            Catatan Edit:
                          </span>
                          <span>{editInfo.remarks}</span>
                        </div>
                      )}
                    </div>

                    {/* Member Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleMatchingStatus(nik)}
                          className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            matchVal === 'sesuai'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {matchVal === 'sesuai' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          )}
                          <span>Toggle Matching</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditMember(originalIndex)}
                          className="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 shrink-0" />
                          <span>Edit</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveMember(originalIndex, nama)}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onAddFamilyMember(kkNumber)}
            className="min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Family Member</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
