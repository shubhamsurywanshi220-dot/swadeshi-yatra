import axios from 'axios';
import { Platform } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { NativeModules } from 'react-native';

// START CONFIGURATION
// Production backend URL (deployed on Render)
const PRODUCTION_URL = 'https://swadeshi-yatra.onrender.com/api';

let BASE_URL = PRODUCTION_URL;

if (__DEV__) {
    // 🚀 We are forcing the local IP address because loopback (10.0.2.2) doesn't work on physical Wi-Fi devices.
    // If your internet IP changes, you need to update this to match your laptop's current IPv4 address.
    BASE_URL = 'http://10.230.101.131:5000/api';
    console.log('✅ [API] Hardcoded physical device IP:', BASE_URL);
}

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
