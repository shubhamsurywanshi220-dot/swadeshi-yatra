import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, StatusBar, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import ImageWithFallback from '../components/ImageWithFallback';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [popularPlaces, setPopularPlaces] = useState([]);
    const [loadingPopular, setLoadingPopular] = useState(true);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const styles = createStyles(theme);

    // Micro-animations for card entry
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            })
        ]).start();

        fetchPopularPlaces();
    }, []);

    const fetchPopularPlaces = async () => {
        setLoadingPopular(true);
        try {
            const response = await api.get('/places');
            // Mocking "Popular Near You" by filtering Karnataka or just trending ones
            const karnataka = response.data.filter(p => p.state === 'Karnataka').slice(0, 6);
            // If no Karnataka places (unlikely), take any top rated
            const places = karnataka.length > 0 ? karnataka : response.data.slice(0, 6);
            setPopularPlaces(places);
        } catch (error) {
            console.error("Error fetching popular places:", error);
        } finally {
            setLoadingPopular(false);
        }
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handleSearch = (query) => {
        const text = query || searchQuery;
        if (text.trim()) {
            navigation.navigate('Explore', {
                category: 'destinations',
                search: text.trim(),
                focusSearch: false
            });
            setSearchQuery('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greetingText}>Welcome to,</Text>
                        <Text style={styles.brandTitle}>Swadeshi Yatra</Text>
                    </View>
                    {/* Profile Icon with Shadow */}
                    <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate('Profile')}>
                        <View style={styles.avatarShadow}>
                            <Ionicons name="person-circle" size={44} color={theme.colors.primary} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Floating Search Bar */}
                <View style={styles.searchFloating}>
                    <TouchableOpacity onPress={() => handleSearch()}>
                        <Ionicons name="search" size={22} color={theme.colors.text.tertiary} style={{ marginRight: 12 }} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.searchTextInput}
                        placeholder="Search destinations, stays & culture"
                        placeholderTextColor={theme.colors.text.secondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={() => handleSearch()}
                        returnKeyType="search"
                    />
                    <View style={styles.searchIconsLeft}>
                        {searchQuery.length > 0 ? (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color={theme.colors.text.tertiary} />
                            </TouchableOpacity>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="options-outline" size={20} color={theme.colors.text.tertiary} />
                            </View>
                        )}
                    </View>
                </View>

                {/* Categories Grid */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeading}>Explore</Text>
                    <View style={styles.sectionDivider} />
                </View>

                <Animated.View style={[styles.categoryGrid, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <AnimatedTouchableOpacity
                        style={[styles.premiumCard, { transform: [{ scale: scaleAnim }] }]}
                        activeOpacity={0.9}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={() => navigation.navigate('Explore', { category: 'destinations' })}
                    >
                        <View style={[styles.premiumIconContainer, { backgroundColor: isDarkMode ? '#332300' : '#FFF3E0' }]}>
                            <MaterialCommunityIcons name="temple-hindu" size={30} color={isDarkMode ? '#FFB74D' : '#F57C00'} />
                        </View>
                        <Text style={styles.premiumCardTitle}>Destinations</Text>
                        <Text style={styles.premiumCardSubtitle}>Heritage & Culture</Text>
                    </AnimatedTouchableOpacity>

                    <AnimatedTouchableOpacity
                        style={[styles.premiumCard, { transform: [{ scale: scaleAnim }] }]}
                        activeOpacity={0.9}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={() => navigation.navigate('Explore', { category: 'business' })}
                    >
                        <View style={[styles.premiumIconContainer, { backgroundColor: isDarkMode ? '#002622' : '#E0F2F1' }]}>
                            <MaterialCommunityIcons name="store" size={30} color={isDarkMode ? '#4DB6AC' : '#00796B'} />
                        </View>
                        <Text style={styles.premiumCardTitle}>Local Biz</Text>
                        <Text style={styles.premiumCardSubtitle}>Vocal for Local</Text>
                    </AnimatedTouchableOpacity>

                    <AnimatedTouchableOpacity
                        style={[styles.premiumCard, { transform: [{ scale: scaleAnim }] }]}
                        activeOpacity={0.9}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={() => navigation.navigate('Explore', { category: 'hidden-gems' })}
                    >
                        <View style={[styles.premiumIconContainer, { backgroundColor: isDarkMode ? '#332C00' : '#FFF9C4' }]}>
                            <Ionicons name="sparkles" size={30} color={isDarkMode ? '#FFF176' : '#FBC02D'} />
                        </View>
                        <Text style={styles.premiumCardTitle}>Hidden Gems</Text>
                        <Text style={styles.premiumCardSubtitle}>Offbeat escapes</Text>
                    </AnimatedTouchableOpacity>

                    <AnimatedTouchableOpacity
                        style={[styles.premiumCard, { transform: [{ scale: scaleAnim }] }]}
                        activeOpacity={0.9}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={() => navigation.navigate('Explore', { category: 'crafts' })}
                    >
                        <View style={[styles.premiumIconContainer, { backgroundColor: isDarkMode ? '#240033' : '#F3E5F5' }]}>
                            <MaterialCommunityIcons name="hammer-wrench" size={30} color={isDarkMode ? '#BA68C8' : '#7B1FA2'} />
                        </View>
                        <Text style={styles.premiumCardTitle}>Traditional Crafts</Text>
                        <Text style={styles.premiumCardSubtitle}>Local Artisans</Text>
                    </AnimatedTouchableOpacity>
                </Animated.View>

                {/* Popular Section */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeading}>Popular Near You</Text>
                    <View style={styles.sectionDivider} />
                    <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularScroll}>
                    {loadingPopular ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                    ) : (
                        popularPlaces.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.popularCard}
                                onPress={() => navigation.navigate('PlaceDetails', { place: item })}
                            >
                                <ImageWithFallback
                                    source={{ uri: item.imageUrl }}
                                    style={styles.popularImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.popularInfo}>
                                    <Text style={styles.popularName} numberOfLines={1}>{item.name}</Text>
                                    <View style={styles.popularLocationRow}>
                                        <Ionicons name="location" size={12} color={theme.colors.text.tertiary} />
                                        <Text style={styles.popularLocation} numberOfLines={1}>{item.city || item.location}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>

                {/* Featured Banner */}
                <View style={styles.bannerContainer}>
                    <View style={styles.banner}>
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerTag}>PROMOTING SWADESHI</Text>
                            <Text style={styles.bannerTitle}>Dekho Apna Desh</Text>
                            <Text style={styles.bannerDesc}>Explore 50+ heritage sites this season</Text>
                            <TouchableOpacity
                                style={styles.bannerButton}
                                onPress={() => navigation.navigate('Initiatives')}
                            >
                                <Text style={styles.bannerButtonText}>Learn More</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bannerCircle} />
                    </View>
                </View>

                {/* SOS / Assistance Card */}
                <TouchableOpacity
                    style={styles.sosCard}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('SOS')}
                >
                    <View style={styles.sosIconContainer}>
                        <Ionicons name="shield-checkmark" size={24} color="#FFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.sosTitle}>Travel Safe</Text>
                        <Text style={styles.sosSubtitle}>Quick access to emergency services</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.text.tertiary} />
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        paddingHorizontal: theme.padding.screen,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    greetingText: {
        ...theme.typography.greeting,
        color: theme.colors.text.secondary,
        fontWeight: '400',
    },
    brandTitle: {
        ...theme.typography.greeting,
        color: theme.colors.text.primary,
        marginTop: -4,
    },
    profileContainer: {
        position: 'relative',
    },
    avatarShadow: {
        backgroundColor: theme.colors.surface,
        borderRadius: 22,
        ...theme.shadows.soft,
    },
    // Floating Search Bar
    searchFloating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        height: 56,
        paddingHorizontal: 16,
        borderRadius: theme.radius.m,
        ...theme.shadows.search,
        marginBottom: 28,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    searchTextInput: {
        flex: 1,
        fontSize: 15,
        color: theme.colors.text.primary,
    },
    searchIconsLeft: {
        marginLeft: 10,
    },
    // Section Headers
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionHeading: {
        ...theme.typography.sectionTitle,
        color: theme.colors.text.primary,
        marginRight: 12,
    },
    sectionDivider: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
        opacity: 0.6,
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primary,
        marginLeft: 12,
    },
    // Categories Grid
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    premiumCard: {
        width: '48%',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.l,
        padding: 20,
        marginBottom: 16,
        ...theme.shadows.card,
    },
    premiumIconContainer: {
        width: 52,
        height: 52,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    premiumCardTitle: {
        ...theme.typography.cardTitle,
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    premiumCardSubtitle: {
        ...theme.typography.cardSubtitle,
        color: theme.colors.text.secondary,
    },
    // Popular horizontal scroll
    popularScroll: {
        paddingBottom: 20,
        paddingLeft: 4,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        width: 300,
    },
    popularCard: {
        width: 170,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.m,
        marginRight: 16,
        ...theme.shadows.card,
        overflow: 'hidden',
    },
    popularImage: {
        width: '100%',
        height: 110,
    },
    popularInfo: {
        padding: 12,
    },
    popularName: {
        ...theme.typography.cardTitle,
        fontSize: 14,
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    popularLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    popularLocation: {
        fontSize: 11,
        color: theme.colors.text.tertiary,
        marginLeft: 4,
    },
    // Banner
    bannerContainer: {
        marginBottom: 30,
    },
    banner: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.l,
        padding: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    bannerContent: {
        zIndex: 2,
    },
    bannerTag: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    bannerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    bannerDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 18,
    },
    bannerButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    bannerButtonText: {
        color: theme.colors.primary,
        fontWeight: '700',
        fontSize: 13,
    },
    bannerCircle: {
        position: 'absolute',
        right: -30,
        bottom: -30,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.1)',
        zIndex: 1,
    },
    // SOS Card
    sosCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.m,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(244, 81, 30, 0.1)',
        ...theme.shadows.soft,
    },
    sosIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    sosTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    sosSubtitle: {
        fontSize: 12,
        color: theme.colors.text.secondary,
    },
});
