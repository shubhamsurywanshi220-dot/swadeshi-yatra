const allPlaces = [
    // --- ANDHRA PRADESH ---
    {
        id: 'ap1',
        name: 'Tirumala Venkateswara Temple',
        location: 'Tirupati, Andhra Pradesh',
        state: 'Andhra Pradesh',
        city: 'Tirupati',
        description: 'A landmark Vaishnavite temple dedicated to Lord Venkateswara.',
        imageUrl: '/images/ap_tirumala.jpg',
        category: 'Spiritual',
        rating: 4.9,
        bestTime: 'Sep-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        contactInfo: {
            website: 'https://tirumala.org'
        },
        coordinates: { latitude: 13.6833, longitude: 79.3472 }
    },

    // --- ARUNACHAL PRADESH ---
    {
        id: 'arp1',
        name: 'Tawang Monastery',
        location: 'Tawang, Arunachal Pradesh',
        state: 'Arunachal Pradesh',
        city: 'Tawang',
        description: 'The largest monastery in India and second largest in the world.',
        imageUrl: '/images/arp_tawang.jpg',
        category: 'Spiritual',
        rating: 4.8,
        bestTime: 'Mar-Jun',
        entryFee: '₹20',
        isEcoFriendly: true,
        coordinates: { latitude: 27.5861, longitude: 91.8594 }
    },

    // --- ASSAM ---
    {
        id: 'as1',
        name: 'Kaziranga National Park',
        location: 'Kanchanjuri, Assam',
        state: 'Assam',
        city: 'Kanchanjuri',
        description: 'A World Heritage Site giving shelter to two-thirds of the world\'s great one-horned rhinoceroses.',
        imageUrl: '/images/as_kaziranga.jpg',
        category: 'Nature',
        rating: 4.8,
        bestTime: 'Nov-Apr',
        entryFee: '₹100',
        isEcoFriendly: true,
        coordinates: { latitude: 26.5775, longitude: 93.1711 }
    },

    // --- BIHAR ---
    {
        id: 'br1',
        name: 'Mahabodhi Temple',
        location: 'Bodh Gaya, Bihar',
        state: 'Bihar',
        city: 'Bodh Gaya',
        description: 'A UNESCO World Heritage Site, it is one of the four holy sites related to the life of the Lord Buddha.',
        imageUrl: '/images/br_mahabodhi.jpg',
        category: 'Spiritual',
        rating: 4.8,
        bestTime: 'Oct-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 24.6960, longitude: 84.9914 }
    },

    // --- CHHATTISGARH ---
    {
        id: 'cg1',
        name: 'Chitrakote Falls',
        location: 'Jagdalpur, Chhattisgarh',
        state: 'Chhattisgarh',
        city: 'Jagdalpur',
        description: 'Often called the "Niagara of India", it is the widest fall in India.',
        imageUrl: '/images/cg_chitrakote.jpg',
        category: 'Nature',
        rating: 4.7,
        bestTime: 'Jul-Oct',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 19.2057, longitude: 81.7067 }
    },

    // --- GOA (Existing) ---
    // --- GOA (Official Tourism Sourced) ---
    {
        id: 'ga1',
        name: 'Calangute Beach',
        location: 'North Goa, Goa',
        state: 'Goa',
        city: 'Calangute',
        description: 'The "Queen of Beaches" in Goa, famous for its golden sand and water sports.',
        imageUrl: '/images/goa_calangute.jpg',
        category: 'Beaches',
        rating: 4.6,
        bestTime: 'Nov-Feb',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 15.5494, longitude: 73.7535 }
    },
    {
        id: 'ga2',
        name: 'Basilica of Bom Jesus',
        location: 'Old Goa, Goa',
        state: 'Goa',
        city: 'Old Goa',
        description: 'A UNESCO World Heritage Site containing the mortal remains of St. Francis Xavier.',
        imageUrl: '/images/goa_basilica.jpg',
        category: 'Heritage',
        rating: 4.8,
        bestTime: 'Year Round',
        entryFee: 'Free',
        isEcoFriendly: false,
        coordinates: { latitude: 15.5009, longitude: 73.9116 }
    },
    {
        id: 'ga3',
        name: 'Dudhsagar Waterfalls',
        location: 'Sanguem, Goa',
        state: 'Goa',
        city: 'Sanguem',
        description: 'A majestic four-tiered waterfall on the Mandovi River.',
        imageUrl: '/images/goa_dudhsagar.jpg',
        category: 'Nature',
        rating: 4.7,
        bestTime: 'Oct-May',
        entryFee: '₹400 (Jeep Safari)',
        isEcoFriendly: true,
        coordinates: { latitude: 15.3144, longitude: 74.3143 }
    },
    {
        id: 'ga4',
        name: 'Fort Aguada',
        location: 'Candolim, Goa',
        state: 'Goa',
        city: 'Candolim',
        description: 'A 17th-century Portuguese fort standing on Sinquerim Beach.',
        imageUrl: '/images/goa_fort_aguada.jpg',
        category: 'Heritage',
        rating: 4.6,
        bestTime: 'Year Round',
        entryFee: 'Free',
        isEcoFriendly: false,
        coordinates: { latitude: 15.4920, longitude: 73.7737 }
    },
    {
        id: 'ga5',
        name: 'Palolem Beach',
        location: 'South Goa, Goa',
        state: 'Goa',
        city: 'Palolem',
        description: 'A scenic beach in Canacona known for its calm waters and nightlife.',
        imageUrl: '/images/goa_palolem.jpg',
        category: 'Beaches',
        rating: 4.8,
        bestTime: 'Nov-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 15.0100, longitude: 74.0200 }
    },

    // --- GUJARAT ---
    // --- GUJARAT (Official Tourism Sourced) ---
    {
        id: 'gj1',
        name: 'Statue of Unity',
        location: 'Kevadia, Gujarat',
        state: 'Gujarat',
        city: 'Kevadia',
        description: 'The world\'s tallest statue, dedicated to Sardar Vallabhbhai Patel.',
        imageUrl: '/images/gj_statue_of_unity.jpg',
        category: 'Heritage',
        rating: 4.9,
        bestTime: 'Oct-Mar',
        entryFee: '₹150',
        isEcoFriendly: true,
        coordinates: { latitude: 21.8380, longitude: 73.7191 }
    },
    {
        id: 'gj2',
        name: 'Rann of Kutch',
        location: 'Kutch, Gujarat',
        state: 'Gujarat',
        city: 'Kutch',
        description: 'A vast salt marsh known for the Rann Utsav and its white desert landscape.',
        imageUrl: '/images/gj_rann_of_kutch.jpg',
        category: 'Nature',
        rating: 4.8,
        bestTime: 'Nov-Feb',
        entryFee: 'Permit',
        isEcoFriendly: true,
        coordinates: { latitude: 23.7337, longitude: 69.8597 }
    },
    {
        id: 'gj3',
        name: 'Gir National Park',
        location: 'Talala Gir, Gujarat',
        state: 'Gujarat',
        city: 'Gir',
        description: 'The only natural habitat of the Asiatic Lion.',
        imageUrl: '/images/gj_gir_lion.jpg',
        category: 'Nature',
        rating: 4.8,
        bestTime: 'Dec-Mar',
        entryFee: '₹800',
        isEcoFriendly: true,
        coordinates: { latitude: 21.1243, longitude: 70.8242 }
    },
    {
        id: 'gj4',
        name: 'Somnath Temple',
        location: 'Veraval, Gujarat',
        state: 'Gujarat',
        city: 'Veraval',
        description: 'The first among the twelve Jyotirlinga shrines of Shiva.',
        imageUrl: '/images/gj_somnath.jpg',
        category: 'Spiritual',
        rating: 4.9,
        bestTime: 'Sep-Mar',
        entryFee: 'Free',
        isEcoFriendly: false,
        coordinates: { latitude: 20.8880, longitude: 70.4010 }
    },
    {
        id: 'gj5',
        name: 'Modhera Sun Temple',
        location: 'Mehsana, Gujarat',
        state: 'Gujarat',
        city: 'Mehsana',
        description: 'A Hindu temple dedicated to the solar deity Surya, located on the bank of the River Pushpavati.',
        imageUrl: '/images/gj_sun_temple.jpg',
        category: 'Heritage',
        rating: 4.7,
        bestTime: 'Oct-Mar',
        entryFee: '₹25',
        isEcoFriendly: false,
        coordinates: { latitude: 23.5835, longitude: 72.1328 }
    },

    // --- HARYANA ---
    {
        id: 'hr1',
        name: 'Sultanpur Bird Sanctuary',
        location: 'Gurugram, Haryana',
        state: 'Haryana',
        city: 'Gurugram',
        description: 'A popular national park and bird watcher\'s paradise.',
        imageUrl: '/images/hr_sultanpur.jpg',
        category: 'Nature',
        rating: 4.5,
        bestTime: 'Dec-Feb',
        entryFee: '₹40',
        isEcoFriendly: true,
        coordinates: { latitude: 28.4623, longitude: 76.8926 }
    },

    // --- HIMACHAL PRADESH ---
    {
        id: 'hp1',
        name: 'Manali',
        location: 'Manali, Himachal Pradesh',
        state: 'Himachal Pradesh',
        city: 'Manali',
        description: 'A high-altitude Himalayan resort town known for its backpacking center and honeymoon destination.',
        imageUrl: '/images/hp_manali.jpg',
        category: 'Hill Stations',
        rating: 4.8,
        bestTime: 'Oct-Jun',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 32.2432, longitude: 77.1892 }
    },
    {
        id: 'hp2',
        name: 'Spiti Valley',
        location: 'Spiti, Himachal Pradesh',
        state: 'Himachal Pradesh',
        city: 'Spiti',
        description: 'A cold desert mountain valley located high in the Himalayas.',
        imageUrl: '/images/hp_spiti.jpg',
        category: 'Adventure',
        rating: 4.9,
        bestTime: 'May-Oct',
        entryFee: 'Permit',
        isEcoFriendly: true,
        coordinates: { latitude: 32.2281, longitude: 78.0934 }
    },

    // --- JHARKHAND ---
    {
        id: 'jh1',
        name: 'Hundru Falls',
        location: 'Ranchi, Jharkhand',
        state: 'Jharkhand',
        city: 'Ranchi',
        description: 'The 34th highest waterfall in India featuring spectacular scenery.',
        imageUrl: '/images/jh_hundru.jpg',
        category: 'Nature',
        rating: 4.4,
        bestTime: 'Jun-Jan',
        entryFee: '₹20',
        isEcoFriendly: true,
        coordinates: { latitude: 23.4449, longitude: 85.5393 }
    },

    // --- KARNATAKA ---
    {
        id: 'ka1',
        name: 'Hampi',
        location: 'Hampi, Karnataka',
        state: 'Karnataka',
        city: 'Hampi',
        description: 'A UNESCO World Heritage Site famous for its ancient ruins and temples.',
        imageUrl: '/images/hampi.jpg',
        category: 'Heritage',
        rating: 4.8,
        bestTime: 'Oct-Mar',
        entryFee: '₹40 (Ind), ₹600 (For)',
        isEcoFriendly: true,
        coordinates: { latitude: 15.3350, longitude: 76.4600 }
    },
    {
        id: 'ka2',
        name: 'Mysore Palace',
        location: 'Mysore, Karnataka',
        state: 'Karnataka',
        city: 'Mysore',
        description: 'A historical palace and a royal residence of the Wadiyar dynasty.',
        imageUrl: '/images/mysore_palace.jpg',
        category: 'Heritage',
        rating: 4.7,
        bestTime: 'Oct-Mar',
        entryFee: '₹70 (Ind), ₹200 (For)',
        isEcoFriendly: false,
        coordinates: { latitude: 12.3051, longitude: 76.6551 }
    },
    {
        id: 'ka3',
        name: 'Abbey Falls',
        location: 'Madikeri, Karnataka',
        state: 'Karnataka',
        city: 'Coorg',
        description: 'A beautiful waterfall located in the Western Ghats, surrounded by coffee plantations.',
        imageUrl: '/images/coorg_abbey.jpg',
        category: 'Nature',
        rating: 4.6,
        bestTime: 'Sep-Jan',
        entryFee: '₹15',
        isEcoFriendly: true,
        coordinates: { latitude: 12.4533, longitude: 75.7180 }
    },
    {
        id: 'ka4',
        name: 'Lalbagh Botanical Garden',
        location: 'Bengaluru, Karnataka',
        state: 'Karnataka',
        city: 'Bengaluru',
        description: 'An old botanical garden known for its glass house and biannual flower shows.',
        imageUrl: '/images/lalbagh.jpg',
        category: 'Nature',
        rating: 4.5,
        bestTime: 'Year Round',
        entryFee: '₹30',
        isEcoFriendly: true,
        coordinates: { latitude: 12.9507, longitude: 77.5847 }
    },
    {
        id: 'ka5',
        name: 'Om Beach',
        location: 'Gokarna, Karnataka',
        state: 'Karnataka',
        city: 'Gokarna',
        description: 'A scenic beach named after its Om-shape, known for sunset views and water sports.',
        imageUrl: '/images/gokarna_om.jpg',
        category: 'Beaches',
        rating: 4.7,
        bestTime: 'Oct-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 14.5437, longitude: 74.3182 }
    },
    {
        id: 'ka6',
        name: 'Jog Falls',
        location: 'Shimoga, Karnataka',
        state: 'Karnataka',
        city: 'Shimoga',
        description: 'The second-highest plunge waterfall in India, offering a spectacular view during monsoons.',
        imageUrl: '/images/jog_falls.jpg',
        category: 'Nature',
        rating: 4.8,
        bestTime: 'Jul-Oct',
        entryFee: '₹10',
        isEcoFriendly: true,
        coordinates: { latitude: 14.2294, longitude: 74.8109 }
    },
    {
        id: 'ka7',
        name: 'Bandipur National Park',
        location: 'Chamarajanagar, Karnataka',
        state: 'Karnataka',
        city: 'Bandipur',
        description: 'A tiger reserve giving a chance to see elephants, tigers, and gaurs in their natural habitat.',
        imageUrl: '/images/bandipur.jpg',
        category: 'Nature',
        rating: 4.7,
        bestTime: 'Oct-May',
        entryFee: '₹300',
        isEcoFriendly: true,
        coordinates: { latitude: 11.6602, longitude: 76.6264 }
    },
    {
        id: 'ka8',
        name: 'Mullayanagiri Peak',
        location: 'Chikmagalur, Karnataka',
        state: 'Karnataka',
        city: 'Chikmagalur',
        description: 'The highest peak in Karnataka, known for its peaceful ambiance and trekking trails.',
        imageUrl: '/images/chikmagalur.jpg',
        category: 'Adventure',
        rating: 4.8,
        bestTime: 'Sep-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 13.3908, longitude: 75.7214 }
    },
    {
        id: 'ka9',
        name: 'Murudeshwar Temple',
        location: 'Murudeshwar, Karnataka',
        state: 'Karnataka',
        city: 'Murudeshwar',
        description: 'Famous for the world\'s second-tallest Shiva statue and the 20-storied Gopuram.',
        imageUrl: '/images/murudeshwar.jpg',
        category: 'Spiritual',
        rating: 4.7,
        bestTime: 'Oct-May',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 14.0940, longitude: 74.4849 }
    },
    {
        id: 'ka10',
        name: 'Badami Caves',
        location: 'Badami, Karnataka',
        state: 'Karnataka',
        city: 'Badami',
        description: 'A complex of Hindu and Jain cave temples dating back to the 6th century.',
        imageUrl: '/images/badami.jpg',
        category: 'Heritage',
        rating: 4.6,
        bestTime: 'Oct-Mar',
        entryFee: '₹25',
        isEcoFriendly: false,
        coordinates: { latitude: 15.9189, longitude: 75.6767 }
    },
    {
        id: 'ka11',
        name: 'Belur & Halebidu',
        location: 'Hassan, Karnataka',
        state: 'Karnataka',
        city: 'Hassan',
        description: 'Ancient temples known for their intricate sculptures and Hoysala architecture.',
        imageUrl: '/images/belur.jpg',
        category: 'Heritage',
        rating: 4.8,
        bestTime: 'Oct-Mar',
        entryFee: '₹40',
        isEcoFriendly: false,
        coordinates: { latitude: 13.2120, longitude: 75.9942 }
    },
    {
        id: 'ka12',
        name: 'Nagarhole National Park',
        location: 'Kodagu, Karnataka',
        state: 'Karnataka',
        city: 'Kodagu',
        description: 'A premier tiger reserve and part of the Nilgiri Biosphere Reserve.',
        imageUrl: '/images/nagarhole.jpg',
        category: 'Nature',
        rating: 4.7,
        bestTime: 'Oct-May',
        entryFee: '₹300',
        isEcoFriendly: true,
        coordinates: { latitude: 12.0314, longitude: 76.1207 }
    },

    // --- KERALA (Existing + Enhanced) ---
    {
        id: 'kl1',
        name: 'Kerala Backwaters',
        location: 'Alleppey, Kerala',
        state: 'Kerala',
        city: 'Alleppey',
        description: 'A network of brackish lagoons and lakes lying parallel to the Arabian Sea coast.',
        imageUrl: '/images/kl_backwaters.jpg',
        category: 'Nature',
        rating: 4.8,
        bestTime: 'Sep-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        contactInfo: {
            phone: '+91-477-2251796',
            email: 'info@keralatourism.org',
            website: 'https://www.keralatourism.org'
        },
        coordinates: { latitude: 9.4981, longitude: 76.3388 }
    },
    {
        id: 'kl2',
        name: 'Munnar Tea Gardens',
        location: 'Munnar, Kerala',
        state: 'Kerala',
        city: 'Munnar',
        description: 'Rolling hills dotted with tea plantations, established in the late 19th century.',
        imageUrl: '/images/kl_munnar.jpg',
        category: 'Hill Stations',
        rating: 4.9,
        bestTime: 'Sep-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        contactInfo: {
            phone: '+91-4865-231516',
            website: 'https://munnar.com'
        },
        coordinates: { latitude: 10.0889, longitude: 77.0595 }
    },
    {
        id: 'kl3',
        name: 'Wayanad',
        location: 'Wayanad, Kerala',
        state: 'Kerala',
        city: 'Wayanad',
        description: 'A rural district in Kerala state, known for its lush green forests, waterfalls, and spice plantations.',
        imageUrl: '/images/kl_wayanad.jpg',
        category: 'Nature',
        rating: 4.7,
        bestTime: 'Oct-May',
        entryFee: 'Varied',
        isEcoFriendly: true,
        coordinates: { latitude: 11.6854, longitude: 76.1320 }
    },
    {
        id: 'kl4',
        name: 'Varkala Beach',
        location: 'Varkala, Kerala',
        state: 'Kerala',
        city: 'Varkala',
        description: 'A beautiful coastal town known for its unique red sandstone cliffs adjacent to the Arabian Sea.',
        imageUrl: '/images/kl_varkala.jpg',
        category: 'Beaches',
        rating: 4.8,
        bestTime: 'Oct-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 8.7379, longitude: 76.7163 }
    },
    {
        id: 'kl5',
        name: 'Thekkady / Periyar',
        location: 'Thekkady, Kerala',
        state: 'Kerala',
        city: 'Thekkady',
        description: 'Famous for its wildlife sanctuary and boat cruises on the Periyar Lake.',
        imageUrl: '/images/kl_thekkady.jpg',
        category: 'Nature',
        rating: 4.7,
        bestTime: 'Sep-Mar',
        entryFee: '₹150',
        isEcoFriendly: true,
        coordinates: { latitude: 9.6031, longitude: 77.1610 }
    },
    {
        id: 'kl6',
        name: 'Kovalam Beach',
        location: 'Thiruvananthapuram, Kerala',
        state: 'Kerala',
        city: 'Kovalam',
        description: 'An internationally renowned beach with three adjacent crescent beaches.',
        imageUrl: '/images/kl_kovalam.jpg',
        category: 'Beaches',
        rating: 4.6,
        bestTime: 'Sep-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 8.4021, longitude: 76.9787 }
    },

    // --- MADHYA PRADESH ---
    {
        id: 'mp1',
        name: 'Khajuraho Group of Monuments',
        location: 'Khajuraho, Madhya Pradesh',
        state: 'Madhya Pradesh',
        city: 'Khajuraho',
        description: 'A group of Hindu and Jain temples famous for their Nagara-style architectural symbolism.',
        imageUrl: '/images/mp_khajuraho.jpg',
        category: 'Heritage',
        rating: 4.8,
        bestTime: 'Oct-Feb',
        entryFee: '₹40',
        isEcoFriendly: false,
        coordinates: { latitude: 24.8318, longitude: 79.9199 }
    },

    // --- MAHARASHTRA ---
    {
        id: 'mh1',
        name: 'Gateway of India',
        location: 'Mumbai, Maharashtra',
        state: 'Maharashtra',
        city: 'Mumbai',
        description: 'An arch-monument built in the 20th century to commemorate the landing of King George V.',
        imageUrl: '/images/mh_gateway.jpg',
        category: 'Heritage',
        rating: 4.7,
        bestTime: 'Year Round',
        entryFee: 'Free',
        isEcoFriendly: false,
        coordinates: { latitude: 18.9220, longitude: 72.8347 }
    },

    // --- MANIPUR ---
    {
        id: 'mn1',
        name: 'Loktak Lake',
        location: 'Moirang, Manipur',
        state: 'Manipur',
        city: 'Moirang',
        description: 'The largest freshwater lake in Northeast India, famous for the phumdis floating on it.',
        imageUrl: '/images/mn_loktak.jpg',
        category: 'Nature',
        rating: 4.7,
        bestTime: 'Oct-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 24.5562, longitude: 93.8123 }
    },

    // --- MEGHALAYA ---
    {
        id: 'ml1',
        name: 'Bara Bazaar / Shillong',
        location: 'Shillong, Meghalaya',
        state: 'Meghalaya',
        city: 'Shillong',
        description: 'Known as the "Scotland of the East". Famous for its rolling hills and waterfalls.',
        imageUrl: '/images/ml_shillong.jpg',
        category: 'Nature',
        rating: 4.8,
        bestTime: 'Sep-May',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 25.5788, longitude: 91.8933 }
    },

    // --- MIZORAM ---
    {
        id: 'mz1',
        name: 'Reiek Heritage Village',
        location: 'Reiek, Mizoram',
        state: 'Mizoram',
        city: 'Reiek',
        description: 'A typical Mizo village which showcases the rich culture and tradition of the Mizo people.',
        imageUrl: '/images/mz_reiek.jpg',
        category: 'Heritage',
        rating: 4.6,
        bestTime: 'Oct-Mar',
        entryFee: '₹20',
        isEcoFriendly: true,
        coordinates: { latitude: 23.6936, longitude: 92.6841 }
    },

    // --- NAGALAND ---
    {
        id: 'nl1',
        name: 'Kisama Heritage Village',
        location: 'Kohima, Nagaland',
        state: 'Nagaland',
        city: 'Kohima',
        description: 'The venue for the famous Hornbill Festival, showcasing the culture of Naga tribes.',
        imageUrl: '/images/nl_kisama.jpg',
        category: 'Heritage',
        rating: 4.7,
        bestTime: 'Dec',
        entryFee: '₹20',
        isEcoFriendly: true,
        coordinates: { latitude: 25.6173, longitude: 94.1166 }
    },

    // --- ODISHA ---
    {
        id: 'od1',
        name: 'Konark Sun Temple',
        location: 'Konark, Odisha',
        state: 'Odisha',
        city: 'Konark',
        description: 'A 13th-century CE Sun Temple attributed to King Narasimhadeva I.',
        imageUrl: '/images/od_konark.jpg',
        category: 'Heritage',
        rating: 4.9,
        bestTime: 'Sep-Mar',
        entryFee: '₹40',
        isEcoFriendly: false,
        coordinates: { latitude: 19.8876, longitude: 86.0945 }
    },

    // --- PUNJAB ---
    {
        id: 'pb1',
        name: 'Golden Temple',
        location: 'Amritsar, Punjab',
        state: 'Punjab',
        city: 'Amritsar',
        description: 'The holiest Gurdwara of Sikhism. Also known as Sri Harmandir Sahib.',
        imageUrl: '/images/pb_golden_temple.jpg',
        category: 'Spiritual',
        rating: 5.0,
        bestTime: 'Oct-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 31.6200, longitude: 74.8765 }
    },

    // --- RAJASTHAN (Existing) ---
    {
        id: 'rj1',
        name: 'Hawa Mahal',
        location: 'Jaipur, Rajasthan',
        state: 'Rajasthan',
        city: 'Jaipur',
        description: 'The "Palace of Winds" built from red and pink sandstone.',
        imageUrl: '/images/rj_hawa_mahal.jpg',
        category: 'Heritage',
        rating: 4.7,
        bestTime: 'Oct-Mar',
        entryFee: '₹50',
        isEcoFriendly: false,
        contactInfo: {
            phone: '+91-141-2618862',
            email: 'info@hawamahal.com',
            website: 'https://hawamahal.com'
        },
        coordinates: { latitude: 26.9239, longitude: 75.8267 }
    },
    {
        id: 'rj2',
        name: 'Amber Fort',
        location: 'Jaipur, Rajasthan',
        state: 'Rajasthan',
        city: 'Jaipur',
        description: 'A majestic fort located high on a hill, known for its artistic style elements.',
        imageUrl: '/images/rj_amber_fort.jpg',
        category: 'Forts',
        rating: 4.8,
        bestTime: 'Oct-Mar',
        entryFee: '₹100',
        isEcoFriendly: false,
        contactInfo: {
            phone: '+91-141-2530293',
            website: 'https://amberfort.org'
        },
        coordinates: { latitude: 26.9855, longitude: 75.8513 }
    },
    {
        id: 'rj3',
        name: 'Lake Pichola',
        location: 'Udaipur, Rajasthan',
        state: 'Rajasthan',
        city: 'Udaipur',
        description: 'An artificial fresh water lake, created in the year 1362 AD.',
        imageUrl: '/images/rj_lake_pichola.jpg',
        category: 'Nature',
        rating: 4.9,
        bestTime: 'Sep-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        contactInfo: {
            phone: '+91-294-2419010',
            email: 'tourism@udaipur.gov.in'
        },
        coordinates: { latitude: 24.5761, longitude: 73.6791 }
    },
    {
        id: 'rj4',
        name: 'Jaisalmer Fort',
        location: 'Jaisalmer, Rajasthan',
        state: 'Rajasthan',
        city: 'Jaisalmer',
        description: 'One of the very few "living forts" in the world, as nearly one fourth of the old city\'s population still resides within the fort.',
        imageUrl: '/images/rj_jaisalmer_fort.jpg',
        category: 'Forts',
        rating: 4.8,
        bestTime: 'Nov-Feb',
        entryFee: '₹50',
        isEcoFriendly: false,
        coordinates: { latitude: 26.9124, longitude: 70.9167 }
    },
    {
        id: 'rj5',
        name: 'Jodhpur Blue City',
        location: 'Jodhpur, Rajasthan',
        state: 'Rajasthan',
        city: 'Jodhpur',
        description: 'The Blue City of India, famous for its blue houses and the majestic Mehrangarh Fort.',
        imageUrl: '/images/rj_jodhpur.jpg',
        category: 'Heritage',
        rating: 4.8,
        bestTime: 'Oct-Mar',
        entryFee: 'Free',
        isEcoFriendly: false,
        coordinates: { latitude: 26.2389, longitude: 73.0243 }
    },
    {
        id: 'rj6',
        name: 'Mount Abu',
        location: 'Mount Abu, Rajasthan',
        state: 'Rajasthan',
        city: 'Mount Abu',
        description: 'The only hill station in Rajasthan, known for its cool climate and Dilwara Temples.',
        imageUrl: '/images/rj_mount_abu.jpg',
        category: 'Hill Stations',
        rating: 4.7,
        bestTime: 'Year Round',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 24.5926, longitude: 72.7156 }
    },
    {
        id: 'rj7',
        name: 'Pushkar Lake',
        location: 'Pushkar, Rajasthan',
        state: 'Rajasthan',
        city: 'Pushkar',
        description: 'A sacred lake surrounded by 52 bathing ghats and hundreds of temples.',
        imageUrl: '/images/rj_pushkar_lake.jpg',
        category: 'Spiritual',
        rating: 4.6,
        bestTime: 'Oct-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 26.4886, longitude: 74.5510 }
    },
    {
        id: 'rj8',
        name: 'Ranthambore National Park',
        location: 'Sawai Madhopur, Rajasthan',
        state: 'Rajasthan',
        city: 'Sawai Madhopur',
        description: 'One of the best places in India to see tigers in their natural habitat.',
        imageUrl: '/images/rj_ranthambore.jpg',
        category: 'Nature',
        rating: 4.9,
        bestTime: 'Oct-Jun',
        entryFee: '₹600',
        isEcoFriendly: true,
        coordinates: { latitude: 26.0173, longitude: 76.5026 }
    },

    // --- SIKKIM ---
    {
        id: 'sk1',
        name: 'Tsomgo Lake',
        location: 'Gangtok, Sikkim',
        state: 'Sikkim',
        city: 'Gangtok',
        description: 'A glacial lake in the East Sikkim district, it remains frozen during the winter season.',
        imageUrl: '/images/Tsomgo Lake (Sikkim).jpg',
        category: 'Nature',
        rating: 4.9,
        bestTime: 'Mar-May',
        entryFee: 'Permit',
        isEcoFriendly: true,
        coordinates: { latitude: 27.3742, longitude: 88.7619 }
    },

    // --- TAMIL NADU ---
    {
        id: 'tn1',
        name: 'Meenakshi Amman Temple',
        location: 'Madurai, Tamil Nadu',
        state: 'Tamil Nadu',
        city: 'Madurai',
        description: 'A historic Hindu temple dedicated to Meenakshi and her consort Sundareshwarar.',
        imageUrl: '/images/tn_meenakshi.jpg',
        category: 'Spiritual',
        rating: 4.9,
        bestTime: 'Oct-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 9.9195, longitude: 78.1193 }
    },

    // --- TELANGANA ---
    {
        id: 'tg1',
        name: 'Charminar',
        location: 'Hyderabad, Telangana',
        state: 'Telangana',
        city: 'Hyderabad',
        description: 'Constructed in 1591, the landmark is a symbol of Hyderabad.',
        imageUrl: '/images/tg_charminar.jpg',
        category: 'Heritage',
        rating: 4.6,
        bestTime: 'Oct-Mar',
        entryFee: '₹25',
        isEcoFriendly: false,
        coordinates: { latitude: 17.3616, longitude: 78.4747 }
    },

    // --- TRIPURA ---
    {
        id: 'tr1',
        name: 'Neermahal',
        location: 'Melaghar, Tripura',
        state: 'Tripura',
        city: 'Melaghar',
        description: 'A former royal palace built in the middle of the lake Rudrasagar.',
        imageUrl: '/images/tr_neermahal.jpg',
        category: 'Heritage',
        rating: 4.5,
        bestTime: 'Oct-Mar',
        entryFee: '₹30',
        isEcoFriendly: true,
        coordinates: { latitude: 23.4925, longitude: 91.3142 }
    },

    // --- UTTAR PRADESH (Existing) ---
    {
        id: 'up1',
        name: 'Taj Mahal',
        location: 'Agra, Uttar Pradesh',
        state: 'Uttar Pradesh',
        city: 'Agra',
        description: 'An immense mausoleum of white marble, the jewel of Muslim art in India.',
        imageUrl: '/images/up_taj_mahal.jpg',
        category: 'Heritage',
        rating: 4.9,
        bestTime: 'Oct-Mar',
        entryFee: '₹50',
        isEcoFriendly: false,
        contactInfo: {
            phone: '+91-562-2226431',
            website: 'https://tajmahal.gov.in'
        },
        coordinates: { latitude: 27.1751, longitude: 78.0421 }
    },
    {
        id: 'up2',
        name: 'Varanasi Ghats',
        location: 'Varanasi, Uttar Pradesh',
        state: 'Uttar Pradesh',
        city: 'Varanasi',
        description: 'Major religious hub in India, and the holiest of the seven sacred cities.',
        imageUrl: '/images/up_varanasi.jpg',
        category: 'Spiritual',
        rating: 4.8,
        bestTime: 'Nov-Feb',
        entryFee: 'Free',
        isEcoFriendly: true,
        contactInfo: {
            phone: '+91-542-2506670',
            email: 'tourism@varanasi.gov.in'
        },
        coordinates: { latitude: 25.2820, longitude: 83.0010 }
    },

    // --- UTTARAKHAND ---
    // --- UTTARAKHAND (Official Tourism Sourced) ---
    {
        id: 'uk1',
        name: 'Rishikesh',
        location: 'Rishikesh, Uttarakhand',
        state: 'Uttarakhand',
        city: 'Rishikesh',
        description: 'Known as the Yoga Capital of the World and a hub for adventure sports like rafting.',
        imageUrl: '/images/uk_rishikesh.jpg',
        category: 'Spiritual',
        rating: 4.8,
        bestTime: 'Sep-Nov',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 30.0869, longitude: 78.2676 }
    },
    {
        id: 'uk2',
        name: 'Nainital',
        location: 'Nainital, Uttarakhand',
        state: 'Uttarakhand',
        city: 'Nainital',
        description: 'A popular hill station set in a valley containing a mango-shaped lake.',
        imageUrl: '/images/uk_nainital.jpg',
        category: 'Hill Stations',
        rating: 4.7,
        bestTime: 'Mar-Jun',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 29.3801, longitude: 79.4630 }
    },
    {
        id: 'uk3',
        name: 'Kedarnath Temple',
        location: 'Rudraprayag, Uttarakhand',
        state: 'Uttarakhand',
        city: 'Kedarnath',
        description: 'One of the Chardham pilgrimage sites, dedicated to Lord Shiva.',
        imageUrl: '/images/uk_kedarnath.jpg',
        category: 'Spiritual',
        rating: 4.9,
        bestTime: 'May-Oct',
        entryFee: 'Free',
        isEcoFriendly: false,
        coordinates: { latitude: 30.7352, longitude: 79.0669 }
    },
    {
        id: 'uk4',
        name: 'Jim Corbett National Park',
        location: 'Ramnagar, Uttarakhand',
        state: 'Uttarakhand',
        city: 'Ramnagar',
        description: 'India\'s oldest national park, famous for its Bengal tiger population.',
        imageUrl: '/images/uk_jim_corbett.jpg',
        category: 'Nature',
        rating: 4.8,
        bestTime: 'Nov-Jun',
        entryFee: '₹200',
        isEcoFriendly: true,
        coordinates: { latitude: 29.5300, longitude: 78.7747 }
    },
    {
        id: 'uk5',
        name: 'Valley of Flowers',
        location: 'Chamoli, Uttarakhand',
        state: 'Uttarakhand',
        city: 'Chamoli',
        description: 'A UNESCO World Heritage Site known for its meadows of endemic alpine flowers.',
        imageUrl: '/images/uk_valley_of_flowers.jpg',
        category: 'Nature',
        rating: 4.9,
        bestTime: 'Jul-Sep',
        entryFee: '₹150',
        isEcoFriendly: true,
        coordinates: { latitude: 30.7280, longitude: 79.6053 }
    },

    // --- WEST BENGAL ---
    {
        id: 'wb1',
        name: 'Victoria Memorial',
        location: 'Kolkata, West Bengal',
        state: 'West Bengal',
        city: 'Kolkata',
        description: 'A large marble building filled with museum exhibits.',
        imageUrl: '/images/wb_victoria.jpg',
        category: 'Heritage',
        rating: 4.7,
        bestTime: 'Oct-Mar',
        entryFee: '₹30',
        isEcoFriendly: false,
        coordinates: { latitude: 22.5448, longitude: 88.3426 }
    },

    // --- ANDAMAN AND NICOBAR ISLANDS ---
    {
        id: 'an1',
        name: 'Radhanagar Beach',
        location: 'Havelock Island, Andaman',
        state: 'Andaman and Nicobar Islands',
        city: 'Havelock Island',
        description: 'One of the best beaches in Asia, known for its pristine water and white sand.',
        imageUrl: '/images/an_radhanagar.jpg',
        category: 'Beaches',
        rating: 4.9,
        bestTime: 'Oct-May',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 11.9845, longitude: 92.9511 }
    },

    // --- CHANDIGARH ---
    {
        id: 'ch1',
        name: 'Rock Garden',
        location: 'Chandigarh',
        state: 'Chandigarh',
        city: 'Chandigarh',
        description: 'A sculpture garden for rock enthusiasts.',
        imageUrl: '/images/ch_rock_garden.jpg',
        category: 'Art',
        rating: 4.6,
        bestTime: 'Oct-Mar',
        entryFee: '₹30',
        isEcoFriendly: true,
        coordinates: { latitude: 30.7525, longitude: 76.8101 }
    },

    // --- DADRA AND NAGAR HAVELI AND DAMAN AND DIU ---
    {
        id: 'dn1',
        name: 'Diu Fort',
        location: 'Diu',
        state: 'Dadra and Nagar Haveli and Daman and Diu',
        city: 'Diu',
        description: 'A Portuguese-built fort located on the west coast of India.',
        imageUrl: '/images/dn_diu_fort.jpg',
        category: 'Heritage',
        rating: 4.7,
        bestTime: 'Oct-Mar',
        entryFee: 'Free',
        isEcoFriendly: false,
        coordinates: { latitude: 20.7144, longitude: 70.9904 }
    },

    // --- DELHI ---
    {
        id: 'dl1',
        name: 'Red Fort',
        location: 'Delhi',
        state: 'Delhi',
        city: 'Delhi',
        description: 'A historic fort in the city of Delhi that served as the main residence of the Mughal Emperors.',
        imageUrl: '/images/dl_red_fort.jpg',
        category: 'Heritage',
        rating: 4.6,
        bestTime: 'Oct-Mar',
        entryFee: '₹35',
        isEcoFriendly: false,
        coordinates: { latitude: 28.6562, longitude: 77.2410 }
    },

    // --- JAMMU AND KASHMIR ---
    {
        id: 'jk1',
        name: 'Dal Lake',
        location: 'Srinagar, Jammu and Kashmir',
        state: 'Jammu and Kashmir',
        city: 'Srinagar',
        description: 'A lake in Srinagar, it is an urban lake, which is the second largest in the state.',
        imageUrl: '/images/jk_dal_lake.jpg',
        category: 'Nature',
        rating: 4.8,
        bestTime: 'Apr-Oct',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 34.1121, longitude: 74.8385 }
    },

    // --- LADAKH (Existing) ---
    {
        id: 'ld1',
        name: 'Pangong Lake',
        location: 'Ladakh',
        state: 'Ladakh',
        city: 'Leh',
        description: 'Endorheic lake in the Himalayas situated at a height of about 4,350 m.',
        imageUrl: '/images/ld_pangong.jpg',
        category: 'Adventure',
        rating: 4.9,
        bestTime: 'May-Sep',
        entryFee: 'Permit',
        isEcoFriendly: true,
        contactInfo: {
            phone: '+91-1982-252297',
            email: 'tourism@leh.gov.in'
        },
        coordinates: { latitude: 33.7296, longitude: 78.9396 }
    },

    // --- LAKSHADWEEP ---
    {
        id: 'lk1',
        name: 'Agatti Island',
        location: 'Agatti, Lakshadweep',
        state: 'Lakshadweep',
        city: 'Agatti',
        description: 'Known for its stunning beaches and coral reefs.',
        imageUrl: '/images/lk_agatti.jpg',
        category: 'Beaches',
        rating: 4.9,
        bestTime: 'Oct-Apr',
        entryFee: 'Permit',
        isEcoFriendly: true,
        coordinates: { latitude: 10.8533, longitude: 72.1948 }
    },

    // --- PUDUCHERRY ---
    {
        id: 'py1',
        name: 'Promenade Beach',
        location: 'Puducherry',
        state: 'Puducherry',
        city: 'Puducherry',
        description: 'A popular stretch of beachfront in the city also known as Rock Beach.',
        imageUrl: '/images/py_promenade.jpg',
        category: 'Beaches',
        rating: 4.6,
        bestTime: 'Oct-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 11.9338, longitude: 79.8338 }
    },

    // --- KARNATAKA EXPANSION (Districts) ---
    // 1. Bengaluru Urban
    {
        id: 'ka13',
        name: 'Cubbon Park',
        location: 'Bengaluru, Karnataka',
        state: 'Karnataka',
        city: 'Bengaluru',
        description: 'A landmark \'lung\' area of the Bengaluru city, creating a natural retreat.',
        imageUrl: '/images/ka_cubbon_park.jpg',
        category: 'Nature',
        rating: 4.6,
        bestTime: 'Year Round',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 12.9752, longitude: 77.5906 }
    },
    {
        id: 'ka14',
        name: 'Bangalore Palace',
        location: 'Bengaluru, Karnataka',
        state: 'Karnataka',
        city: 'Bengaluru',
        description: 'A palace inspired by England\'s Windsor Castle, built by Chamaraja Wodeyar.',
        imageUrl: '/images/ka_bangalore_palace.jpg',
        category: 'Heritage',
        rating: 4.5,
        bestTime: 'Year Round',
        entryFee: '₹230',
        isEcoFriendly: false,
        coordinates: { latitude: 12.9988, longitude: 77.5921 }
    },
    {
        id: 'ka15',
        name: 'Vidhana Soudha',
        location: 'Bengaluru, Karnataka',
        state: 'Karnataka',
        city: 'Bengaluru',
        description: 'The seat of the state legislature of Karnataka, constructed in a style described as Neo-Dravidian.',
        imageUrl: '/images/ka_vidhana_soudha.jpg',
        category: 'Heritage',
        rating: 4.7,
        bestTime: 'Year Round',
        entryFee: 'No Entry',
        isEcoFriendly: true,
        coordinates: { latitude: 12.9797, longitude: 77.5907 }
    },
    {
        id: 'ka16',
        name: 'ISKCON Temple Bangalore',
        location: 'Bengaluru, Karnataka',
        state: 'Karnataka',
        city: 'Bengaluru',
        description: 'One of the largest ISKCON temples in the world, located on Hare Krishna Hill.',
        imageUrl: '/images/ka_iskcon.jpg',
        category: 'Spiritual',
        rating: 4.8,
        bestTime: 'Year Round',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 13.0095, longitude: 77.5511 }
    },

    // 2. Bengaluru Rural
    {
        id: 'ka17',
        name: 'Nandi Hills',
        location: 'Chikkaballapur, Karnataka',
        state: 'Karnataka',
        city: 'Nandi Hills',
        description: 'An ancient hill fortress famous for its sunrise views.',
        imageUrl: '/images/ka_nandi_hills.jpg',
        category: 'Hill Stations',
        rating: 4.6,
        bestTime: 'Sep-Mar',
        entryFee: '₹5',
        isEcoFriendly: true,
        coordinates: { latitude: 13.3702, longitude: 77.6835 }
    },
    {
        id: 'ka18',
        name: 'Devanahalli Fort',
        location: 'Devanahalli, Karnataka',
        state: 'Karnataka',
        city: 'Devanahalli',
        description: 'The birthplace of Tipu Sultan, located near Bengaluru airport.',
        imageUrl: '/images/ka_devanahalli_fort.jpg',
        category: 'Heritage',
        rating: 4.3,
        bestTime: 'Year Round',
        entryFee: 'Free',
        isEcoFriendly: false,
        coordinates: { latitude: 13.2500, longitude: 77.7100 }
    },
    {
        id: 'ka19',
        name: 'Skandagiri Hills',
        location: 'Chikkaballapur, Karnataka',
        state: 'Karnataka',
        city: 'Chikkaballapur',
        description: 'Famous for night trekking and walking above the clouds.',
        imageUrl: '/images/ka_skandagiri.jpg',
        category: 'Adventure',
        rating: 4.7,
        bestTime: 'Nov-Feb',
        entryFee: '₹250 (Permit)',
        isEcoFriendly: true,
        coordinates: { latitude: 13.4188, longitude: 77.6766 }
    },

    // 3. Ramanagara
    {
        id: 'ka20',
        name: 'Ramanagara Hills',
        location: 'Ramanagara, Karnataka',
        state: 'Karnataka',
        city: 'Ramanagara',
        description: 'The shooting location of the movie Sholay, known for rock climbing.',
        imageUrl: '/images/ka_ramanagara.jpg',
        category: 'Adventure',
        rating: 4.5,
        bestTime: 'Oct-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 12.7150, longitude: 77.2660 }
    },
    {
        id: 'ka21',
        name: 'Mekedatu & Sangama',
        location: 'Kanakapura, Karnataka',
        state: 'Karnataka',
        city: 'Kanakapura',
        description: 'A deep gorge where the Arkavathi merges with the Kaveri river.',
        imageUrl: '/images/ka_mekedatu.jpg',
        category: 'Nature',
        rating: 4.5,
        bestTime: 'Sep-Dec',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 12.2709, longitude: 77.4524 }
    },

    // 4. Mysuru (Extension)
    {
        id: 'ka22',
        name: 'Chamundi Hills',
        location: 'Mysuru, Karnataka',
        state: 'Karnataka',
        city: 'Mysuru',
        description: 'Home to the Chamundeshwari Temple and offering panoramic views of Mysore.',
        imageUrl: '/images/ka_chamundi_hills.jpg',
        category: 'Spiritual',
        rating: 4.7,
        bestTime: 'Year Round',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 12.2753, longitude: 76.6706 }
    },
    {
        id: 'ka23',
        name: 'Brindavan Gardens',
        location: 'Mandya/Mysuru, Karnataka',
        state: 'Karnataka',
        city: 'Mysuru',
        description: 'Famous terrace garden built across the Kaveri river.',
        imageUrl: '/images/ka_brindavan_gardens.jpg',
        category: 'Nature',
        rating: 4.4,
        bestTime: 'Year Round',
        entryFee: '₹15',
        isEcoFriendly: false,
        coordinates: { latitude: 12.4223, longitude: 76.5732 }
    },

    // 5. Mandya
    {
        id: 'ka24',
        name: 'Srirangapatna Fort',
        location: 'Srirangapatna, Karnataka',
        state: 'Karnataka',
        city: 'Srirangapatna',
        description: 'Historical island town and the capital of Tipu Sultan.',
        imageUrl: '/images/ka_srirangapatna.jpg',
        category: 'Heritage',
        rating: 4.6,
        bestTime: 'Year Round',
        entryFee: 'Free',
        isEcoFriendly: false,
        coordinates: { latitude: 12.4208, longitude: 76.6830 }
    },

    // 6. Chamarajanagar
    {
        id: 'ka25',
        name: 'Biligiri Rangan Hills (BR Hills)',
        location: 'Chamarajanagar, Karnataka',
        state: 'Karnataka',
        city: 'Chamarajanagar',
        description: 'A hill range that links the Eastern and Western Ghats, also a tiger reserve.',
        imageUrl: '/images/ka_br_hills.jpg',
        category: 'Nature',
        rating: 4.6,
        bestTime: 'Oct-May',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 11.9930, longitude: 77.1408 }
    },

    // 7. Hassan (Extension)
    {
        id: 'ka26',
        name: 'Shravanabelagola',
        location: 'Hassan, Karnataka',
        state: 'Karnataka',
        city: 'Hassan',
        description: 'Home to the colossal Gommateshwara Bahubali statue, a major Jain pilgrimage center.',
        imageUrl: '/images/ka_shravanabelagola.jpg',
        category: 'Spiritual',
        rating: 4.8,
        bestTime: 'Oct-Mar',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 12.8576, longitude: 76.4862 }
    },

    // 8. Kodagu (Extension)
    {
        id: 'ka27',
        name: 'Raja\'s Seat',
        location: 'Madikeri, Karnataka',
        state: 'Karnataka',
        city: 'Coorg',
        description: 'A seasonal garden of flowers and artificial fountains with a view of the hills.',
        imageUrl: '/images/ka_rajas_seat.jpg',
        category: 'Nature',
        rating: 4.4,
        bestTime: 'Year Round',
        entryFee: '₹5',
        isEcoFriendly: true,
        coordinates: { latitude: 12.4173, longitude: 75.7368 }
    },
    {
        id: 'ka28',
        name: 'Dubare Elephant Camp',
        location: 'Kushalnagar, Karnataka',
        state: 'Karnataka',
        city: 'Coorg',
        description: 'An elephant camp on the banks of the Kaveri river where you can interact with elephants.',
        imageUrl: '/images/ka_dubare.jpg',
        category: 'Nature',
        rating: 4.5,
        bestTime: 'Sep-Mar',
        entryFee: '₹50',
        isEcoFriendly: true,
        coordinates: { latitude: 12.3687, longitude: 75.9048 }
    },

    // 9. Dakshina Kannada
    {
        id: 'ka29',
        name: 'Panambur Beach',
        location: 'Mangaluru, Karnataka',
        state: 'Karnataka',
        city: 'Mangaluru',
        description: 'Known for its cleanliness, safety, and international kite festivals.',
        imageUrl: '/images/ka_panambur_beach.jpg',
        category: 'Beaches',
        rating: 4.5,
        bestTime: 'Oct-Feb',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 12.9566, longitude: 74.8058 }
    },
    {
        id: 'ka30',
        name: 'St. Aloysius Chapel',
        location: 'Mangaluru, Karnataka',
        state: 'Karnataka',
        city: 'Mangaluru',
        description: 'Famous for its magnificent paintings that cover virtually every inch of the walls and ceiling.',
        imageUrl: '/images/ka_aloysius_chapel.jpg',
        category: 'Heritage',
        rating: 4.7,
        bestTime: 'Year Round',
        entryFee: 'Free',
        isEcoFriendly: false,
        coordinates: { latitude: 12.8732, longitude: 74.8450 }
    },

    // 10. Udupi
    {
        id: 'ka31',
        name: 'Udupi Krishna Temple',
        location: 'Udupi, Karnataka',
        state: 'Karnataka',
        city: 'Udupi',
        description: 'A famous Hindu temple dedicated to Lord Krishna.',
        imageUrl: '/images/ka_udupi_krishna.jpg',
        category: 'Spiritual',
        rating: 4.9,
        bestTime: 'Year Round',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 13.3409, longitude: 74.7523 }
    },
    {
        id: 'ka32',
        name: 'Malpe Beach & St. Mary\'s Island',
        location: 'Udupi, Karnataka',
        state: 'Karnataka',
        city: 'Udupi',
        description: 'Known for its basaltic rock formations and pristine sands.',
        imageUrl: '/images/ka_malpe_beach.jpg',
        category: 'Beaches',
        rating: 4.7,
        bestTime: 'Oct-Jan',
        entryFee: 'Ferry Fee',
        isEcoFriendly: true,
        coordinates: { latitude: 13.3514, longitude: 74.7032 }
    },

    // 11. Shivamogga (Extension)
    {
        id: 'ka33',
        name: 'Kodachadri',
        location: 'Shivamogga, Karnataka',
        state: 'Karnataka',
        city: 'Shivamogga',
        description: 'A mountain peak with dense forests, ideal for trekking.',
        imageUrl: '/images/ka_kodachadri.jpg',
        category: 'Adventure',
        rating: 4.8,
        bestTime: 'Sep-Jan',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 13.8569, longitude: 74.8727 }
    },

    // 12. Chikkamagaluru (Extension)
    {
        id: 'ka34',
        name: 'Kudremukh',
        location: 'Chikkamagaluru, Karnataka',
        state: 'Karnataka',
        city: 'Chikkamagaluru',
        description: 'A mountain range and national park named after a horse-face shaped peak.',
        imageUrl: '/images/ka_kudremukh.jpg',
        category: 'Nature',
        rating: 4.8,
        bestTime: 'Oct-Mar',
        entryFee: '₹600',
        isEcoFriendly: true,
        coordinates: { latitude: 13.2205, longitude: 75.2530 }
    },

    // 13. Davanagere
    {
        id: 'ka35',
        name: 'Harihareshwara Temple',
        location: 'Harihar, Karnataka',
        state: 'Karnataka',
        city: 'Davanagere',
        description: 'A temple dedicated to Harihara, a fusion of Shiva and Vishnu.',
        imageUrl: '/images/ka_harihareshwara.jpg',
        category: 'Heritage',
        rating: 4.6,
        bestTime: 'Year Round',
        entryFee: 'Free',
        isEcoFriendly: false,
        coordinates: { latitude: 14.5126, longitude: 75.8078 }
    },

    // 14. Ballari / Vijayanagara
    {
        id: 'ka36',
        name: 'Tunghabhadra Dam',
        location: 'Hospet, Karnataka',
        state: 'Karnataka',
        city: 'Hospet',
        description: 'A multipurpose dam with beautiful gardens and lighting.',
        imageUrl: '/images/ka_tb_dam.jpg',
        category: 'Nature',
        rating: 4.5,
        bestTime: 'Aug-Jan',
        entryFee: '₹20',
        isEcoFriendly: true,
        coordinates: { latitude: 15.2564, longitude: 76.3359 }
    },

    // 16. Raichur
    {
        id: 'ka37',
        name: 'Raichur Fort',
        location: 'Raichur, Karnataka',
        state: 'Karnataka',
        city: 'Raichur',
        description: 'A massive fort famous for its stone inscriptions and architecture.',
        imageUrl: '/images/ka_raichur_fort.jpg',
        category: 'Heritage',
        rating: 4.2,
        bestTime: 'Oct-Mar',
        entryFee: 'Free',
        isEcoFriendly: false,
        coordinates: { latitude: 16.2008, longitude: 77.3551 }
    },

    // 17. Kalaburagi
    {
        id: 'ka38',
        name: 'Gulbarga Fort',
        location: 'Kalaburagi, Karnataka',
        state: 'Karnataka',
        city: 'Kalaburagi',
        description: 'Features 15 towers and a huge Jama Masjid inside.',
        imageUrl: '/images/ka_gulbarga_fort.jpg',
        category: 'Heritage',
        rating: 4.3,
        bestTime: 'Oct-Feb',
        entryFee: 'Free',
        isEcoFriendly: false,
        coordinates: { latitude: 17.3361, longitude: 76.8258 }
    },

    // 18. Bidar
    {
        id: 'ka39',
        name: 'Bidar Fort',
        location: 'Bidar, Karnataka',
        state: 'Karnataka',
        city: 'Bidar',
        description: 'A formidable fort with 30 bastions, Rangin Mahal and Tarkash Mahal.',
        imageUrl: '/images/ka_bidar_fort.jpg',
        category: 'Heritage',
        rating: 4.6,
        bestTime: 'Oct-Feb',
        entryFee: '₹25',
        isEcoFriendly: false,
        coordinates: { latitude: 17.9220, longitude: 77.5208 }
    },

    // 19. Vijayapura
    {
        id: 'ka40',
        name: 'Gol Gumbaz',
        location: 'Vijayapura, Karnataka',
        state: 'Karnataka',
        city: 'Vijayapura',
        description: 'The mausoleum of King Mohammed Adil Shah, featuring a massive dome and whispering gallery.',
        imageUrl: '/images/ka_gol_gumbaz.jpg',
        category: 'Heritage',
        rating: 4.8,
        bestTime: 'Oct-Mar',
        entryFee: '₹25',
        isEcoFriendly: false,
        coordinates: { latitude: 16.8306, longitude: 75.7360 }
    },

    // 20. Bagalkot (Extension)
    {
        id: 'ka41',
        name: 'Pattadakal',
        location: 'Bagalkot, Karnataka',
        state: 'Karnataka',
        city: 'Bagalkot',
        description: 'A UNESCO World Heritage site known for its harmonious blend of architectural forms.',
        imageUrl: '/images/ka_pattadakal.jpg',
        category: 'Heritage',
        rating: 4.7,
        bestTime: 'Oct-Mar',
        entryFee: '₹40',
        isEcoFriendly: false,
        coordinates: { latitude: 15.9491, longitude: 75.8159 }
    },
    {
        id: 'ka42',
        name: 'Aihole',
        location: 'Bagalkot, Karnataka',
        state: 'Karnataka',
        city: 'Bagalkot',
        description: 'Known as the cradle of Hindu rock architecture.',
        imageUrl: '/images/ka_aihole.jpg',
        category: 'Heritage',
        rating: 4.6,
        bestTime: 'Oct-Mar',
        entryFee: '₹25',
        isEcoFriendly: false,
        coordinates: { latitude: 16.0205, longitude: 75.8824 }
    },

    // 21. Belagavi
    {
        id: 'ka43',
        name: 'Gokak Falls',
        location: 'Gokak, Karnataka',
        state: 'Karnataka',
        city: 'Belagavi',
        description: 'Known for its resemblance to Niagara Falls, formed by the Ghataprabha River.',
        imageUrl: '/images/ka_gokak_falls.jpg',
        category: 'Nature',
        rating: 4.5,
        bestTime: 'Jul-Oct',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 16.1824, longitude: 74.7779 }
    },

    // 22. Dharwad
    {
        id: 'ka44',
        name: 'Unkal Lake',
        location: 'Hubballi, Karnataka',
        state: 'Karnataka',
        city: 'Dharwad',
        description: 'A scenic lake with a statue of Swami Vivekananda in the center.',
        imageUrl: '/images/ka_unkal_lake.jpg',
        category: 'Nature',
        rating: 4.3,
        bestTime: 'Year Round',
        entryFee: 'Free',
        isEcoFriendly: true,
        coordinates: { latitude: 15.3713, longitude: 75.1207 }
    },

    // 25. Uttara Kannada (Extension)
    {
        id: 'ka45',
        name: 'Dandeli Wildlife Sanctuary',
        location: 'Dandeli, Karnataka',
        state: 'Karnataka',
        city: 'Dandeli',
        description: 'Famous for white-water rafting and black panthers.',
        imageUrl: '/images/ka_dandeli.jpg',
        category: 'Adventure',
        rating: 4.7,
        bestTime: 'Oct-May',
        entryFee: 'Varied',
        isEcoFriendly: true,
        coordinates: { latitude: 15.2361, longitude: 74.6173 }
    },
    {
        id: 'ka46',
        name: 'Yana Rocks',
        location: 'Kumta, Karnataka',
        state: 'Karnataka',
        city: 'Uttara Kannada',
        description: 'Known for unusual rock formations locally known as Bhairaveshwara Shikhara and Mohini Shikhara.',
        imageUrl: '/images/ka_yana_rocks.jpg',
        category: 'Nature',
        rating: 4.6,
        bestTime: 'Oct-Mar',
        entryFee: '₹10',
        isEcoFriendly: true,
        coordinates: { latitude: 14.4880, longitude: 74.5574 }
    },

    // 31. Chitradurga
    {
        id: 'ka47',
        name: 'Chitradurga Fort',
        location: 'Chitradurga, Karnataka',
        state: 'Karnataka',
        city: 'Chitradurga',
        description: 'Known as the "Stone Fortress of Seven Circles" (Elusuttina Kote).',
        imageUrl: '/images/ka_chitradurga_fort.jpg',
        category: 'Heritage',
        rating: 4.7,
        bestTime: 'Oct-Mar',
        entryFee: '₹25',
        isEcoFriendly: false,
        coordinates: { latitude: 14.2185, longitude: 76.3965 }
    },

    // --- PREMIUM STAYS & HOTELS ---
    {
        id: 'stay1',
        name: 'The Heritage Palace',
        location: 'Mysore, Karnataka',
        state: 'Karnataka',
        city: 'Mysore',
        description: 'Luxury heritage stay near Mysore Palace with royal amenities.',
        imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
        category: 'Stays',
        rating: 4.8,
        priceRange: '₹5000 - ₹8000',
        contactInfo: { phone: '+91 821-2345678' }
    },
    {
        id: 'stay2',
        name: 'Garden City Boutique Hotel',
        location: 'Bengaluru, Karnataka',
        state: 'Karnataka',
        city: 'Bengaluru',
        description: 'Modern comfort in the heart of the city, perfectly located for explorers.',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        category: 'Stays',
        rating: 4.6,
        priceRange: '₹3500 - ₹5500',
        contactInfo: { phone: '+91 80-98765432' }
    },
    {
        id: 'stay3',
        name: 'Mist Valley Resort',
        location: 'Madikeri, Coorg',
        state: 'Karnataka',
        city: 'Coorg',
        description: 'Cozy cottages surrounded by coffee plantations and misty hills.',
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
        category: 'Stays',
        rating: 4.7,
        priceRange: '₹4000 - ₹7000',
        contactInfo: { phone: '+91 8272-123456' }
    },
    {
        id: 'stay4',
        name: 'Mahabodhi Residency',
        location: 'Bodh Gaya, Bihar',
        state: 'Bihar',
        city: 'Bodh Gaya',
        description: 'Peaceful accommodation within walking distance of the Mahabodhi Temple.',
        imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        category: 'Stays',
        rating: 4.5,
        priceRange: '₹2000 - ₹4500',
        contactInfo: { phone: '+91 631-5550123' }
    },
    {
        id: 'stay5',
        name: 'Tawang Heights Homestay',
        location: 'Tawang, Arunachal Pradesh',
        state: 'Arunachal Pradesh',
        city: 'Tawang',
        description: 'Experience local hospitality with breathtaking views of the Tawang Monastery.',
        imageUrl: 'https://images.unsplash.com/photo-1551882547-ff43c69e5cf2?w=800',
        category: 'Stays',
        rating: 4.9,
        priceRange: '₹1500 - ₹3000',
        contactInfo: { phone: '+91 9436-046000' }
    },
    {
        id: 'stay6',
        name: 'Royal Orchid Metropole',
        location: 'Mysore, Karnataka',
        state: 'Karnataka',
        city: 'Mysore',
        description: 'A grand architectural marvel offering world-class luxury.',
        imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
        category: 'Stays',
        rating: 4.7,
        priceRange: '₹6000 - ₹9000'
    },
    {
        id: 'stay7',
        name: 'Old Kent Estates',
        location: 'Suntikoppa, Coorg',
        state: 'Karnataka',
        city: 'Coorg',
        description: 'Stay in a restored British colonial bungalow in the heart of Coorg.',
        imageUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
        category: 'Stays',
        rating: 4.9,
        priceRange: '₹12000 - ₹18000'
    },

    // --- HIDDEN GEMS ---
    {
        id: 'hg1',
        name: 'Gurez Valley',
        location: 'Bandipora, Jammu & Kashmir',
        state: 'Jammu & Kashmir',
        city: 'Bandipora',
        description: 'A deeply serene and offbeat valley near the LoC, known for its emerald river and wooden houses.',
        imageUrl: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800',
        category: 'Hidden Gem',
        rating: 4.9,
        bestTime: 'May-Sep',
        entryFee: 'Permit Required',
        isEcoFriendly: true
    },
    {
        id: 'hg2',
        name: 'Dhanushkodi Ghost Town',
        location: 'Rameswaram, Tamil Nadu',
        state: 'Tamil Nadu',
        city: 'Rameswaram',
        description: 'The abandoned town at the edge of India, where the Bay of Bengal meets the Indian Ocean.',
        imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800',
        category: 'Hidden Gem',
        rating: 4.7,
        bestTime: 'Oct-Mar',
        entryFee: 'Free'
    },

    // --- TRADITIONAL CRAFTS ---
    {
        id: 'cr1',
        name: 'Kondapalli Toys Workshop',
        location: 'Vijayawada, Andhra Pradesh',
        state: 'Andhra Pradesh',
        city: 'Vijayawada',
        description: 'Watch artisans carve the famous light-weight wooden toys using traditional techniques.',
        imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800',
        category: 'Crafts',
        rating: 4.8,
        bestTime: 'Year Round',
        entryFee: 'Free'
    },
    {
        id: 'cr2',
        name: 'Raghurajpur Heritage Village',
        location: 'Puri, Odisha',
        state: 'Odisha',
        city: 'Puri',
        description: 'A village where every household is an artist\'s studio, famous for Pattachitra paintings.',
        imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
        category: 'Crafts',
        rating: 4.9,
        bestTime: 'Oct-Feb',
        entryFee: 'Free'
    }
];

module.exports = allPlaces;
