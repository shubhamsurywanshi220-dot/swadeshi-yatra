import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';

export default function ProviderRegistrationScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme, isDarkMode);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Guide',
        location: '',
        ownerName: '',
        contactNumber: '',
        description: '',
        email: '',
        businessHours: '',
        priceRange: '₹₹'
    });

    const categories = ['Guide', 'Artisan', 'Shop'];
    const priceRanges = ['Free', '₹', '₹₹', '₹₹₹', '₹₹₹₹'];

    const handleSubmit = async () => {
        const { name, category, location, ownerName, contactNumber, description } = formData;
        if (!name || !category || !location || !ownerName || !contactNumber || !description) {
            Alert.alert(t('provider.incomplete'), t('provider.fill_required'));
            return;
        }

        setLoading(true);
        try {
            await api.post('/businesses/register', {
                ...formData,
                contactInfo: {
                    phone: contactNumber,
                    email: formData.email,
                }
            });

            Alert.alert(
                t('provider.submitted_title'),
                t('provider.submitted_msg'),
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.msg || 'Failed to submit registration.');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('provider.partner_title')}</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
                        <Text style={styles.infoText}>
                            Join our community of verified local guides and artisans. Your profile will be visible once verified.
                        </Text>
                    </View>

                    <Text style={styles.sectionLabel}>{t('provider.business_info')}</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('provider.business_name')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Traditional Pottery Studio"
                            placeholderTextColor={theme.colors.text.tertiary}
                            value={formData.name}
                            onChangeText={(v) => updateField('name', v)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('provider.category')}</Text>
                        <View style={[styles.chipRow, { justifyContent: 'center' }]}>
                            {['Guide', 'Artisan', 'Shop'].map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[styles.chip, formData.category === cat && styles.chipSelected]}
                                    onPress={() => updateField('category', cat)}
                                >
                                    <Text style={[styles.chipText, formData.category === cat && styles.chipTextSelected]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('provider.location')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Jaipur, Rajasthan"
                            placeholderTextColor={theme.colors.text.tertiary}
                            value={formData.location}
                            onChangeText={(v) => updateField('location', v)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('provider.description')}</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="What do you offer to travelers?"
                            placeholderTextColor={theme.colors.text.tertiary}
                            multiline={true}
                            numberOfLines={4}
                            value={formData.description}
                            onChangeText={(v) => updateField('description', v)}
                        />
                    </View>

                    <Text style={styles.sectionLabel}>{t('provider.contact_details')}</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('provider.owner_name')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Full name"
                            placeholderTextColor={theme.colors.text.tertiary}
                            value={formData.ownerName}
                            onChangeText={(v) => updateField('ownerName', v)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('provider.mobile_number')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+91 XXXXX XXXXX"
                            placeholderTextColor={theme.colors.text.tertiary}
                            keyboardType="phone-pad"
                            value={formData.contactNumber}
                            onChangeText={(v) => updateField('contactNumber', v)}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>{t('provider.price_range')}</Text>
                        <View style={styles.chipRow}>
                            {priceRanges.map(price => (
                                <TouchableOpacity
                                    key={price}
                                    style={[styles.chip, formData.priceRange === price && styles.chipSelected]}
                                    onPress={() => updateField('priceRange', price)}
                                >
                                    <Text style={[styles.chipText, formData.priceRange === price && styles.chipTextSelected]}>{price}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.disabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.submitText}>{t('provider.submit')}</Text>
                        )}
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    scrollContent: {
        padding: 24,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: isDarkMode ? '#1B263B' : '#E3F2FD',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        gap: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: isDarkMode ? '#1E3A8A' : '#BBDEFB',
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: isDarkMode ? '#93C5FD' : '#1976D2',
        lineHeight: 20,
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 16,
        marginTop: 8,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text.secondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: theme.colors.text.primary,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: theme.colors.surfaceVariant,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    chipSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    chipText: {
        fontSize: 13,
        color: theme.colors.text.secondary,
        fontWeight: '600',
    },
    chipTextSelected: {
        color: 'white',
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
        ...theme.shadows.elevated,
    },
    submitText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabled: {
        opacity: 0.7,
    }
});
