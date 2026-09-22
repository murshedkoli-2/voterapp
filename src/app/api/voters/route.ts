import { NextRequest, NextResponse } from 'next/server';
import { getAllVoters, createVoter } from '../../../lib/db';
import { VoterRecord } from '../../../types/voter';

export async function GET() {
  try {
    const voters = await getAllVoters();
    return NextResponse.json({ success: true, data: voters });
  } catch (error) {
    console.error('Error in GET /api/voters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch voter list from database' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: VoterRecord = await req.json();

    if (!body.name || !body.voter_id || !body.district || !body.upazila) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    const created = await createVoter(body);
    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Error in POST /api/voters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save voter record' },
      { status: 500 }
    );
  }
}
