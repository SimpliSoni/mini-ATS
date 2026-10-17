import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Candidate from '@/models/Candidate';
import { inMemoryStore } from '@/lib/inMemoryStore';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, error: 'Invalid candidate ID format' },
          { status: 400 }
        );
      }

      const candidate = await Candidate.findById(id).lean();
      if (!candidate) {
        return NextResponse.json(
          { success: false, error: 'Candidate not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: candidate });
    } else {
      const candidate = inMemoryStore.findById(id);
      if (!candidate) {
        return NextResponse.json(
          { success: false, error: 'Candidate not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: candidate });
    }
  } catch (error: unknown) {
    console.error('Error fetching candidate:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch candidate';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await connectToDatabase();

    // Prepare clean updates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {};

    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.email !== undefined) updates.email = body.email.trim().toLowerCase();
    if (body.phone !== undefined) updates.phone = body.phone.trim();
    if (body.role !== undefined) updates.role = body.role.trim();
    if (body.stage !== undefined) updates.stage = body.stage;
    if (body.skills !== undefined) {
      updates.skills = Array.isArray(body.skills)
        ? body.skills.filter((s: string) => s && s.trim().length > 0)
        : typeof body.skills === 'string'
        ? body.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
    }
    if (body.resumeUrl !== undefined) updates.resumeUrl = body.resumeUrl.trim();
    if (body.experience !== undefined) updates.experience = Number(body.experience);
    if (body.rating !== undefined) updates.rating = Number(body.rating);
    if (body.notes !== undefined) updates.notes = body.notes.trim();

    if (db) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, error: 'Invalid candidate ID format' },
          { status: 400 }
        );
      }

      // If email is changing, check for uniqueness
      if (updates.email) {
        const existing = await Candidate.findOne({
          email: updates.email,
          _id: { $ne: id },
        });
        if (existing) {
          return NextResponse.json(
            {
              success: false,
              error: `A candidate with email "${updates.email}" already exists.`,
            },
            { status: 409 }
          );
        }
      }

      const updated = await Candidate.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).lean();

      if (!updated) {
        return NextResponse.json(
          { success: false, error: 'Candidate not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: updated });
    } else {
      try {
        const updated = inMemoryStore.update(id, updates);
        if (!updated) {
          return NextResponse.json(
            { success: false, error: 'Candidate not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, data: updated });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Update failed';
        return NextResponse.json({ success: false, error: message }, { status: 409 });
      }
    }
  } catch (error: unknown) {
    console.error('Error updating candidate:', error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any)?.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A candidate with this email address already exists.' },
        { status: 409 }
      );
    }
    const message = error instanceof Error ? error.message : 'Failed to update candidate';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { success: false, error: 'Invalid candidate ID format' },
          { status: 400 }
        );
      }

      const deleted = await Candidate.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json(
          { success: false, error: 'Candidate not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Candidate deleted successfully',
      });
    } else {
      const deleted = inMemoryStore.delete(id);
      if (!deleted) {
        return NextResponse.json(
          { success: false, error: 'Candidate not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Candidate deleted successfully',
      });
    }
  } catch (error: unknown) {
    console.error('Error deleting candidate:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete candidate';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
