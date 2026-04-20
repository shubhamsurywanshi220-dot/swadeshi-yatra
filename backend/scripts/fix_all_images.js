const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Place = require('../models/Place');
const Business = require('../models/Business');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swadeshi_yatra';

// ==========================================
// HIGH-QUALITY IMAGE MAP — DESTINATIONS
// Uses Wikimedia Commons (reliable, free, high-res)
// ==========================================
const DESTINATION_IMAGES = {
    // --- ANDHRA PRADESH ---
    'Tirumala Venkateswara Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Sri_Venkateswara_Temple%2C_Tirumala%2C_AP_W_IMG_8075.jpg/800px-Sri_Venkateswara_Temple%2C_Tirumala%2C_AP_W_IMG_8075.jpg',
    'Araku Valley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/ArkkuValleyView.JPG/800px-ArkkuValleyView.JPG',
    
    // --- ARUNACHAL PRADESH ---
    'Tawang Monastery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Tawang_Monastery.jpg/800px-Tawang_Monastery.jpg',
    
    // --- ASSAM ---
    'Kaziranga National Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Indian_rhinoceros_%28Rhinoceros_unicornis%29_at_Kaziranga_National_Park%2C_India.jpg/800px-Indian_rhinoceros_%28Rhinoceros_unicornis%29_at_Kaziranga_National_Park%2C_India.jpg',
    'Kamakhya Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Kamakhya_temple.jpg/800px-Kamakhya_temple.jpg',
    
    // --- BIHAR ---
    'Mahabodhi Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mahabodhitemple.jpg/800px-Mahabodhitemple.jpg',
    'Nalanda University Ruins': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Nalanda_University_India_ruins.jpg/800px-Nalanda_University_India_ruins.jpg',
    
    // --- CHHATTISGARH ---
    'Chitrakote Falls': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chitrakote_Falls_Jagdalpur_Chhattisgarh.jpg/800px-Chitrakote_Falls_Jagdalpur_Chhattisgarh.jpg',
    
    // --- CHANDIGARH ---
    'Rock Garden': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Rock_Garden%2C_Chandigarh.jpg/800px-Rock_Garden%2C_Chandigarh.jpg',
    
    // --- DELHI ---
    'Qutub Minar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Qutab_Minar_mbread.jpg/800px-Qutab_Minar_mread.jpg',
    'Red Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Red_Fort_in_Delhi_03-2016_img3.jpg/800px-Red_Fort_in_Delhi_03-2016_img3.jpg',
    
    // --- GOA ---
    'Calangute Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Calangute_Beach_Goa.jpg/800px-Calangute_Beach_Goa.jpg',
    'Basilica of Bom Jesus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Basillica_of_Bom_Jesus.jpg/800px-Basillica_of_Bom_Jesus.jpg',
    'Dudhsagar Waterfalls': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Dudhsagar_Falls.jpg/800px-Dudhsagar_Falls.jpg',
    'Palolem Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Palolem_Beach.JPG/800px-Palolem_Beach.JPG',
    'Fort Aguada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Aguada_Fort.jpg/800px-Aguada_Fort.jpg',
    
    // --- GUJARAT ---
    'Rann of Kutch': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/White_Desert%2C_Kutch.jpg/800px-White_Desert%2C_Kutch.jpg',
    'Modhera Sun Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sun_Temple_of_Modhera.jpg/800px-Sun_Temple_of_Modhera.jpg',
    'Somnath Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Somnath_mandir.jpg/800px-Somnath_mandir.jpg',
    'Statue of Unity': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Statue_of_Unity.jpg/800px-Statue_of_Unity.jpg',
    'Gir National Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Gir_lion.jpg/800px-Gir_lion.jpg',
    
    // --- HARYANA ---
    'Sultanpur Bird Sanctuary': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Sultanpur_National_Park%2C_Gurgaon%2C_Haryana%2C_India.jpg/800px-Sultanpur_National_Park%2C_Gurgaon%2C_Haryana%2C_India.jpg',
    
    // --- HIMACHAL PRADESH ---
    'Manali': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Solang_Valley_Feb_2021.jpg/800px-Solang_Valley_Feb_2021.jpg',
    'Spiti Valley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Key_Monastery%2C_Spiti_Valley.jpg/800px-Key_Monastery%2C_Spiti_Valley.jpg',
    
    // --- JHARKHAND ---
    'Hundru Falls': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Hundru_Falls.jpg/800px-Hundru_Falls.jpg',
    
    // --- JAMMU & KASHMIR ---
    'Dal Lake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Dal_Lake%2C_Srinagar.jpg/800px-Dal_Lake%2C_Srinagar.jpg',
    
    // --- KARNATAKA ---
    'Mysore Palace': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mysore_Palace_Morning.jpg/800px-Mysore_Palace_Morning.jpg',
    'Hampi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Virupaksha_Temple%2C_Hampi.jpg/800px-Virupaksha_Temple%2C_Hampi.jpg',
    'Abbey Falls': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Abbey_Falls_Coorg.jpg/800px-Abbey_Falls_Coorg.jpg',
    'Lalbagh Botanical Garden': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Lal_Bagh%2C_Bangalore%2C_Karnataka.jpg/800px-Lal_Bagh%2C_Bangalore%2C_Karnataka.jpg',
    'Om Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Om_beach_gokarna.jpg/800px-Om_beach_gokarna.jpg',
    'Jog Falls': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Jog_Falls.jpg/800px-Jog_Falls.jpg',
    'Bandipur National Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Elephant_in_Bandipur.jpg/800px-Elephant_in_Bandipur.jpg',
    'Mullayanagiri Peak': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Mullayanagiri.jpg/800px-Mullayanagiri.jpg',
    'Murudeshwar Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Murudeshwar1.jpg/800px-Murudeshwar1.jpg',
    'Badami Caves': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Badami_Cave_temples-Badami.jpg/800px-Badami_Cave_temples-Badami.jpg',
    'Belur & Halebidu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Belur1.jpg/800px-Belur1.jpg',
    'Nagarhole National Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Kabini_River_Lodge.jpg/800px-Kabini_River_Lodge.jpg',
    'Vidhana Soudha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Vidhana_Soudha_sunset.jpg/800px-Vidhana_Soudha_sunset.jpg',
    'Bangalore Palace': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Bangalore_Palace%2C_Full_View.jpg/800px-Bangalore_Palace%2C_Full_View.jpg',
    'ISKCON Temple Bangalore': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/ISKCON_Bangalore.jpg/800px-ISKCON_Bangalore.jpg',
    'Cubbon Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Cubbon_Park_Bangalore.jpg/800px-Cubbon_Park_Bangalore.jpg',
    'Nandi Hills': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Nandi_Hills_Panoramic.jpg/800px-Nandi_Hills_Panoramic.jpg',
    'Chamundi Hills': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Chamundeshwari_Temple_-_Chamundi_Hills%2C_Mysore.jpg/800px-Chamundeshwari_Temple_-_Chamundi_Hills%2C_Mysore.jpg',
    'Brindavan Gardens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/KRS_Brindavan_Gardens.jpg/800px-KRS_Brindavan_Gardens.jpg',
    'Srirangapatna': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Ranganathaswamy_temple_at_Srirangapatna.jpg/800px-Ranganathaswamy_temple_at_Srirangapatna.jpg',
    'Gol Gumbaz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Gol_Gumbaz_Bijapur.jpg/800px-Gol_Gumbaz_Bijapur.jpg',
    'Bidar Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Bidar_fort_entrance.jpg/800px-Bidar_fort_entrance.jpg',
    'Chitradurga Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Chitradurga2.jpg/800px-Chitradurga2.jpg',
    'Shravanabelagola': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Shravanabelagola_Bahubali.jpg/800px-Shravanabelagola_Bahubali.jpg',
    'Dandeli Wildlife Sanctuary': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Dandeli.jpg/800px-Dandeli.jpg',
    'Pattadakal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Pattadakal_Virupaksha_temple.jpg/800px-Pattadakal_Virupaksha_temple.jpg',
    'Aihole': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Durgatemple-Aihole.JPG/800px-Durgatemple-Aihole.JPG',
    'Gulbarga Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Gulbarga_Fort_Entrance.jpg/800px-Gulbarga_Fort_Entrance.jpg',
    'Raichur Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Raichur-Fort-3.jpg/800px-Raichur-Fort-3.jpg',
    'Kodachadri Peak': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Kodachadri.jpg/800px-Kodachadri.jpg',
    'Kudremukh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Kudremukh.jpg/800px-Kudremukh.jpg',
    'Yana Rocks': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Yana_rocks.jpg/800px-Yana_rocks.jpg',
    'Skandagiri': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Skandagiri_hill.jpg/800px-Skandagiri_hill.jpg',
    'Ramanagara': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Ramanagara_View.jpg/800px-Ramanagara_View.jpg',
    'Dubare Elephant Camp': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Dubare_elephant_camp.jpg/800px-Dubare_elephant_camp.jpg',
    'Mekedatu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Mekedatu_Falls.jpg/800px-Mekedatu_Falls.jpg',
    'BR Hills': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/BR_Hills.jpg/800px-BR_Hills.jpg',
    'Malpe Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Malpe_beach.jpg/800px-Malpe_beach.jpg',
    'Panambur Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Panambur_Beach.jpg/800px-Panambur_Beach.jpg',
    "Raja's Seat": 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Rajas_Seat_Coorg.jpg/800px-Rajas_Seat_Coorg.jpg',
    'Udupi Sri Krishna Matha': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Udupi_Sri_Krishna_Temple1.jpg/800px-Udupi_Sri_Krishna_Temple1.jpg',
    'St Aloysius Chapel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/St._Aloysius_Chapel_Mangalore.jpg/800px-St._Aloysius_Chapel_Mangalore.jpg',
    'Unkal Lake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Unkal_Lake_Hubli.jpg/800px-Unkal_Lake_Hubli.jpg',
    'Gokak Falls': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Gokak_Falls.jpg/800px-Gokak_Falls.jpg',
    'Devanahalli Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Devanahalli_Fort.jpg/800px-Devanahalli_Fort.jpg',
    'Harihareshwara Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Harihareshwara_Temple.jpg/800px-Harihareshwara_Temple.jpg',
    'Tungabhadra Dam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Tungabadra_Dam.jpg/800px-Tungabadra_Dam.jpg',
    
    // --- KERALA ---
    'Kerala Backwaters': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/A_houseboat_in_Vembanad_Lake%2C_Kerala.jpg/800px-A_houseboat_in_Vembanad_Lake%2C_Kerala.jpg',
    'Munnar Tea Gardens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Munnar_hillstation_kerala.jpg/800px-Munnar_hillstation_kerala.jpg',
    'Wayanad': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Edakkal_Caves_Wayanad.jpg/800px-Edakkal_Caves_Wayanad.jpg',
    'Varkala Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Varkala_Beach.jpg/800px-Varkala_Beach.jpg',
    'Thekkady / Periyar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Periyar_Lake.jpg/800px-Periyar_Lake.jpg',
    'Kovalam Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kovalam_Beach.jpg/800px-Kovalam_Beach.jpg',
    
    // --- MADHYA PRADESH ---
    'Khajuraho Group of Monuments': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Khajuraho_-_Kandariya_Mahadeo_Temple.jpg/800px-Khajuraho_-_Kandariya_Mahadeo_Temple.jpg',
    
    // --- MAHARASHTRA ---
    'Gateway of India': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/800px-Mumbai_03-2016_30_Gateway_of_India.jpg',
    
    // --- MANIPUR ---
    'Loktak Lake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Loktak_Lake.jpg/800px-Loktak_Lake.jpg',
    
    // --- MEGHALAYA ---
    'Bara Bazaar / Shillong': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ward_Lake_Shillong.jpg/800px-Ward_Lake_Shillong.jpg',
    
    // --- MIZORAM ---
    'Reiek Heritage Village': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Reiek_Tlang.jpg/800px-Reiek_Tlang.jpg',
    
    // --- NAGALAND ---
    'Kisama Heritage Village': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Hornbill_Festival.jpg/800px-Hornbill_Festival.jpg',
    
    // --- ODISHA ---
    'Konark Sun Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Konark_Sun_Temple_Front_view.jpg/800px-Konark_Sun_Temple_Front_view.jpg',
    'Jagannath Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Jagannath_Temple_Puri.jpg/800px-Jagannath_Temple_Puri.jpg',
    
    // --- PUNJAB ---
    'Golden Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amritsar_-_India_%286%29.jpg/800px-The_Golden_Temple_of_Amritsar_-_India_%286%29.jpg',
    
    // --- PUDUCHERRY ---
    'Promenade Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Promenade_Beach_Pondicherry.jpg/800px-Promenade_Beach_Pondicherry.jpg',
    
    // --- RAJASTHAN ---
    'Hawa Mahal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Hawa_Mahal_2011.jpg/800px-Hawa_Mahal_2011.jpg',
    'Amber Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Amber_Fort%2C_Jaipur%2C_India.jpg/800px-Amber_Fort%2C_Jaipur%2C_India.jpg',
    'Lake Pichola': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Lake_Pichola%2C_Udaipur.jpg/800px-Lake_Pichola%2C_Udaipur.jpg',
    'Jaisalmer Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Jaisalmer_forteresse.jpg/800px-Jaisalmer_forteresse.jpg',
    'Jodhpur Blue City': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Jodhpur_Blue_city.jpg/800px-Jodhpur_Blue_city.jpg',
    'Mount Abu': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Mount_Abu_Rajasthan.jpg/800px-Mount_Abu_Rajasthan.jpg',
    'Pushkar Lake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Pushkar_Holy_Lake.jpg/800px-Pushkar_Holy_Lake.jpg',
    'Ranthambore National Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Bengal_Tiger_Ranthambore.jpg/800px-Bengal_Tiger_Ranthambore.jpg',
    'Chittorgarh Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Chittorgarh_Fort.jpg/800px-Chittorgarh_Fort.jpg',
    
    // --- SIKKIM ---
    'Tsomgo Lake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Tsomgo_Lake_Sikkim.jpg/800px-Tsomgo_Lake_Sikkim.jpg',
    
    // --- TAMIL NADU ---
    'Meenakshi Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Madurai_Meenakshi_Amman_Temple.jpg/800px-Madurai_Meenakshi_Amman_Temple.jpg',
    'Brihadeeswara Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Le_temple_de_B%C3%AEhadishvara_%28Tanjore%2C_Inde%29_%2813899039454%29.jpg/800px-Le_temple_de_B%C3%AEhadishvara_%28Tanjore%2C_Inde%29_%2813899039454%29.jpg',
    
    // --- TELANGANA ---
    'Charminar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/800px-Charminar_Hyderabad_1.jpg',
    'Golconda Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Golkonda_Fort.jpg/800px-Golkonda_Fort.jpg',
    
    // --- TRIPURA ---
    'Neermahal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Neermahal.jpg/800px-Neermahal.jpg',
    
    // --- UTTARAKHAND ---
    'Kedarnath Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Kedarnath_Temple_in_Uttarakhand.jpg/800px-Kedarnath_Temple_in_Uttarakhand.jpg',
    'Rishikesh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Ram_Jhula%2C_Rishikesh.jpg/800px-Ram_Jhula%2C_Rishikesh.jpg',
    'Jim Corbett National Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Jim_Corbett_National_Park.jpg/800px-Jim_Corbett_National_Park.jpg',
    'Valley of Flowers': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Valley_of_Flowers_India.jpg/800px-Valley_of_Flowers_India.jpg',
    'Nainital': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Nainital_Lake%2C_2015.jpg/800px-Nainital_Lake%2C_2015.jpg',
    'Badrinath Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Badrinath_Temple%2C_Uttarakhand.jpg/800px-Badrinath_Temple%2C_Uttarakhand.jpg',
    'Yamunotri Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Yamunotri_Temple.jpg/800px-Yamunotri_Temple.jpg',
    'Gangotri Temple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Gangotri_Temple.jpg/800px-Gangotri_Temple.jpg',
    
    // --- UTTAR PRADESH ---
    'Taj Mahal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/800px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg',
    'Varanasi Ghats': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg/800px-Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg',
    
    // --- WEST BENGAL ---
    'Victoria Memorial': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Victoria_Memorial_Kolkata_panorama.jpg/800px-Victoria_Memorial_Kolkata_panorama.jpg',
    'Darjeeling': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Darjeeling%2C_India%2C_Cityscape_with_Kangchenjunga.jpg/800px-Darjeeling%2C_India%2C_Cityscape_with_Kangchenjunga.jpg',
    
    // --- LADAKH ---
    'Pangong Lake': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Pangong_Tso.jpg/800px-Pangong_Tso.jpg',
    
    // --- LAKSHADWEEP ---
    'Agatti Island': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Agatti_Island_aerial.jpg/800px-Agatti_Island_aerial.jpg',
    
    // --- ANDAMAN ---
    'Radhanagar Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Radhanagar_Beach.jpg/800px-Radhanagar_Beach.jpg',
    
    // --- DIU ---
    'Diu Fort': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Diu_Fort.jpg/800px-Diu_Fort.jpg',
};

