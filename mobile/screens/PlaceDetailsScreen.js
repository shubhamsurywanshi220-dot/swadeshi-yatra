import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert, Dimensions, ActivityIndicator, StatusBar, Platform, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { FavoritesManager } from '../utils/favoritesManager';
import { checkConnectivity } from '../utils/network';
import ReviewModal from '../components/ReviewModal';
import ReviewCard from '../components/ReviewCard';
import ImageWithFallback from '../components/ImageWithFallback';

const { width } = Dimensions.get('window');

// ── Animated Entry Fee card ──────────────────────────────────────────────────
function EntryFeeCard({ entryFee, theme, onPress }) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () =>
        Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 30 }).start();

    const handlePressOut = () =>
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();

    return (
        <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={0.85}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View
                style={[
                    {
                        flex: 1,
                        backgroundColor: theme.colors.surface,
                        padding: 16,
                        borderRadius: 12,
                        borderWidth: 1.5,
                        borderColor: theme.colors.primary,
                        alignItems: 'center',
                        transform: [{ scale }],
                    }
                ]}
            >
                <MaterialCommunityIcons name="ticket-outline" size={24} color={theme.colors.primary} style={{ marginBottom: 4 }} />
                <Text style={{ fontSize: 11, color: theme.colors.text.secondary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Entry Fee</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.text.primary, textAlign: 'center' }}>{entryFee}</Text>
                <Text style={{ fontSize: 10, color: theme.colors.primary, marginTop: 5, fontWeight: '600' }}>Tap to Book Ticket</Text>
            </Animated.View>
        </TouchableOpacity>
    );
}
// ────────────────────────────────────────────────────────────────────────────

