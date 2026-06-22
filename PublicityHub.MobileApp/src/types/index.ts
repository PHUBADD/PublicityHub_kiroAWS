/**
 * Global TypeScript types mirroring the API contracts
 * Keep these in sync with the .NET DTOs
 */

// ─── Auth ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'worker' | 'provider';

export interface User {
  id: number;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// ─── Campaigns ───────────────────────────────────────────────────────────────

export type CampaignStatus =
  | 'Draft'
  | 'Published'
  | 'PartnerInProgress'
  | 'ReadyForAssignment'
  | 'InExecution'
  | 'Completed'
  | 'Closed';

export interface Campaign {
  id: number;
  title: string;
  amount: number;
  createdByName: string;
  status: CampaignStatus;
  assignedCount: number;
  description?: string;
  location?: string;
}

export interface CreateCampaignPayload {
  title: string;
  description?: string;
  location?: string;
  amount: number;
  createdBy: number;
}

// ─── Job Assignments ─────────────────────────────────────────────────────────

export type AssignmentStatus =
  | 'Created'
  | 'Available'
  | 'Accepted'
  | 'InProgress'
  | 'ProofSubmitted'
  | 'Approved'
  | 'Rejected'
  | 'Reassigned';

export interface JobAssignment {
  assignmentId: number;
  campaignId: number;
  workerId: number;
  status: AssignmentStatus;
  campaignTitle?: string;
  amount: number;
  location?: string;
}

export interface CreateAssignmentPayload {
  campaignId: number;
  workerId: number;
}

// ─── Proofs ──────────────────────────────────────────────────────────────────

export type ProofStatus = 'Uploaded' | 'UnderReview' | 'Approved' | 'Rejected';

export interface Proof {
  id: number;
  assignmentId: number;
  imageUrl: string;
  status: ProofStatus;
  latitude?: number;
  longitude?: number;
}

export interface SubmitProofPayload {
  assignmentId: number;
  imageUrl: string;
  latitude?: number;
  longitude?: number;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface CampaignProofCount {
  campaignId: number;
  totalProofs: number;
  pendingProofs: number;
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
};

export type WorkerTabParamList = {
  WorkerHome: undefined;
  MyJobs: undefined;
  Profile: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Campaigns: undefined;
  Users: undefined;
  Profile: undefined;
};

export type ProviderTabParamList = {
  ProviderHome: undefined;
  MyCampaigns: undefined;
  Profile: undefined;
};

export type WorkerStackParamList = {
  WorkerTabs: undefined;
  JobDetail: { assignmentId: number };
  SubmitProof: { assignmentId: number; campaignTitle: string };
};

export type AdminStackParamList = {
  AdminTabs: undefined;
  CampaignDetail: { campaignId: number };
  CreateCampaign: undefined;
  AssignWorker: { campaignId: number };
  ProofReview: { campaignId: number; campaignTitle: string };
  UserList: undefined;
};

export type ProviderStackParamList = {
  ProviderTabs: undefined;
  ProviderCampaignDetail: { campaignId: number };
};
