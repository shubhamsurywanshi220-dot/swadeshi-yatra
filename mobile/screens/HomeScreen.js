import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, StatusBar, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import ImageWithFallback from '../components/ImageWithFallback';
import { checkConnectivity } from '../utils/network';


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Fallback sample data when API returns no packages
const FALLBACK_PACKAGES = [
    {
        _id: 'fb1',
        title: 'Char Dham Yatra',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Kedarnath_Temple_in_Uttarakhand.jpg/800px-Kedarnath_Temple_in_Uttarakhand.jpg',
        duration: { nights: 4, days: 5 },
        tag: 'Best Seller',
        price: { currency: '₹', original: 15999, discounted: 12999 },
        rating: 4.8,
        description: 'Visit the sacred Char Dham circuit — Yamunotri, Gangotri, Kedarnath & Badrinath.',
        locations: ['Yamunotri', 'Gangotri', 'Kedarnath', 'Badrinath'],
        highlights: ['Helicopter to Kedarnath', 'VIP Darshan', 'All meals included'],
    },
    {
        _id: 'fb2',
        title: 'Manali Adventure',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Solang_Valley_Feb_2021.jpg/800px-Solang_Valley_Feb_2021.jpg',
        duration: { nights: 2, days: 3 },
        tag: 'Trending',
        price: { currency: '₹', original: 8999, discounted: 6499 },
        rating: 4.6,
        description: 'Snow-capped peaks, Solang Valley & the best of Himachal.',
        locations: ['Manali', 'Solang Valley', 'Rohtang'],
    },
    {
        _id: 'fb3',
        title: 'Leh Ladakh Expedition',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Pangong_Tso.jpg/800px-Pangong_Tso.jpg',
        duration: { nights: 5, days: 6 },
        tag: 'Premium',
        price: { currency: '₹', original: 22999, discounted: 18999 },
        rating: 4.9,
        description: 'Pangong Lake, Nubra Valley & the ultimate road trip.',
        locations: ['Leh', 'Pangong', 'Nubra Valley', 'Khardung La'],
    },
    {
        _id: 'fb4',
        title: 'Goa Beach Getaway',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Vagator_Beach_Goa.jpg/800px-Vagator_Beach_Goa.jpg',
        duration: { nights: 3, days: 4 },
        price: { currency: '₹', original: 9999, discounted: 7499 },
        rating: 4.5,
        description: 'Sun, sand & heritage — explore the best of Goa.',
        locations: ['Calangute', 'Old Goa', 'Dudhsagar'],
    },
    {
        _id: 'fb5',
        title: 'Coorg Nature Retreat',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Abbey_Falls_Coorg.jpg/800px-Abbey_Falls_Coorg.jpg',
        duration: { nights: 2, days: 3 },
        tag: 'New',
        price: { currency: '₹', original: 6999, discounted: 4999 },
        rating: 4.7,
        description: 'Coffee plantations, waterfalls & misty hills of Karnataka.',
        locations: ['Coorg', 'Abbey Falls', 'Mandalpatti'],
    },
];

