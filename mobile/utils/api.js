import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🌐 BASE CONFIGURATION
const PRODUCTION_URL = 'https://swadeshi-yatra.onrender.com/api';

// 🚀 RECOVERY LOGIC: If you see a new URL in your tunnel terminal, paste it here!
const CURRENT_TUNNEL = 'https://slimy-hotels-smell.loca.lt/api'; 
const LOCAL_DEV_IP = '10.161.202.131'; 

let BASE_URL = PRODUCTION_URL;

if (__DEV__) {
    // We prioritize the tunnel as it's the most reliable for physical devices
    BASE_URL = CURRENT_TUNNEL;
    
    console.log('📡 [API] ATTEMPTING CONNECTION:', BASE_URL);
}

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 20000, // Increased timeout for slow tunnels
    headers: {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true',
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'SwadeshiYatra-Mobile'
    }
});

// Interceptor for debugging and tokens
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('@auth_token');
    if (token) config.headers['x-auth-token'] = token;
    return config;
});

// Response interceptor to catch specific network errors
api.interceptors.response.use(
    response => response,
    error => {
        if (!error.response) {
            console.log('🛑 [NETWORK ERROR] No response from server. Is the tunnel window open? URL:', BASE_URL);
        } else {
            console.log('🛑 [SERVER ERROR]', error.response.status, error.response.data);
        }
        return Promise.reject(error);
    }
);

export { BASE_URL };
export default api;
