import React from 'react';
import {
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  GitFork,
  GraduationCap,
  Heart,
  MapPin,
  Pencil,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  X,
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
  validateNik,
} from '../utils/ktpUtils';

interface PersonDetailModalProps {
  isOpen: boolean;
  selectedPerson: IndexedCsvRow | null;
  matchingStatus: MatchingStatusMap;
  viewedRecords: ViewedRecordsMap;
  editedRecords: EditedRecordsMap;
  maskSensitive: boolean;
  onClose: () => void;
  onEditRecord: (originalIndex: number) => void;
  onOpenFamilyModal: (kkNumber: string) => void;
  onToggleMatchingStatus: (nik: string) => void;
  onToggleChecklist: (nik: string) => void;
  onCopyToClipboard: (text: string, label: string) => void;
}

export const PersonDetailModal: React.FC<PersonDetailModalProps> = ({
  isOpen,
  selectedPerson,
  matchingStatus,
  viewedRecords,
  editedRecords,
  maskSensitive,
  onClose,
  onEditRecord,
  onOpenFamilyModal,
  onToggleMatchingStatus,
  onToggleChecklist,
  onCopyToClipboard,
}) => {
  if (!isOpen || !selectedPerson) return null;

  const { originalIndex, row } = selectedPerson;
  const no = row[0] || '-';
  const kk = row[1] || '';
  const nik = row[2] || '';
  const nama = row[3] || 'Tanpa Nama';
  const gender = row[4] || '-';
  const alamat = row[5] || '-';
  const ttl = row[6] || '-';
  const fallbackAge = row[7] || '';
  const agama = row[8] || '-';
  const statusKawin = row[9] || '-';
  const shdk = row[10] || '-';
  const pendidikan = row[11] || '-';
  const pekerjaan = row[12] || '-';

  const age = calculateAge(ttl, fallbackAge);
  const eligible = isEligibleVoter(age);
  const zodiac = getZodiacInfo(ttl);
  const weton = getWetonInfo(ttl);
  const nikValidation = nik ? validateNik(nik) : null;

  const isChecked = Boolean(viewedRecords[nik]);
  const matchVal = matchingStatus[nik] || 'tidak-sesuai';
  const editInfo = editedRecords[nik] || { status: 'Not Edited' };

  return (
    <div
      id="personDetailModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="person-detail-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full sm:max-w-2xl md:max-w-3xl rounded-2xl border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/80 shrink-0">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
              {nama.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="font-mono tabular-nums">#{no}</span>
                <span aria-hidden="true">·</span>
                <span className="uppercase text-slate-700">{shdk}</span>
                <span aria-hidden="true">·</span>
                <span>{gender}</span>
                {editInfo.status !== 'Not Edited' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-semibold ${
                        editInfo.status === 'Edited (Green)'
                          ? 'text-emerald-700'
                          : 'text-sky-700'
                      }`}
                    >
                      {editInfo.status}
                    </span>
                  </>
                )}
              </div>
              <h2
                id="person-detail-modal-title"
                className="text-lg sm:text-xl font-bold text-slate-900 leading-snug break-words mt-0.5"
              >
                {nama}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail warga"
            className="min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 overscroll-contain">
          {/* Top Quick Status Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Hak Pilih & Usia */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
                Status Pemilih
              </span>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                    eligible
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{eligible ? 'Bisa Memilih' : 'Belum Memilih'}</span>
                </span>
                <div className="text-xs text-slate-600 font-mono tabular-nums mt-1.5 font-semibold">
                  {age !== null ? `${age} Tahun` : 'Umur tidak tersedia'}
                </div>
              </div>
            </div>

            {/* 2. Zodiak Barat */}
            <div className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/40 flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-tight">
                Zodiak Barat
              </span>
              <div className="mt-1">
                {zodiac ? (
                  <>
                    <div className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                      <span className="text-base">{zodiac.symbol}</span>
                      <span>{zodiac.name}</span>
                    </div>
                    <div className="text-[11px] text-amber-800 mt-1">
                      Elemen {zodiac.element} · {zodiac.dateRange}
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-slate-400">-</span>
                )}
              </div>
            </div>

            {/* 3. Weton Jawa & Neptu */}
            <div className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/40 flex flex-col justify-between sm:col-span-2">
              <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-tight flex items-center justify-between">
                <span>Weton & Pasaran Jawa</span>
                {weton && (
                  <span className="bg-amber-200/80 text-amber-950 text-[10.5px] px-2 py-0.5 rounded font-mono font-bold">
                    Neptu {weton.neptuTotal} ({weton.neptuHari} + {weton.neptuPasaran})
                  </span>
                )}
              </span>
              <div className="mt-1">
                {weton ? (
                  <>
                    <div className="font-bold text-sm text-amber-950">
                      {weton.wetonText}
                    </div>
                    <div className="text-[11px] text-amber-900 mt-1 italic">
                      {weton.watak}
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-slate-400">-</span>
                )}
              </div>
            </div>
          </div>

          {/* Verification Status Quick Controls */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleChecklist(nik)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{isChecked ? 'Sudah Dicek (Checked)' : 'Tandai Selesai Cek'}</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleMatchingStatus(nik)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  matchVal === 'sesuai'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {matchVal === 'sesuai' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Status Sesuai</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-slate-500" />
                    <span>Status Tidak Sesuai</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-slate-500">
              Klik tombol di atas untuk mengubah status verifikasi langsung.
            </div>
          </div>

          {/* Demographic & Identity Details Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-tight flex items-center justify-between">
              <span>Biodata Kependudukan Lengkap</span>
              <span className="text-[11px] font-normal text-slate-500">
                Sesuai Kartu Tanda Penduduk (KTP)
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              {/* NIK */}
              <div className="p-3.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 hover:bg-slate-50/60 transition-colors">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span>NIK (16 Digit):</span>
                </span>
                <div className="flex-1 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {maskNumber(nik, maskSensitive)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopyToClipboard(nik, 'NIK')}
                    className="min-h-[32px] px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin NIK</span>
                  </button>
                </div>
              </div>

              {/* NIK Structure Breakdown if valid */}
              {nikValidation && nikValidation.isValid && (
                <div className="p-3 sm:px-4 sm:py-2.5 bg-emerald-50/50 text-[11px] text-emerald-900 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-semibold">Struktur NIK:</span>
                  <span>Kode Wilayah: {nikValidation.provinceCode}·{nikValidation.regencyCode}·{nikValidation.districtCode}</span>
                  <span aria-hidden="true">·</span>
                  <span>Tgl Lahir dari NIK: {nikValidation.birthDateEstimated}</span>
                  <span aria-hidden="true">·</span>
                  <span>Kelamin: {nikValidation.genderEstimated}</span>
                </div>
              )}

              {/* NO. KK */}
              <div className="p-3.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 hover:bg-slate-50/60 transition-colors">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Nomor KK:</span>
                </span>
                <div className="flex-1 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {maskNumber(kk, maskSensitive)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onCopyToClipboard(kk, 'No. KK')}
                      className="min-h-[32px] px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Salin KK</span>
                    </button>
                    {kk && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenFamilyModal(kk);
                        }}
                        className="min-h-[32px] px-2.5 py-1 text-xs font-semibold text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <GitFork className="w-3.5 h-3.5" />
                        <span>Pohon KK</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Nama Lengkap */}
              <div className="p-3.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 hover:bg-slate-50/60 transition-colors">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Nama Lengkap:</span>
                </span>
                <span className="font-bold text-slate-900 break-words flex-1">
                  {nama}
                </span>
              </div>

              {/* Hubungan Keluarga (SHDK) & Jenis Kelamin */}
              <div className="p-3.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 hover:bg-slate-50/60 transition-colors">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0">
                  Hubungan & Kelamin:
                </span>
                <span className="text-slate-800 flex-1 font-semibold">
                  {shdk} · {gender}
                </span>
              </div>

              {/* Tempat & Tanggal Lahir */}
              <div className="p-3.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 hover:bg-slate-50/60 transition-colors">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Tempat / Tgl Lahir:</span>
                </span>
                <div className="flex-1 space-y-0.5">
                  <div className="font-semibold text-slate-900">{ttl}</div>
                  <div className="text-xs text-slate-500">
                    Umur saat ini: <span className="font-semibold text-slate-800">{age !== null ? `${age} tahun` : `${fallbackAge} tahun`}</span>
                  </div>
                </div>
              </div>

              {/* Agama & Status Perkawinan */}
              <div className="p-3.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 hover:bg-slate-50/60 transition-colors">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-slate-400" />
                  <span>Agama & Status:</span>
                </span>
                <span className="text-slate-800 flex-1">
                  {agama} · {statusKawin}
                </span>
              </div>

              {/* Pendidikan & Pekerjaan */}
              <div className="p-3.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 hover:bg-slate-50/60 transition-colors">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>Pendidikan & Pekerjaan:</span>
                </span>
                <div className="flex-1 space-y-0.5">
                  <div className="font-semibold text-slate-900">{pekerjaan}</div>
                  <div className="text-xs text-slate-600">{pendidikan}</div>
                </div>
              </div>

              {/* Alamat Lengkap Domisili (Never clipped/truncated!) */}
              <div className="p-3.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 hover:bg-slate-50/60 transition-colors">
                <span className="text-slate-500 font-medium sm:w-44 shrink-0 flex items-center gap-1.5 pt-0.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Alamat Lengkap:</span>
                </span>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <span className="text-slate-900 leading-relaxed font-medium break-words">
                    {alamat}
                  </span>
                  <button
                    type="button"
                    onClick={() => onCopyToClipboard(alamat, 'Alamat')}
                    className="min-h-[32px] px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin Alamat</span>
                  </button>
                </div>
              </div>

              {/* Remarks / Catatan jika ada */}
              {editInfo.remarks && (
                <div className="p-3.5 sm:px-4 sm:py-3 bg-amber-50/60 flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                  <span className="text-amber-900 font-semibold sm:w-44 shrink-0">
                    Catatan Verifikasi:
                  </span>
                  <span className="text-amber-950 flex-1 leading-relaxed break-words font-medium">
                    {editInfo.remarks}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            {kk && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFamilyModal(kk);
                }}
                className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <GitFork className="w-4 h-4 text-slate-600" />
                <span>Lihat Keluarga (KK)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onEditRecord(originalIndex);
              }}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit Data Warga</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
