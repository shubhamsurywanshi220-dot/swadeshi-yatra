import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Namaste,</Text>
                        <Text style={styles.title}>Swadeshi Yatra</Text>
                    </View>
                    {/* Profile Icon */}
                    <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Profile')}>
                        <Ionicons name="person-circle" size={40} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={theme.colors.text.tertiary} style={{ marginRight: theme.spacing.s }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search destinations, stays, culture..."
                        placeholderTextColor={theme.colors.text.secondary}
                    />
                </View>

                {/* Emergency SOS - Integrated but distinct */}
                <TouchableOpacity
                    style={styles.sosCard}
                    onPress={() => navigation.navigate('SOS')}
                >
                    <View style={styles.sosContent}>
                        <View style={styles.sosIconContainer}>
                            <MaterialCommunityIcons name="alert-circle" size={28} color={theme.colors.error} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.sosText}>Emergency SOS</Text>
                            <Text style={styles.sosSubtext}>Tap for immediate help</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color={theme.colors.error} />
                    </View>
                </TouchableOpacity>

                {/* Categories Grid */}
                <Text style={styles.sectionTitle}>Explore</Text>
                <View style={styles.grid}>
                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: theme.colors.surface }]}
                        onPress={() => navigation.navigate('Places', { category: 'destinations' })}
                    >
                        <View style={[styles.cardIcon, styles.iconDestinations]}>
                            <MaterialCommunityIcons name="temple-hindu" size={32} color={theme.colors.accent} />
                        </View>
                        <Text style={styles.cardTitle}>Destinations</Text>
                        <Text style={styles.cardDesc}>Heritage & Culture</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: theme.colors.surface }]}
                        onPress={() => navigation.navigate('Places', { category: 'business' })}
                    >
                        <View style={[styles.cardIcon, styles.iconBusiness]}>
                            <MaterialCommunityIcons name="store" size={32} color={theme.colors.secondary} />
                        </View>
                        <Text style={styles.cardTitle}>Local Biz</Text>
                        <Text style={styles.cardDesc}>Vocal for Local</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: theme.colors.surface }]}
                        onPress={() => navigation.navigate('Places', { category: 'stays' })}
                    >
                        <View style={[styles.cardIcon, styles.iconStays]}>
                            <Ionicons name="bed" size={32} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.cardTitle}>Stays</Text>
                        <Text style={styles.cardDesc}>Authentic homestays</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.card, { backgroundColor: theme.colors.surface }]}
                        onPress={() => navigation.navigate('Places', { category: 'transport' })}
                    >
                        <View style={[styles.cardIcon, styles.iconTransport]}>
                            <Ionicons name="bus" size={32} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.cardTitle}>Transport</Text>
                        <Text style={styles.cardDesc}>Local connect</Text>
                    </TouchableOpacity>
                </View>

                {/* Inspiration / Featured (Placeholder for future) */}
                <View style={styles.bannerContainer}>
                    <Text style={styles.bannerText}>🇮🇳 Atmanirbhar Bharat Initiative</Text>
                </View>

                {/* Spacer for Bottom Tabs */}
                <View style={{ height: 80 }} />

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { padding: theme.spacing.l },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.l
    },
    greeting: {
        fontSize: 16,
        color: theme.colors.text.secondary,
        fontWeight: '500'
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: theme.colors.primary,
        letterSpacing: 0.5
    },
    profileIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    searchContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.l, // Pill shape
        paddingHorizontal: theme.spacing.m,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: theme.spacing.l,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.card,
    },
    searchInput: { flex: 1, fontSize: 16, color: theme.colors.text.primary },

    sosCard: {
        backgroundColor: theme.colors.error + '10', // Error color with 10% opacity
        borderRadius: theme.radius.l,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.error + '30',
    },
    sosContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sosIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.error + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.m,
    },
    sosText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.error,
    },
    sosSubtext: {
        fontSize: 12,
        color: theme.colors.error,
        opacity: 0.8,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.m,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    card: {
        width: '48%',
        padding: theme.spacing.m,
        borderRadius: theme.radius.l,
        marginBottom: theme.spacing.m,
        alignItems: 'center',
        ...theme.shadows.card,
    },
    inactive: { opacity: 0.7 },
    cardIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    iconDestinations: {
        backgroundColor: theme.colors.accent + '20', // Warm orange tint
    },
    iconBusiness: {
        backgroundColor: theme.colors.secondary + '20', // Teal tint
    },
    iconStays: {
        backgroundColor: theme.colors.primary + '15', // Saffron tint
    },
    iconTransport: {
        backgroundColor: theme.colors.primary + '10', // Light saffron
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: 4
    },
    cardDesc: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        textAlign: 'center'
    },

    bannerContainer: {
        marginTop: theme.spacing.l,
        backgroundColor: theme.colors.secondary,
        padding: theme.spacing.m,
        borderRadius: theme.radius.m,
        alignItems: 'center',
    },
    bannerText: {
        color: theme.colors.surface, // Text on primary background
        fontWeight: 'bold',
    }
});