export default function PlaceDetailsScreen({ route, navigation }) {
    const { theme, isDarkMode } = useTheme();
    const { place } = route.params;

    const styles = createStyles(theme, isDarkMode);

    // State
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userData, setUserData] = useState({ id: null, name: 'Traveler' });
    const [loadingDirections, setLoadingDirections] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const mapRef = useRef(null);
    const directionScale = useRef(new Animated.Value(1)).current;

    // Destination coordinates
    const destLat = place.coordinates?.latitude;
    const destLng = place.coordinates?.longitude;
    const hasDestCoords = destLat != null && destLng != null;

    // Fallback data
    const bestTime = place.bestTime || "Oct to Mar";
    const entryFee = place.entryFee || "₹35 (Ind), ₹500 (For)";
    const tag = place.category || "Heritage";
    const isDestination = !['Artisan', 'Guide', 'Hotel', 'Restaurant', 'Shop', 'Transport'].includes(place.category);

    useEffect(() => {
        loadUserData();
        fetchReviews();
        checkIfFavorite();
        fetchUserLocation();
    }, [place]);


    const loadUserData = async () => {
        const id = await AsyncStorage.getItem('@user_id');
        const name = await AsyncStorage.getItem('@user_name');
        if (id) {
            setUserData({ id, name: name || 'Traveler' });
        }
    };

    // ── Fetch user location with high accuracy ───────────────────────────────
    const fetchUserLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationError('Location permission denied. Please enable it in Settings.');
                return;
            }

            // Check if location services are enabled on the device
            const enabled = await Location.hasServicesEnabledAsync();
            if (!enabled) {
                setLocationError('Please enable location services to get accurate directions.');
                Alert.alert(
                    'Location Disabled',
                    'Please enable location services to get accurate directions.',
                    [{ text: 'OK' }]
                );
                return;
            }

            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            // Check accuracy – if > 100 m, warn user
            if (loc.coords.accuracy && loc.coords.accuracy > 100) {
                Alert.alert(
                    'Low Accuracy',
                    'Your location accuracy is low. Please enable High Accuracy Location Mode in your device settings for better results.',
                    [{ text: 'OK' }]
                );
            }

            setUserLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });
            setLocationError(null);

            // Fit map to show both markers
            if (hasDestCoords && mapRef.current) {
                setTimeout(() => {
                    mapRef.current?.fitToCoordinates(
                        [
                            { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
                            { latitude: destLat, longitude: destLng },
                        ],
                        { edgePadding: { top: 60, right: 60, bottom: 60, left: 60 }, animated: true }
                    );
                }, 500);
            }
        } catch (err) {
            console.error('Location error:', err);
            setLocationError('Could not get your location. Please try again.');
        }
    };



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



    const openMaps = async () => {
        const isOnline = await checkConnectivity();
        if (!isOnline) {
            Alert.alert('Offline', 'Please connect to the internet to use maps and navigation.');
            return;
        }

        // Check if location services are enabled
        const enabled = await Location.hasServicesEnabledAsync();
        if (!enabled) {
            Alert.alert(
                'Location Disabled',
                'Please enable location services to get accurate directions.',
                [{ text: 'OK' }]
            );
            return;
        }

        // Show loading indicator for 1 second
        setLoadingDirections(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoadingDirections(false);

        // Always prefer coordinates
        if (!hasDestCoords) {
            // Fallback to place name search
            const destination = `${place.name} ${place.location}`;
            const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
            Linking.openURL(browserUrl).catch(err => {
                console.error('Error opening maps:', err);
                Alert.alert('Error', 'Could not open Google Maps. Please install it or try again.');
            });
            return;
        }

        if (Platform.OS === 'android') {
            // Try Google Maps navigation intent first (uses lat,lng)
            const gmapsNavUri = `google.navigation:q=${destLat},${destLng}`;
            const canOpen = await Linking.canOpenURL(gmapsNavUri);
            if (canOpen) {
                Linking.openURL(gmapsNavUri);
                return;
            }
        } else if (Platform.OS === 'ios') {
            const appleMapsUrl = `maps://?daddr=${destLat},${destLng}&dirflg=d`;
            const canOpen = await Linking.canOpenURL(appleMapsUrl);
            if (canOpen) {
                Linking.openURL(appleMapsUrl);
                return;
            }
        }

        // Fallback: open Google Maps in browser with exact coordinates
        const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
        Linking.openURL(browserUrl).catch(err => {
            console.error('Error opening maps:', err);
            Alert.alert('Error', 'Could not open Google Maps. Please install it or try again.');
        });
    };

    const handleDirectionPressIn = () =>
        Animated.spring(directionScale, { toValue: 0.93, useNativeDriver: true, speed: 30 }).start();

    const handleDirectionPressOut = () =>
        Animated.spring(directionScale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();

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

    const handleWebsite = async () => {
        const isOnline = await checkConnectivity();
        if (!isOnline) {
            Alert.alert(t('common.offline'), "Please connect to the internet to open this page.");
            return;
        }
        if (place.contactInfo?.website) {
            Linking.openURL(place.contactInfo.website);
        } else {
            Alert.alert('Info', 'Website not available');
        }
    };

    const searchNearby = async (queryType) => {
        const isOnline = await checkConnectivity();
        if (!isOnline) {
            Alert.alert(t('common.offline'), "Internet connection required to search locations.");
            return;
        }
        const query = `${queryType} near ${place.name} ${place.location}`;

        const url = Platform.select({
            android: `geo:0,0?q=${encodeURIComponent(query)}`,
            ios: `maps:0,0?q=${encodeURIComponent(query)}`,
            default: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
        });

        Linking.openURL(url).catch(err => {
            console.error('Error searching nearby:', err);
            Alert.alert("Error", "Could not open a Map application.");
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header Buttons */}
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
                            <Ionicons
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={24}
                                color={isFavorite ? theme.colors.error : "#FFF"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Hero Image */}
                <View style={styles.imageContainer}>
                    <ImageWithFallback source={{ uri: place.imageUrl }} style={styles.image} resizeMode="cover" />
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
                    {(place.averageRating > 0 || place.rating > 0) && (
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={18} color={isDarkMode ? '#FFD700' : theme.colors.accent} />
                            <Text style={styles.ratingText}>
                                {((place.averageRating || place.rating)).toFixed(1)} {place.reviewCount > 0 ? `(${place.reviewCount} ${place.reviewCount === 1 ? 'review' : 'reviews'})` : ''}
                            </Text>
                        </View>
                    )}

                    {/* Info Grid (Season & Price) - ONLY for Destinations */}
                    {isDestination && (
                        <View style={styles.infoGrid}>
                            <View style={styles.infoCard}>
                                <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} style={{ marginBottom: 4 }} />
                                <Text style={styles.infoLabel}>Best Time to Visit</Text>
                                <Text style={styles.infoValue}>{bestTime}</Text>
                            </View>
                            <EntryFeeCard
                                entryFee={entryFee}
                                theme={theme}
                                onPress={() => navigation.navigate('Booking', { placeId: place._id || place.id, placeName: place.name, entryFee: place.entryFee })}
                            />
                        </View>
                    )}

                    {/* Category specific layout for businesses if not already covered */}
                    {!isDestination && (
                        <View style={{ marginBottom: 16 }}>
                             {/* Category and Rating are already shown above or handled by tagBadge */}
                        </View>
                    )}

                    {/* About Section */}
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionHeader}>About</Text>
                        {isDestination && (
                            <TouchableOpacity onPress={() => navigation.navigate('DestinationAbout', { place })}>
                                <Text style={styles.readMoreText}>Read More</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.description} numberOfLines={isDestination ? 3 : 0}>
                        {place.description}
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



                    {/* ── Map Section ─────────────────────────────────── */}
                    {hasDestCoords && (
                        <View style={styles.mapSection}>
                            <Text style={styles.sectionHeader}>Location on Map</Text>
                            <View style={styles.mapContainer}>
                                <MapView
                                    ref={mapRef}
                                    style={styles.map}
                                    initialRegion={{
                                        latitude: destLat,
                                        longitude: destLng,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}
                                    showsUserLocation={false}
                                    showsMyLocationButton={false}
                                >
                                    {/* Destination Marker */}
                                    <Marker
                                        coordinate={{ latitude: destLat, longitude: destLng }}
                                        title={place.name}
                                        description={place.location}
                                        pinColor="#E53935"
                                    />
                                    {/* User Location Marker */}
                                    {userLocation && (
                                        <Marker
                                            coordinate={userLocation}
                                            title="You are here"
                                            description="Your current location"
                                            pinColor="#1E88E5"
                                        />
                                    )}
                                </MapView>
                            </View>
                            {locationError && (
                                <View style={styles.locationErrorBanner}>
                                    <Ionicons name="warning" size={16} color="#FF6F00" />
                                    <Text style={styles.locationErrorText}>{locationError}</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Get Directions */}
                    <View style={{ marginBottom: 24 }}>
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={openMaps}
                            onPressIn={handleDirectionPressIn}
                            onPressOut={handleDirectionPressOut}
                            disabled={loadingDirections}
                        >
                            <Animated.View style={[styles.directionButton, { transform: [{ scale: directionScale }] }]}>
                                {loadingDirections ? (
                                    <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
                                ) : (
                                    <Ionicons name="navigate" size={20} color="#FFF" style={{ marginRight: 8 }} />
                                )}
                                <Text style={styles.directionButtonText}>
                                    {loadingDirections ? 'Opening Maps...' : 'Directions'}
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </View>

                    {/* Cultural Vault Entry */}
                    {isDestination && (
                        <TouchableOpacity
                            style={styles.cultureBanner}
                            onPress={() => navigation.navigate('Culture', { placeId: place._id || place.id, placeName: place.name })}
                        >
                            <View style={styles.cultureBannerIcon}>
                                <MaterialCommunityIcons name="feather" size={24} color="#FFF" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.cultureBannerTitle}>Cultural Vault</Text>
                                <Text style={styles.cultureBannerText}>Discover myths, stories & folklore</Text>
                            </View>
                            <Ionicons name="sparkles" size={20} color={isDarkMode ? '#FFD700' : theme.colors.accent} />
                        </TouchableOpacity>
                    )}

                    {/* Explore Surroundings - Deep Links for EVERY Place */}
                    <View style={styles.exploreNearbySection}>
                        <Text style={styles.sectionHeader}>Explore Surroundings</Text>
                        <Text style={styles.exploreNearbySub}>Find essentials near {place.name}</Text>
                        <View style={styles.nearbyGrid}>
                            <TouchableOpacity style={styles.nearbyItem} onPress={() => searchNearby('Hotels')}>
                                <View style={[styles.nearbyIconBg, { backgroundColor: isDarkMode ? '#1B2E1C' : '#E8F5E9' }]}>
                                    <Ionicons name="bed" size={22} color={isDarkMode ? '#81C784' : '#2E7D32'} />
                                </View>
                                <Text style={styles.nearbyLabel}>Stay</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.nearbyItem} onPress={() => searchNearby('Restaurants')}>
                                <View style={[styles.nearbyIconBg, { backgroundColor: isDarkMode ? '#3E2723' : '#FFF3E0' }]}>
                                    <Ionicons name="restaurant" size={22} color={isDarkMode ? '#FFB74D' : '#EF6C00'} />
                                </View>
                                <Text style={styles.nearbyLabel}>Food</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.nearbyItem} onPress={() => searchNearby('Bus Stops')}>
                                <View style={[styles.nearbyIconBg, { backgroundColor: isDarkMode ? '#0D47A1' : '#E1F5FE' }]}>
                                    <Ionicons name="bus" size={22} color={isDarkMode ? '#64B5F6' : '#0277BD'} />
                                </View>
                                <Text style={styles.nearbyLabel}>Transport</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.nearbyItem} onPress={() => searchNearby('ATM')}>
                                <View style={[styles.nearbyIconBg, { backgroundColor: isDarkMode ? '#311B92' : '#F3E5F5' }]}>
                                    <Ionicons name="card-outline" size={22} color={isDarkMode ? '#BA68C8' : '#7B1FA2'} />
                                </View>
                                <Text style={styles.nearbyLabel}>ATM</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

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
                userId={userData.id || 'user_dynamic_placeholder'}
                userName={userData.name}
                onReviewSubmitted={handleReviewSubmitted}
            />
        </SafeAreaView>
    );
}

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingBottom: 40 },

    headerButtons: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    closeButton: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteButton: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    imageContainer: {
        width: '100%',
        height: 300,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    tagBadge: {
        position: 'absolute',
        top: 100,
        left: 20,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    tagText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
    ecoBadge: {
        position: 'absolute',
        bottom: 40,
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
        padding: 24,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -32,
        backgroundColor: theme.colors.background,
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
        backgroundColor: theme.colors.surface,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        ...theme.shadows.soft,
    },
    infoLabel: {
        fontSize: 11,
        color: theme.colors.text.secondary,
        marginBottom: 4,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        textAlign: 'center',
    },

    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    readMoreText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
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
        ...theme.shadows.soft,
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

    // Map styles
    mapSection: {
        marginBottom: 24,
    },
    mapContainer: {
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.soft,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    locationErrorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#3E2723' : '#FFF3E0',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
        gap: 8,
    },
    locationErrorText: {
        color: isDarkMode ? '#FFB74D' : '#E65100',
        fontSize: 12,
        flex: 1,
    },


    // Explore Nearby
    exploreNearbySection: {
        marginBottom: 30,
        backgroundColor: theme.colors.surface,
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.soft,
    },
    exploreNearbySub: {
        fontSize: 13,
        color: theme.colors.text.tertiary,
        marginTop: -8,
        marginBottom: 20,
    },
    nearbyGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nearbyItem: {
        alignItems: 'center',
        flex: 1,
    },
    nearbyIconBg: {
        width: 54,
        height: 54,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    nearbyLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },

    // Reviews Section
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
    cultureBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundLinearGradient: ['#4A148C', '#7B1FA2'], // Note: using solid for now if gradient not installed
        backgroundColor: isDarkMode ? '#2D004D' : '#4A148C',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        ...theme.shadows.elevated,
    },
    cultureBannerIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cultureBannerTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cultureBannerText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
});

