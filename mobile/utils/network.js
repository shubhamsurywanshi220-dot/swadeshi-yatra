import axios from 'axios';

/**
 * Simple utility to check if the device has internet connectivity.
 * It attempts to fetch a small response from a reliable endpoint.
 */
export const checkConnectivity = async () => {
    try {
        // Try to hit a reliable public DNS or the app's own backend
        // Use a very short timeout to avoid blocking the UI
        await axios.get('https://8.8.8.8', { timeout: 3000 });
        return true;
    } catch (error) {
        // If it's a timeout or network error, we're likely offline
        return false;
    }
};
