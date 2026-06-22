/**
 * StatusBadge — colored pill for campaign / assignment status
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../constants';
import { CampaignStatus, AssignmentStatus } from '../types';

type Status = CampaignStatus | AssignmentStatus | string;

const STATUS_COLOR_MAP: Record<string, string> = {
  // Campaign
  Draft: Colors.statusDraft,
  Published: Colors.statusPublished,
  PartnerInProgress: Colors.statusPartnerInProgress,
  ReadyForAssignment: Colors.statusReadyForAssignment,
  InExecution: Colors.statusInExecution,
  Completed: Colors.statusCompleted,
  Closed: Colors.statusClosed,
  // Assignment
  Available: Colors.assignmentAvailable,
  Accepted: Colors.assignmentAccepted,
  ProofSubmitted: Colors.assignmentProofSubmitted,
  Approved: Colors.assignmentApproved,
  Rejected: Colors.assignmentRejected,
  InProgress: Colors.warning,
  Created: Colors.textMuted,
  Reassigned: Colors.info,
  // Proof
  Uploaded: Colors.info,
  UnderReview: Colors.warning,
};

const STATUS_LABEL_MAP: Record<string, string> = {
  PartnerInProgress: 'Partner In Progress',
  ReadyForAssignment: 'Ready to Assign',
  InExecution: 'In Execution',
  ProofSubmitted: 'Proof Submitted',
};

interface Props {
  status: Status;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: Props) {
  const color = STATUS_COLOR_MAP[status] ?? Colors.textMuted;
  const label = STATUS_LABEL_MAP[status] ?? status;

  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color + '55' }, size === 'sm' && styles.small]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }, size === 'sm' && styles.smallText]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  smallText: {
    fontSize: Typography.xs,
  },
});