export default function HomeScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [popularPlaces, setPopularPlaces] = useState([]);
    const [recommendedPlaces, setRecommendedPlaces] = useState([]);
    const [travelPackages, setTravelPackages] = useState([]);
    const [loadingPopular, setLoadingPopular] = useState(true);
    const [loadingRecommended, setLoadingRecommended] = useState(true);
    const [loadingPackages, setLoadingPackages] = useState(true);
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
        fetchRecommendations();
        fetchTravelPackages();
    }, []);

    const fetchPopularPlaces = async () => {
        setLoadingPopular(true);
        try {
            const response = await api.get('/places');
            
            // Helper to check for images
            const hasImage = (p) => !!(p.imageUrl || (p.images && p.images.length > 0));

            // Sort by image presence first, then rating
            const sortedData = [...response.data].sort((a, b) => {
                const aImg = hasImage(a);
                const bImg = hasImage(b);
                if (aImg && !bImg) return -1;
                if (!aImg && bImg) return 1;
                return (b.rating || 0) - (a.rating || 0);
            });

            // Mocking "Popular Near You" by filtering Karnataka or just trending ones
            const karnataka = sortedData.filter(p => p.state === 'Karnataka').slice(0, 6);
            // If no Karnataka places (unlikely), take any top rated
            const places = karnataka.length > 0 ? karnataka : sortedData.slice(0, 6);
            setPopularPlaces(places);
        } catch (error) {
            console.error("Error fetching popular places:", error);
        } finally {
            setLoadingPopular(false);
        }
    };

    const fetchRecommendations = async () => {
        setLoadingRecommended(true);
        try {
            const response = await api.get('/recommendations');
            
            // The backend already sorts, but we ensure it here as well for robustness
            const hasImage = (p) => !!(p.imageUrl || (p.images && p.images.length > 0));
            const sortedRecommendations = [...response.data.places].sort((a, b) => {
                const aImg = hasImage(a);
                const bImg = hasImage(b);
                if (aImg && !bImg) return -1;
                if (!aImg && bImg) return 1;
                return 0;
            });

            setRecommendedPlaces(sortedRecommendations);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        } finally {
            setLoadingRecommended(false);
        }
    };

    const fetchTravelPackages = async () => {
        setLoadingPackages(true);
        try {
            const response = await api.get('/packages');
            setTravelPackages(response.data || []);
        } catch (error) {
            console.error('Error fetching travel packages:', error);
        } finally {
            setLoadingPackages(false);
        }
    };

    const getTagColor = (tag) => {
        const colors = {
            'Best Seller': '#FF6B00',
            'Trending': '#E91E63',
            'New': '#4CAF50',
            'Limited Offer': '#F44336',
            'Premium': '#9C27B0',
        };
        return colors[tag] || theme.colors.primary;
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

    const handleSearch = async (query) => {
        const text = query || searchQuery;
        if (text.trim()) {
            const isOnline = await checkConnectivity();
            if (!isOnline) {
                Alert.alert(t('common.offline'), "Internet connection required to search locations.");
                // We still navigate to Explore for local filtering, but warn them
            }
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
                        <Text style={styles.greetingText}>{t('home.greeting')}</Text>
                        <Text style={styles.brandTitle}>{t('home.brand')}</Text>
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
                        placeholder={t('common.search')}
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
                    <Text style={styles.sectionHeading}>{t('common.explore')}</Text>
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
                        <Text style={styles.premiumCardTitle}>{t('home.destinations')}</Text>
                        <Text style={styles.premiumCardSubtitle}>{t('home.heritage_culture')}</Text>
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
                        <Text style={styles.premiumCardTitle}>{t('home.local_biz')}</Text>
                        <Text style={styles.premiumCardSubtitle}>{t('home.vocal_for_local')}</Text>
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
                        <Text style={styles.premiumCardTitle}>{t('home.hidden_gems')}</Text>
                        <Text style={styles.premiumCardSubtitle}>{t('home.offbeat_escapes')}</Text>
                    </AnimatedTouchableOpacity>

                    <AnimatedTouchableOpacity
                        style={[styles.premiumCard, { transform: [{ scale: scaleAnim }] }]}
                        activeOpacity={0.9}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={() => navigation.navigate('SocialHub')}
                    >
                        <View style={[styles.premiumIconContainer, { backgroundColor: isDarkMode ? '#0D1B2E' : '#E8F4FD' }]}>
                            <MaterialCommunityIcons name="video-wireless" size={30} color={isDarkMode ? '#64B5F6' : '#1565C0'} />
                        </View>
                        <Text style={styles.premiumCardTitle}>Social Hub</Text>
                        <Text style={styles.premiumCardSubtitle}>Travel Vlogs & Experiences</Text>
                    </AnimatedTouchableOpacity>

                </Animated.View>

                {/* Popular Section */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeading}>{t('home.popular')}</Text>
                    <View style={styles.sectionDivider} />
                    <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
                        <Text style={styles.seeAllText}>{t('common.see_all')}</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularScroll}>
                    {loadingPopular ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                    ) : (
                        popularPlaces.slice(0, 6).map((item) => (
                            <TouchableOpacity
                                key={`popular-${item.id || item._id}`}
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
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>

                {/* ====== Travel Packages Section ====== */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeading}>Travel Packages</Text>
                    <View style={styles.sectionDivider} />
                    <TouchableOpacity onPress={() => navigation.navigate('Explore', { category: 'destinations' })}>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.packagesSubtitle}>Curated trips & experiences</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularScroll}>
                    {loadingPackages ? (
                        // Skeleton loader — matching Popular Near You style
                        <>
                            {[1, 2, 3].map((i) => (
                                <View key={`pkg-skel-${i}`} style={styles.popularCard}>
                                    <View style={[styles.popularImage, { backgroundColor: theme.colors.border, justifyContent: 'center', alignItems: 'center' }]}>
                                        <Ionicons name="image-outline" size={32} color={theme.colors.text.tertiary} />
                                    </View>
                                    <View style={styles.popularInfo}>
                                        <View style={{ width: '75%', height: 12, borderRadius: 6, backgroundColor: theme.colors.border, marginBottom: 6 }} />
                                        <View style={{ width: '50%', height: 10, borderRadius: 5, backgroundColor: theme.colors.border }} />
                                    </View>
                                </View>
                            ))}
                        </>
                    ) : (
                        (travelPackages.length > 0 ? travelPackages : FALLBACK_PACKAGES).map((pkg, index) => (
                            <TouchableOpacity
                                key={`pkg-${pkg._id || index}`}
                                style={styles.popularCard}
                                activeOpacity={0.85}
                                onPress={() => navigation.navigate('PackageDetails', { package: pkg })}
                            >
                                <View style={{ position: 'relative' }}>
                                    <ImageWithFallback
                                        source={{ uri: pkg.imageUrl }}
                                        style={styles.popularImage}
                                        resizeMode="cover"
                                    />
                                    {pkg.tag ? (
                                        <View style={[styles.pkgTagBadge, { backgroundColor: getTagColor(pkg.tag) }]}>
                                            <Text style={styles.pkgTagText}>{pkg.tag}</Text>
                                        </View>
                                    ) : null}
                                </View>
                                <View style={styles.popularInfo}>
                                    <Text style={styles.popularName} numberOfLines={1}>{pkg.title}</Text>
                                    <Text style={styles.pkgDuration} numberOfLines={1}>
                                        {pkg.duration ? `📅 ${pkg.duration.nights}N / ${pkg.duration.days}D` : ''}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>

                {/* Featured Banner */}
                <View style={styles.bannerContainer}>
                    <View style={styles.banner}>
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerTag}>{t('home.promoting_swadeshi')}</Text>
                            <Text style={styles.bannerTitle}>{t('home.dekho_apna_desh')}</Text>
                            <Text style={styles.bannerDesc}>{t('home.explore_heritage')}</Text>
                            <TouchableOpacity
                                style={styles.bannerButton}
                                onPress={() => navigation.navigate('Initiatives')}
                            >
                                <Text style={styles.bannerButtonText}>{t('home.learn_more')}</Text>
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
                        <Text style={styles.sosTitle}>{t('home.travel_safe')}</Text>
                        <Text style={styles.sosSubtitle}>{t('home.quick_emergency')}</Text>
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
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    popularName: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    // Travel Packages (reuses popularCard, popularImage, popularInfo, popularName)
    packagesSubtitle: {
        fontSize: 13,
        color: theme.colors.text.secondary,
        marginTop: -10,
        marginBottom: 16,
    },
    pkgTagBadge: {
        position: 'absolute',
        top: 6,
        left: 6,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    pkgTagText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    pkgDuration: {
        fontSize: 11,
        color: theme.colors.text.secondary,
        marginTop: 2,
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
