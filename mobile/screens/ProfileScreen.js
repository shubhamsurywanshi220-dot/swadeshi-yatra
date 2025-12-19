import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, StatusBar, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

export default function ProfileScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const [userData, setUserData] = React.useState({
        name: 'Traveler',
        email: 'traveler@swadeshiyatra.in',
        reviewsCount: 0,
        badgesCount: 0,
        level: 'Explorer'
    });
    const [loading, setLoading] = React.useState(true);
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
                let level = 'Level 1 Explorer';
                if (reviews > 5) level = 'Seasoned Reviewer';
                if (reviews > 15) level = 'Indian Cultural Envoy';

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
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
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
                        <Text style={styles.statLabel}>Reviews</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userData.badgesCount}</Text>
                        <Text style={styles.statLabel}>Badges</Text>
                    </View>
                </View>

                {/* Menu Options */}
                <View style={styles.menu}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Favorites')}
                    >
                        <Ionicons name="heart-outline" size={24} color={theme.colors.text.secondary} style={styles.menuIcon} />
                        <Text style={styles.menuText}>My Favorites</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Ionicons name="settings-outline" size={24} color={theme.colors.text.secondary} style={styles.menuIcon} />
                        <Text style={styles.menuText}>Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('HelpSupport')}
                    >
                        <Ionicons name="help-circle-outline" size={24} color={theme.colors.text.secondary} style={styles.menuIcon} />
                        <Text style={styles.menuText}>Help & Support</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuItem, { borderBottomWidth: 0 }]}
                        onPress={() => navigation.navigate('About')}
                    >
                        <Ionicons name="information-circle-outline" size={24} color={theme.colors.text.secondary} style={styles.menuIcon} />
                        <Text style={styles.menuText}>About Swadeshi Yatra</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color={theme.colors.error} style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Log Out</Text>
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
});
