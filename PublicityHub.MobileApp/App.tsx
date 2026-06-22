/**
 * App.tsx — entry point
 *
 * Wraps the whole app in:
 *   1. SafeAreaProvider  — handles notch/status bar safe areas
 *   2. AuthProvider      — global auth state (JWT + user)
 *   3. NavigationContainer — React Navigation root
 *   4. RootNavigator     — decides Login vs role-based screens
 */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context';
import { RootNavigator } from './src/navigation';
import { Colors } from './src/constants';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
