import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import api from '../utils/api';
import { FavoritesManager } from '../utils/favoritesManager';
import ReviewModal from '../components/ReviewModal';
import ReviewCard from '../components/ReviewCard';

const { width } = Dimensions.get('window');

export default function PlaceDetailsScreen({ route, navigation }) {
    const { place } = route.params;

    // State
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Mock user data (in production, get from auth context)
    const userId = 'user_dynamic_placeholder';
    const userName = 'Traveler';

    // Fallback data
    const bestTime = place.bestTime || "Oct to Mar";
    const entryFee = place.entryFee || "₹35 (Ind), ₹500 (For)";
    const tag = place.category || "Heritage";

    useEffect(() => {
        fetchReviews();
        checkIfFavorite();
    }, []);

    const checkIfFavorite = async () => {
        const favorited = await FavoritesManager.isFavorite(place._id || place.id);
        setIsFavorite(favorited);
    };

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/reviews/${place._id || place.id}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleReviewSubmitted = () => {
        fetchReviews();
    };

    const handleMarkHelpful = async (reviewId) => {
        try {
            await api.post(`/reviews/${reviewId}/helpful`);
            fetchReviews(); // Refresh to show updated count
        } catch (error) {
            console.error('Error marking review as helpful:', error);
        }
    };

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await FavoritesManager.removeFavorite(place._id || place.id);
                Alert.alert('Success', 'Removed from favorites');
            } else {
                await FavoritesManager.addFavorite(place);
                Alert.alert('Success', 'Added to favorites');
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error toggling favorite:', error);
            Alert.alert('Error', 'Failed to update favorites');
        }
    };

    const openMaps = () => {
        const query = place.coordinates?.latitude && place.coordinates?.longitude
            ? `${place.coordinates.latitude},${place.coordinates.longitude}`
            : place.name + " " + place.location;

        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert("Error", "Could not open Maps");
            }
        });
    };

    const handleCall = () => {
        if (place.contactInfo?.phone) {
            Linking.openURL(`tel:${place.contactInfo.phone}`);
        } else {
            Alert.alert('Info', 'Phone number not available');
        }
    };

    const handleEmail = () => {
        if (place.contactInfo?.email) {
            Linking.openURL(`mailto:${place.contactInfo.email}`);
        } else {
            Alert.alert('Info', 'Email not available');
        }
    };

    const handleWebsite = () => {
        if (place.contactInfo?.website) {
            Linking.openURL(place.contactInfo.website);
        } else {
            Alert.alert('Info', 'Website not available');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header Buttons */}
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={isFavorite ? theme.colors.error : "#FFF"}
                        />
                    </TouchableOpacity>
                </View>

                {/* Hero Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: place.imageUrl }} style={styles.image} resizeMode="cover" />
                    <View style={styles.tagBadge}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                    {place.isEcoFriendly && (
                        <View style={styles.ecoBadge}>
                            <Ionicons name="leaf" size={16} color="#FFF" />
                            <Text style={styles.ecoText}>Eco-Friendly</Text>
                        </View>
                    )}
                </View>

                <View style={styles.content}>
                    {/* Title & Location */}
                    <Text style={styles.title}>{place.name}</Text>
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={16} color={theme.colors.text.secondary} />
                        <Text style={styles.location}> {place.location}</Text>
                    </View>

                    {/* Rating Display */}
                    {place.averageRating > 0 && (
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={18} color={theme.colors.accent} />
                            <Text style={styles.ratingText}>
                                {place.averageRating.toFixed(1)} ({place.reviewCount} {place.reviewCount === 1 ? 'review' : 'reviews'})
                            </Text>
                        </View>
                    )}

                    {/* Info Grid (Season & Price) */}
                    <View style={styles.infoGrid}>
                        <View style={styles.infoCard}>
                            <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} style={{ marginBottom: 4 }} />
                            <Text style={styles.infoLabel}>Best Time to Visit</Text>
                            <Text style={styles.infoValue}>{bestTime}</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <MaterialCommunityIcons name="ticket-outline" size={24} color={theme.colors.primary} style={{ marginBottom: 4 }} />
                            <Text style={styles.infoLabel}>Entry Fee</Text>
                            <Text style={styles.infoValue}>{entryFee}</Text>
                        </View>
                    </View>

                    {/* About Section */}
                    <Text style={styles.sectionHeader}>About</Text>
                    <Text style={styles.description}>
                        {place.description}
                        {place.description.length < 50 ? " This is a placeholder description to match the rich text look of the mockups provided. It adds context and details about the historical significance." : ""}
                    </Text>

                    {/* Contact Info */}
                    {(place.contactInfo?.phone || place.contactInfo?.email || place.contactInfo?.website) && (
                        <>
                            <Text style={styles.sectionHeader}>Contact Information</Text>
                            <View style={styles.contactButtons}>
                                {place.contactInfo?.phone && (
                                    <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                                        <Ionicons name="call" size={20} color={theme.colors.primary} />
                                        <Text style={styles.contactButtonText}>Call</Text>
                                    </TouchableOpacity>
                                )}
                                {place.contactInfo?.email && (
                                    <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
                                        <Ionicons name="mail" size={20} color={theme.colors.primary} />
                                        <Text style={styles.contactButtonText}>Email</Text>
                                    </TouchableOpacity>
                                )}
                                {place.contactInfo?.website && (
                                    <TouchableOpacity style={styles.contactButton} onPress={handleWebsite}>
                                        <Ionicons name="globe" size={20} color={theme.colors.primary} />
                                        <Text style={styles.contactButtonText}>Website</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </>
                    )}

                    {/* Get Directions Button */}
                    <TouchableOpacity style={styles.directionButton} onPress={openMaps}>
                        <Ionicons name="navigate" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.directionButtonText}>Get Directions</Text>
                    </TouchableOpacity>

                    {/* Reviews Section */}
                    <View style={styles.reviewsSection}>
                        <View style={styles.reviewsHeader}>
                            <Text style={styles.sectionHeader}>Reviews ({reviews.length})</Text>
                            <TouchableOpacity
                                style={styles.writeReviewButton}
                                onPress={() => setShowReviewModal(true)}
                            >
                                <Ionicons name="create-outline" size={18} color={theme.colors.primary} />
                                <Text style={styles.writeReviewText}>Write Review</Text>
                            </TouchableOpacity>
                        </View>

                        {loadingReviews ? (
                            <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 20 }} />
                        ) : reviews.length > 0 ? (
                            reviews.map((review) => (
                                <ReviewCard
                                    key={review._id}
                                    review={review}
                                    onHelpful={handleMarkHelpful}
                                />
                            ))
                        ) : (
                            <View style={styles.noReviews}>
                                <Ionicons name="chatbubbles-outline" size={48} color={theme.colors.text.tertiary} />
                                <Text style={styles.noReviewsText}>No reviews yet</Text>
                                <Text style={styles.noReviewsSubtext}>Be the first to review this place!</Text>
                            </View>
                        )}
                    </View>
                </View>

            </ScrollView>

            {/* Review Modal */}
            <ReviewModal
                visible={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                placeId={place._id || place.id}
                placeName={place.name}
                userId={userId}
                userName={userName}
                onReviewSubmitted={handleReviewSubmitted}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface },
    scrollContent: { paddingBottom: 40 },

    headerButtons: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    closeButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageContainer: {
        width: '100%',
        height: 250,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    tagBadge: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    tagText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
    ecoBadge: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: theme.colors.success,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ecoText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

    content: {
        padding: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        marginTop: -20,
        backgroundColor: theme.colors.surface,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: 8
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    location: {
        fontSize: 16,
        color: theme.colors.text.secondary,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 6,
    },
    ratingText: {
        fontSize: 15,
        color: theme.colors.text.primary,
        fontWeight: '600',
    },

    infoGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    infoCard: {
        flex: 1,
        backgroundColor: theme.colors.surfaceVariant,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        marginBottom: 4,
        textAlign: 'center',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        textAlign: 'center',
    },

    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: 12,
        marginTop: 8,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: theme.colors.text.secondary,
        marginBottom: 24
    },

    contactButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    contactButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surface,
        borderWidth: 1.5,
        borderColor: theme.colors.primary,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
    },
    contactButtonText: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },

    directionButton: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 24,
        ...theme.shadows.elevated,
    },
    directionButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },

    reviewsSection: {
        marginTop: 8,
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    writeReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: theme.colors.primary + '15',
        borderRadius: 8,
    },
    writeReviewText: {
        color: theme.colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    noReviews: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noReviewsText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginTop: 12,
    },
    noReviewsSubtext: {
        fontSize: 14,
        color: theme.colors.text.tertiary,
        marginTop: 4,
    },
});

