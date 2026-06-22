/**
 * SubmitProofScreen
 * Worker submits photo URL + optional GPS coordinates as proof of work
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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { proofsApi } from '../../api';
import { AppButton, AppInput, Card } from '../../components';
import { Colors, Typography } from '../../constants';
import { WorkerStackParamList } from '../../types';

type Route = RouteProp<WorkerStackParamList, 'SubmitProof'>;

export function SubmitProofScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<Route>();
  const [imageUrl, setImageUrl] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!imageUrl.trim()) e.imageUrl = 'Image URL is required';
    else if (!imageUrl.startsWith('http')) e.imageUrl = 'Must be a valid URL (starts with http)';
    if (latitude && isNaN(Number(latitude))) e.latitude = 'Must be a number';
    if (longitude && isNaN(Number(longitude))) e.longitude = 'Must be a number';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      await proofsApi.submit({
        assignmentId: params.assignmentId,
        imageUrl: imageUrl.trim(),
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
      });
      Alert.alert('🎉 Proof Submitted!', 'Your proof is now under review by the admin.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Submission Failed', e.message);
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
          {/* Campaign info */}
          <View style={styles.campaignBadge}>
            <Text style={styles.campaignText}>📢 {params.campaignTitle || `Campaign #${params.assignmentId}`}</Text>
          </View>

          <Text style={styles.heading}>Submit Your Proof</Text>
          <Text style={styles.subheading}>
            Provide the URL of your photo and optional location coordinates.
          </Text>

          <Card>
            <AppInput
              label="Photo URL *"
              placeholder="https://your-photo-link.com/image.jpg"
              value={imageUrl}
              onChangeText={setImageUrl}
              error={errors.imageUrl}
              autoCapitalize="none"
              keyboardType="url"
            />

            <Text style={styles.sectionLabel}>📍 Location (Optional)</Text>
            <View style={styles.coordRow}>
              <View style={styles.coordInput}>
                <AppInput
                  label="Latitude"
                  placeholder="e.g. 13.0827"
                  value={latitude}
                  onChangeText={setLatitude}
                  error={errors.latitude}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.coordGap} />
              <View style={styles.coordInput}>
                <AppInput
                  label="Longitude"
                  placeholder="e.g. 80.2707"
                  value={longitude}
                  onChangeText={setLongitude}
                  error={errors.longitude}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </Card>

          {/* Info note */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              ℹ️ Once submitted, your proof will be reviewed by the admin. You'll be
              notified of the outcome.
            </Text>
          </View>

          <AppButton
            label="Submit Proof"
            onPress={handleSubmit}
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
  campaignBadge: {
    backgroundColor: Colors.primary + '15',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  campaignText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.primary,
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
    marginBottom: 20,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  coordRow: { flexDirection: 'row' },
  coordInput: { flex: 1 },
  coordGap: { width: 12 },
  infoBox: {
    backgroundColor: Colors.info + '15',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  infoText: {
    fontSize: Typography.sm,
    color: Colors.info,
    lineHeight: 20,
  },
});
