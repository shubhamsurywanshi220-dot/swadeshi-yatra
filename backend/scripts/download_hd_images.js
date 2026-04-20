const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

// ============================================================
// MAP: filename → reliable Wikimedia Commons download URL
// Each URL is a direct image link at 800px width
// ============================================================
const HD_IMAGES = {
    // --- CRITICAL: Under 5KB ---
    'up_taj_mahal.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/800px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg',

    // --- Under 10KB ---
    'as_kaziranga.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/One_horn_rhino.jpg/800px-One_horn_rhino.jpg',
    'ka_skandagiri.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Skandagiri_sunrise.jpg/800px-Skandagiri_sunrise.jpg',
    'ka_nandi_hills.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Nandi_Hills_Panoramic.jpg/800px-Nandi_Hills_Panoramic.jpg',
    'dn_diu_fort.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Diu_Fort.jpg/800px-Diu_Fort.jpg',
    'coorg_abbey.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Abbey_Falls_Coorg.jpg/800px-Abbey_Falls_Coorg.jpg',
    'py_promenade.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Pondicherry-Rock_beach-sunrise-1.jpg/800px-Pondicherry-Rock_beach-sunrise-1.jpg',
    'wb_victoria.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Victoria_Memorial_Kolkata_panorama.jpg/800px-Victoria_Memorial_Kolkata_panorama.jpg',
    'dl_red_fort.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Red_Fort_in_Delhi_03-2016_img3.jpg/800px-Red_Fort_in_Delhi_03-2016_img3.jpg',
    'an_radhanagar.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Radhanagar_Beach%2C_Andaman_%26_Nicobar_Islands.jpg/800px-Radhanagar_Beach%2C_Andaman_%26_Nicobar_Islands.jpg',
    'tr_neermahal.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Neermahal.jpg/800px-Neermahal.jpg',
    'ka_harihareshwara.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Harihareshwara_temple_-_Harihar.jpg/800px-Harihareshwara_temple_-_Harihar.jpg',
    'ka_tb_dam.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Tungabadra_Dam.jpg/800px-Tungabadra_Dam.jpg',
    'ka_shravanabelagola.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Gommateshwara_statue.jpg/800px-Gommateshwara_statue.jpg',
    'ka_gokak_falls.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Gokak_Falls.jpg/800px-Gokak_Falls.jpg',
    'ld_pangong.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Pangong_Tso.jpg/800px-Pangong_Tso.jpg',

    // --- Under 15KB ---
    'gj_somnath.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Somnath_mandir.jpg/800px-Somnath_mandir.jpg',
    'ka_gol_gumbaz.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Gol_Gumbaz_Bijapur.jpg/800px-Gol_Gumbaz_Bijapur.jpg',
    'ka_ramanagara.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ramanagara.jpg/800px-Ramanagara.jpg',
    'kl_munnar.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Munnar_hillstation_kerala.jpg/800px-Munnar_hillstation_kerala.jpg',
    'kl_thekkady.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Periyar_Tiger_Reserve%2C_Thekkady.jpg/800px-Periyar_Tiger_Reserve%2C_Thekkady.jpg',
    'rj_mount_abu.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nakki_Lake_Mounted.jpg/800px-Nakki_Lake_Mounted.jpg',
    'belur.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Belur1.jpg/800px-Belur1.jpg',
    'ap_tirumala.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Sri_Venkateswara_Temple%2C_Tirumala%2C_AP_W_IMG_8075.jpg/800px-Sri_Venkateswara_Temple%2C_Tirumala%2C_AP_W_IMG_8075.jpg',
    'tg_charminar.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/800px-Charminar_Hyderabad_1.jpg',
    'jh_hundru.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Hundru_Falls.jpg/800px-Hundru_Falls.jpg',
    'ka_aihole.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Durgatemple-Aihole.JPG/800px-Durgatemple-Aihole.JPG',
    'ka_aloysius_chapel.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Interior_of_St._Aloysius_Chapel%2C_Mangalore.jpg/800px-Interior_of_St._Aloysius_Chapel%2C_Mangalore.jpg',
    'mn_loktak.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Loktak_Lake.jpg/800px-Loktak_Lake.jpg',
    'rj_amber_fort.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Amber_Fort%2C_Jaipur%2C_India.jpg/800px-Amber_Fort%2C_Jaipur%2C_India.jpg',
    'rj_lake_pichola.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Lake_Pichola%2C_Udaipur.jpg/800px-Lake_Pichola%2C_Udaipur.jpg',
    'rj_jodhpur.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Jodhpur_Blue_city.jpg/800px-Jodhpur_Blue_city.jpg',
    'ka_chitradurga_fort.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Chitradurga_Fort%2C_Karnataka.jpg/800px-Chitradurga_Fort%2C_Karnataka.jpg',
    'ka_devanahalli_fort.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Devanahalli_Fort.jpg/800px-Devanahalli_Fort.jpg',
    'ka_pattadakal.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Pattadakal_Virupaksha_temple.jpg/800px-Pattadakal_Virupaksha_temple.jpg',
    'ml_shillong.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ward_Lake_Shillong.jpg/800px-Ward_Lake_Shillong.jpg',
    'up_varanasi.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg/800px-Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg',
    'murudeshwar.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Murudeshwar1.jpg/800px-Murudeshwar1.jpg',
    'jk_dal_lake.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Dal_Lake_3.jpg/800px-Dal_Lake_3.jpg',
    'kl_kovalam.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Kovalam_Beach_Kerala.jpg/800px-Kovalam_Beach_Kerala.jpg',
    'hampi.jpeg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Virupaksha_Temple%2C_Hampi.jpg/800px-Virupaksha_Temple%2C_Hampi.jpg',
    'tn_meenakshi.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Madurai_Meenakshi_Amman_Temple.jpg/800px-Madurai_Meenakshi_Amman_Temple.jpg',

    // --- Borderline (17-27KB) — also replacing for consistency ---
    'od_konark.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Konark_Sun_Temple_Front_view.jpg/800px-Konark_Sun_Temple_Front_view.jpg',
    'rj_pushkar_lake.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Pushkar_lake_-_Rajasthan_-_4.jpg/800px-Pushkar_lake_-_Rajasthan_-_4.jpg',
    'rj_jaisalmer_fort.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Jaisalmer_forteresse.jpg/800px-Jaisalmer_forteresse.jpg',
};

