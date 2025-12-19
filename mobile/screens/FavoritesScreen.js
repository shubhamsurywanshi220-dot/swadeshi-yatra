import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { FavoritesManager } from '../utils/favoritesManager';
import ImageWithFallback from '../components/ImageWithFallback';

export default function FavoritesScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const styles = createStyles(theme, isDarkMode);

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const favs = await FavoritesManager.getFavorites();
            setFavorites(favs);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (placeId) => {
        try {
            await FavoritesManager.removeFavorite(placeId);
            // Remove from local state
            setFavorites(favorites.filter(place => (place._id || place.id) !== placeId));
        } catch (error) {
            console.error('Error removing favorite:', error);
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
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => removeFavorite(item._id || item.id)}
                >
                    <Ionicons name="heart" size={20} color={theme.colors.error} />
                </TouchableOpacity>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <View style={styles.locationRow}>
                    <Ionicons name="location" size={12} color={theme.colors.text.secondary} />
                    <Text style={styles.location} numberOfLines={1}> {item.location}</Text>
                </View>
                {item.averageRating > 0 && (
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color={isDarkMode ? '#FFD700' : theme.colors.accent} />
                        <Text style={styles.rating}> {item.averageRating.toFixed(1)}</Text>
                    </View>
                )}
            </View>
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
                    <Text style={styles.headerTitle}>My Favorites</Text>
                    <Text style={styles.headerSubtitle}>Places you love</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : favorites.length === 0 ? (
                <View style={styles.center}>
                    <View style={styles.emptyIconContainer}>
                        <Ionicons name="heart-outline" size={64} color={theme.colors.text.tertiary} />
                    </View>
                    <Text style={styles.emptyText}>No favorites yet</Text>
                    <Text style={styles.emptySubtext}>
                        Start exploring and add places to your favorites!
                    </Text>
                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => navigation.navigate('Explore')}
                    >
                        <Text style={styles.exploreButtonText}>Discover Places</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={item => item._id || item.id}
                    contentContainerStyle={styles.list}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    },
    backButton: {
        marginRight: 16,
        padding: 4,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    headerSubtitle: {
        fontSize: 13,
        color: theme.colors.text.secondary,
        marginTop: 2,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        ...theme.shadows.soft,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    emptySubtext: {
        marginTop: 8,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    exploreButton: {
        marginTop: 32,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        ...theme.shadows.elevated,
    },
    exploreButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    list: {
        padding: 16,
    },
    row: {
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        width: '48%',
        ...theme.shadows.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    imageContainer: {
        position: 'relative',
        height: 120,
        backgroundColor: theme.colors.surfaceVariant,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255, 255, 255, 0.9)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.soft,
    },
    cardContent: {
        padding: 10,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    location: {
        fontSize: 11,
        color: theme.colors.text.secondary,
        flex: 1,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#2D2418' : theme.colors.primary + '10',
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    rating: {
        fontSize: 11,
        fontWeight: '700',
        color: isDarkMode ? '#FFD700' : theme.colors.primary,
        marginLeft: 2,
    },
});
