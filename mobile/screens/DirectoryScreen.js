import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import api from '../utils/api';
import { FavoritesManager } from '../utils/favoritesManager';

export default function DirectoryScreen({ route, navigation }) {
    const { category: initialCategory } = route.params || { category: 'destinations' };
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedState, setSelectedState] = useState('All');
    const [selectedCity, setSelectedCity] = useState('All');
    const [selectedType, setSelectedType] = useState('All');
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchData();
        loadFavorites();
    }, [initialCategory]);

    const loadFavorites = async () => {
        const favs = await FavoritesManager.getFavorites();
        setFavorites(favs.map(f => f._id || f.id));
    };

    const toggleFavorite = async (item, event) => {
        event.stopPropagation(); // Prevent card click
        const placeId = item._id || item.id;
        const isFav = favorites.includes(placeId);

        if (isFav) {
            await FavoritesManager.removeFavorite(placeId);
            setFavorites(favorites.filter(id => id !== placeId));
        } else {
            await FavoritesManager.addFavorite(item);
            setFavorites([...favorites, placeId]);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (initialCategory === 'stays' || initialCategory === 'transport') {
                setTimeout(() => { setData([]); setLoading(false); }, 500);
                return;
            }
            const endpoint = initialCategory === 'business' ? '/businesses' : '/places';
            const response = await api.get(endpoint);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Derived Data for Filters ---

    // 1. Get Unique States
    const allStates = ['All', ...new Set(data.map(item => item.state).filter(Boolean))];

    // 2. Get Cities based on Selected State
    const availableCities = selectedState === 'All'
        ? []
        : ['All', ...new Set(data.filter(item => item.state === selectedState).map(item => item.city).filter(Boolean))];

    // 3. Get Categories (Types)
    const allTypes = ['All', ...new Set(data.map(item => item.category).filter(Boolean))];


    // --- Filtering Logic ---
    const filteredData = data.filter(item => {
        // 1. Text Search
        const term = searchQuery.toLowerCase().trim();
        const matchesSearch =
            (item.name?.toLowerCase() || '').includes(term) ||
            (item.location?.toLowerCase() || '').includes(term) ||
            (item.description?.toLowerCase() || '').includes(term) ||
            (item.state?.toLowerCase() || '').includes(term) ||
            (item.category?.toLowerCase() || '').includes(term);

        // 2. State Filter
        const matchesState = selectedState === 'All' || item.state === selectedState;

        // 3. City Filter
        const matchesCity = selectedCity === 'All' || item.city === selectedCity;

        // 4. Category/Type Filter
        const matchesType = selectedType === 'All' || item.category === selectedType;

        return matchesSearch && matchesState && matchesCity && matchesType;
    });

    const getTitle = () => {
        switch (initialCategory) {
            case 'business': return 'Local Businesses';
            case 'stays': return 'Authentic Stays';
            case 'transport': return 'Local Transport';
            default: return 'Tourist Destinations';
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('PlaceDetails', { place: item })}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
                <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>{item.category || 'Heritage'}</Text>
                </View>
                {/* Eco-Friendly Badge */}
                {item.isEcoFriendly && (
                    <View style={styles.ecoBadge}>
                        <Ionicons name="leaf" size={14} color="#FFF" />
                        <Text style={styles.ecoText}>Eco</Text>
                    </View>
                )}
                {/* Favorite Button */}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={(e) => toggleFavorite(item, e)}
                >
                    <Ionicons
                        name={favorites.includes(item._id || item.id) ? "heart" : "heart-outline"}
                        size={20}
                        color={favorites.includes(item._id || item.id) ? theme.colors.error : "#FFF"}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                    {item.rating && (
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color={theme.colors.accent} />
                            <Text style={styles.rating}> {item.rating}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color={theme.colors.text.secondary} />
                    <Text style={styles.location} numberOfLines={1}> {item.location}</Text>
                </View>

                <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                    <View style={styles.footerItem}>
                        <Ionicons name="calendar-outline" size={16} color={theme.colors.text.tertiary} />
                        <View style={{ marginLeft: 6 }}>
                            <Text style={styles.footerLabel}>Best Time</Text>
                            <Text style={styles.footerValue}>{item.bestTime || 'Oct-Mar'}</Text>
                        </View>
                    </View>
                    <View style={styles.footerItem}>
                        <MaterialCommunityIcons name="ticket-outline" size={16} color={theme.colors.text.tertiary} />
                        <View style={{ marginLeft: 6 }}>
                            <Text style={styles.footerLabel}>Entry</Text>
                            <Text style={styles.footerValue}>{item.entryFee || '₹35'}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const FilterChip = ({ label, selected, onPress }) => (
        <TouchableOpacity
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={onPress}
        >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>{getTitle()}</Text>
                    <Text style={styles.headerSubtitle}>Discover the diverse beauty of India</Text>
                </View>
            </View>

            {/* A. General Search Bar (Modern) */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={theme.colors.text.tertiary} style={{ marginRight: 10 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search destinations or cities..."
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                />
            </View>

            <View style={styles.filtersContainer}>
                {/* B. State/UT Filter */}
                <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>State/UT</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                        {allStates.map(state => (
                            <FilterChip
                                key={state}
                                label={state}
                                selected={selectedState === state}
                                onPress={() => {
                                    setSelectedState(state);
                                    setSelectedCity('All');
                                }}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* C. City Filter */}
                {selectedState !== 'All' && (
                    <View style={styles.filterRow}>
                        <Text style={styles.filterLabel}>City</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                            {availableCities.map(city => (
                                <FilterChip
                                    key={city}
                                    label={city}
                                    selected={selectedCity === city}
                                    onPress={() => setSelectedCity(city)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* D. Category Filters */}
                <View style={styles.filterRow}>
                    <Text style={styles.filterLabel}>Type</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                        {allTypes.map(type => (
                            <FilterChip
                                key={type}
                                label={type}
                                selected={selectedType === type}
                                onPress={() => setSelectedType(type)}
                            />
                        ))}
                    </ScrollView>
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : filteredData.length === 0 ? (
                <View style={styles.center}>
                    <MaterialCommunityIcons name="map-marker-off" size={64} color={theme.colors.text.tertiary} />
                    <Text style={styles.emptyText}>
                        {(initialCategory === 'stays' || initialCategory === 'transport')
                            ? "Coming Soon!"
                            : "No matches found."}
                    </Text>
                    <Text style={styles.emptySubtext}>Try adjusting your filters.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Spacer for Bottom Tabs */}
            <View style={{ height: 70 }} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.m,
        paddingVertical: 12,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: { marginRight: theme.spacing.m, padding: 4 },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    headerSubtitle: {
        fontSize: 12,
        color: theme.colors.text.tertiary,
    },

    searchContainer: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        marginHorizontal: theme.spacing.m,
        marginVertical: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: theme.radius.l, // Pill shape
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.card,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: theme.colors.text.primary,
        padding: 0,
    },

    filtersContainer: {
        backgroundColor: theme.colors.surface,
        paddingVertical: 8,
        paddingBottom: 12,
        borderBottomLeftRadius: theme.radius.m,
        borderBottomRightRadius: theme.radius.m,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 16,
    },
    filterLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text.secondary,
        width: 60,
    },
    scrollChips: {
        alignItems: 'center',
        paddingRight: 16,
    },
    chip: {
        backgroundColor: theme.colors.surfaceVariant,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    chipSelected: {
        backgroundColor: theme.colors.primary,
    },
    chipText: {
        fontSize: 13,
        color: theme.colors.text.secondary,
        fontWeight: '500',
    },
    chipTextSelected: {
        color: theme.colors.surface,
        fontWeight: '600',
    },

    list: { padding: 16 },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },

    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.xl,
        marginBottom: 20,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    imageContainer: {
        position: 'relative',
        height: 200,
        backgroundColor: theme.colors.surfaceVariant,
    },
    image: { width: '100%', height: '100%' },
    cardBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    cardBadgeText: {
        color: theme.colors.surface,
        fontSize: 11,
        fontWeight: '700',
    },
    ecoBadge: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: theme.colors.success,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        gap: 4,
    },
    ecoText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },

    cardContent: { padding: 16 },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text.primary,
        flex: 1,
        marginRight: 8,
    },
    rating: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.accent,
        marginLeft: 2,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },

    location: {
        fontSize: 13,
        color: theme.colors.text.secondary,
        flex: 1,
    },
    desc: {
        fontSize: 14,
        color: theme.colors.text.secondary,
        lineHeight: 20,
        marginBottom: 16,
    },

    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginBottom: 12,
    },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerLabel: {
        fontSize: 10,
        color: theme.colors.text.tertiary,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    footerValue: {
        fontSize: 13,
        color: theme.colors.text.primary,
        fontWeight: '600',
    },

    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        textAlign: 'center',
    },
    emptySubtext: {
        marginTop: 8,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
});
