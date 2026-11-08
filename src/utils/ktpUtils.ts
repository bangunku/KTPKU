import {
  EditedRecordsMap,
  FilterState,
  IndexedCsvRow,
  MatchingStatusMap,
  ViewedRecordsMap,
  ZodiacInfo,
  ZodiacSign,
} from '../types/ktp';

export const ZODIAC_LIST: ZodiacInfo[] = [
  { name: 'Aries', symbol: '♈', element: 'Api', dateRange: '21 Mar – 19 Apr' },
  { name: 'Taurus', symbol: '♉', element: 'Tanah', dateRange: '20 Apr – 20 Mei' },
  { name: 'Gemini', symbol: '♊', element: 'Udara', dateRange: '21 Mei – 20 Jun' },
  { name: 'Cancer', symbol: '♋', element: 'Air', dateRange: '21 Jun – 22 Jul' },
  { name: 'Leo', symbol: '♌', element: 'Api', dateRange: '23 Jul – 22 Agu' },
  { name: 'Virgo', symbol: '♍', element: 'Tanah', dateRange: '23 Agu – 22 Sep' },
  { name: 'Libra', symbol: '♎', element: 'Udara', dateRange: '23 Sep – 22 Okt' },
  { name: 'Scorpio', symbol: '♏', element: 'Air', dateRange: '23 Okt – 21 Nov' },
  { name: 'Sagittarius', symbol: '♐', element: 'Api', dateRange: '22 Nov – 21 Des' },
  { name: 'Capricorn', symbol: '♑', element: 'Tanah', dateRange: '22 Des – 19 Jan' },
  { name: 'Aquarius', symbol: '♒', element: 'Udara', dateRange: '20 Jan – 18 Feb' },
  { name: 'Pisces', symbol: '♓', element: 'Air', dateRange: '19 Feb – 20 Mar' },
];

export const DEFAULT_HEADERS: string[] = [
  'NO',
  'NO. KK',
  'NIK',
  'NAMA',
  'JENIS KELAMIN',
  'ALAMAT',
  'TEMPAT/TGL LAHIR',
  'UMUR',
  'AGAMA',
  'STATUS',
  'HUBUNGAN KELUARGA',
  'PENDIDIKAN',
  'PEKERJAAN',
];

