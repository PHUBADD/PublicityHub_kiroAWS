/**
 * JobDetailScreen
 * Worker views full job details and takes action (Accept / Reject / Submit Proof)
 *
 * Data flow: loads all worker assignments → finds this one by assignmentId
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { assignmentsApi, proofsApi } from '../../api';
import { useAuth } from '../../context';
import { AppButton, StatusBadge, Card, LoadingScreen, EmptyState } from '../../components';
import { Colors, Typography } from '../../constants';
import { JobAssignment, Proof, WorkerStackParamList } from '../../types';
import { formatCurrency } from '../../utils';

type Route = RouteProp<WorkerStackParamList, 'JobDetail'>;
type Nav = NativeStackNavigationProp<WorkerStackParamList>;

export function JobDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { params } = useRoute<Route>();
  const [job, setJob] = useState<JobAssignment | null>(null);
  const [proof, setProof] = useState<Proof | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      // Load all worker assignments and find this one
      const [jobsRes, proofRes] = await Promise.allSettled([
        assignmentsApi.getByWorker(user.id),
        proofsApi.getByAssignment(params.assignmentId),
      ]);

      if (jobsRes.status === 'fulfilled') {
        const found = jobsRes.value.data.find(
          (j) => j.assignmentId === params.assignmentId
        );
        setJob(found ?? null);
      }

      if (proofRes.status === 'fulfilled' && proofRes.value?.data) {
        setProof(proofRes.value.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user, params.assignmentId]);

  useEffect(() => { load(); }, [load]);

  async function handleAccept() {
    setActionLoading(true);
    try {
      await assignmentsApi.accept(params.assignmentId);
      Alert.alert('✅ Accepted', 'You have accepted this job!', [
        { text: 'OK', onPress: () => load() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    Alert.alert('Reject Job', 'Are you sure you want to reject this assignment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          setActionLoading(true);
          try {
            await assignmentsApi.reject(params.assignmentId);
            navigation.goBack();
          } catch (e: any) {
            Alert.alert('Error', e.message);
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  }

  if (loading) return <LoadingScreen />;
  if (!job) return <EmptyState icon="❓" title="Assignment not found" />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroEmoji}>📢</Text>
          </View>
          <View style={styles.heroMeta}>
            <Text style={styles.heroTitle} numberOfLines={2}>
              {job.campaignTitle ?? `Campaign #${job.campaignId}`}
            </Text>
            <StatusBadge status={job.status} size="sm" />
          </View>
        </View>

        {/* Details card */}
        <Card style={styles.mt8}>
          <InfoRow label="Assignment ID" value={`#${job.assignmentId}`} />
          <InfoRow label="Amount" value={formatCurrency(job.amount)} highlight />
          {job.location ? <InfoRow label="Location" value={job.location} /> : null}
          <InfoRow label="Status" value={job.status} />
        </Card>

        {/* Proof status (if submitted) */}
        {proof && (
          <Card>
            <Text style={styles.sectionLabel}>📸 Your Submitted Proof</Text>
            <StatusBadge status={proof.status} />
            <Text style={styles.proofUrl} numberOfLines={3}>
              🔗 {proof.imageUrl}
            </Text>
            {proof.latitude != null && proof.longitude != null && (
              <Text style={styles.gpsText}>
                📍 {proof.latitude?.toFixed(4)}, {proof.longitude?.toFixed(4)}
              </Text>
            )}
          </Card>
        )}

        {/* ─── Action area ─────────────────────────── */}
        <View style={styles.actions}>
          {job.status === 'Available' && (
            <>
              <AppButton
                label="✅  Accept Job"
                onPress={handleAccept}
                loading={actionLoading}
                size="lg"
                style={styles.mb10}
              />
              <AppButton
                label="Reject"
                onPress={handleReject}
                variant="outline"
                loading={actionLoading}
              />
            </>
          )}

          {job.status === 'Accepted' && !proof && (
            <AppButton
              label="📸  Submit Proof"
              onPress={() =>
                navigation.navigate('SubmitProof', {
                  assignmentId: job.assignmentId,
                  campaignTitle: job.campaignTitle ?? '',
                })
              }
              size="lg"
            />
          )}

          {job.status === 'ProofSubmitted' && (
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerText}>
                ⏳ Your proof is under review by the admin.{'\n'}
                You'll be notified once it's approved.
              </Text>
            </View>
          )}

          {job.status === 'Approved' && (
            <View style={[styles.infoBanner, styles.successBanner]}>
              <Text style={[styles.infoBannerText, styles.successText]}>
                🎉 Job Approved! Payment will be processed.
              </Text>
            </View>
          )}

          {job.status === 'Rejected' && (
            <View style={[styles.infoBanner, styles.dangerBanner]}>
              <Text style={[styles.infoBannerText, styles.dangerText]}>
                ❌ This assignment was rejected.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={[infoStyles.value, highlight ? infoStyles.highlight : undefined]}>
        {value}
      </Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  label: { fontSize: Typography.sm, color: Colors.textSecondary },
  value: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    maxWidth: '55%',
    textAlign: 'right',
  },
  highlight: {
    color: Colors.primary,
    fontWeight: Typography.bold,
    fontSize: Typography.base,
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },

  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 4,
  },
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

  mt8: { marginTop: 16 },
  sectionLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  proofUrl: {
    fontSize: Typography.xs,
    color: Colors.primary,
    marginTop: 8,
    textDecorationLine: 'underline',
    lineHeight: 18,
  },
  gpsText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    marginTop: 6,
  },

  actions: { marginTop: 8 },
  mb10: { marginBottom: 10 },

  infoBanner: {
    backgroundColor: Colors.warning + '18',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  infoBannerText: {
    fontSize: Typography.sm,
    color: Colors.warning,
    fontWeight: Typography.medium,
    textAlign: 'center',
    lineHeight: 22,
  },
  successBanner: {
    backgroundColor: Colors.success + '15',
    borderColor: Colors.success + '30',
  },
  successText: { color: Colors.success },
  dangerBanner: {
    backgroundColor: Colors.danger + '12',
    borderColor: Colors.danger + '25',
  },
  dangerText: { color: Colors.danger },
});
