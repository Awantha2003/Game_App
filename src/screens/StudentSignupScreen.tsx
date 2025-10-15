import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { height } = Dimensions.get('screen');

interface StudentSignupScreenProps {
  navigation: any;
}

export const StudentSignupScreen: React.FC<StudentSignupScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }

    if (!formData.grade) {
      Alert.alert('Error', 'Please select your grade');
      return false;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }

    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success!',
        'Your student account has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('StudentDashboard'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToStudentDashboard = () => {
    navigation.navigate('StudentDashboard');
  };

  const grades = [
    { value: '1', label: 'Grade 1' },
    { value: '2', label: 'Grade 2' },
    { value: '3', label: 'Grade 3' },
    { value: '4', label: 'Grade 4' },
    { value: '5', label: 'Grade 5' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4facfe" />
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <Animatable.View animation="fadeInDown" duration={1000}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.logoContainer}>
                <Ionicons name="school" size={60} color="white" />
                <Text style={styles.logoText}>Student Signup</Text>
              </View>
            </Animatable.View>
          </View>

          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            style={styles.footer}
          >
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.formContainer}>
                <Text style={styles.title}>Create Student Account</Text>
                <Text style={styles.subtitle}>
                  Join the learning adventure and start playing educational games!
                </Text>

                <View style={styles.inputWrapper}>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person" size={20} color="#4facfe" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#999"
                      value={formData.name}
                      onChangeText={(text) => handleInputChange('name', text)}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Ionicons name="school" size={20} color="#4facfe" style={styles.inputIcon} />
                    <View style={styles.gradeSelector}>
                      <Text style={styles.gradeLabel}>Grade:</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.gradeOptions}>
                          {grades.map((grade) => (
                            <TouchableOpacity
                              key={grade.value}
                              style={[
                                styles.gradeOption,
                                formData.grade === grade.value && styles.gradeOptionSelected
                              ]}
                              onPress={() => handleInputChange('grade', grade.value)}
                            >
                              <Text style={[
                                styles.gradeOptionText,
                                formData.grade === grade.value && styles.gradeOptionTextSelected
                              ]}>
                                {grade.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </ScrollView>
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Ionicons name="mail" size={20} color="#4facfe" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email Address"
                      placeholderTextColor="#999"
                      value={formData.email}
                      onChangeText={(text) => handleInputChange('email', text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed" size={20} color="#4facfe" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#999"
                      value={formData.password}
                      onChangeText={(text) => handleInputChange('password', text)}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed" size={20} color="#4facfe" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      placeholderTextColor="#999"
                      value={formData.confirmPassword}
                      onChangeText={(text) => handleInputChange('confirmPassword', text)}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.signupButton, isLoading && styles.disabledButton]}
                  onPress={handleSignup}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={isLoading ? ['#ccc', '#999'] : ['#4facfe', '#00f2fe']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.signupButtonText}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={navigateToStudentDashboard}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.playButtonGradient}
                  >
                    <Ionicons name="play" size={20} color="#fff" />
                    <Text style={styles.playButtonText}>Play Without Account</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <TouchableOpacity onPress={navigateToLogin}>
                    <Text style={styles.loginLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </Animatable.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  footer: {
    flex: 0.7,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  inputWrapper: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  gradeSelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
    fontWeight: '600',
  },
  gradeOptions: {
    flexDirection: 'row',
  },
  gradeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    backgroundColor: 'white',
  },
  gradeOptionSelected: {
    backgroundColor: '#4facfe',
    borderColor: '#4facfe',
  },
  gradeOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  gradeOptionTextSelected: {
    color: 'white',
  },
  signupButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#4facfe',
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
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  playButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#4facfe',
    fontWeight: 'bold',
  },
});
