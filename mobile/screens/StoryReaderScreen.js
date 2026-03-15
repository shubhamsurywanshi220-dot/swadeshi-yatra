import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ImageWithFallback from '../components/ImageWithFallback';
import { useTranslation } from 'react-i18next';

export default function StoryReaderScreen({ route, navigation }) {
    const { story } = route.params;
    const { theme, isDarkMode } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme, isDarkMode);

    const [isPlaying, setIsPlaying] = useState(false);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this amazing story from Swadeshi Yatra: ${story.title}\n\n${story.content.substring(0, 100)}...`,
            });
        } catch (error) {
            console.error('Error sharing story:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <ScrollView contentContainerStyle={styles.scroll}>

                {/* Hero Section */}
                <View style={styles.hero}>
                    <ImageWithFallback source={{ uri: story.imageUrl }} style={styles.image} />
                    <View style={styles.overlay} />
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                        <Ionicons name="share-social-outline" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <View style={styles.heroContent}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{story.category}</Text>
                        </View>
                        <Text style={styles.title}>{story.title}</Text>
                        <Text style={styles.contributor}>Narrated by {story.contributorName}</Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                    {story.audioUrl && (
                        <TouchableOpacity
                            style={styles.audioPlayer}
                            onPress={() => setIsPlaying(!isPlaying)}
                        >
                            <View style={styles.playButton}>
                                <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#FFF" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.audioTitle}>{t('story.audio_narration')}</Text>
                                <Text style={styles.audioStatus}>{isPlaying ? t('story.playing') : t('story.listen')}</Text>
                            </View>
                            <MaterialCommunityIcons name="waveform" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    )}

                    <Text style={styles.storyContent}>{story.content}</Text>

                    {/* Simulated AR Interaction */}
                    <View style={styles.arSection}>
                        <Ionicons name="scan-outline" size={30} color={theme.colors.primary} />
                        <View style={{ flex: 1, marginLeft: 15 }}>
                            <Text style={styles.arTitle}>{t('story.visualize')}</Text>
                            <Text style={styles.arText}>{t('story.ar_desc')}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scroll: { paddingBottom: 40 },
    hero: { height: 350, position: 'relative' },
    image: { width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 25 },
    shareButton: { position: 'absolute', top: 50, right: 20, zIndex: 10, backgroundColor: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 25 },
    heroContent: { position: 'absolute', bottom: 30, left: 24, right: 24 },
    categoryBadge: { backgroundColor: theme.colors.primary, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 12 },
    categoryText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
    title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 4 },
    contributor: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' },
    contentContainer: { padding: 24, backgroundColor: theme.colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -30 },
    audioPlayer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 15, borderRadius: 20, marginBottom: 24, ...theme.shadows.soft, borderWidth: 1, borderColor: theme.colors.border },
    playButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    audioTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text.primary },
    audioStatus: { fontSize: 12, color: theme.colors.text.secondary },
    storyContent: { fontSize: 17, lineHeight: 28, color: theme.colors.text.primary, marginBottom: 30, letterSpacing: 0.3 },
    arSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.primary + '10', padding: 20, borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: theme.colors.primary },
    arTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.primary },
    arText: { fontSize: 13, color: theme.colors.text.secondary, marginTop: 4 },
});
