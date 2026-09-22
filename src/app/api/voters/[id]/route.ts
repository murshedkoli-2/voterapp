import { NextRequest, NextResponse } from 'next/server';
import { updateVoter, deleteVoter } from '../../../../lib/db';
import { VoterRecord } from '../../../../types/voter';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: VoterRecord = await req.json();

    const updated = await updateVoter(id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error in PUT /api/voters/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update voter record' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteVoter(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/voters/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete voter record' },
      { status: 500 }
    );
  }
}
