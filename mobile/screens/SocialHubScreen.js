import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    StatusBar,
    Dimensions,
    TextInput,
    Modal,
    ActivityIndicator,
    Animated,
    Alert,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import * as ImagePicker from 'expo-image-picker';
import io from 'socket.io-client';
import { BASE_URL } from '../utils/api';

const { width, height } = Dimensions.get('window');

const CATEGORIES = ['All', 'Trending', 'Nature', 'Heritage', 'Adventure'];

// ── Format large numbers
const formatCount = (n) => {
    if (!n) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
};

// ── Format relative time
const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return 'Yesterday';
    return `${d}d ago`;
};

// ──────────────────────────────────────────────────────────────
// ── Video Player Modal (Native HTML5 video via WebView substitute)
// For Expo Go without expo-av, we use a full-screen thumbnail + link info
// The video_url is embedded and will play when expo-av is installed
// ──────────────────────────────────────────────────────────────
function PlayerModal({ vlog, onClose, onLike, onSave, theme, isDarkMode }) {
    if (!vlog) return null;
    const bg = isDarkMode ? '#0D1117' : '#000000';

    // Try to use expo-av Video if available, otherwise show thumbnail
    let VideoComponent = null;
    try {
        const { Video, ResizeMode } = require('expo-av');
        VideoComponent = { Video, ResizeMode };
    } catch (_) {
        // expo-av not installed — graceful fallback
    }

    return (
        <Modal visible={!!vlog} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
            <View style={[styles.playerContainer, { backgroundColor: bg }]}>
                <StatusBar barStyle="light-content" backgroundColor="#000" hidden />

                {VideoComponent ? (
                    // ── Native expo-av video player
                    <VideoComponent.Video
                        source={{ uri: vlog.video_url }}
                        style={styles.playerVideo}
                        useNativeControls
                        resizeMode={VideoComponent.ResizeMode.CONTAIN}
                        shouldPlay
                        isLooping
                        posterSource={{ uri: vlog.thumbnail }}
                        usePoster
                    />
                ) : (
                    // ── Fallback: high-quality thumbnail with install hint
                    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#000' }}>
                        <Image
                            source={{ uri: vlog.thumbnail }}
                            style={styles.playerImage}
                            resizeMode="contain"
                        />
                        <View style={styles.noVideoOverlay}>
                            <MaterialCommunityIcons name="video-wireless" size={32} color="#FFF" />
                            <Text style={styles.noVideoText}>Video Player</Text>
                            <Text style={styles.noVideoSub}>
                                Install expo-av for playback:{'\n'}
                                <Text style={{ color: '#64B5F6' }}>npx expo install expo-av</Text>
                            </Text>
                        </View>
                    </View>
                )}

                {/* ── Controls overlay */}
                <View style={styles.playerOverlay} pointerEvents="box-none">
                    {/* Close */}
                    <TouchableOpacity style={styles.playerClose} onPress={onClose}>
                        <Ionicons name="close" size={26} color="#FFF" />
                    </TouchableOpacity>

                    {/* Info + Actions */}
                    <View style={styles.playerBottom}>
                        {/* Info */}
                        <View style={{ flex: 1 }}>
                            <Text style={styles.playerTitle} numberOfLines={2}>{vlog.title}</Text>
                            <View style={[styles.metaRow, { marginTop: 4 }]}>
                                <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.75)" />
                                <Text style={styles.playerMeta}> {vlog.location}</Text>
                            </View>
                            <View style={[styles.metaRow, { marginTop: 3 }]}>
                                <Ionicons name="eye-outline" size={13} color="rgba(255,255,255,0.75)" />
                                <Text style={styles.playerMeta}> {formatCount(vlog.views)} views</Text>
                                <Text style={styles.playerMeta}> · by {vlog.user}</Text>
                            </View>
                        </View>

                        {/* Side action buttons */}
                        <View style={styles.playerActions}>
                            <TouchableOpacity style={styles.playerActionBtn} onPress={() => onLike && onLike(vlog._id)}>
                                <Ionicons name={vlog.liked ? 'heart' : 'heart-outline'} size={28} color={vlog.liked ? '#E53935' : '#FFF'} />
                                <Text style={styles.playerActionCount}>{formatCount(vlog.likes)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.playerActionBtn} onPress={() => onSave && onSave(vlog._id)}>
                                <Ionicons name={vlog.saved ? 'bookmark' : 'bookmark-outline'} size={26} color={vlog.saved ? '#F57C00' : '#FFF'} />
                                <Text style={styles.playerActionCount}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.playerActionBtn}
                                onPress={() => Alert.alert('Share', 'Share feature coming soon!')}>
                                <Ionicons name="share-social-outline" size={26} color="#FFF" />
                                <Text style={styles.playerActionCount}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

