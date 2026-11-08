import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Heart,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { IndexedCsvRow, PetungJodohResult, WetonInfo } from '../types/ktp';
import {
  calculatePetungJodoh,
  getWetonInfo,
  getZodiacInfo,
  PETUNG_DEFINITIONS,
} from '../utils/ktpUtils';

interface PetungJodohModalProps {
  isOpen: boolean;
  onClose: () => void;
  csvData: string[][];
  initialPerson1Index?: number | null;
  initialPerson2Index?: number | null;
}

export const PetungJodohModal: React.FC<PetungJodohModalProps> = ({
  isOpen,
  onClose,
  csvData,
  initialPerson1Index,
  initialPerson2Index,
}) => {
  const [mode, setMode] = useState<'fromData' | 'custom'>('fromData');

  // Mode: From Data
  const [selectedIdx1, setSelectedIdx1] = useState<number>(() => {
    if (initialPerson1Index && initialPerson1Index > 0) return initialPerson1Index;
    return 1;
  });
  const [selectedIdx2, setSelectedIdx2] = useState<number>(() => {
    if (initialPerson2Index && initialPerson2Index > 0) return initialPerson2Index;
    return 2;
  });

  // Mode: Custom Birth Dates
  const [customName1, setCustomName1] = useState<string>('Pria / Calon 1');
  const [customBirth1, setCustomBirth1] = useState<string>('1978-08-17');
  const [customName2, setCustomName2] = useState<string>('Wanita / Calon 2');
  const [customBirth2, setCustomBirth2] = useState<string>('1981-04-22');

  const [showGlossary, setShowGlossary] = useState<boolean>(false);

  // List of eligible citizens from CSV
  const citizensList = useMemo<IndexedCsvRow[]>(() => {
    if (!csvData || csvData.length <= 1) return [];
    const list: IndexedCsvRow[] = [];
    for (let i = 1; i < csvData.length; i++) {
      const row = csvData[i];
      if (row && row[3]) {
        list.push({ originalIndex: i, row });
      }
    }
    return list;
  }, [csvData]);

  // Sync initial indices if changed from props
  React.useEffect(() => {
    if (initialPerson1Index && initialPerson1Index > 0) {
      setSelectedIdx1(initialPerson1Index);
    }
    if (initialPerson2Index && initialPerson2Index > 0) {
      setSelectedIdx2(initialPerson2Index);
    }
  }, [initialPerson1Index, initialPerson2Index]);

  // Compute Petung Result
  const petungResult = useMemo<PetungJodohResult | null>(() => {
    if (mode === 'fromData') {
      const row1 = csvData[selectedIdx1];
      const row2 = csvData[selectedIdx2];
      if (!row1 || !row2) return null;

      const name1 = row1[3] || 'Warga 1';
      const name2 = row2[3] || 'Warga 2';
      const ttl1 = row1[6] || '';
      const ttl2 = row2[6] || '';

      const weton1 = getWetonInfo(ttl1);
      const weton2 = getWetonInfo(ttl2);
      if (!weton1 || !weton2) return null;

      return calculatePetungJodoh(weton1, weton2, name1, name2);
    } else {
      if (!customBirth1 || !customBirth2) return null;
      // Convert YYYY-MM-DD to DD-MM-YYYY
      const [y1, m1, d1] = customBirth1.split('-');
      const [y2, m2, d2] = customBirth2.split('-');
      if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return null;

      const dateStr1 = `${d1}-${m1}-${y1}`;
      const dateStr2 = `${d2}-${m2}-${y2}`;

      const weton1 = getWetonInfo(dateStr1);
      const weton2 = getWetonInfo(dateStr2);
      if (!weton1 || !weton2) return null;

      return calculatePetungJodoh(
        weton1,
        weton2,
        customName1.trim() || 'Pasangan 1',
        customName2.trim() || 'Pasangan 2'
      );
    }
  }, [mode, selectedIdx1, selectedIdx2, customName1, customBirth1, customName2, customBirth2, csvData]);

  if (!isOpen) return null;

  const renderWetonPill = (weton: WetonInfo) => (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
        {weton.wetonText}
      </span>
      <span className="text-slate-600 font-mono text-[11px]">
        Neptu {weton.neptuHari} + {weton.neptuPasaran} = <strong className="text-slate-900">{weton.neptuTotal}</strong>
      </span>
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="petungJodohTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Heart className="w-5 h-5 fill-rose-600 stroke-white" />
            </div>
            <div>
              <h2
                id="petungJodohTitle"
                className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2"
              >
                <span>Petung Jodoh Weton Jawa</span>
                <span className="text-[10px] font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200 uppercase tracking-wider">
                  Primbon Jawa
                </span>
              </h2>
              <p className="text-xs text-slate-600">
                Analisis kecocokan pasangan berdasarkan akumulasi Neptu hari & pasaran kelahiran.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup kalkulator jodoh"
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-5 pt-3 pb-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300">
            <button
              type="button"
              onClick={() => setMode('fromData')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                mode === 'fromData'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pilih dari Data Warga KTP
            </button>
            <button
              type="button"
              onClick={() => setMode('custom')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                mode === 'custom'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kalkulator Bebas (Input Tgl)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowGlossary((prev) => !prev)}
            className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-medium cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>{showGlossary ? 'Sembunyikan' : 'Lihat'} 8 Kategori Petung</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Couple Selection Panel */}
          {mode === 'fromData' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {/* Partner 1 Selection */}
              <div>
                <label htmlFor="selectPartner1" className="block text-xs font-semibold text-slate-700 mb-1">
                  Pihak Pertama (Suami / Pria / Warga 1)
                </label>
                <select
                  id="selectPartner1"
                  value={selectedIdx1}
                  onChange={(e) => setSelectedIdx1(parseInt(e.target.value, 10))}
                  className="w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  {citizensList.map(({ originalIndex, row }) => (
                    <option key={`p1-${originalIndex}`} value={originalIndex}>
                      #{originalIndex} - {row[3]} ({row[4] || '-'}, {row[6] || '-'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Partner 2 Selection */}
              <div>
                <label htmlFor="selectPartner2" className="block text-xs font-semibold text-slate-700 mb-1">
                  Pihak Kedua (Istri / Wanita / Warga 2)
                </label>
                <select
                  id="selectPartner2"
                  value={selectedIdx2}
                  onChange={(e) => setSelectedIdx2(parseInt(e.target.value, 10))}
                  className="w-full min-h-[42px] px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                  {citizensList.map(({ originalIndex, row }) => (
                    <option key={`p2-${originalIndex}`} value={originalIndex}>
                      #{originalIndex} - {row[3]} ({row[4] || '-'}, {row[6] || '-'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {/* Custom Person 1 */}
              <div className="space-y-2">
                <div>
                  <label htmlFor="customName1" className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pihak Pertama
                  </label>
                  <input
                    id="customName1"
                    type="text"
                    value={customName1}
                    onChange={(e) => setCustomName1(e.target.value)}
                    placeholder="Nama Pasangan 1..."
                    className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="customBirth1" className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Lahir Pihak Pertama
                  </label>
                  <input
                    id="customBirth1"
                    type="date"
                    value={customBirth1}
                    onChange={(e) => setCustomBirth1(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Custom Person 2 */}
              <div className="space-y-2">
                <div>
                  <label htmlFor="customName2" className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pihak Kedua
                  </label>
                  <input
                    id="customName2"
                    type="text"
                    value={customName2}
                    onChange={(e) => setCustomName2(e.target.value)}
                    placeholder="Nama Pasangan 2..."
                    className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label htmlFor="customBirth2" className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Lahir Pihak Kedua
                  </label>
                  <input
                    id="customBirth2"
                    type="date"
                    value={customBirth2}
                    onChange={(e) => setCustomBirth2(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {petungResult ? (
            <div className="space-y-4">
              {/* Couple Weton Cards Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Person 1 Card */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">Pihak 1</div>
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {petungResult.person1Name}
                  </div>
                  {renderWetonPill(petungResult.person1Weton)}
                  <p className="text-[11px] text-slate-500 italic">
                    Watak: {petungResult.person1Weton.watak}
                  </p>
                </div>

                {/* Person 2 Card */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="text-xs text-slate-500 font-medium">Pihak 2</div>
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {petungResult.person2Name}
                  </div>
                  {renderWetonPill(petungResult.person2Weton)}
                  <p className="text-[11px] text-slate-500 italic">
                    Watak: {petungResult.person2Weton.watak}
                  </p>
                </div>
              </div>

              {/* Main Compatibility Result Banner */}
              <div
                className={`rounded-2xl p-5 border ${
                  petungResult.status === 'Sangat Baik'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : petungResult.status === 'Baik'
                    ? 'bg-sky-50/70 border-sky-200 text-sky-950'
                    : petungResult.status === 'Perlu Waspada'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-rose-50/70 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-current/15">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider font-semibold opacity-75">
                        Hasil Perhitungan Primbon
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          petungResult.status === 'Sangat Baik'
                            ? 'bg-emerald-200/80 text-emerald-900'
                            : petungResult.status === 'Baik'
                            ? 'bg-sky-200/80 text-sky-900'
                            : petungResult.status === 'Perlu Waspada'
                            ? 'bg-amber-200/80 text-amber-900'
                            : 'bg-rose-200/80 text-rose-900'
                        }`}
                      >
                        {petungResult.status}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black mt-1">
                      {petungResult.title}
                    </h3>
                  </div>

                  {/* Compatibility Score */}
                  <div className="text-left sm:text-right">
                    <div className="text-2xl sm:text-3xl font-black tabular-nums">
                      {petungResult.persentaseKecocokan}%
                    </div>
                    <div className="text-[11px] opacity-75 font-medium">
                      Indeks Kecocokan Jodoh
                    </div>
                  </div>
                </div>

                {/* Math Breakdown Row */}
                <div className="py-3 text-xs flex flex-wrap items-center gap-x-2 gap-y-1 font-mono">
                  <span>Rumus Petung 8:</span>
                  <span className="bg-white/80 px-2 py-0.5 rounded border border-current/20 font-bold">
                    Neptu 1 ({petungResult.person1Weton.neptuTotal}) + Neptu 2 ({petungResult.person2Weton.neptuTotal}) = {petungResult.totalNeptu}
                  </span>
                  <span>dibagi 8 bersisa</span>
                  <span className="bg-white/80 px-2 py-0.5 rounded border border-current/20 font-bold">
                    {petungResult.sisaBagi8} ({petungResult.category})
                  </span>
                </div>

                {/* Meaning & Advice */}
                <div className="space-y-2 pt-2 border-t border-current/15 text-xs sm:text-sm leading-relaxed">
                  <p>
                    <strong>Makna & Karakter Rumah Tangga:</strong>{' '}
                    {petungResult.description}
                  </p>
                  <p className="bg-white/70 p-3 rounded-xl border border-current/15">
                    <strong className="block text-xs uppercase tracking-wider mb-0.5 opacity-80">
                      Petuah / Nasehat Leluhur Jawa:
                    </strong>
                    {petungResult.nasehat}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium">Data tanggal lahir belum lengkap atau tidak valid.</p>
              <p className="text-xs text-slate-400 mt-1">
                Pilih warga yang memiliki tanggal lahir atau gunakan tab Kalkulator Bebas.
              </p>
            </div>
          )}

          {/* 8 Petung Categories Glossary */}
          {showGlossary && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  8 Kategori Petung Jodoh Jawa (Sisa Bagi 8)
                </h4>
                <span className="text-[11px] text-slate-500">Kitab Betaljemur Adammakna</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(PETUNG_DEFINITIONS).map(([key, item]) => (
                  <div
                    key={key}
                    className={`p-2.5 rounded-xl border ${
                      petungResult?.sisaBagi8 === parseInt(key, 10)
                        ? 'border-amber-400 bg-amber-50/60 ring-2 ring-amber-300'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-900">
                        {key}. {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                          item.status === 'Sangat Baik'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Baik'
                            ? 'bg-sky-100 text-sky-800'
                            : item.status === 'Perlu Waspada'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.status} ({item.persentaseKecocokan}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="text-[11px] text-slate-500 hidden sm:block">
            *Tradisi kearifan lokal Jawa (Primbon Petung Neptu Hari & Pasaran).
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-h-[40px] px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
