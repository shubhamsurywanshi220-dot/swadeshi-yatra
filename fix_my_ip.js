const os = require('os');
const fs = require('fs');
const path = require('path');

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    let bestIp = null;
    
    for (const name of Object.keys(interfaces)) {
        // Skip virtual adapters
        if (name.toLowerCase().includes('veth') || name.toLowerCase().includes('wsl') || name.toLowerCase().includes('virtual')) continue;
        
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                // Prioritize Wi-Fi
                if (name.toLowerCase().includes('wi-fi')) return iface.address;
                bestIp = iface.address;
            }
        }
    }
    return bestIp;
}

const ip = getLocalIp();
if (!ip) {
    console.log("❌ Could not detect a local IP. Are you connected to Wi-Fi?");
    process.exit(1);
}

console.log(`\n🌍 Your Real IP is: ${ip}`);

const apiFile = path.join(__dirname, 'mobile', 'utils', 'api.js');

try {
    let content = fs.readFileSync(apiFile, 'utf8');
    
    // Look for the LOCAL_IP line I added earlier
    const rx = /const LOCAL_IP = '.*?';/;
    const newContent = content.replace(rx, `const LOCAL_IP = '${ip}';`);
    
    if (content !== newContent) {
        fs.writeFileSync(apiFile, newContent, 'utf8');
        console.log(`✅ SUCCESS: Updated mobile/utils/api.js with IP: ${ip}`);
        console.log(`📱 Now just press 'r' in your Expo terminal to reload the app!`);
    } else {
        console.log(`⚠️ Warning: Could not find the LOCAL_IP line to replace. Updating manually...`);
        // Fallback replacement for the whole __DEV__ block if line not found
        const fallbackRx = /if\s*\(__DEV__\)\s*\{[\s\S]*?\}/;
        const newBlock = `if (__DEV__) {
    const LOCAL_IP = '${ip}';
    BASE_URL = \`http://\${LOCAL_IP}:5005/api\`;
    console.log('📡 [API] Connecting to:', BASE_URL);
}`;
        fs.writeFileSync(apiFile, content.replace(fallbackRx, newBlock), 'utf8');
    }
} catch (err) {
    console.log(`❌ Error:`, err.message);
}
