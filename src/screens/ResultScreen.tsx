import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { GameResult } from '../types/game';

const { width } = Dimensions.get('window');

interface ResultScreenProps {
  navigation: any;
  route: any;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ navigation, route }) => {
  const { result } = route.params;
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    // Animate stars after a short delay
    setTimeout(() => {
      setShowStars(true);
    }, 500);
  }, []);

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return '#34C759';
    if (percentage >= 80) return '#4facfe';
    if (percentage >= 70) return '#FF9500';
    return '#FF3B30';
  };

  const getEncouragementText = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "Outstanding! You're a star! 🌟";
    if (percentage >= 80) return "Excellent work! Keep it up! 🎉";
    if (percentage >= 70) return "Good job! You're improving! 👍";
    if (percentage >= 60) return "Not bad! Practice makes perfect! 💪";
    return "Don't give up! Try again! 💪";
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlayAgain = () => {
    navigation.navigate('StudentHome');
  };

  const handleViewProgress = () => {
    navigation.navigate('StudentProgress');
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Animatable.View
          key={i}
          animation={showStars ? "bounceIn" : undefined}
          duration={600}
          delay={i * 200}
          style={styles.starContainer}
        >
          <Ionicons
            name={i < result.stars ? "star" : "star-outline"}
            size={40}
            color={i < result.stars ? "#ffd700" : "#ddd"}
          />
        </Animatable.View>
      );
    }
    return stars;
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
            <View style={styles.resultIcon}>
              <Ionicons name="trophy" size={60} color="white" />
            </View>
            <Text style={styles.headerTitle}>Game Complete!</Text>
            <Text style={styles.headerSubtitle}>Here's how you did</Text>
          </View>
        </Animatable.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={1000} delay={200}>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Your Score</Text>
              <Text style={[styles.scoreText, { color: getScoreColor(result.score, result.totalQuestions) }]}>
                {result.score}/{result.totalQuestions}
              </Text>
              <Text style={styles.scorePercentage}>
                {Math.round((result.score / result.totalQuestions) * 100)}%
              </Text>
            </View>

            <View style={styles.starsContainer}>
              <Text style={styles.starsLabel}>Stars Earned</Text>
              <View style={styles.starsRow}>
                {renderStars()}
              </View>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1000} delay={400}>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Game Details</Text>
            
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="school" size={20} color="#4facfe" />
                <Text style={styles.detailLabel}>Level</Text>
                <Text style={styles.detailValue}>{result.levelTitle}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time" size={20} color="#4facfe" />
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{formatTime(result.duration)}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="book" size={20} color="#4facfe" />
                <Text style={styles.detailLabel}>Subject</Text>
                <Text style={styles.detailValue}>{result.subject}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="calendar" size={20} color="#4facfe" />
                <Text style={styles.detailLabel}>Grade</Text>
                <Text style={styles.detailValue}>{result.grade}</Text>
              </View>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1000} delay={600}>
          <View style={styles.encouragementContainer}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.encouragementGradient}
            >
              <Ionicons name="bulb" size={32} color="white" />
              <Text style={styles.encouragementText}>
                {getEncouragementText(result.score, result.totalQuestions)}
              </Text>
            </LinearGradient>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1000} delay={800}>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.playAgainGradient}
              >
                <Ionicons name="refresh" size={20} color="white" />
                <Text style={styles.playAgainText}>Play Again</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.progressButton} onPress={handleViewProgress}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.progressGradient}
              >
                <Ionicons name="analytics" size={20} color="white" />
                <Text style={styles.progressText}>View Progress</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    alignItems: 'center',
  },
  resultIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scoreContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  scoreCard: {
    alignItems: 'center',
    marginBottom: 25,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scorePercentage: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  starsContainer: {
    alignItems: 'center',
  },
  starsLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starContainer: {
    marginHorizontal: 5,
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  encouragementContainer: {
    marginBottom: 20,
    borderRadius: 20,
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
  encouragementGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  encouragementText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
    flex: 1,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  playAgainButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#4facfe',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playAgainGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  playAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressButton: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  progressGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  progressText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
