/**
 * ProofReviewScreen (Admin)
 * Lists all proofs for a campaign with Approve / Reject actions
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { proofsApi } from '../../api';
import { Card, StatusBadge, EmptyState, LoadingScreen } from '../../components';
import { Colors, Typography } from '../../constants';
import { Proof, AdminStackParamList } from '../../types';

type Route = RouteProp<AdminStackParamList, 'ProofReview'>;

export function ProofReviewScreen() {
  const { params } = useRoute<Route>();
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await proofsApi.getByCampaign(params.campaignId);
      setProofs(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [params.campaignId]);

  useEffect(() => { load(); }, [load]);

  async function handleApprove(proofId: number) {
    Alert.alert('Approve Proof', 'Approve this proof and mark assignment done?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          setActionId(proofId);
          try {
            await proofsApi.approve(proofId);
            load();
          } catch (e: any) {
            Alert.alert('Error', e.message);
          } finally {
            setActionId(null);
          }
        },
      },
    ]);
  }

  async function handleReject(proofId: number) {
    Alert.alert('Reject Proof', 'Reject this proof? Worker will need to resubmit.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          setActionId(proofId);
          try {
            await proofsApi.reject(proofId);
            load();
          } catch (e: any) {
            Alert.alert('Error', e.message);
          } finally {
            setActionId(null);
          }
        },
      },
    ]);
  }

  if (loading) return <LoadingScreen message="Loading proofs..." />;

  const pending = proofs.filter((p) => p.status === 'UnderReview');
  const reviewed = proofs.filter((p) => p.status !== 'UnderReview');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Proof Review</Text>
        <Text style={styles.subtitle}>{params.campaignTitle}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{proofs.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statNum, { color: Colors.warning }]}>{pending.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statNum, { color: Colors.success }]}>
              {proofs.filter((p) => p.status === 'Approved').length}
            </Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={proofs}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="🔍" title="No proofs submitted" subtitle="Workers haven't submitted any proof yet" />
        }
        renderItem={({ item }) => (
          <Card style={styles.proofCard}>
            {/* Header row */}
            <View style={styles.proofHeader}>
              <Text style={styles.proofId}>Proof #{item.id}</Text>
              <StatusBadge status={item.status} size="sm" />
            </View>

            {/* Image URL */}
            <TouchableOpacity onPress={() => Linking.openURL(item.imageUrl)}>
              <View style={styles.urlRow}>
                <Text style={styles.urlIcon}>📎</Text>
                <Text style={styles.urlText} numberOfLines={2}>{item.imageUrl}</Text>
              </View>
            </TouchableOpacity>

            {/* GPS */}
            {item.latitude && item.longitude && (
              <Text style={styles.gps}>
                📍 {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}
              </Text>
            )}

            {/* Actions — only for UnderReview */}
            {item.status === 'UnderReview' && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.approveBtn]}
                  onPress={() => handleApprove(item.id)}
                  disabled={actionId === item.id}
                >
                  <Text style={styles.approveTxt}>✅ Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.rejectBtn]}
                  onPress={() => handleReject(item.id)}
                  disabled={actionId === item.id}
                >
                  <Text style={styles.rejectTxt}>❌ Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: { alignItems: 'center', flex: 1 },
  statNum: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  statLabel: { fontSize: Typography.xs, color: Colors.textSecondary },
  statDivider: { width: 1, height: 30, backgroundColor: Colors.divider },
  list: { padding: 16, paddingBottom: 30 },
  proofCard: { marginBottom: 10 },
  proofHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  proofId: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  urlRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  urlIcon: { fontSize: 14 },
  urlText: {
    flex: 1,
    fontSize: Typography.xs,
    color: Colors.primary,
    textDecorationLine: 'underline',
    lineHeight: 18,
  },
  gps: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  approveBtn: { backgroundColor: Colors.success + '18', borderWidth: 1, borderColor: Colors.success + '40' },
  rejectBtn: { backgroundColor: Colors.danger + '12', borderWidth: 1, borderColor: Colors.danger + '30' },
  approveTxt: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.success },
  rejectTxt: { fontSize: Typography.sm, fontWeight: Typography.semibold, color: Colors.danger },
});
