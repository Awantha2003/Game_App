import { SecureStorage } from './secureStorage';

// Mock API base URL - replace with your actual backend URL
const API_BASE_URL = 'http://localhost:3000/api';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  grade?: string;
  isEmailVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export class AuthServiceEnhanced {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_PROFILE_KEY = 'user_profile';
  private static readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  // Mock data for development
  private static mockUsers: UserProfile[] = [
    {
      id: '1',
      email: 'admin@edugame.com',
      name: 'Admin User',
      role: 'admin',
      isEmailVerified: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'teacher@edugame.com',
      name: 'Teacher User',
      role: 'teacher',
      isEmailVerified: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Mock authentication - replace with real API call
      const user = this.mockUsers.find(u => u.email === email);
      if (!user || password !== 'password') {
        throw new Error('Invalid credentials');
      }

      const tokens: AuthTokens = {
        accessToken: this.generateMockToken(user.id, 'access'),
        refreshToken: this.generateMockToken(user.id, 'refresh'),
        expiresAt: Date.now() + (15 * 60 * 1000), // 15 minutes
      };

      // Store tokens securely
      await this.storeTokens(tokens);
      await this.storeUserProfile(user);

      return { user, tokens };

      // Uncomment below for real API integration:
      /*
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      await this.storeTokens(data.tokens);
      await this.storeUserProfile(data.user);
      return data;
      */
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async refreshAccessToken(): Promise<AuthTokens> {
    try {
      const refreshToken = await SecureStorage.get(this.REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Mock token refresh - replace with real API call
      const newTokens: AuthTokens = {
        accessToken: this.generateMockToken('user_id', 'access'),
        refreshToken: this.generateMockToken('user_id', 'refresh'),
        expiresAt: Date.now() + (15 * 60 * 1000), // 15 minutes
      };

      await this.storeTokens(newTokens);
      return newTokens;

      // Uncomment below for real API integration:
      /*
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      await this.storeTokens(data.tokens);
      return data.tokens;
      */
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      const refreshToken = await SecureStorage.get(this.REFRESH_TOKEN_KEY);
      
      // Clear local storage
      await SecureStorage.delete(this.ACCESS_TOKEN_KEY);
      await SecureStorage.delete(this.REFRESH_TOKEN_KEY);
      await SecureStorage.delete(this.USER_PROFILE_KEY);
      await SecureStorage.delete(this.TOKEN_EXPIRY_KEY);

      // Revoke token on server (if available)
      if (refreshToken) {
        // Uncomment below for real API integration:
        /*
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`,
          },
        });
        */
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if server call fails
    }
  }

  static async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const userProfile = await SecureStorage.get(this.USER_PROFILE_KEY);
      return userProfile ? JSON.parse(userProfile) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async getAccessToken(): Promise<string | null> {
    try {
      const token = await SecureStorage.get(this.ACCESS_TOKEN_KEY);
      const expiry = await SecureStorage.get(this.TOKEN_EXPIRY_KEY);
      
      if (!token || !expiry) {
        return null;
      }

      // Check if token is expired
      if (Date.now() >= parseInt(expiry)) {
        // Try to refresh token
        try {
          const newTokens = await this.refreshAccessToken();
          return newTokens.accessToken;
        } catch (error) {
          // Refresh failed, clear tokens
          await this.logout();
          return null;
        }
      }

      return token;
    } catch (error) {
      console.error('Get access token error:', error);
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      return token !== null;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }

  static async requestPasswordReset(email: string): Promise<void> {
    try {
      // Mock password reset - replace with real API call
      console.log(`Password reset requested for: ${email}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Uncomment below for real API integration:
      /*
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password reset request failed');
      }
      */
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  static async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    try {
      // Mock password reset confirmation - replace with real API call
      console.log(`Password reset confirmed with token: ${token}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Uncomment below for real API integration:
      /*
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password reset confirmation failed');
      }
      */
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      throw error;
    }
  }

  static async updateProfile(name: string, email: string): Promise<UserProfile> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      // Mock profile update - replace with real API call
      const updatedUser: UserProfile = {
        ...currentUser,
        name,
        email,
        updatedAt: new Date().toISOString(),
      };

      await this.storeUserProfile(updatedUser);
      return updatedUser;

      // Uncomment below for real API integration:
      /*
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Profile update failed');
      }

      const data = await response.json();
      await this.storeUserProfile(data.user);
      return data.user;
      */
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Mock password change - replace with real API call
      console.log('Password change requested');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Uncomment below for real API integration:
      /*
      const accessToken = await this.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Password change failed');
      }
      */
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }

  private static async storeTokens(tokens: AuthTokens): Promise<void> {
    await SecureStorage.save(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    await SecureStorage.save(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    await SecureStorage.save(this.TOKEN_EXPIRY_KEY, tokens.expiresAt.toString());
  }

  private static async storeUserProfile(user: UserProfile): Promise<void> {
    await SecureStorage.save(this.USER_PROFILE_KEY, JSON.stringify(user));
  }

  private static generateMockToken(userId: string, type: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${type}_${userId}_${timestamp}_${random}`;
  }
}
