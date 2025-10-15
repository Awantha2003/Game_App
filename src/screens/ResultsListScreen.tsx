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
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { GameResult, ProgressFilter } from '../types/game';
import { GameService } from '../services/gameService';

const { width } = Dimensions.get('window');

interface ResultsListScreenProps {
  navigation: any;
}

export const ResultsListScreen: React.FC<ResultsListScreenProps> = ({ navigation }) => {
  const [results, setResults] = useState<GameResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<GameResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  useEffect(() => {
    filterResults();
  }, [results, searchText, selectedGrade, selectedSubject]);

  const loadResults = async () => {
    try {
      setIsLoading(true);
      const resultsData = await GameService.getResults();
      setResults(resultsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load results');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadResults();
    setRefreshing(false);
  };

  const filterResults = () => {
    let filtered = [...results];

    if (searchText) {
      filtered = filtered.filter(result =>
        result.studentName?.toLowerCase().includes(searchText.toLowerCase()) ||
        result.levelTitle.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedGrade) {
      filtered = filtered.filter(result => result.grade === selectedGrade);
    }

    if (selectedSubject) {
      filtered = filtered.filter(result => result.subject === selectedSubject);
    }

    setFilteredResults(filtered);
  };

  const handleDeleteResult = (resultId: string) => {
    Alert.alert(
      'Delete Result',
      'Are you sure you want to delete this result?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Implement delete functionality
            setResults(prev => prev.filter(r => r.id !== resultId));
          },
        },
      ]
    );
  };

  const handleExportResults = () => {
    Alert.alert('Export Results', 'Export functionality will be implemented in the backend integration.');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return '#34C759';
    if (percentage >= 80) return '#4facfe';
    if (percentage >= 70) return '#FF9500';
    return '#FF3B30';
  };

  const renderResultCard = (result: GameResult, index: number) => (
    <Animatable.View
      key={result.id}
      animation="fadeInUp"
      duration={600}
      delay={index * 100}
      style={styles.resultCard}
    >
      <TouchableOpacity>
        <View style={styles.resultHeader}>
          <View style={styles.resultInfo}>
            <Text style={styles.studentName} numberOfLines={1}>
              {result.studentName || 'Anonymous Student'}
            </Text>
            <Text style={styles.levelTitle} numberOfLines={1}>
              {result.levelTitle}
            </Text>
            <Text style={styles.resultMeta}>
              {result.subject} • Grade {result.grade}
            </Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, { color: getScoreColor(result.score, result.totalQuestions) }]}>
              {result.score}/{result.totalQuestions}
            </Text>
            <Text style={styles.scorePercentage}>
              {Math.round((result.score / result.totalQuestions) * 100)}%
            </Text>
          </View>
        </View>

        <View style={styles.resultDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="star" size={16} color="#ffd700" />
            <Text style={styles.detailText}>{result.stars} stars</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.detailText}>{formatTime(result.duration)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.detailText}>{formatDate(result.completedAt)}</Text>
          </View>
        </View>

        <View style={styles.resultActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteResult(result.id)}
          >
            <Ionicons name="trash" size={16} color="#ff6b6b" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
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
        <Text style={styles.loadingText}>Loading results...</Text>
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
              <Text style={styles.title}>Student Results</Text>
              <Text style={styles.subtitle}>{filteredResults.length} results found</Text>
            </View>
            <TouchableOpacity 
              style={styles.exportButton}
              onPress={handleExportResults}
            >
              <Ionicons name="download" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by student name or level..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={20} color="#4facfe" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <Animatable.View animation="fadeInDown" duration={300} style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filter Results</Text>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Grade</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterRow}>
                {[1, 2, 3, 4, 5].map(grade => (
                  <TouchableOpacity
                    key={grade}
                    style={[
                      styles.filterChip,
                      selectedGrade === grade && styles.filterChipSelected
                    ]}
                    onPress={() => setSelectedGrade(selectedGrade === grade ? null : grade)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedGrade === grade && styles.filterChipTextSelected
                    ]}>
                      Grade {grade}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Subject</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterRow}>
                {['Math', 'Spelling', 'General Knowledge'].map(subject => (
                  <TouchableOpacity
                    key={subject}
                    style={[
                      styles.filterChip,
                      selectedSubject === subject && styles.filterChipSelected
                    ]}
                    onPress={() => setSelectedSubject(selectedSubject === subject ? null : subject)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      selectedSubject === subject && styles.filterChipTextSelected
                    ]}>
                      {subject}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </Animatable.View>
      )}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredResults.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No results found</Text>
            <Text style={styles.emptySubtext}>
              {searchText || selectedGrade || selectedSubject 
                ? 'Try adjusting your search or filters' 
                : 'No student results available yet'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.resultsList}>
            {filteredResults.map((result, index) => renderResultCard(result, index))}
          </View>
        )}
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
    paddingBottom: 20,
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
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  filterSection: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    backgroundColor: 'white',
  },
  filterChipSelected: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterChipTextSelected: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  resultsList: {
    marginTop: 10,
  },
  resultCard: {
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
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 10,
  },
  resultInfo: {
    flex: 1,
    marginRight: 15,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  resultMeta: {
    fontSize: 12,
    color: '#999',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  scorePercentage: {
    fontSize: 12,
    color: '#666',
  },
  resultDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#fff5f5',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#ff6b6b',
    marginLeft: 5,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
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
    textAlign: 'center',
  },
});