export const SAMPLE_CSV_DATA: string[][] = [
  DEFAULT_HEADERS,
  [
    '1',
    '3273011405090012',
    '3273011708780001',
    'BUDI SANTOSO',
    'LAKI-LAKI',
    'JL. MERDEKA NO. 45 RT 002 RW 005, KEL. BABAKAN CIAMIS',
    'BANDUNG, 17-08-1978',
    '48',
    'ISLAM',
    'KAWIN',
    'KEPALA KELUARGA',
    'S1 / STRATA-I',
    'KARYAWAN SWASTA',
  ],
  [
    '2',
    '3273011405090012',
    '3273016204810002',
    'SITI RAHMAWATI',
    'PEREMPUAN',
    'JL. MERDEKA NO. 45 RT 002 RW 005, KEL. BABAKAN CIAMIS',
    'BANDUNG, 22-04-1981',
    '45',
    'ISLAM',
    'KAWIN',
    'ISTRI',
    'DIPLOMA III',
    'WIRASWASTA',
  ],
  [
    '3',
    '3273011405090012',
    '3273011206040003',
    'RIZKY PRATAMA SANTOSO',
    'LAKI-LAKI',
    'JL. MERDEKA NO. 45 RT 002 RW 005, KEL. BABAKAN CIAMIS',
    'BANDUNG, 12-06-2004',
    '22',
    'ISLAM',
    'BELUM KAWIN',
    'ANAK',
    'SLTA / SEDERAJAT',
    'PELAJAR / MAHASISWA',
  ],
  [
    '4',
    '3273011405090012',
    '3273015509120004',
    'NADIA PUTRI SANTOSO',
    'PEREMPUAN',
    'JL. MERDEKA NO. 45 RT 002 RW 005, KEL. BABAKAN CIAMIS',
    'BANDUNG, 15-09-2012',
    '14',
    'ISLAM',
    'BELUM KAWIN',
    'ANAK',
    'SLTP / SEDERAJAT',
    'PELAJAR / MAHASISWA',
  ],
  [
    '5',
    '3273022011100088',
    '3273020503740001',
    'HENDRA WIJAYA',
    'LAKI-LAKI',
    'JL. DAGO ASRI BLOK B-12 RT 004 RW 002, KEL. DAGO',
    'JAKARTA, 05-03-1974',
    '52',
    'KRISTEN',
    'KAWIN',
    'KEPALA KELUARGA',
    'S2 / STRATA-II',
    'PEGAWAI NEGERI SIPIL',
  ],
  [
    '6',
    '3273022011100088',
    '3273025911770002',
    'MARIA KRISTINA',
    'PEREMPUAN',
    'JL. DAGO ASRI BLOK B-12 RT 004 RW 002, KEL. DAGO',
    'SURABAYA, 19-11-1977',
    '48',
    'KRISTEN',
    'KAWIN',
    'ISTRI',
    'S1 / STRATA-I',
    'DOKTER',
  ],
  [
    '7',
    '3273022011100088',
    '3273022801110003',
    'KEVIN NATHANIEL WIJAYA',
    'LAKI-LAKI',
    'JL. DAGO ASRI BLOK B-12 RT 004 RW 002, KEL. DAGO',
    'BANDUNG, 28-01-2011',
    '15',
    'KRISTEN',
    'BELUM KAWIN',
    'ANAK',
    'SLTP / SEDERAJAT',
    'PELAJAR / MAHASISWA',
  ],
  [
    '8',
    '3273031807120045',
    '3273031010850001',
    'ASEP SUNANDAR',
    'LAKI-LAKI',
    'JL. PASTEUR INDAH NO. 18 RT 001 RW 007, KEL. SUKAJAJADI',
    'GARUT, 10-10-1985',
    '41',
    'ISLAM',
    'KAWIN',
    'KEPALA KELUARGA',
    'SLTA / SEDERAJAT',
    'PEDAGANG',
  ],
  [
    '9',
    '3273031807120045',
    '3273034407880002',
    'NENG SULASTRI',
    'PEREMPUAN',
    'JL. PASTEUR INDAH NO. 18 RT 001 RW 007, KEL. SUKAJAJADI',
    'TASIKMALAYA, 04-07-1988',
    '38',
    'ISLAM',
    'KAWIN',
    'ISTRI',
    'SLTA / SEDERAJAT',
    'MENGURUS RUMAH TANGGA',
  ],
  [
    '10',
    '3273031807120045',
    '3273030202080003',
    'FAJAR SIDIK SUNANDAR',
    'LAKI-LAKI',
    'JL. PASTEUR INDAH NO. 18 RT 001 RW 007, KEL. SUKAJAJADI',
    'BANDUNG, 02-02-2008',
    '18',
    'ISLAM',
    'BELUM KAWIN',
    'ANAK',
    'SLTA / SEDERAJAT',
    'PELAJAR / MAHASISWA',
  ],
  [
    '11',
    '3273040903150021',
    '3273042105620001',
    'HJ. RATNA SARI DEWI',
    'PEREMPUAN',
    'JL. BUAH BATU NO. 102 RT 006 RW 003, KEL. CIJAGRA',
    'SUMEDANG, 21-05-1962',
    '64',
    'ISLAM',
    'CERAI MATI',
    'KEPALA KELUARGA',
    'SLTA / SEDERAJAT',
    'PENSIUNAN',
  ],
  [
    '12',
    '3273040903150021',
    '3273041412930002',
    'DEDI KURNIAWAN',
    'LAKI-LAKI',
    'JL. BUAH BATU NO. 102 RT 006 RW 003, KEL. CIJAGRA',
    'BANDUNG, 14-12-1993',
    '32',
    'ISLAM',
    'BELUM KAWIN',
    'ANAK',
    'S1 / STRATA-I',
    'GURU / DOSEN',
  ],
];

