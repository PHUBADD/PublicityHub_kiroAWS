/**
 * Pure helper functions — no side effects, easy to unit test
 */
import { CampaignStatus, AssignmentStatus } from '../types';

/** Format a number as Indian Rupees */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Format ISO date string to readable format */
export function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Campaign status → display label */
export function campaignStatusLabel(status: CampaignStatus): string {
  const map: Record<CampaignStatus, string> = {
    Draft: 'Draft',
    Published: 'Published',
    PartnerInProgress: 'Partner In Progress',
    ReadyForAssignment: 'Ready to Assign',
    InExecution: 'In Execution',
    Completed: 'Completed',
    Closed: 'Closed',
  };
  return map[status] ?? status;
}

/** Assignment status → display label */
export function assignmentStatusLabel(status: AssignmentStatus): string {
  const map: Record<AssignmentStatus, string> = {
    Created: 'Created',
    Available: 'Available',
    Accepted: 'Accepted',
    InProgress: 'In Progress',
    ProofSubmitted: 'Proof Submitted',
    Approved: 'Approved',
    Rejected: 'Rejected',
    Reassigned: 'Reassigned',
  };
  return map[status] ?? status;
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Get initials from full name (e.g. "John Doe" → "JD") */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
