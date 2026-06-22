/**
 * Campaign API calls
 */
import apiClient from './client';
import {
  Campaign,
  CreateCampaignPayload,
  CampaignProofCount,
  Proof,
} from '../types';

export const campaignsApi = {
  /** Get all campaigns (admin) */
  getAll: () => apiClient.get<Campaign[]>('/api/Campaigns/all'),

  /** Get campaigns by creator userId (provider) */
  getByUser: (userId: number) =>
    apiClient.get<Campaign[]>(`/api/Campaigns/by-user?userId=${userId}`),

  /** Create a new campaign */
  create: (payload: CreateCampaignPayload) =>
    apiClient.post<Campaign>('/api/Campaigns', payload),

  /** Proof counts per campaign (dashboard widget) */
  getProofCounts: () =>
    apiClient.get<CampaignProofCount[]>('/api/Campaigns/proof-counts'),

  /** All proofs under a campaign */
  getProofsByCampaign: (campaignId: number) =>
    apiClient.get<Proof[]>(`/api/Campaigns/campaign/${campaignId}`),

  // ─── Lifecycle actions (Admin) ──────────────────────────────────────────
  publish: (id: number) => apiClient.post(`/api/Campaigns/${id}/publish`),

  startExecution: (id: number) => apiClient.post(`/api/Campaigns/${id}/start`),

  complete: (id: number) => apiClient.post(`/api/Campaigns/${id}/complete`),

  close: (id: number, closedBy: number, reason?: string) =>
    apiClient.post(`/api/Campaigns/${id}/close`, { closedBy, reason }),

  canComplete: (id: number) =>
    apiClient.get<{ canComplete: boolean }>(`/api/Campaigns/${id}/can-complete`),
};
