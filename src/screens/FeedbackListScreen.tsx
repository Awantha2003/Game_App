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
import { Feedback, FeedbackFilter, FeedbackStats } from '../types/feedback';
import { FeedbackService } from '../services/feedbackService';

const { width } = Dimensions.get('window');

interface FeedbackListScreenProps {
  navigation: any;
}

export const FeedbackListScreen: React.FC<FeedbackListScreenProps> = ({ navigation }) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadFeedback();
  }, []);

  useEffect(() => {
    filterFeedback();
  }, [feedback, searchText, selectedType, selectedStatus]);

  const loadFeedback = async () => {
    try {
      setIsLoading(true);
      const [feedbackData, statsData] = await Promise.all([
        FeedbackService.getFeedback(),
        FeedbackService.getFeedbackStats(),
      ]);
      setFeedback(feedbackData);
      setStats(statsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeedback();
    setRefreshing(false);
  };

  const filterFeedback = () => {
    let filtered = [...feedback];

    if (searchText) {
      filtered = filtered.filter(f =>
        f.title.toLowerCase().includes(searchText.toLowerCase()) ||
        f.description.toLowerCase().includes(searchText.toLowerCase()) ||
        f.userName?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(f => f.type === selectedType);
    }

    if (selectedStatus) {
      filtered = filtered.filter(f => f.status === selectedStatus);
    }

    setFilteredFeedback(filtered);
  };

  const handleUpdateStatus = async (feedbackId: string, status: Feedback['status']) => {
    try {
      await FeedbackService.updateFeedbackStatus(feedbackId, status);
      await loadFeedback();
      Alert.alert('Success', 'Feedback status updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update feedback status');
    }
  };

  const handleDeleteFeedback = (feedbackId: string) => {
    Alert.alert(
      'Delete Feedback',
      'Are you sure you want to delete this feedback?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await FeedbackService.deleteFeedback(feedbackId);
              await loadFeedback();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete feedback');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#FF3B30';
      case 'in_progress': return '#FF9500';
      case 'resolved': return '#34C759';
      case 'closed': return '#666';
      default: return '#666';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return '#34C759';
      case 'medium': return '#FF9500';
      case 'high': return '#FF3B30';
      case 'critical': return '#8B0000';
      default: return '#666';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return 'bug';
      case 'suggestion': return 'bulb';
      case 'question_issue': return 'help-circle';
      case 'general': return 'chatbubble';
      default: return 'chatbubble';
    }
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

  const renderStatsCards = () => {
    if (!stats) return null;

    return (
      <Animatable.View animation="fadeInUp" duration={1000} delay={200}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.statGradient}
            >
              <Ionicons name="chatbubbles" size={24} color="white" />
              <Text style={styles.statNumber}>{stats.totalFeedback}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#FF3B30', '#E74C3C']}
              style={styles.statGradient}
            >
              <Ionicons name="alert-circle" size={24} color="white" />
              <Text style={styles.statNumber}>{stats.openIssues}</Text>
              <Text style={styles.statLabel}>Open</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#34C759', '#2ECC71']}
              style={styles.statGradient}
            >
              <Ionicons name="checkmark-circle" size={24} color="white" />
              <Text style={styles.statNumber}>{stats.resolvedIssues}</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </LinearGradient>
          </View>
        </View>
      </Animatable.View>
    );
  };

  const renderFeedbackCard = (item: Feedback, index: number) => (
    <Animatable.View
      key={item.id}
      animation="fadeInUp"
      duration={600}
      delay={index * 100}
      style={styles.feedbackCard}
    >
      <View style={styles.feedbackHeader}>
        <View style={styles.feedbackInfo}>
          <View style={styles.feedbackTitleRow}>
            <Ionicons 
              name={getTypeIcon(item.type)} 
              size={20} 
              color="#667eea" 
              style={styles.feedbackIcon}
            />
            <Text style={styles.feedbackTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
          <Text style={styles.feedbackUser}>
            by {item.userName} • {formatDate(item.submittedAt)}
          </Text>
        </View>
        <View style={styles.feedbackBadges}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.badgeText}>{item.priority}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.feedbackDescription} numberOfLines={3}>
        {item.description}
      </Text>

      <View style={styles.feedbackFooter}>
        <View style={styles.feedbackMeta}>
          <Text style={styles.feedbackCategory}>{item.category.replace('_', ' ')}</Text>
          {item.gameId && <Text style={styles.feedbackGame}>Game: {item.gameId}</Text>}
        </View>
        <View style={styles.feedbackActions}>
          {item.status === 'open' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleUpdateStatus(item.id, 'in_progress')}
            >
              <Ionicons name="play" size={16} color="#FF9500" />
            </TouchableOpacity>
          )}
          {item.status === 'in_progress' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleUpdateStatus(item.id, 'resolved')}
            >
              <Ionicons name="checkmark" size={16} color="#34C759" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteFeedback(item.id)}
          >
            <Ionicons name="trash" size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      {item.adminComments && (
        <View style={styles.adminComments}>
          <Text style={styles.adminCommentsTitle}>Admin Response:</Text>
          <Text style={styles.adminCommentsText}>{item.adminComments}</Text>
        </View>
      )}
    </Animatable.View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Animatable.View animation="pulse" iterationCount="infinite">
          <Ionicons name="chatbubbles" size={60} color="#667eea" />
        </Animatable.View>
        <Text style={styles.loadingText}>Loading feedback...</Text>
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
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>Feedback Management</Text>
              <Text style={styles.subtitle}>{filteredFeedback.length} feedback items</Text>
            </View>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Ionicons name="filter" size={20} color="white" />
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
        {renderStatsCards()}

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search feedback..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {showFilters && (
          <Animatable.View animation="fadeInDown" duration={300} style={styles.filtersContainer}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterRow}>
                  {['bug', 'suggestion', 'question_issue', 'general'].map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.filterChip,
                        selectedType === type && styles.filterChipSelected
                      ]}
                      onPress={() => setSelectedType(selectedType === type ? null : type)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        selectedType === type && styles.filterChipTextSelected
                      ]}>
                        {type.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Status</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterRow}>
                  {['open', 'in_progress', 'resolved', 'closed'].map(status => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.filterChip,
                        selectedStatus === status && styles.filterChipSelected
                      ]}
                      onPress={() => setSelectedStatus(selectedStatus === status ? null : status)}
                    >
                      <Text style={[
                        styles.filterChipText,
                        selectedStatus === status && styles.filterChipTextSelected
                      ]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </Animatable.View>
        )}

        <View style={styles.feedbackList}>
          {filteredFeedback.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No feedback found</Text>
              <Text style={styles.emptySubtext}>
                {searchText || selectedType || selectedStatus 
                  ? 'Try adjusting your search or filters' 
                  : 'No feedback has been submitted yet'
                }
              </Text>
            </View>
          ) : (
            filteredFeedback.map((item, index) => renderFeedbackCard(item, index))
          )}
        </View>
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    marginBottom: 20,
    paddingHorizontal: 20,
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
    padding: 15,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  filtersContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterChipTextSelected: {
    color: 'white',
  },
  feedbackList: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  feedbackCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  feedbackInfo: {
    flex: 1,
    marginRight: 15,
  },
  feedbackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  feedbackIcon: {
    marginRight: 8,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  feedbackUser: {
    fontSize: 12,
    color: '#666',
  },
  feedbackBadges: {
    flexDirection: 'row',
    gap: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  feedbackDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  feedbackFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedbackMeta: {
    flex: 1,
  },
  feedbackCategory: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
  feedbackGame: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  feedbackActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminComments: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  adminCommentsTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  adminCommentsText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
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
