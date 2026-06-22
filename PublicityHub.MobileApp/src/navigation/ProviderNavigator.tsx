/**
 * ProviderNavigator
 * Bottom tabs: My Campaigns | Profile
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { ProviderHomeScreen } from '../screens/provider/ProviderHomeScreen';
import { ProviderCampaignDetailScreen } from '../screens/provider/ProviderCampaignDetailScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { Colors, Typography } from '../constants';
import { ProviderStackParamList, ProviderTabParamList } from '../types';

const Tab = createBottomTabNavigator<ProviderTabParamList>();
const Stack = createNativeStackNavigator<ProviderStackParamList>();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

function ProviderTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.divider,
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 62,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: Typography.xs,
          fontWeight: Typography.medium,
        },
      }}
    >
      <Tab.Screen
        name="ProviderHome"
        component={ProviderHomeScreen}
        options={{
          tabBarLabel: 'Campaigns',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🚀" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="MyCampaigns"
        component={ProviderHomeScreen}
        options={{
          tabBarLabel: 'My Campaigns',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📢" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function ProviderNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          fontWeight: Typography.bold,
          color: Colors.textPrimary,
          fontSize: Typography.base,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="ProviderTabs"
        component={ProviderTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProviderCampaignDetail"
        component={ProviderCampaignDetailScreen}
        options={{ title: 'Campaign Details' }}
      />
    </Stack.Navigator>
  );
}
