const os = require('os');
const fs = require('fs');
const path = require('path');

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    let bestIp = null;
    
    // Try to find a Wi-Fi or Ethernet IPv4
    for (const name of Object.keys(interfaces)) {
        // Skip hidden/virtual network adapters like WSL or VirtualBox usually
        if (name.toLowerCase().includes('veth') || name.toLowerCase().includes('wsl') || name.toLowerCase().includes('virtual')) {
            continue;
        }
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                bestIp = iface.address;
                // If it's a Wi-Fi connection, prioritize it
                if (name.toLowerCase().includes('wi-fi')) {
                    return bestIp;
                }
            }
        }
    }
    
    // Fallback to whatever external IPv4 we found
    if (bestIp) return bestIp;
    
    // Absolute fallback
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '192.168.1.something';
}

const ip = getLocalIp();
console.log(`\n========================================`);
console.log(`🌍 Detected your Local IP: ${ip}`);
console.log(`========================================\n`);

const apiFile = path.join(__dirname, 'mobile', 'utils', 'api.js');

try {
    let content = fs.readFileSync(apiFile, 'utf8');
    
    // Search for the if (__DEV__) block using a more robust pattern
    const rx = /if\s*\(__DEV__\)\s*\{[\s\S]*?\}/;
    
    const newBlock = `if (__DEV__) {
    // 🚀 Auto-configured IP address for local network testing
    BASE_URL = 'http://${ip}:5005/api';
    console.log('✅ [API] Hardcoded local dev IP:', '${ip}');
}`;

    if (rx.test(content)) {
        content = content.replace(rx, newBlock);
        fs.writeFileSync(apiFile, content, 'utf8');
        console.log(`✅ SUCCESS: Updated mobile/utils/api.js with ${ip}`);
        console.log(`📱 Your Expo app will now connect directly to http://${ip}:5005/api`);
    } else {
        console.log(`⚠️ WARNING: Could not auto-replace IP in api.js. The structure might have changed.`);
    }
} catch (err) {
    console.log(`❌ ERROR: Could not read or write mobile/utils/api.js:`, err.message);
}
