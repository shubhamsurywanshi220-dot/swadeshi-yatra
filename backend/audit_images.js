const fs = require('fs');
const path = require('path');

// Paths
const currentDir = process.cwd();
const imagesDir = path.join(currentDir, 'backend', 'public', 'images');
const dataDir = path.join(currentDir, 'backend', 'data');

// Load Data
const batch1 = require(path.join(dataDir, 'indiaTourism_batch1.json'));
const batch2 = require(path.join(dataDir, 'indiaTourism_batch2.json'));
const batch3 = require(path.join(dataDir, 'indiaTourism_batch3.json'));
const allPlacesFile = fs.readFileSync(path.join(dataDir, 'allPlaces.js'), 'utf8');

// Simple regex extraction for allPlaces.js (since it's a JS file, not pure JSON)
const localImageRegex = /imageUrl:\s*['"]\/images\/([^'"]+)['"]/g;
let match;
const localImages = new Set();
while ((match = localImageRegex.exec(allPlacesFile)) !== null) {
    localImages.add(match[1]);
}

// Add batch images if they are local
[batch1, batch2, batch3].forEach(batch => {
    batch.forEach(item => {
        if (item.imageUrl && item.imageUrl.startsWith('/images/')) {
            localImages.add(item.imageUrl.replace('/images/', ''));
        }
    });
});

// Check existence
const existingFiles = new Set(fs.readdirSync(imagesDir));
const missing = Array.from(localImages).filter(file => !existingFiles.has(file));

console.log('--- MISSING LOCAL IMAGES ---');
if (missing.length === 0) {
    console.log('None found.');
} else {
    missing.forEach(file => console.log(file));
}

// Also check for destinations with NO image at all or Unsplash URLs (if user wants to replace them)
const missingImageField = [];
const unsplashImages = [];

const processItem = (item) => {
    if (!item.imageUrl) {
        missingImageField.push(item.name);
    } else if (item.imageUrl.includes('unsplash.com')) {
        unsplashImages.push({ name: item.name, url: item.imageUrl });
    }
};

batch1.forEach(processItem);
batch2.forEach(processItem);
batch3.forEach(processItem);

// For allPlaces.js, we need a better regex or parser, but let's stick to the batches for now as they are the primary source.
console.log('\n--- DESTINATIONS WITH NO IMAGE URL ---');
missingImageField.forEach(name => console.log(name));

console.log('\n--- DESTINATIONS USING EXTERNAL (UNSPLASH) IMAGES ---');
unsplashImages.forEach(u => console.log(`${u.name} (${u.url})`));
