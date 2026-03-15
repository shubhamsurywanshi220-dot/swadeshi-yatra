const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\shubh\\.gemini\\antigravity\\brain\\f2d45350-133f-4924-93eb-46d8abc7e58b';
const destDir = 'd:\\New folder\\swadeshi yatra project\\backend\\public\\images\\businesses';

const files = [
    { src: 'banarasi_silk_saree_sahni_silk_1773584406625.png', dest: 'banarasi_silk.png' },
    { src: 'kesar_da_dhaba_amritsar_dal_makhani_1773584121087.png', dest: 'kesar_da_dhaba.png' },
    { src: 'kripal_kumbh_jaipur_blue_pottery_1773583801882.png', dest: 'kripal_kumbh.png' },
    { src: 'mysore_silk_saree_ksic_1773583944201.png', dest: 'mysore_silk.png' },
    { src: 'panchhi_petha_store_agra_1773583586134.png', dest: 'panchhi_petha.png' },
    { src: 'glenburn_tea_estate_darjeeling_1773593610629.png', dest: 'darjeeling_tea.png' },
    { src: 'cazulo_feni_goa_1773593669143.png', dest: 'goa_feni.png' },
    { src: 'kashmir_pashmina_weaving_1773593765273.png', dest: 'kashmir_pashmina.png' },
    { src: 'bidriware_bidar_handicrafts_1773593818948.png', dest: 'bidriware.png' },
    { src: 'madhubani_art_bihar_1773593947033.png', dest: 'madhubani_art.png' },
    { src: 'g_pulla_reddy_sweets_hyderabad_1773594026647.png', dest: 'pulla_reddy_sweets.png' },
    { src: 'kerala_spices_munnar_1773594120925.png', dest: 'kerala_spices.png' },
    { src: 'kanchipuram_silk_saree_1773594183362.png', dest: 'kanjivaram_silk.png' },
    { src: 'assam_muga_silk_golden_1773594264249.png', dest: 'muga_silk.png' },
    { src: 'kullu_shawls_himachal_1773594314359.png', dest: 'kullu_shawl.png' }
];

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

files.forEach(f => {
    const srcPath = path.join(brainDir, f.src);
    const destPath = path.join(destDir, f.dest);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✅ Copied ${f.dest}`);
    } else {
        console.error(`❌ Source not found: ${srcPath}`);
    }
});
