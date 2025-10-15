import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4facfe" />
      <LinearGradient
        colors={['#4facfe', '#00f2fe', '#667eea']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Animatable.View
            animation="bounceIn"
            duration={1500}
            style={styles.logoContainer}
          >
            <View style={styles.logoCircle}>
              <Ionicons name="school" size={80} color="white" />
            </View>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            delay={500}
            style={styles.textContainer}
          >
            <Text style={styles.appName}>EduGame</Text>
            <Text style={styles.tagline}>Learn with Fun</Text>
            <Text style={styles.description}>
              Interactive educational games for students
            </Text>
          </Animatable.View>

          <Animatable.View
            animation="fadeIn"
            duration={1000}
            delay={1500}
            style={styles.loadingContainer}
          >
            <View style={styles.loadingDots}>
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                duration={1000}
                style={[styles.dot, { backgroundColor: 'white' }]}
              />
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                duration={1000}
                delay={200}
                style={[styles.dot, { backgroundColor: 'rgba(255,255,255,0.7)' }]}
              />
              <Animatable.View
                animation="pulse"
                iterationCount="infinite"
                duration={1000}
                delay={400}
                style={[styles.dot, { backgroundColor: 'rgba(255,255,255,0.4)' }]}
              />
            </View>
          </Animatable.View>
        </View>

        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          delay={2000}
          style={styles.footer}
        >
          <Text style={styles.footerText}>Powered by React Native</Text>
        </Animatable.View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 15,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
});
