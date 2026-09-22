import { neon } from '@neondatabase/serverless';
import { VoterRecord } from '../types/voter';
import { INITIAL_VOTERS } from '../data/initialVoters';

const databaseUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_vUm4DcR6xOYE@ep-twilight-tree-b40lyeqk-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require";

export const sql = neon(databaseUrl);

let isTableInitialized = false;

export async function initVotersTable() {
  if (isTableInitialized) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS voters (
        id SERIAL PRIMARY KEY,
        serial_no VARCHAR(50) NOT NULL,
        gender VARCHAR(20) NOT NULL,
        name VARCHAR(255) NOT NULL,
        voter_id VARCHAR(100) UNIQUE NOT NULL,
        father_name VARCHAR(255) DEFAULT '',
        mother_name VARCHAR(255) DEFAULT '',
        occupation VARCHAR(100) DEFAULT '',
        date_of_birth VARCHAR(50) DEFAULT '',
        address TEXT NOT NULL,
        district VARCHAR(100) NOT NULL,
        upazila VARCHAR(100) NOT NULL,
        union_name VARCHAR(100) DEFAULT '',
        ward_number VARCHAR(50) DEFAULT '1',
        voter_area VARCHAR(150) DEFAULT '',
        voter_area_code VARCHAR(50) DEFAULT '',
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_voters_voter_id ON voters(voter_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_voters_name ON voters(name);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_voters_location ON voters(district, upazila);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_voters_area_code ON voters(voter_area_code);`;

    isTableInitialized = true;
  } catch (error) {
    console.error('Error initializing voters table in Neon:', error);
    throw error;
  }
}

function mapRowToVoter(row: Record<string, unknown>): VoterRecord {
  return {
    serial_no: String(row.serial_no || ''),
    gender: (row.gender === 'female' || row.gender === 'male' || row.gender === 'other') ? row.gender : 'female',
    name: String(row.name || ''),
    voter_id: String(row.voter_id || ''),
    father_name: String(row.father_name || ''),
    mother_name: String(row.mother_name || ''),
    occupation: String(row.occupation || ''),
    date_of_birth: String(row.date_of_birth || ''),
    address: String(row.address || ''),
    district: String(row.district || ''),
    upazila: String(row.upazila || ''),
    union: String(row.union_name || row.union || ''),
    ward_number: String(row.ward_number || '1'),
    voter_area: String(row.voter_area || ''),
    voter_area_code: String(row.voter_area_code || ''),
    status: (row.status === 'active' || row.status === 'inactive' || row.status === 'deceased' || row.status === 'transferred') ? row.status : 'active',
  };
}

export async function getAllVoters(): Promise<VoterRecord[]> {
  await initVotersTable();

  const rows = await sql`
    SELECT * FROM voters ORDER BY serial_no ASC, created_at DESC;
  `;

  // Auto-seed if empty
  if (rows.length === 0) {
    await seedInitialVoters();
    const seededRows = await sql`
      SELECT * FROM voters ORDER BY serial_no ASC, created_at DESC;
    `;
    return seededRows.map(mapRowToVoter);
  }

  return rows.map(mapRowToVoter);
}

export async function createVoter(voter: VoterRecord): Promise<VoterRecord> {
  await initVotersTable();

  const rows = await sql`
    INSERT INTO voters (
      serial_no, gender, name, voter_id, father_name, mother_name,
      occupation, date_of_birth, address, district, upazila,
      union_name, ward_number, voter_area, voter_area_code, status
    ) VALUES (
      ${voter.serial_no}, ${voter.gender}, ${voter.name}, ${voter.voter_id},
      ${voter.father_name || ''}, ${voter.mother_name || ''}, ${voter.occupation || ''},
      ${voter.date_of_birth || ''}, ${voter.address}, ${voter.district}, ${voter.upazila},
      ${voter.union || ''}, ${voter.ward_number || '1'}, ${voter.voter_area || ''},
      ${voter.voter_area_code || ''}, ${voter.status || 'active'}
    )
    ON CONFLICT (voter_id) DO UPDATE SET
      serial_no = EXCLUDED.serial_no,
      gender = EXCLUDED.gender,
      name = EXCLUDED.name,
      father_name = EXCLUDED.father_name,
      mother_name = EXCLUDED.mother_name,
      occupation = EXCLUDED.occupation,
      date_of_birth = EXCLUDED.date_of_birth,
      address = EXCLUDED.address,
      district = EXCLUDED.district,
      upazila = EXCLUDED.upazila,
      union_name = EXCLUDED.union_name,
      ward_number = EXCLUDED.ward_number,
      voter_area = EXCLUDED.voter_area,
      voter_area_code = EXCLUDED.voter_area_code,
      status = EXCLUDED.status,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  return mapRowToVoter(rows[0]);
}

export async function updateVoter(voterId: string, voter: VoterRecord): Promise<VoterRecord> {
  await initVotersTable();

  const rows = await sql`
    UPDATE voters SET
      serial_no = ${voter.serial_no},
      gender = ${voter.gender},
      name = ${voter.name},
      father_name = ${voter.father_name || ''},
      mother_name = ${voter.mother_name || ''},
      occupation = ${voter.occupation || ''},
      date_of_birth = ${voter.date_of_birth || ''},
      address = ${voter.address},
      district = ${voter.district},
      upazila = ${voter.upazila},
      union_name = ${voter.union || ''},
      ward_number = ${voter.ward_number || '1'},
      voter_area = ${voter.voter_area || ''},
      voter_area_code = ${voter.voter_area_code || ''},
      status = ${voter.status || 'active'},
      updated_at = CURRENT_TIMESTAMP
    WHERE voter_id = ${voterId}
    RETURNING *;
  `;

  if (rows.length === 0) {
    return createVoter(voter);
  }

  return mapRowToVoter(rows[0]);
}

export async function deleteVoter(voterId: string): Promise<boolean> {
  await initVotersTable();

  const result = await sql`
    DELETE FROM voters WHERE voter_id = ${voterId};
  `;

  return true;
}

export async function batchImportVoters(records: VoterRecord[], mode: 'merge' | 'update' | 'replace'): Promise<{ count: number }> {
  await initVotersTable();

  if (mode === 'replace') {
    await sql`TRUNCATE TABLE voters RESTART IDENTITY;`;
  }

  let count = 0;
  for (const voter of records) {
    if (mode === 'merge') {
      // Skip if exists
      const existing = await sql`SELECT 1 FROM voters WHERE voter_id = ${voter.voter_id};`;
      if (existing.length === 0) {
        await createVoter(voter);
        count++;
      }
    } else {
      // update or replace
      await createVoter(voter);
      count++;
    }
  }

  return { count };
}

export async function seedInitialVoters(): Promise<void> {
  await initVotersTable();

  for (const voter of INITIAL_VOTERS) {
    await createVoter(voter);
  }
}
