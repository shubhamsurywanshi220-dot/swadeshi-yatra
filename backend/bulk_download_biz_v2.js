const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
    { name: 'darjeeling_tea.jpg', id: 'RA0ulK_q67w' },
    { name: 'goa_feni.jpg', id: 'Hmbnd96HkYk' },
    { name: 'kashmir_pashmina.jpg', id: 'jlHmP6NbdR8' },
    { name: 'bidriware.jpg', id: 'w_Kkaia8C-8' },
    { name: 'madhubani_art.jpg', id: 'Sa5JyOsTiCE' },
    { name: 'pulla_reddy_sweets.jpg', id: 'FZ2hA7fovA8' },
    { name: 'kerala_spices.jpg', id: 'JXUkZmmGxHg' },
    { name: 'kanjivaram_silk.jpg', id: 'tjRs987fPfg' },
    { name: 'muga_silk.jpg', id: 'G1vTTwnqYcU' },
    { name: 'kullu_shawl.jpg', id: 'XCd_6nOdzjo' },
    // First 5
    { name: 'panchhi_petha.jpg', id: '9kX8t-U1VvA' }, // Indian sweets
    { name: 'kripal_kumbh.jpg', id: '3_1X9z6_X6U' }, // Pottery
    { name: 'mysore_silk.jpg', id: 'tjRs987fPfg' }, // Silk (reuse for now or find better)
    { name: 'kesar_da_dhaba.jpg', id: 'u_p9T6eY-U8' }, // Indian food
    { name: 'banarasi_silk.jpg', id: 'tjRs987fPfg' }  // Silk
];

const download = (id, dest) => {
    const url = `https://unsplash.com/photos/${id}/download?force=true&w=1200`;
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                downloadDirect(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

const downloadDirect = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

const run = async () => {
    const dir = 'backend/public/images/businesses';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (const img of images) {
        const dest = path.join(dir, img.name);
        try {
            await download(img.id, dest);
            console.log(`✅ Downloaded ${img.name}`);
        } catch (err) {
            console.error(`❌ Error downloading ${img.name}:`, err.message);
        }
    }
    console.log('🏁 All downloads complete!');
};

run();
