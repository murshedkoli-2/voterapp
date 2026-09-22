import { NextRequest, NextResponse } from 'next/server';
import { batchImportVoters } from '../../../../lib/db';
import { VoterRecord } from '../../../../types/voter';

export async function POST(req: NextRequest) {
  try {
    const { records, mode }: { records: VoterRecord[]; mode: 'merge' | 'update' | 'replace' } = await req.json();

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid voter records found' },
        { status: 400 }
      );
    }

    const result = await batchImportVoters(records, mode || 'update');
    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Error in POST /api/voters/import:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete batch import' },
      { status: 500 }
    );
  }
}
