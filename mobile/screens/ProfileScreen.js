import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

export default function ProfileScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const { t, i18n } = useTranslation();
    const [userData, setUserData] = React.useState({
        name: 'Traveler',
        email: 'traveler@swadeshiyatra.in',
        reviewsCount: 0,
        badgesCount: 0,
        level: 'Explorer'
    });
    const [loading, setLoading] = React.useState(true);
    const [isLanguageExpanded, setIsLanguageExpanded] = React.useState(false);
    const styles = createStyles(theme, isDarkMode);

    React.useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        setLoading(true);
        try {
            const userId = await AsyncStorage.getItem('@user_id');
            if (userId) {
                // Fetch profile basic info (including trips)
                const profileRes = await api.get(`/auth/profile/${userId}`);
                // Fetch review count separately
                const reviewsRes = await api.get(`/reviews/user/${userId}/count`);

                const reviews = reviewsRes.data.count || 0;

                // Dynamic Badge logic: 1 badge for every 5 reviews
                const badges = Math.floor(reviews / 3);

                // Level logic based on reviews
                let level = t('profile.level_explorer');
                if (reviews > 5) level = t('profile.level_reviewer');
                if (reviews > 15) level = t('profile.level_envoy');

                setUserData({
                    name: profileRes.data.name || 'Traveler',
                    email: profileRes.data.email || 'traveler@swadeshiyatra.in',
                    reviewsCount: reviews,
                    badgesCount: badges,
                    level
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            t('common.logout'),
            t('profile.logout_confirm'),
            [
                { text: t('common.cancel'), style: "cancel" },
                {
                    text: t('common.logout'),
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.multiRemove(['@user_id', '@user_name', '@user_email']);
                        navigation.replace('Login');
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={100} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.name}>{userData.name}</Text>
                    <Text style={styles.email}>{userData.email}</Text>
                    <View style={styles.badge}>
                        <Ionicons name="shield-checkmark" size={14} color={isDarkMode ? '#81C784' : '#2E7D32'} />
                        <Text style={styles.badgeText}>{userData.level}</Text>
                    </View>
                </View>

                {/* Stats / Gamification */}
                <View style={styles.statsContainer}>

                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userData.reviewsCount}</Text>
                        <Text style={styles.statLabel}>{t('common.reviews')}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userData.badgesCount}</Text>
                        <Text style={styles.statLabel}>{t('common.badges')}</Text>
                    </View>
                </View>



                {/* Menu Options */}
                <View style={styles.menu}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Favorites')}
                    >
                        <Ionicons name="heart-outline" size={24} color={theme.colors.text.secondary} style={styles.menuIcon} />
                        <Text style={styles.menuText}>{t('profile.my_favorites')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>

                    {/* Change Language Menu Item */}
                    <View style={styles.menuItemContainer}>
                        <TouchableOpacity
                            style={[styles.menuItem, isLanguageExpanded && { borderBottomWidth: 0 }]}
                            onPress={() => setIsLanguageExpanded(!isLanguageExpanded)}
                        >
                            <Ionicons name="language-outline" size={24} color={theme.colors.text.secondary} style={styles.menuIcon} />
                            <Text style={styles.menuText}>{t('profile.change_language')}</Text>
                            <Ionicons
                                name={isLanguageExpanded ? "chevron-up" : "chevron-forward"}
                                size={20}
                                color={theme.colors.text.tertiary}
                            />
                        </TouchableOpacity>

                        {isLanguageExpanded && (
                            <View style={styles.languageExpandable}>
                                <View style={styles.langPillContainer}>
                                    <TouchableOpacity
                                        style={[styles.langPill, i18n.language === 'en' && styles.langPillActive]}
                                        onPress={() => i18n.changeLanguage('en')}
                                    >
                                        <Text style={[styles.langPillText, i18n.language === 'en' && styles.langPillTextActive]}>EN – English</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.langPill, i18n.language === 'hi' && styles.langPillActive]}
                                        onPress={() => i18n.changeLanguage('hi')}
                                    >
                                        <Text style={[styles.langPillText, i18n.language === 'hi' && styles.langPillTextActive]}>HI – Hindi</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.langPill, i18n.language === 'kn' && styles.langPillActive]}
                                        onPress={() => i18n.changeLanguage('kn')}
                                    >
                                        <Text style={[styles.langPillText, i18n.language === 'kn' && styles.langPillTextActive]}>KN – Kannada</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('MyTickets')}
                    >
                        <Ionicons name="ticket-outline" size={24} color={theme.colors.text.secondary} style={styles.menuIcon} />
                        <Text style={styles.menuText}>{t('profile.my_tickets')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Ionicons name="settings-outline" size={24} color={theme.colors.text.secondary} style={styles.menuIcon} />
                        <Text style={styles.menuText}>{t('common.settings')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('HelpSupport')}
                    >
                        <Ionicons name="help-circle-outline" size={24} color={theme.colors.text.secondary} style={styles.menuIcon} />
                        <Text style={styles.menuText}>{t('profile.help_support')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('About')}
                    >
                        <Ionicons name="information-circle-outline" size={24} color={theme.colors.text.secondary} style={styles.menuIcon} />
                        <Text style={styles.menuText}>{t('profile.about_app')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('ProviderRegistration')}
                    >
                        <Ionicons name="briefcase-outline" size={24} color={theme.colors.text.secondary} style={styles.menuIcon} />
                        <Text style={styles.menuText}>{t('profile.become_partner')}</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color={theme.colors.error} style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>{t('common.logout')}</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: theme.padding.screen,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    avatarContainer: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        ...theme.shadows.soft,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: theme.colors.text.secondary,
        marginBottom: 16,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#1B2E1C' : '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: isDarkMode ? '#2E7D32' : '#81C784',
        gap: 4,
    },
    badgeText: {
        color: isDarkMode ? '#81C784' : '#2E7D32',
        fontWeight: 'bold',
        fontSize: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.l,
        padding: 20,
        width: '100%',
        marginBottom: 30,
        ...theme.shadows.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: theme.colors.border,
        marginVertical: 4,
    },
    menu: {
        width: '100%',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.l,
        marginBottom: 30,
        ...theme.shadows.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    menuIcon: {
        marginRight: 16,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text.primary,
        fontWeight: '500',
    },
    logoutButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: theme.radius.m,
        backgroundColor: isDarkMode ? '#311B1B' : '#FFEBEE',
        borderWidth: 1,
        borderColor: isDarkMode ? '#C62828' : '#FFCDD2',
    },
    logoutText: {
        color: theme.colors.error,
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Expandable Language Style
    menuItemContainer: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    languageExpandable: {
        backgroundColor: isDarkMode ? '#1A1A1A' : '#F9F9F9',
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    langPillContainer: {
        flexDirection: 'column',
        gap: 10,
    },
    langPill: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.soft,
    },
    langPillActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    langPillText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },
    langPillTextActive: {
        color: '#FFF',
    },
});
