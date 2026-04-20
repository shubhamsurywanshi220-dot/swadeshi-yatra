import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

// Map weather main condition to icon and emoji
const getWeatherIcon = (weather) => {
    const w = weather.toLowerCase();
    if (w.includes('rain')) return { icon: 'rainy-outline', emoji: '🌧️', color: '#4FC3F7' };
    if (w.includes('cloud')) return { icon: 'cloud-outline', emoji: '☁️', color: '#B0BEC5' };
    if (w.includes('clear')) return { icon: 'sunny-outline', emoji: '☀️', color: '#FFB300' };
    if (w.includes('snow')) return { icon: 'snow-outline', emoji: '❄️', color: '#E0F7FA' };
    if (w.includes('storm') || w.includes('thunder')) return { icon: 'thunderstorm-outline', emoji: '⛈️', color: '#5C6BC0' };
    return { icon: 'partly-sunny-outline', emoji: '⛅', color: '#FFB300' };
};

const getCrowdStyle = (crowd, theme) => {
    switch(crowd) {
        case 'Low': return { color: '#66BB6A', icon: 'people-outline' };
        case 'Medium': return { color: '#FFA726', icon: 'people' };
        case 'High': return { color: '#EF5350', icon: 'people' };
        case 'Very High': return { color: '#D32F2F', icon: 'people' };
        default: return { color: theme.colors.text.secondary, icon: 'people-outline' };
    }
};

const estimateCrowd = (dateStr, weatherMain) => {
    const day = new Date(dateStr).getDay();
    const isWeekend = day === 0 || day === 6;
    const isRainy = weatherMain.toLowerCase().includes('rain') || weatherMain.toLowerCase().includes('storm');
    const isClear = weatherMain.toLowerCase().includes('clear');

    if (isRainy) return 'Low';
    if (isWeekend && isClear) return 'Very High';
    if (isWeekend) return 'High';
    return 'Medium';
};

const generateSuggestion = (crowd, weather, dayOfWeek) => {
    if (crowd === 'Low' && weather.toLowerCase().includes('clear')) {
        return `Best day to visit: ${dayOfWeek} (Good weather + Low crowd)`;
    } else if (crowd === 'Very High' || crowd === 'High') {
        return `Avoid if possible: ${dayOfWeek} (Heavy crowd expected)`;
    } else if (weather.toLowerCase().includes('rain')) {
        return `Bring an umbrella: ${dayOfWeek} (Rain expected, but low crowd)`;
    }
    return `Good day to visit: ${dayOfWeek} (Moderate conditions)`;
};

