/**
 * ===================================================================
 * Swadeshi Yatra – Automated Destination Image Downloader
 * ===================================================================
 *
 * Downloads high-quality, royalty-free images for every tourism
 * destination using the Pexels API.
 *
 * USAGE:
 *   node downloadImages.js YOUR_PEXELS_API_KEY
 *
 *   or set the env variable:
 *   set PEXELS_API_KEY=YOUR_KEY && node downloadImages.js
 *
 * OPTIONS:
 *   --limit N        Process only the first N destinations (for testing)
 *   --per-dest N     Images per destination (default: 3, max: 5)
 *   --min-width N    Minimum image width in px (default: 1024)
 *   --resume         Skip destinations that already have a folder
 *
 * EXAMPLES:
 *   node downloadImages.js YOUR_KEY --limit 5
 *   node downloadImages.js YOUR_KEY --per-dest 5 --resume
 *
 * OUTPUT:
 *   ../destinations/<folder_name>/<name>_1.jpg ...
 *   ../destinations/imageMapping.json
 * ===================================================================
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ─── Configuration ────────────────────────────────────────────────
const ROOT_DIR = path.resolve(__dirname, '..', 'destinations');
const DATA_DIR = path.resolve(__dirname, '..', 'backend', 'data');
const MAPPING_FILE = path.join(ROOT_DIR, 'imageMapping.json');

const DELAY_MS = 1800;           // Delay between API requests (ms)
const DEFAULT_PER_DEST = 3;      // Default images per destination
const DEFAULT_MIN_WIDTH = 1024;  // Minimum image width in pixels

// ─── Parse CLI args ───────────────────────────────────────────────
function parseArgs() {
    const args = process.argv.slice(2);
    const config = {
        apiKey: null,
        limit: null,
        perDest: DEFAULT_PER_DEST,
        minWidth: DEFAULT_MIN_WIDTH,
        resume: false,
    };

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--limit' && args[i + 1]) {
            config.limit = parseInt(args[++i], 10);
        } else if (args[i] === '--per-dest' && args[i + 1]) {
            config.perDest = Math.min(5, parseInt(args[++i], 10));
        } else if (args[i] === '--min-width' && args[i + 1]) {
            config.minWidth = parseInt(args[++i], 10);
        } else if (args[i] === '--resume') {
            config.resume = true;
        } else if (!args[i].startsWith('--') && !config.apiKey) {
            config.apiKey = args[i];
        }
    }

    config.apiKey = config.apiKey || process.env.PEXELS_API_KEY;
    return config;
}

// ─── Load all destinations ────────────────────────────────────────
function loadDestinations() {
    const destinations = [];
    const seen = new Set();

    // Load JSON batch files
    for (let i = 1; i <= 10; i++) {
        const filePath = path.join(DATA_DIR, `indiaTourism_batch${i}.json`);
        if (fs.existsSync(filePath)) {
            try {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                for (const d of data) {
                    const key = d.id || d.name;
                    if (!seen.has(key)) {
                        seen.add(key);
                        destinations.push(d);
                    }
                }
                console.log(`  ✓ Loaded ${data.length} destinations from batch${i}.json`);
            } catch (err) {
                console.error(`  ✗ Error reading batch${i}.json:`, err.message);
            }
        }
    }

    // Load allPlaces.js (it's a CommonJS module exporting an array)
    const allPlacesPath = path.join(DATA_DIR, 'allPlaces.js');
    if (fs.existsSync(allPlacesPath)) {
        try {
            // Read as text and extract the inline destinations (not from batch files)
            const content = fs.readFileSync(allPlacesPath, 'utf-8');
            // Use require to get the exported array
            const allPlaces = require(allPlacesPath);
            let added = 0;
            for (const d of allPlaces) {
                const key = d.id || d.name;
                if (!seen.has(key)) {
                    seen.add(key);
                    destinations.push(d);
                    added++;
                }
            }
            console.log(`  ✓ Loaded ${added} additional destinations from allPlaces.js (${allPlaces.length} total, ${allPlaces.length - added} duplicates skipped)`);
        } catch (err) {
            console.error(`  ✗ Error reading allPlaces.js:`, err.message);
        }
    }

    return destinations;
}

// ─── Utility: create safe folder name ─────────────────────────────
function toFolderName(name) {
    return name
        .toLowerCase()
        .replace(/[&]/g, 'and')
        .replace(/[\/\\]/g, '_')
        .replace(/[^a-z0-9\s_-]/g, '')
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
}

// ─── Utility: build search query ─────────────────────────────────
function buildSearchQuery(dest) {
    const name = dest.name || '';
    const city = dest.city || '';
    const state = dest.state || '';
    // "Amer Fort Jaipur Rajasthan India tourism"
    const parts = [name];
    if (city && !name.toLowerCase().includes(city.toLowerCase())) {
        parts.push(city);
    }
    if (state && !name.toLowerCase().includes(state.toLowerCase())) {
        parts.push(state);
    }
    parts.push('India tourism');
    return parts.join(' ');
}

// ─── Pexels API search ───────────────────────────────────────────
function searchPexels(apiKey, query, perPage) {
    return new Promise((resolve, reject) => {
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape&size=large`;

        const options = {
            headers: {
                'Authorization': apiKey,
            },
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error('Failed to parse Pexels response'));
                    }
                } else if (res.statusCode === 429) {
                    reject(new Error('RATE_LIMIT: Pexels API rate limit reached. Wait a moment and try again.'));
                } else {
                    reject(new Error(`Pexels API error: ${res.statusCode} – ${data.substring(0, 200)}`));
                }
            });
            res.on('error', reject);
        }).on('error', reject);
    });
}

// ─── Download a single image ─────────────────────────────────────
function downloadFile(url, outputPath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(outputPath);

        protocol.get(url, (response) => {
            // Follow redirects
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                file.close();
                fs.unlinkSync(outputPath);
                return downloadFile(response.headers.location, outputPath).then(resolve).catch(reject);
            }

            if (response.statusCode !== 200) {
                file.close();
                fs.unlinkSync(outputPath);
                return reject(new Error(`HTTP ${response.statusCode}`));
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
            file.on('error', (err) => {
                fs.unlinkSync(outputPath);
                reject(err);
            });
        }).on('error', (err) => {
            file.close();
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            reject(err);
        });
    });
}

// ─── Delay helper ────────────────────────────────────────────────
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Filter images based on requirements ─────────────────────────
function filterImages(photos, minWidth, count) {
    const validPhotos = photos
        .filter((p) => p.width >= minWidth)
        .filter((p) => p.width > p.height) // landscape only
        .slice(0, count);
    return validPhotos;
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
    console.log('\n╔═══════════════════════════════════════════════════╗');
    console.log('║  Swadeshi Yatra – Image Downloader                ║');
    console.log('╚═══════════════════════════════════════════════════╝\n');

    const config = parseArgs();

    if (!config.apiKey) {
        console.error('❌ ERROR: No Pexels API key provided!\n');
        console.error('Usage:  node downloadImages.js YOUR_PEXELS_API_KEY');
        console.error('        node downloadImages.js YOUR_KEY --limit 5\n');
        console.error('Get a free key at: https://www.pexels.com/api/\n');
        process.exit(1);
    }

    // Create root destination folder
    if (!fs.existsSync(ROOT_DIR)) {
        fs.mkdirSync(ROOT_DIR, { recursive: true });
    }

    // Load destinations
    console.log('📂 Loading destinations...');
    let destinations = loadDestinations();
    console.log(`\n📍 Total unique destinations found: ${destinations.length}\n`);

    if (config.limit) {
        destinations = destinations.slice(0, config.limit);
        console.log(`🔒 Limited to first ${config.limit} destinations (--limit flag)\n`);
    }

    // Load existing mapping (for resume)
    let mapping = [];
    if (fs.existsSync(MAPPING_FILE)) {
        try {
            mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));
        } catch (e) {
            mapping = [];
        }
    }
    const existingFolders = new Set(mapping.map((m) => m.folder));

    let downloaded = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < destinations.length; i++) {
        const dest = destinations[i];
        const folderName = toFolderName(dest.name);
        const folderPath = path.join(ROOT_DIR, folderName);
        const progress = `[${i + 1}/${destinations.length}]`;

        // Resume: skip if folder already has images
        if (config.resume && existingFolders.has(folderName)) {
            console.log(`  ${progress} ⏭  ${dest.name} (already downloaded, skipping)`);
            skipped++;
            continue;
        }

        console.log(`  ${progress} 🔍 Searching: ${dest.name}...`);

        try {
            const query = buildSearchQuery(dest);
            // Request more than needed to have a buffer for filtering
            const result = await searchPexels(config.apiKey, query, config.perDest * 2);

            if (!result.photos || result.photos.length === 0) {
                console.log(`         ⚠  No images found for "${dest.name}". Trying broader search...`);
                // Fallback: search with just the name + India
                const fallbackResult = await searchPexels(config.apiKey, `${dest.name} India`, config.perDest * 2);
                await delay(DELAY_MS);

                if (!fallbackResult.photos || fallbackResult.photos.length === 0) {
                    console.log(`         ✗  No images found even with fallback. Skipping.`);
                    failed++;
                    continue;
                }
                result.photos = fallbackResult.photos;
            }

            const photos = filterImages(result.photos, config.minWidth, config.perDest);

            if (photos.length === 0) {
                console.log(`         ⚠  No images meet quality criteria (≥${config.minWidth}px, landscape). Skipping.`);
                failed++;
                await delay(DELAY_MS);
                continue;
            }

            // Create folder
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            const imageNames = [];
            for (let j = 0; j < photos.length; j++) {
                const photo = photos[j];
                const fileName = `${folderName}_${j + 1}.jpg`;
                const filePath = path.join(folderPath, fileName);

                // Use "large2x" for high quality (up to 1880px wide)
                const imageUrl = photo.src.large2x || photo.src.large || photo.src.original;

                try {
                    await downloadFile(imageUrl, filePath);
                    imageNames.push(fileName);
                    console.log(`         ✓  ${fileName} (${photo.width}x${photo.height})`);
                } catch (dlErr) {
                    console.log(`         ✗  Failed to download ${fileName}: ${dlErr.message}`);
                }
            }

            if (imageNames.length > 0) {
                // Update mapping
                const existingIndex = mapping.findIndex((m) => m.folder === folderName);
                const entry = {
                    id: dest.id || dest._id || folderName,
                    name: dest.name,
                    folder: folderName,
                    images: imageNames,
                    photographer_credits: photos.slice(0, imageNames.length).map((p) => ({
                        name: p.photographer,
                        url: p.photographer_url,
                    })),
                };

                if (existingIndex >= 0) {
                    mapping[existingIndex] = entry;
                } else {
                    mapping.push(entry);
                }
                downloaded++;
            }

            // Save mapping incrementally (so progress isn't lost on crash)
            fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2), 'utf-8');

        } catch (err) {
            if (err.message.includes('RATE_LIMIT')) {
                console.log(`\n  ⏳ Rate limit hit. Pausing for 60 seconds...\n`);
                await delay(60000);
                i--; // Retry this destination
                continue;
            }
            console.log(`         ✗  Error: ${err.message}`);
            failed++;
        }

        // Rate limiting delay
        await delay(DELAY_MS);
    }

    // Final save
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2), 'utf-8');

    console.log('\n═══════════════════════════════════════════════════');
    console.log(`  ✅ Downloaded: ${downloaded} destinations`);
    console.log(`  ⏭  Skipped:    ${skipped} destinations`);
    console.log(`  ✗  Failed:     ${failed} destinations`);
    console.log(`  📄 Mapping:    ${MAPPING_FILE}`);
    console.log(`  📁 Images:     ${ROOT_DIR}`);
    console.log('═══════════════════════════════════════════════════\n');
}

main().catch((err) => {
    console.error('\n💥 Unexpected error:', err);
    process.exit(1);
});
