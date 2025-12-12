import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export default function ReviewCard({ review, onHelpful }) {
    const renderStars = (rating) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={14}
                        color={theme.colors.accent}
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

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.m,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.m,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.s,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.text.primary,
    },
    date: {
        fontSize: 12,
        color: theme.colors.text.tertiary,
        marginTop: 2,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    comment: {
        fontSize: 14,
        color: theme.colors.text.primary,
        lineHeight: 20,
        marginBottom: theme.spacing.m,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    helpfulButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.s,
    },
    helpfulText: {
        fontSize: 13,
        color: theme.colors.text.secondary,
    },
});
