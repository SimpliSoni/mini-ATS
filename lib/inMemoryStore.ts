import { ICandidate, CandidateStage, DashboardMetricsData } from './types';

// Global cache for development hot reloading
declare global {
  var __inMemoryCandidates: ICandidate[] | undefined;
}

function generateId(): string {
  return 'cand_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

function initializeStore(): ICandidate[] {
  return [];
}

if (!global.__inMemoryCandidates) {
  global.__inMemoryCandidates = initializeStore();
}

export const inMemoryStore = {
  getAll(): ICandidate[] {
    if (!global.__inMemoryCandidates) {
      global.__inMemoryCandidates = [];
    }
    return global.__inMemoryCandidates;
  },

  reset(): ICandidate[] {
    global.__inMemoryCandidates = [];
    return global.__inMemoryCandidates;
  },

  findById(id: string): ICandidate | null {
    const list = this.getAll();
    return list.find((c) => c._id === id) || null;
  },

  create(data: Omit<ICandidate, '_id' | 'createdAt' | 'updatedAt'>): ICandidate {
    const list = this.getAll();
    const existing = list.find(
      (c) => c.email.toLowerCase() === data.email.toLowerCase()
    );
    if (existing) {
      const err = new Error(`Candidate with email ${data.email} already exists`);
      // @ts-expect-error adding code for duplicate key
      err.code = 11000;
      throw err;
    }

    const now = new Date().toISOString();
    const newCandidate: ICandidate = {
      ...data,
      _id: generateId(),
      skills: Array.isArray(data.skills) ? data.skills : [],
      createdAt: now,
      updatedAt: now,
    };

    list.unshift(newCandidate);
    global.__inMemoryCandidates = list;
    return newCandidate;
  },

  update(id: string, updates: Partial<Omit<ICandidate, '_id' | 'createdAt'>>): ICandidate | null {
    const list = this.getAll();
    const index = list.findIndex((c) => c._id === id);
    if (index === -1) return null;

    if (updates.email) {
      const duplicate = list.find(
        (c) => c._id !== id && c.email.toLowerCase() === updates.email!.toLowerCase()
      );
      if (duplicate) {
        const err = new Error(`Candidate with email ${updates.email} already exists`);
        // @ts-expect-error adding code for duplicate key
        err.code = 11000;
        throw err;
      }
    }

    const existing = list[index];
    const updated: ICandidate = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    global.__inMemoryCandidates = list;
    return updated;
  },

  delete(id: string): boolean {
    const list = this.getAll();
    const index = list.findIndex((c) => c._id === id);
    if (index === -1) return false;

    list.splice(index, 1);
    global.__inMemoryCandidates = list;
    return true;
  },

  getMetrics(): DashboardMetricsData {
    const list = this.getAll();
    const totalCandidates = list.length;

    const stageCounts: Record<CandidateStage, number> = {
      Applied: 0,
      Screening: 0,
      'Technical Interview': 0,
      Offered: 0,
      Rejected: 0,
    };

    let totalExp = 0;
    const roleCounts: Record<string, number> = {};

    list.forEach((c) => {
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

    return {
      totalCandidates,
      activePipelines,
      offersExtended,
      rejectionRate,
      averageExperience,
      stageCounts,
      topRoles,
    };
  },
};
