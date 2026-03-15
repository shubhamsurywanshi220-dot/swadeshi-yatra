import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../utils/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { useTranslation } from 'react-i18next';

// const BACKEND_URL = 'http://10.0.2.2:5000/api/auth'; // Removed hardcoded URL


export default function LoginScreen({ navigation, route }) {
    const { t } = useTranslation();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password || (!isLogin && !name)) {
            Alert.alert(t('common.error'), t('login.fill_all'));
            return;
        }

        setLoading(true);
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin ? { email, password } : { name, email, password, role: 'traveler' };

            const response = await api.post(endpoint, payload);


            // Save user data to AsyncStorage
            await AsyncStorage.setItem('@auth_token', response.data.token);
            await AsyncStorage.setItem('@user_id', response.data.userId);
            if (response.data.name) await AsyncStorage.setItem('@user_name', response.data.name);
            await AsyncStorage.setItem('@user_email', email);

            navigation.replace('Home');

        } catch (error) {
            console.log('[Login] Error:', error);
            let msg = 'Something went wrong. Please check your connection.';

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                msg = error.response.data?.msg || error.response.data || 'Server error';
            } else if (error.request) {
                // The request was made but no response was received
                msg = 'Cannot connect to server. Please check your internet or server IP.';
            }

            Alert.alert('Error', typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <View style={styles.logoContainer}>
                            <Ionicons name="earth" size={48} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.title}>{isLogin ? t('login.welcome_back') : t('login.join')}</Text>
                        <Text style={styles.subtitle}>{isLogin ? t('login.login_continue') : t('login.signup_explore')}</Text>
                    </View>

                    {/* Input Fields */}
                    {!isLogin && (
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color={theme.colors.text.tertiary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder={t('login.full_name')}
                                placeholderTextColor={theme.colors.text.tertiary}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    )}

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color={theme.colors.text.tertiary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('login.email')}
                            placeholderTextColor={theme.colors.text.tertiary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.tertiary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={t('login.password')}
                            placeholderTextColor={theme.colors.text.tertiary}
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <View style={styles.buttonContent}>
                                <Text style={styles.buttonText}>{isLogin ? t('login.login') : t('login.signup')}</Text>
                                <Ionicons name="arrow-forward" size={20} color="white" />
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Switch Login/Signup */}
                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchContainer}>
                        <Text style={styles.switchText}>
                            {isLogin ? t('login.no_account') : t('login.have_account')}
                            <Text style={styles.switchTextBold}>{isLogin ? t('login.signup') : t('login.login')}</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: theme.spacing.xl,
        justifyContent: 'center'
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.s,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xl,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.m,
        marginBottom: theme.spacing.m,
        paddingHorizontal: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.soft,
    },
    inputIcon: {
        marginRight: theme.spacing.s,
    },
    input: {
        flex: 1,
        paddingVertical: theme.spacing.m,
        fontSize: 16,
        color: theme.colors.text.primary,
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.radius.m,
        alignItems: 'center',
        marginTop: theme.spacing.m,
        ...theme.shadows.elevated,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.s,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    switchContainer: {
        marginTop: theme.spacing.l,
        alignItems: 'center'
    },
    switchText: {
        color: theme.colors.text.secondary,
        fontSize: 14,
    },
    switchTextBold: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
});
