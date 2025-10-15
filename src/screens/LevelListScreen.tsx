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
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { Level, LevelFilters } from '../types/level';
import { LevelService } from '../services/levelService';

const { width } = Dimensions.get('window');

interface LevelListScreenProps {
  navigation: any;
}

export const LevelListScreen: React.FC<LevelListScreenProps> = ({ navigation }) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [filteredLevels, setFilteredLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<LevelFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadLevels();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [levels, searchText, filters]);

  const loadLevels = async () => {
    try {
      setIsLoading(true);
      const data = await LevelService.getAllLevels();
      setLevels(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load levels');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLevels();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...levels];

    // Apply search filter
    if (searchText.trim()) {
      const searchTerm = searchText.toLowerCase();
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(searchTerm) ||
        l.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply other filters
    if (filters.grade) {
      filtered = filtered.filter(l => l.grade === filters.grade);
    }
    if (filters.subject) {
      filtered = filtered.filter(l => l.subject === filters.subject);
    }
    if (filters.difficulty) {
      filtered = filtered.filter(l => l.difficulty === filters.difficulty);
    }

    setFilteredLevels(filtered);
  };

  const handleDeleteLevel = (level: Level) => {
    Alert.alert(
      'Delete Level',
      `Are you sure you want to delete this level?\n\n"${level.title}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await LevelService.deleteLevel(level.id);
              await loadLevels();
              Alert.alert('Success', 'Level deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete level');
            }
          },
        },
      ]
    );
  };

  const handleEditLevel = (level: Level) => {
    navigation.navigate('LevelForm', { level, mode: 'edit' });
  };

  const handleAddLevel = () => {
    navigation.navigate('LevelForm', { mode: 'create' });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#34C759';
      case 'Medium':
        return '#FF9500';
      case 'Hard':
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Math':
        return '#667eea';
      case 'Spelling':
        return '#f093fb';
      case 'General Knowledge':
        return '#4facfe';
      default:
        return '#666';
    }
  };

  const renderLevelItem = ({ item, index }: { item: Level; index: number }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      delay={index * 100}
      style={styles.levelCard}
    >
      <LinearGradient
        colors={[getSubjectColor(item.subject), `${getSubjectColor(item.subject)}CC`]}
        style={styles.levelGradient}
      >
        <View style={styles.levelHeader}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.levelDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <View style={styles.levelMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="school" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>Grade {item.grade}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="help-circle" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>{item.totalQuestions} questions</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="trophy" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.metaText}>Pass: {item.passScore}</Text>
            </View>
          </View>
        </View>

        <View style={styles.levelFooter}>
          <View style={styles.difficultyContainer}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
              <Text style={styles.difficultyText}>{item.difficulty}</Text>
            </View>
            <View style={styles.subjectBadge}>
              <Text style={styles.subjectText}>{item.subject}</Text>
            </View>
          </View>

          <View style={styles.levelActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditLevel(item)}
            >
              <Ionicons name="create" size={18} color="#667eea" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteLevel(item)}
            >
              <Ionicons name="trash" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Animatable.View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.filterModal}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filter Levels</Text>
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
        <Animatable.View animation="pulse" iterationCount="infinite">
          <Ionicons name="school" size={60} color="#667eea" />
        </Animatable.View>
        <Text style={styles.loadingText}>Loading levels...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Animatable.View animation="fadeInDown" duration={1000}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.title}>Level Management</Text>
              <Text style={styles.subtitle}>Create and manage educational levels</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleAddLevel}>
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search levels..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={20} color="#667eea" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {filteredLevels.length} level{filteredLevels.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      <FlatList
        data={filteredLevels}
        renderItem={renderLevelItem}
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
  addButton: {
    borderRadius: 25,
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
  addButtonGradient: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
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
    marginBottom: 15,
  },
  levelInfo: {
    marginBottom: 12,
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
  levelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  subjectBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  levelActions: {
    flexDirection: 'row',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#667eea',
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
    backgroundColor: '#667eea',
    borderColor: '#667eea',
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
