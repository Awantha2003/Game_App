import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { Question, QuestionFilters } from '../types/question';
import { QuestionService } from '../services/questionService';

interface QuestionListScreenProps {
  navigation: any;
}

export const QuestionListScreen: React.FC<QuestionListScreenProps> = ({ navigation }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<QuestionFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, searchText, filters]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const data = await QuestionService.getAllQuestions();
      setQuestions(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadQuestions();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...questions];

    // Apply search filter
    if (searchText.trim()) {
      const searchTerm = searchText.toLowerCase();
      filtered = filtered.filter(q => 
        q.prompt.toLowerCase().includes(searchTerm) ||
        q.options.some(option => option.toLowerCase().includes(searchTerm))
      );
    }

    // Apply other filters
    if (filters.grade) {
      filtered = filtered.filter(q => q.grade === filters.grade);
    }
    if (filters.subject) {
      filtered = filtered.filter(q => q.subject === filters.subject);
    }
    if (filters.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }

    setFilteredQuestions(filtered);
  };

  const handleDeleteQuestion = (question: Question) => {
    Alert.alert(
      'Delete Question',
      `Are you sure you want to delete this question?\n\n"${question.prompt}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await QuestionService.deleteQuestion(question.id);
              await loadQuestions();
              Alert.alert('Success', 'Question deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete question');
            }
          },
        },
      ]
    );
  };

  const handleEditQuestion = (question: Question) => {
    navigation.navigate('QuestionForm', { question, mode: 'edit' });
  };

  const handleAddQuestion = () => {
    navigation.navigate('QuestionForm', { mode: 'create' });
  };

  const renderQuestionItem = ({ item }: { item: Question }) => (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionPrompt} numberOfLines={2}>
          {item.prompt}
        </Text>
        <View style={styles.questionMeta}>
          <Text style={styles.metaText}>Grade {item.grade}</Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={styles.metaText}>{item.subject}</Text>
          <Text style={styles.metaText}>•</Text>
          <Text style={[styles.metaText, styles.difficultyText, { 
            color: item.difficulty === 'Easy' ? '#34C759' : 
                   item.difficulty === 'Medium' ? '#FF9500' : '#FF3B30' 
          }]}>
            {item.difficulty}
          </Text>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        {item.options.map((option, index) => (
          <Text 
            key={index} 
            style={[
              styles.optionText,
              index === item.correctAnswer && styles.correctOption
            ]}
          >
            {String.fromCharCode(65 + index)}. {option}
            {index === item.correctAnswer && ' ✓'}
          </Text>
        ))}
      </View>

      <View style={styles.questionActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditQuestion(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteQuestion(item)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.filterModal}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filter Questions</Text>
          <TouchableOpacity onPress={() => setShowFilters(false)}>
            <Text style={styles.closeButton}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterContent}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Grade</Text>
            <View style={styles.filterOptions}>
              {[1, 2, 3, 4, 5].map(grade => (
                <TouchableOpacity
                  key={grade}
                  style={[
                    styles.filterOption,
                    filters.grade === grade && styles.filterOptionSelected
                  ]}
                  onPress={() => setFilters(prev => ({ 
                    ...prev, 
                    grade: prev.grade === grade ? undefined : grade 
                  }))}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.grade === grade && styles.filterOptionTextSelected
                  ]}>
                    Grade {grade}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Subject</Text>
            <View style={styles.filterOptions}>
              {['Math', 'Spelling', 'General Knowledge'].map(subject => (
                <TouchableOpacity
                  key={subject}
                  style={[
                    styles.filterOption,
                    filters.subject === subject && styles.filterOptionSelected
                  ]}
                  onPress={() => setFilters(prev => ({ 
                    ...prev, 
                    subject: prev.subject === subject ? undefined : subject 
                  }))}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.subject === subject && styles.filterOptionTextSelected
                  ]}>
                    {subject}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Difficulty</Text>
            <View style={styles.filterOptions}>
              {['Easy', 'Medium', 'Hard'].map(difficulty => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.filterOption,
                    filters.difficulty === difficulty && styles.filterOptionSelected
                  ]}
                  onPress={() => setFilters(prev => ({ 
                    ...prev, 
                    difficulty: prev.difficulty === difficulty ? undefined : difficulty 
                  }))}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.difficulty === difficulty && styles.filterOptionTextSelected
                  ]}>
                    {difficulty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Question Bank</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
          <Text style={styles.addButtonText}>+ Add Question</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search questions..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={filteredQuestions}
        renderItem={renderQuestionItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {renderFilterModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginRight: 12,
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statsText: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 20,
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
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
  questionHeader: {
    marginBottom: 12,
  },
  questionPrompt: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  difficultyText: {
    fontWeight: '600',
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  correctOption: {
    color: '#34C759',
    fontWeight: '600',
  },
  questionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  filterModal: {
    flex: 1,
    backgroundColor: 'white',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  filterContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
  },
  filterOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
});
