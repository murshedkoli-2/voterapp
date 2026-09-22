import { NextResponse } from 'next/server';
import { seedInitialVoters, getAllVoters, batchImportVoters } from '../../../../lib/db';
import { INITIAL_VOTERS } from '../../../../data/initialVoters';

export async function POST() {
  try {
    await batchImportVoters(INITIAL_VOTERS, 'replace');
    const voters = await getAllVoters();
    return NextResponse.json({ success: true, data: voters });
  } catch (error) {
    console.error('Error in POST /api/voters/reset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset database' },
      { status: 500 }
    );
  }
}
