import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './translations/en.json';
import hi from './translations/hi.json';
import kn from './translations/kn.json';

const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: async (callback) => {
        try {
            const savedLanguage = await AsyncStorage.getItem('user_language');
            if (savedLanguage) {
                console.log('[i18n] Detected saved language:', savedLanguage);
                return callback(savedLanguage);
            }
            
            // Fallback to English but setup for future system detection
            console.log('[i18n] No saved language found, falling back to: en');
            callback('en');
        } catch (error) {
            console.error('[i18n] Error detecting language:', error);
            callback('en');
        }
    },
    init: () => { },
    cacheUserLanguage: async (lng) => {
        try {
            await AsyncStorage.setItem('user_language', lng);
            console.log('[i18n] Cached user language:', lng);
        } catch (error) {
            console.error('[i18n] Error caching language:', error);
        }
    },
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            hi: { translation: hi },
            kn: { translation: kn },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
