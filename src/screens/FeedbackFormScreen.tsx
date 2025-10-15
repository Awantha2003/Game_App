import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { FeedbackFormData } from '../types/feedback';
import { FeedbackService } from '../services/feedbackService';

const { width } = Dimensions.get('window');

interface FeedbackFormScreenProps {
  navigation: any;
  route?: any;
}

export const FeedbackFormScreen: React.FC<FeedbackFormScreenProps> = ({ navigation, route }) => {
  const { gameId, questionId, levelId } = route?.params || {};
  
  const [formData, setFormData] = useState<FeedbackFormData>({
    type: 'general',
    category: 'other',
    title: '',
    description: '',
    gameId,
    questionId,
    levelId,
    priority: 'medium',
  });
  const [isLoading, setIsLoading] = useState(false);

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', icon: 'bug' },
    { value: 'suggestion', label: 'Suggestion', icon: 'bulb' },
    { value: 'question_issue', label: 'Question Issue', icon: 'help-circle' },
    { value: 'general', label: 'General Feedback', icon: 'chatbubble' },
  ];

  const feedbackCategories = [
    { value: 'incorrect_answer', label: 'Incorrect Answer', icon: 'close-circle' },
    { value: 'spelling_mistake', label: 'Spelling Mistake', icon: 'text' },
    { value: 'technical_issue', label: 'Technical Issue', icon: 'settings' },
    { value: 'content_issue', label: 'Content Issue', icon: 'document-text' },
    { value: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: '#34C759' },
    { value: 'medium', label: 'Medium', color: '#FF9500' },
    { value: 'high', label: 'High', color: '#FF3B30' },
    { value: 'critical', label: 'Critical', color: '#8B0000' },
  ];

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title for your feedback');
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please provide a description');
      return;
    }

    try {
      setIsLoading(true);
      await FeedbackService.submitFeedback(formData);
      
      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully. We appreciate your input!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof FeedbackFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Feedback Type</Text>
      <View style={styles.selectorContainer}>
        {feedbackTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.selectorItem,
              formData.type === type.value && styles.selectorItemSelected
            ]}
            onPress={() => updateFormData('type', type.value)}
          >
            <Ionicons 
              name={type.icon} 
              size={20} 
              color={formData.type === type.value ? 'white' : '#667eea'} 
            />
            <Text style={[
              styles.selectorText,
              formData.type === type.value && styles.selectorTextSelected
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCategorySelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Category</Text>
      <View style={styles.selectorContainer}>
        {feedbackCategories.map((category) => (
          <TouchableOpacity
            key={category.value}
            style={[
              styles.selectorItem,
              formData.category === category.value && styles.selectorItemSelected
            ]}
            onPress={() => updateFormData('category', category.value)}
          >
            <Ionicons 
              name={category.icon} 
              size={20} 
              color={formData.category === category.value ? 'white' : '#667eea'} 
            />
            <Text style={[
              styles.selectorText,
              formData.category === category.value && styles.selectorTextSelected
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPrioritySelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Priority</Text>
      <View style={styles.priorityContainer}>
        {priorityLevels.map((priority) => (
          <TouchableOpacity
            key={priority.value}
            style={[
              styles.priorityItem,
              formData.priority === priority.value && styles.priorityItemSelected
            ]}
            onPress={() => updateFormData('priority', priority.value)}
          >
            <View style={[
              styles.priorityIndicator,
              { backgroundColor: priority.color }
            ]} />
            <Text style={[
              styles.priorityText,
              formData.priority === priority.value && styles.priorityTextSelected
            ]}>
              {priority.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

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
              <Text style={styles.title}>Submit Feedback</Text>
              <Text style={styles.subtitle}>Help us improve the app</Text>
            </View>
          </View>
        </Animatable.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={1000} delay={200}>
          <View style={styles.formContainer}>
            {renderTypeSelector()}
            {renderCategorySelector()}
            {renderPrioritySelector()}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Title</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Brief description of the issue"
                  placeholderTextColor="#999"
                  value={formData.title}
                  onChangeText={(text) => updateFormData('title', text)}
                  maxLength={100}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Please provide detailed information about the issue or suggestion..."
                  placeholderTextColor="#999"
                  value={formData.description}
                  onChangeText={(text) => updateFormData('description', text)}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#ccc', '#999'] : ['#667eea', '#764ba2']}
                style={styles.submitButtonGradient}
              >
                <Ionicons name="send" size={20} color="white" />
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Submitting...' : 'Submit Feedback'}
                </Text>
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
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  selectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  selectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  selectorItemSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  selectorText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '600',
  },
  selectorTextSelected: {
    color: 'white',
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  priorityItemSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  priorityTextSelected: {
    color: 'white',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  textAreaContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minHeight: 120,
  },
  textArea: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  submitButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
