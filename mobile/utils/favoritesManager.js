import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@swadeshi_favorites';

export const FavoritesManager = {
    // Get all favorites
    async getFavorites() {
        try {
            const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
            return favoritesJson ? JSON.parse(favoritesJson) : [];
        } catch (error) {
            console.error('Error getting favorites:', error);
            return [];
        }
    },

    // Add a place to favorites
    async addFavorite(place) {
        try {
            const favorites = await this.getFavorites();
            const placeId = place._id || place.id;

            // Check if already exists
            const exists = favorites.some(fav => (fav._id || fav.id) === placeId);
            if (exists) {
                return favorites;
            }

            favorites.push(place);
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            return favorites;
        } catch (error) {
            console.error('Error adding favorite:', error);
            throw error;
        }
    },

    // Remove a place from favorites
    async removeFavorite(placeId) {
        try {
            const favorites = await this.getFavorites();
            const filtered = favorites.filter(fav => (fav._id || fav.id) !== placeId);
            await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
            return filtered;
        } catch (error) {
            console.error('Error removing favorite:', error);
            throw error;
        }
    },

    // Check if a place is favorited
    async isFavorite(placeId) {
        try {
            const favorites = await this.getFavorites();
            return favorites.some(fav => (fav._id || fav.id) === placeId);
        } catch (error) {
            console.error('Error checking favorite:', error);
            return false;
        }
    },

    // Clear all favorites
    async clearFavorites() {
        try {
            await AsyncStorage.removeItem(FAVORITES_KEY);
        } catch (error) {
            console.error('Error clearing favorites:', error);
        }
    }
};
