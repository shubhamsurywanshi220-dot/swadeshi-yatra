import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function BookingScreen({ route, navigation }) {
    const { placeId, placeName, entryFee } = route.params;
    const { theme, isDarkMode } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme, isDarkMode);

    const [loading, setLoading] = useState(false);
    const [numTickets, setNumTickets] = useState('1');
    const [passengerName, setPassengerName] = useState('');
    const [email, setEmail] = useState('');

    // Extract price from entryFee string (e.g., "₹35 (Ind)")
    const priceMatch = entryFee?.match(/₹(\d+)/);
    const unitPrice = priceMatch ? parseInt(priceMatch[1]) : 50;
    const totalPrice = unitPrice * (parseInt(numTickets) || 1);

    const handleBooking = async () => {
        if (!passengerName || !email) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await api.post('/tickets', {
                placeId,
                placeName,
                visitDate: new Date(),
                numberOfTickets: parseInt(numTickets),
                totalAmount: totalPrice,
                passengerName,
                contactEmail: email
            });

            Alert.alert(
                t('booking.confirmed'),
                t('booking.ticket_generated'),
                [{ text: t('booking.view_tickets'), onPress: () => navigation.navigate('MyTickets') }]
            );
        } catch (error) {
            console.error('Booking failed:', error);
            Alert.alert('Error', t('booking.booking_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('booking.book_ticket')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>{t('booking.location_label')}</Text>
                    <Text style={styles.infoValue}>{placeName}</Text>
                    <Text style={styles.infoLabel}>{t('booking.ticket_price')}</Text>
                    <Text style={styles.infoValue}>₹{unitPrice} per adult</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>{t('booking.passenger_name')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('booking.enter_name')}
                        value={passengerName}
                        onChangeText={setPassengerName}
                    />

                    <Text style={styles.label}>{t('booking.contact_email')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('booking.enter_email')}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.label}>{t('booking.num_tickets')}</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={numTickets}
                        onChangeText={setNumTickets}
                    />
                </View>

                <View style={styles.summary}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>{t('booking.total_amount')}</Text>
                        <Text style={styles.summaryValue}>₹{totalPrice}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.payButton}
                    onPress={handleBooking}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.payText}>{t('booking.confirm_book')}</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    backButton: { marginRight: 15 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary },
    content: { padding: 20 },
    infoBox: { backgroundColor: theme.colors.surface, padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: theme.colors.border },
    infoLabel: { fontSize: 13, color: theme.colors.text.secondary, textTransform: 'uppercase', marginBottom: 4 },
    infoValue: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text.primary, marginBottom: 12 },
    form: { marginBottom: 24 },
    label: { fontSize: 16, fontWeight: '600', color: theme.colors.text.primary, marginBottom: 8 },
    input: { backgroundColor: theme.colors.surface, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 16, color: theme.colors.text.primary },
    summary: { borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 16, marginBottom: 30 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryLabel: { fontSize: 18, fontWeight: '600', color: theme.colors.text.primary },
    summaryValue: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary },
    payButton: { backgroundColor: theme.colors.primary, padding: 18, borderRadius: 12, alignItems: 'center', ...theme.shadows.elevated },
    payText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
