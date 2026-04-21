const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("==================================================");
console.log("   SWADESHI YATRA - PUBLIC INTERNET TUNNEL");
console.log("==================================================");
console.log("\nStarting secure tunnel to expose Backend over the internet...");
console.log("This bypasses ALL local Wi-Fi, 4G, and Firewall problems!\n");

// Run localtunnel using npx
const tunnel = spawn('npx.cmd', ['localtunnel', '--port', '5005'], { shell: true });

tunnel.stdout.on('data', (data) => {
    const output = data.toString();
    const match = output.match(/your url is: (https:\/\/[^\s]+)/);
    if (match) {
        const publicUrl = match[1] + '/api';
        console.log(`✅ Tunnel active! New Public API URL: ${publicUrl}`);
        
        // Update mobile/utils/api.js
        const apiFile = path.join(__dirname, 'mobile', 'utils', 'api.js');
        try {
            let content = fs.readFileSync(apiFile, 'utf8');
            // More robust replacement for the new structure
            const rx = /if\s*\(__DEV__\)\s*\{[\s\S]*?\}/;
            const newBlock = `if (__DEV__) {
    // 🌐 Public Tunnel URL (Works on 4G / Any Wi-Fi!)
    BASE_URL = '${publicUrl}';
    console.log('✅ [API] Tunnel Active:', '${publicUrl}');
}`;
            
            if (rx.test(content)) {
                content = content.replace(rx, newBlock);
                fs.writeFileSync(apiFile, content, 'utf8');
                console.log(`✅ SUCCESS: Updated mobile app configuration automatically!`);
                console.log(`\n\x1b[32m>>> KEEP THIS BLACK WINDOW OPEN! <<<\x1b[0m\n`);
                console.log(`📱 Now, go to your Expo Mobile App and press 'r' to reload!`);
                console.log(`It will now connect seamlessly even if you are on 4G mobile data.\n`);
            } else {
                console.log(`⚠️ Warning: Could not inject the URL into mobile/utils/api.js. You may need to paste ${publicUrl} into BASE_URL manually.`);
            }
        } catch (err) {
            console.error("Error updating api.js:", err);
        }
    } else {
        process.stdout.write(output);
    }
});

tunnel.stderr.on('data', (data) => {
    console.error(`Tunnel Error: ${data}`);
});

tunnel.on('close', (code) => {
    console.log(`Tunnel disconnected with code ${code}. Restart this script if you need it again.`);
});
