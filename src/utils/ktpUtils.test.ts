import test from 'node:test';
import assert from 'node:assert/strict';
import {
  auditDataQuality,
  calculateAge,
  calculatePetungJodoh,
  checkDuplicates,
  computeStats,
  DEFAULT_HEADERS,
  filterRecords,
  getZodiacInfo,
  getWetonInfo,
  groupFamilyHierarchy,
  isEligibleVoter,
  maskNumber,
  parseCSV,
  SAMPLE_CSV_DATA,
  serializeCSV,
  validateNik,
} from './ktpUtils';
import { FilterState } from '../types/ktp';

test('calculateAge parses standard Indonesian KTP TEMPAT, DD-MM-YYYY format accurately', () => {
  const refDate = new Date(2026, 10, 7); // Nov 7, 2026
  assert.equal(calculateAge('BANDUNG, 17-08-1978', undefined, refDate), 48);
  assert.equal(calculateAge('BANDUNG, 15-09-2012', undefined, refDate), 14);
  // Birthday not yet reached in 2026
  assert.equal(calculateAge('SURABAYA, 19-11-1977', undefined, refDate), 48);
});

test('getZodiacInfo accurately identifies zodiac sign, symbol, and element from birth date', () => {
  const leo = getZodiacInfo('BANDUNG, 17-08-1978');
  assert.equal(leo?.name, 'Leo');
  assert.equal(leo?.symbol, '♌');
  assert.equal(leo?.element, 'Api');

  const taurus = getZodiacInfo('BANDUNG, 22-04-1981');
  assert.equal(taurus?.name, 'Taurus');

  const capricorn = getZodiacInfo('JAKARTA, 01-01-1990');
  assert.equal(capricorn?.name, 'Capricorn');

  assert.equal(getZodiacInfo('INVALID'), null);
});

test('calculateAge falls back to fallbackAge when date string is invalid or missing', () => {
  const refDate = new Date(2026, 10, 7);
  assert.equal(calculateAge('INVALID_DATE', '35', refDate), 35);
  assert.equal(calculateAge('', '', refDate), null);
});

test('isEligibleVoter returns true for age >= 17 and false otherwise', () => {
  assert.equal(isEligibleVoter(17), true);
  assert.equal(isEligibleVoter(45), true);
  assert.equal(isEligibleVoter(16), false);
  assert.equal(isEligibleVoter(null), false);
});

test('maskNumber masks 16-digit NIK and NO. KK and supports unmasked mode', () => {
  const nik = '3273011708780001';
  assert.equal(maskNumber(nik, true), '327301******0001');
  assert.equal(maskNumber(nik, false), '3273011708780001');
  assert.equal(maskNumber('', true), '-');
});

test('parseCSV and serializeCSV roundtrip RFC 4180 data with commas in addresses', () => {
  const serialized = serializeCSV(SAMPLE_CSV_DATA);
  const parsed = parseCSV(serialized);
  assert.equal(parsed.length, SAMPLE_CSV_DATA.length);
  assert.equal(parsed[0][1], 'NO. KK');
  assert.equal(parsed[1][3], 'BUDI SANTOSO');
  assert.equal(parsed[1][5], 'JL. MERDEKA NO. 45 RT 002 RW 005, KEL. BABAKAN CIAMIS');
});