// ──────────────────────────────────────────────────────────────
// ── Single Vlog Card
// ──────────────────────────────────────────────────────────────
function VlogCard({ vlog, onLike, onSave, onPlay, theme, isDarkMode }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const pulse = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
        ]).start();
    };

    const cardBg = isDarkMode ? '#161B22' : '#FFFFFF';
    const subText = isDarkMode ? '#8B949E' : '#6E6E73';
    const borderColor = isDarkMode ? '#30363D' : '#E5E5EA';

    const catColor = vlog.category === 'Adventure' ? '#E53935'
        : vlog.category === 'Nature' ? '#2E7D32'
        : vlog.category === 'Heritage' ? '#1565C0'
        : '#5E35B1';

    return (
        <Animated.View style={[styles.vlogCard, { backgroundColor: cardBg, borderColor, transform: [{ scale: scaleAnim }] }]}>
            {/* Thumbnail / Play Zone */}
            <TouchableOpacity activeOpacity={0.92} onPress={() => { pulse(); onPlay(vlog); }}>
                {vlog.thumbnail ? (
                    <Image source={{ uri: vlog.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
                ) : (
                    <View style={[styles.thumbnail, { backgroundColor: '#21262D', justifyContent: 'center', alignItems: 'center' }]}>
                        <MaterialCommunityIcons name="video-wireless" size={40} color="#444" />
                    </View>
                )}

                {/* Play button overlay */}
                <View style={styles.playOverlay}>
                    <View style={styles.playButton}>
                        <Ionicons name="play" size={22} color="#FFF" />
                    </View>
                </View>

                {/* Duration */}
                {vlog.duration && (
                    <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>{vlog.duration}</Text>
                    </View>
                )}

                {/* Category */}
                <View style={[styles.categoryBadge, { backgroundColor: catColor }]}>
                    <Text style={styles.categoryText}>{vlog.category || 'General'}</Text>
                </View>
            </TouchableOpacity>

            {/* Info Row */}
            <View style={styles.cardInfo}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarLetter}>{(vlog.user || 'A').charAt(0).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.vlogTitle, { color: isDarkMode ? '#E6EDF3' : '#1C1C1E' }]} numberOfLines={2}>
                        {vlog.title}
                    </Text>
                    <View style={styles.metaRow}>
                        <Ionicons name="location-outline" size={11} color={subText} />
                        <Text style={[styles.metaText, { color: subText }]} numberOfLines={1}> {vlog.location}</Text>
                        <Text style={[styles.metaDot, { color: subText }]}> · </Text>
                        <Text style={[styles.metaText, { color: subText }]}>{timeAgo(vlog.createdAt || vlog.created_at)}</Text>
                    </View>
                    <View style={styles.metaRow}>
                        <Ionicons name="eye-outline" size={11} color={subText} />
                        <Text style={[styles.metaText, { color: subText }]}> {formatCount(vlog.views)}</Text>
                        <Text style={[styles.metaDot, { color: subText }]}> · </Text>
                        <Text style={[styles.metaText, { color: subText }]}>by {vlog.user}</Text>
                    </View>
                </View>
            </View>

            {/* Action Row */}
            <View style={[styles.actionRow, { borderTopColor: borderColor }]}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => onLike(vlog._id)}>
                    <Ionicons name={vlog.liked ? 'heart' : 'heart-outline'} size={20}
                        color={vlog.liked ? '#E53935' : subText} />
                    <Text style={[styles.actionCount, { color: vlog.liked ? '#E53935' : subText }]}>
                        {formatCount(vlog.likes)}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}
                    onPress={() => Alert.alert('Comments', 'Comment section coming soon!')}>
                    <Ionicons name="chatbubble-outline" size={20} color={subText} />
                    <Text style={[styles.actionCount, { color: subText }]}>Comment</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}
                    onPress={() => Alert.alert('Share', 'Share feature coming soon!')}>
                    <Ionicons name="share-social-outline" size={20} color={subText} />
                    <Text style={[styles.actionCount, { color: subText }]}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => onSave(vlog._id)}>
                    <Ionicons name={vlog.saved ? 'bookmark' : 'bookmark-outline'} size={20}
                        color={vlog.saved ? '#F57C00' : subText} />
                    <Text style={[styles.actionCount, { color: vlog.saved ? '#F57C00' : subText }]}>Save</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

