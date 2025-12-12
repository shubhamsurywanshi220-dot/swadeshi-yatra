import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import api from '../utils/api';

export default function ReviewModal({ visible, onClose, placeId, placeName, userId, userName, onReviewSubmitted }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert('Error', 'Please select a rating');
            return;
        }

        if (!comment.trim()) {
            Alert.alert('Error', 'Please write a review');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/reviews', {
                userId,
                placeId,
                userName,
                rating,
                comment: comment.trim()
            });

            Alert.alert('Success', 'Review submitted successfully!');
            setRating(0);
            setComment('');
            onReviewSubmitted();
            onClose();

        } catch (error) {
            console.error('Error submitting review:', error);
            Alert.alert('Error', error.response?.data?.msg || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = () => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                        style={styles.starButton}
                    >
                        <Ionicons
                            name={star <= rating ? 'star' : 'star-outline'}
                            size={40}
                            color={star <= rating ? theme.colors.accent : theme.colors.text.tertiary}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Write a Review</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={28} color={theme.colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.placeName}>{placeName}</Text>

                    {/* Rating Stars */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Your Rating</Text>
                        {renderStars()}
                        {rating > 0 && (
                            <Text style={styles.ratingText}>
                                {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : 'Excellent'}
                            </Text>
                        )}
                    </View>

                    {/* Comment */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Your Review</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Share your experience..."
                            placeholderTextColor={theme.colors.text.tertiary}
                            multiline
                            numberOfLines={6}
                            value={comment}
                            onChangeText={setComment}
                            maxLength={500}
                            textAlignVertical="top"
                        />
                        <Text style={styles.charCount}>{comment.length}/500</Text>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        <Text style={styles.submitButtonText}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: theme.radius.xl,
        borderTopRightRadius: theme.radius.xl,
        padding: theme.spacing.xl,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    placeName: {
        fontSize: 16,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xl,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.m,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing.s,
        marginBottom: theme.spacing.s,
    },
    starButton: {
        padding: theme.spacing.xs,
    },
    ratingText: {
        textAlign: 'center',
        fontSize: 14,
        color: theme.colors.accent,
        fontWeight: '600',
    },
    textInput: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.m,
        padding: theme.spacing.m,
        fontSize: 15,
        color: theme.colors.text.primary,
        borderWidth: 1,
        borderColor: theme.colors.border,
        minHeight: 120,
    },
    charCount: {
        textAlign: 'right',
        fontSize: 12,
        color: theme.colors.text.tertiary,
        marginTop: theme.spacing.xs,
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.radius.m,
        alignItems: 'center',
        ...theme.shadows.elevated,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
