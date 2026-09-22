import { VoterRecord, VoterFilterState, SortField, SortOrder } from '../types/voter';

// Map between Bengali and English digits
const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function toEnglishDigits(str: string): string {
  if (!str) return '';
  return str.replace(/[০-৯]/g, (d) => ENGLISH_DIGITS[BENGALI_DIGITS.indexOf(d)] || d);
}

export function toBengaliDigits(str: string): string {
  if (!str) return '';
  return str.replace(/[0-9]/g, (d) => BENGALI_DIGITS[ENGLISH_DIGITS.indexOf(d)] || d);
}

export function normalizeString(str: string): string {
  if (!str) return '';
  return str.toLowerCase().trim();
}

/**
 * Checks if a given field value matches the search query.
 * Handles both Bengali and English numeral formats and case-insensitivity.
 */
export function fieldMatches(fieldVal: string, query: string): boolean {
  if (!fieldVal || !query) return false;

  const normalizedField = normalizeString(fieldVal);
  const normalizedQuery = normalizeString(query);

  // Direct substring match
  if (normalizedField.includes(normalizedQuery)) {
    return true;
  }

  // Cross-numeral matching (e.g. searching '120' matches Bengali digits or vice-versa)
  const enField = toEnglishDigits(normalizedField);
  const enQuery = toEnglishDigits(normalizedQuery);
  if (enField.includes(enQuery)) {
    return true;
  }

  const bnField = toBengaliDigits(normalizedField);
  const bnQuery = toBengaliDigits(normalizedQuery);
  if (bnField.includes(bnQuery)) {
    return true;
  }

  return false;
}

/**
 * Universal search across ALL fields of a voter record:
 * serial_no, gender, name, voter_id, father_name, mother_name,
 * occupation, date_of_birth, address, district, upazila, union,
 * ward_number, voter_area, voter_area_code, status
 */
export function voterMatchesQuery(voter: VoterRecord, query: string): boolean {
  if (!query.trim()) return true;

  const terms = query.trim().split(/\s+/);

  // Each term should match at least one field (AND logic across multiple words)
  return terms.every((term) => {
    return (
      fieldMatches(voter.serial_no, term) ||
      fieldMatches(voter.name, term) ||
      fieldMatches(voter.voter_id, term) ||
      fieldMatches(voter.father_name, term) ||
      fieldMatches(voter.mother_name, term) ||
      fieldMatches(voter.occupation, term) ||
      fieldMatches(voter.date_of_birth, term) ||
      fieldMatches(voter.address, term) ||
      fieldMatches(voter.district, term) ||
      fieldMatches(voter.upazila, term) ||
      fieldMatches(voter.union, term) ||
      fieldMatches(voter.ward_number, term) ||
      fieldMatches(voter.voter_area, term) ||
      fieldMatches(voter.voter_area_code, term) ||
      fieldMatches(voter.gender, term) ||
      fieldMatches(voter.status, term)
    );
  });
}

/**
 * Filters voters list with universal search and dropdown filters
 */
export function filterVoters(voters: VoterRecord[], filters: VoterFilterState): VoterRecord[] {
  return voters.filter((voter) => {
    // Universal query search
    if (filters.searchQuery && !voterMatchesQuery(voter, filters.searchQuery)) {
      return false;
    }

    // Gender filter
    if (filters.gender && filters.gender !== 'all' && voter.gender !== filters.gender) {
      return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all' && voter.status !== filters.status) {
      return false;
    }

    // District filter
    if (filters.district && filters.district !== 'all' && voter.district !== filters.district) {
      return false;
    }

    // Upazila filter
    if (filters.upazila && filters.upazila !== 'all' && voter.upazila !== filters.upazila) {
      return false;
    }

    // Union filter
    if (filters.union && filters.union !== 'all' && voter.union !== filters.union) {
      return false;
    }

    // Ward filter
    if (filters.ward_number && filters.ward_number !== 'all' && voter.ward_number !== filters.ward_number) {
      return false;
    }

    return true;
  });
}

/**
 * Sorts voters based on selected field and order
 */
export function sortVoters(
  voters: VoterRecord[],
  sortField: SortField,
  sortOrder: SortOrder
): VoterRecord[] {
  return [...voters].sort((a, b) => {
    const valA = a[sortField] || '';
    const valB = b[sortField] || '';

    let comparison = 0;
    if (sortField === 'serial_no' || sortField === 'voter_id') {
      const numA = parseInt(toEnglishDigits(valA), 10) || 0;
      const numB = parseInt(toEnglishDigits(valB), 10) || 0;
      comparison = numA - numB;
    } else {
      comparison = valA.localeCompare(valB, 'bn');
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}