test('filterRecords filters by searchTerm, address, checklist, matchingStatus, voterStatus, and zodiacFilter', () => {
  const baseFilters: FilterState = {
    searchTerm: '',
    addressFilter: '',
    checklistFilter: 'all',
    matchingFilter: 'all',
    voterFilter: 'all',
    ageFilter: 'all',
    editFilter: 'all',
    zodiacFilter: 'all',
    pasaranFilter: 'all',
    itemsPerPage: 10,
  };

  const refDate = new Date(2026, 10, 7);
  const all = filterRecords(SAMPLE_CSV_DATA, baseFilters, {}, {}, {}, refDate);
  assert.equal(all.length, 12);

  // Filter by address "DAGO"
  const dagoOnly = filterRecords(
    SAMPLE_CSV_DATA,
    { ...baseFilters, addressFilter: 'dago' },
    {},
    {},
    {},
    refDate
  );
  assert.equal(dagoOnly.length, 3);

  // Filter by non-eligible voters (< 17 years old)
  const minors = filterRecords(
    SAMPLE_CSV_DATA,
    { ...baseFilters, voterFilter: 'non-eligible' },
    {},
    {},
    {},
    refDate
  );
  assert.equal(minors.length, 2);

  // Filter by Zodiac Leo
  const leos = filterRecords(
    SAMPLE_CSV_DATA,
    { ...baseFilters, zodiacFilter: 'Leo' },
    {},
    {},
    {},
    refDate
  );
  assert.equal(leos.length, 1);
  assert.equal(leos[0].row[3], 'BUDI SANTOSO');

  // Filter by Pasaran Wage (Budi Santoso: 17-08-1978 is Kamis Wage)
  const wageRecords = filterRecords(
    SAMPLE_CSV_DATA,
    { ...baseFilters, pasaranFilter: 'Wage' },
    {},
    {},
    {},
    refDate
  );
  assert.ok(wageRecords.length > 0);
  assert.ok(wageRecords.some((r) => r.row[3] === 'BUDI SANTOSO'));
});

test('groupFamilyHierarchy separates heads/spouses and children cleanly', () => {
  const family1 = SAMPLE_CSV_DATA.slice(1, 5).map((row, idx) => ({
    originalIndex: idx + 1,
    row,
  }));
  const grouped = groupFamilyHierarchy('3273011405090012', family1);
  assert.equal(grouped.heads.length, 2);
  assert.equal(grouped.children.length, 2);
  assert.equal(grouped.extended.length, 0);
});

test('computeStats calculates accurate family, voter, checked, and matched counts', () => {
  const refDate = new Date(2026, 10, 7);
  const stats = computeStats(
    SAMPLE_CSV_DATA,
    { '3273011708780001': true, '3273016204810002': true },
    { '3273011708780001': 'sesuai' },
    { '3273011708780001': { status: 'Edited (Green)', date: '2026-11-07' } },
    refDate
  );

  assert.equal(stats.totalRecords, 12);
  assert.equal(stats.totalFamilies, 4);
  assert.equal(stats.eligibleVoters, 10);
  assert.equal(stats.nonEligibleVoters, 2);
  assert.equal(stats.checkedCount, 2);
  assert.equal(stats.matchedCount, 1);
  assert.equal(stats.editedCount, 1);
  assert.equal(DEFAULT_HEADERS.length, 13);
});

test('validateNik checks 16-digit length, extracts birth date and gender', () => {
  // Male (day 17)
  const maleNik = validateNik('3273011708780001');
  assert.equal(maleNik.isValid, true);
  assert.equal(maleNik.genderEstimated, 'LAKI-LAKI');
  assert.equal(maleNik.birthDateEstimated, '17-08-1978');

  // Female (day 22 + 40 = 62)
  const femaleNik = validateNik('3273016204810002');
  assert.equal(femaleNik.isValid, true);
  assert.equal(femaleNik.genderEstimated, 'PEREMPUAN');
  assert.equal(femaleNik.birthDateEstimated, '22-04-1981');

  // Invalid length
  const invalidShort = validateNik('12345');
  assert.equal(invalidShort.isValid, false);
});

test('checkDuplicates detects duplicate NIKs or names across records', () => {
  const testData = [
    DEFAULT_HEADERS,
    ['1', 'KK1', '3273011708780001', 'BUDI', '', '', '', '', '', '', '', '', ''],
    ['2', 'KK2', '3273011708780001', 'BUDI DUPLIKAT', '', '', '', '', '', '', '', '', ''],
  ];
  const { duplicateNiks } = checkDuplicates(testData);
  assert.equal(duplicateNiks.has('3273011708780001'), true);
  assert.equal(duplicateNiks.get('3273011708780001')?.length, 2);
});

