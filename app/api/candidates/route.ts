import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Candidate from '@/models/Candidate';
import { ensureSeeded } from '@/lib/seedHelper';
import { inMemoryStore } from '@/lib/inMemoryStore';
import { ICandidate } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    await ensureSeeded();
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search')?.trim() || '';
    const stage = searchParams.get('stage') || 'all';
    const skill = searchParams.get('skill') || 'all';
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    const db = await connectToDatabase();

    if (db) {
      // Build MongoDB query
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } },
        ];
      }

      if (stage && stage !== 'all') {
        query.stage = stage;
      }

      if (skill && skill !== 'all') {
        query.skills = { $regex: new RegExp(`^${skill}$`, 'i') };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortOptions: any = {};
      if (sortBy === 'experience') {
        sortOptions.experience = sortOrder;
      } else if (sortBy === 'rating') {
        sortOptions.rating = sortOrder;
      } else if (sortBy === 'name') {
        sortOptions.name = sortOrder;
      } else {
        sortOptions.createdAt = sortOrder;
      }

      const candidates = await Candidate.find(query).sort(sortOptions).lean();

      return NextResponse.json({
        success: true,
        data: candidates,
        source: 'mongodb',
      });
    } else {
      // In-memory fallback
      let list = inMemoryStore.getAll();

      if (search) {
        const queryLower = search.toLowerCase();
        list = list.filter(
          (c) =>
            c.name.toLowerCase().includes(queryLower) ||
            c.email.toLowerCase().includes(queryLower) ||
            c.role.toLowerCase().includes(queryLower)
        );
      }

      if (stage && stage !== 'all') {
        list = list.filter((c) => c.stage === stage);
      }

      if (skill && skill !== 'all') {
        list = list.filter((c) =>
          c.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
        );
      }

      list = [...list].sort((a, b) => {
        let diff = 0;
        if (sortBy === 'experience') {
          diff = a.experience - b.experience;
        } else if (sortBy === 'rating') {
          diff = a.rating - b.rating;
        } else if (sortBy === 'name') {
          diff = a.name.localeCompare(b.name);
        } else {
          diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return sortOrder === 1 ? diff : -diff;
      });

      return NextResponse.json({
        success: true,
        data: list,
        source: 'in-memory',
      });
    }
  } catch (error: unknown) {
    console.error('Error fetching candidates:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch candidates';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, role, stage, skills, resumeUrl, experience, rating, notes } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and target role are required' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    const candidateData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      role: role.trim(),
      stage: stage || 'Applied',
      skills: Array.isArray(skills)
        ? skills.filter((s: string) => s && s.trim().length > 0)
        : typeof skills === 'string'
        ? skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [],
      resumeUrl: resumeUrl ? resumeUrl.trim() : '',
      experience: Number(experience) >= 0 ? Number(experience) : 0,
      rating: Number(rating) >= 1 && Number(rating) <= 5 ? Number(rating) : 3,
      notes: notes ? notes.trim() : '',
    };

    if (db) {
      // Check for existing candidate with same email
      const existing = await Candidate.findOne({ email: candidateData.email });
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            error: `A candidate with email "${candidateData.email}" already exists.`,
          },
          { status: 409 }
        );
      }

      const newCandidate = await Candidate.create(candidateData);
      return NextResponse.json(
        { success: true, data: newCandidate, source: 'mongodb' },
        { status: 201 }
      );
    } else {
      try {
        const created = inMemoryStore.create(candidateData as Omit<ICandidate, '_id' | 'createdAt' | 'updatedAt'>);
        return NextResponse.json(
          { success: true, data: created, source: 'in-memory' },
          { status: 201 }
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Email already exists';
        return NextResponse.json({ success: false, error: message }, { status: 409 });
      }
    }
  } catch (error: unknown) {
    console.error('Error creating candidate:', error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any)?.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A candidate with this email address already exists.' },
        { status: 409 }
      );
    }
    const message = error instanceof Error ? error.message : 'Failed to create candidate';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
