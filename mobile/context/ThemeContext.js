import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../constants/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [theme, setTheme] = useState(lightTheme);

    // Load saved preference on mount
    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const savedMode = await AsyncStorage.getItem('darkMode');
            if (savedMode !== null) {
                const isDark = JSON.parse(savedMode);
                setIsDarkMode(isDark);
                setTheme(isDark ? darkTheme : lightTheme);
            }
        } catch (error) {
            console.log('Error loading theme:', error);
        }
    };

    const toggleTheme = async () => {
        try {
            const newMode = !isDarkMode;
            setIsDarkMode(newMode);
            setTheme(newMode ? darkTheme : lightTheme);
            await AsyncStorage.setItem('darkMode', JSON.stringify(newMode));
        } catch (error) {
            console.log('Error saving theme:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
