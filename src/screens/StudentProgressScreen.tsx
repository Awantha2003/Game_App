import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { StudentProgress, GameResult } from '../types/game';
import { GameService } from '../services/gameService';

const { width } = Dimensions.get('window');

interface StudentProgressScreenProps {
  navigation: any;
}

export const StudentProgressScreen: React.FC<StudentProgressScreenProps> = ({ navigation }) => {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setIsLoading(true);
      const progressData = await GameService.getStudentProgress();
      setProgress(progressData);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgress();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return '#34C759';
    if (percentage >= 80) return '#4facfe';
    if (percentage >= 70) return '#FF9500';
    return '#FF3B30';
  };

  const renderAchievement = (achievement: any, index: number) => (
    <Animatable.View
      key={achievement.id}
      animation="fadeInUp"
      duration={600}
      delay={index * 100}
      style={styles.achievementCard}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.achievementGradient}
      >
        <View style={styles.achievementIcon}>
          <Ionicons name={achievement.icon} size={24} color="white" />
        </View>
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementTitle}>{achievement.title}</Text>
          <Text style={styles.achievementDescription}>{achievement.description}</Text>
        </View>
      </LinearGradient>
    </Animatable.View>
  );

  const renderRecentGame = (game: GameResult, index: number) => (
    <Animatable.View
      key={game.id}
      animation="fadeInUp"
      duration={600}
      delay={index * 100}
      style={styles.gameCard}
    >
      <TouchableOpacity>
        <View style={styles.gameHeader}>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle} numberOfLines={1}>
              {game.levelTitle}
            </Text>
            <Text style={styles.gameSubject}>{game.subject} • Grade {game.grade}</Text>
          </View>
          <View style={styles.gameScore}>
            <Text style={[styles.scoreText, { color: getScoreColor(game.score, game.totalQuestions) }]}>
              {game.score}/{game.totalQuestions}
            </Text>
            <View style={styles.starsContainer}>
              {Array.from({ length: 5 }, (_, i) => (
                <Ionicons
                  key={i}
                  name={i < game.stars ? "star" : "star-outline"}
                  size={12}
                  color={i < game.stars ? "#ffd700" : "#ddd"}
                />
              ))}
            </View>
          </View>
        </View>
        <View style={styles.gameFooter}>
          <View style={styles.gameMeta}>
            <Ionicons name="time" size={14} color="#666" />
            <Text style={styles.gameMetaText}>
              {Math.floor(game.duration / 60)}:{(game.duration % 60).toString().padStart(2, '0')}
            </Text>
          </View>
          <Text style={styles.gameDate}>{formatDate(game.completedAt)}</Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Animatable.View animation="pulse" iterationCount="infinite">
          <Ionicons name="analytics" size={60} color="#4facfe" />
        </Animatable.View>
        <Text style={styles.loadingText}>Loading progress...</Text>
      </View>
    );
  }

  if (!progress) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color="#ff6b6b" />
        <Text style={styles.errorText}>Failed to load progress</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProgress}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4facfe" />
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={styles.header}
      >
        <Animatable.View animation="fadeInDown" duration={1000}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>Your Progress</Text>
              <Text style={styles.subtitle}>Track your learning journey</Text>
            </View>
          </View>
        </Animatable.View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Animatable.View animation="fadeInUp" duration={1000} delay={200}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.statGradient}
              >
                <Ionicons name="game-controller" size={32} color="white" />
                <Text style={styles.statNumber}>{progress.totalGamesPlayed}</Text>
                <Text style={styles.statLabel}>Games Played</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.statGradient}
              >
                <Ionicons name="star" size={32} color="white" />
                <Text style={styles.statNumber}>{progress.totalStars}</Text>
                <Text style={styles.statLabel}>Stars Earned</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                style={styles.statGradient}
              >
                <Ionicons name="trophy" size={32} color="white" />
                <Text style={styles.statNumber}>{progress.averageScore.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Avg Score</Text>
              </LinearGradient>
            </View>
          </View>
        </Animatable.View>

        {progress.achievements.length > 0 && (
          <Animatable.View animation="fadeInUp" duration={1000} delay={400}>
            <View style={styles.achievementsSection}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <View style={styles.achievementsList}>
                {progress.achievements.map((achievement, index) => 
                  renderAchievement(achievement, index)
                )}
              </View>
            </View>
          </Animatable.View>
        )}

        <Animatable.View animation="fadeInUp" duration={1000} delay={600}>
          <View style={styles.recentGamesSection}>
            <Text style={styles.sectionTitle}>Recent Games</Text>
            {progress.recentGames.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="game-controller" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No games played yet</Text>
                <Text style={styles.emptySubtext}>Start playing to see your progress!</Text>
              </View>
            ) : (
              <View style={styles.gamesList}>
                {progress.recentGames.map((game, index) => renderRecentGame(game, index))}
              </View>
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4facfe',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -20,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
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
  statGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  achievementsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  achievementsList: {
    marginTop: 10,
  },
  achievementCard: {
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
  achievementGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  recentGamesSection: {
    marginBottom: 30,
  },
  gamesList: {
    marginTop: 10,
  },
  gameCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  gameInfo: {
    flex: 1,
    marginRight: 15,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  gameSubject: {
    fontSize: 14,
    color: '#666',
  },
  gameScore: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gameMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameMetaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  gameDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});
