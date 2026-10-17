import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Candidate from '@/models/Candidate';
import { ensureSeeded } from '@/lib/seedHelper';
import { inMemoryStore } from '@/lib/inMemoryStore';
import { CandidateStage, DashboardMetricsData } from '@/lib/types';

export async function GET() {
  try {
    await ensureSeeded();
    const db = await connectToDatabase();

    if (db) {
      const candidates = await Candidate.find({}, 'stage experience role createdAt').lean();
      const totalCandidates = candidates.length;

      const stageCounts: Record<CandidateStage, number> = {
        Applied: 0,
        Screening: 0,
        'Technical Interview': 0,
        Offered: 0,
        Rejected: 0,
      };

      let totalExp = 0;
      const roleCounts: Record<string, number> = {};

      candidates.forEach((c) => {
        if (stageCounts[c.stage] !== undefined) {
          stageCounts[c.stage]++;
        }
        totalExp += Number(c.experience) || 0;
        roleCounts[c.role] = (roleCounts[c.role] || 0) + 1;
      });

      const activePipelines =
        stageCounts['Applied'] + stageCounts['Screening'] + stageCounts['Technical Interview'];
      const offersExtended = stageCounts['Offered'];
      const rejectionRate =
        totalCandidates > 0
          ? Math.round((stageCounts['Rejected'] / totalCandidates) * 1000) / 10
          : 0;
      const averageExperience =
        totalCandidates > 0 ? Math.round((totalExp / totalCandidates) * 10) / 10 : 0;

      const topRoles = Object.entries(roleCounts)
        .map(([role, count]) => ({ role, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const metrics: DashboardMetricsData = {
        totalCandidates,
        activePipelines,
        offersExtended,
        rejectionRate,
        averageExperience,
        stageCounts,
        topRoles,
      };

      return NextResponse.json({ success: true, data: metrics, source: 'mongodb' });
    } else {
      const metrics = inMemoryStore.getMetrics();
      return NextResponse.json({ success: true, data: metrics, source: 'in-memory' });
    }
  } catch (error: unknown) {
    console.error('Error fetching metrics:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch metrics';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
