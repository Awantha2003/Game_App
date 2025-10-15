import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { GameSession, GameQuestion, GameAnswer } from '../types/game';
import { Level } from '../types/level';
import { GameService } from '../services/gameService';

const { width } = Dimensions.get('window');

interface PlayGameScreenProps {
  navigation: any;
  route: any;
}

export const PlayGameScreen: React.FC<PlayGameScreenProps> = ({ navigation, route }) => {
  const { level } = route.params;
  const [session, setSession] = useState<GameSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const fadeAnim = new Animated.Value(1);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (session) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, session]);

  const initializeGame = async () => {
    try {
      setIsLoading(true);
      const gameSession = await GameService.startGameSession(level.id);
      setSession(gameSession);
    } catch (error) {
      Alert.alert('Error', 'Failed to start game. Please try again.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showFeedback) return;
    
    setSelectedAnswer(answerIndex);
    const timeSpentOnQuestion = Math.floor((Date.now() - questionStartTime) / 1000);
    setTimeSpent(timeSpentOnQuestion);
    
    // Show feedback animation
    setShowFeedback(true);
    
    // Animate feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Check answer after a short delay
    setTimeout(() => {
      checkAnswer(answerIndex, timeSpentOnQuestion);
    }, 1000);
  };

  const checkAnswer = async (answerIndex: number, timeSpent: number) => {
    if (!session) return;

    try {
      const result = await GameService.submitAnswer(
        session.id,
        session.questions[currentQuestionIndex].id,
        answerIndex,
        timeSpent
      );

      const newAnswer: GameAnswer = {
        questionId: session.questions[currentQuestionIndex].id,
        selectedAnswer: answerIndex,
        isCorrect: result.isCorrect,
        timeSpent,
      };

      setAnswers(prev => [...prev, newAnswer]);
      setIsCorrect(result.isCorrect);

      // Move to next question after delay
      setTimeout(() => {
        if (currentQuestionIndex < session.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
          setTimeSpent(0);
        } else {
          completeGame();
        }
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit answer. Please try again.');
    }
  };

  const completeGame = async () => {
    if (!session) return;

    try {
      const updatedSession = {
        ...session,
        answers,
        score: answers.filter(a => a.isCorrect).length,
        completedAt: new Date().toISOString(),
        duration: Math.floor((Date.now() - parseInt(session.id)) / 1000),
      };

      const result = await GameService.completeGameSession(updatedSession);
      navigation.navigate('Result', { result });
    } catch (error) {
      Alert.alert('Error', 'Failed to complete game. Please try again.');
    }
  };

  const getOptionColor = (index: number) => {
    if (!showFeedback) return '#f8f9fa';
    if (selectedAnswer === index) {
      return isCorrect ? '#34C759' : '#FF3B30';
    }
    if (showFeedback && session?.questions[currentQuestionIndex].correctAnswer === index) {
      return '#34C759';
    }
    return '#f8f9fa';
  };

  const getOptionTextColor = (index: number) => {
    if (!showFeedback) return '#333';
    if (selectedAnswer === index || (showFeedback && session?.questions[currentQuestionIndex].correctAnswer === index)) {
      return 'white';
    }
    return '#333';
  };

  if (isLoading || !session) {
    return (
      <View style={styles.loadingContainer}>
        <Animatable.View animation="pulse" iterationCount="infinite">
          <Ionicons name="game-controller" size={60} color="#4facfe" />
        </Animatable.View>
        <Text style={styles.loadingText}>Loading game...</Text>
      </View>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4facfe" />
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.levelTitle}>{session.levelTitle}</Text>
            <Text style={styles.progressText}>
              Question {currentQuestionIndex + 1} of {session.questions.length}
            </Text>
          </View>
          <View style={styles.timerContainer}>
            <Ionicons name="time" size={20} color="white" />
            <Text style={styles.timerText}>{timeSpent}s</Text>
          </View>
        </View>
        
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Animatable.View 
          animation="fadeInUp" 
          duration={600}
          style={styles.questionContainer}
        >
          <View style={styles.questionHeader}>
            <View style={styles.difficultyBadge}>
              <Text style={[styles.difficultyText, { color: currentQuestion.difficulty === 'Easy' ? '#34C759' : 
                                                      currentQuestion.difficulty === 'Medium' ? '#FF9500' : '#FF3B30' }]}>
                {currentQuestion.difficulty}
              </Text>
            </View>
          </View>

          <Text style={styles.questionText}>{currentQuestion.prompt}</Text>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.optionButton,
                  { 
                    backgroundColor: getOptionColor(index),
                    transform: [{ scale: selectedAnswer === index ? scaleAnim : 1 }]
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.optionTouchable}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null || showFeedback}
                >
                  <Text style={[styles.optionText, { color: getOptionTextColor(index) }]}>
                    {String.fromCharCode(65 + index)}. {option}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animatable.View>

        {showFeedback && (
          <Animatable.View 
            animation="bounceIn" 
            duration={500}
            style={styles.feedbackContainer}
          >
            <LinearGradient
              colors={isCorrect ? ['#34C759', '#2ECC71'] : ['#FF3B30', '#E74C3C']}
              style={styles.feedbackGradient}
            >
              <Ionicons 
                name={isCorrect ? "checkmark-circle" : "close-circle"} 
                size={32} 
                color="white" 
              />
              <Text style={styles.feedbackText}>
                {isCorrect ? 'Correct!' : 'Try again!'}
              </Text>
            </LinearGradient>
          </Animatable.View>
        )}
      </View>
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
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  timerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  questionHeader: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  difficultyBadge: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 28,
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionTouchable: {
    padding: 18,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  feedbackGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  feedbackText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
