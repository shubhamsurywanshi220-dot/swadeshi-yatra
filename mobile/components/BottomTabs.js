import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export default function BottomTabs({ currentScreen, navigate }) {
    const tabs = [
        { key: 'Home', label: 'Home', iconName: 'home', iconLibrary: 'Ionicons' },
        { key: 'Places', label: 'Explore', iconName: 'earth', iconLibrary: 'Ionicons', params: { category: 'destinations' } },
        { key: 'SOS', label: 'SOS', iconName: 'alert-circle', iconLibrary: 'MaterialCommunityIcons' },
        { key: 'Profile', label: 'Profile', iconName: 'person', iconLibrary: 'Ionicons' },
    ];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = currentScreen === tab.key || (currentScreen === 'Places' && tab.key === 'Places'); // Handle Places sub-categories better later if needed

                return (
                    <TouchableOpacity
                        key={tab.key}
                        style={styles.tab}
                        onPress={() => navigate(tab.key, tab.params)}
                    >
                        {tab.iconLibrary === 'Ionicons' ? (
                            <Ionicons
                                name={isActive ? tab.iconName : `${tab.iconName}-outline`}
                                size={24}
                                color={isActive ? theme.colors.primary : theme.colors.text.secondary}
                                style={styles.icon}
                            />
                        ) : (
                            <MaterialCommunityIcons
                                name={isActive ? tab.iconName : `${tab.iconName}-outline`}
                                size={24}
                                color={isActive ? theme.colors.primary : theme.colors.text.secondary}
                                style={styles.icon}
                            />
                        )}
                        <Text style={[styles.label, isActive && styles.activeLabel]}>
                            {tab.label}
                        </Text>
                        {isActive && <View style={styles.indicator} />}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        paddingVertical: 12,
        paddingHorizontal: 20,
        ...theme.shadows.float, // Floating shadow effect
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 20, // High elevation for Android
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginBottom: 4,
    },
    label: {
        fontSize: 10,
        color: theme.colors.text.secondary,
        fontWeight: '500',
    },
    activeLabel: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    indicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.primary,
        position: 'absolute',
        bottom: -8, // Position below the label
    }
});