test('getWetonInfo accurately calculates Javanese Day, Pasaran, Neptu, and Watak', () => {
  // 1. Proklamasi 17 Agustus 1945 was Jumat Legi
  const proklamasi = getWetonInfo('JAKARTA, 17-08-1945');
  assert.ok(proklamasi);
  assert.equal(proklamasi.hari, 'Jumat');
  assert.equal(proklamasi.pasaran, 'Legi');
  assert.equal(proklamasi.neptuHari, 6);
  assert.equal(proklamasi.neptuPasaran, 5);
  assert.equal(proklamasi.neptuTotal, 11);
  assert.equal(proklamasi.wetonText, 'Jumat Legi');
  assert.ok(proklamasi.watak.includes('Lakuning Bintang'));

  // 2. Budi Santoso: 17 Agustus 1978 was Kamis Wage
  const budi = getWetonInfo('BANDUNG, 17-08-1978');
  assert.ok(budi);
  assert.equal(budi.hari, 'Kamis');
  assert.equal(budi.pasaran, 'Wage');
  assert.equal(budi.neptuHari, 8);
  assert.equal(budi.neptuPasaran, 4);
  assert.equal(budi.neptuTotal, 12);
  assert.equal(budi.wetonText, 'Kamis Wage');
  assert.ok(budi.watak.includes('Lakuning Kembang'));

  // 3. Siti Rahmawati: 22 April 1981 was Rabu Pon
  const siti = getWetonInfo('BANDUNG, 22-04-1981');
  assert.ok(siti);
  assert.equal(siti.hari, 'Rabu');
  assert.equal(siti.pasaran, 'Pon');
  assert.equal(siti.neptuHari, 7);
  assert.equal(siti.neptuPasaran, 7);
  assert.equal(siti.neptuTotal, 14);
  assert.equal(siti.wetonText, 'Rabu Pon');
  assert.ok(siti.watak.includes('Lakuning Rembulan'));

  // 4. Invalid birth date returns null
  assert.equal(getWetonInfo('INVALID_DATE'), null);
  assert.equal(getWetonInfo(''), null);
});

test('calculatePetungJodoh accurately calculates compatibility between husband and wife', () => {
  const budiWeton = getWetonInfo('BANDUNG, 17-08-1978'); // Kamis Wage: 12
  const sitiWeton = getWetonInfo('BANDUNG, 22-04-1981'); // Rabu Pon: 14
  assert.ok(budiWeton);
  assert.ok(sitiWeton);

  // Total Neptu = 12 + 14 = 26. 26 % 8 = 2 (RATU)
  const result = calculatePetungJodoh(
    budiWeton,
    sitiWeton,
    'BUDI SANTOSO',
    'SITI RAHMAWATI'
  );
  assert.equal(result.totalNeptu, 26);
  assert.equal(result.sisaBagi8, 2);
  assert.equal(result.category, 'RATU');
  assert.equal(result.status, 'Sangat Baik');
  assert.equal(result.persentaseKecocokan, 95);
  assert.ok(result.title.includes('Ratu'));
});

test('auditDataQuality audits dataset health and detects anomalies and demographic counts', () => {
  const audit = auditDataQuality(SAMPLE_CSV_DATA);
  assert.equal(audit.totalRecords, 12);
  assert.ok(audit.healthScore >= 90);
  assert.ok(audit.firstTimeVoterCount >= 1); // e.g. Rizky (22) or Fajar (18)
  assert.equal(Array.isArray(audit.anomalies), true);

  // When duplicate NIK is injected
  const dirtyData = [
    DEFAULT_HEADERS,
    ['1', 'KK1', '3273011708780001', 'BUDI', '', '', 'BANDUNG, 17-08-1978', '48', '', '', '', '', ''],
    ['2', 'KK2', '3273011708780001', 'BUDI 2', '', '', 'BANDUNG, 17-08-1978', '48', '', '', '', '', ''],
  ];
  const dirtyAudit = auditDataQuality(dirtyData);
  assert.ok(dirtyAudit.anomalies.some((a) => a.type === 'duplicate-nik'));
});