// Download a single file
function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        const client = url.startsWith('https') ? https : http;

        const request = (reqUrl) => {
            client.get(reqUrl, (res) => {
                // Follow redirects
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    request(res.headers.location);
                    return;
                }

                if (res.statusCode !== 200) {
                    file.close();
                    fs.unlinkSync(destPath);
                    reject(new Error(`HTTP ${res.statusCode}`));
                    return;
                }

                res.pipe(file);
                file.on('finish', () => {
                    file.close(() => {
                        const stats = fs.statSync(destPath);
                        resolve(stats.size);
                    });
                });
            }).on('error', (err) => {
                file.close();
                if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
                reject(err);
            });
        };

        request(url);
    });
}

async function main() {
    console.log('🖼️  HD IMAGE DOWNLOADER');
    console.log('='.repeat(50));
    console.log(`📁 Target directory: ${IMAGES_DIR}\n`);

    const entries = Object.entries(HD_IMAGES);
    let success = 0;
    let failed = 0;

    for (const [filename, url] of entries) {
        const destPath = path.join(IMAGES_DIR, filename);

        // Backup existing tiny file
        if (fs.existsSync(destPath)) {
            const backupPath = destPath + '.bak';
            fs.copyFileSync(destPath, backupPath);
        }

        try {
            const size = await downloadFile(url, destPath);
            const sizeKB = Math.round(size / 1024);
            console.log(`  ✅ ${filename} → ${sizeKB} KB`);
            success++;
        } catch (err) {
            console.log(`  ❌ ${filename} → FAILED: ${err.message}`);
            // Restore backup
            const backupPath = destPath + '.bak';
            if (fs.existsSync(backupPath)) {
                fs.copyFileSync(backupPath, destPath);
                fs.unlinkSync(backupPath);
            }
            failed++;
        }

        // Small delay to be polite to Wikimedia
        await new Promise(r => setTimeout(r, 300));
    }

    // Clean up backups for successful downloads
    for (const [filename] of entries) {
        const backupPath = path.join(IMAGES_DIR, filename + '.bak');
        if (fs.existsSync(backupPath)) {
            fs.unlinkSync(backupPath);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Downloaded: ${success}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${entries.length}`);
    console.log('\n🚀 Restart the backend server to serve the new images!');
}

main().catch(console.error);
