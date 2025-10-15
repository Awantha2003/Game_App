import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { height, width } = Dimensions.get('screen');

interface AdminDashboardProps {
  navigation: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalQuestions: 342,
    totalLevels: 28,
    totalResults: 8934,
  });

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleManageUsers = () => {
    Alert.alert('User Management', 'Feature coming soon! 👥');
  };

  const handleManageQuestions = () => {
    navigation.navigate('QuestionList');
  };

  const handleManageLevels = () => {
    navigation.navigate('LevelList');
  };

  const handleViewResults = () => {
    navigation.navigate('ResultsList');
  };

  const handleViewFeedback = () => {
    navigation.navigate('FeedbackList');
  };

  const handleViewAnalytics = () => {
    navigation.navigate('ResultsAnalytics');
  };

  const handleOpenSettings = () => {
    navigation.navigate('Settings');
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Animated Background */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating elements */}
        <View style={styles.floatingElements}>
          {[...Array(20)].map((_, i) => (
            <Animatable.View
              key={i}
              animation="pulse"
              iterationCount="infinite"
              duration={3000 + i * 150}
              style={[
                styles.floatingElement,
                {
                  left: Math.random() * width,
                  top: Math.random() * height,
                  opacity: Math.random() * 0.3 + 0.1,
                }
              ]}
            />
          ))}
        </View>

        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.adminName}>Admin</Text>
            </View>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={handleOpenSettings}
            >
              <Ionicons name="settings" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Main Content */}
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Stats Overview */}
            <View style={styles.statsContainer}>
              <Animatable.View 
                animation="fadeInLeft" 
                duration={800}
                delay={200}
                style={styles.statsCard}
              >
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  style={styles.statsGradient}
                >
                  <Ionicons name="people" size={30} color="#fff" />
                  <Text style={styles.statsNumber}>{stats.totalUsers}</Text>
                  <Text style={styles.statsLabel}>Total Users</Text>
                </LinearGradient>
              </Animatable.View>

              <Animatable.View 
                animation="fadeInRight" 
                duration={800}
                delay={400}
                style={styles.statsCard}
              >
                <LinearGradient
                  colors={['#f093fb', '#f5576c']}
                  style={styles.statsGradient}
                >
                  <Ionicons name="help-circle" size={30} color="#fff" />
                  <Text style={styles.statsNumber}>{stats.totalQuestions}</Text>
                  <Text style={styles.statsLabel}>Questions</Text>
                </LinearGradient>
              </Animatable.View>
            </View>

            <View style={styles.statsContainer}>
              <Animatable.View 
                animation="fadeInLeft" 
                duration={800}
                delay={600}
                style={styles.statsCard}
              >
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  style={styles.statsGradient}
                >
                  <Ionicons name="layers" size={30} color="#fff" />
                  <Text style={styles.statsNumber}>{stats.totalLevels}</Text>
                  <Text style={styles.statsLabel}>Levels</Text>
                </LinearGradient>
              </Animatable.View>

              <Animatable.View 
                animation="fadeInRight" 
                duration={800}
                delay={800}
                style={styles.statsCard}
              >
                <LinearGradient
                  colors={['#f093fb', '#f5576c']}
                  style={styles.statsGradient}
                >
                  <Ionicons name="bar-chart" size={30} color="#fff" />
                  <Text style={styles.statsNumber}>{stats.totalResults}</Text>
                  <Text style={styles.statsLabel}>Results</Text>
                </LinearGradient>
              </Animatable.View>
            </View>

            {/* Management Actions */}
            <View style={styles.actionsContainer}>
              <Text style={styles.sectionTitle}>Management</Text>
              
              <Animatable.View 
                animation="fadeInUp" 
                duration={800}
                delay={1000}
              >
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleManageUsers}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.actionGradient}
                  >
                    <View style={styles.actionContent}>
                      <View style={styles.actionIconContainer}>
                        <Ionicons name="people" size={28} color="#fff" />
                      </View>
                      <View style={styles.actionTextContainer}>
                        <Text style={styles.actionTitle}>User Management</Text>
                        <Text style={styles.actionSubtitle}>Manage teachers and students</Text>
                      </View>
                      <Ionicons name="arrow-forward" size={24} color="#fff" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>

              <Animatable.View 
                animation="fadeInUp" 
                duration={800}
                delay={1200}
              >
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleManageQuestions}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    style={styles.actionGradient}
                  >
                    <View style={styles.actionContent}>
                      <View style={styles.actionIconContainer}>
                        <Ionicons name="help-circle" size={28} color="#fff" />
                      </View>
                      <View style={styles.actionTextContainer}>
                        <Text style={styles.actionTitle}>Question Bank</Text>
                        <Text style={styles.actionSubtitle}>Create and manage questions</Text>
                      </View>
                      <Ionicons name="arrow-forward" size={24} color="#fff" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>

              <Animatable.View 
                animation="fadeInUp" 
                duration={800}
                delay={1400}
              >
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleManageLevels}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#f093fb', '#f5576c']}
                    style={styles.actionGradient}
                  >
                    <View style={styles.actionContent}>
                      <View style={styles.actionIconContainer}>
                        <Ionicons name="layers" size={28} color="#fff" />
                      </View>
                      <View style={styles.actionTextContainer}>
                        <Text style={styles.actionTitle}>Level Management</Text>
                        <Text style={styles.actionSubtitle}>Create and organize levels</Text>
                      </View>
                      <Ionicons name="arrow-forward" size={24} color="#fff" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>
            </View>

            {/* Analytics & Reports */}
            <View style={styles.analyticsContainer}>
              <Text style={styles.sectionTitle}>Analytics & Reports</Text>
              
              <Animatable.View 
                animation="fadeInUp" 
                duration={800}
                delay={1600}
              >
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleViewResults}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.actionGradient}
                  >
                    <View style={styles.actionContent}>
                      <View style={styles.actionIconContainer}>
                        <Ionicons name="bar-chart" size={28} color="#fff" />
                      </View>
                      <View style={styles.actionTextContainer}>
                        <Text style={styles.actionTitle}>Student Results</Text>
                        <Text style={styles.actionSubtitle}>View performance data</Text>
                      </View>
                      <Ionicons name="arrow-forward" size={24} color="#fff" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>

              <Animatable.View 
                animation="fadeInUp" 
                duration={800}
                delay={1800}
              >
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleViewAnalytics}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    style={styles.actionGradient}
                  >
                    <View style={styles.actionContent}>
                      <View style={styles.actionIconContainer}>
                        <Ionicons name="analytics" size={28} color="#fff" />
                      </View>
                      <View style={styles.actionTextContainer}>
                        <Text style={styles.actionTitle}>Analytics Dashboard</Text>
                        <Text style={styles.actionSubtitle}>Detailed insights and charts</Text>
                      </View>
                      <Ionicons name="arrow-forward" size={24} color="#fff" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>

              <Animatable.View 
                animation="fadeInUp" 
                duration={800}
                delay={2000}
              >
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleViewFeedback}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#f093fb', '#f5576c']}
                    style={styles.actionGradient}
                  >
                    <View style={styles.actionContent}>
                      <View style={styles.actionIconContainer}>
                        <Ionicons name="chatbubbles" size={28} color="#fff" />
                      </View>
                      <View style={styles.actionTextContainer}>
                        <Text style={styles.actionTitle}>Feedback Management</Text>
                        <Text style={styles.actionSubtitle}>Review user feedback</Text>
                      </View>
                      <Ionicons name="arrow-forward" size={24} color="#fff" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>
            </View>

            {/* Quick Stats */}
            <Animatable.View 
              animation="fadeInUp" 
              duration={800}
              delay={2200}
              style={styles.quickStatsContainer}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.quickStatsGradient}
              >
                <View style={styles.quickStatsContent}>
                  <View style={styles.quickStatsIconContainer}>
                    <Ionicons name="trending-up" size={32} color="#fff" />
                  </View>
                  <View style={styles.quickStatsTextContainer}>
                    <Text style={styles.quickStatsTitle}>System Status</Text>
                    <Text style={styles.quickStatsSubtitle}>All systems operational</Text>
                    <Text style={styles.quickStatsDetail}>Last updated: {currentTime.toLocaleTimeString()}</Text>
                  </View>
                  <View style={styles.statusIndicator}>
                    <View style={styles.statusDot} />
                  </View>
                </View>
              </LinearGradient>
            </Animatable.View>
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingElement: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '300',
    color: '#fff',
    marginBottom: 5,
  },
  adminName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  settingsButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    paddingHorizontal: 25,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  statsGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
  },
  statsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: 30,
  },
  analyticsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  actionButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  actionGradient: {
    padding: 20,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quickStatsContainer: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  quickStatsGradient: {
    padding: 25,
  },
  quickStatsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickStatsIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  quickStatsTextContainer: {
    flex: 1,
  },
  quickStatsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  quickStatsSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  quickStatsDetail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  statusIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
});