import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function ReviewCard({ review, onHelpful }) {
    const { theme, isDarkMode } = useTheme();
    const styles = createStyles(theme, isDarkMode);

    const renderStars = (rating) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={14}
                        color={isDarkMode ? '#FFD700' : theme.colors.accent}
                    />
                ))}
            </View>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return date.toLocaleDateString();
    };

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={20} color={theme.colors.primary} />
                    </View>
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{review.userName}</Text>
                        <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
                    </View>
                </View>
                {renderStars(review.rating)}
            </View>

            {/* Comment */}
            <Text style={styles.comment}>{review.comment}</Text>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.helpfulButton}
                    onPress={() => onHelpful(review._id)}
                >
                    <Ionicons name="thumbs-up-outline" size={16} color={theme.colors.text.secondary} />
                    <Text style={styles.helpfulText}>
                        Helpful {review.helpfulCount > 0 ? `(${review.helpfulCount})` : ''}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.m,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.soft,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: isDarkMode ? '#212121' : theme.colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    date: {
        fontSize: 11,
        color: theme.colors.text.tertiary,
        marginTop: 2,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    comment: {
        fontSize: 14,
        color: theme.colors.text.secondary,
        lineHeight: 22,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: 10,
    },
    helpfulButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    helpfulText: {
        fontSize: 13,
        color: theme.colors.text.secondary,
        fontWeight: '500',
    },
});
