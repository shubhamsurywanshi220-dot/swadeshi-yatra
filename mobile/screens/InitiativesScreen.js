import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ImageWithFallback from '../components/ImageWithFallback';

export default function InitiativesScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const styles = createStyles(theme, isDarkMode);
    const [pledgeTaken, setPledgeTaken] = useState(false);

    const handlePledge = () => {
        setPledgeTaken(true);
        Alert.alert(
            "Jai Hind! 🇮🇳",
            "Thank you for pledging to support local businesses and travel domestically. Your small choices make a big difference!"
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Our Mission</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <ImageWithFallback
                        source={{ uri: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=1000' }} // Taj Mahal for mission
                        style={styles.heroImage}
                    />
                    <View style={styles.heroOverlay} />
                    <View style={styles.heroTextContainer}>
                        <Text style={styles.heroTitle}>Atmanirbhar Bharat</Text>
                        <Text style={styles.heroSubtitle}>Self-Reliant India</Text>
                    </View>
                </View>

                {/* Mission Statement */}
                <View style={styles.section}>
                    <Text style={styles.sectionText}>
                        <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>Swadeshi Yatra</Text> is more than just a travel app. It is a movement to rediscover the soul of India and empower its people.
                    </Text>
                </View>

                {/* Pillars */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBg, { backgroundColor: isDarkMode ? '#2D2418' : '#FFF3E0' }]}>
                            <MaterialCommunityIcons name="map-marker-path" size={28} color={isDarkMode ? '#FFB74D' : theme.colors.accent} />
                        </View>
                        <Text style={styles.cardTitle}>Dekho Apna Desh</Text>
                    </View>
                    <Text style={styles.cardBody}>
                        India has everything — from the snow-capped Himalayas to the tropical beaches of the south. Why go far when paradise is right here?
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBg, { backgroundColor: isDarkMode ? '#3E2723' : '#FBE9E7' }]}>
                            <MaterialCommunityIcons name="hand-heart" size={28} color={isDarkMode ? '#FF8A65' : theme.colors.secondary} />
                        </View>
                        <Text style={styles.cardTitle}>Vocal for Local</Text>
                    </View>
                    <Text style={styles.cardBody}>
                        Every souvenir you buy from a local artisan, and every meal you eat at a local eatery, directly supports an Indian family and preserves our heritage.
                    </Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBg, { backgroundColor: isDarkMode ? '#1B2E1C' : '#E8F5E9' }]}>
                            <Ionicons name="leaf" size={28} color={isDarkMode ? '#81C784' : '#2E7D32'} />
                        </View>
                        <Text style={styles.cardTitle}>Sustainable Travel</Text>
                    </View>
                    <Text style={styles.cardBody}>
                        We promote eco-friendly destinations and responsible tourism practices to ensure our natural beauty lasts for generations.
                    </Text>
                </View>

                {/* Pledge Action */}
                <View style={styles.pledgeContainer}>
                    <View style={styles.pledgeIconContainer}>
                        <MaterialCommunityIcons name="medal" size={40} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.pledgeTitle}>Join the Movement</Text>
                    <Text style={styles.pledgeText}>
                        "I pledge to travel India, explore its hidden gems, and support local communities whenever possible."
                    </Text>
                    <TouchableOpacity
                        style={[styles.pledgeButton, pledgeTaken && styles.pledgeButtonActive]}
                        onPress={handlePledge}
                        disabled={pledgeTaken}
                    >
                        <Text style={styles.pledgeButtonText}>
                            {pledgeTaken ? "Pledge Taken ✓" : "I Pledge Support 🇮🇳"}
                        </Text>
                    </TouchableOpacity>
                </View>

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
        padding: 20,
    },
    heroContainer: {
        height: 220,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
        ...theme.shadows.card,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    heroTextContainer: {
        position: 'absolute',
        bottom: 24,
        left: 24,
    },
    heroTitle: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    heroSubtitle: {
        color: '#E0E0E0',
        fontSize: 18,
        marginTop: 4,
        letterSpacing: 0.5,
    },
    section: {
        marginBottom: 30,
    },
    sectionText: {
        fontSize: 17,
        color: theme.colors.text.secondary,
        lineHeight: 26,
        textAlign: 'center',
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        ...theme.shadows.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconBg: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    cardBody: {
        fontSize: 15,
        color: theme.colors.text.secondary,
        lineHeight: 22,
    },
    pledgeContainer: {
        marginTop: 16,
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#212121' : theme.colors.primary + '08',
        padding: 30,
        borderRadius: 28,
        borderWidth: 1.5,
        borderColor: theme.colors.primary + '20',
        ...theme.shadows.soft,
    },
    pledgeIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        ...theme.shadows.soft,
    },
    pledgeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 12,
    },
    pledgeText: {
        fontSize: 15,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        marginBottom: 24,
        fontStyle: 'italic',
        lineHeight: 22,
    },
    pledgeButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 16,
        ...theme.shadows.elevated,
    },
    pledgeButtonActive: {
        backgroundColor: theme.colors.success,
    },
    pledgeButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