// ──────────────────────────────────────────────────────────────
// ── Upload Modal
// ──────────────────────────────────────────────────────────────
function UploadModal({ visible, onClose, theme, isDarkMode }) {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');
    const [videoFile, setVideoFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const bg = isDarkMode ? '#161B22' : '#FFFFFF';
    const inputBg = isDarkMode ? '#21262D' : '#F2F2F7';
    const textColor = isDarkMode ? '#E6EDF3' : '#1C1C1E';
    const placeholderColor = isDarkMode ? '#6E7681' : '#8E8E93';
    const borderColor = isDarkMode ? '#30363D' : '#E5E5EA';

    const CATS = ['Nature', 'Heritage', 'Adventure', 'Food', 'Culture', 'General'];

    const pickVideo = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need access to your library to upload videos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const video = result.assets[0];
            // Basic size check (approx 100MB)
            if (video.fileSize > 100 * 1024 * 1024) {
                Alert.alert('File too large', 'Please select a video smaller than 100MB.');
                return;
            }
            setVideoFile(video);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !location.trim()) {
            Alert.alert('Required', 'Please add a title and location.');
            return;
        }
        if (!videoFile) {
            Alert.alert('Required', 'Please select a video to upload.');
            return;
        }

        setSubmitting(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('location', location.trim());
            formData.append('description', description.trim());
            formData.append('category', category);
            
            const uri = videoFile.uri;
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `video/${match[1]}` : `video/mp4`;

            formData.append('video', {
                uri,
                name: filename,
                type
            });

            const response = await api.post('/vlogs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            Alert.alert(
                '🎉 Success!',
                'Your vlog has been uploaded and is now live!',
                [{ text: 'Great!', onPress: () => {
                    setTitle(''); setLocation(''); setDescription(''); setCategory('General'); setVideoFile(null);
                    onClose();
                }}]
            );
        } catch (err) {
            const msg = err.response?.data?.msg || 'Upload failed. Please check your connection.';
            Alert.alert('Error', msg);
        } finally {
            setSubmitting(false);
            setUploadProgress(0);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={[styles.modalContainer, { backgroundColor: bg }]}>
                <View style={styles.modalHeader}>
                    <Text style={[styles.modalTitle, { color: textColor }]}>Upload Your Vlog</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close-circle" size={28} color={placeholderColor} />
                    </TouchableOpacity>
                </View>

                {/* Video picker implementation */}
                <TouchableOpacity
                    style={[styles.videoPicker, { 
                        backgroundColor: inputBg, 
                        borderColor: videoFile ? theme.colors.primary : borderColor,
                        borderStyle: videoFile ? 'solid' : 'dashed'
                    }]}
                    onPress={pickVideo}
                >
                    {videoFile ? (
                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
                            <Text style={[styles.videoPickerText, { color: textColor }]}>Video Selected</Text>
                            <Text style={[styles.videoPickerSub, { color: placeholderColor }]}>{videoFile.duration ? `${Math.round(videoFile.duration / 1000)}s` : ''} · Change Video</Text>
                        </View>
                    ) : (
                        <View style={{ alignItems: 'center' }}>
                            <MaterialCommunityIcons name="video-plus" size={40} color={theme.colors.primary} />
                            <Text style={[styles.videoPickerText, { color: textColor }]}>Tap to select video</Text>
                            <Text style={[styles.videoPickerSub, { color: placeholderColor }]}>MP4, MOV · Max 100MB · HD preferred</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {submitting && (
                    <View style={{ marginBottom: 16 }}>
                        <View style={{ height: 4, backgroundColor: borderColor, borderRadius: 2, overflow: 'hidden' }}>
                            <View style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: theme.colors.primary }} />
                        </View>
                        <Text style={{ fontSize: 11, color: placeholderColor, marginTop: 4, textAlign: 'right' }}>{uploadProgress}% Uploaded</Text>
                    </View>
                )}

                <TextInput
                    style={[styles.modalInput, { backgroundColor: inputBg, color: textColor }]}
                    placeholder="Vlog title *"
                    placeholderTextColor={placeholderColor}
                    value={title}
                    onChangeText={setTitle}
                    maxLength={80}
                />
                <TextInput
                    style={[styles.modalInput, { backgroundColor: inputBg, color: textColor }]}
                    placeholder="Location (e.g. Hampi, Karnataka) *"
                    placeholderTextColor={placeholderColor}
                    value={location}
                    onChangeText={setLocation}
                />
                <TextInput
                    style={[styles.modalInput, styles.modalTextArea, { backgroundColor: inputBg, color: textColor }]}
                    placeholder="Tell us about your adventure..."
                    placeholderTextColor={placeholderColor}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                />

                {/* Category selector */}
                <Text style={[{ color: placeholderColor, fontSize: 12, marginBottom: 8, marginLeft: 4 }]}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16, flexGrow: 0 }}>
                    {CATS.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setCategory(cat)}
                            style={[styles.catChip, {
                                backgroundColor: category === cat ? theme.colors.primary : inputBg,
                                borderColor: category === cat ? theme.colors.primary : borderColor,
                                marginRight: 8,
                            }]}
                        >
                            <Text style={{ color: category === cat ? '#FFF' : placeholderColor, fontSize: 13, fontWeight: '600' }}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={[styles.pendingNote, { backgroundColor: isDarkMode ? '#1C2A1C' : '#F0FFF0', borderColor: '#4CAF50' }]}>
                    <Ionicons name="information-circle-outline" size={16} color="#4CAF50" />
                    <Text style={{ color: isDarkMode ? '#81C784' : '#2E7D32', fontSize: 12, flex: 1, marginLeft: 8 }}>
                        Your vlog will be visible to all users instantly upon successful upload.
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.submitBtn, { backgroundColor: theme.colors.primary, opacity: submitting ? 0.7 : 1 }]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting
                        ? <ActivityIndicator size="small" color="#FFF" />
                        : <Ionicons name="cloud-upload-outline" size={20} color="#FFF" />
                    }
                    <Text style={styles.submitBtnText}>{submitting ? `Uploading... ${uploadProgress}%` : 'Post Vlog'}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

