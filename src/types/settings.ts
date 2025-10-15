export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'si' | 'ta';
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number; // 0-100
  musicVolume: number; // 0-100
  notifications: {
    gameReminders: boolean;
    achievementAlerts: boolean;
    progressUpdates: boolean;
  };
  accessibility: {
    largeText: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    crashReports: boolean;
  };
  lastUpdated: string;
}

export interface LanguageOption {
  code: 'en' | 'si' | 'ta';
  name: string;
  nativeName: string;
  flag: string;
}

export interface ThemeOption {
  id: 'light' | 'dark' | 'auto';
  name: string;
  description: string;
  preview: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'si',
    name: 'Sinhala',
    nativeName: 'සිංහල',
    flag: '🇱🇰',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇱🇰',
  },
];

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'light',
    name: 'Light Mode',
    description: 'Clean and bright interface',
    preview: '#FFFFFF',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Easy on the eyes in low light',
    preview: '#1A1A1A',
  },
  {
    id: 'auto',
    name: 'Auto',
    description: 'Follows system settings',
    preview: '#667eea',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'en',
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 80,
  musicVolume: 60,
  notifications: {
    gameReminders: true,
    achievementAlerts: true,
    progressUpdates: true,
  },
  accessibility: {
    largeText: false,
    highContrast: false,
    reducedMotion: false,
  },
  privacy: {
    dataCollection: true,
    analytics: true,
    crashReports: true,
  },
  lastUpdated: new Date().toISOString(),
};