/**
 * Extracts { day, month, year, birthPlace } from KTP "TEMPAT, DD-MM-YYYY" or date strings.
 */
export function parseBirthDateParts(birthDateString?: string): {
  day: number;
  month: number;
  year: number;
  birthPlace: string;
} | null {
  if (!birthDateString || typeof birthDateString !== 'string') return null;
  const trimmed = birthDateString.trim();
  if (!trimmed) return null;

  const commaParts = trimmed.split(',');
  const birthPlace = commaParts.length >= 2 ? commaParts[0].trim() : '';
  const dateCandidate = (
    commaParts.length >= 2 ? commaParts[commaParts.length - 1] : commaParts[0]
  ).trim();

  // Match DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = dateCandidate.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = parseInt(dmyMatch[3], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900) {
      return { day, month, year, birthPlace };
    }
  }

  // Match YYYY-MM-DD
  const ymdMatch = dateCandidate.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10);
    const day = parseInt(ymdMatch[3], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900) {
      return { day, month, year, birthPlace };
    }
  }

  return null;
}

/**
 * Determines the Western Zodiac sign, symbol, element, and date range from a KTP birth date string.
 */
export function getZodiacInfo(birthDateString?: string): ZodiacInfo | null {
  const parts = parseBirthDateParts(birthDateString);
  if (!parts) return null;

  const { day, month } = parts;
  let signName: ZodiacSign;

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    signName = 'Aquarius';
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    signName = 'Pisces';
  } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    signName = 'Aries';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    signName = 'Taurus';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    signName = 'Gemini';
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    signName = 'Cancer';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    signName = 'Leo';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    signName = 'Virgo';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    signName = 'Libra';
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    signName = 'Scorpio';
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    signName = 'Sagittarius';
  } else {
    signName = 'Capricorn';
  }

  return ZODIAC_LIST.find((z) => z.name === signName) || null;
}

/**
 * Calculates age from Indonesian KTP "TEMPAT, DD-MM-YYYY" string, or direct date strings.
 * Falls back to numeric fallbackAge if birthDateString cannot be parsed.
 */
export function calculateAge(
  birthDateString?: string,
  fallbackAge?: string,
  referenceDate: Date = new Date()
): number | null {
  const parts = parseBirthDateParts(birthDateString);
  if (parts) {
    const birthDate = new Date(parts.year, parts.month - 1, parts.day);
    if (!Number.isNaN(birthDate.getTime())) {
      let age = referenceDate.getFullYear() - birthDate.getFullYear();
      const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age >= 0 ? age : 0;
    }
  }

  if (fallbackAge !== undefined && fallbackAge !== null) {
    const parsedFallback = parseInt(String(fallbackAge).trim(), 10);
    if (!Number.isNaN(parsedFallback) && parsedFallback >= 0) {
      return parsedFallback;
    }
  }

  return null;
}

/**
 * Checks whether a person is eligible to vote (>= 17 years old).
 */
export function isEligibleVoter(age: number | null): boolean {
  return age !== null && age >= 17;
}

/**
 * Masks a 16-digit NIK or NO. KK: first 6 digits + ****** + last 4 digits.
 * Preserves original value if mask is false or string is shorter than 10 chars.
 */
export function maskNumber(value?: string, shouldMask: boolean = true): string {
  const safeVal = (value ?? '').trim();
  if (!safeVal) return '-';
  if (!shouldMask) return safeVal;
  if (safeVal.length <= 10) {
    return safeVal.slice(0, 3) + '***' + safeVal.slice(-2);
  }
  return safeVal.slice(0, 6) + '******' + safeVal.slice(-4);
}

/**
 * RFC 4180 compliant CSV parser that safely handles quoted fields, commas inside quotes,
 * CRLF/LF newlines, and strips empty trailing rows.
 */
