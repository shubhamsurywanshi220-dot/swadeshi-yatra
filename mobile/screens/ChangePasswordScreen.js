import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';

export default function ChangePasswordScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme, isDarkMode);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const handleChangePassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = formData;

        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/change-password', {
                currentPassword,
                newPassword
            });

            Alert.alert('Success', 'Password changed successfully.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Error changing password:', error);
            Alert.alert('Error', error.response?.data?.msg || 'Failed to change password.');
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const toggleVisibility = (field) => {
        setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
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
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Change Password</Text>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.description}>
                        Ensure your account is using a long, random password to stay secure.
                    </Text>

                    {/* Current Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Current Password</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={formData.currentPassword}
                                onChangeText={(v) => updateField('currentPassword', v)}
                                placeholder="Enter current password"
                                placeholderTextColor={theme.colors.text.tertiary}
                                secureTextEntry={!showPasswords.current}
                            />
                            <TouchableOpacity onPress={() => toggleVisibility('current')}>
                                <Ionicons 
                                    name={showPasswords.current ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color={theme.colors.text.tertiary} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* New Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New Password</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={formData.newPassword}
                                onChangeText={(v) => updateField('newPassword', v)}
                                placeholder="Enter new password"
                                placeholderTextColor={theme.colors.text.tertiary}
                                secureTextEntry={!showPasswords.new}
                            />
                            <TouchableOpacity onPress={() => toggleVisibility('new')}>
                                <Ionicons 
                                    name={showPasswords.new ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color={theme.colors.text.tertiary} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm New Password</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={formData.confirmPassword}
                                onChangeText={(v) => updateField('confirmPassword', v)}
                                placeholder="Confirm new password"
                                placeholderTextColor={theme.colors.text.tertiary}
                                secureTextEntry={!showPasswords.confirm}
                            />
                            <TouchableOpacity onPress={() => toggleVisibility('confirm')}>
                                <Ionicons 
                                    name={showPasswords.confirm ? "eye-off-outline" : "eye-outline"} 
                                    size={20} 
                                    color={theme.colors.text.tertiary} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={[styles.actionButton, loading && styles.disabled]}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.actionText}>Update Password</Text>
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
    description: {
        fontSize: 14,
        color: theme.colors.text.secondary,
        marginBottom: 32,
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text.secondary,
        marginBottom: 8,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: theme.colors.text.primary,
    },
    actionButton: {
        backgroundColor: theme.colors.primary,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
        ...theme.shadows.elevated,
    },
    actionText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabled: {
        opacity: 0.7,
    }
});
