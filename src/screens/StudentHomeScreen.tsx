import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { Level } from '../types/level';
import { StudentProgress } from '../types/game';
import { LevelService } from '../services/levelService';
import { GameService } from '../services/gameService';

const { width } = Dimensions.get('window');

interface StudentHomeScreenProps {
  navigation: any;
}

export const StudentHomeScreen: React.FC<StudentHomeScreenProps> = ({ navigation }) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [levelsData, progressData] = await Promise.all([
        LevelService.getAllLevels(),
        GameService.getStudentProgress(),
      ]);
      setLevels(levelsData);
      setProgress(progressData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handlePlayLevel = (level: Level) => {
    navigation.navigate('PlayGame', { level });
  };

  const handleViewProgress = () => {
    navigation.navigate('StudentProgress');
  };

  const filteredLevels = levels.filter(level => {
    if (selectedGrade && level.grade !== selectedGrade) return false;
    if (selectedSubject && level.subject !== selectedSubject) return false;
    return true;
  });

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Math': return '#667eea';
      case 'Spelling': return '#f093fb';
      case 'General Knowledge': return '#4facfe';
      default: return '#666';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#34C759';
      case 'Medium': return '#FF9500';
      case 'Hard': return '#FF3B30';
      default: return '#666';
    }
  };

  const renderLevelCard = (level: Level, index: number) => (
    <Animatable.View
      key={level.id}
      animation="fadeInUp"
      duration={600}
      delay={index * 100}
      style={styles.levelCard}
    >
      <TouchableOpacity onPress={() => handlePlayLevel(level)}>
        <LinearGradient
          colors={[getSubjectColor(level.subject), `${getSubjectColor(level.subject)}CC`]}
          style={styles.levelGradient}
        >
          <View style={styles.levelHeader}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle} numberOfLines={2}>
                {level.title}
              </Text>
              <Text style={styles.levelDescription} numberOfLines={2}>
                {level.description}
              </Text>
            </View>
            <View style={styles.levelIcon}>
              <Ionicons 
                name={level.subject === 'Math' ? 'calculator' : 
                      level.subject === 'Spelling' ? 'book' : 'bulb'} 
                size={32} 
                color="white" 
              />
            </View>
          </View>

          <View style={styles.levelFooter}>
            <View style={styles.levelMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="school" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>Grade {level.grade}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="help-circle" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>{level.totalQuestions} questions</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="trophy" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>Pass: {level.passScore}</Text>
              </View>
            </View>
            <View style={styles.difficultyBadge}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(level.difficulty) }]}>
                {level.difficulty}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Animatable.View animation="pulse" iterationCount="infinite">
          <Ionicons name="game-controller" size={60} color="#4facfe" />
        </Animatable.View>
        <Text style={styles.loadingText}>Loading games...</Text>
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
            <View>
              <Text style={styles.title}>Choose Your Game!</Text>
              <Text style={styles.subtitle}>Select a level and start learning</Text>
            </View>
            <TouchableOpacity style={styles.progressButton} onPress={handleViewProgress}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.progressButtonGradient}
              >
                <Ionicons name="analytics" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
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
        {progress && (
          <Animatable.View animation="fadeInUp" duration={1000} delay={200}>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="game-controller" size={24} color="#4facfe" />
                <Text style={styles.statNumber}>{progress.totalGamesPlayed}</Text>
                <Text style={styles.statLabel}>Games Played</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="star" size={24} color="#ffd700" />
                <Text style={styles.statNumber}>{progress.totalStars}</Text>
                <Text style={styles.statLabel}>Stars Earned</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="trophy" size={24} color="#ff6b6b" />
                <Text style={styles.statNumber}>{progress.averageScore.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Avg Score</Text>
              </View>
            </View>
          </Animatable.View>
        )}

        <Animatable.View animation="fadeInUp" duration={1000} delay={400}>
          <View style={styles.filtersContainer}>
            <Text style={styles.sectionTitle}>Filter Games</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterRow}>
                {[1, 2, 3, 4, 5].map(grade => (
                  <TouchableOpacity
                    key={grade}
                    style={[
                      styles.filterButton,
                      selectedGrade === grade && styles.filterButtonSelected
                    ]}
                    onPress={() => setSelectedGrade(selectedGrade === grade ? null : grade)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      selectedGrade === grade && styles.filterButtonTextSelected
                    ]}>
                      Grade {grade}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterRow}>
                {['Math', 'Spelling', 'General Knowledge'].map(subject => (
                  <TouchableOpacity
                    key={subject}
                    style={[
                      styles.filterButton,
                      selectedSubject === subject && styles.filterButtonSelected
                    ]}
                    onPress={() => setSelectedSubject(selectedSubject === subject ? null : subject)}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      selectedSubject === subject && styles.filterButtonTextSelected
                    ]}>
                      {subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1000} delay={600}>
          <View style={styles.gamesSection}>
            <Text style={styles.sectionTitle}>
              Available Games ({filteredLevels.length})
            </Text>
            {filteredLevels.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No games found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
              </View>
            ) : (
              <View style={styles.levelsList}>
                {filteredLevels.map((level, index) => renderLevelCard(level, index))}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressButton: {
    borderRadius: 25,
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
  progressButtonGradient: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -20,
    marginBottom: 30,
    paddingHorizontal: 20,
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
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    backgroundColor: 'white',
  },
  filterButtonSelected: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterButtonTextSelected: {
    color: 'white',
  },
  gamesSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  levelsList: {
    marginTop: 10,
  },
  levelCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  levelGradient: {
    padding: 20,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  levelInfo: {
    flex: 1,
    marginRight: 15,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  levelDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  levelIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 5,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
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
