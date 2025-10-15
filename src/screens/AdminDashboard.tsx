import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

interface AdminDashboardProps {
  navigation: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigation }) => {
  const handleManageUsers = () => {
    Alert.alert('User Management', 'User management functionality will be implemented in the next phase');
  };

  const handleManageQuestions = () => {
    navigation.navigate('QuestionList');
  };

  const handleViewAnalytics = () => {
    Alert.alert('Analytics', 'Analytics functionality will be implemented in the next phase');
  };

  const handleSystemSettings = () => {
    Alert.alert('System Settings', 'System settings functionality will be implemented in the next phase');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Manage your educational platform</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👥 User Management</Text>
          <Text style={styles.cardDescription}>
            Manage teachers, students, and user accounts
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleManageUsers}>
            <Text style={styles.primaryButtonText}>Manage Users</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>❓ Question Management</Text>
          <Text style={styles.cardDescription}>
            Create, edit, and organize questions and levels
          </Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleManageQuestions}>
            <Text style={styles.secondaryButtonText}>Manage Questions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📈 Analytics</Text>
          <Text style={styles.cardDescription}>
            View detailed analytics and performance metrics
          </Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewAnalytics}>
            <Text style={styles.secondaryButtonText}>View Analytics</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚙️ System Settings</Text>
          <Text style={styles.cardDescription}>
            Configure system settings and preferences
          </Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSystemSettings}>
            <Text style={styles.secondaryButtonText}>System Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Admin controls and management tools
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF3B30',
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