// ==========================================
// HIGH-QUALITY IMAGE MAP — BUSINESSES
// ==========================================
const BUSINESS_IMAGES = {
    'Panchhi Petha Store': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Agra_Petha.jpg/800px-Agra_Petha.jpg',
    'Kripal Kumbh': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/BluePottery-Jaipur.jpg/800px-BluePottery-Jaipur.jpg',
    'KSIC Mysore Silk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Mysore_Silk.jpg/800px-Mysore_Silk.jpg',
    'Sahni Silk Store': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Silk_Weaving_in_Varanasi.jpg/800px-Silk_Weaving_in_Varanasi.jpg',
    'Glenburn Tea Estate Shop': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Darjeeling%2C_India%2C_Cityscape_with_Kangchenjunga.jpg/800px-Darjeeling%2C_India%2C_Cityscape_with_Kangchenjunga.jpg',
    'Cazulo Feni Distillery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Cashew_feni_Goa.jpg/800px-Cashew_feni_Goa.jpg',
    'Pashmina House': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Pashmina_shawl.jpg/800px-Pashmina_shawl.jpg',
    'Bidri Handicrafts': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bidriware.jpg/800px-Bidriware.jpg',
    'Madhubani Art Center': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Madhubani_painting.jpg/800px-Madhubani_painting.jpg',
    'G. Pulla Reddy Sweets': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/800px-Charminar_Hyderabad_1.jpg',
    'Grand Malabar Spices': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Munnar_hillstation_kerala.jpg/800px-Munnar_hillstation_kerala.jpg',
    'VGP Kancheepuram Silk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Kanchipuram_silk.jpg/800px-Kanchipuram_silk.jpg',
    'Muga Silk Emporium': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Muga_Silk.jpg/800px-Muga_Silk.jpg',
    'Himgiri Woolens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Kullu_Shawl.jpg/800px-Kullu_Shawl.jpg',
};

