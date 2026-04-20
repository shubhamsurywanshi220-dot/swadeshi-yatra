const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Place = require('../models/Place');
const Business = require('../models/Business');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

// Check if a URL returns a valid image (HTTP HEAD)
function checkUrl(url, timeout = 5000) {
    return new Promise((resolve) => {
        if (!url || url.trim() === '') {
            resolve({ status: 'MISSING', code: 0 });
            return;
        }

        // Local path — check if file exists on disk
        const cleanUrl = url.startsWith('/') ? url : '/' + url;
        if (cleanUrl.startsWith('/images/') || cleanUrl.startsWith('/assets/')) {
            const localPath = path.join(__dirname, '..', 'public', cleanUrl);
            if (fs.existsSync(localPath)) {
                const stats = fs.statSync(localPath);
                const sizeKB = Math.round(stats.size / 1024);
                if (sizeKB < 5) {
                    resolve({ status: 'TOO_SMALL', code: 200, sizeKB, localPath });
                } else {
                    resolve({ status: 'OK_LOCAL', code: 200, sizeKB, localPath });
                }
            } else {
                resolve({ status: 'LOCAL_MISSING', code: 404, localPath });
            }
            return;
        }


        // External URL — do HTTP HEAD check
        const client = url.startsWith('https') ? https : http;
        const req = client.request(url, { method: 'HEAD', timeout }, (res) => {
            const code = res.statusCode;
            // Follow redirects
            if (code >= 300 && code < 400 && res.headers.location) {
                resolve({ status: 'REDIRECT', code, redirect: res.headers.location });
            } else if (code === 200) {
                const contentType = res.headers['content-type'] || '';
                const contentLen = parseInt(res.headers['content-length'] || '0', 10);
                const sizeKB = Math.round(contentLen / 1024);
                if (!contentType.includes('image')) {
                    resolve({ status: 'NOT_IMAGE', code, contentType });
                } else if (contentLen > 0 && contentLen < 3000) {
                    resolve({ status: 'TOO_SMALL', code, sizeKB });
                } else {
                    resolve({ status: 'OK', code, sizeKB, contentType });
                }
            } else {
                resolve({ status: 'HTTP_ERROR', code });
            }
        });

        req.on('error', (err) => {
            resolve({ status: 'NETWORK_ERROR', code: 0, error: err.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ status: 'TIMEOUT', code: 0 });
        });

        req.end();
    });
}

