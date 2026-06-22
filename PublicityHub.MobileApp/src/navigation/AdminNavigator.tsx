/**
 * AdminNavigator
 * Bottom tabs: Dashboard | Campaigns | Users | Profile
 * Stack wraps for detail screens
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { CampaignDetailScreen } from '../screens/admin/CampaignDetailScreen';
import { CreateCampaignScreen } from '../screens/admin/CreateCampaignScreen';
import { AssignWorkerScreen } from '../screens/admin/AssignWorkerScreen';
import { ProofReviewScreen } from '../screens/admin/ProofReviewScreen';
import { UserListScreen } from '../screens/admin/UserListScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { Colors, Typography } from '../constants';
import { AdminStackParamList, AdminTabParamList } from '../types';

const Tab = createBottomTabNavigator<AdminTabParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

function AdminTabs() {
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
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Campaigns"
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: 'Campaigns',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📢" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Users"
        component={UserListScreen}
        options={{
          tabBarLabel: 'Users',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👥" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🛡️" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AdminNavigator() {
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
        name="AdminTabs"
        component={AdminTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CampaignDetail"
        component={CampaignDetailScreen}
        options={{ title: 'Campaign Details' }}
      />
      <Stack.Screen
        name="CreateCampaign"
        component={CreateCampaignScreen}
        options={{ title: 'New Campaign' }}
      />
      <Stack.Screen
        name="AssignWorker"
        component={AssignWorkerScreen}
        options={{ title: 'Assign Worker' }}
      />
      <Stack.Screen
        name="ProofReview"
        component={ProofReviewScreen}
        options={{ title: 'Review Proofs' }}
      />
      <Stack.Screen
        name="UserList"
        component={UserListScreen}
        options={{ title: 'All Users' }}
      />
    </Stack.Navigator>
  );
}
