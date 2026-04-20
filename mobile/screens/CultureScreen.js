import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import ImageWithFallback from '../components/ImageWithFallback';
import { useTranslation } from 'react-i18next';

export default function CultureScreen({ route, navigation }) {
    const { placeId, placeName } = route.params;
    const { theme, isDarkMode } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme, isDarkMode);

    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            // First, if we have culturalVault data from the place object, add them as "stories"
            let vaultStories = [];
            if (route.params.culturalVault) {
                const vault = route.params.culturalVault;
                if (vault.history) vaultStories.push({ _id: 'v1', title: 'Historical Chronicles', content: vault.history, category: 'Tradition', contributorName: 'Official Registry' });
                if (vault.myths) vaultStories.push({ _id: 'v2', title: 'Myths & Legends', content: vault.myths, category: 'Myth', contributorName: 'Local Folklore' });
                if (vault.stories) vaultStories.push({ _id: 'v3', title: 'Local Narratives', content: vault.stories, category: 'Story', contributorName: 'Community' });
            }

            const response = await api.get(`/culture/${placeId}`);
            setStories([...vaultStories, ...response.data]);
        } catch (error) {
            console.error('Error fetching stories:', error);
            // Even if API fails, show vault stories if we have them
            if (route.params.culturalVault) {
                 const vault = route.params.culturalVault;
                 const vaultStories = [];
                 if (vault.history) vaultStories.push({ _id: 'v1', title: 'Historical Chronicles', content: vault.history, category: 'Tradition', contributorName: 'Official Registry' });
                 if (vault.myths) vaultStories.push({ _id: 'v2', title: 'Myths & Legends', content: vault.myths, category: 'Myth', contributorName: 'Local Folklore' });
                 if (vault.stories) vaultStories.push({ _id: 'v3', title: 'Local Narratives', content: vault.stories, category: 'Story', contributorName: 'Community' });
                 setStories(vaultStories);
            }
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.storyCard}
            onPress={() => navigation.navigate('StoryReader', { story: item })}
        >
            <View style={styles.storyHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                {item.audioUrl && <Ionicons name="volume-medium" size={18} color={theme.colors.primary} />}
            </View>
            <Text style={styles.storyTitle}>{item.title}</Text>
            <Text style={styles.storySnippet} numberOfLines={3}>{item.content}</Text>
            <View style={styles.storyFooter}>
                <Text style={styles.contributor}>Contributed by {item.contributorName}</Text>
                <Text style={styles.readMore}>{t('culture.tap_open')}</Text>
            </View>
        </TouchableOpacity>
    );

    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'Myth': return '#D32F2F';
            case 'Story': return '#1976D2';
            case 'Tradition': return '#388E3C';
            default: return '#7B1FA2';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>{t('culture.vault')}</Text>
                    <Text style={styles.subtitle}>{placeName}</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : stories.length === 0 ? (
                <View style={styles.center}>
                    <MaterialCommunityIcons name="feather" size={64} color={theme.colors.text.tertiary} />
                    <Text style={styles.emptyText}>{t('culture.no_stories')}</Text>
                    <Text style={styles.emptySub}>{t('culture.contribute')}</Text>
                </View>
            ) : (
                <FlatList
                    data={stories}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.list}
                />
            )}
        </SafeAreaView>
    );
}

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    backButton: { padding: 4 },
    title: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text.primary },
    subtitle: { fontSize: 13, color: theme.colors.text.secondary },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    list: { padding: 16 },
    storyCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        ...theme.shadows.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    storyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    categoryText: { color: 'white', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    storyTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 8 },
    storySnippet: { fontSize: 14, color: theme.colors.text.secondary, lineHeight: 22 },
    storyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.border },
    contributor: { fontSize: 11, color: theme.colors.text.tertiary, fontStyle: 'italic' },
    readMore: { fontSize: 13, fontWeight: 'bold', color: theme.colors.primary },
    emptyText: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text.primary, marginTop: 20, textAlign: 'center' },
    emptySub: { fontSize: 14, color: theme.colors.text.secondary, textAlign: 'center', marginTop: 8 },
});
