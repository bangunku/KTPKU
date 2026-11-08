export type MatchingStatusValue = 'sesuai' | 'tidak-sesuai';

export type EditStatusType = 'Not Edited' | 'Edited (Green)' | 'Added (Blue)';

export interface EditRecordInfo {
  status: EditStatusType;
  date?: string;
  remarks?: string;
}

export type ViewedRecordsMap = Record<string, boolean>;
export type EditedRecordsMap = Record<string, EditRecordInfo>;
export type MatchingStatusMap = Record<string, MatchingStatusValue>;

export type ZodiacSign =
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces'
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius';

export interface ZodiacInfo {
  name: ZodiacSign;
  symbol: string;
  element: 'Api' | 'Tanah' | 'Udara' | 'Air';
  dateRange: string;
}

export type Pasaran = 'Legi' | 'Pahing' | 'Pon' | 'Wage' | 'Kliwon';

export interface WetonInfo {
  hari: string;
  pasaran: Pasaran;
  neptuHari: number;
  neptuPasaran: number;
  neptuTotal: number;
  wetonText: string;
  watak: string;
}

export type AgeCategoryFilter =
  | 'all'
  | 'first-time' // 17-21 tahun
  | 'productive' // 22-59 tahun
  | 'elderly' // >= 60 tahun
  | 'under17'; // < 17 tahun

export interface FilterState {
  searchTerm: string;
  addressFilter: string;
  checklistFilter: 'all' | 'checked' | 'unchecked';
  matchingFilter: 'all' | 'sesuai' | 'tidak-sesuai';
  voterFilter: 'all' | 'eligible' | 'non-eligible';
  ageFilter: AgeCategoryFilter;
  editFilter: 'all' | 'edited' | 'added' | 'unmodified';
  zodiacFilter: 'all' | ZodiacSign;
  pasaranFilter: 'all' | Pasaran;
  itemsPerPage: number;
}

export type PetungCategory =
  | 'PEGAT'
  | 'RATU'
  | 'JODOH'
  | 'TOPO'
  | 'TINARI'
  | 'PADU'
  | 'SUJANAN'
  | 'PESTHI';

export interface PetungJodohResult {
  person1Name: string;
  person1Weton: WetonInfo;
  person2Name: string;
  person2Weton: WetonInfo;
  totalNeptu: number;
  sisaBagi8: number;
  category: PetungCategory;
  title: string;
  status: 'Sangat Baik' | 'Baik' | 'Perlu Waspada' | 'Tantangan';
  description: string;
  nasehat: string;
  persentaseKecocokan: number;
}

export interface DataAnomalyItem {
  id: string;
  originalIndex: number;
  row: string[];
  type:
    | 'duplicate-nik'
    | 'invalid-nik'
    | 'nik-mismatch'
    | 'underage-head'
    | 'no-head-in-kk';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

export interface DataAuditSummary {
  totalRecords: number;
  cleanCount: number;
  healthScore: number;
  firstTimeVoterCount: number;
  elderlyCount: number;
  anomalies: DataAnomalyItem[];
}

export interface IndexedCsvRow {
  originalIndex: number; // Index inside csvData (1-based since 0 is header)
  row: string[];
}

export interface KtpBackupData {
  csvData: string[][];
  viewedRecords: ViewedRecordsMap;
  editedRecords: EditedRecordsMap;
  matchingStatus: MatchingStatusMap;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
