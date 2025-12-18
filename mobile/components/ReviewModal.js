import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

export default function ReviewModal({ visible, onClose, placeId, placeName, userId, userName, onReviewSubmitted }) {
    const { theme, isDarkMode } = useTheme();
    const styles = createStyles(theme, isDarkMode);

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
                            color={star <= rating ? (isDarkMode ? '#FFD700' : theme.colors.accent) : theme.colors.text.tertiary}
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
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Write a Review</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
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
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    keyboardView: {
        width: '100%',
    },
    modalContent: {
        backgroundColor: theme.colors.surface,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        maxHeight: '90%',
        ...theme.shadows.elevated,
        borderTopWidth: isDarkMode ? 1 : 0,
        borderTopColor: theme.colors.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    closeButton: {
        padding: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    placeName: {
        fontSize: 15,
        color: theme.colors.text.secondary,
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: 12,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 8,
    },
    starButton: {
        padding: 4,
    },
    ratingText: {
        textAlign: 'center',
        fontSize: 14,
        color: isDarkMode ? '#FFD700' : theme.colors.accent,
        fontWeight: '700',
    },
    textInput: {
        backgroundColor: isDarkMode ? '#1A1A1A' : theme.colors.background,
        borderRadius: 16,
        padding: 16,
        fontSize: 15,
        color: theme.colors.text.primary,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        minHeight: 140,
    },
    charCount: {
        textAlign: 'right',
        fontSize: 12,
        color: theme.colors.text.tertiary,
        marginTop: 6,
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 12,
        ...theme.shadows.elevated,
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
});