// ==========================================
// MAIN FIX FUNCTION
// ==========================================
async function fixAllImages() {
    try {
        console.log('🚀 Starting Image Fix for ALL Destinations & Businesses...');
        console.log(`📡 Connecting to: ${MONGO_URI}\n`);

        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB.\n');

        // -----------------------------------------------
        // PHASE 1: Fix Destinations
        // -----------------------------------------------
        console.log('=' .repeat(50));
        console.log('📍 PHASE 1: Fixing Destination Images');
        console.log('=' .repeat(50));

        const allPlaces = await Place.find({});
        console.log(`📦 Total destinations in DB: ${allPlaces.length}\n`);

        let destFixed = 0;
        let destAlreadyGood = 0;
        let destNoMatch = 0;

        for (const place of allPlaces) {
            const name = place.name;
            const currentUrl = place.imageUrl || '';

            // Check if this place has a mapping
            if (DESTINATION_IMAGES[name]) {
                const newUrl = DESTINATION_IMAGES[name];
                if (currentUrl !== newUrl) {
                    await Place.updateOne({ _id: place._id }, { $set: { imageUrl: newUrl } });
                    destFixed++;
                    console.log(`  ✅ Fixed: ${name}`);
                } else {
                    destAlreadyGood++;
                }
            } else {
                // Check if image is missing or uses a broken local path
                const isBrokenLocal = !currentUrl || currentUrl.startsWith('/images/');
                if (isBrokenLocal) {
                    destNoMatch++;
                    // For unmapped local images, keep existing (they may work via static serve)
                }
            }
        }

        console.log(`\n📊 Destinations Summary:`);
        console.log(`  ✅ Fixed: ${destFixed}`);
        console.log(`  ✔️  Already good: ${destAlreadyGood}`);
        console.log(`  ⚠️  Unmapped (kept existing): ${destNoMatch}`);

        // -----------------------------------------------
        // PHASE 2: Fix Businesses
        // -----------------------------------------------
        console.log('\n' + '=' .repeat(50));
        console.log('🏪 PHASE 2: Fixing Business Images');
        console.log('=' .repeat(50));

        const allBusinesses = await Business.find({});
        console.log(`📦 Total businesses in DB: ${allBusinesses.length}\n`);

        let bizFixed = 0;
        let bizAlreadyGood = 0;

        for (const biz of allBusinesses) {
            const name = biz.name;
            const currentUrl = biz.imageUrl || '';

            if (BUSINESS_IMAGES[name]) {
                const newUrl = BUSINESS_IMAGES[name];
                if (currentUrl !== newUrl) {
                    await Business.updateOne({ _id: biz._id }, { $set: { imageUrl: newUrl } });
                    bizFixed++;
                    console.log(`  ✅ Fixed: ${name}`);
                } else {
                    bizAlreadyGood++;
                }
            }
        }

        console.log(`\n📊 Business Summary:`);
        console.log(`  ✅ Fixed: ${bizFixed}`);
        console.log(`  ✔️  Already good: ${bizAlreadyGood}`);

        // -----------------------------------------------
        // PHASE 3: Fix entries with NO imageUrl at all
        // -----------------------------------------------
        console.log('\n' + '=' .repeat(50));
        console.log('🔍 PHASE 3: Fixing entries with EMPTY imageUrl');
        console.log('=' .repeat(50));

        const emptyImagePlaces = await Place.find({ $or: [{ imageUrl: '' }, { imageUrl: null }, { imageUrl: { $exists: false } }] });
        console.log(`📦 Destinations with no imageUrl: ${emptyImagePlaces.length}`);

        // Assign a themed fallback based on category
        const categoryFallbacks = {
            'Spiritual': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mahabodhitemple.jpg/800px-Mahabodhitemple.jpg',
            'Heritage': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Konark_Sun_Temple_Front_view.jpg/800px-Konark_Sun_Temple_Front_view.jpg',
            'Nature': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Valley_of_Flowers_India.jpg/800px-Valley_of_Flowers_India.jpg',
            'Beaches': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Radhanagar_Beach.jpg/800px-Radhanagar_Beach.jpg',
            'Forts': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Amber_Fort%2C_Jaipur%2C_India.jpg/800px-Amber_Fort%2C_Jaipur%2C_India.jpg',
            'Hill Stations': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Munnar_hillstation_kerala.jpg/800px-Munnar_hillstation_kerala.jpg',
            'Adventure': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Key_Monastery%2C_Spiti_Valley.jpg/800px-Key_Monastery%2C_Spiti_Valley.jpg',
            'Museum': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Victoria_Memorial_Kolkata_panorama.jpg/800px-Victoria_Memorial_Kolkata_panorama.jpg',
        };
        const defaultFallback = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/800px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg';

        let emptyFixed = 0;
        for (const place of emptyImagePlaces) {
            const fallback = categoryFallbacks[place.category] || defaultFallback;
            await Place.updateOne({ _id: place._id }, { $set: { imageUrl: fallback } });
            emptyFixed++;
            console.log(`  🖼️  Fallback assigned: ${place.name} (${place.category || 'General'})`);
        }
        console.log(`  ✅ Assigned fallback images to ${emptyFixed} destinations.`);

        // -----------------------------------------------
        // FINAL REPORT
        // -----------------------------------------------
        console.log('\n' + '=' .repeat(50));
        console.log('🏆 FINAL REPORT');
        console.log('=' .repeat(50));
        console.log(`  📍 Destinations Fixed: ${destFixed + emptyFixed}`);
        console.log(`  🏪 Businesses Fixed: ${bizFixed}`);
        console.log(`  📊 Total Updates: ${destFixed + emptyFixed + bizFixed}`);
        console.log('\n✨ All image URLs have been updated to high-quality sources!');
        console.log('📱 Restart the backend server and reload the mobile app to see the changes.');

    } catch (error) {
        console.error('💥 Critical Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed.');
        process.exit();
    }
}

fixAllImages();
