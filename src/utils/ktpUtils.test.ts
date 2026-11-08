import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAge,
  computeStats,
  DEFAULT_HEADERS,
  filterRecords,
  getZodiacInfo,
  groupFamilyHierarchy,
  isEligibleVoter,
  maskNumber,
  parseCSV,
  SAMPLE_CSV_DATA,
  serializeCSV,
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
    editFilter: 'all',
    zodiacFilter: 'all',
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
