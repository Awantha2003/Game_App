import React, { useState, useEffect } from 'react';
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
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useAuth } from '../contexts/AuthContext';
// import { LoginTest } from '../components/LoginTest';

const { height, width } = Dimensions.get('screen');

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { login } = useAuth();

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.9);
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation for logo
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Attempting login with:', email.trim(), password);
      await login(email.trim(), password);
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const navigateToStudentSignup = () => {
    navigation.navigate('StudentSignup');
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Animated Background */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#f5576c']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating particles */}
        <View style={styles.particlesContainer}>
          {[...Array(30)].map((_, i) => (
            <Animatable.View
              key={i}
              animation="pulse"
              iterationCount="infinite"
              duration={2000 + i * 100}
              style={[
                styles.particle,
                {
                  left: Math.random() * width,
                  top: Math.random() * height,
                  opacity: Math.random() * 0.6 + 0.2,
                  transform: [{ scale: Math.random() * 0.5 + 0.5 }],
                }
              ]}
            />
          ))}
        </View>

        {/* Geometric shapes */}
        <View style={styles.shapesContainer}>
          <Animatable.View
            animation="rotate"
            iterationCount="infinite"
            duration={15000}
            style={[styles.shape, styles.shape1]}
          />
          <Animatable.View
            animation="rotate"
            iterationCount="infinite"
            duration={20000}
            direction="reverse"
            style={[styles.shape, styles.shape2]}
          />
          <Animatable.View
            animation="rotate"
            iterationCount="infinite"
            duration={25000}
            style={[styles.shape, styles.shape3]}
          />
        </View>

        {/* Header with animated logo */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Animatable.View 
            animation="bounceIn" 
            duration={1500}
            style={styles.logoContainer}
          >
            <Animated.View 
              style={[
                styles.logoCircle,
                { transform: [{ rotate: spin }] }
              ]}
            >
              <LinearGradient
                colors={['#fff', '#f0f8ff']}
                style={styles.logoGradient}
              >
                <Ionicons name="school" size={50} color="#667eea" />
              </LinearGradient>
            </Animated.View>
            <Text style={styles.logoText}>EduGame</Text>
            <Text style={styles.logoSubtext}>Learn • Play • Grow</Text>
          </Animatable.View>
        </Animated.View>

        {/* Main content with glassmorphism */}
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <View style={styles.glassContainer}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue your learning journey</Text>

            {/* Modern input fields */}
            <View style={styles.inputWrapper}>
              <Animatable.View 
                animation="fadeInLeft" 
                duration={800}
                delay={200}
              >
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'email' && styles.inputContainerFocused
                ]}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons 
                      name="mail" 
                      size={22} 
                      color={focusedInput === 'email' ? '#667eea' : '#999'} 
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </Animatable.View>

              <Animatable.View 
                animation="fadeInRight" 
                duration={800}
                delay={400}
              >
                <View style={[
                  styles.inputContainer,
                  focusedInput === 'password' && styles.inputContainerFocused
                ]}>
                  <View style={styles.inputIconContainer}>
                    <Ionicons 
                      name="lock-closed" 
                      size={22} 
                      color={focusedInput === 'password' ? '#667eea' : '#999'} 
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={22} 
                      color="#999" 
                    />
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            </View>

            {/* Modern login button */}
            <Animatable.View 
              animation="fadeInUp" 
              duration={800}
              delay={600}
            >
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isLoading ? ['#ccc', '#999'] : ['#667eea', '#764ba2', '#f093fb']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <View style={styles.loginButtonContent}>
                    {isLoading ? (
                      <Animatable.View animation="rotate" iterationCount="infinite">
                        <Ionicons name="refresh" size={20} color="#fff" />
                      </Animatable.View>
                    ) : (
                      <Ionicons name="arrow-forward" size={20} color="#fff" />
                    )}
                    <Text style={styles.loginButtonText}>
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>

            {/* Divider */}
            <Animatable.View 
              animation="fadeIn" 
              duration={800}
              delay={800}
              style={styles.divider}
            >
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </Animatable.View>

            {/* Student button */}
            <Animatable.View 
              animation="fadeInUp" 
              duration={800}
              delay={1000}
            >
              <TouchableOpacity 
                style={styles.studentButton}
                onPress={() => navigation.navigate('StudentDashboard')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.studentGradient}
                >
                  <Ionicons name="game-controller" size={20} color="#fff" />
                  <Text style={styles.studentButtonText}>Continue as Student</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>

            {/* Forgot password */}
            <Animatable.View 
              animation="fadeIn" 
              duration={800}
              delay={1200}
            >
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={navigateToForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </Animatable.View>

            {/* Student signup */}
            <Animatable.View 
              animation="fadeInUp" 
              duration={800}
              delay={1400}
            >
              <TouchableOpacity
                style={styles.studentSignupButton}
                onPress={navigateToStudentSignup}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4facfe', '#00f2fe']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.studentSignupGradient}
                >
                  <Ionicons name="person-add" size={20} color="#fff" />
                  <Text style={styles.studentSignupText}>Sign Up as Student</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>

            {/* Register link */}
            <Animatable.View 
              animation="fadeIn" 
              duration={800}
              delay={1600}
              style={styles.registerContainer}
            >
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.registerLink}>Register as Teacher</Text>
              </TouchableOpacity>
            </Animatable.View>

            {/* Temporary Login Test Component - Disabled for now */}
            {/* <Animatable.View 
              animation="fadeInUp" 
              duration={800}
              delay={1800}
              style={styles.testContainer}
            >
              <LoginTest />
            </Animatable.View> */}
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  shapesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shape: {
    position: 'absolute',
    opacity: 0.1,
  },
  shape1: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    top: '10%',
    right: '10%',
  },
  shape2: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    top: '60%',
    left: '5%',
    transform: [{ rotate: '45deg' }],
  },
  shape3: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    top: '30%',
    left: '20%',
    borderRadius: 10,
  },
  header: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 25,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  logoSubtext: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '300',
    letterSpacing: 1,
  },
  content: {
    flex: 0.6,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 30,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    fontWeight: '400',
  },
  inputWrapper: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainerFocused: {
    borderColor: '#667eea',
    backgroundColor: '#fff',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  inputIconContainer: {
    marginRight: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  loginButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  buttonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    marginHorizontal: 25,
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  studentButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#4facfe',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  studentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  studentButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 15,
  },
  forgotPasswordText: {
    fontSize: 18,
    color: '#667eea',
    fontWeight: '600',
  },
  studentSignupButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 15,
    marginBottom: 25,
    shadowColor: '#4facfe',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  studentSignupGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  studentSignupText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 15,
  },
  registerText: {
    fontSize: 18,
    color: '#666',
  },
  registerLink: {
    fontSize: 18,
    color: '#667eea',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  testContainer: {
    marginTop: 30,
    padding: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
  },
});