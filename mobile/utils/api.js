import axios from 'axios';
import { Platform } from 'react-native';

// START CONFIGURATION
// Production backend URL (deployed on Render)
const PRODUCTION_URL = 'https://swadeshi-yatra.onrender.com/api';

// Local backend URL for Self-Hosted Image Testing (Use 10.0.2.2 for Android Emulator, localhost for iOS/Web)
const LOCAL_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

// Use production URL for all environments
const BASE_URL = PRODUCTION_URL;

console.log('[API] Using Base URL:', BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
