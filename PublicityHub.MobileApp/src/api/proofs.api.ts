/**
 * Proof API calls
 */
import apiClient from './client';
import { Proof, SubmitProofPayload } from '../types';

export const proofsApi = {
  /** Submit proof for an assignment */
  submit: (payload: SubmitProofPayload) =>
    apiClient.post('/api/Proofs/submit', payload),

  /** Get proof for a specific assignment */
  getByAssignment: (assignmentId: number) =>
    apiClient.get<Proof>(`/api/Proofs/assignment/${assignmentId}`),

  /** Get all proofs for a campaign */
  getByCampaign: (campaignId: number) =>
    apiClient.get<Proof[]>(`/api/Proofs/campaign/${campaignId}`),

  /** Admin approves a proof */
  approve: (proofId: number) =>
    apiClient.post(`/api/Proofs/${proofId}/approve`),

  /** Admin rejects a proof */
  reject: (proofId: number) =>
    apiClient.post(`/api/Proofs/${proofId}/reject`),

  /** Get all proofs (admin dashboard) */
  getAll: () => apiClient.get<Proof[]>('/api/Proofs'),
};
