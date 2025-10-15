import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

interface StudentDashboardProps {
  navigation: any;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ navigation }) => {
  const handleStartGame = () => {
    navigation.navigate('StudentHome');
  };

  const handleViewResults = () => {
    navigation.navigate('StudentProgress');
  };

  const handleViewAchievements = () => {
    Alert.alert('Achievements', 'Achievements functionality will be implemented in the next phase');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4facfe" />
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={styles.header}
      >
        <Animatable.View animation="fadeInDown" duration={1000}>
          <View style={styles.headerContent}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.title}>Ready to learn?</Text>
              <Text style={styles.subtitle}>Choose your adventure and start playing educational games</Text>
            </View>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#fff', '#f0f8ff']}
                style={styles.avatar}
              >
                <Ionicons name="person" size={40} color="#4facfe" />
              </LinearGradient>
            </View>
          </View>
        </Animatable.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={1000} delay={200}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="trophy" size={24} color="#ffd700" />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Games Won</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="star" size={24} color="#ff6b6b" />
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Points Earned</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="medal" size={24} color="#4ecdc4" />
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1000} delay={400}>
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity style={styles.actionCard} onPress={handleStartGame}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.actionGradient}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name="play-circle" size={32} color="#fff" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Start Playing</Text>
                  <Text style={styles.actionDescription}>Begin your learning journey</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleViewResults}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.actionGradient}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name="analytics" size={32} color="#fff" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>View Results</Text>
                  <Text style={styles.actionDescription}>Check your progress</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleViewAchievements}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.actionGradient}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name="trophy" size={32} color="#fff" />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Achievements</Text>
                  <Text style={styles.actionDescription}>View your badges</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1000} delay={600}>
          <View style={styles.gamesSection}>
            <Text style={styles.sectionTitle}>Popular Games</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.gameCard}>
                <LinearGradient
                  colors={['#ff9a9e', '#fecfef']}
                  style={styles.gameGradient}
                >
                  <Ionicons name="calculator" size={40} color="#fff" />
                  <Text style={styles.gameTitle}>Math Quest</Text>
                  <Text style={styles.gameDescription}>Solve math problems</Text>
                </LinearGradient>
              </View>
              <View style={styles.gameCard}>
                <LinearGradient
                  colors={['#a8edea', '#fed6e3']}
                  style={styles.gameGradient}
                >
                  <Ionicons name="book" size={40} color="#fff" />
                  <Text style={styles.gameTitle}>Word Master</Text>
                  <Text style={styles.gameDescription}>Spelling challenges</Text>
                </LinearGradient>
              </View>
              <View style={styles.gameCard}>
                <LinearGradient
                  colors={['#ffecd2', '#fcb69f']}
                  style={styles.gameGradient}
                >
                  <Ionicons name="bulb" size={40} color="#fff" />
                  <Text style={styles.gameTitle}>Brain Teaser</Text>
                  <Text style={styles.gameDescription}>Logic puzzles</Text>
                </LinearGradient>
              </View>
            </ScrollView>
          </View>
        </Animatable.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  avatarContainer: {
    marginLeft: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -20,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  actionCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  gamesSection: {
    marginBottom: 30,
  },
  gameCard: {
    width: 140,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  gameGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  gameDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});
