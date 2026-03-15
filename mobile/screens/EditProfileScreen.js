import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';

export default function EditProfileScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme, isDarkMode);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        profilePhoto: ''
    });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userId = await AsyncStorage.getItem('@user_id');
            if (!userId) {
                Alert.alert(t('common.error'), 'Please log in again.');
                navigation.navigate('Login');
                return;
            }

            const response = await api.get(`/auth/profile/${userId}`);
            const { name, email, phone, profilePhoto } = response.data;
            setFormData({
                name: name || '',
                email: email || '',
                phone: phone || '',
                profilePhoto: profilePhoto || ''
            });
        } catch (error) {
            console.error('Error loading user data:', error);
            Alert.alert(t('common.error'), 'Failed to load profile data.');
        } finally {
            setFetching(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.email) {
            Alert.alert(t('common.error'), 'Name and Email are required.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/profile/update', formData);
            
            // Update local storage
            if (response.data.name) await AsyncStorage.setItem('@user_name', response.data.name);
            if (response.data.email) await AsyncStorage.setItem('@user_email', response.data.email);

            Alert.alert('Success', 'Profile updated successfully.');
            navigation.goBack();
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', error.response?.data?.msg || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    if (fetching) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Profile Photo Placeholder */}
                    <View style={styles.photoSection}>
                        <View style={styles.photoContainer}>
                            {formData.profilePhoto ? (
                                <Image source={{ uri: formData.profilePhoto }} style={styles.profileImage} />
                            ) : (
                                <Ionicons name="person" size={60} color={theme.colors.text.tertiary} />
                            )}
                            <TouchableOpacity style={styles.editPhotoButton}>
                                <Ionicons name="camera" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.photoLabel}>Change Profile Photo</Text>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(v) => updateField('name', v)}
                            placeholder="Enter your name"
                            placeholderTextColor={theme.colors.text.tertiary}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.email}
                            onChangeText={(v) => updateField('email', v)}
                            placeholder="Enter your email"
                            placeholderTextColor={theme.colors.text.tertiary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.phone}
                            onChangeText={(v) => updateField('phone', v)}
                            placeholder="e.g. +91 98765 43210"
                            placeholderTextColor={theme.colors.text.tertiary}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.saveButton, loading && styles.disabled]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.saveText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
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
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    backButton: {
        padding: 4,
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    scrollContent: {
        padding: 24,
    },
    photoSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    photoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.surfaceVariant,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.primary,
        position: 'relative',
    },
    profileImage: {
        width: 116,
        height: 116,
        borderRadius: 58,
    },
    editPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: theme.colors.background,
    },
    photoLabel: {
        marginTop: 12,
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '600',
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
    saveButton: {
        backgroundColor: theme.colors.primary,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
        ...theme.shadows.elevated,
    },
    saveText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabled: {
        opacity: 0.7,
    }
});
