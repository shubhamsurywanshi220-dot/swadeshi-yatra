import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { FavoritesManager } from '../utils/favoritesManager';

export default function FavoritesScreen({ navigation }) {
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
                <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => removeFavorite(item._id || item.id)}
                >
                    <Ionicons name="heart" size={24} color={theme.colors.error} />
                </TouchableOpacity>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <View style={styles.locationRow}>
                    <Ionicons name="location" size={14} color={theme.colors.text.secondary} />
                    <Text style={styles.location} numberOfLines={1}> {item.location}</Text>
                </View>
                {item.averageRating > 0 && (
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color={theme.colors.accent} />
                        <Text style={styles.rating}> {item.averageRating.toFixed(1)}</Text>
                    </View>
                )}
            </View>
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
                    <Ionicons name="heart-outline" size={64} color={theme.colors.text.tertiary} />
                    <Text style={styles.emptyText}>No favorites yet</Text>
                    <Text style={styles.emptySubtext}>
                        Start exploring and add places to your favorites!
                    </Text>
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

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        textAlign: 'center',
        marginTop: 16,
    },
    emptySubtext: {
        marginTop: 8,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },

    list: { padding: 12 },
    row: {
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.m,
        marginBottom: 12,
        overflow: 'hidden',
        width: '48%',
        ...theme.shadows.card,
    },
    imageContainer: {
        position: 'relative',
        height: 140,
        backgroundColor: theme.colors.surfaceVariant,
    },
    image: { width: '100%', height: '100%' },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.soft,
    },
    cardContent: { padding: 12 },
    name: {
        fontSize: 15,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    location: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        flex: 1,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.accent,
        marginLeft: 2,
    },
});
