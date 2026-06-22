/**
 * AssignWorkerScreen (Admin)
 * Pick a worker from the user list and assign to a campaign
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { authApi, assignmentsApi } from '../../api';
import { AppButton, Card, EmptyState, LoadingScreen } from '../../components';
import { Colors, Typography } from '../../constants';
import { User, AdminStackParamList } from '../../types';
import { getInitials } from '../../utils';

type Route = RouteProp<AdminStackParamList, 'AssignWorker'>;

export function AssignWorkerScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const [workers, setWorkers] = useState<User[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await authApi.getAllUsers();
      setWorkers(res.data.filter((u) => u.role === 'worker'));
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAssign() {
    if (!selected) return;
    setAssigning(true);
    try {
      await assignmentsApi.assign({
        campaignId: params.campaignId,
        workerId: selected,
      });
      Alert.alert('✅ Assigned!', 'Worker has been assigned to this campaign.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Assignment Failed', e.message);
    } finally {
      setAssigning(false);
    }
  }

  if (loading) return <LoadingScreen message="Loading workers..." />;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Select a Worker</Text>
        <Text style={styles.subtitle}>Campaign #{params.campaignId}</Text>
      </View>

      <FlatList
        data={workers}
        keyExtractor={(u) => String(u.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="👷" title="No workers found" subtitle="Create worker accounts first" />
        }
        renderItem={({ item }) => {
          const isSelected = selected === item.id;
          return (
            <TouchableOpacity
              onPress={() => setSelected(isSelected ? null : item.id)}
              activeOpacity={0.8}
            >
              <Card style={isSelected ? { ...styles.workerCard, ...styles.selectedCard } : styles.workerCard}>
                <View style={styles.workerRow}>
                  <View style={[styles.avatar, isSelected && styles.avatarSelected]}>
                    <Text style={[styles.avatarText, isSelected && styles.avatarTextSelected]}>
                      {getInitials(item.fullName)}
                    </Text>
                  </View>
                  <View style={styles.workerInfo}>
                    <Text style={styles.workerName}>{item.fullName}</Text>
                    <Text style={styles.workerPhone}>📞 {item.phoneNumber}</Text>
                  </View>
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.footer}>
        <AppButton
          label={selected ? 'Assign Worker' : 'Select a Worker First'}
          onPress={handleAssign}
          loading={assigning}
          disabled={!selected}
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 20, paddingBottom: 10 },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  workerCard: { marginBottom: 8 },
  selectedCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  workerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSelected: { backgroundColor: Colors.primary },
  avatarText: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  avatarTextSelected: { color: Colors.white },
  workerInfo: { flex: 1 },
  workerName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  workerPhone: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: Colors.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
});
