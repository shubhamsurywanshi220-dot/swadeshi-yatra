import axios from 'axios';
import { Platform } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

// START CONFIGURATION
// Production backend URL (deployed on Render)
const PRODUCTION_URL = 'https://swadeshi-yatra.onrender.com/api';

// Local backend URL (Use your machine's local IP for physical devices)
// Current Machine IP: 10.46.191.131
const DEV_URL = 'http://10.46.191.131:5000/api';
const EMULATOR_URL = 'http://10.0.2.2:5000/api';

// Set this to DEV_URL if testing on a physical device, or EMULATOR_URL for Android Emulator
const BASE_URL = DEV_URL;

console.log('[API] Using Base URL:', BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('@auth_token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
