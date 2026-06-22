/**
 * CampaignDetailScreen (Admin)
 * Full campaign info + lifecycle action buttons (Publish → Start → Complete → Close)
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { campaignsApi } from '../../api';
import { AppButton, StatusBadge, Card, LoadingScreen, EmptyState } from '../../components';
import { Colors, Typography } from '../../constants';
import { Campaign, AdminStackParamList } from '../../types';
import { formatCurrency } from '../../utils';
import { useAuth } from '../../context';

type Route = RouteProp<AdminStackParamList, 'CampaignDetail'>;
type Nav = NativeStackNavigationProp<AdminStackParamList>;

export function CampaignDetailScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await campaignsApi.getAll();
      const found = res.data.find((c) => c.id === params.campaignId);
      setCampaign(found ?? null);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [params.campaignId]);

  useEffect(() => { load(); }, [load]);

  async function doAction(label: string, action: () => Promise<unknown>) {
    setActionLoading(true);
    try {
      await action();
      Alert.alert('Success', `${label} successful!`, [
        { text: 'OK', onPress: () => load() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setActionLoading(false);
    }
  }

  function confirmClose() {
    Alert.alert('Close Campaign', 'This will permanently close the campaign. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Close Campaign',
        style: 'destructive',
        onPress: () =>
          doAction('Close', () =>
            campaignsApi.close(params.campaignId, user!.id, 'Closed by admin')
          ),
      },
    ]);
  }

  if (loading) return <LoadingScreen />;
  if (!campaign)
    return <EmptyState icon="❓" title="Campaign not found" />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Title banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroIcon}>
            <Text style={styles.heroEmoji}>📢</Text>
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>{campaign.title}</Text>
            <Text style={styles.heroMeta}>Created by {campaign.createdByName}</Text>
          </View>
        </View>

        <StatusBadge status={campaign.status} />

        {/* Details card */}
        <Card style={styles.mt16}>
          <InfoRow label="Amount" value={formatCurrency(campaign.amount)} highlight />
          <InfoRow label="Assignments" value={`${campaign.assignedCount} workers`} />
          <InfoRow label="Status" value={campaign.status} />
        </Card>

        {/* Lifecycle actions */}
        <Text style={styles.sectionTitle}>Campaign Actions</Text>
        <Card>
          {campaign.status === 'Draft' && (
            <AppButton
              label="🚀  Publish Campaign"
              onPress={() => doAction('Publish', () => campaignsApi.publish(campaign.id))}
              loading={actionLoading}
              style={styles.mb10}
            />
          )}
          {campaign.status === 'Published' && (
            <>
              <AppButton
                label="⚡  Start Execution"
                onPress={() => doAction('Start', () => campaignsApi.startExecution(campaign.id))}
                loading={actionLoading}
                style={styles.mb10}
              />
              <AppButton
                label="👥  Assign Workers"
                onPress={() => navigation.navigate('AssignWorker', { campaignId: campaign.id })}
                variant="outline"
                style={styles.mb10}
              />
            </>
          )}
          {campaign.status === 'InExecution' && (
            <>
              <AppButton
                label="🔍  Review Proofs"
                onPress={() =>
                  navigation.navigate('ProofReview', {
                    campaignId: campaign.id,
                    campaignTitle: campaign.title,
                  })
                }
                variant="outline"
                style={styles.mb10}
              />
              <AppButton
                label="✅  Complete Campaign"
                onPress={() => doAction('Complete', () => campaignsApi.complete(campaign.id))}
                loading={actionLoading}
                style={styles.mb10}
              />
            </>
          )}

          {/* Close is available for most statuses */}
          {!['Completed', 'Closed'].includes(campaign.status) && (
            <AppButton
              label="Close Campaign"
              onPress={confirmClose}
              variant="danger"
              loading={actionLoading}
            />
          )}

          {campaign.status === 'Completed' && (
            <View style={styles.completedBanner}>
              <Text style={styles.completedText}>🎉 Campaign Successfully Completed!</Text>
            </View>
          )}

          {campaign.status === 'Closed' && (
            <View style={styles.closedBanner}>
              <Text style={styles.closedText}>🔒 This campaign has been closed.</Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={[infoStyles.value, highlight && infoStyles.highlight]}>{value}</Text>
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
  highlight: { color: Colors.primary, fontWeight: Typography.bold, fontSize: Typography.base },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
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
  heroText: { flex: 1 },
  heroTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  heroMeta: { fontSize: Typography.xs, color: Colors.textMuted, marginTop: 3 },
  mt16: { marginTop: 16 },
  sectionTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  mb10: { marginBottom: 10 },
  completedBanner: {
    backgroundColor: Colors.success + '18',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  completedText: {
    fontSize: Typography.base,
    color: Colors.success,
    fontWeight: Typography.semibold,
  },
  closedBanner: {
    backgroundColor: Colors.danger + '12',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  closedText: {
    fontSize: Typography.base,
    color: Colors.danger,
    fontWeight: Typography.semibold,
  },
});