// ──────────────────────────────────────────────────────────────
// ── Main SocialHubScreen
// ──────────────────────────────────────────────────────────────
export default function SocialHubScreen({ route, navigation }) {
    const { theme, isDarkMode } = useTheme();
    const locationFilter = route?.params?.locationFilter || null;

    const [vlogs, setVlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [playingVlog, setPlayingVlog] = useState(null);

    const bg = isDarkMode ? '#0D1117' : '#F2F2F7';
    const cardHeader = isDarkMode ? '#161B22' : '#FFFFFF';
    const textColor = isDarkMode ? '#E6EDF3' : '#1C1C1E';
    const subText = isDarkMode ? '#8B949E' : '#6E6E73';

    // Fetch approved vlogs from backend
    const fetchVlogs = useCallback(async (showLoader = true) => {
        if (showLoader) setLoading(true);
        try {
            const params = {};
            if (locationFilter) params.location = locationFilter;
            if (activeCategory && activeCategory !== 'All' && activeCategory !== 'Trending') {
                params.category = activeCategory;
            }
            const res = await api.get('/vlogs', { params });
            // Add client-side liked/saved state
            setVlogs((res.data || []).map(v => ({ ...v, liked: false, saved: false })));
        } catch (err) {
            console.error('Failed to fetch vlogs:', err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [locationFilter, activeCategory]);

    useEffect(() => {
        fetchVlogs();

        // ── Real-time Feed Sync via Socket.io
        // Important: Socket.io needs the root URL, not the /api endpoint
        const ROOT_URL = BASE_URL.replace('/api', '');
        const socket = io(ROOT_URL, {
            transports: ['websocket'],
            forceNew: true
        });
        
        socket.on('connect', () => {
            console.log('🔌 [SocialHub] Connected to Real-time Feed');
        });

        socket.on('connect_error', (err) => {
            console.log('❌ [SocialHub] Socket Error:', err.message);
        });
        socket.on('vlog:new_public', (newVlog) => {
            setVlogs(prev => {
                // Prevent duplicate if already fetched
                if (prev.find(v => v._id === newVlog._id)) return prev;
                return [{ ...newVlog, liked: false, saved: false }, ...prev];
            });
        });

        socket.on('vlog:deleted', ({ id }) => {
            setVlogs(prev => prev.filter(v => v._id !== id));
        });

        socket.on('vlog:status_changed', ({ id, status }) => {
            if (status !== 'approved') {
                setVlogs(prev => prev.filter(v => v._id !== id));
            }
        });

        return () => socket.disconnect();
    }, [fetchVlogs]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchVlogs(false);
    };

    // Toggle like (optimistic UI)
    const handleLike = useCallback((id) => {
        setVlogs(prev => prev.map(v => v._id === id
            ? { ...v, liked: !v.liked, likes: v.liked ? v.likes - 1 : v.likes + 1 }
            : v
        ));
        // Optional: call API if user is logged in
        // api.post(`/vlogs/${id}/like`).catch(console.error);
    }, []);

    // Toggle save (optimistic UI)
    const handleSave = useCallback((id) => {
        setVlogs(prev => prev.map(v => v._id === id ? { ...v, saved: !v.saved } : v));
    }, []);

    // Sync like/save state into playing vlog
    const handlePlayerLike = (id) => {
        handleLike(id);
        setPlayingVlog(prev => prev && prev._id === id
            ? { ...prev, liked: !prev.liked, likes: prev.liked ? prev.likes - 1 : prev.likes + 1 }
            : prev
        );
    };
    const handlePlayerSave = (id) => {
        handleSave(id);
        setPlayingVlog(prev => prev && prev._id === id ? { ...prev, saved: !prev.saved } : prev);
    };

    // Client-side filtering
    const filteredVlogs = vlogs.filter(v => {
        const matchTrending = activeCategory !== 'Trending' || v.views >= 50000;
        const matchSearch = !searchQuery
            || v.title?.toLowerCase().includes(searchQuery.toLowerCase())
            || v.location?.toLowerCase().includes(searchQuery.toLowerCase())
            || v.user?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchTrending && matchSearch;
    });

    const trendingVlogs = vlogs.filter(v => v.views >= 50000).slice(0, 3);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={bg} />

            {/* ── Header */}
            <View style={[styles.header, { backgroundColor: cardHeader, borderBottomColor: isDarkMode ? '#30363D' : '#E5E5EA' }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={textColor} />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={[styles.headerTitle, { color: textColor }]}>Social Hub</Text>
                    <Text style={[styles.headerSub, { color: subText }]}>
                        {locationFilter ? `Vlogs from ${locationFilter}` : 'Travel Vlogs & Experiences'}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.uploadBtn, { backgroundColor: theme.colors.primary }]}
                    onPress={() => setShowUpload(true)}
                >
                    <Ionicons name="add" size={18} color="#FFF" />
                    <Text style={styles.uploadBtnText}>Upload</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
            >
                {/* ── Search bar */}
                <View style={[styles.searchBar, { backgroundColor: cardHeader, borderColor: isDarkMode ? '#30363D' : '#E5E5EA' }]}>
                    <Ionicons name="search" size={18} color={subText} />
                    <TextInput
                        style={[styles.searchInput, { color: textColor }]}
                        placeholder="Search vlogs, places, creators..."
                        placeholderTextColor={subText}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color={subText} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* ── Category Filter */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryRow}
                    contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                >
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.categoryChip,
                                activeCategory === cat && { backgroundColor: theme.colors.primary }
                            ]}
                            onPress={() => setActiveCategory(cat)}
                        >
                            {cat === 'Trending' && (
                                <Ionicons name="flame" size={12}
                                    color={activeCategory === cat ? '#FFF' : subText}
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            <Text style={[styles.categoryChipText,
                                { color: activeCategory === cat ? '#FFF' : subText }
                            ]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* ── Loading */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={[styles.loadingText, { color: subText }]}>Loading vlogs...</Text>
                    </View>
                ) : (
                    <>
                        {/* ── Trending Spotlight */}
                        {(activeCategory === 'All' || activeCategory === 'Trending')
                            && !searchQuery
                            && !locationFilter
                            && trendingVlogs.length > 0
                            && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="flame" size={18} color="#E53935" />
                                    <Text style={[styles.sectionTitle, { color: textColor }]}>  Trending Now</Text>
                                </View>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingLeft: 16, paddingRight: 8, gap: 12 }}
                                >
                                    {trendingVlogs.map(v => (
                                        <TouchableOpacity
                                            key={v._id}
                                            style={styles.trendCard}
                                            onPress={() => setPlayingVlog(v)}
                                            activeOpacity={0.9}
                                        >
                                            <Image source={{ uri: v.thumbnail }} style={styles.trendThumb} resizeMode="cover" />
                                            <View style={styles.trendGradient} />
                                            <View style={styles.trendInfo}>
                                                <Text style={styles.trendTitle} numberOfLines={2}>{v.title}</Text>
                                                <View style={styles.metaRow}>
                                                    <Ionicons name="eye-outline" size={11} color="rgba(255,255,255,0.8)" />
                                                    <Text style={styles.trendMeta}> {formatCount(v.views)}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.trendPlayBtn}>
                                                <Ionicons name="play-circle" size={32} color="#FFF" />
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {/* ── Vlog Feed */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <MaterialCommunityIcons name="video-wireless" size={18} color={theme.colors.primary} />
                                <Text style={[styles.sectionTitle, { color: textColor }]}>
                                    {locationFilter ? `  Vlogs from ${locationFilter}` : '  All Vlogs'}
                                </Text>
                                <Text style={[styles.sectionCount, { color: subText }]}>{filteredVlogs.length} videos</Text>
                            </View>

                            {filteredVlogs.length === 0 ? (
                                <View style={styles.emptyState}>
                                    <MaterialCommunityIcons name="video-off-outline" size={56} color={subText} />
                                    <Text style={[styles.emptyTitle, { color: textColor }]}>No vlogs found</Text>
                                    <Text style={[styles.emptySub, { color: subText }]}>
                                        {locationFilter
                                            ? `No approved vlogs for "${locationFilter}" yet. Be the first!`
                                            : 'No vlogs available. Upload one or try a different filter.'
                                        }
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.emptyBtn, { backgroundColor: theme.colors.primary }]}
                                        onPress={() => setShowUpload(true)}
                                    >
                                        <Text style={styles.emptyBtnText}>Upload Vlog</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                filteredVlogs.map(vlog => (
                                    <VlogCard
                                        key={vlog._id}
                                        vlog={vlog}
                                        onLike={handleLike}
                                        onSave={handleSave}
                                        onPlay={setPlayingVlog}
                                        theme={theme}
                                        isDarkMode={isDarkMode}
                                    />
                                ))
                            )}
                        </View>
                    </>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* ── Upload Modal */}
            <UploadModal
                visible={showUpload}
                onClose={() => setShowUpload(false)}
                theme={theme}
                isDarkMode={isDarkMode}
            />

            {/* ── Player Modal */}
            <PlayerModal
                vlog={playingVlog}
                onClose={() => setPlayingVlog(null)}
                onLike={handlePlayerLike}
                onSave={handlePlayerSave}
                theme={theme}
                isDarkMode={isDarkMode}
            />
        </SafeAreaView>
    );
}

// ──────────────────────────────────────────────────────────────
// ── Styles
// ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1 },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', letterSpacing: -0.3 },
    headerSub: { fontSize: 12, marginTop: 1 },
    uploadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 4,
    },
    uploadBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },

    // Search
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
        gap: 8,
    },
    searchInput: { flex: 1, fontSize: 14 },

    // Categories
    categoryRow: { marginBottom: 8 },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: 'rgba(150,150,150,0.12)',
    },
    categoryChipText: { fontSize: 13, fontWeight: '600' },

    // Loading
    loadingContainer: { alignItems: 'center', paddingVertical: 60, gap: 12 },
    loadingText: { fontSize: 14 },

    // Sections
    section: { marginTop: 8, marginBottom: 4 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 14,
        marginTop: 8,
    },
    sectionTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.2 },
    sectionCount: { marginLeft: 'auto', fontSize: 13 },

    // Trending cards
    trendCard: {
        width: 200,
        height: 140,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    trendThumb: { width: '100%', height: '100%' },
    trendGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    trendInfo: {
        position: 'absolute',
        bottom: 8,
        left: 10,
        right: 40,
    },
    trendTitle: { color: '#FFF', fontSize: 12, fontWeight: '700', lineHeight: 16 },
    trendMeta: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
    trendPlayBtn: {
        position: 'absolute',
        top: '50%',
        right: 10,
        marginTop: -16,
    },

    // Vlog card
    vlogCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    thumbnail: { width: '100%', height: 220 },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    playButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    durationText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
    categoryBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    categoryText: { color: '#FFF', fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },

    cardInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 14,
        paddingBottom: 8,
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1565C0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarLetter: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    vlogTitle: { fontSize: 15, fontWeight: '700', lineHeight: 20, marginBottom: 4 },
    metaRow: { flexDirection: 'row', alignItems: 'center' },
    metaText: { fontSize: 12 },
    metaDot: { fontSize: 12 },

    actionRow: {
        flexDirection: 'row',
        borderTopWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        gap: 5,
    },
    actionCount: { fontSize: 13, fontWeight: '600' },

    // Empty state
    emptyState: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 32 },
    emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 16 },
    emptySub: { fontSize: 14, textAlign: 'center', marginTop: 6, lineHeight: 20 },
    emptyBtn: { marginTop: 20, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24 },
    emptyBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },

    // Upload Modal
    modalContainer: { flex: 1, padding: 20, paddingTop: 16 },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold' },
    videoPicker: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 130,
        borderRadius: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        marginBottom: 16,
        gap: 6,
    },
    videoPickerText: { fontSize: 16, fontWeight: '600' },
    videoPickerSub: { fontSize: 12 },
    modalInput: {
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        marginBottom: 12,
    },
    modalTextArea: { minHeight: 80, textAlignVertical: 'top' },
    catChip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
    },
    pendingNote: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 14,
    },
    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
    },
    submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

    // Player Modal
    playerContainer: { flex: 1 },
    playerVideo: { width, flex: 1 },
    playerImage: { width, height: height * 0.65 },
    noVideoOverlay: {
        position: 'absolute',
        bottom: height * 0.15,
        left: 0,
        right: 0,
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 20,
        margin: 20,
        borderRadius: 16,
    },
    noVideoText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    noVideoSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center', lineHeight: 18 },
    playerOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 50,
    },
    playerClose: {
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 20,
        padding: 6,
    },
    playerBottom: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
    },
    playerInfo: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 16,
        padding: 16,
        flex: 1,
    },
    playerTitle: { color: '#FFF', fontSize: 17, fontWeight: '700', lineHeight: 22 },
    playerMeta: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
    playerActions: { alignItems: 'center', gap: 20, paddingBottom: 4 },
    playerActionBtn: { alignItems: 'center', gap: 2 },
    playerActionCount: { color: '#FFF', fontSize: 12, fontWeight: '600' },
});
