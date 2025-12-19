import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const FAQItem = ({ question, answer, theme, styles }) => {
    const [expanded, setExpanded] = React.useState(false);
    return (
        <TouchableOpacity
            style={styles.faqItem}
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.7}
        >
            <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{question}</Text>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.colors.text.tertiary}
                />
            </View>
            {expanded && <Text style={styles.faqAnswer}>{answer}</Text>}
        </TouchableOpacity>
    );
};

export default function HelpSupportScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const styles = createStyles(theme, isDarkMode);

    const contactOptions = [
        {
            icon: 'mail-outline',
            title: 'Email Us',
            subtitle: 'support@swadeshiyatra.in',
            color: '#4285F4',
            onPress: () => Linking.openURL('mailto:support@swadeshiyatra.in')
        },
        {
            icon: 'call-outline',
            title: 'Call Support',
            subtitle: '1800-SWADESHI',
            color: '#34A853',
            onPress: () => Linking.openURL('tel:1800-588-444')
        },
        {
            icon: 'chatbubble-ellipses-outline',
            title: 'Live Chat',
            subtitle: 'Available 9AM - 6PM',
            color: '#FBBC05',
            onPress: () => { }
        },
    ];

    const faqs = [
        {
            question: "What is Swadeshi Yatra?",
            answer: "Swadeshi Yatra is an initiative to promote domestic tourism and local businesses in India, helping travelers discover hidden gems while supporting local communities."
        },
        {
            question: "How do I add a place to favorites?",
            answer: "You can add any place to your favorites by tapping the heart icon on the place card or detail screen. Your favorites are accessible from your profile."
        },
        {
            question: "What is the SOS feature?",
            answer: "The SOS feature allows you to send an emergency alert with your live location to authorities and emergency contacts in case of danger."
        },
        {
            question: "Is my data secure?",
            answer: "Yes, we prioritize your privacy and security. Your location is only shared when you use the SOS feature or search for nearby places."
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Contact Section */}
                <Text style={styles.sectionTitle}>Contact Us</Text>
                <View style={styles.contactGrid}>
                    {contactOptions.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.contactCard}
                            onPress={option.onPress}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: option.color + '15' }]}>
                                <Ionicons name={option.icon} size={28} color={option.color} />
                            </View>
                            <Text style={styles.contactTitle}>{option.title}</Text>
                            <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* FAQ Section */}
                <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Frequently Asked Questions</Text>
                <View style={styles.faqContainer}>
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} {...faq} theme={theme} styles={styles} />
                    ))}
                </View>

                {/* Feedback Button */}
                <TouchableOpacity style={styles.feedbackButton}>
                    <MaterialCommunityIcons name="message-draw" size={24} color="#FFF" />
                    <Text style={styles.feedbackText}>Send Feedback</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
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
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    scrollContent: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: 16,
    },
    contactGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    contactCard: {
        backgroundColor: theme.colors.surface,
        width: '48%',
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: 16,
        ...theme.shadows.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    contactTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    contactSubtitle: {
        fontSize: 12,
        color: theme.colors.text.tertiary,
        textAlign: 'center',
    },
    faqContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 8,
        ...theme.shadows.soft,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    faqItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.text.primary,
        flex: 1,
        marginRight: 10,
    },
    faqAnswer: {
        fontSize: 14,
        color: theme.colors.text.secondary,
        marginTop: 12,
        lineHeight: 20,
    },
    feedbackButton: {
        marginTop: 32,
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 10,
        ...theme.shadows.elevated,
    },
    feedbackText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
