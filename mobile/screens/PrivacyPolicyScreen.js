import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function PrivacyPolicyScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const styles = createStyles(theme, isDarkMode);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.lastUpdated}>Last Updated: March 15, 2026</Text>

                <Section title="1. Introduction">
                    Welcome to Swadeshi Yatra. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at support@swadeshiyatra.com.
                </Section>

                <Section title="2. Information We Collect">
                    We collect personal information that you voluntarily provide to us when you register on the App, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.
                    {"\n\n"}
                    The personal information we collect depends on the context of your interactions with us and the App, the choices you make and the products and features you use. The personal information we collect can include the following:
                    {"\n\n"}
                    - Name and Contact Data (Email, Phone)
                    - Credentials (Passwords)
                    - Location Data (GPS coordinates for nearby recommendations)
                </Section>

                <Section title="3. How We Use Your Information">
                    We use personal information collected via our App for a variety of business purposes described below:
                    {"\n\n"}
                    - To facilitate account creation and logon process.
                    - To provide the Smart Tourist Guide features based on your location.
                    - To send administrative information to you.
                    - To fulfill and manage your bookings (Tickets/Tours).
                </Section>

                <Section title="4. Sharing Your Information">
                    We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
                    {"\n\n"}
                    Specifically, when you book a ticket or contact a guide, your necessary contact information is shared with that specific provider to facilitate the service.
                </Section>

                <Section title="5. Data Security">
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                </Section>

                <Section title="6. Contact Us">
                    If you have questions or comments about this policy, you may email us at support@swadeshiyatra.com.
                </Section>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2026 Swadeshi Yatra. All rights reserved.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function Section({ title, children }) {
    const { theme } = useTheme();
    return (
        <View style={styles_component.section}>
            <Text style={[styles_component.sectionTitle, { color: theme.colors.primary }]}>{title}</Text>
            <Text style={[styles_component.sectionContent, { color: theme.colors.text.secondary }]}>{children}</Text>
        </View>
    );
}

const styles_component = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionContent: {
        fontSize: 15,
        lineHeight: 22,
    }
});

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
    lastUpdated: {
        fontSize: 12,
        color: theme.colors.text.tertiary,
        marginBottom: 24,
        fontStyle: 'italic',
    },
    footer: {
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        alignItems: 'center',
        marginBottom: 40,
    },
    footerText: {
        fontSize: 12,
        color: theme.colors.text.tertiary,
    }
});