export function parseCSV(content: string): string[][] {
  if (!content || !content.trim()) return [];

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  // Normalize BOM if present
  const cleanContent = content.replace(/^\uFEFF/, '');

  for (let i = 0; i < cleanContent.length; i++) {
    const char = cleanContent[i];
    const nextChar = cleanContent[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentCell += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = '';
      } else if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
        i++;
      } else if (char === '\n' || char === '\r') {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  // Filter out completely empty rows (e.g. trailing newline in CSV)
  const nonEmptyRows = rows.filter((r) => r.some((cell) => cell.trim() !== ''));
  if (nonEmptyRows.length === 0) return [];

  // Normalize each row length to match header length (minimum 13 columns for KTP schema)
  const headerLength = Math.max(nonEmptyRows[0].length, DEFAULT_HEADERS.length);
  return nonEmptyRows.map((row, idx) => {
    const normalized = [...row];
    while (normalized.length < headerLength) {
      normalized.push(idx === 0 ? DEFAULT_HEADERS[normalized.length] || `COL_${normalized.length + 1}` : '');
    }
    return normalized;
  });
}

/**
 * Serializes a 2D array of strings back to valid RFC 4180 CSV format.
 */
export function serializeCSV(data: string[][]): string {
  if (!data || data.length === 0) return '';
  return data
    .map((row) =>
      row
        .map((cell) => {
          const safe = cell ?? '';
          if (safe.includes(',') || safe.includes('"') || safe.includes('\n')) {
            return `"${safe.replace(/"/g, '""')}"`;
          }
          return safe;
        })
        .join(',')
    )
    .join('\r\n');
}

/**
 * Filters CSV data rows (excluding header row at index 0) according to FilterState.
 */
export function filterRecords(
  csvData: string[][],
  filters: FilterState,
  viewedRecords: ViewedRecordsMap,
  matchingStatus: MatchingStatusMap,
  editedRecords: EditedRecordsMap,
  referenceDate: Date = new Date()
): IndexedCsvRow[] {
  if (!csvData || csvData.length <= 1) return [];

  const searchLower = filters.searchTerm.trim().toLowerCase();
  const addressLower = filters.addressFilter.trim().toLowerCase();

  const results: IndexedCsvRow[] = [];

  for (let i = 1; i < csvData.length; i++) {
    const row = csvData[i];
    if (!row || row.every((c) => !c || c.trim() === '')) continue;

    const nik = row[2] || '';
    const address = (row[5] || '').toLowerCase();
    const rowString = row.join(' ').toLowerCase();

    // 1. Global search term
    if (searchLower && !rowString.includes(searchLower)) {
      continue;
    }

    // 2. Address filter
    if (addressLower && !address.includes(addressLower)) {
      continue;
    }

    // 3. Checklist filter
    const isChecked = Boolean(viewedRecords[nik]);
    if (filters.checklistFilter === 'checked' && !isChecked) continue;
    if (filters.checklistFilter === 'unchecked' && isChecked) continue;

    // 4. Matching status filter (default is 'tidak-sesuai' as in original HTML)
    const rowMatchStatus = matchingStatus[nik] || 'tidak-sesuai';
    if (filters.matchingFilter === 'sesuai' && rowMatchStatus !== 'sesuai') continue;
    if (filters.matchingFilter === 'tidak-sesuai' && rowMatchStatus !== 'tidak-sesuai') continue;

    // 5. Voter eligibility filter
    if (filters.voterFilter !== 'all') {
      const age = calculateAge(row[6], row[7], referenceDate);
      const eligible = isEligibleVoter(age);
      if (filters.voterFilter === 'eligible' && !eligible) continue;
      if (filters.voterFilter === 'non-eligible' && eligible) continue;
    }

    // 6. Edit status filter
    if (filters.editFilter !== 'all') {
      const editInfo = editedRecords[nik]?.status || 'Not Edited';
      if (filters.editFilter === 'edited' && editInfo !== 'Edited (Green)') continue;
      if (filters.editFilter === 'added' && editInfo !== 'Added (Blue)') continue;
      if (filters.editFilter === 'unmodified' && editInfo !== 'Not Edited') continue;
    }

    // 7. Zodiac filter
    if (filters.zodiacFilter && filters.zodiacFilter !== 'all') {
      const zodiac = getZodiacInfo(row[6]);
      if (!zodiac || zodiac.name !== filters.zodiacFilter) continue;
    }

    results.push({ originalIndex: i, row });
  }

  return results;
}

export interface FamilyHierarchyGroup {
  kkNumber: string;
  address: string;
  heads: IndexedCsvRow[];
  children: IndexedCsvRow[];
  extended: IndexedCsvRow[];
}

/**
 * Organizes members of a Kartu Keluarga into generational / role tiers for Graph View rendering.
 */
export function groupFamilyHierarchy(
  kkNumber: string,
  members: IndexedCsvRow[]
): FamilyHierarchyGroup {
  const heads: IndexedCsvRow[] = [];
  const children: IndexedCsvRow[] = [];
  const extended: IndexedCsvRow[] = [];

  for (const item of members) {
    const role = (item.row[10] || '').trim().toUpperCase();
    if (
      role.includes('KEPALA') ||
      role.includes('ISTRI') ||
      role.includes('SUAMI') ||
      role.includes('PASANGAN')
    ) {
      heads.push(item);
    } else if (
      role.includes('ANAK') ||
      role.includes('CUCU') ||
      role.includes('MENANTU')
    ) {
      children.push(item);
    } else {
      extended.push(item);
    }
  }

  // Fallback if no explicit role matched heads: promote first member as head
  if (heads.length === 0 && extended.length > 0) {
    heads.push(extended.shift()!);
  }

  return {
    kkNumber,
    address: members[0]?.row[5] || '-',
    heads,
    children,
    extended,
  };
}

export interface KtpStatsSummary {
  totalRecords: number;
  totalFamilies: number;
  eligibleVoters: number;
  nonEligibleVoters: number;
  checkedCount: number;
  matchedCount: number;
  editedCount: number;
}

/**
 * Computes aggregate metrics across all data rows in csvData.
 */
export function computeStats(
  csvData: string[][],
  viewedRecords: ViewedRecordsMap,
  matchingStatus: MatchingStatusMap,
  editedRecords: EditedRecordsMap,
  referenceDate: Date = new Date()
): KtpStatsSummary {
  if (!csvData || csvData.length <= 1) {
    return {
      totalRecords: 0,
      totalFamilies: 0,
      eligibleVoters: 0,
      nonEligibleVoters: 0,
      checkedCount: 0,
      matchedCount: 0,
      editedCount: 0,
    };
  }

  const rows = csvData.slice(1).filter((r) => r && r.some((c) => c && c.trim() !== ''));
  const kkSet = new Set<string>();
  let eligibleVoters = 0;
  let nonEligibleVoters = 0;
  let checkedCount = 0;
  let matchedCount = 0;
  let editedCount = 0;

  for (const row of rows) {
    const kk = (row[1] || '').trim();
    const nik = (row[2] || '').trim();
    if (kk) kkSet.add(kk);

    const age = calculateAge(row[6], row[7], referenceDate);
    if (isEligibleVoter(age)) {
      eligibleVoters++;
    } else {
      nonEligibleVoters++;
    }

    if (nik && viewedRecords[nik]) {
      checkedCount++;
    }
    if (nik && matchingStatus[nik] === 'sesuai') {
      matchedCount++;
    }
    if (nik && editedRecords[nik] && editedRecords[nik].status !== 'Not Edited') {
      editedCount++;
    }
  }

  return {
    totalRecords: rows.length,
    totalFamilies: kkSet.size,
    eligibleVoters,
    nonEligibleVoters,
    checkedCount,
    matchedCount,
    editedCount,
  };
}
