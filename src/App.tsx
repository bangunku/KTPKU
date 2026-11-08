import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import {
  EditedRecordsMap,
  FilterState,
  IndexedCsvRow,
  KtpBackupData,
  MatchingStatusMap,
  ToastMessage,
  ViewedRecordsMap,
} from './types/ktp';
import {
  computeStats,
  DEFAULT_HEADERS,
  filterRecords,
  parseCSV,
  SAMPLE_CSV_DATA,
  serializeCSV,
} from './utils/ktpUtils';
import { Header } from './components/Header';
import { StatsStrip } from './components/StatsStrip';
import { FilterToolbar, WorkspaceViewMode } from './components/FilterToolbar';
import { DataTable } from './components/DataTable';
import { Pagination } from './components/Pagination';
import { FamilyModal } from './components/FamilyModal';
import { EditRecordModal } from './components/EditRecordModal';
import { ConfirmModal } from './components/ConfirmModal';

const STORAGE_KEYS = {
  CSV_DATA: 'csvData',
  VIEWED_RECORDS: 'viewedRecords',
  EDITED_RECORDS: 'editedRecords',
  MATCHING_STATUS: 'matchingStatus',
};

const INITIAL_FILTERS: FilterState = {
  searchTerm: '',
  addressFilter: '',
  checklistFilter: 'all',
  matchingFilter: 'all',
  voterFilter: 'all',
  editFilter: 'all',
  zodiacFilter: 'all',
  itemsPerPage: 10,
};

function loadInitialCsvData(): string[][] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CSV_DATA);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read csvData from localStorage:', e);
  }
  // Seed with realistic sample data on first visit
  localStorage.setItem(STORAGE_KEYS.CSV_DATA, JSON.stringify(SAMPLE_CSV_DATA));
  return SAMPLE_CSV_DATA;
}

function loadStorageObject<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as T;
    }
  } catch (e) {
    console.error(`Failed to read ${key} from localStorage:`, e);
  }
  return fallback;
}

