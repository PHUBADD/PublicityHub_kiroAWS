/**
 * ProviderCampaignDetailScreen
 * Read-only campaign detail for the provider (they can't do lifecycle changes)
 */
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { campaignsApi, proofsApi } from '../../api';
import { Card, StatusBadge, LoadingScreen, EmptyState, StatCard } from '../../components';
import { Colors, Typography } from '../../constants';
import { Campaign, Proof, ProviderStackParamList } from '../../types';
import { formatCurrency } from '../../utils';

type Route = RouteProp<ProviderStackParamList, 'ProviderCampaignDetail'>;

export function ProviderCampaignDetailScreen() {
  const { params } = useRoute<Route>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [campRes, proofRes] = await Promise.all([
        campaignsApi.getAll(),
        proofsApi.getByCampaign(params.campaignId),
      ]);
      setCampaign(campRes.data.find((c) => c.id === params.campaignId) ?? null);
      setProofs(proofRes.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [params.campaignId]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingScreen />;
  if (!campaign) return <EmptyState icon="❓" title="Campaign not found" />;

  const approvedProofs = proofs.filter((p) => p.status === 'Approved').length;
  const pendingProofs = proofs.filter((p) => p.status === 'UnderReview').length;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroEmoji}>📢</Text>
          </View>
          <View style={styles.heroMeta}>
            <Text style={styles.heroTitle}>{campaign.title}</Text>
            <StatusBadge status={campaign.status} size="sm" />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard label="Amount" value={formatCurrency(campaign.amount)} icon="💰" color={Colors.primary} />
          <StatCard label="Workers" value={campaign.assignedCount} icon="👥" color={Colors.info} />
        </View>
        <View style={styles.statsRow}>
          <StatCard label="Approved" value={approvedProofs} icon="✅" color={Colors.success} />
          <StatCard label="Pending" value={pendingProofs} icon="⏳" color={Colors.warning} />
        </View>

        {/* Campaign info */}
        <Text style={styles.sectionTitle}>Campaign Details</Text>
        <Card>
          <InfoRow label="Status" value={campaign.status} />
          <InfoRow label="Assigned Workers" value={`${campaign.assignedCount}`} />
          <InfoRow label="Total Proofs" value={`${proofs.length}`} />
          <InfoRow label="Approved Proofs" value={`${approvedProofs}`} />
        </Card>

        {/* Progress */}
        {campaign.assignedCount > 0 && (
          <>
            <Text style={styles.sectionTitle}>Completion Progress</Text>
            <Card>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Proofs Approved</Text>
                <Text style={styles.progressValue}>
                  {approvedProofs}/{campaign.assignedCount}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(100, (approvedProofs / campaign.assignedCount) * 100)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressPct}>
                {Math.round((approvedProofs / campaign.assignedCount) * 100)}% complete
              </Text>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  label: { fontSize: Typography.sm, color: Colors.textSecondary },
  value: { fontSize: Typography.sm, fontWeight: Typography.medium, color: Colors.textPrimary },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: { fontSize: 28 },
  heroMeta: { flex: 1, gap: 6 },
  heroTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: { fontSize: Typography.sm, color: Colors.textSecondary },
  progressValue: { fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.textPrimary },
  progressBar: {
    height: 8,
    backgroundColor: Colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressPct: {
    fontSize: Typography.xs,
    color: Colors.success,
    fontWeight: Typography.medium,
    marginTop: 6,
  },
});
