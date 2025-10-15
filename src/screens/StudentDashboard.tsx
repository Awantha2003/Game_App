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

interface StudentDashboardProps {
  navigation: any;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalGames: 24,
    totalStars: 156,
    currentStreak: 7,
    bestScore: 95,
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

  const handleStartGame = () => {
    navigation.navigate('StudentHome');
  };

  const handleViewResults = () => {
    navigation.navigate('StudentProgress');
  };

  const handleViewAchievements = () => {
    Alert.alert('Achievements', 'Coming soon! 🏆');
  };

  const handleSettings = () => {
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
          {[...Array(15)].map((_, i) => (
            <Animatable.View
              key={i}
              animation="pulse"
              iterationCount="infinite"
              duration={3000 + i * 200}
              style={[
                styles.floatingElement,
                {
                  left: Math.random() * width,
                  top: Math.random() * height,
                  opacity: Math.random() * 0.4 + 0.1,
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
              <Text style={styles.studentName}>Student</Text>
            </View>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={handleSettings}
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
            {/* Stats Cards */}
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
                  <Ionicons name="game-controller" size={30} color="#fff" />
                  <Text style={styles.statsNumber}>{stats.totalGames}</Text>
                  <Text style={styles.statsLabel}>Games Played</Text>
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
                  <Ionicons name="star" size={30} color="#fff" />
                  <Text style={styles.statsNumber}>{stats.totalStars}</Text>
                  <Text style={styles.statsLabel}>Stars Earned</Text>
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
                  <Ionicons name="flame" size={30} color="#fff" />
                  <Text style={styles.statsNumber}>{stats.currentStreak}</Text>
                  <Text style={styles.statsLabel}>Day Streak</Text>
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
                  <Ionicons name="trophy" size={30} color="#fff" />
                  <Text style={styles.statsNumber}>{stats.bestScore}%</Text>
                  <Text style={styles.statsLabel}>Best Score</Text>
                </LinearGradient>
              </Animatable.View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              
              <Animatable.View 
                animation="fadeInUp" 
                duration={800}
                delay={1000}
              >
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleStartGame}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.actionGradient}
                  >
                    <View style={styles.actionContent}>
                      <View style={styles.actionIconContainer}>
                        <Ionicons name="play" size={28} color="#fff" />
                      </View>
                      <View style={styles.actionTextContainer}>
                        <Text style={styles.actionTitle}>Start New Game</Text>
                        <Text style={styles.actionSubtitle}>Choose your subject and begin</Text>
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
                  onPress={handleViewResults}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#4facfe', '#00f2fe']}
                    style={styles.actionGradient}
                  >
                    <View style={styles.actionContent}>
                      <View style={styles.actionIconContainer}>
                        <Ionicons name="bar-chart" size={28} color="#fff" />
                      </View>
                      <View style={styles.actionTextContainer}>
                        <Text style={styles.actionTitle}>View Progress</Text>
                        <Text style={styles.actionSubtitle}>Check your performance</Text>
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
                  onPress={handleViewAchievements}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#f093fb', '#f5576c']}
                    style={styles.actionGradient}
                  >
                    <View style={styles.actionContent}>
                      <View style={styles.actionIconContainer}>
                        <Ionicons name="trophy" size={28} color="#fff" />
                      </View>
                      <View style={styles.actionTextContainer}>
                        <Text style={styles.actionTitle}>Achievements</Text>
                        <Text style={styles.actionSubtitle}>View your badges</Text>
                      </View>
                      <Ionicons name="arrow-forward" size={24} color="#fff" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>
            </View>

            {/* Popular Games */}
            <View style={styles.gamesContainer}>
              <Text style={styles.sectionTitle}>Popular Games</Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.gamesScroll}
              >
                {[
                  { id: 1, title: 'Math Challenge', subject: 'Mathematics', color: '#4facfe', icon: 'calculator' },
                  { id: 2, title: 'Spelling Bee', subject: 'English', color: '#f093fb', icon: 'book' },
                  { id: 3, title: 'Science Quiz', subject: 'Science', color: '#00f2fe', icon: 'flask' },
                  { id: 4, title: 'History Hunt', subject: 'History', color: '#f5576c', icon: 'time' },
                ].map((game, index) => (
                  <Animatable.View 
                    key={game.id}
                    animation="fadeInUp" 
                    duration={800}
                    delay={1600 + index * 200}
                    style={styles.gameCard}
                  >
                    <TouchableOpacity 
                      style={styles.gameCardButton}
                      onPress={handleStartGame}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={[game.color, game.color + '80']}
                        style={styles.gameCardGradient}
                      >
                        <View style={styles.gameCardContent}>
                          <Ionicons name={game.icon as any} size={40} color="#fff" />
                          <Text style={styles.gameCardTitle}>{game.title}</Text>
                          <Text style={styles.gameCardSubject}>{game.subject}</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </ScrollView>
            </View>

            {/* Daily Challenge */}
            <Animatable.View 
              animation="fadeInUp" 
              duration={800}
              delay={2000}
              style={styles.challengeContainer}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.challengeGradient}
              >
                <View style={styles.challengeContent}>
                  <View style={styles.challengeIconContainer}>
                    <Ionicons name="flash" size={32} color="#fff" />
                  </View>
                  <View style={styles.challengeTextContainer}>
                    <Text style={styles.challengeTitle}>Daily Challenge</Text>
                    <Text style={styles.challengeSubtitle}>Complete 5 math problems</Text>
                    <Text style={styles.challengeReward}>Reward: 10 stars</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.challengeButton}
                    onPress={handleStartGame}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.challengeButtonText}>Start</Text>
                  </TouchableOpacity>
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
    width: 8,
    height: 8,
    borderRadius: 4,
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
  studentName: {
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
  gamesContainer: {
    marginBottom: 30,
  },
  gamesScroll: {
    paddingRight: 25,
  },
  gameCard: {
    marginRight: 15,
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
  gameCardButton: {
    width: 150,
    height: 120,
  },
  gameCardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  gameCardContent: {
    alignItems: 'center',
  },
  gameCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  gameCardSubject: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  challengeContainer: {
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
  challengeGradient: {
    padding: 25,
  },
  challengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  challengeTextContainer: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  challengeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  challengeReward: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  challengeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  challengeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});