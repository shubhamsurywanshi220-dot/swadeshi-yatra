const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
    { name: 'darjeeling_tea.jpg', url: 'https://images.unsplash.com/photo-1594631252845-29fc4cd8cd50?auto=format&fit=crop&q=80&w=1200' },
    { name: 'goa_feni.jpg', url: 'https://images.unsplash.com/photo-1510626146934-755847b25d6e?auto=format&fit=crop&q=80&w=1200' },
    { name: 'kashmir_pashmina.jpg', url: 'https://images.unsplash.com/photo-1592323932318-27db9e6578d7?auto=format&fit=crop&q=80&w=1200' },
    { name: 'bidriware.jpg', url: 'https://images.unsplash.com/photo-1628173456070-664426510344?auto=format&fit=crop&q=80&w=1200' },
    { name: 'madhubani_art.jpg', url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=1200' },
    { name: 'pulla_reddy_sweets.jpg', url: 'https://images.unsplash.com/photo-1589113103503-49ca45780517?auto=format&fit=crop&q=80&w=1200' },
    { name: 'kerala_spices.jpg', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1200' },
    { name: 'kanjivaram_silk.jpg', url: 'https://images.unsplash.com/photo-1610037180436-e8d98d25439a?auto=format&fit=crop&q=80&w=1200' },
    { name: 'muga_silk.jpg', url: 'https://images.unsplash.com/photo-1589908000355-9816c146d59d?auto=format&fit=crop&q=80&w=1200' },
    { name: 'kullu_shawl.jpg', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200' }
];

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                download(response.headers.location, dest).then(resolve).catch(reject);
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

const run = async () => {
    const dir = 'backend/public/images/businesses';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (const img of images) {
        const dest = path.join(dir, img.name);
        try {
            await download(img.url, dest);
            console.log(`✅ Downloaded ${img.name}`);
        } catch (err) {
            console.error(`❌ Error downloading ${img.name}:`, err.message);
        }
    }
    console.log('🏁 All downloads complete!');
};

run();
