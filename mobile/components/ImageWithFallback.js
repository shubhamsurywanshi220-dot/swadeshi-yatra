import React, { useState } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import api from '../utils/api'; // Import API helper

export default function ImageWithFallback({ source, style, resizeMode = 'cover', iconName = 'image-outline' }) {
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(true);

    // Handle relative URLs (self-hosted images)
    let finalSource = source;
    if (source && typeof source.uri === 'string' && source.uri.startsWith('/')) {
        // Remove '/api' from the end of the baseURL if present, then append the image path
        const baseUrl = api.defaults.baseURL.replace(/\/api\/?$/, '');
        finalSource = { uri: `${baseUrl}${source.uri}` };
    }

    if (hasError || !finalSource || !finalSource.uri) {
        return (
            <View style={[style, styles.placeholder]}>
                <Ionicons name={iconName} size={40} color={theme.colors.text.tertiary} />
            </View>
        );
    }

    return (
        <View style={[style, { overflow: 'hidden' }]}>
            {/* Main Image */}
            <Image
                source={finalSource}
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
