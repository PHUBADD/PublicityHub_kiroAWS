/**
 * ProviderHomeScreen
 * Provider sees their own campaigns with summary stats
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
import { Campaign, ProviderStackParamList } from '../../types';
import { formatCurrency } from '../../utils';
import { useAuth } from '../../context';

type Nav = NativeStackNavigationProp<ProviderStackParamList>;

export function ProviderHomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const res = await campaignsApi.getByUser(user.id);
      setCampaigns(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const active = campaigns.filter((c) => c.status === 'InExecution').length;
  const completed = campaigns.filter((c) => c.status === 'Completed').length;
  const totalSpend = campaigns.reduce((s, c) => s + c.amount, 0);

  if (loading) return <LoadingScreen message="Loading your campaigns..." />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={campaigns}
        keyExtractor={(c) => String(c.id)}
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
              title={`Hi, ${user?.fullName?.split(' ')[0]} 🚀`}
              subtitle="Your Campaigns"
            />
            <View style={styles.statsRow}>
              <StatCard label="Total" value={campaigns.length} icon="📢" color={Colors.primary} />
              <StatCard label="Active" value={active} icon="⚡" color={Colors.warning} />
              <StatCard label="Done" value={completed} icon="✅" color={Colors.success} />
            </View>

            {/* Total spend card */}
            <View style={styles.spendCard}>
              <Text style={styles.spendLabel}>Total Campaign Value</Text>
              <Text style={styles.spendAmount}>{formatCurrency(totalSpend)}</Text>
            </View>

            <Text style={styles.sectionTitle}>All Campaigns</Text>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            icon="📣"
            title="No campaigns yet"
            subtitle="Contact your admin to create campaigns"
          />
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate('ProviderCampaignDetail', { campaignId: item.id })
            }
          >
            <Card>
              {/* Top row */}
              <View style={styles.cardTop}>
                <View style={styles.cardIcon}>
                  <Text style={styles.cardIconText}>📢</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.cardMeta}>
                    👥 {item.assignedCount} worker{item.assignedCount !== 1 ? 's' : ''}
                  </Text>
                </View>
                <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
              </View>
              {/* Bottom row */}
              <View style={styles.cardBottom}>
                <StatusBadge status={item.status} size="sm" />
                <Text style={styles.arrowHint}>View details →</Text>
              </View>
            </Card>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  spendCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
  },
  spendLabel: {
    fontSize: Typography.sm,
    color: Colors.white + 'BB',
    marginBottom: 4,
  },
  spendAmount: {
    fontSize: Typography.xxl,
    fontWeight: Typography.extrabold,
    color: Colors.white,
  },
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
  amount: { fontSize: Typography.sm, fontWeight: Typography.bold, color: Colors.primary },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrowHint: { fontSize: Typography.xs, color: Colors.textMuted },
});
