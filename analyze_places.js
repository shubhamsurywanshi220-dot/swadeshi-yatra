const fs = require('fs');
const path = require('path');

try {
    const allPlaces = require('./backend/data/allPlaces');

    // 1. Check for duplicates
    const seenIds = new Set();
    const seenNames = new Set();
    const duplicates = [];
    const uniquePlaces = [];

    allPlaces.forEach(place => {
        const isDuplicate = seenIds.has(place.id) || seenNames.has(place.name);
        if (isDuplicate) {
            duplicates.push(place);
        } else {
            uniquePlaces.push(place);
            seenIds.add(place.id);
            seenNames.add(place.name);
        }
    });

    console.log(`Total Places: ${allPlaces.length}`);
    console.log(`Unique Places: ${uniquePlaces.length}`);
    console.log(`Duplicates Found: ${duplicates.length}`);

    if (duplicates.length > 0) {
        console.log('Duplicates:', duplicates.map(d => d.name));
        // We will output specific instructions effectively or just overwrite the file if we want to auto-fix.
        // For now, let's just identify them. 
        // Actually, user asked to "remove duplicate places". 
        // I should probably write back the clean list if there are duplicates.

        const content = `const allPlaces = ${JSON.stringify(uniquePlaces, null, 4)};\n\nmodule.exports = allPlaces;`;
        // Since the original file has comments and formatting we might lose, 
        // typically replacing the whole file with JSON.stringify is destructive to comments.
        // However, the user's priority is the data. 
        // But wait, the file I just edited has comments like "// 1. Bengaluru Urban".
        // If I JSON.stringify, I lose those comments.
        // Better to identify WHICH ones are duplicates and manually remove them or use a smarter replace?
        // If duplicates are exact matches of what I just added vs what was there, 
        // usually it's better to tell the user or matching by ID/Name.
        // Let's first just SEE what they are. 
    }

    // 2. Verify Image Existence
    const publicDir = path.join(__dirname, 'backend', 'public', 'images');
    const files = fs.readdirSync(publicDir);
    const fileSet = new Set(files);

    const missingImages = [];
    const mappedImages = [];

    uniquePlaces.forEach(p => {
        if (!p.imageUrl) {
            missingImages.push({ name: p.name, reason: 'No imageUrl field' });
            return;
        }

        // Handle both /images/foo.jpg and http...
        if (p.imageUrl.startsWith('http')) {
            mappedImages.push(p.name); // External, assume valid
            return;
        }

        const filename = p.imageUrl.split('/').pop();
        if (fileSet.has(filename)) {
            mappedImages.push(p.name);
        } else {
            missingImages.push({ name: p.name, filename: filename });
        }
    });

    console.log(`\n--- Verification Results ---`);
    console.log(`Successfully Mapped: ${mappedImages.length}`);
    console.log(`Missing Images: ${missingImages.length}`);

    if (missingImages.length > 0) {
        console.log('\nMissing Image Files for:');
        missingImages.forEach(m => console.log(`- ${m.name} (Expected: ${m.filename})`));
    } else {
        console.log('\nSUCCESS: All places have valid image mappings!');
    }

    // 3. Generate Karnataka Manifest
    const karnatakaPlaces = uniquePlaces.filter(p => p.state === 'Karnataka' || p.location.includes('Karnataka'));

    console.log('\n🟠 Karnataka');
    console.log('Place Name\tSave File As...');
    karnatakaPlaces.forEach(p => {
        const filename = p.imageUrl ? p.imageUrl.split('/').pop() : 'NO_IMAGE';
        console.log(`${p.name}\t${filename}`);
    });

} catch (e) {
    console.error('Error:', e);
}

