/**
 * WorkerHomeScreen
 * Shows worker's available + active jobs summary
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
import { assignmentsApi } from '../../api';
import { useAuth } from '../../context';
import {
  Card,
  StatusBadge,
  EmptyState,
  LoadingScreen,
  ScreenHeader,
  StatCard,
} from '../../components';
import { Colors, Typography } from '../../constants';
import { JobAssignment, WorkerStackParamList } from '../../types';
import { formatCurrency } from '../../utils';

type Nav = NativeStackNavigationProp<WorkerStackParamList>;

export function WorkerHomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const [jobs, setJobs] = useState<JobAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    try {
      const res = await assignmentsApi.getByWorker(user.id);
      setJobs(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const available = jobs.filter((j) => j.status === 'Available');
  const active = jobs.filter((j) =>
    ['Accepted', 'InProgress'].includes(j.status)
  );
  const completed = jobs.filter((j) =>
    ['ProofSubmitted', 'Approved'].includes(j.status)
  );

  if (loading) return <LoadingScreen message="Loading your jobs..." />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <ScreenHeader
        title={`Hi, ${user?.fullName?.split(' ')[0]} 👷`}
        subtitle="Here are your assignments"
      />

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatCard label="Available" value={available.length} icon="📋" color={Colors.info} />
        <StatCard label="Active" value={active.length} icon="⚡" color={Colors.warning} />
        <StatCard label="Done" value={completed.length} icon="✅" color={Colors.success} />
      </View>

      {/* Jobs list */}
      <FlatList
        data={jobs}
        keyExtractor={(item) => String(item.assignmentId)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchJobs(); }}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📭"
            title="No assignments yet"
            subtitle="Your admin will assign you campaigns soon"
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('JobDetail', { assignmentId: item.assignmentId })}
            activeOpacity={0.85}
          >
            <Card style={styles.jobCard}>
              <View style={styles.jobRow}>
                <View style={styles.campaignIcon}>
                  <Text style={styles.campaignIconText}>📢</Text>
                </View>
                <View style={styles.jobInfo}>
                  <Text style={styles.jobTitle} numberOfLines={1}>
                    {item.campaignTitle ?? `Campaign #${item.campaignId}`}
                  </Text>
                  {item.location && (
                    <Text style={styles.jobLocation} numberOfLines={1}>
                      📍 {item.location}
                    </Text>
                  )}
                  <Text style={styles.jobAmount}>{formatCurrency(item.amount)}</Text>
                </View>
                <StatusBadge status={item.status} size="sm" />
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
    marginBottom: 12,
    gap: 8,
  },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  jobCard: { marginBottom: 10 },
  jobRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  campaignIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  campaignIconText: { fontSize: 22 },
  jobInfo: { flex: 1 },
  jobTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  jobLocation: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  jobAmount: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginTop: 4,
  },
});
