export type Gender = 'female' | 'male' | 'other';
export type VoterStatus = 'active' | 'inactive' | 'deceased' | 'transferred';

export interface VoterRecord {
  serial_no: string;
  gender: Gender;
  name: string;
  voter_id: string;
  father_name: string;
  mother_name: string;
  occupation: string;
  date_of_birth: string;
  address: string;
  district: string;
  upazila: string;
  union: string;
  ward_number: string;
  voter_area: string;
  voter_area_code: string;
  status: VoterStatus;
}

export interface VoterFilterState {
  searchQuery: string;
  gender: string;
  status: string;
  district: string;
  upazila: string;
  union: string;
  ward_number: string;
}

export type SortField = 'serial_no' | 'name' | 'voter_id' | 'date_of_birth' | 'district' | 'status';
export type SortOrder = 'asc' | 'desc';
