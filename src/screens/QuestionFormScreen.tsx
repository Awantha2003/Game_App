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
} from 'react-native';
import { Question, QuestionFormData } from '../types/question';
import { QuestionService } from '../services/questionService';

interface QuestionFormScreenProps {
  navigation: any;
  route: {
    params: {
      question?: Question;
      mode: 'create' | 'edit';
    };
  };
}

export const QuestionFormScreen: React.FC<QuestionFormScreenProps> = ({ navigation, route }) => {
  const { question, mode } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<QuestionFormData>({
    prompt: question?.prompt || '',
    options: question?.options || ['', '', '', ''],
    correctAnswer: question?.correctAnswer || 0,
    grade: question?.grade || 1,
    subject: question?.subject || 'Math',
    difficulty: question?.difficulty || 'Easy',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    navigation.setOptions({
      title: mode === 'create' ? 'Add Question' : 'Edit Question',
    });
  }, [mode, navigation]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.prompt.trim()) {
      newErrors.prompt = 'Question prompt is required';
    }

    const validOptions = formData.options.filter(option => option.trim());
    if (validOptions.length < 2) {
      newErrors.options = 'At least 2 options are required';
    }

    if (formData.correctAnswer < 0 || formData.correctAnswer >= validOptions.length) {
      newErrors.correctAnswer = 'Please select a valid correct answer';
    }

    if (!formData.grade || formData.grade < 1 || formData.grade > 5) {
      newErrors.grade = 'Grade must be between 1 and 5';
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

      // Filter out empty options
      const validOptions = formData.options.filter(option => option.trim());
      const correctAnswerIndex = formData.correctAnswer;

      const questionData: QuestionFormData = {
        ...formData,
        options: validOptions,
        correctAnswer: correctAnswerIndex,
      };

      if (mode === 'create') {
        await QuestionService.createQuestion(questionData);
        Alert.alert('Success', 'Question created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await QuestionService.updateQuestion(question!.id, questionData);
        Alert.alert('Success', 'Question updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleCorrectAnswerChange = (index: number) => {
    setFormData({ ...formData, correctAnswer: index });
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({
        ...formData,
        options: [...formData.options, '']
      });
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      const newCorrectAnswer = formData.correctAnswer > index 
        ? formData.correctAnswer - 1 
        : formData.correctAnswer;
      setFormData({
        ...formData,
        options: newOptions,
        correctAnswer: newCorrectAnswer
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Question Details</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Question Prompt *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea, errors.prompt && styles.errorInput]}
                placeholder="Enter your question..."
                value={formData.prompt}
                onChangeText={(text) => setFormData({ ...formData, prompt: text })}
                multiline
                numberOfLines={3}
              />
              {errors.prompt && <Text style={styles.errorText}>{errors.prompt}</Text>}
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
                      onPress={() => setFormData({ ...formData, grade })}
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
                {errors.grade && <Text style={styles.errorText}>{errors.grade}</Text>}
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={styles.label}>Subject *</Text>
                <View style={styles.pickerContainer}>
                  {['Math', 'Spelling', 'General Knowledge'].map(subject => (
                    <TouchableOpacity
                      key={subject}
                      style={[
                        styles.pickerOption,
                        formData.subject === subject && styles.pickerOptionSelected
                      ]}
                      onPress={() => setFormData({ ...formData, subject: subject as any })}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        formData.subject === subject && styles.pickerOptionTextSelected
                      ]}>
                        {subject}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Difficulty *</Text>
              <View style={styles.difficultyContainer}>
                {['Easy', 'Medium', 'Hard'].map(difficulty => (
                  <TouchableOpacity
                    key={difficulty}
                    style={[
                      styles.difficultyButton,
                      formData.difficulty === difficulty && styles.difficultyButtonSelected,
                      { borderColor: difficulty === 'Easy' ? '#34C759' : 
                                   difficulty === 'Medium' ? '#FF9500' : '#FF3B30' }
                    ]}
                    onPress={() => setFormData({ ...formData, difficulty: difficulty as any })}
                  >
                    <Text style={[
                      styles.difficultyButtonText,
                      formData.difficulty === difficulty && styles.difficultyButtonTextSelected,
                      { color: difficulty === 'Easy' ? '#34C759' : 
                               difficulty === 'Medium' ? '#FF9500' : '#FF3B30' }
                    ]}>
                      {difficulty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Answer Options</Text>
            
            {formData.options.map((option, index) => (
              <View key={index} style={styles.optionContainer}>
                <View style={styles.optionHeader}>
                  <Text style={styles.optionLabel}>Option {String.fromCharCode(65 + index)}</Text>
                  <View style={styles.optionActions}>
                    <TouchableOpacity
                      style={[
                        styles.correctButton,
                        formData.correctAnswer === index && styles.correctButtonSelected
                      ]}
                      onPress={() => handleCorrectAnswerChange(index)}
                    >
                      <Text style={[
                        styles.correctButtonText,
                        formData.correctAnswer === index && styles.correctButtonTextSelected
                      ]}>
                        {formData.correctAnswer === index ? '✓ Correct' : 'Mark Correct'}
                      </Text>
                    </TouchableOpacity>
                    {formData.options.length > 2 && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeOption(index)}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <TextInput
                  style={[styles.textInput, errors.options && styles.errorInput]}
                  placeholder={`Enter option ${String.fromCharCode(65 + index)}...`}
                  value={option}
                  onChangeText={(text) => handleOptionChange(index, text)}
                />
              </View>
            ))}

            {formData.options.length < 6 && (
              <TouchableOpacity style={styles.addOptionButton} onPress={addOption}>
                <Text style={styles.addOptionButtonText}>+ Add Option</Text>
              </TouchableOpacity>
            )}

            {errors.options && <Text style={styles.errorText}>{errors.options}</Text>}
            {errors.correctAnswer && <Text style={styles.errorText}>{errors.correctAnswer}</Text>}
          </View>
        </View>
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
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : mode === 'create' ? 'Create Question' : 'Update Question'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
    marginRight: 8,
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
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
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
    marginTop: 4,
  },
  gradeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gradeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  gradeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  gradeButtonTextSelected: {
    color: 'white',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  pickerOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#666',
  },
  pickerOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  difficultyButtonSelected: {
    backgroundColor: '#f0f0f0',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  difficultyButtonTextSelected: {
    fontWeight: 'bold',
  },
  optionContainer: {
    marginBottom: 16,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  correctButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#34C759',
    marginRight: 8,
  },
  correctButtonSelected: {
    backgroundColor: '#34C759',
  },
  correctButtonText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
  },
  correctButtonTextSelected: {
    color: 'white',
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
  },
  removeButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  addOptionButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addOptionButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
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
    borderRadius: 8,
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
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    marginLeft: 12,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
