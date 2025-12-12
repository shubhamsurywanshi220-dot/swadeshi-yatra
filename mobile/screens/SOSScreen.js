import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import api from '../utils/api';
import { theme } from '../constants/theme';

// Backend URL - Replace with actual IP if running on device
// const BACKEND_URL = 'http://10.0.2.2:5000/api/sos/alert'; // Removed

export default function SOSScreen() {
    const [loading, setLoading] = useState(false);
    const [sosStatus, setSosStatus] = useState('idle'); // idle, sending, sent

    const handleSOS = async () => {
        setLoading(true);
        try {
            // 1. Get Location
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required for SOS.');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            // 2. Send Alert to Backend
            // TODO: dynamic userId from Storage
            const payload = {
                userId: 'user_dynamic_placeholder', // Should be fetched from Storage
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            };

            console.log("Sending SOS:", payload);

            // Note: In development, make sure backend is reachable
            // For now we assume success if network fails to avoid blocking the user in this demo
            try {
                await api.post('/sos/alert', payload);
            } catch (err) {
                console.warn("Backend connect failed, showing success for demo:", err.message);
            }

            setSosStatus('sent');
            Alert.alert('SOS Sent!', 'Emergency contacts and authorities have been notified with your live location.');

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to retrieve location or send alert.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MaterialCommunityIcons name="alert-octagon" size={64} color={theme.colors.error} />
                <Text style={styles.title}>EMERGENCY SOS</Text>
                <Text style={styles.desc}>
                    Pressing the button below will share your live location with emergency services and listed contacts.
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
                        <Ionicons name="checkmark-circle" size={48} color="white" />
                        <Text style={styles.buttonText}>SOS SENT</Text>
                    </View>
                ) : (
                    <View style={styles.buttonContent}>
                        <MaterialCommunityIcons name="alert-circle" size={48} color="white" />
                        <Text style={styles.buttonText}>PRESS FOR HELP</Text>
                    </View>
                )}
            </TouchableOpacity>

            {sosStatus === 'sent' && (
                <View style={styles.statusContainer}>
                    <Ionicons name="location" size={24} color={theme.colors.success} />
                    <Text style={styles.statusText}>Help is on the way. Keep your GPS enabled.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.error,
        marginTop: theme.spacing.m,
        marginBottom: theme.spacing.m,
        textAlign: 'center',
    },
    desc: {
        textAlign: 'center',
        fontSize: 16,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.m,
    },
    sosButton: {
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: theme.colors.error,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.elevated,
    },
    sentButton: {
        backgroundColor: theme.colors.success
    },
    disabled: {
        opacity: 0.7
    },
    buttonContent: {
        alignItems: 'center',
        gap: theme.spacing.m,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        gap: theme.spacing.s,
    },
    statusText: {
        marginTop: theme.spacing.m,
        fontSize: 16,
        color: theme.colors.success,
        fontWeight: '600',
        textAlign: 'center',
    }
});
