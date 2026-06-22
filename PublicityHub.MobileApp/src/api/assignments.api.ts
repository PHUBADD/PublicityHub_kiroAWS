/**
 * Job Assignment API calls
 */
import apiClient from './client';
import { JobAssignment, CreateAssignmentPayload } from '../types';

export const assignmentsApi = {
  /** Assign a worker to a campaign (admin) */
  assign: (payload: CreateAssignmentPayload) =>
    apiClient.post<JobAssignment>('/api/JobAssignments/assign', payload),

  /** Get all assignments for a specific worker */
  getByWorker: (workerId: number) =>
    apiClient.get<JobAssignment[]>(`/api/JobAssignments/worker/${workerId}`),

  /** Worker accepts an assignment */
  accept: (assignmentId: number) =>
    apiClient.post(`/api/JobAssignments/${assignmentId}/accept`),

  /** Worker completes work (triggers ProofSubmitted) */
  complete: (assignmentId: number) =>
    apiClient.post(`/api/JobAssignments/${assignmentId}/complete`),

  /** Reject an assignment */
  reject: (assignmentId: number) =>
    apiClient.post(`/api/JobAssignments/${assignmentId}/reject`),
};
