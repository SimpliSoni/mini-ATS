import { NextResponse } from 'next/server';
import { resetAndSeed } from '@/lib/seedHelper';

export async function POST() {
  try {
    const result = await resetAndSeed();
    return NextResponse.json({
      success: true,
      message: `Database successfully re-seeded with ${result.count} candidates`,
      count: result.count,
    });
  } catch (error: unknown) {
    console.error('Error seeding candidates:', error);
    const message = error instanceof Error ? error.message : 'Failed to seed database';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  // Allow simple GET trigger as well for easy browser testing
  return POST();
}
