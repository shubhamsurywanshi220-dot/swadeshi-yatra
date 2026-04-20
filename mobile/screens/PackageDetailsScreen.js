import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, StatusBar, Animated, Dimensions, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import ImageWithFallback from '../components/ImageWithFallback';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PackageDetailsScreen({ route, navigation }) {
    const { theme, isDarkMode } = useTheme();
    const pkg = route?.params?.package || {};
    const [activeTab, setActiveTab] = useState('itinerary');
    const [expandedDay, setExpandedDay] = useState(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 20, friction: 7, useNativeDriver: true }),
        ]).start();
    }, []);

    const styles = createStyles(theme, isDarkMode);

    const durationText = pkg.duration
        ? `${pkg.duration.nights}N / ${pkg.duration.days}D`
        : '';

    const priceText = pkg.price
        ? `${pkg.price.currency || '₹'}${pkg.price.discounted || pkg.price.original || ''}`
        : '';

    const originalPriceText = pkg.price?.original && pkg.price?.discounted && pkg.price.original > pkg.price.discounted
        ? `${pkg.price.currency || '₹'}${pkg.price.original}`
        : null;

    const discount = pkg.price?.original && pkg.price?.discounted
        ? Math.round(((pkg.price.original - pkg.price.discounted) / pkg.price.original) * 100)
        : 0;

    const tagColor = {
        'Best Seller': '#FF6B00',
        'Trending': '#E91E63',
        'New': '#4CAF50',
        'Limited Offer': '#F44336',
        'Premium': '#9C27B0',
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    <ImageWithFallback
                        source={{ uri: pkg.imageUrl }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <View style={styles.heroGradient} />

                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>

                    {/* Tag Badge */}
                    {pkg.tag ? (
                        <View style={[styles.tagBadge, { backgroundColor: tagColor[pkg.tag] || theme.colors.primary }]}>
                            <Text style={styles.tagBadgeText}>{pkg.tag}</Text>
                        </View>
                    ) : null}

                    {/* Hero Content */}
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>{pkg.title}</Text>
                        <View style={styles.heroMeta}>
                            <View style={styles.heroMetaItem}>
                                <Ionicons name="time-outline" size={16} color="#FFF" />
                                <Text style={styles.heroMetaText}>{durationText}</Text>
                            </View>
                            <View style={styles.heroMetaItem}>
                                <Ionicons name="location-outline" size={16} color="#FFF" />
                                <Text style={styles.heroMetaText}>{(pkg.locations || []).length} Places</Text>
                            </View>
                            <View style={styles.heroMetaItem}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text style={styles.heroMetaText}>{pkg.rating || '4.5'} ({pkg.reviewCount || 0})</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Price Card */}
                <Animated.View style={[styles.priceCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.priceRow}>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                <Text style={styles.priceMain}>{priceText}</Text>
                                {originalPriceText && (
                                    <Text style={styles.priceOriginal}>{originalPriceText}</Text>
                                )}
                            </View>
                            <Text style={styles.pricePerPerson}>per person</Text>
                        </View>
                        {discount > 0 && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>{discount}% OFF</Text>
                            </View>
                        )}
                    </View>

                    {/* Quick Info Pills */}
                    <View style={styles.quickInfoRow}>
                        <View style={styles.infoPill}>
                            <MaterialCommunityIcons name="map-marker-path" size={16} color={theme.colors.primary} />
                            <Text style={styles.infoPillText}>{pkg.startingFrom || 'Delhi'}</Text>
                        </View>
                        <View style={styles.infoPill}>
                            <Ionicons name="fitness-outline" size={16} color={theme.colors.primary} />
                            <Text style={styles.infoPillText}>{pkg.difficulty || 'Easy'}</Text>
                        </View>
                        <View style={styles.infoPill}>
                            <Ionicons name="people-outline" size={16} color={theme.colors.primary} />
                            <Text style={styles.infoPillText}>Max {pkg.maxGroupSize || 20}</Text>
                        </View>
                        <View style={styles.infoPill}>
                            <Ionicons name="calendar-outline" size={16} color={theme.colors.primary} />
                            <Text style={styles.infoPillText}>{pkg.bestSeason || 'Year Round'}</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About This Package</Text>
                    <Text style={styles.descriptionText}>{pkg.description}</Text>
                </View>

                {/* Locations */}
                {pkg.locations && pkg.locations.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Destinations Covered</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {pkg.locations.map((loc, idx) => (
                                <View key={idx} style={styles.locationChip}>
                                    <Ionicons name="location" size={14} color={theme.colors.primary} />
                                    <Text style={styles.locationChipText}>{loc}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Highlights */}
                {pkg.highlights && pkg.highlights.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Highlights</Text>
                        {pkg.highlights.map((h, idx) => (
                            <View key={idx} style={styles.highlightRow}>
                                <View style={styles.highlightDot} />
                                <Text style={styles.highlightText}>{h}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Tabs: Itinerary / Inclusions */}
                <View style={styles.tabRow}>
                    {['itinerary', 'inclusions'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                {tab === 'itinerary' ? '📋 Itinerary' : '✅ Inclusions'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Itinerary Tab */}
                {activeTab === 'itinerary' && pkg.itinerary && (
                    <View style={styles.section}>
                        {pkg.itinerary.map((day, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={styles.dayCard}
                                activeOpacity={0.7}
                                onPress={() => setExpandedDay(expandedDay === idx ? -1 : idx)}
                            >
                                <View style={styles.dayHeader}>
                                    <View style={styles.dayBadge}>
                                        <Text style={styles.dayBadgeText}>Day {day.day}</Text>
                                    </View>
                                    <Text style={styles.dayTitle} numberOfLines={expandedDay === idx ? 0 : 1}>{day.title}</Text>
                                    <Ionicons
                                        name={expandedDay === idx ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        color={theme.colors.text.secondary}
                                    />
                                </View>
                                {expandedDay === idx && (
                                    <View style={styles.dayExpanded}>
                                        <Text style={styles.dayDescription}>{day.description}</Text>
                                        {day.activities && day.activities.length > 0 && (
                                            <View style={styles.activityRow}>
                                                {day.activities.map((act, aIdx) => (
                                                    <View key={aIdx} style={styles.activityChip}>
                                                        <Text style={styles.activityChipText}>{act}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                        {day.meals && (
                                            <View style={styles.dayInfoRow}>
                                                <Ionicons name="restaurant-outline" size={14} color={theme.colors.text.secondary} />
                                                <Text style={styles.dayInfoText}>{day.meals}</Text>
                                            </View>
                                        )}
                                        {day.stay && (
                                            <View style={styles.dayInfoRow}>
                                                <Ionicons name="bed-outline" size={14} color={theme.colors.text.secondary} />
                                                <Text style={styles.dayInfoText}>{day.stay}</Text>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Inclusions Tab */}
                {activeTab === 'inclusions' && (
                    <View style={styles.section}>
                        {pkg.inclusions && pkg.inclusions.length > 0 && (
                            <View style={styles.inclusionBlock}>
                                <Text style={styles.inclusionTitle}>✅ Included</Text>
                                {pkg.inclusions.map((item, idx) => (
                                    <View key={idx} style={styles.inclusionRow}>
                                        <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                                        <Text style={styles.inclusionText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {pkg.exclusions && pkg.exclusions.length > 0 && (
                            <View style={[styles.inclusionBlock, { marginTop: 20 }]}>
                                <Text style={styles.inclusionTitle}>❌ Not Included</Text>
                                {pkg.exclusions.map((item, idx) => (
                                    <View key={idx} style={styles.inclusionRow}>
                                        <Ionicons name="close-circle" size={18} color="#F44336" />
                                        <Text style={styles.inclusionText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomCTA}>
                <View>
                    <Text style={styles.ctaPrice}>{priceText}</Text>
                    <Text style={styles.ctaPriceLabel}>per person</Text>
                </View>
                <TouchableOpacity style={styles.bookButton} activeOpacity={0.85}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    // Hero
    heroContainer: {
        height: 320,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    backButton: {
        position: 'absolute',
        top: 48,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagBadge: {
        position: 'absolute',
        top: 48,
        right: 16,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    tagBadgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    heroContent: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
    },
    heroMeta: {
        flexDirection: 'row',
        gap: 16,
    },
    heroMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    heroMetaText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        fontWeight: '600',
    },

    // Price Card
    priceCard: {
        marginHorizontal: 16,
        marginTop: -20,
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 20,
        ...theme.shadows.card,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    priceMain: {
        fontSize: 28,
        fontWeight: '900',
        color: theme.colors.primary,
    },
    priceOriginal: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.text.tertiary,
        textDecorationLine: 'line-through',
        marginLeft: 8,
    },
    pricePerPerson: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        marginTop: 2,
    },
    discountBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    discountText: {
        color: '#2E7D32',
        fontWeight: '800',
        fontSize: 13,
    },
    quickInfoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    infoPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    infoPillText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },

    // Sections
    section: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.colors.text.primary,
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 22,
        color: theme.colors.text.secondary,
    },

    // Locations
    locationChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: isDarkMode ? 'rgba(244,81,30,0.15)' : 'rgba(244,81,30,0.08)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    locationChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.primary,
    },

    // Highlights
    highlightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    highlightDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.primary,
        marginRight: 12,
    },
    highlightText: {
        fontSize: 14,
        color: theme.colors.text.primary,
        flex: 1,
    },

    // Tabs
    tabRow: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 24,
        backgroundColor: isDarkMode ? theme.colors.surfaceVariant : '#F5F5F5',
        borderRadius: 16,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 14,
    },
    activeTab: {
        backgroundColor: theme.colors.surface,
        ...theme.shadows.soft,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },
    activeTabText: {
        color: theme.colors.primary,
        fontWeight: '700',
    },

    // Itinerary Days
    dayCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    dayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dayBadge: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 12,
    },
    dayBadgeText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '800',
    },
    dayTitle: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    dayExpanded: {
        marginTop: 14,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    dayDescription: {
        fontSize: 13,
        lineHeight: 20,
        color: theme.colors.text.secondary,
        marginBottom: 12,
    },
    activityRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 10,
    },
    activityChip: {
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.07)' : '#F0F0F0',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    activityChipText: {
        fontSize: 11,
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },
    dayInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    dayInfoText: {
        fontSize: 12,
        color: theme.colors.text.secondary,
    },

    // Inclusions
    inclusionBlock: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    inclusionTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: theme.colors.text.primary,
        marginBottom: 12,
    },
    inclusionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    inclusionText: {
        fontSize: 13,
        color: theme.colors.text.secondary,
        flex: 1,
    },

    // Bottom CTA
    bottomCTA: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        paddingBottom: 28,
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        ...theme.shadows.card,
    },
    ctaPrice: {
        fontSize: 22,
        fontWeight: '900',
        color: theme.colors.text.primary,
    },
    ctaPriceLabel: {
        fontSize: 11,
        color: theme.colors.text.secondary,
    },
    bookButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 16,
        ...theme.shadows.float,
    },
    bookButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '800',
    },
});
