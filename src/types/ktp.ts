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

export interface FilterState {
  searchTerm: string;
  addressFilter: string;
  checklistFilter: 'all' | 'checked' | 'unchecked';
  matchingFilter: 'all' | 'sesuai' | 'tidak-sesuai';
  voterFilter: 'all' | 'eligible' | 'non-eligible';
  editFilter: 'all' | 'edited' | 'added' | 'unmodified';
  zodiacFilter: 'all' | ZodiacSign;
  itemsPerPage: number;
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
