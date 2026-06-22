/**
 * UserListScreen (Admin)
 * View all users + create new users
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../../api';
import { Card, AppButton, AppInput, EmptyState, LoadingScreen } from '../../components';
import { Colors, Typography } from '../../constants';
import { User } from '../../types';
import { getInitials } from '../../utils';

const ROLE_ICONS: Record<string, string> = {
  admin: '🛡️',
  worker: '👷',
  provider: '🚀',
};

const ROLE_COLORS: Record<string, string> = {
  admin: Colors.primary,
  worker: Colors.warning,
  provider: Colors.success,
};

export function UserListScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'admin' | 'worker' | 'provider'>('all');

  const load = useCallback(async () => {
    try {
      const res = await authApi.getAllUsers();
      setUsers(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'all' ? users : users.filter((u) => u.role === filter);

  if (loading) return <LoadingScreen message="Loading users..." />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Users ({users.length})</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Text style={styles.addBtnText}>+ Add User</Text>
        </TouchableOpacity>
      </View>

      {/* Role filter tabs */}
      <View style={styles.tabs}>
        {(['all', 'admin', 'worker', 'provider'] as const).map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.tab, filter === r && styles.tabActive]}
            onPress={() => setFilter(r)}
          >
            <Text style={[styles.tabText, filter === r && styles.tabTextActive]}>
              {r === 'all' ? 'All' : `${ROLE_ICONS[r]} ${r.charAt(0).toUpperCase() + r.slice(1)}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(u) => String(u.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="👤" title="No users found" subtitle="Add users using the button above" />
        }
        renderItem={({ item }) => {
          const color = ROLE_COLORS[item.role] ?? Colors.primary;
          return (
            <Card style={styles.userCard}>
              <View style={styles.userRow}>
                <View style={[styles.avatar, { backgroundColor: color + '20' }]}>
                  <Text style={[styles.avatarText, { color }]}>{getInitials(item.fullName)}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.fullName}</Text>
                  <Text style={styles.userPhone}>📞 {item.phoneNumber}</Text>
                </View>
                <View style={[styles.roleBadge, { backgroundColor: color + '18', borderColor: color + '40' }]}>
                  <Text style={[styles.roleText, { color }]}>
                    {ROLE_ICONS[item.role]} {item.role}
                  </Text>
                </View>
              </View>
            </Card>
          );
        }}
      />

      {/* Create User Modal */}
      <CreateUserModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onCreated={() => { setShowModal(false); load(); }}
      />
    </SafeAreaView>
  );
}

// ─── CreateUserModal ──────────────────────────────────────────────────────────
function CreateUserModal({
  visible,
  onClose,
  onCreated,
}: {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({ fullName: '', phoneNumber: '', role: 'worker' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: '' }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phoneNumber.trim()) e.phoneNumber = 'Phone number is required';
    else if (form.phoneNumber.trim().length !== 10) e.phoneNumber = 'Must be 10 digits';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleCreate() {
    if (!validate()) return;
    setLoading(true);
    try {
      await authApi.createUser({
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        role: form.role,
      });
      Alert.alert('✅ User Created', `${form.fullName} has been added as ${form.role}.`);
      setForm({ fullName: '', phoneNumber: '', role: 'worker' });
      onCreated();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={modalStyles.sheet}
        >
          <View style={modalStyles.handle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={modalStyles.title}>Create New User</Text>

            <AppInput
              label="Full Name *"
              placeholder="e.g. Ravi Kumar"
              value={form.fullName}
              onChangeText={(v) => set('fullName', v)}
              error={errors.fullName}
            />
            <AppInput
              label="Phone Number *"
              placeholder="10-digit number"
              value={form.phoneNumber}
              onChangeText={(v) => set('phoneNumber', v)}
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.phoneNumber}
            />

            {/* Role selector */}
            <Text style={modalStyles.roleLabel}>Role</Text>
            <View style={modalStyles.roleRow}>
              {(['worker', 'provider', 'admin'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    modalStyles.roleBtn,
                    form.role === r && modalStyles.roleBtnActive,
                  ]}
                  onPress={() => set('role', r)}
                >
                  <Text style={modalStyles.roleIcon}>{ROLE_ICONS[r]}</Text>
                  <Text
                    style={[
                      modalStyles.roleBtnText,
                      form.role === r && modalStyles.roleBtnTextActive,
                    ]}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <AppButton label="Create User" onPress={handleCreate} loading={loading} style={modalStyles.mt16} />
            <AppButton label="Cancel" onPress={onClose} variant="ghost" />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: Typography.xl, fontWeight: Typography.bold, color: Colors.textPrimary },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addBtnText: { color: Colors.white, fontWeight: Typography.semibold, fontSize: Typography.sm },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: Typography.xs, fontWeight: Typography.medium, color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  userCard: { marginBottom: 8 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: Typography.sm, fontWeight: Typography.bold },
  userInfo: { flex: 1 },
  userName: { fontSize: Typography.base, fontWeight: Typography.semibold, color: Colors.textPrimary },
  userPhone: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  roleBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  roleText: { fontSize: Typography.xs, fontWeight: Typography.semibold },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  roleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.inputBackground,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    gap: 4,
  },
  roleBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  roleIcon: { fontSize: 20 },
  roleBtnText: { fontSize: Typography.xs, fontWeight: Typography.medium, color: Colors.textSecondary },
  roleBtnTextActive: { color: Colors.primary },
  mt16: { marginTop: 4, marginBottom: 10 },
});
