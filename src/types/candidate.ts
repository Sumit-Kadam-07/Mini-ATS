export interface Candidate {
  id: string;
  name: string;
  role: string;
  experience: number;
  resume_link?: string;
  status: CandidateStatus;
  created_at: string;
  updated_at: string;
}

export type CandidateStatus = 'applied' | 'interview' | 'offer' | 'rejected';

export interface CandidateFormData {
  name: string;
  role: string;
  experience: number;
  resume_link?: string;
  status: CandidateStatus;
}

export interface Analytics {
  totalCandidates: number;
  statusBreakdown: StatusBreakdown[];
  roleBreakdown: RoleBreakdown[];
  averageExperience: number;
}

export interface StatusBreakdown {
  status: CandidateStatus;
  count: number;
  percentage: number;
}

export interface RoleBreakdown {
  role: string;
  count: number;
}

export interface KanbanColumn {
  id: CandidateStatus;
  title: string;
  color: string;
  bgColor: string;
  textColor: string;
}