const getDayOfWeek = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const getFullDayOfWeek = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export default function SmartTravelCalendarCard({ latitude, longitude }) {
    const { theme, isDarkMode } = useTheme();
    const [forecasts, setForecasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const [selectedDay, setSelectedDay] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchWeather();
    }, [latitude, longitude]);

    const fetchWeather = async () => {
        setLoading(true);
        setError(false);
        try {
            if (!latitude || !longitude) throw new Error("Missing coordinates");
            
            // If no API key, use fallback mock data for testing
            if (!WEATHER_API_KEY) {
                console.warn("No EXPO_PUBLIC_WEATHER_API_KEY found. Using mock data for Smart Calendar.");
                useMockData();
                return;
            }

            const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`);
            
            // Extract one forecast per day (closest to noon)
            const daily = {};
            res.data.list.forEach(item => {
                const dateStr = item.dt_txt.split(' ')[0];
                if (!daily[dateStr] || item.dt_txt.includes('12:00:00')) {
                    daily[dateStr] = item;
                }
            });

            const parsedData = Object.values(daily).slice(0, 5).map(item => {
                const dateParts = item.dt_txt.split(' ')[0];
                const weatherMain = item.weather[0].main;
                return {
                    date: dateParts,
                    dayShort: getDayOfWeek(dateParts),
                    dayFull: getFullDayOfWeek(dateParts),
                    temp: Math.round(item.main.temp),
                    weather: weatherMain,
                    description: item.weather[0].description,
                    crowd: estimateCrowd(item.dt_txt, weatherMain),
                    ...getWeatherIcon(weatherMain)
                };
            });

            setForecasts(parsedData);
        } catch (err) {
            console.error("Failed to fetch weather:", err);
            // Fallback to mock data on error so UI doesn't break
            useMockData();
        } finally {
            setLoading(false);
        }
    };

    const useMockData = () => {
        const today = new Date();
        const mocks = [];
        for(let i=0; i<5; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const weathers = ['Clear', 'Clouds', 'Rain', 'Clear', 'Clouds'];
            const weatherMain = weathers[i % weathers.length];
            mocks.push({
                date: dateStr,
                dayShort: getDayOfWeek(dateStr),
                dayFull: getFullDayOfWeek(dateStr),
                temp: 20 + Math.floor(Math.random() * 15),
                weather: weatherMain,
                description: `${weatherMain.toLowerCase()} sky`,
                crowd: estimateCrowd(dateStr, weatherMain),
                ...getWeatherIcon(weatherMain)
            });
        }
        setForecasts(mocks);
        setError(true);
    };

    const handleDayTap = (day) => {
        setSelectedDay(day);
        setModalVisible(true);
    };

    const styles = createStyles(theme, isDarkMode);

    if (loading) {
        return (
            <View style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                    <Ionicons name="calendar" size={16} color={theme.colors.primary} />
                    <Text style={styles.headerTitle}>Smart Calendar</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <Ionicons name="calendar" size={16} color={theme.colors.primary} />
                <Text style={styles.headerTitle}>Smart Calendar</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {forecasts.map((day, idx) => (
                    <TouchableOpacity key={idx} style={styles.dayCard} onPress={() => handleDayTap(day)}>
                        <Text style={styles.dayText}>{day.dayShort}</Text>
                        <Text style={styles.emojiText}>{day.emoji}</Text>
                        <Text style={styles.tempText}>{day.temp}°C</Text>
                        <View style={styles.crowdRow}>
                            <Ionicons name={getCrowdStyle(day.crowd, theme).icon} size={10} color={getCrowdStyle(day.crowd, theme).color} />
                            <Text style={[styles.crowdText, { color: getCrowdStyle(day.crowd, theme).color }]}>{day.crowd}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Modal for detailed view */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
                    {selectedDay && (
                        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{selectedDay.dayFull}</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={24} color={theme.colors.text.primary} />
                                </TouchableOpacity>
                            </View>
                            
                            <Text style={styles.modalDate}>{selectedDay.date}</Text>

                            <View style={styles.modalRow}>
                                <View style={styles.modalIconBox}>
                                    <Text style={styles.modalBigEmoji}>{selectedDay.emoji}</Text>
                                    <Text style={styles.modalTemp}>{selectedDay.temp}°C</Text>
                                    <Text style={styles.modalWeatherDesc}>{selectedDay.description}</Text>
                                </View>
                                
                                <View style={styles.modalInfoBox}>
                                    <Text style={styles.modalInfoLabel}>Expected Crowd</Text>
                                    <View style={styles.modalCrowdTag}>
                                        <Ionicons name={getCrowdStyle(selectedDay.crowd, theme).icon} size={16} color={getCrowdStyle(selectedDay.crowd, theme).color} />
                                        <Text style={[styles.modalCrowdValue, { color: getCrowdStyle(selectedDay.crowd, theme).color }]}>{selectedDay.crowd}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.suggestionBox}>
                                <Ionicons name="bulb-outline" size={20} color={theme.colors.primary} />
                                <Text style={styles.suggestionText}>
                                    {generateSuggestion(selectedDay.crowd, selectedDay.weather, selectedDay.dayFull)}
                                </Text>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    cardContainer: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: 12,
        ...theme.shadows.soft,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        justifyContent: 'center',
        gap: 6,
    },
    headerTitle: {
        fontSize: 10,
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: 'bold',
    },
    loadingContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    scrollContent: {
        gap: 8,
    },
    dayCard: {
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F7FA',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        minWidth: 60,
    },
    dayText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    emojiText: {
        fontSize: 18,
        marginBottom: 4,
    },
    tempText: {
        fontSize: 12,
        color: theme.colors.text.primary,
        fontWeight: '600',
        marginBottom: 4,
    },
    crowdRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    crowdText: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: theme.colors.background,
        borderRadius: 16,
        padding: 20,
        ...theme.shadows.elevated,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    modalDate: {
        fontSize: 14,
        color: theme.colors.text.secondary,
        marginBottom: 20,
    },
    modalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    modalIconBox: {
        alignItems: 'center',
        flex: 1,
    },
    modalBigEmoji: {
        fontSize: 48,
        marginBottom: 8,
    },
    modalTemp: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    modalWeatherDesc: {
        fontSize: 14,
        color: theme.colors.text.secondary,
        textTransform: 'capitalize',
    },
    modalInfoBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderLeftColor: theme.colors.border,
        paddingLeft: 16,
    },
    modalInfoLabel: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    modalCrowdTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#2C2C2C' : '#F0F0F0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    modalCrowdValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    suggestionBox: {
        flexDirection: 'row',
        backgroundColor: isDarkMode ? '#1E293B' : '#E0F2FE',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        gap: 12,
    },
    suggestionText: {
        flex: 1,
        fontSize: 14,
        color: isDarkMode ? '#38BDF8' : '#0284C7',
        fontWeight: '600',
        lineHeight: 20,
    }
});
