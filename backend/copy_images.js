const fs = require('fs');
const path = require('path');

const copies = [
    { src: 'C:\\Users\\shubh\\.gemini\\antigravity\\brain\\f2d45350-133f-4924-93eb-46d8abc7e58b\\panchhi_petha_store_agra_1773583586134.png', dest: 'backend/public/images/businesses/panchhi_petha.jpg' },
    { src: 'C:\\Users\\shubh\\.gemini\\antigravity\\brain\\f2d45350-133f-4924-93eb-46d8abc7e58b\\kripal_kumbh_jaipur_blue_pottery_1773583801882.png', dest: 'backend/public/images/businesses/kripal_kumbh.jpg' },
    { src: 'C:\\Users\\shubh\\.gemini\\antigravity\\brain\\f2d45350-133f-4924-93eb-46d8abc7e58b\\mysore_silk_saree_ksic_1773583944201.png', dest: 'backend/public/images/businesses/mysore_silk.jpg' },
    { src: 'C:\\Users\\shubh\\.gemini\\antigravity\\brain\\f2d45350-133f-4924-93eb-46d8abc7e58b\\kesar_da_dhaba_amritsar_dal_makhani_1773584121087.png', dest: 'backend/public/images/businesses/kesar_da_dhaba.jpg' },
    { src: 'C:\\Users\\shubh\\.gemini\\antigravity\\brain\\f2d45350-133f-4924-93eb-46d8abc7e58b\\banarasi_silk_saree_sahni_silk_1773584406625.png', dest: 'backend/public/images/businesses/banarasi_silk.jpg' }
];

copies.forEach(c => {
    try {
        if (fs.existsSync(c.src)) {
            fs.copyFileSync(c.src, c.dest);
            console.log(`✅ Copied to ${c.dest}`);
        } else {
            console.log(`❌ Source not found: ${c.src}`);
        }
    } catch (err) {
        console.error(`❌ Error copying ${c.src}:`, err.message);
    }
});
