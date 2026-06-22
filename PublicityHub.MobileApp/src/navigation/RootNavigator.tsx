/**
 * RootNavigator
 * Top-level router — watches auth state and routes to:
 *   - LoginScreen (when logged out)
 *   - Role-specific navigator (when logged in)
 *
 * Role routing:
 *   admin    → AdminNavigator
 *   worker   → WorkerNavigator
 *   provider → ProviderNavigator
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { AdminNavigator } from './AdminNavigator';
import { WorkerNavigator } from './WorkerNavigator';
import { ProviderNavigator } from './ProviderNavigator';
import { LoadingScreen } from '../components';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { user, isLoading } = useAuth();

  // Show splash while restoring session from storage
  if (isLoading) {
    return <LoadingScreen message="Loading PublicityHub..." />;
  }

  // Not logged in — show Login
  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  // Logged in — route by role
  const role = user.role?.toLowerCase();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {role === 'admin' && (
        <Stack.Screen name="AdminApp" component={AdminNavigator} />
      )}
      {role === 'worker' && (
        <Stack.Screen name="WorkerApp" component={WorkerNavigator} />
      )}
      {role === 'provider' && (
        <Stack.Screen name="ProviderApp" component={ProviderNavigator} />
      )}
      {/* Fallback: if role is unknown, show login */}
      {!['admin', 'worker', 'provider'].includes(role) && (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
