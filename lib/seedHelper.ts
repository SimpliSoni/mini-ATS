import { connectToDatabase } from './db';
import Candidate from '@/models/Candidate';
import { INITIAL_CANDIDATES } from './mockData';
import { inMemoryStore } from './inMemoryStore';

export async function ensureSeeded(): Promise<{ seeded: boolean; count: number }> {
  const db = await connectToDatabase();

  if (db) {
    const count = await Candidate.countDocuments();
    if (count === 0) {
      await Candidate.insertMany(INITIAL_CANDIDATES);
      return { seeded: true, count: INITIAL_CANDIDATES.length };
    }
    return { seeded: false, count };
  } else {
    const list = inMemoryStore.getAll();
    return { seeded: false, count: list.length };
  }
}

export async function resetAndSeed(): Promise<{ success: boolean; count: number }> {
  const db = await connectToDatabase();

  if (db) {
    await Candidate.deleteMany({});
    const inserted = await Candidate.insertMany(INITIAL_CANDIDATES);
    return { success: true, count: inserted.length };
  } else {
    const list = inMemoryStore.reset();
    return { success: true, count: list.length };
  }
}
