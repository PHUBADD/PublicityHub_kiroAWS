/**
 * LoginScreen
 * Phone-number based login — role is determined by the API response
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authApi } from '../../api';
import { useAuth } from '../../context';
import { AppButton, AppInput } from '../../components';
import { Colors, Typography } from '../../constants';

export function LoginScreen() {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    const cleaned = phone.trim().replace(/\s/g, '');
    if (cleaned.length !== 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ phoneNumber: cleaned });
      await login(res.data);
      // Navigation handled automatically by RootNavigator watching auth state
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid phone number');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Brand hero ─────────────────────────────── */}
          <View style={styles.heroBlock}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>PH</Text>
            </View>
            <Text style={styles.appName}>PublicityHub</Text>
            <Text style={styles.tagline}>Field Campaign Management</Text>
          </View>

          {/* ─── Form card ──────────────────────────────── */}
          <View style={styles.card}>
            <Text style={styles.heading}>Welcome back 👋</Text>
            <Text style={styles.subheading}>Enter your registered phone number to continue</Text>

            <AppInput
              label="Phone Number"
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(t) => { setPhone(t); setError(''); }}
              maxLength={10}
              error={error}
              leftIcon={<Text style={styles.phonePrefix}>+91</Text>}
            />

            <AppButton
              label="Sign In"
              onPress={handleLogin}
              loading={loading}
              size="lg"
            />

            <Text style={styles.hint}>
              No password needed — your phone is your identity.
            </Text>
          </View>

          {/* ─── Role legend ────────────────────────────── */}
          <View style={styles.rolesRow}>
            {[
              { icon: '🛡️', role: 'Admin' },
              { icon: '🚀', role: 'Provider' },
              { icon: '👷', role: 'Worker' },
            ].map(({ icon, role }) => (
              <View key={role} style={styles.rolePill}>
                <Text style={styles.roleIcon}>{icon}</Text>
                <Text style={styles.roleText}>{role}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },

  // Hero
  heroBlock: { alignItems: 'center', marginBottom: 36 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: Typography.xxl,
    fontWeight: Typography.extrabold,
    color: Colors.white,
  },
  appName: {
    fontSize: Typography.xxl,
    fontWeight: Typography.extrabold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  // Form card
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 24,
  },
  heading: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subheading: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  phonePrefix: {
    fontSize: Typography.base,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
  hint: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },

  // Roles
  rolesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  roleIcon: { fontSize: 14 },
  roleText: {
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
  },
});
