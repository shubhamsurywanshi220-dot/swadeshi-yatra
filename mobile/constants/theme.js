// Palette for Light Mode
const lightColors = {
    primary: '#F4511E', // Warm Orange
    secondary: '#1E1E1E', // Near Black
    background: '#F8F9FB', // Soft Grey-White
    surface: '#FFFFFF', // Pure White for Cards
    surfaceVariant: '#F1F3F4',
    text: {
        primary: '#212121', // Text Main
        secondary: '#757575', // Text Sub
        tertiary: '#BDBDBD', // Lighter for inactive icons/labels
        light: '#FFFFFF',
    },
    border: '#EDEDED',
    accent: '#F4511E',
    error: '#B00020',
    success: '#4CAF50',
    overlay: 'rgba(0, 0, 0, 0.4)',
    gradients: {
        primary: ['#F4511E', '#E64A19'],
        secondary: ['#212121', '#000000'],
        accent: ['#FF7043', '#F4511E'],
        card: ['#FFFFFF', '#F8F9FB'],
    }
};

// Palette for Dark Mode
const darkColors = {
    primary: '#FF7043', // Lighter Orange for Dark Mode
    secondary: '#E0E0E0',
    background: '#0F0F0F',
    surface: '#1A1A1A',
    surfaceVariant: '#2C2C2C',
    text: {
        primary: '#F5F5F5',
        secondary: '#B0B0B0',
        tertiary: '#808080',
        light: '#0F0F0F',
    },
    border: '#2C2C2C',
    accent: '#FF7043',
    error: '#CF6679',
    success: '#81C784',
    overlay: 'rgba(0, 0, 0, 0.7)',
    gradients: {
        primary: ['#F4511E', '#BF360C'],
        secondary: ['#1E1E1E', '#000000'],
        accent: ['#FF8A65', '#FF7043'],
        card: ['#1A1A1A', '#242424'],
    }
};

const sharedValues = {
    iconSizes: { xs: 16, s: 20, m: 24, l: 32, xl: 40, xxl: 56 },
    spacing: { xs: 4, s: 8, m: 16, l: 24, xl: 32, xxl: 48 },
    padding: { screen: 20, section: 32, card: 16 }, // Luxury spacing
    radius: { s: 8, m: 16, l: 24, xl: 28, round: 999 },
    typography: {
        greeting: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
        sectionTitle: { fontSize: 19, fontWeight: '700', lineHeight: 26 }, // SemiBold + 1sp
        cardTitle: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
        cardSubtitle: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
        body: { fontSize: 15, lineHeight: 22 },
        caption: { fontSize: 12, lineHeight: 16 },
    },
    shadows: {
        card: {
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.05, // Lower opacity
            shadowRadius: 16, // Higher blur
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.02)',
        },
        search: {
            elevation: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
        },
        float: {
            elevation: 8,
            shadowColor: '#F4511E',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
        },
        soft: {
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
        },
    }
};

export const lightTheme = {
    ...sharedValues,
    colors: lightColors,
    typography: {
        ...sharedValues.typography,
        greeting: { ...sharedValues.typography.greeting, color: lightColors.text.primary },
        sectionTitle: { ...sharedValues.typography.sectionTitle, color: lightColors.text.primary },
        cardTitle: { ...sharedValues.typography.cardTitle, color: lightColors.text.primary },
        cardSubtitle: { ...sharedValues.typography.cardSubtitle, color: lightColors.text.secondary },
        body: { ...sharedValues.typography.body, color: lightColors.text.secondary },
        caption: { ...sharedValues.typography.caption, color: lightColors.text.tertiary },
    }
};

export const darkTheme = {
    ...sharedValues,
    colors: darkColors,
    typography: {
        ...sharedValues.typography,
        greeting: { ...sharedValues.typography.greeting, color: darkColors.text.primary },
        sectionTitle: { ...sharedValues.typography.sectionTitle, color: darkColors.text.primary },
        cardTitle: { ...sharedValues.typography.cardTitle, color: darkColors.text.primary },
        cardSubtitle: { ...sharedValues.typography.cardSubtitle, color: darkColors.text.secondary },
        body: { ...sharedValues.typography.body, color: darkColors.text.secondary },
        caption: { ...sharedValues.typography.caption, color: darkColors.text.tertiary },
    },
    shadows: {
        ...sharedValues.shadows,
        card: { ...sharedValues.shadows.card, borderColor: darkColors.border, shadowOpacity: 0.3, shadowColor: '#000' }
    }
};

// Default export for backwards compatibility (temporary)
export const theme = lightTheme;
