export const theme = {
    colors: {
        primary: '#D84315', // Deep Saffron/Terracotta - Kept for identity
        secondary: '#00695C', // Emerald/Teal
        background: '#F8F9FA', // Modern Light Gray (Changed from Warm Cream)
        surface: '#FFFFFF', // White
        surfaceVariant: '#F1F3F4', // Slightly darker surface for inputs/chips
        text: {
            primary: '#1A1C1E', // Softer Black
            secondary: '#444746', // Dark Gray
            tertiary: '#747775', // Light Gray
            light: '#FFFFFF',
        },
        border: '#E0E3E7',
        accent: '#FF6F00', // Amber/Orange
        error: '#BA1A1A',
        success: '#146C2E',
        overlay: 'rgba(0, 0, 0, 0.5)',

        // Gradients for modern UI
        gradients: {
            primary: ['#FF6F00', '#D84315'],
            secondary: ['#00897B', '#00695C'],
            accent: ['#FF8A50', '#FF6F00'],
            card: ['#FFFFFF', '#F8F9FA'],
        },
    },
    iconSizes: {
        xs: 16,
        s: 20,
        m: 24,
        l: 32,
        xl: 48,
        xxl: 64,
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    radius: {
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        round: 999,
    },
    typography: {
        header: {
            fontSize: 24,
            fontWeight: '700',
            letterSpacing: -0.5,
            color: '#1A1C1E',
        },
        subHeader: {
            fontSize: 18,
            fontWeight: '600',
            color: '#1A1C1E',
        },
        body: {
            fontSize: 15,
            lineHeight: 22,
            color: '#444746',
        },
        caption: {
            fontSize: 12,
            color: '#747775',
        },
    },
    shadows: {
        card: {
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            borderWidth: 1,
            borderColor: '#E0E3E7',
        },
        float: {
            elevation: 6,
            shadowColor: '#D84315',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
        },
        elevated: {
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
        },
        soft: {
            elevation: 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
        },
    },
};
