import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const TabItem = ({ tab, isActive, onPress, theme }) => {
    const scaleAnim = React.useRef(new Animated.Value(isActive ? 1.15 : 1)).current;

    React.useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: isActive ? 1.15 : 1,
            useNativeDriver: true,
            friction: 4,
        }).start();
    }, [isActive]);

    return (
        <TouchableOpacity
            style={styles.tab}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Animated.View style={[
                styles.iconCircle,
                isActive && { backgroundColor: theme.colors.primary + '20' },
                { transform: [{ scale: scaleAnim }] }
            ]}>
                {tab.iconLibrary === 'Ionicons' ? (
                    <Ionicons
                        name={isActive ? tab.iconName : `${tab.iconName}-outline`}
                        size={24}
                        color={isActive ? theme.colors.primary : theme.colors.text.tertiary}
                    />
                ) : (
                    <MaterialCommunityIcons
                        name={isActive ? tab.iconName : `${tab.iconName}-outline`}
                        size={24}
                        color={isActive ? theme.colors.primary : theme.colors.text.tertiary}
                    />
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

export default function BottomTabs({ currentScreen, navigate }) {
    const { theme, isDarkMode } = useTheme();
    const tabs = [
        { key: 'Home', label: 'Home', iconName: 'home', iconLibrary: 'Ionicons' },
        { key: 'Explore', label: 'Explore', iconName: 'earth', iconLibrary: 'Ionicons', params: { category: 'destinations' } },
        { key: 'SOS', label: 'SOS', iconName: 'alert-circle', iconLibrary: 'MaterialCommunityIcons' },
        { key: 'Profile', label: 'Profile', iconName: 'person', iconLibrary: 'Ionicons' },
    ];

    const styles = createStyles(theme, isDarkMode);

    return (
        <View style={styles.container}>
            {tabs.map((tab) => (
                <TabItem
                    key={tab.key}
                    tab={tab}
                    isActive={currentScreen === tab.key}
                    onPress={() => navigate(tab.key, tab.params)}
                    theme={theme}
                />
            ))}
        </View>
    );
}

const createStyles = (theme, isDarkMode) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        height: 76,
        paddingHorizontal: 24,
        ...theme.shadows.elevated,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 25,
        shadowColor: isDarkMode ? '#000' : '#AAA',
        borderTopWidth: isDarkMode ? 1 : 0,
        borderTopColor: theme.colors.border,
    },
});

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
