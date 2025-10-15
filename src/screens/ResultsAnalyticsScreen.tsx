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
import { AnalyticsData, PerformanceMetrics, LeaderboardEntry, AnalyticsInsights } from '../types/analytics';
import { AnalyticsService } from '../services/analyticsService';

const { width } = Dimensions.get('window');

interface ResultsAnalyticsScreenProps {
  navigation: any;
}

export const ResultsAnalyticsScreen: React.FC<ResultsAnalyticsScreenProps> = ({ navigation }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [insights, setInsights] = useState<AnalyticsInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'week' | 'month' | 'quarter'>('month');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [selectedFilter, selectedSubject]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const [analytics, performance, leaderboardData, insightsData] = await Promise.all([
        AnalyticsService.getAnalyticsData({ timeRange: selectedFilter }),
        AnalyticsService.getPerformanceMetrics(),
        AnalyticsService.getLeaderboard(selectedSubject || undefined),
        AnalyticsService.getAnalyticsInsights(),
      ]);
      setAnalyticsData(analytics);
      setPerformanceMetrics(performance);
      setLeaderboard(leaderboardData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderOverviewCards = () => {
    if (!analyticsData) return null;

    return (
      <Animatable.View animation="fadeInUp" duration={1000} delay={200}>
        <View style={styles.overviewContainer}>
          <View style={styles.overviewCard}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.overviewGradient}
            >
              <Ionicons name="game-controller" size={24} color="white" />
              <Text style={styles.overviewNumber}>{analyticsData.totalGames}</Text>
              <Text style={styles.overviewLabel}>Total Games</Text>
            </LinearGradient>
          </View>
          <View style={styles.overviewCard}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.overviewGradient}
            >
              <Ionicons name="people" size={24} color="white" />
              <Text style={styles.overviewNumber}>{analyticsData.totalStudents}</Text>
              <Text style={styles.overviewLabel}>Students</Text>
            </LinearGradient>
          </View>
          <View style={styles.overviewCard}>
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.overviewGradient}
            >
              <Ionicons name="trophy" size={24} color="white" />
              <Text style={styles.overviewNumber}>{analyticsData.averageScore.toFixed(1)}</Text>
              <Text style={styles.overviewLabel}>Avg Score</Text>
            </LinearGradient>
          </View>
          <View style={styles.overviewCard}>
            <LinearGradient
              colors={['#34C759', '#2ECC71']}
              style={styles.overviewGradient}
            >
              <Ionicons name="checkmark-circle" size={24} color="white" />
              <Text style={styles.overviewNumber}>{analyticsData.completionRate.toFixed(1)}%</Text>
              <Text style={styles.overviewLabel}>Completion</Text>
            </LinearGradient>
          </View>
        </View>
      </Animatable.View>
    );
  };

  const renderPerformanceMetrics = () => (
    <Animatable.View animation="fadeInUp" duration={1000} delay={400}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance by Grade & Subject</Text>
        <View style={styles.metricsContainer}>
          {performanceMetrics.slice(0, 6).map((metric, index) => (
            <View key={`${metric.grade}-${metric.subject}`} style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricTitle}>Grade {metric.grade} - {metric.subject}</Text>
                <View style={styles.metricBadge}>
                  <Text style={styles.metricBadgeText}>{metric.totalGames} games</Text>
                </View>
              </View>
              <View style={styles.metricStats}>
                <View style={styles.metricStat}>
                  <Text style={styles.metricStatValue}>{metric.averageScore.toFixed(1)}</Text>
                  <Text style={styles.metricStatLabel}>Avg Score</Text>
                </View>
                <View style={styles.metricStat}>
                  <Text style={styles.metricStatValue}>{metric.completionRate.toFixed(1)}%</Text>
                  <Text style={styles.metricStatLabel}>Completion</Text>
                </View>
                <View style={styles.metricStat}>
                  <Text style={[
                    styles.metricStatValue,
                    { color: metric.improvement >= 0 ? '#34C759' : '#FF3B30' }
                  ]}>
                    {metric.improvement >= 0 ? '+' : ''}{metric.improvement.toFixed(1)}%
                  </Text>
                  <Text style={styles.metricStatLabel}>Improvement</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Animatable.View>
  );

  const renderLeaderboard = () => (
    <Animatable.View animation="fadeInUp" duration={1000} delay={600}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Performers</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color="#667eea" />
          </TouchableOpacity>
        </View>
        <View style={styles.leaderboardContainer}>
          {leaderboard.slice(0, 5).map((entry, index) => (
            <View key={entry.studentId || entry.studentName} style={styles.leaderboardItem}>
              <View style={styles.leaderboardRank}>
                <Text style={styles.rankNumber}>{entry.rank}</Text>
              </View>
              <View style={styles.leaderboardInfo}>
                <Text style={styles.studentName} numberOfLines={1}>
                  {entry.studentName}
                </Text>
                <Text style={styles.studentDetails}>
                  Grade {entry.grade} • {entry.subject} • {entry.totalGames} games
                </Text>
              </View>
              <View style={styles.leaderboardScore}>
                <Text style={styles.scoreValue}>{entry.score}</Text>
                <Text style={styles.scoreLabel}>Best Score</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Animatable.View>
  );

  const renderInsights = () => {
    if (!insights) return null;

    return (
      <Animatable.View animation="fadeInUp" duration={1000} delay={800}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights & Recommendations</Text>
          <View style={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <Ionicons name="trending-up" size={24} color="#34C759" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Top Performing Subject</Text>
                <Text style={styles.insightValue}>{insights.topPerformingSubject}</Text>
              </View>
            </View>
            <View style={styles.insightCard}>
              <Ionicons name="school" size={24} color="#667eea" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Most Improved Grade</Text>
                <Text style={styles.insightValue}>Grade {insights.mostImprovedGrade}</Text>
              </View>
            </View>
            <View style={styles.insightCard}>
              <Ionicons name="time" size={24} color="#FF9500" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Peak Activity Time</Text>
                <Text style={styles.insightValue}>{insights.peakActivityTime}</Text>
              </View>
            </View>
            <View style={styles.insightCard}>
              <Ionicons name="trending-up" size={24} color="#4facfe" />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Engagement Trend</Text>
                <Text style={styles.insightValue} style={{ 
                  color: insights.engagementTrend === 'increasing' ? '#34C759' : 
                         insights.engagementTrend === 'decreasing' ? '#FF3B30' : '#FF9500'
                }}>
                  {insights.engagementTrend.charAt(0).toUpperCase() + insights.engagementTrend.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationsTitle}>Recommendations</Text>
            {insights.recommendations.map((recommendation, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Ionicons name="bulb" size={16} color="#FFD700" />
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animatable.View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Animatable.View animation="pulse" iterationCount="infinite">
          <Ionicons name="analytics" size={60} color="#667eea" />
        </Animatable.View>
        <Text style={styles.loadingText}>Loading analytics...</Text>
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
              <Text style={styles.title}>Analytics Dashboard</Text>
              <Text style={styles.subtitle}>Performance insights and trends</Text>
            </View>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={onRefresh}
            >
              <Ionicons name="refresh" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {['all', 'week', 'month', 'quarter'].map(filter => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    selectedFilter === filter && styles.filterButtonSelected
                  ]}
                  onPress={() => setSelectedFilter(filter as any)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    selectedFilter === filter && styles.filterButtonTextSelected
                  ]}>
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderOverviewCards()}
        {renderPerformanceMetrics()}
        {renderLeaderboard()}
        {renderInsights()}
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
    marginBottom: 20,
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
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    marginTop: 10,
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButtonSelected: {
    backgroundColor: 'white',
    borderColor: 'white',
  },
  filterButtonText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  filterButtonTextSelected: {
    color: '#667eea',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  overviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  overviewCard: {
    width: (width - 60) / 2,
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
  overviewGradient: {
    padding: 20,
    alignItems: 'center',
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginRight: 4,
  },
  metricsContainer: {
    marginTop: 10,
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
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
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  metricBadge: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  metricBadgeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  metricStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricStat: {
    alignItems: 'center',
    flex: 1,
  },
  metricStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  metricStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  leaderboardContainer: {
    marginTop: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  leaderboardRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  leaderboardInfo: {
    flex: 1,
    marginRight: 15,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  studentDetails: {
    fontSize: 12,
    color: '#666',
  },
  leaderboardScore: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 2,
  },
  scoreLabel: {
    fontSize: 10,
    color: '#666',
  },
  insightsContainer: {
    marginTop: 10,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
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
  insightContent: {
    flex: 1,
    marginLeft: 15,
  },
  insightTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recommendationsContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 15,
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
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 10,
    flex: 1,
  },
});
