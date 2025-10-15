import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export const LoginTest: React.FC = () => {
  const { login, user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const testTeacherLogin = async () => {
    try {
      setIsLoading(true);
      await login('t1@gmail.com', 'Teacher123@');
      Alert.alert('Success', 'Teacher login successful!');
    } catch (error) {
      Alert.alert('Error', 'Teacher login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const testAdminLogin = async () => {
    try {
      setIsLoading(true);
      await login('admin@edugame.com', 'admin123');
      Alert.alert('Success', 'Admin login successful!');
    } catch (error) {
      Alert.alert('Error', 'Admin login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const testStudentLogin = async () => {
    try {
      setIsLoading(true);
      await login('student@test.com', 'password123');
      Alert.alert('Success', 'Student login successful!');
    } catch (error) {
      Alert.alert('Error', 'Student login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert('Success', 'Logout successful!');
    } catch (error) {
      Alert.alert('Error', 'Logout failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Test</Text>
      
      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.userText}>Logged in as: {user.name}</Text>
          <Text style={styles.userText}>Role: {user.role}</Text>
          <Text style={styles.userText}>Email: {user.email}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loginButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.teacherButton]} 
            onPress={testTeacherLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : 'Test Teacher Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.adminButton]} 
            onPress={testAdminLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : 'Test Admin Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.studentButton]} 
            onPress={testStudentLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : 'Test Student Login'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  userInfo: {
    alignItems: 'center',
  },
  userText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  loginButtons: {
    width: '100%',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  teacherButton: {
    backgroundColor: '#4facfe',
  },
  adminButton: {
    backgroundColor: '#FF3B30',
  },
  studentButton: {
    backgroundColor: '#34C759',
  },
  logoutButton: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
