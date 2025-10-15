import { User, RegisterData, LoginData, AuthResponse, ApiResponse } from '../types';
import { SecureStorageService } from './secureStorage';

// Mock API base URL - replace with your actual backend URL
const API_BASE_URL = 'http://localhost:3000/api';

export class AuthService {
  static async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      // Check for specific teacher credentials
      if (loginData.email === 't1@gmail.com' && loginData.password === 'Teacher123@') {
        const mockResponse: AuthResponse = {
          user: {
            id: '2',
            email: 't1@gmail.com',
            name: 'Teacher User',
            role: 'teacher',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          token: 'mock-jwt-token-' + Date.now()
        };

        // Store token and user data securely
        await SecureStorageService.setToken(mockResponse.token);
        await SecureStorageService.setUser(mockResponse.user);

        return mockResponse;
      }

      // For other users, use generic mock data
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          email: loginData.email,
          name: 'John Doe',
          role: 'teacher',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: 'mock-jwt-token-' + Date.now()
      };

      // Store token and user data securely
      await SecureStorageService.setToken(mockResponse.token);
      await SecureStorageService.setUser(mockResponse.user);

      return mockResponse;

      // Uncomment below for real API integration:
      /*
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data: AuthResponse = await response.json();
      
      // Store token and user data securely
      await SecureStorageService.setToken(data.token);
      await SecureStorageService.setUser(data.user);

      return data;
      */
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      const mockResponse: AuthResponse = {
        user: {
          id: '2',
          email: registerData.email,
          name: registerData.name,
          role: registerData.role,
          grade: registerData.grade,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        token: 'mock-jwt-token-' + Date.now()
      };

      // Store token and user data securely
      await SecureStorageService.setToken(mockResponse.token);
      await SecureStorageService.setUser(mockResponse.user);

      return mockResponse;

      // Uncomment below for real API integration:
      /*
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data: AuthResponse = await response.json();
      
      // Store token and user data securely
      await SecureStorageService.setToken(data.token);
      await SecureStorageService.setUser(data.user);

      return data;
      */
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      // Clear stored data
      await SecureStorageService.clearAll();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      return await SecureStorageService.getUser();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      // For now, we'll use mock data. Replace with actual API call
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const updatedUser: User = {
        ...currentUser,
        ...userData,
        updatedAt: new Date().toISOString()
      };

      // Update stored user data
      await SecureStorageService.setUser(updatedUser);

      return updatedUser;

      // Uncomment below for real API integration:
      /*
      const token = await SecureStorageService.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }

      const data: User = await response.json();
      
      // Update stored user data
      await SecureStorageService.setUser(data);

      return data;
      */
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await SecureStorageService.getToken();
      const user = await SecureStorageService.getUser();
      return !!(token && user);
    } catch (error) {
      console.error('Check authentication error:', error);
      return false;
    }
  }
}
