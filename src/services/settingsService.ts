import { SecureStorageService } from './secureStorage';
import { AppSettings, DEFAULT_SETTINGS, LANGUAGE_OPTIONS, THEME_OPTIONS } from '../types/settings';

export class SettingsService {
  private static readonly SETTINGS_KEY = 'app_settings';

  static async getSettings(): Promise<AppSettings> {
    try {
      const settingsJson = await SecureStorageService.get(this.SETTINGS_KEY);
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        // Merge with default settings to ensure all properties exist
        return { ...DEFAULT_SETTINGS, ...settings };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Get settings error:', error);
      return DEFAULT_SETTINGS;
    }
  }

  static async updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
      
      await SecureStorageService.save(this.SETTINGS_KEY, JSON.stringify(updatedSettings));
      return updatedSettings;
    } catch (error) {
      console.error('Update settings error:', error);
      throw error;
    }
  }

  static async resetSettings(): Promise<AppSettings> {
    try {
      await SecureStorageService.delete(this.SETTINGS_KEY);
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Reset settings error:', error);
      throw error;
    }
  }

  static async updateTheme(theme: AppSettings['theme']): Promise<AppSettings> {
    return this.updateSettings({ theme });
  }

  static async updateLanguage(language: AppSettings['language']): Promise<AppSettings> {
    return this.updateSettings({ language });
  }

  static async updateSoundSettings(soundEnabled: boolean, soundVolume: number): Promise<AppSettings> {
    return this.updateSettings({ soundEnabled, soundVolume });
  }

  static async updateMusicSettings(musicEnabled: boolean, musicVolume: number): Promise<AppSettings> {
    return this.updateSettings({ musicEnabled, musicVolume });
  }

  static async updateNotifications(notifications: AppSettings['notifications']): Promise<AppSettings> {
    return this.updateSettings({ notifications });
  }

  static async updateAccessibility(accessibility: AppSettings['accessibility']): Promise<AppSettings> {
    return this.updateSettings({ accessibility });
  }

  static async updatePrivacy(privacy: AppSettings['privacy']): Promise<AppSettings> {
    return this.updateSettings({ privacy });
  }

  static async clearAllData(): Promise<void> {
    try {
      // Clear all app data
      const keys = [
        'access_token',
        'refresh_token',
        'user_profile',
        'token_expiry',
        'app_settings',
        'onboarding_completed',
        'feedback_data',
        'analytics_cache',
      ];

      for (const key of keys) {
        await SecureStorageService.delete(key);
      }
    } catch (error) {
      console.error('Clear all data error:', error);
      throw error;
    }
  }

  static async exportSettings(): Promise<string> {
    try {
      const settings = await this.getSettings();
      return JSON.stringify(settings, null, 2);
    } catch (error) {
      console.error('Export settings error:', error);
      throw error;
    }
  }

  static async importSettings(settingsJson: string): Promise<AppSettings> {
    try {
      const settings = JSON.parse(settingsJson);
      // Validate settings structure
      const validatedSettings = { ...DEFAULT_SETTINGS, ...settings };
      await SecureStorageService.save(this.SETTINGS_KEY, JSON.stringify(validatedSettings));
      return validatedSettings;
    } catch (error) {
      console.error('Import settings error:', error);
      throw error;
    }
  }

  static getLanguageName(code: string): string {
    const language = LANGUAGE_OPTIONS.find(lang => lang.code === code);
    return language ? language.name : 'English';
  }

  static getThemeName(id: string): string {
    const theme = THEME_OPTIONS.find(t => t.id === id);
    return theme ? theme.name : 'Light Mode';
  }

  static isDarkMode(theme: AppSettings['theme']): boolean {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    // For 'auto', you would check system theme
    // This is a simplified implementation
    return false;
  }
}