export default function App() {
  const [csvData, setCsvData] = useState<string[][]>(() => loadInitialCsvData());
  const [viewedRecords, setViewedRecords] = useState<ViewedRecordsMap>(() =>
    loadStorageObject<ViewedRecordsMap>(STORAGE_KEYS.VIEWED_RECORDS, {})
  );
  const [editedRecords, setEditedRecords] = useState<EditedRecordsMap>(() =>
    loadStorageObject<EditedRecordsMap>(STORAGE_KEYS.EDITED_RECORDS, {})
  );
  const [matchingStatus, setMatchingStatus] = useState<MatchingStatusMap>(() =>
    loadStorageObject<MatchingStatusMap>(STORAGE_KEYS.MATCHING_STATUS, {})
  );

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maskSensitive, setMaskSensitive] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<WorkspaceViewMode>('auto');

  // Modals state
  const [activeKK, setActiveKK] = useState<string | null>(null);
  const [editModalState, setEditModalState] = useState<{
    isOpen: boolean;
    isNewRecord: boolean;
    rowIndex: number;
    initialRow: string[];
  }>({
    isOpen: false,
    isNewRecord: false,
    rowIndex: -1,
    initialRow: [],
  });

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmLabel: 'Ya, Hapus',
    onConfirm: () => {},
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (
      title: string,
      description?: string,
      type: ToastMessage['type'] = 'success'
    ) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-2), { id, title, description, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CSV_DATA, JSON.stringify(csvData));
    } catch (e) {
      console.error('Error saving csvData:', e);
    }
  }, [csvData]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.VIEWED_RECORDS,
        JSON.stringify(viewedRecords)
      );
    } catch (e) {
      console.error('Error saving viewedRecords:', e);
    }
  }, [viewedRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.EDITED_RECORDS,
        JSON.stringify(editedRecords)
      );
    } catch (e) {
      console.error('Error saving editedRecords:', e);
    }
  }, [editedRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.MATCHING_STATUS,
        JSON.stringify(matchingStatus)
      );
    } catch (e) {
      console.error('Error saving matchingStatus:', e);
    }
  }, [matchingStatus]);

  // Filtered and Paginated records
  const filteredRows = useMemo(
    () =>
      filterRecords(
        csvData,
        filters,
        viewedRecords,
        matchingStatus,
        editedRecords
      ),
    [csvData, filters, viewedRecords, matchingStatus, editedRecords]
  );

  const stats = useMemo(
    () => computeStats(csvData, viewedRecords, matchingStatus, editedRecords),
    [csvData, viewedRecords, matchingStatus, editedRecords]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / filters.itemsPerPage)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * filters.itemsPerPage;
  const paginatedRows = useMemo(
    () => filteredRows.slice(startIndex, startIndex + filters.itemsPerPage),
    [filteredRows, startIndex, filters.itemsPerPage]
  );

  // Family members for currently open FamilyModal
  const activeFamilyMembers = useMemo<IndexedCsvRow[]>(() => {
    if (!activeKK || csvData.length <= 1) return [];
    const members: IndexedCsvRow[] = [];
    for (let i = 1; i < csvData.length; i++) {
      const row = csvData[i];
      if (row && (row[1] || '').trim() === activeKK.trim()) {
        members.push({ originalIndex: i, row });
      }
    }
    return members;
  }, [activeKK, csvData]);

  // Handlers
  const handleUpdateFilters = (patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...INITIAL_FILTERS,
      itemsPerPage: prev.itemsPerPage,
    }));
    setCurrentPage(1);
  };

  const handleQuickNav = (preset: 'all' | 'eligible' | 'checked' | 'sesuai') => {
    if (preset === 'all') {
      handleResetFilters();
    } else if (preset === 'eligible') {
      setFilters((prev) => ({
        ...INITIAL_FILTERS,
        itemsPerPage: prev.itemsPerPage,
        voterFilter: 'eligible',
      }));
      setCurrentPage(1);
    } else if (preset === 'checked') {
      setFilters((prev) => ({
        ...INITIAL_FILTERS,
        itemsPerPage: prev.itemsPerPage,
        checklistFilter: 'checked',
      }));
      setCurrentPage(1);
    } else if (preset === 'sesuai') {
      setFilters((prev) => ({
        ...INITIAL_FILTERS,
        itemsPerPage: prev.itemsPerPage,
        matchingFilter: 'sesuai',
      }));
      setCurrentPage(1);
    }
  };

  const handleCopyToClipboard = async (text: string, label: string) => {
    if (!text || text === '-') return;
    try {
      await navigator.clipboard.writeText(text);
      addToast(`${label} berhasil disalin`, text, 'info');
    } catch {
      // Fallback textarea copy
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      addToast(`${label} berhasil disalin`, text, 'info');
    }
  };

  const handleToggleChecklist = (nik: string) => {
    if (!nik) return;
    setViewedRecords((prev) => ({
      ...prev,
      [nik]: !prev[nik],
    }));
  };

  const handleUncheckAll = () => {
    setViewedRecords({});
    addToast('Checklist direset', 'Semua tanda checklist telah dikosongkan.', 'info');
  };

  const handleCheckAllVisible = () => {
    if (filteredRows.length === 0) return;
    setViewedRecords((prev) => {
      const next = { ...prev };
      for (const item of filteredRows) {
        const nik = item.row[2];
        if (nik) next[nik] = true;
      }
      return next;
    });
    addToast(
      'Checklist diperbarui',
      `${filteredRows.length} data hasil filter ditandai sudah dicek.`,
      'success'
    );
  };

  const handleToggleMatchingStatus = (nik: string) => {
    if (!nik) return;
    setMatchingStatus((prev) => {
      const nextVal = prev[nik] === 'sesuai' ? 'tidak-sesuai' : 'sesuai';
      return {
        ...prev,
        [nik]: nextVal,
      };
    });
  };

  const handleOpenFamilyModal = (kkNumber: string) => {
    if (!kkNumber) return;
    setActiveKK(kkNumber);
    // Mark all family members with this KK as viewed/checked (matches original HTML behavior)
    setViewedRecords((prev) => {
      const next = { ...prev };
      for (let i = 1; i < csvData.length; i++) {
        const row = csvData[i];
        if (row && row[1] === kkNumber && row[2]) {
          next[row[2]] = true;
        }
      }
      return next;
    });
  };

  const handleOpenEditModal = (originalIndex: number) => {
    const targetRow = csvData[originalIndex];
    if (!targetRow) return;
    setEditModalState({
      isOpen: true,
      isNewRecord: false,
      rowIndex: originalIndex,
      initialRow: [...targetRow],
    });
  };

  const handleAddNewRecord = () => {
    const headers = csvData[0]?.length ? csvData[0] : DEFAULT_HEADERS;
    const emptyRow = headers.map(() => '');
    emptyRow[0] = String(Math.max(1, csvData.length));
    setEditModalState({
      isOpen: true,
      isNewRecord: true,
      rowIndex: csvData.length,
      initialRow: emptyRow,
    });
  };

  const handleAddFamilyMember = (kkNumber: string) => {
    const headers = csvData[0]?.length ? csvData[0] : DEFAULT_HEADERS;
    const familySample = csvData.find((r, idx) => idx > 0 && r[1] === kkNumber);
    const newRow = headers.map(() => '');
    newRow[0] = String(Math.max(1, csvData.length));
    newRow[1] = kkNumber;
    if (familySample && familySample[5]) {
      newRow[5] = familySample[5]; // Pre-fill family address for convenience
    }
    setEditModalState({
      isOpen: true,
      isNewRecord: true,
      rowIndex: csvData.length,
      initialRow: newRow,
    });
  };

  const handleSaveRecord = (updatedRow: string[], remarks: string) => {
    const { isNewRecord, rowIndex } = editModalState;
    const nik = (updatedRow[2] || '').trim();
    const nowStr = new Date().toLocaleString('id-ID');

    setCsvData((prev) => {
      const base = prev.length > 0 ? [...prev] : [DEFAULT_HEADERS];
      if (isNewRecord || rowIndex >= base.length) {
        base.push(updatedRow);
      } else {
        base[rowIndex] = updatedRow;
      }
      return base;
    });

    if (nik) {
      setEditedRecords((prev) => ({
        ...prev,
        [nik]: {
          status: isNewRecord ? 'Added (Blue)' : 'Edited (Green)',
          date: nowStr,
          remarks,
        },
      }));
    }

    setEditModalState((prev) => ({ ...prev, isOpen: false }));
    addToast(
      isNewRecord ? 'Data baru ditambahkan' : 'Data berhasil diperbarui',
      `${updatedRow[3] || ''} (${nik})`,
      'success'
    );
  };

  const handleRemoveFamilyMember = (originalIndex: number, memberName: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Hapus Anggota Keluarga?',
      description: `Apakah Anda yakin ingin menghapus "${memberName}" dari daftar Kartu Keluarga ini?`,
      confirmLabel: 'Ya, Hapus Anggota',
      onConfirm: () => {
        setCsvData((prev) => prev.filter((_, idx) => idx !== originalIndex));
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        addToast(
          'Anggota keluarga dihapus',
          `${memberName} telah dihapus dari data.`,
          'warning'
        );
      },
    });
  };

  const handleUploadCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = String(e.target?.result || '');
      const parsed = parseCSV(content);
      if (parsed.length <= 1) {
        addToast(
          'File CSV kosong atau tidak valid',
          'Pastikan file CSV memiliki baris header dan minimal 1 baris data.',
          'error'
        );
        return;
      }
      setCsvData(parsed);
      setCurrentPage(1);
      addToast(
        'CSV berhasil diunggah',
        `Memuat ${parsed.length - 1} data penduduk.`,
        'success'
      );
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    if (csvData.length === 0) {
      addToast('Tidak ada data untuk disimpan', undefined, 'warning');
      return;
    }
    const csvContent = serializeCSV(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'updated_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('File CSV diunduh', 'updated_data.csv berhasil disimpan.', 'success');
  };

  const handleSaveStorageJSON = () => {
    const payload: KtpBackupData = {
      csvData,
      viewedRecords,
      editedRecords,
      matchingStatus,
    };
    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kpt_search_data_storage.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast(
      'Data Storage disimpan',
      'kpt_search_data_storage.json berhasil diunduh.',
      'success'
    );
  };

  const handleLoadStorageJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target?.result || '')) as Partial<KtpBackupData>;
        if (!parsed || !Array.isArray(parsed.csvData)) {
          throw new Error('Format JSON tidak memiliki array csvData');
        }
        setCsvData(parsed.csvData);
        setViewedRecords(parsed.viewedRecords || {});
        setEditedRecords(parsed.editedRecords || {});
        setMatchingStatus(parsed.matchingStatus || {});
        setCurrentPage(1);
        addToast(
          'Data Storage berhasil dimuat',
          `${Math.max(0, parsed.csvData.length - 1)} data penduduk dipulihkan.`,
          'success'
        );
      } catch {
        addToast(
          'Gagal memuat file JSON',
          'Pastikan file yang dipilih adalah cadangan JSON KTP Search yang valid.',
          'error'
        );
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteStorage = () => {
    setConfirmState({
      isOpen: true,
      title: 'Hapus Semua Data Penyimpanan?',
      description:
        'Tindakan ini akan menghapus seluruh data CSV, riwayat checklist, status edit, dan status matching dari browser Anda.',
      confirmLabel: 'Ya, Hapus Semua Data',
      onConfirm: () => {
        localStorage.removeItem(STORAGE_KEYS.CSV_DATA);
        localStorage.removeItem(STORAGE_KEYS.VIEWED_RECORDS);
        localStorage.removeItem(STORAGE_KEYS.EDITED_RECORDS);
        localStorage.removeItem(STORAGE_KEYS.MATCHING_STATUS);

        setCsvData([DEFAULT_HEADERS]);
        setViewedRecords({});
        setEditedRecords({});
        setMatchingStatus({});
        setActiveKK(null);
        setCurrentPage(1);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        addToast(
          'Seluruh data penyimpanan dihapus',
          'Klik "Data Contoh" atau "Upload CSV" untuk memuat data baru.',
          'warning'
        );
      },
    });
  };

  const handleLoadSampleData = () => {
    setCsvData(SAMPLE_CSV_DATA);
    setCurrentPage(1);
    addToast(
      'Data contoh dimuat',
      `12 data penduduk dalam 4 Kartu Keluarga siap digunakan.`,
      'success'
    );
  };

  const headers = csvData[0]?.length ? csvData[0] : DEFAULT_HEADERS;
  const editingNik = editModalState.initialRow[2] || '';
  const initialRemarks = editedRecords[editingNik]?.remarks || '';

  return (
    <div id="top" className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract Header */}
      <Header
        filters={filters}
        onQuickNav={handleQuickNav}
        onAddNewRecord={handleAddNewRecord}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Page Heading */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Manajemen & Verifikasi Data KTP / KK
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Pencarian cepat NIK, Kartu Keluarga, kelayakan pemilih (≥17 tahun), serta pencocokan lapangan.
            </p>
          </div>
        </div>

        {/* KPI Summary Strip */}
        <StatsStrip
          stats={stats}
          filteredCount={filteredRows.length}
          filters={filters}
          onApplyQuickFilter={handleUpdateFilters}
        />

        {/* Filter & Storage Toolbar */}
        <FilterToolbar
          filters={filters}
          onUpdateFilters={handleUpdateFilters}
          onResetFilters={handleResetFilters}
          onUploadCSV={handleUploadCSV}
          onExportCSV={handleExportCSV}
          onSaveStorageJSON={handleSaveStorageJSON}
          onLoadStorageJSON={handleLoadStorageJSON}
          onDeleteStorage={handleDeleteStorage}
          onLoadSampleData={handleLoadSampleData}
          onUncheckAll={handleUncheckAll}
          onCheckAllVisible={handleCheckAllVisible}
          maskSensitive={maskSensitive}
          onToggleMaskSensitive={() => setMaskSensitive((prev) => !prev)}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
        />

        {/* Desktop Table, Mobile Cards, & Family Graph View */}
        <DataTable
          paginatedRows={paginatedRows}
          allFilteredRows={filteredRows}
          startIndex={startIndex}
          viewedRecords={viewedRecords}
          editedRecords={editedRecords}
          matchingStatus={matchingStatus}
          maskSensitive={maskSensitive}
          viewMode={viewMode}
          onToggleChecklist={handleToggleChecklist}
          onToggleMatchingStatus={handleToggleMatchingStatus}
          onOpenFamilyModal={handleOpenFamilyModal}
          onOpenEditModal={handleOpenEditModal}
          onAddFamilyMember={handleAddFamilyMember}
          onCopyToClipboard={handleCopyToClipboard}
          onAddNewRecord={handleAddNewRecord}
          onLoadSampleData={handleLoadSampleData}
          hasAnyData={stats.totalRecords > 0}
        />

        {/* Pagination */}
        {viewMode !== 'graph' && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredRows.length}
            itemsPerPage={filters.itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>KTP Search & Data Management</span>
          <span>Data tersimpan secara lokal di perangkat Anda (LocalStorage & CSV/JSON)</span>
        </div>
      </footer>

      {/* Family View Modal */}
      <FamilyModal
        isOpen={Boolean(activeKK)}
        kkNumber={activeKK}
        familyMembers={activeFamilyMembers}
        matchingStatus={matchingStatus}
        editedRecords={editedRecords}
        maskSensitive={maskSensitive}
        onClose={() => setActiveKK(null)}
        onEditMember={handleOpenEditModal}
        onRemoveMember={handleRemoveFamilyMember}
        onToggleMatchingStatus={handleToggleMatchingStatus}
        onAddFamilyMember={handleAddFamilyMember}
        onCopyToClipboard={handleCopyToClipboard}
      />

      {/* Add / Edit Record Modal */}
      <EditRecordModal
        isOpen={editModalState.isOpen}
        isNewRecord={editModalState.isNewRecord}
        headers={headers}
        initialRow={editModalState.initialRow}
        initialRemarks={initialRemarks}
        onSave={handleSaveRecord}
        onClose={() => setEditModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Confirmation Dialog Modal */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        description={confirmState.description}
        confirmLabel={confirmState.confirmLabel}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="pointer-events-auto bg-slate-900 text-white rounded-xl px-4 py-3 shadow-lg border border-slate-800 flex items-start gap-2.5 text-xs"
            >
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{toast.title}</div>
                {toast.description && (
                  <div className="text-slate-300 mt-0.5 truncate font-mono">
                    {toast.description}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
                aria-label="Tutup notifikasi"
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
