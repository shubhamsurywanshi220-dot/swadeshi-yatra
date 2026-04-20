import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import ImageWithFallback from '../components/ImageWithFallback';

const { width } = Dimensions.get('window');

export default function DestinationAboutScreen({ route, navigation }) {
    const { place } = route.params;
    const { theme, isDarkMode } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme, isDarkMode);

    // Fallback/Dynamic Template Data
    const info = place.detailedInfo || {
        introduction: place.description,
        keyFacts: [
            `Location: ${place.location}`,
            `Category: ${place.category}`,
            `Rating: ${place.averageRating || place.rating} / 5`,
            `Best Time: ${place.bestTime || 'Year Round'}`,
            `Entry Fee: ${place.entryFee || 'Free'}`
        ],
        history: `Historical records for ${place.name} highlight its significance in the ${place.state} region. This destination has long been a center for cultural activities and local heritage preservation.`,
        architecture: `The architectural style of ${place.name} reflects the traditional craftsmanship of the region, featuring unique elements specific to ${place.category} structures.`,
        significance: `${place.name} serves as a vital landmark for the local community and stands as a testament to India's diverse and rich cultural tapestry.`,
        visitingInfo: `Visitors are advised to plan their trip during ${place.bestTime || 'the cooler months'} for the best experience. Local guides are available for a deeper understanding of the site.`,
        additionalImages: [place.imageUrl]
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{place.name}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Hero Image Single Frame */}
                <View style={styles.heroImageContainer}>
                    <ImageWithFallback source={{ uri: place.imageUrl }} style={styles.heroImage} />
                </View>

                <View style={styles.contentSection}>
                    <Text style={styles.placeTitle}>{place.name}</Text>
                    <Text style={styles.introduction}>{info.introduction}</Text>

                    {/* Key Facts Section */}
                    <Text style={styles.sectionHeader}>Key facts</Text>
                    {info.keyFacts.map((fact, index) => (
                        <View key={index} style={styles.factRow}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.factText}>{fact}</Text>
                        </View>
                    ))}

                    {/* Historical Background */}
                    {(info.history || info.history !== '') && (
                        <>
                            <Text style={styles.sectionHeader}>Historical background</Text>
                            <Text style={styles.bodyText}>{info.history}</Text>
                        </>
                    )}

                    {/* Architecture and Art / Natural Features */}
                    {(info.architecture || info.naturalFeatures) && (
                        <>
                            <Text style={styles.sectionHeader}>{info.naturalFeatures ? 'Natural features' : 'Architecture and art'}</Text>
                            {info.additionalImages && info.additionalImages.length > 0 && (
                                <ImageWithFallback source={{ uri: info.additionalImages[1] || info.additionalImages[0] }} style={styles.artImage} />
                            )}
                            <Text style={[styles.bodyText, { marginTop: 12 }]}>{info.naturalFeatures || info.architecture}</Text>
                        </>
                    )}

                    {/* Significance (Cultural/Artistic/Nature) */}
                    {(info.significance || info.culturalSignificance) && (
                        <>
                            <Text style={styles.sectionHeader}>Significance</Text>
                            <Text style={styles.bodyText}>{info.culturalSignificance || info.significance}</Text>
                        </>
                    )}

                    {/* Interesting Facts */}
                    {info.interestingFacts && (
                        <>
                            <Text style={styles.sectionHeader}>Interesting facts</Text>
                            <Text style={styles.bodyText}>{info.interestingFacts}</Text>
                        </>
                    )}

                    {/* Visiting Information */}
                    <Text style={styles.sectionHeader}>Visiting information</Text>
                    <Text style={styles.bodyText}>{info.visitingInfo}</Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function createStyles(theme, isDarkMode) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 90,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 40,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 10,
        },
        backButton: {
            marginRight: 16,
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#FFF',
            flex: 1,
        },
        scrollContent: {
            paddingBottom: 30,
        },
        heroImageContainer: {
            height: 300,
            width: '100%',
        },
        heroImage: {
            width: '100%',
            height: '100%',
        },
        contentSection: {
            padding: 20,
        },
        placeTitle: {
            fontSize: 26,
            fontWeight: 'bold',
            color: theme.colors.text.primary,
            marginBottom: 16,
        },
        introduction: {
            fontSize: 15,
            lineHeight: 22,
            color: theme.colors.text.secondary,
            marginBottom: 24,
        },
        sectionHeader: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text.primary,
            marginTop: 20,
            marginBottom: 12,
        },
        factRow: {
            flexDirection: 'row',
            marginBottom: 6,
            paddingLeft: 10,
        },
        bullet: {
            fontSize: 16,
            color: theme.colors.text.primary,
            marginRight: 8,
        },
        factText: {
            fontSize: 14,
            color: theme.colors.text.secondary,
            flex: 1,
        },
        bodyText: {
            fontSize: 15,
            lineHeight: 22,
            color: theme.colors.text.secondary,
        },
        artImageRow: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 8,
        },
        artImage: {
            width: '100%',
            height: 200,
            borderRadius: 16,
        },
        artTextContainer: {
            flex: 1,
        },
    });
}
