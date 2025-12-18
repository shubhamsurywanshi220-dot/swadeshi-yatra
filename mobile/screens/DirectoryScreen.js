import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { FavoritesManager } from '../utils/favoritesManager';
import ImageWithFallback from '../components/ImageWithFallback';

export default function DirectoryScreen({ route, navigation }) {
    const { theme, isDarkMode } = useTheme();
    const { category: initialCategory, search: initialSearch, focusSearch } = route.params || { category: 'destinations' };
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const styles = createStyles(theme);

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState(initialSearch || '');
    const [selectedState, setSelectedState] = useState('All');
    const [selectedCity, setSelectedCity] = useState('All');

    // Auto-select type if we came from a specific home category
    const getInitialType = () => {
        if (initialCategory === 'hidden-gems') return 'Hidden Gem';
        if (initialCategory === 'crafts') return 'Crafts';
        if (initialCategory === 'stays') return 'Stays';
        return 'All';
    };
    const [selectedType, setSelectedType] = useState(getInitialType());
    const [selectedSeason, setSelectedSeason] = useState('All');
    const [favorites, setFavorites] = useState([]);
    const [showFilters, setShowFilters] = useState(false); // Default to collapsed to save space
    const searchInputRef = React.useRef(null);

    useEffect(() => {
        if (initialSearch) setSearchQuery(initialSearch);
        if (focusSearch && searchInputRef.current) {
            setTimeout(() => searchInputRef.current.focus(), 100);
        }
        fetchData();
        loadFavorites();
    }, [initialCategory, initialSearch, focusSearch]);

    // Auto-detect State & Category from Search Query
    useEffect(() => {
        if (!data.length || !searchQuery) return;

        const term = searchQuery.toLowerCase();

        // 1. Detect State from query
        const detectedState = allStates.find(s =>
            s !== 'All' && term.includes(s.toLowerCase())
        );

        // If detectedState is found and it's DIFFERENT from manual selection, update it
        if (detectedState && selectedState !== detectedState) {
            setSelectedState(detectedState);
            setSelectedCity('All');
        }

        // 2. Detect Category (Type)
        const detectedType = allTypes.find(t =>
            t !== 'All' && term.includes(t.toLowerCase())
        );

        if (detectedType && selectedType !== detectedType) {
            setSelectedType(detectedType);
        }
    }, [searchQuery, data]);

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
            if (initialCategory === 'transport') {
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

    // 4. Get Seasons
    // Extract unique seasons or normalize data if needed. For now, distinct values.
    const allSeasons = ['All', ...new Set(data.map(item => item.bestTime).filter(Boolean))];


    // --- Filtering Logic ---
    const filteredData = data.filter(item => {
        // 1. Manual Filters First
        const matchesState = selectedState === 'All' || item.state === selectedState;
        const matchesCity = selectedCity === 'All' || item.city === selectedCity;
        const matchesType = selectedType === 'All' || item.category === selectedType;
        const matchesSeason = selectedSeason === 'All' || item.bestTime === selectedSeason;

        // 2. Text Search (Smart)
        const term = searchQuery.toLowerCase().trim();
        if (!term) return matchesState && matchesCity && matchesType && matchesSeason;

        // Keywords to ignore (filler words)
        const fillerWords = ['tourist', 'place', 'places', 'in', 'visit', 'best', 'top', 'to', 'of'];
        const keywords = term.split(/\s+/).filter(word => word.length > 2 && !fillerWords.includes(word));

        // If query only contains filler words or is very short, search the original term
        const searchTerms = keywords.length > 0 ? keywords : [term];

        const matchesSearch = searchTerms.every(kw => {
            return (item.name?.toLowerCase() || '').includes(kw) ||
                (item.location?.toLowerCase() || '').includes(kw) ||
                (item.description?.toLowerCase() || '').includes(kw) ||
                (item.state?.toLowerCase() || '').includes(kw) ||
                (item.category?.toLowerCase() || '').includes(kw) ||
                (item.city?.toLowerCase() || '').includes(kw);
        });

        return matchesSearch && matchesState && matchesCity && matchesType && matchesSeason;
    });

    const getTitle = () => {
        switch (initialCategory) {
            case 'business': return 'Local Businesses';
            case 'stays': return 'Authentic Stays';
            case 'transport': return 'Local Transport';
            case 'hidden-gems': return 'Hidden Gems';
            case 'crafts': return 'Traditional Crafts';
            default: return 'Discover India';
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('PlaceDetails', { place: item })}
        >
            <View style={styles.imageContainer}>
                <ImageWithFallback source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
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
                            <Ionicons name="star" size={14} color={isDarkMode ? '#FFD700' : theme.colors.accent} />
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
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
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

            {/* A. Search Bar - Floating & Soft (Consistent with Home) */}
            <View style={styles.searchFloating}>
                <Ionicons name="search" size={20} color={theme.colors.text.tertiary} style={{ marginRight: 12 }} />
                <TextInput
                    ref={searchInputRef}
                    style={styles.searchTextInput}
                    placeholder="Search destinations or cities..."
                    placeholderTextColor={theme.colors.text.secondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filter Toggle & Active Summary */}
            <View style={styles.filterHeader}>
                <View style={styles.activeFiltersRow}>
                    <Ionicons name="filter" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activeChipsScroll}>
                        {selectedState !== 'All' && (
                            <TouchableOpacity style={styles.activeChip} onPress={() => setSelectedState('All')}>
                                <Text style={styles.activeChipText}>{selectedState}</Text>
                                <Ionicons name="close-circle" size={14} color={theme.colors.primary} style={{ marginLeft: 4 }} />
                            </TouchableOpacity>
                        )}
                        {selectedCity !== 'All' && (
                            <TouchableOpacity style={styles.activeChip} onPress={() => setSelectedCity('All')}>
                                <Text style={styles.activeChipText}>{selectedCity}</Text>
                                <Ionicons name="close-circle" size={14} color={theme.colors.primary} style={{ marginLeft: 4 }} />
                            </TouchableOpacity>
                        )}
                        {selectedType !== 'All' && (
                            <TouchableOpacity style={styles.activeChip} onPress={() => setSelectedType('All')}>
                                <Text style={styles.activeChipText}>{selectedType}</Text>
                                <Ionicons name="close-circle" size={14} color={theme.colors.primary} style={{ marginLeft: 4 }} />
                            </TouchableOpacity>
                        )}
                        {selectedSeason !== 'All' && (
                            <TouchableOpacity style={styles.activeChip} onPress={() => setSelectedSeason('All')}>
                                <Text style={styles.activeChipText}>{selectedSeason}</Text>
                                <Ionicons name="close-circle" size={14} color={theme.colors.primary} style={{ marginLeft: 4 }} />
                            </TouchableOpacity>
                        )}
                        {selectedState === 'All' && selectedCity === 'All' && selectedType === 'All' && selectedSeason === 'All' && (
                            <Text style={styles.noFiltersText}>All Categories</Text>
                        )}
                    </ScrollView>
                </View>
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setShowFilters(!showFilters)}
                >
                    <Text style={styles.toggleText}>{showFilters ? "Hide" : "Filter"}</Text>
                    <Ionicons
                        name={showFilters ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={theme.colors.primary}
                    />
                </TouchableOpacity>
            </View>

            {showFilters && (
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
                                        setSearchQuery(''); // Clear search to avoid conflict
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
                                        onPress={() => {
                                            setSelectedCity(city);
                                            setSearchQuery('');
                                        }}
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
                                    onPress={() => {
                                        setSelectedType(type);
                                        setSearchQuery(''); // Clear search to avoid conflict
                                    }}
                                />
                            ))}
                        </ScrollView>
                    </View>

                    {/* E. Season Filters */}
                    <View style={styles.filterRow}>
                        <Text style={styles.filterLabel}>Season</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
                            {allSeasons.map(season => (
                                <FilterChip
                                    key={season}
                                    label={season}
                                    selected={selectedSeason === season}
                                    onPress={() => {
                                        setSelectedSeason(season);
                                        setSearchQuery('');
                                    }}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            )}

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : filteredData.length === 0 ? (
                <View style={styles.center}>
                    <MaterialCommunityIcons name="map-marker-off" size={64} color={theme.colors.text.tertiary} />
                    <Text style={styles.emptyText}>
                        {(initialCategory === 'transport')
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

const createStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.padding.screen,
        paddingVertical: 16,
        backgroundColor: theme.colors.background, // Match screen bg
    },
    backButton: { marginRight: theme.spacing.m, padding: 4 },
    headerTitle: {
        ...theme.typography.greeting,
        fontSize: 20,
        color: theme.colors.text.primary,
    },
    headerSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
    },

    searchFloating: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        marginHorizontal: theme.padding.screen,
        marginVertical: 12,
        paddingHorizontal: 20,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        ...theme.shadows.search,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    searchTextInput: {
        flex: 1,
        fontSize: 15,
        color: theme.colors.text.primary,
        height: '100%',
    },

    filtersContainer: {
        backgroundColor: theme.colors.surface,
        paddingBottom: 16,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        ...theme.shadows.soft,
    },
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: theme.colors.background,
        justifyContent: 'space-between',
    },
    activeFiltersRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeChipsScroll: {
        alignItems: 'center',
    },
    activeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary + '10',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: theme.colors.primary + '20',
    },
    activeChipText: {
        fontSize: 12,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    noFiltersText: {
        fontSize: 13,
        color: theme.colors.text.tertiary,
        fontStyle: 'italic',
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: theme.colors.surface,
        ...theme.shadows.soft,
    },
    toggleText: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.colors.primary,
        marginRight: 4,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingHorizontal: 20,
    },
    filterLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.text.secondary,
        width: 60,
    },
    scrollChips: {
        alignItems: 'center',
        paddingRight: 20,
    },
    chip: {
        backgroundColor: theme.colors.surfaceVariant,
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
    },
    chipSelected: {
        backgroundColor: theme.colors.primary,
        ...theme.shadows.soft,
    },
    chipText: {
        fontSize: 13,
        color: theme.colors.text.secondary,
        fontWeight: '600',
    },
    chipTextSelected: {
        color: theme.colors.surface,
        fontWeight: '700',
    },

    list: { padding: 20, paddingTop: 10 },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },

    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 24, // Matches Home cards
        marginBottom: 24,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    imageContainer: {
        position: 'relative',
        height: 220,
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
        color: '#FFF',
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
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },

    cardContent: { padding: 20 },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    name: {
        ...theme.typography.cardTitle,
        fontSize: 18,
        color: theme.colors.text.primary,
        flex: 1,
        marginRight: 8,
    },
    rating: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.colors.primary,
        marginLeft: 2,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary + '10',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
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
        opacity: 0.5,
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
