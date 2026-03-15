import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function SettingsScreen({ navigation }) {
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();
    const [notifications, setNotifications] = useState(true);
    const [location, setLocation] = useState(true);

    const styles = createStyles(theme);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const storedSettings = await AsyncStorage.getItem('appSettings');
                if (storedSettings) {
                    const { notifications, location } = JSON.parse(storedSettings);
                    setNotifications(notifications);
                    setLocation(location);
                }
            } catch (error) {
                console.log('Error loading settings:', error);
            }
        };
        loadSettings();
    }, []);



    const saveSettings = async (key, value) => {
        try {
            const currentSettings = { notifications, location, [key]: value };
            await AsyncStorage.setItem('appSettings', JSON.stringify(currentSettings));
        } catch (error) {
            console.log('Error saving settings:', error);
        }
    };

    const toggleSwitch = (key) => {
        if (key === 'notifications') {
            setNotifications(prev => { const newVal = !prev; saveSettings('notifications', newVal); return newVal; });
        } else if (key === 'darkMode') {
            toggleTheme();
        } else if (key === 'location') {
            setLocation(prev => { const newVal = !prev; saveSettings('location', newVal); return newVal; });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('common.settings')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>


                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('settings.app_preferences')}</Text>

                    <View style={styles.row}>
                        <View style={styles.rowTextContainer}>
                            <Text style={styles.rowTitle}>{t('settings.notifications')}</Text>
                            <Text style={styles.rowSubtitle}>{t('settings.notif_desc')}</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={() => toggleSwitch('notifications')}
                            trackColor={{ false: '#e0e0e0', true: theme.colors.primary }}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={styles.rowTextContainer}>
                            <Text style={styles.rowTitle}>{t('settings.dark_mode')}</Text>
                            <Text style={styles.rowSubtitle}>{t('settings.dark_desc')}</Text>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={() => toggleSwitch('darkMode')}
                            trackColor={{ false: '#e0e0e0', true: theme.colors.primary }}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={styles.rowTextContainer}>
                            <Text style={styles.rowTitle}>{t('settings.location')}</Text>
                            <Text style={styles.rowSubtitle}>{t('settings.location_desc')}</Text>
                        </View>
                        <Switch
                            value={location}
                            onValueChange={() => toggleSwitch('location')}
                            trackColor={{ false: '#e0e0e0', true: theme.colors.primary }}
                        />
                    </View>
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('settings.account')}</Text>

                    <TouchableOpacity 
                        style={styles.linkRow} 
                        onPress={async () => {
                            const userId = await AsyncStorage.getItem('@user_id');
                            if (!userId) {
                                Alert.alert(t('common.error'), "Please log in to access account settings.");
                                return;
                            }
                            navigation.navigate('EditProfile');
                        }}
                    >
                        <Text style={styles.linkText}>{t('settings.edit_profile')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.linkRow} 
                        onPress={async () => {
                            const userId = await AsyncStorage.getItem('@user_id');
                            if (!userId) {
                                Alert.alert(t('common.error'), "Please log in to access account settings.");
                                return;
                            }
                            navigation.navigate('ChangePassword');
                        }}
                    >
                        <Text style={styles.linkText}>{t('settings.change_password')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkRow} onPress={() => navigation.navigate('PrivacyPolicy')}>
                        <Text style={styles.linkText}>{t('settings.privacy_policy')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('common.about')}</Text>

                    <TouchableOpacity style={styles.linkRow} onPress={() => alert(t('settings.terms_of_service'))}>
                        <Text style={styles.linkText}>{t('settings.terms_of_service')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>

                    <View style={styles.versionRow}>
                        <Text style={styles.versionLabel}>{t('settings.version')}</Text>
                        <Text style={styles.versionValue}>1.0.0 (Phase II)</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

function createStyles(theme) {
    return StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.m, paddingVertical: theme.spacing.m, borderBottomWidth: 1, borderBottomColor: theme.colors.border, backgroundColor: theme.colors.surface },
        backButton: { padding: theme.spacing.s, marginRight: theme.spacing.m },
        headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary },
        content: { padding: theme.spacing.l },
        section: { marginBottom: theme.spacing.xl, backgroundColor: theme.colors.surface, borderRadius: theme.radius.m, padding: theme.spacing.m, ...theme.shadows.card },
        sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.primary, marginBottom: theme.spacing.m, textTransform: 'uppercase', letterSpacing: 1 },
        sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.m },
        row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.l },
        rowTextContainer: { flex: 1, paddingRight: theme.spacing.m },
        rowTitle: { fontSize: 16, color: theme.colors.text.primary, marginBottom: 4 },
        rowSubtitle: { fontSize: 12, color: theme.colors.text.secondary },
        linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.m, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
        linkText: { fontSize: 16, color: theme.colors.text.primary },
        versionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: theme.spacing.m },
        versionLabel: { fontSize: 16, color: theme.colors.text.primary },
        versionValue: { fontSize: 16, color: theme.colors.text.tertiary },
    });
}
