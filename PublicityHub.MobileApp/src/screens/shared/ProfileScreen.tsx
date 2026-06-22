/**
 * ProfileScreen — shared across all roles
 * Shows user info + logout
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context';
import { Colors, Typography } from '../../constants';
import { getInitials } from '../../utils';

const ROLE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  admin: { label: 'Administrator', icon: '🛡️', color: Colors.primary },
  worker: { label: 'Field Worker', icon: '👷', color: Colors.warning },
  provider: { label: 'Campaign Provider', icon: '🚀', color: Colors.success },
};

export function ProfileScreen() {
  const { user, logout } = useAuth();

  const role = user?.role ?? 'worker';
  const roleInfo = ROLE_LABELS[role] ?? { label: role, icon: '👤', color: Colors.primary };

  function confirmLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Avatar + name */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: roleInfo.color }]}>
            <Text style={styles.avatarText}>{getInitials(user?.fullName ?? 'User')}</Text>
          </View>
          <Text style={styles.name}>{user?.fullName}</Text>
          <View style={[styles.roleBadge, { backgroundColor: roleInfo.color + '18', borderColor: roleInfo.color + '40' }]}>
            <Text style={styles.roleIcon}>{roleInfo.icon}</Text>
            <Text style={[styles.roleLabel, { color: roleInfo.color }]}>{roleInfo.label}</Text>
          </View>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <ProfileRow icon="📞" label="Phone" value={user?.phoneNumber ?? '—'} />
          <ProfileRow icon="🪪" label="User ID" value={`#${user?.id}`} />
          <ProfileRow icon="🏷️" label="Role" value={roleInfo.label} />
        </View>

        {/* App info */}
        <View style={styles.appCard}>
          <Text style={styles.appCardTitle}>About PublicityHub</Text>
          <Text style={styles.appCardText}>
            A field advertising campaign management platform connecting providers,
            workers, and administrators for seamless campaign execution and proof verification.
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>🚪  Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.icon}>{icon}</Text>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={rowStyles.value}>{value}</Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: 10,
  },
  icon: { fontSize: 18, width: 28 },
  label: { flex: 1, fontSize: Typography.sm, color: Colors.textSecondary },
  value: { fontSize: Typography.sm, fontWeight: Typography.medium, color: Colors.textPrimary },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 40 },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    fontSize: Typography.xxl,
    fontWeight: Typography.extrabold,
    color: Colors.white,
  },
  name: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    gap: 6,
  },
  roleIcon: { fontSize: 16 },
  roleLabel: { fontSize: Typography.sm, fontWeight: Typography.semibold },
  infoCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  appCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  appCardTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  appCardText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  version: { fontSize: Typography.xs, color: Colors.textMuted },
  logoutBtn: {
    marginHorizontal: 20,
    backgroundColor: Colors.danger + '12',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.danger + '30',
  },
  logoutText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.danger,
  },
});
