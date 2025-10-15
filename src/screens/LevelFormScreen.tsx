import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { Level, LevelFormData, QuestionOption } from '../types/level';
import { LevelService } from '../services/levelService';

const { width } = Dimensions.get('window');

interface LevelFormScreenProps {
  navigation: any;
  route: any;
}

export const LevelFormScreen: React.FC<LevelFormScreenProps> = ({ navigation, route }) => {
  const { level, mode } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState<QuestionOption[]>([]);
  const [formData, setFormData] = useState<LevelFormData>({
    title: level?.title || '',
    description: level?.description || '',
    grade: level?.grade || 1,
    subject: level?.subject || 'Math',
    difficulty: level?.difficulty || 'Easy',
    passScore: level?.passScore || 7,
    questionIds: level?.questionIds || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    navigation.setOptions({
      title: mode === 'create' ? 'Create Level' : 'Edit Level',
    });
    loadAvailableQuestions();
  }, [mode, navigation]);

  const loadAvailableQuestions = async () => {
    try {
      const questions = await LevelService.getAvailableQuestions(
        formData.grade,
        formData.subject
      );
      setAvailableQuestions(questions);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Level title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Level description is required';
    }

    if (formData.passScore < 1 || formData.passScore > formData.questionIds.length) {
      newErrors.passScore = 'Pass score must be between 1 and total questions';
    }

    if (formData.questionIds.length === 0) {
      newErrors.questionIds = 'At least one question must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }

    try {
      setIsLoading(true);

      if (mode === 'create') {
        await LevelService.createLevel(formData);
        Alert.alert('Success', 'Level created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await LevelService.updateLevel(level!.id, formData);
        Alert.alert('Success', 'Level updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save level. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionToggle = (questionId: string) => {
    const isSelected = formData.questionIds.includes(questionId);
    if (isSelected) {
      setFormData({
        ...formData,
        questionIds: formData.questionIds.filter(id => id !== questionId)
      });
    } else {
      setFormData({
        ...formData,
        questionIds: [...formData.questionIds, questionId]
      });
    }
  };

  const handleGradeChange = (grade: number) => {
    setFormData({ ...formData, grade });
    // Reload questions for new grade
    setTimeout(() => loadAvailableQuestions(), 100);
  };

  const handleSubjectChange = (subject: string) => {
    setFormData({ ...formData, subject: subject as any });
    // Reload questions for new subject
    setTimeout(() => loadAvailableQuestions(), 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#34C759';
      case 'Medium': return '#FF9500';
      case 'Hard': return '#FF3B30';
      default: return '#666';
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Math': return '#667eea';
      case 'Spelling': return '#f093fb';
      case 'General Knowledge': return '#4facfe';
      default: return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Animatable.View animation="fadeInDown" duration={1000}>
          <Text style={styles.headerTitle}>
            {mode === 'create' ? 'Create New Level' : 'Edit Level'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {mode === 'create' ? 'Design your educational level' : 'Update level details'}
          </Text>
        </Animatable.View>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Animatable.View animation="fadeInUp" duration={1000} delay={200}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Level Details</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Level Title *</Text>
                <TextInput
                  style={[styles.textInput, errors.title && styles.errorInput]}
                  placeholder="Enter level title..."
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea, errors.description && styles.errorInput]}
                  placeholder="Enter level description..."
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  multiline
                  numberOfLines={3}
                />
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Grade *</Text>
                  <View style={styles.gradeContainer}>
                    {[1, 2, 3, 4, 5].map(grade => (
                      <TouchableOpacity
                        key={grade}
                        style={[
                          styles.gradeButton,
                          formData.grade === grade && styles.gradeButtonSelected
                        ]}
                        onPress={() => handleGradeChange(grade)}
                      >
                        <Text style={[
                          styles.gradeButtonText,
                          formData.grade === grade && styles.gradeButtonTextSelected
                        ]}>
                          {grade}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Subject *</Text>
                  <View style={styles.subjectContainer}>
                    {['Math', 'Spelling', 'General Knowledge'].map(subject => (
                      <TouchableOpacity
                        key={subject}
                        style={[
                          styles.subjectButton,
                          formData.subject === subject && styles.subjectButtonSelected,
                          { borderColor: getSubjectColor(subject) }
                        ]}
                        onPress={() => handleSubjectChange(subject)}
                      >
                        <Text style={[
                          styles.subjectButtonText,
                          formData.subject === subject && styles.subjectButtonTextSelected,
                          { color: getSubjectColor(subject) }
                        ]}>
                          {subject}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Difficulty *</Text>
                  <View style={styles.difficultyContainer}>
                    {['Easy', 'Medium', 'Hard'].map(difficulty => (
                      <TouchableOpacity
                        key={difficulty}
                        style={[
                          styles.difficultyButton,
                          formData.difficulty === difficulty && styles.difficultyButtonSelected,
                          { borderColor: getDifficultyColor(difficulty) }
                        ]}
                        onPress={() => setFormData({ ...formData, difficulty: difficulty as any })}
                      >
                        <Text style={[
                          styles.difficultyButtonText,
                          formData.difficulty === difficulty && styles.difficultyButtonTextSelected,
                          { color: getDifficultyColor(difficulty) }
                        ]}>
                          {difficulty}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Pass Score *</Text>
                  <TextInput
                    style={[styles.textInput, errors.passScore && styles.errorInput]}
                    placeholder="e.g., 7"
                    value={formData.passScore.toString()}
                    onChangeText={(text) => setFormData({ ...formData, passScore: parseInt(text) || 0 })}
                    keyboardType="numeric"
                  />
                  {errors.passScore && <Text style={styles.errorText}>{errors.passScore}</Text>}
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Select Questions</Text>
                <Text style={styles.questionCount}>
                  {formData.questionIds.length} selected
                </Text>
              </View>
              
              {errors.questionIds && <Text style={styles.errorText}>{errors.questionIds}</Text>}
              
              <View style={styles.questionsList}>
                {availableQuestions.map((question, index) => (
                  <Animatable.View
                    key={question.id}
                    animation="fadeInUp"
                    duration={600}
                    delay={index * 100}
                  >
                    <TouchableOpacity
                      style={[
                        styles.questionCard,
                        formData.questionIds.includes(question.id) && styles.questionCardSelected
                      ]}
                      onPress={() => handleQuestionToggle(question.id)}
                    >
                      <View style={styles.questionHeader}>
                        <View style={styles.questionInfo}>
                          <Text style={styles.questionPrompt} numberOfLines={2}>
                            {question.prompt}
                          </Text>
                          <View style={styles.questionMeta}>
                            <Text style={styles.questionGrade}>Grade {question.grade}</Text>
                            <Text style={styles.questionSubject}>{question.subject}</Text>
                            <Text style={[
                              styles.questionDifficulty,
                              { color: getDifficultyColor(question.difficulty) }
                            ]}>
                              {question.difficulty}
                            </Text>
                          </View>
                        </View>
                        <View style={[
                          styles.checkbox,
                          formData.questionIds.includes(question.id) && styles.checkboxSelected
                        ]}>
                          {formData.questionIds.includes(question.id) && (
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animatable.View>
                ))}
              </View>
            </View>
          </Animatable.View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.disabledButton]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <LinearGradient
              colors={isLoading ? ['#ccc', '#999'] : ['#667eea', '#764ba2']}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Saving...' : mode === 'create' ? 'Create Level' : 'Update Level'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  questionCount: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 5,
  },
  gradeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gradeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeButtonSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  gradeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  gradeButtonTextSelected: {
    color: 'white',
  },
  subjectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subjectButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
    marginBottom: 8,
  },
  subjectButtonSelected: {
    backgroundColor: '#f8f9fa',
  },
  subjectButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subjectButtonTextSelected: {
    fontWeight: 'bold',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  difficultyButtonSelected: {
    backgroundColor: '#f8f9fa',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  difficultyButtonTextSelected: {
    fontWeight: 'bold',
  },
  questionsList: {
    marginTop: 10,
  },
  questionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  questionCardSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#667eea',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionInfo: {
    flex: 1,
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
  questionGrade: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  questionSubject: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  questionDifficulty: {
    fontSize: 12,
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkboxSelected: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 12,
  },
  saveButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