async function auditAllImages() {
    try {
        console.log('🔍 COMPREHENSIVE IMAGE AUDIT');
        console.log('='.repeat(60));
        console.log(`📡 Connecting to: ${MONGO_URI}\n`);

        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB.\n');

        // ==============================================
        // FETCH ALL DATA
        // ==============================================
        const allPlaces = await Place.find({}).lean();
        const allBusinesses = await Business.find({}).lean();

        console.log(`📦 Total destinations: ${allPlaces.length}`);
        console.log(`🏪 Total businesses: ${allBusinesses.length}\n`);

        // ==============================================
        // SECTION A: DESTINATIONS WITH NO/EMPTY IMAGES
        // ==============================================
        const missingImageDests = [];
        const brokenImageDests = [];
        const tooSmallImageDests = [];
        const localMissingDests = [];
        const okDests = [];

        console.log('🔄 Checking destination images (this may take a minute)...\n');

        let checked = 0;
        for (const place of allPlaces) {
            checked++;
            if (checked % 50 === 0) {
                console.log(`   Progress: ${checked}/${allPlaces.length}...`);
            }

            const url = place.imageUrl || '';

            if (!url || url.trim() === '') {
                missingImageDests.push({
                    name: place.name,
                    state: place.state || 'Unknown',
                    city: place.city || 'Unknown',
                    category: place.category || 'General',
                    _id: place._id.toString(),
                });
                continue;
            }

            const result = await checkUrl(url);

            if (result.status === 'LOCAL_MISSING') {
                localMissingDests.push({
                    name: place.name,
                    state: place.state || 'Unknown',
                    city: place.city || 'Unknown',
                    category: place.category || 'General',
                    currentUrl: url,
                    expectedPath: result.localPath,
                    _id: place._id.toString(),
                });
            } else if (result.status === 'TOO_SMALL') {
                tooSmallImageDests.push({
                    name: place.name,
                    state: place.state || 'Unknown',
                    currentUrl: url,
                    sizeKB: result.sizeKB,
                    _id: place._id.toString(),
                });
            } else if (result.status === 'HTTP_ERROR' || result.status === 'NETWORK_ERROR' || result.status === 'TIMEOUT' || result.status === 'NOT_IMAGE') {
                brokenImageDests.push({
                    name: place.name,
                    state: place.state || 'Unknown',
                    currentUrl: url,
                    issue: result.status,
                    code: result.code,
                    _id: place._id.toString(),
                });
            } else {
                okDests.push({
                    name: place.name,
                    sizeKB: result.sizeKB || 'N/A',
                    type: result.status,
                });
            }
        }

        // ==============================================
        // SECTION C: BUSINESSES
        // ==============================================
        const missingBizImages = [];
        const brokenBizImages = [];
        const localMissingBiz = [];
        const okBiz = [];

        console.log('\n🔄 Checking business images...\n');

        for (const biz of allBusinesses) {
            const url = biz.imageUrl || '';

            if (!url || url.trim() === '') {
                missingBizImages.push({
                    name: biz.name,
                    category: biz.category || 'Unknown',
                    location: biz.location || 'Unknown',
                    _id: biz._id.toString(),
                });
                continue;
            }

            const result = await checkUrl(url);

            if (result.status === 'LOCAL_MISSING') {
                localMissingBiz.push({
                    name: biz.name,
                    category: biz.category,
                    location: biz.location,
                    currentUrl: url,
                    expectedPath: result.localPath,
                    _id: biz._id.toString(),
                });
            } else if (result.status === 'HTTP_ERROR' || result.status === 'NETWORK_ERROR' || result.status === 'TIMEOUT' || result.status === 'NOT_IMAGE' || result.status === 'TOO_SMALL') {
                brokenBizImages.push({
                    name: biz.name,
                    category: biz.category,
                    currentUrl: url,
                    issue: result.status,
                    _id: biz._id.toString(),
                });
            } else {
                okBiz.push({ name: biz.name, type: result.status });
            }
        }

        // ==============================================
        // GENERATE REPORT
        // ==============================================
        const reportLines = [];
        const addLine = (line = '') => reportLines.push(line);

        addLine('# 📋 SWADESHI YATRA — IMAGE AUDIT REPORT');
        addLine(`Generated: ${new Date().toISOString()}`);
        addLine(`Total Destinations: ${allPlaces.length}`);
        addLine(`Total Businesses: ${allBusinesses.length}`);
        addLine('');

        // Summary
        addLine('## 📊 SUMMARY');
        addLine('');
        addLine('| Category | Count |');
        addLine('|---|---|');
        addLine(`| ✅ Destinations OK | ${okDests.length} |`);
        addLine(`| ❌ Destinations — No Image | ${missingImageDests.length} |`);
        addLine(`| ❌ Destinations — Local File Missing | ${localMissingDests.length} |`);
        addLine(`| ⚠️ Destinations — Broken URL | ${brokenImageDests.length} |`);
        addLine(`| ⚠️ Destinations — Too Small (<5KB) | ${tooSmallImageDests.length} |`);
        addLine(`| ✅ Businesses OK | ${okBiz.length} |`);
        addLine(`| ❌ Businesses — No Image | ${missingBizImages.length} |`);
        addLine(`| ❌ Businesses — Local File Missing | ${localMissingBiz.length} |`);
        addLine(`| ⚠️ Businesses — Broken URL | ${brokenBizImages.length} |`);
        addLine('');

        // SECTION 1: Missing Images
        addLine('---');
        addLine('## SECTION 1: DESTINATIONS WITH NO IMAGES');
        addLine('');
        if (missingImageDests.length === 0) {
            addLine('✅ None found — all destinations have an imageUrl field.');
        } else {
            addLine('| # | Destination | State | Category | Search Keyword |');
            addLine('|---|---|---|---|---|');
            missingImageDests.forEach((d, i) => {
                const keyword = `"${d.name} ${d.state} tourism India"`;
                addLine(`| ${i + 1} | ${d.name} | ${d.state} | ${d.category} | ${keyword} |`);
            });
        }
        addLine('');

        // SECTION 2: Local File Missing
        addLine('---');
        addLine('## SECTION 2: DESTINATIONS WITH MISSING LOCAL FILES');
        addLine('(imageUrl points to /images/... but the file does not exist on disk)');
        addLine('');
        if (localMissingDests.length === 0) {
            addLine('✅ None found — all local image paths resolve correctly.');
        } else {
            addLine('| # | Destination | State | Current Path | Search Keyword |');
            addLine('|---|---|---|---|---|');
            localMissingDests.forEach((d, i) => {
                const keyword = `"${d.name} ${d.state} tourism India"`;
                addLine(`| ${i + 1} | ${d.name} | ${d.state} | ${d.currentUrl} | ${keyword} |`);
            });
        }
        addLine('');

        // SECTION 3: Broken URLs
        addLine('---');
        addLine('## SECTION 3: DESTINATIONS WITH BROKEN EXTERNAL URLS');
        addLine('');
        if (brokenImageDests.length === 0) {
            addLine('✅ None found — all external URLs are reachable.');
        } else {
            addLine('| # | Destination | Issue | HTTP Code | Current URL |');
            addLine('|---|---|---|---|---|');
            brokenImageDests.forEach((d, i) => {
                addLine(`| ${i + 1} | ${d.name} | ${d.issue} | ${d.code} | ${d.currentUrl.substring(0, 80)}... |`);
            });
        }
        addLine('');

        // SECTION 4: Too Small Images
        addLine('---');
        addLine('## SECTION 4: DESTINATIONS WITH VERY SMALL IMAGES (<5KB)');
        addLine('(Likely thumbnails or corrupted downloads)');
        addLine('');
        if (tooSmallImageDests.length === 0) {
            addLine('✅ None found — all images are a reasonable size.');
        } else {
            addLine('| # | Destination | State | Size (KB) | Current URL | Search Keyword |');
            addLine('|---|---|---|---|---|---|');
            tooSmallImageDests.forEach((d, i) => {
                const keyword = `"${d.name} ${d.state} tourism India"`;
                addLine(`| ${i + 1} | ${d.name} | ${d.state} | ${d.sizeKB}KB | ${d.currentUrl} | ${keyword} |`);
            });
        }
        addLine('');

        // SECTION 5: Business Issues
        addLine('---');
        addLine('## SECTION 5: LOCAL BUSINESSES — MISSING/BROKEN IMAGES');
        addLine('');
        const allBadBiz = [...missingBizImages, ...localMissingBiz, ...brokenBizImages];
        if (allBadBiz.length === 0) {
            addLine('✅ None found — all business images are OK.');
        } else {
            addLine('| # | Business | Category | Location | Issue | Search Keyword |');
            addLine('|---|---|---|---|---|---|');
            let bizIdx = 0;

            missingBizImages.forEach((b) => {
                bizIdx++;
                const keyword = `"${b.name} ${b.location} real photo India"`;
                addLine(`| ${bizIdx} | ${b.name} | ${b.category} | ${b.location} | NO IMAGE | ${keyword} |`);
            });

            localMissingBiz.forEach((b) => {
                bizIdx++;
                const keyword = `"${b.name} ${b.location} real photo India"`;
                addLine(`| ${bizIdx} | ${b.name} | ${b.category} | ${b.location} | LOCAL FILE MISSING: ${b.currentUrl} | ${keyword} |`);
            });

            brokenBizImages.forEach((b) => {
                bizIdx++;
                const keyword = `"${b.name} real photo India"`;
                addLine(`| ${bizIdx} | ${b.name} | ${b.category} | - | ${b.issue} | ${keyword} |`);
            });
        }
        addLine('');

        // SECTION 6: Healthy entries
        addLine('---');
        addLine('## SECTION 6: ✅ HEALTHY ENTRIES (Images Loading OK)');
        addLine('');
        addLine(`Destinations with working images: **${okDests.length}** / ${allPlaces.length}`);
        addLine(`Businesses with working images: **${okBiz.length}** / ${allBusinesses.length}`);
        addLine('');

        // Write report to file
        const reportContent = reportLines.join('\n');
        const reportPath = path.join(__dirname, '..', 'IMAGE_AUDIT_REPORT.md');
        fs.writeFileSync(reportPath, reportContent, 'utf8');

        // Print to console too
        console.log('\n' + '='.repeat(60));
        console.log(reportContent);
        console.log('='.repeat(60));
        console.log(`\n📄 Full report saved to: ${reportPath}`);

        // ==============================================
        // Generate a fix script with DB IDs
        // ==============================================
        const fixData = {
            missingImageDests: missingImageDests.map(d => ({ _id: d._id, name: d.name, state: d.state })),
            localMissingDests: localMissingDests.map(d => ({ _id: d._id, name: d.name, currentUrl: d.currentUrl })),
            brokenImageDests: brokenImageDests.map(d => ({ _id: d._id, name: d.name, currentUrl: d.currentUrl })),
            tooSmallImageDests: tooSmallImageDests.map(d => ({ _id: d._id, name: d.name, currentUrl: d.currentUrl, sizeKB: d.sizeKB })),
            missingBizImages: missingBizImages.map(b => ({ _id: b._id, name: b.name })),
            localMissingBiz: localMissingBiz.map(b => ({ _id: b._id, name: b.name, currentUrl: b.currentUrl })),
        };

        const fixDataPath = path.join(__dirname, '..', 'image_fix_data.json');
        fs.writeFileSync(fixDataPath, JSON.stringify(fixData, null, 2), 'utf8');
        console.log(`📋 Fix data (with DB IDs) saved to: ${fixDataPath}`);

    } catch (error) {
        console.error('💥 Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed.');
        process.exit();
    }
}

auditAllImages();
