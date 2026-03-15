import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { checkConnectivity } from '../utils/network';

export default function SOSScreen() {
    const { theme, isDarkMode } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme, isDarkMode);

    React.useEffect(() => {
        return () => stopTracking();
    }, []);

    const [loading, setLoading] = useState(false);
    const [sosStatus, setSosStatus] = useState('idle'); // idle, sending, sent
    const [activeSOSId, setActiveSOSId] = useState(null);
    const [locationSubscription, setLocationSubscription] = useState(null);

    const stopTracking = () => {
        if (locationSubscription) {
            locationSubscription.remove();
            setLocationSubscription(null);
        }
    };

    const handleSOS = async () => {
        if (sosStatus === 'sent') {
            // Option to resolve or stop tracking
            Alert.alert(
                t('sos.resolve_title'),
                t('sos.resolve_msg'),
                [
                    { text: t('common.cancel'), style: 'cancel' },
                    {
                        text: t('sos.yes_safe'),
                        onPress: async () => {
                            try {
                                if (activeSOSId) await api.put(`/sos/resolve/${activeSOSId}`);
                                stopTracking();
                                setSosStatus('idle');
                                setActiveSOSId(null);
                            } catch (err) {
                                Alert.alert(t('common.error'), 'Failed to resolve SOS alert.');
                            }
                        }
                    }
                ]
            );
            return;
        }

        setLoading(true);
        try {
            // 0. Check Connectivity
            const isOnline = await checkConnectivity();
            if (!isOnline) {
                Alert.alert(t('common.offline'), "Internet connection required to send emergency alerts or location.");
                setLoading(false);
                return;
            }

            // 1. Get Location Permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required for SOS.');
                setLoading(false);
                return;
            }

            // 2. Get Initial Position
            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            // 3. Start SOS on Backend
            const payload = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                message: "Urgent SOS! I need help.",
                emergencyContact: {
                    name: "Emergency Contacts",
                    phone: "911" // In real app, fetch from user profile
                }
            };

            const response = await api.post('/sos/alert', payload);
            const sosId = response.data._id;
            setActiveSOSId(sosId);
            setSosStatus('sent');

            // 4. Start Live Tracking
            const subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 10, // Update every 10 meters
                    timeInterval: 5000,    // Or every 5 seconds
                },
                async (newLocation) => {
                    try {
                        await api.put(`/sos/update/${sosId}`, {
                            latitude: newLocation.coords.latitude,
                            longitude: newLocation.coords.longitude
                        });
                        console.log("Live SOS Update sent");
                    } catch (err) {
                        console.warn("Tracking update failed", err.message);
                    }
                }
            );
            setLocationSubscription(subscription);

            Alert.alert(t('sos.sos_sent'), t('sos.sent_alert'));

        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.msg || 'Failed to retrieve location or send alert.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <MaterialCommunityIcons name="alert-octagon" size={80} color={theme.colors.error} />
                    <Text style={styles.title}>{t('sos.title')}</Text>
                    <Text style={styles.desc}>
                        {t('sos.description')}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.sosButton, loading && styles.disabled, sosStatus === 'sent' && styles.sentButton]}
                    onPress={handleSOS}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator size="large" color="white" />
                    ) : sosStatus === 'sent' ? (
                        <View style={styles.buttonContent}>
                            <Ionicons name="checkmark-circle" size={56} color="white" />
                            <Text style={styles.buttonText}>{t('sos.sos_sent')}</Text>
                        </View>
                    ) : (
                        <View style={styles.buttonContent}>
                            <MaterialCommunityIcons name="alert-circle" size={56} color="white" />
                            <Text style={styles.buttonText}>{t('sos.press_help')}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {sosStatus === 'sent' && (
                    <View style={styles.statusContainer}>
                        <Ionicons name="location" size={24} color={theme.colors.success} />
                        <Text style={styles.statusText}>{t('sos.help_on_way')}</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.error,
        marginTop: 16,
        marginBottom: 12,
        textAlign: 'center',
    },
    desc: {
        textAlign: 'center',
        fontSize: 16,
        color: theme.colors.text.secondary,
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    sosButton: {
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: theme.colors.error,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.elevated,
        shadowColor: theme.colors.error,
        shadowOpacity: 0.5,
        elevation: 12,
    },
    sentButton: {
        backgroundColor: theme.colors.success,
        shadowColor: theme.colors.success,
    },
    disabled: {
        opacity: 0.7,
    },
    buttonContent: {
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        gap: 8,
        backgroundColor: isDarkMode ? '#1B2E1C' : '#E8F5E9',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isDarkMode ? '#2E7D32' : '#81C784',
    },
    statusText: {
        fontSize: 15,
        color: isDarkMode ? '#81C784' : '#2E7D32',
        fontWeight: '600',
        textAlign: 'center',
    },
});
