import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Dimensions,
  StatusBar,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { AppSettings, LANGUAGE_OPTIONS, THEME_OPTIONS } from '../types/settings';
import { SettingsService } from '../services/settingsService';

const { width } = Dimensions.get('window');

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const currentSettings = await SettingsService.getSettings();
      setSettings(currentSettings);
    } catch (error) {
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      const updatedSettings = await SettingsService.updateSettings(updates);
      setSettings(updatedSettings);
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings');
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              const defaultSettings = await SettingsService.resetSettings();
              setSettings(defaultSettings);
              Alert.alert('Success', 'Settings have been reset to default');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset settings');
            }
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all app data including your progress, settings, and cache. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await SettingsService.clearAllData();
              Alert.alert(
                'Data Cleared',
                'All app data has been cleared. The app will restart.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // In a real app, you would restart the app here
                      navigation.navigate('Splash');
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const renderLanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLanguageModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {LANGUAGE_OPTIONS.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  settings?.language === language.code && styles.languageOptionSelected
                ]}
                onPress={() => {
                  updateSettings({ language: language.code });
                  setShowLanguageModal(false);
                }}
              >
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={[
                    styles.languageName,
                    settings?.language === language.code && styles.languageNameSelected
                  ]}>
                    {language.name}
                  </Text>
                  <Text style={styles.languageNative}>{language.nativeName}</Text>
                </View>
                {settings?.language === language.code && (
                  <Ionicons name="checkmark" size={20} color="#667eea" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderThemeModal = () => (
    <Modal
      visible={showThemeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowThemeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Theme</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowThemeModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            {THEME_OPTIONS.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeOption,
                  settings?.theme === theme.id && styles.themeOptionSelected
                ]}
                onPress={() => {
                  updateSettings({ theme: theme.id });
                  setShowThemeModal(false);
                }}
              >
                <View style={[styles.themePreview, { backgroundColor: theme.preview }]} />
                <View style={styles.themeInfo}>
                  <Text style={[
                    styles.themeName,
                    settings?.theme === theme.id && styles.themeNameSelected
                  ]}>
                    {theme.name}
                  </Text>
                  <Text style={styles.themeDescription}>{theme.description}</Text>
                </View>
                {settings?.theme === theme.id && (
                  <Ionicons name="checkmark" size={20} color="#667eea" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle: string,
    onPress: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={20} color="#667eea" />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {rightElement || <Ionicons name="chevron-forward" size={20} color="#ccc" />}
    </TouchableOpacity>
  );

  if (isLoading || !settings) {
    return (
      <View style={styles.loadingContainer}>
        <Animatable.View animation="pulse" iterationCount="infinite">
          <Ionicons name="settings" size={60} color="#667eea" />
        </Animatable.View>
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Animatable.View animation="fadeInDown" duration={1000}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>Settings</Text>
              <Text style={styles.subtitle}>Customize your experience</Text>
            </View>
          </View>
        </Animatable.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeInUp" duration={1000} delay={200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            {renderSettingItem(
              'color-palette',
              'Theme',
              `Current: ${THEME_OPTIONS.find(t => t.id === settings.theme)?.name || 'Light'}`,
              () => setShowThemeModal(true)
            )}
            {renderSettingItem(
              'language',
              'Language',
              `Current: ${LANGUAGE_OPTIONS.find(l => l.code === settings.language)?.name || 'English'}`,
              () => setShowLanguageModal(true)
            )}
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1000} delay={400}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Audio</Text>
            {renderSettingItem(
              'volume-high',
              'Sound Effects',
              settings.soundEnabled ? 'Enabled' : 'Disabled',
              () => updateSettings({ soundEnabled: !settings.soundEnabled }),
              <Switch
                value={settings.soundEnabled}
                onValueChange={(value) => updateSettings({ soundEnabled: value })}
                trackColor={{ false: '#ccc', true: '#667eea' }}
                thumbColor={settings.soundEnabled ? '#fff' : '#f4f3f4'}
              />
            )}
            {renderSettingItem(
              'musical-notes',
              'Background Music',
              settings.musicEnabled ? 'Enabled' : 'Disabled',
              () => updateSettings({ musicEnabled: !settings.musicEnabled }),
              <Switch
                value={settings.musicEnabled}
                onValueChange={(value) => updateSettings({ musicEnabled: value })}
                trackColor={{ false: '#ccc', true: '#667eea' }}
                thumbColor={settings.musicEnabled ? '#fff' : '#f4f3f4'}
              />
            )}
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1000} delay={600}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {renderSettingItem(
              'game-controller',
              'Game Reminders',
              settings.notifications.gameReminders ? 'Enabled' : 'Disabled',
              () => updateSettings({ 
                notifications: { ...settings.notifications, gameReminders: !settings.notifications.gameReminders }
              }),
              <Switch
                value={settings.notifications.gameReminders}
                onValueChange={(value) => updateSettings({ 
                  notifications: { ...settings.notifications, gameReminders: value }
                })}
                trackColor={{ false: '#ccc', true: '#667eea' }}
                thumbColor={settings.notifications.gameReminders ? '#fff' : '#f4f3f4'}
              />
            )}
            {renderSettingItem(
              'trophy',
              'Achievement Alerts',
              settings.notifications.achievementAlerts ? 'Enabled' : 'Disabled',
              () => updateSettings({ 
                notifications: { ...settings.notifications, achievementAlerts: !settings.notifications.achievementAlerts }
              }),
              <Switch
                value={settings.notifications.achievementAlerts}
                onValueChange={(value) => updateSettings({ 
                  notifications: { ...settings.notifications, achievementAlerts: value }
                })}
                trackColor={{ false: '#ccc', true: '#667eea' }}
                thumbColor={settings.notifications.achievementAlerts ? '#fff' : '#f4f3f4'}
              />
            )}
            {renderSettingItem(
              'trending-up',
              'Progress Updates',
              settings.notifications.progressUpdates ? 'Enabled' : 'Disabled',
              () => updateSettings({ 
                notifications: { ...settings.notifications, progressUpdates: !settings.notifications.progressUpdates }
              }),
              <Switch
                value={settings.notifications.progressUpdates}
                onValueChange={(value) => updateSettings({ 
                  notifications: { ...settings.notifications, progressUpdates: value }
                })}
                trackColor={{ false: '#ccc', true: '#667eea' }}
                thumbColor={settings.notifications.progressUpdates ? '#fff' : '#f4f3f4'}
              />
            )}
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1000} delay={800}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accessibility</Text>
            {renderSettingItem(
              'text',
              'Large Text',
              settings.accessibility.largeText ? 'Enabled' : 'Disabled',
              () => updateSettings({ 
                accessibility: { ...settings.accessibility, largeText: !settings.accessibility.largeText }
              }),
              <Switch
                value={settings.accessibility.largeText}
                onValueChange={(value) => updateSettings({ 
                  accessibility: { ...settings.accessibility, largeText: value }
                })}
                trackColor={{ false: '#ccc', true: '#667eea' }}
                thumbColor={settings.accessibility.largeText ? '#fff' : '#f4f3f4'}
              />
            )}
            {renderSettingItem(
              'contrast',
              'High Contrast',
              settings.accessibility.highContrast ? 'Enabled' : 'Disabled',
              () => updateSettings({ 
                accessibility: { ...settings.accessibility, highContrast: !settings.accessibility.highContrast }
              }),
              <Switch
                value={settings.accessibility.highContrast}
                onValueChange={(value) => updateSettings({ 
                  accessibility: { ...settings.accessibility, highContrast: value }
                })}
                trackColor={{ false: '#ccc', true: '#667eea' }}
                thumbColor={settings.accessibility.highContrast ? '#fff' : '#f4f3f4'}
              />
            )}
            {renderSettingItem(
              'eye',
              'Reduced Motion',
              settings.accessibility.reducedMotion ? 'Enabled' : 'Disabled',
              () => updateSettings({ 
                accessibility: { ...settings.accessibility, reducedMotion: !settings.accessibility.reducedMotion }
              }),
              <Switch
                value={settings.accessibility.reducedMotion}
                onValueChange={(value) => updateSettings({ 
                  accessibility: { ...settings.accessibility, reducedMotion: value }
                })}
                trackColor={{ false: '#ccc', true: '#667eea' }}
                thumbColor={settings.accessibility.reducedMotion ? '#fff' : '#f4f3f4'}
              />
            )}
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1000} delay={1000}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data & Privacy</Text>
            {renderSettingItem(
              'shield-checkmark',
              'Data Collection',
              settings.privacy.dataCollection ? 'Enabled' : 'Disabled',
              () => updateSettings({ 
                privacy: { ...settings.privacy, dataCollection: !settings.privacy.dataCollection }
              }),
              <Switch
                value={settings.privacy.dataCollection}
                onValueChange={(value) => updateSettings({ 
                  privacy: { ...settings.privacy, dataCollection: value }
                })}
                trackColor={{ false: '#ccc', true: '#667eea' }}
                thumbColor={settings.privacy.dataCollection ? '#fff' : '#f4f3f4'}
              />
            )}
            {renderSettingItem(
              'analytics',
              'Analytics',
              settings.privacy.analytics ? 'Enabled' : 'Disabled',
              () => updateSettings({ 
                privacy: { ...settings.privacy, analytics: !settings.privacy.analytics }
              }),
              <Switch
                value={settings.privacy.analytics}
                onValueChange={(value) => updateSettings({ 
                  privacy: { ...settings.privacy, analytics: value }
                })}
                trackColor={{ false: '#ccc', true: '#667eea' }}
                thumbColor={settings.privacy.analytics ? '#fff' : '#f4f3f4'}
              />
            )}
            {renderSettingItem(
              'bug',
              'Crash Reports',
              settings.privacy.crashReports ? 'Enabled' : 'Disabled',
              () => updateSettings({ 
                privacy: { ...settings.privacy, crashReports: !settings.privacy.crashReports }
              }),
              <Switch
                value={settings.privacy.crashReports}
                onValueChange={(value) => updateSettings({ 
                  privacy: { ...settings.privacy, crashReports: value }
                })}
                trackColor={{ false: '#ccc', true: '#667eea' }}
                thumbColor={settings.privacy.crashReports ? '#fff' : '#f4f3f4'}
              />
            )}
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={1000} delay={1200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced</Text>
            {renderSettingItem(
              'refresh',
              'Reset Settings',
              'Reset all settings to default',
              handleResetSettings
            )}
            {renderSettingItem(
              'trash',
              'Clear All Data',
              'Delete all app data and cache',
              handleClearAllData
            )}
          </View>
        </Animatable.View>
      </ScrollView>

      {renderLanguageModal()}
      {renderThemeModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  languageOptionSelected: {
    backgroundColor: '#667eea20',
    borderWidth: 1,
    borderColor: '#667eea',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  languageNameSelected: {
    color: '#667eea',
  },
  languageNative: {
    fontSize: 14,
    color: '#666',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
  },
  themeOptionSelected: {
    backgroundColor: '#667eea20',
    borderWidth: 1,
    borderColor: '#667eea',
  },
  themePreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  themeNameSelected: {
    color: '#667eea',
  },
  themeDescription: {
    fontSize: 14,
    color: '#666',
  },
});
