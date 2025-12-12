// Simple i18n implementation
const translations = {
    en: {
        welcome: 'Welcome',
        destinations: 'Destinations',
        explore: 'Explore',
        sos: 'Emergency SOS'
    },
    hi: {
        welcome: 'स्वागत हे',
        destinations: 'गंतव्य',
        explore: 'अन्वेषण करें',
        sos: 'आपातकालीन एसओएस'
    }
};

let currentLocale = 'en';

export const i18n = {
    t: (key) => translations[currentLocale][key] || key,
    setLocale: (locale) => { currentLocale = locale; }
};
