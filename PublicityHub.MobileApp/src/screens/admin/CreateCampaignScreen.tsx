/**
 * CreateCampaignScreen (Admin)
 * Form to create a new campaign — always starts as Draft
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { campaignsApi } from '../../api';
import { AppButton, AppInput, Card } from '../../components';
import { Colors, Typography } from '../../constants';
import { useAuth } from '../../context';

export function CreateCampaignScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    amount: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Campaign title is required';
    if (!form.amount.trim()) e.amount = 'Amount is required';
    else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid positive amount';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleCreate() {
    if (!validate()) return;
    setLoading(true);
    try {
      await campaignsApi.create({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        location: form.location.trim() || undefined,
        amount: parseFloat(form.amount),
        createdBy: user!.id,
      });
      Alert.alert('✅ Campaign Created', 'Your campaign is saved as Draft. Publish it from the detail screen.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Status note */}
          <View style={styles.draftNote}>
            <Text style={styles.draftIcon}>📝</Text>
            <Text style={styles.draftText}>
              New campaigns are created as <Text style={styles.bold}>Draft</Text>. You can publish them after review.
            </Text>
          </View>

          <Card>
            <AppInput
              label="Campaign Title *"
              placeholder="e.g. Mumbai Banner Campaign Q3"
              value={form.title}
              onChangeText={(v) => set('title', v)}
              error={errors.title}
            />
            <AppInput
              label="Description"
              placeholder="Brief description of the campaign..."
              value={form.description}
              onChangeText={(v) => set('description', v)}
              multiline
              numberOfLines={3}
              style={styles.multiline}
            />
            <AppInput
              label="Location"
              placeholder="e.g. Mumbai, Maharashtra"
              value={form.location}
              onChangeText={(v) => set('location', v)}
            />
            <AppInput
              label="Amount (₹) *"
              placeholder="e.g. 5000"
              value={form.amount}
              onChangeText={(v) => set('amount', v)}
              keyboardType="decimal-pad"
              error={errors.amount}
            />
          </Card>

          <AppButton
            label="Create Campaign"
            onPress={handleCreate}
            loading={loading}
            size="lg"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  draftNote: {
    flexDirection: 'row',
    backgroundColor: Colors.info + '15',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 10,
    alignItems: 'flex-start',
  },
  draftIcon: { fontSize: 20 },
  draftText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.info,
    lineHeight: 20,
  },
  bold: { fontWeight: Typography.bold },
  multiline: { minHeight: 72, textAlignVertical: 'top' },
});
