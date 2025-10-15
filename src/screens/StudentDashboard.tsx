import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

interface StudentDashboardProps {
  navigation: any;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ navigation }) => {
  const handleStartGame = () => {
    // Navigate to game selection or start a game
    Alert.alert('Game', 'Game functionality will be implemented in the next phase');
  };

  const handleViewResults = () => {
    // Navigate to results screen
    Alert.alert('Results', 'Results functionality will be implemented in the next phase');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Student Dashboard</Text>
        <Text style={styles.subtitle}>Welcome! Ready to learn and play?</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎮 Start Playing</Text>
          <Text style={styles.cardDescription}>
            Choose from various educational games and start learning!
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleStartGame}>
            <Text style={styles.primaryButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 View Results</Text>
          <Text style={styles.cardDescription}>
            Check your progress and see how well you're doing!
          </Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewResults}>
            <Text style={styles.secondaryButtonText}>View Results</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏆 Achievements</Text>
          <Text style={styles.cardDescription}>
            Track your achievements and badges earned!
          </Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => {}}>
            <Text style={styles.secondaryButtonText}>View Achievements</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          No registration required - just start playing!
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
    backgroundColor: '#34C759',
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
