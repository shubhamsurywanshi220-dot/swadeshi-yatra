import axios from 'axios';
import { Platform } from 'react-native';

// START CONFIGURATION
// -------------------
// For Android Emulator, use 'http://10.0.2.2:5000'
// For Real Device (LAN), use your computer's IP: 'http://192.168.x.x:5000'
// For iOS Simulator, use 'http://localhost:5000'

const DEV_BACKEND_URL = Platform.select({
    android: 'http://10.0.2.2:5000', // Default for Android Emulator
    ios: 'http://localhost:5000',
    default: 'http://localhost:5000',
});

// AUTOMATICALLY CONFIGURED FOR PHYSICAL DEVICE
const BASE_URL = 'http://192.168.137.29:5000/api';
// const BASE_URL = `${DEV_BACKEND_URL}/api`;

console.log(`[API] Using Base URL: ${BASE_URL}`);

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
