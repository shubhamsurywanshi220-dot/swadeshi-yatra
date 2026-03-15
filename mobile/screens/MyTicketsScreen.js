import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';

export default function MyTicketsScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme, isDarkMode);

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await api.get('/tickets');
            setTickets(response.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
                <View>
                    <Text style={styles.placeName}>{item.placeName}</Text>
                    <Text style={styles.bookingId}>ID: {item.bookingId}</Text>
                </View>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.ticketDivider}>
                <View style={styles.dentLeft} />
                <View style={styles.dashLine} />
                <View style={styles.dentRight} />
            </View>

            <View style={styles.ticketBody}>
                <View style={styles.infoRow}>
                    <View style={styles.infoCol}>
                        <Text style={styles.infoLabel}>Passenger</Text>
                        <Text style={styles.infoText}>{item.passengerName}</Text>
                    </View>
                    <View style={styles.infoCol}>
                        <Text style={styles.infoLabel}>Date</Text>
                        <Text style={styles.infoText}>{new Date(item.visitDate).toLocaleDateString()}</Text>
                    </View>
                </View>
                <View style={styles.infoRow}>
                    <View style={styles.infoCol}>
                        <Text style={styles.infoLabel}>Tickets</Text>
                        <Text style={styles.infoText}>{item.numberOfTickets} Adult(s)</Text>
                    </View>
                    <View style={styles.infoCol}>
                        <Text style={styles.infoLabel}>Total Paid</Text>
                        <Text style={styles.infoText}>₹{item.totalAmount}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.qrPlaceholder}>
                <MaterialCommunityIcons name="qrcode-scan" size={40} color={theme.colors.primary} />
                <Text style={styles.qrText}>{t('tickets.scan_entry')}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <Text style={styles.title}>{t('tickets.my_bookings')}</Text>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : tickets.length === 0 ? (
                <View style={styles.center}>
                    <MaterialCommunityIcons name="ticket-outline" size={80} color={theme.colors.text.tertiary} />
                    <Text style={styles.emptyTitle}>{t('tickets.no_bookings')}</Text>
                    <Text style={styles.emptySubtitle}>{t('tickets.no_bookings_desc')}</Text>
                </View>
            ) : (
                <FlatList
                    data={tickets}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.list}
                />
            )}
        </SafeAreaView>
    );
}

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
    backButton: { padding: 4 },
    title: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text.primary },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    list: { padding: 16 },
    ticketCard: { backgroundColor: theme.colors.surface, borderRadius: 24, marginBottom: 24, overflow: 'hidden', ...theme.shadows.card, borderWidth: 1, borderColor: theme.colors.border },
    ticketHeader: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: theme.colors.primary + '08' },
    placeName: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text.primary },
    bookingId: { fontSize: 12, color: theme.colors.text.tertiary, marginTop: 4, letterSpacing: 1 },
    statusBadge: { backgroundColor: theme.colors.success + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { color: theme.colors.success, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
    ticketDivider: { height: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' },
    dashLine: { flex: 1, height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: theme.colors.border, marginHorizontal: 10 },
    dentLeft: { width: 20, height: 20, borderRadius: 10, backgroundColor: theme.colors.background, marginLeft: -10 },
    dentRight: { width: 20, height: 20, borderRadius: 10, backgroundColor: theme.colors.background, marginRight: -10 },
    ticketBody: { padding: 20 },
    infoRow: { flexDirection: 'row', marginBottom: 16 },
    infoCol: { flex: 1 },
    infoLabel: { fontSize: 10, color: theme.colors.text.tertiary, textTransform: 'uppercase', marginBottom: 4 },
    infoText: { fontSize: 14, fontWeight: 'bold', color: theme.colors.text.primary },
    qrPlaceholder: { padding: 20, alignItems: 'center', backgroundColor: theme.colors.surface, borderTopWidth: 1, borderTopColor: theme.colors.border },
    qrText: { fontSize: 12, color: theme.colors.text.secondary, marginTop: 8, fontWeight: '600' },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text.primary, marginTop: 20 },
    emptySubtitle: { fontSize: 14, color: theme.colors.text.secondary, textAlign: 'center', marginTop: 8 },
});
