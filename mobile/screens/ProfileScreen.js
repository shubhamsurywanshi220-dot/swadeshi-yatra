import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export default function ProfileScreen({ navigation }) {

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: () => navigation.replace('Login')
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={80} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.name}>Traveler</Text>
                    <Text style={styles.email}>traveler@swadeshiyatra.in</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Level 1 Explorer</Text>
                    </View>
                </View>

                {/* Stats / Gamification (Module 6 UX) */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Trips</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Reviews</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>0</Text>
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

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="settings-outline" size={24} color={theme.colors.text.secondary} style={styles.menuIcon} />
                        <Text style={styles.menuText}>Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="help-circle-outline" size={24} color={theme.colors.text.secondary} style={styles.menuIcon} />
                        <Text style={styles.menuText}>Help & Support</Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { padding: theme.spacing.l, alignItems: 'center' },

    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        marginTop: theme.spacing.m,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
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
        marginBottom: theme.spacing.m,
    },
    badge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#81C784',
    },
    badgeText: {
        color: '#2E7D32',
        fontWeight: 'bold',
        fontSize: 12,
    },

    statsContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.l,
        padding: theme.spacing.m,
        width: '100%',
        marginBottom: theme.spacing.xl,
        ...theme.shadows.card,
    },
    statItem: { flex: 1, alignItems: 'center' },
    statValue: { fontSize: 20, fontWeight: 'bold', color: theme.colors.primary },
    statLabel: { fontSize: 12, color: theme.colors.text.secondary },
    statDivider: { width: 1, backgroundColor: '#EEE' },

    menu: {
        width: '100%',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.l,
        padding: theme.spacing.s,
        marginBottom: theme.spacing.xl,
        ...theme.shadows.card,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    menuIcon: { marginRight: theme.spacing.m },
    menuText: { flex: 1, fontSize: 16, color: theme.colors.text.primary },

    logoutButton: {
        width: '100%',
        padding: theme.spacing.m,
        borderRadius: theme.radius.m,
        backgroundColor: '#FFEBEE',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFCDD2',
    },
    logoutText: {
        color: theme.colors.error,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
