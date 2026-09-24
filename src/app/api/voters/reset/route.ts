import { NextResponse } from 'next/server';
import { clearAllVoters, getAllVoters } from '../../../../lib/db';

export async function POST() {
  try {
    await clearAllVoters();
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
