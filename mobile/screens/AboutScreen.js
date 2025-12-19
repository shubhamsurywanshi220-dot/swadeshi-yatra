import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function AboutScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const styles = createStyles(theme, isDarkMode);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About App</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* App Branding */}
                <View style={styles.brandingSection}>
                    <View style={styles.logoContainer}>
                        <MaterialCommunityIcons name="map-marker-path" size={64} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.appName}>Swadeshi Yatra</Text>
                    <Text style={styles.version}>Version 1.0.4 (Stable)</Text>
                </View>

                {/* Tagline section */}
                <View style={styles.missionCard}>
                    <Text style={styles.tagline}>"Discover the Heart of Bharat"</Text>
                    <Text style={styles.missionText}>
                        Swadeshi Yatra is a dedicated platform designed to empower domestic tourism and local businesses under the <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>Atmanirbhar Bharat</Text> initiative.
                        Our mission is to help travelers explore the rich heritage, vibrant culture, and hidden landscapes of India while directly contributing to the local ecosystem.
                    </Text>
                </View>

                {/* Features / Pillars */}
                <View style={styles.pillarsGrid}>
                    <View style={styles.pillarItem}>
                        <Ionicons name="location" size={24} color={theme.colors.accent} />
                        <Text style={styles.pillarTitle}>1,000+</Text>
                        <Text style={styles.pillarLabel}>Places</Text>
                    </View>
                    <View style={styles.pillarItem}>
                        <Ionicons name="people" size={24} color="#34A853" />
                        <Text style={styles.pillarTitle}>50k+</Text>
                        <Text style={styles.pillarLabel}>Community</Text>
                    </View>
                    <View style={styles.pillarItem}>
                        <Ionicons name="star" size={24} color="#FBBC05" />
                        <Text style={styles.pillarTitle}>4.8/5</Text>
                        <Text style={styles.pillarLabel}>Rating</Text>
                    </View>
                </View>

                {/* Social Links */}
                <Text style={styles.sectionTitle}>Follow Our Journey</Text>
                <View style={styles.socialRow}>
                    <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#E1306C' }]}>
                        <Ionicons name="logo-instagram" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#1877F2' }]}>
                        <Ionicons name="logo-facebook" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#1DA1F2' }]}>
                        <Ionicons name="logo-twitter" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#FF0000' }]}>
                        <Ionicons name="logo-youtube" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Legal & Credits */}
                <View style={styles.footerLinks}>
                    <TouchableOpacity><Text style={styles.footerLink}>Terms of Service</Text></TouchableOpacity>
                    <View style={styles.footerDivider} />
                    <TouchableOpacity><Text style={styles.footerLink}>Privacy Policy</Text></TouchableOpacity>
                </View>

                <Text style={styles.copyright}>© 2025 Swadeshi Yatra India. All rights reserved.</Text>
                <Text style={styles.madeIn}>Made with ❤️ in India</Text>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function createStyles(theme, isDarkMode) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: theme.colors.background,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        backButton: {
            marginRight: 16,
        },
        headerTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: theme.colors.text.primary,
        },
        scrollContent: {
            padding: 24,
            alignItems: 'center',
        },
        brandingSection: {
            alignItems: 'center',
            marginBottom: 32,
        },
        logoContainer: {
            width: 120,
            height: 120,
            borderRadius: 30,
            backgroundColor: theme.colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            ...theme.shadows.card,
            borderWidth: 1.5,
            borderColor: theme.colors.border,
        },
        appName: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.colors.text.primary,
        },
        version: {
            fontSize: 14,
            color: theme.colors.text.tertiary,
            marginTop: 6,
        },
        missionCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 24,
            padding: 24,
            width: '100%',
            marginBottom: 32,
            ...theme.shadows.soft,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        tagline: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.primary,
            fontStyle: 'italic',
            textAlign: 'center',
            marginBottom: 16,
        },
        missionText: {
            fontSize: 15,
            color: theme.colors.text.secondary,
            lineHeight: 24,
            textAlign: 'justify',
        },
        pillarsGrid: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 40,
        },
        pillarItem: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#1A1A1A' : theme.colors.background,
            padding: 16,
            borderRadius: 20,
            marginHorizontal: 5,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        pillarTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text.primary,
            marginTop: 8,
        },
        pillarLabel: {
            fontSize: 12,
            color: theme.colors.text.tertiary,
            marginTop: 2,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text.primary,
            marginBottom: 20,
        },
        socialRow: {
            flexDirection: 'row',
            gap: 16,
            marginBottom: 40,
        },
        socialIcon: {
            width: 50,
            height: 50,
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
            ...theme.shadows.soft,
        },
        footerLinks: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
        },
        footerLink: {
            color: theme.colors.primary,
            fontSize: 14,
            fontWeight: '500',
        },
        footerDivider: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: theme.colors.text.tertiary,
            marginHorizontal: 12,
        },
        copyright: {
            fontSize: 12,
            color: theme.colors.text.tertiary,
            textAlign: 'center',
        },
        madeIn: {
            fontSize: 13,
            fontWeight: '600',
            color: theme.colors.text.secondary,
            marginTop: 12,
        },
    });
}
