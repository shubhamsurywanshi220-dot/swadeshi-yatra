import React, { useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import api from '../utils/api'; // Import API helper
const DEFAULT_IMAGE_URL = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

const CATEGORY_FALLBACKS = {
    'Pilgrimage': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Yamunotri_Temple_in_winter.jpg/1200px-Yamunotri_Temple_in_winter.jpg',
    'Adventure': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rohtang_Pass_Highway.jpg/1200px-Rohtang_Pass_Highway.jpg',
    'Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Vagator_Beach_Goa.jpg/1200px-Vagator_Beach_Goa.jpg',
    'Nature': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Coffee_Plantation_in_Coorg.jpg/1200px-Coffee_Plantation_in_Coorg.jpg',
    'Heritage': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Basilica_of_Bom_Jesus_Goa.jpg/1200px-Basilica_of_Bom_Jesus_Goa.jpg',
};

export default function ImageWithFallback({ source, style, resizeMode = 'cover', iconName = 'image-outline', category }) {
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(true);

    // Handle relative URLs (self-hosted images)
    let finalSource = source;
    if (source && typeof source.uri === 'string' && source.uri.startsWith('/')) {
        // Remove '/api' from the end of the baseURL if present, then append the image path
        const baseUrl = api.defaults.baseURL.replace(/\/api\/?$/, '');
        finalSource = { uri: `${baseUrl}${source.uri}` };
    }

    // Get fallback URL based on category
    const fallbackUrl = (category && CATEGORY_FALLBACKS[category]) || DEFAULT_IMAGE_URL;

    // If there is an error or no source, use the default/category image asset
    const imageSource = (hasError || !finalSource || !finalSource.uri) ? { uri: fallbackUrl } : finalSource;

    return (
        <View style={[style, { overflow: 'hidden' }]}>
            {/* Main Image */}
            <Image
                source={imageSource}
                style={[StyleSheet.absoluteFill]}
                resizeMode={resizeMode}
                onError={() => {
                    setHasError(true);
                    setLoading(false);
                }}
                onLoadEnd={() => setLoading(false)}
            />

            {/* Loading Indicator */}
            {loading && (
                <View style={[StyleSheet.absoluteFill, styles.center]}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    placeholder: {
        backgroundColor: theme.colors.surfaceVariant, // Light gray
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(238, 238, 238, 0.4)' // Subtle overlay while loading
    }
});
