import React from 'react';
import {
  CheckCircle2,
  Copy,
  GitFork,
  Pencil,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react';
import { IndexedCsvRow, MatchingStatusMap } from '../types/ktp';
import {
  calculateAge,
  getZodiacInfo,
  groupFamilyHierarchy,
  isEligibleVoter,
  maskNumber,
} from '../utils/ktpUtils';

interface FamilyGraphViewProps {
  kkNumber: string;
  familyMembers: IndexedCsvRow[];
  matchingStatus: MatchingStatusMap;
  maskSensitive: boolean;
  onEditMember: (originalIndex: number) => void;
  onRemoveMember?: (originalIndex: number, memberName: string) => void;
  onToggleMatchingStatus: (nik: string) => void;
  onAddFamilyMember?: (kkNumber: string) => void;
  onCopyToClipboard: (text: string, label: string) => void;
  compact?: boolean;
}

export const FamilyGraphView: React.FC<FamilyGraphViewProps> = ({
  kkNumber,
  familyMembers,
  matchingStatus,
  maskSensitive,
  onEditMember,
  onRemoveMember,
  onToggleMatchingStatus,
  onAddFamilyMember,
  onCopyToClipboard,
  compact = false,
}) => {
  const hierarchy = groupFamilyHierarchy(kkNumber, familyMembers);

  const eligibleCount = familyMembers.filter(({ row }) =>
    isEligibleVoter(calculateAge(row[6], row[7]))
  ).length;

  const matchedCount = familyMembers.filter(
    ({ row }) => matchingStatus[row[2] || ''] === 'sesuai'
  ).length;

  const renderMemberNode = (
    { originalIndex, row }: IndexedCsvRow,
    tierType: 'head' | 'child' | 'extended'
  ) => {
    const nik = row[2] || '';
    const nama = row[3] || 'Tanpa Nama';
    const gender = row[4] || '-';
    const ttl = row[6] || '-';
    const umurData = row[7] || '-';
    const hubungan = row[10] || (tierType === 'head' ? 'KEPALA KELUARGA' : 'ANGGOTA');
    const pendidikan = row[11] || '-';
    const pekerjaan = row[12] || '-';

    const age = calculateAge(ttl, umurData);
    const eligible = isEligibleVoter(age);
    const zodiac = getZodiacInfo(ttl);
    const matchVal = matchingStatus[nik] || 'tidak-sesuai';

    const isKepala = hubungan.toUpperCase().includes('KEPALA');

    return (
      <div
        key={`node-${nik}-${originalIndex}`}
        data-testid={`family-node-${nik}`}
        className={`relative bg-white rounded-xl border transition-all text-left w-full ${
          compact ? 'sm:w-[270px]' : 'sm:w-[290px]'
        } ${
          isKepala
            ? 'border-slate-900 shadow-xs'
            : matchVal === 'sesuai'
            ? 'border-emerald-300'
            : 'border-slate-200'
        } p-3.5 flex flex-col justify-between`}
      >
        {/* Top Role & Voter Status Header */}
        <div>
          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold">
            <span
              className={
                isKepala
                  ? 'text-slate-900 uppercase tracking-tight'
                  : 'text-slate-600 uppercase tracking-tight'
              }
            >
              {hubungan}
            </span>
            <span className={eligible ? 'text-emerald-700' : 'text-blue-700'}>
              {eligible ? 'Bisa Memilih' : 'Belum Pemilih'}
            </span>
          </div>

          {/* Full Name */}
          <h4 className="mt-1 text-sm font-bold text-slate-900 leading-snug">
            {nama}
          </h4>

          {/* Gender, Age & Zodiac Line (Unboxed clean metadata) */}
          <div className="mt-1 text-xs text-slate-600 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span>{gender}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono font-semibold text-slate-800 tabular-nums">
              {age !== null ? `${age} thn` : `${umurData} thn`}
            </span>
            {zodiac && (
              <>
                <span aria-hidden="true">·</span>
                <span
                  className="font-semibold text-amber-800 inline-flex items-center gap-1"
                  title={`Zodiak ${zodiac.name} (${zodiac.dateRange}) · Elemen ${zodiac.element}`}
                >
                  <span aria-hidden="true">{zodiac.symbol}</span>
                  <span>{zodiac.name}</span>
                  <span className="text-slate-400 font-normal">({zodiac.element})</span>
                </span>
              </>
            )}
          </div>

          {/* Detailed Birth & NIK Box */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-slate-500 shrink-0">NIK:</span>
              <button
                type="button"
                onClick={() => onCopyToClipboard(nik, 'NIK')}
                className="font-mono font-semibold text-slate-800 hover:text-slate-950 underline decoration-slate-300 inline-flex items-center gap-1 tabular-nums cursor-pointer"
              >
                <span>{maskNumber(nik, maskSensitive)}</span>
                <Copy className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <span className="text-slate-500 shrink-0">Tgl Lahir:</span>
              <span className="text-slate-700 text-right truncate max-w-[175px]" title={ttl}>
                {ttl}
              </span>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <span className="text-slate-500 shrink-0">Pekerjaan:</span>
              <span
                className="text-slate-700 text-right truncate max-w-[175px]"
                title={`${pendidikan} · ${pekerjaan}`}
              >
                {pekerjaan}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Node Controls */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={() => onToggleMatchingStatus(nik)}
            className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEditMember(originalIndex)}
              aria-label={`Edit ${nama}`}
              className="min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Pencil className="w-3 h-3 shrink-0" />
              <span>Edit</span>
            </button>

            {onRemoveMember && (
              <button
                type="button"
                onClick={() => onRemoveMember(originalIndex, nama)}
                aria-label={`Hapus ${nama}`}
                className="min-h-[34px] min-w-[34px] p-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 inline-flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title={`Hapus ${nama}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      data-testid="family-graph-container"
      className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-6 overflow-x-auto"
    >
      {/* Root Node: Kartu Keluarga Summary Hub */}
      <div className="flex flex-col items-center">
        <div className="w-full max-w-xl bg-slate-900 text-white rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <GitFork className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Hierarki Kartu Keluarga (KK)</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {familyMembers.length} Anggota
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-slate-300">No. KK:</span>
                <button
                  type="button"
                  onClick={() => onCopyToClipboard(kkNumber, 'No. KK')}
                  className="font-mono text-sm sm:text-base font-bold text-white hover:text-emerald-300 underline decoration-slate-600 inline-flex items-center gap-1.5 tabular-nums cursor-pointer"
                >
                  <span>{maskNumber(kkNumber, maskSensitive)}</span>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300 font-mono tabular-nums">
              <span>{eligibleCount} Pemilih</span>
              <span aria-hidden="true">·</span>
              <span>{matchedCount} Sesuai</span>
            </div>
          </div>

          {hierarchy.address && hierarchy.address !== '-' && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-xs text-slate-300 flex items-start justify-between gap-2">
              <span className="line-clamp-2">{hierarchy.address}</span>
              <button
                type="button"
                onClick={() => onCopyToClipboard(hierarchy.address, 'Alamat KK')}
                className="text-slate-300 hover:text-white shrink-0 inline-flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Salin</span>
              </button>
            </div>
          )}
        </div>

        {/* Vertical Stem from KK Root to Tier 1 (Heads / Parents) */}
        <div className="w-0.5 h-6 bg-slate-300" aria-hidden="true" />

        {/* Tier 1 Label */}
        <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-slate-600" />
          <span>Tingkat 1 · Kepala Keluarga & Pasangan</span>
        </div>

        {/* Tier 1 Nodes: Kepala Keluarga & Istri/Suami */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 relative">
          {hierarchy.heads.map((member, index) => (
            <React.Fragment key={`head-frag-${member.originalIndex}`}>
              {renderMemberNode(member, 'head')}
              {index < hierarchy.heads.length - 1 && (
                <>
                  {/* Desktop Horizontal Connector between Spouses */}
                  <div
                    className="hidden sm:flex items-center justify-center w-8 h-0.5 bg-slate-300 shrink-0 relative"
                    aria-hidden="true"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 border-2 border-white" />
                  </div>
                  {/* Mobile Vertical Connector between Spouses */}
                  <div
                    className="sm:hidden w-0.5 h-3 bg-slate-300"
                    aria-hidden="true"
                  />
                </>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Tier 2: Children / Descendants Branch */}
        {hierarchy.children.length > 0 && (
          <div className="w-full flex flex-col items-center">
            {/* Vertical Trunk from Parents to Children Branch */}
            <div className="w-0.5 h-7 bg-slate-300" aria-hidden="true" />

            <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>
                Tingkat 2 · Anak & Keturunan ({hierarchy.children.length} Orang)
              </span>
            </div>

            {/* Horizontal Branch Line on Desktop when >= 2 children */}
            {hierarchy.children.length > 1 && (
              <div
                className="hidden sm:block w-3/5 max-w-xl h-0.5 bg-slate-300"
                aria-hidden="true"
              />
            )}

            {/* Children Nodes Container */}
            <div className="w-full flex flex-col sm:flex-row flex-wrap items-center sm:items-stretch justify-center gap-3 sm:gap-5 pt-1 sm:pt-3 border-l-2 sm:border-l-0 border-slate-300 pl-3 sm:pl-0 ml-2 sm:ml-0">
              {hierarchy.children.map((child) =>
                renderMemberNode(child, 'child')
              )}
            </div>
          </div>
        )}

        {/* Tier 3: Extended Family Members (if any) */}
        {hierarchy.extended.length > 0 && (
          <div className="w-full flex flex-col items-center mt-2">
            <div className="w-0.5 h-6 bg-slate-300" aria-hidden="true" />
            <div className="text-[11px] font-semibold text-slate-500 mb-2">
              Anggota Keluarga Lainnya ({hierarchy.extended.length} Orang)
            </div>
            <div className="w-full flex flex-col sm:flex-row flex-wrap items-center sm:items-stretch justify-center gap-3 sm:gap-5">
              {hierarchy.extended.map((ext) =>
                renderMemberNode(ext, 'extended')
              )}
            </div>
          </div>
        )}

        {/* Optional Add Family Member Node Trigger at bottom of tree */}
        {onAddFamilyMember && (
          <div className="flex flex-col items-center mt-2">
            <div className="w-0.5 h-5 bg-slate-300" aria-hidden="true" />
            <button
              type="button"
              onClick={() => onAddFamilyMember(kkNumber)}
              className="min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-dashed border-slate-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Tambah Anggota ke Pohon KK Ini</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
