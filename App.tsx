import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { StudentDashboard } from './src/screens/StudentDashboard';
import { AdminDashboard } from './src/screens/AdminDashboard';
import { QuestionListScreen } from './src/screens/QuestionListScreen';
import { QuestionFormScreen } from './src/screens/QuestionFormScreen';
import { LevelListScreen } from './src/screens/LevelListScreen';
import { LevelFormScreen } from './src/screens/LevelFormScreen';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
  </Stack.Navigator>
);

const TeacherNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="QuestionList" component={QuestionListScreen} />
    <Stack.Screen name="QuestionForm" component={QuestionFormScreen} />
    <Stack.Screen name="LevelList" component={LevelListScreen} />
    <Stack.Screen name="LevelForm" component={LevelFormScreen} />
  </Stack.Navigator>
);

const AdminNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="QuestionList" component={QuestionListScreen} />
    <Stack.Screen name="QuestionForm" component={QuestionFormScreen} />
    <Stack.Screen name="LevelList" component={LevelListScreen} />
    <Stack.Screen name="LevelForm" component={LevelFormScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthNavigator />;
  }

  // Role-based navigation
  switch (user.role) {
    case 'admin':
      return <AdminNavigator />;
    case 'teacher':
      return <TeacherNavigator />;
    case 'student':
      return <StudentDashboard navigation={null as any} />;
    default:
      return <AuthNavigator />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
      <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});