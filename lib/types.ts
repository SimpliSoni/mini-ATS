export type CandidateStage =
  | 'Applied'
  | 'Screening'
  | 'Technical Interview'
  | 'Offered'
  | 'Rejected';

export interface ICandidate {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  stage: CandidateStage;
  skills: string[];
  resumeUrl: string;
  experience: number;
  rating: number; // 1 to 5
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type CandidateFormData = Omit<ICandidate, '_id' | 'createdAt' | 'updatedAt'>;

export interface DashboardMetricsData {
  totalCandidates: number;
  activePipelines: number;
  offersExtended: number;
  rejectionRate: number; // percentage, e.g. 15.5
  averageExperience: number;
  stageCounts: Record<CandidateStage, number>;
  topRoles: { role: string; count: number }[];
  recentActivity?: {
    candidateName: string;
    stage: CandidateStage;
    time: string;
  }[];
}

export interface CandidateFilters {
  search: string;
  stage: string; // 'all' or specific stage
  skill: string; // 'all' or specific skill
  sortBy: 'date' | 'experience' | 'rating' | 'name';
  sortOrder: 'asc' | 'desc';
}
