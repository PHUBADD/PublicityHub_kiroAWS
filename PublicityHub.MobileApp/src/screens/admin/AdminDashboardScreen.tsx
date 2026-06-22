/**
 * AdminDashboardScreen
 * Overview of all campaigns, proof counts, and quick actions
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { campaignsApi } from '../../api';
import {
  Card,
  StatusBadge,
  EmptyState,
  LoadingScreen,
  ScreenHeader,
  StatCard,
} from '../../components';
import { Colors, Typography } from '../../constants';
import { Campaign, AdminStackParamList, CampaignProofCount } from '../../types';
import { formatCurrency } from '../../utils';
import { useAuth } from '../../context';

type Nav = NativeStackNavigationProp<AdminStackParamList>;

export function AdminDashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [proofCounts, setProofCounts] = useState<CampaignProofCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [campRes, proofRes] = await Promise.all([
        campaignsApi.getAll(),
        campaignsApi.getProofCounts(),
      ]);
      setCampaigns(campRes.data);
      setProofCounts(proofRes.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const active = campaigns.filter((c) => c.status === 'InExecution').length;
  const pending = campaigns.filter((c) => ['Draft', 'Published'].includes(c.status)).length;
  const done = campaigns.filter((c) => c.status === 'Completed').length;
  const totalPendingProofs = proofCounts.reduce((s, p) => s + p.pendingProofs, 0);

  if (loading) return <LoadingScreen message="Loading dashboard..." />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={campaigns}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(); }}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListHeaderComponent={
          <>
            <ScreenHeader
              title={`Hello, ${user?.fullName?.split(' ')[0]} 🛡️`}
              subtitle="Admin Dashboard"
              rightAction={{
                label: '+ New',
                onPress: () => navigation.navigate('CreateCampaign'),
              }}
            />

            {/* Stat cards */}
            <View style={styles.statsGrid}>
              <View style={styles.statsRow}>
                <StatCard label="Active" value={active} icon="⚡" color={Colors.warning} />
                <StatCard label="Pending" value={pending} icon="📋" color={Colors.info} />
              </View>
              <View style={styles.statsRow}>
                <StatCard label="Completed" value={done} icon="✅" color={Colors.success} />
                <StatCard label="Proof Queue" value={totalPendingProofs} icon="🔍" color={Colors.danger} />
              </View>
            </View>

            <Text style={styles.sectionTitle}>All Campaigns</Text>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            icon="📣"
            title="No campaigns yet"
            subtitle="Tap '+ New' to create your first campaign"
          />
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const pc = proofCounts.find((p) => p.campaignId === item.id);
          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('CampaignDetail', { campaignId: item.id })}
            >
              <Card>
                <View style={styles.cardTop}>
                  <View style={styles.cardIcon}>
                    <Text style={styles.cardIconText}>📢</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.cardMeta}>by {item.createdByName}</Text>
                  </View>
                  <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
                </View>

                <View style={styles.cardBottom}>
                  <StatusBadge status={item.status} size="sm" />
                  <View style={styles.metaChips}>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>👥 {item.assignedCount}</Text>
                    </View>
                    {pc && pc.pendingProofs > 0 && (
                      <View style={[styles.chip, styles.proofChip]}>
                        <Text style={styles.proofChipText}>🔍 {pc.pendingProofs} pending</Text>
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  statsGrid: { paddingHorizontal: 16, gap: 8, marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 8 },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconText: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  cardMeta: { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 2 },
  amount: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaChips: { flexDirection: 'row', gap: 6 },
  chip: {
    backgroundColor: Colors.divider,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: { fontSize: Typography.xs, color: Colors.textSecondary },
  proofChip: { backgroundColor: Colors.danger + '15' },
  proofChipText: { fontSize: Typography.xs, color: Colors.danger, fontWeight: Typography.medium },
});
