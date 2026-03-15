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
        const savedLanguage = await AsyncStorage.getItem('user_language');
        if (savedLanguage) {
            callback(savedLanguage);
        } else {
            callback('en');
        }
    },
    init: () => { },
    cacheUserLanguage: async (lng) => {
        await AsyncStorage.setItem('user_language', lng);
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
