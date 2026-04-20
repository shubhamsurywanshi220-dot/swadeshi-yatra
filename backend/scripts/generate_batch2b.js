const fs = require('fs');

const batch2b = [
    {
        "destination_name": "Talacauvery Wildlife Area", "city": "Kodagu", "state": "Karnataka", "country": "India",
        "latitude": 12.3831, "longitude": 75.4839, "description": "A steeply sloped wildlife sanctuary cradling the holy origin of River Kaveri.",
        "detailedInfo": {
            "history": "Deeply sacred bounds considered completely untouchable by hunting for countless centuries.",
            "cultural_significance": "Functions uniquely as a profound religious focal point and critical water catchment.",
            "architecture": "A dense, virtually unbroken canopy of towering evergreen Shola forests.",
            "interesting_facts": "Shelters incredibly rare species like the gorgeous Malabar Trogon and huge Great Pied Hornbill."
        },
        "images": ["assets/destinations/talacauvery_wildlife_area/1.jpg", "assets/destinations/talacauvery_wildlife_area/2.jpg"],
        "entry_fee": { "indian": "Free", "foreign": "Free" }, "best_time_to_visit": "Sep-Mar", "category": "Wildlife"
    },
    {
        "destination_name": "Kateel Durga Parameshwari Temple", "city": "Mangalore", "state": "Karnataka", "country": "India",
        "latitude": 13.0645, "longitude": 74.8732, "description": "An incredibly holy island temple situated squarely amidst the forcefully flowing Nandini River.",
        "detailedInfo": {
            "history": "Believed historically to be perfectly established to slay the terrible demon Arunasura.",
            "cultural_significance": "A major Shakti worship center immensely beloved across the highly devoted coastal region.",
            "architecture": "Constructed gorgeously integrating traditional local wood carving completely bordered by rocky river beds.",
            "interesting_facts": "The temple actively promotes Yakshagana, a classical folk art, maintaining numerous traveling troupes."
        },
        "images": ["assets/destinations/kateel/1.jpg", "assets/destinations/kateel/2.jpg"],
        "entry_fee": { "indian": "Free", "foreign": "Free" }, "best_time_to_visit": "Year Round", "category": "Temple"
    },
    {
        "destination_name": "Gavi Gangadhareshwara Temple", "city": "Bangalore", "state": "Karnataka", "country": "India",
        "latitude": 12.9463, "longitude": 77.5540, "description": "A magnificent rock-cut cave temple famous precisely for its phenomenal solar alignment.",
        "detailedInfo": {
            "history": "Expanded heavily by the legendary Kempe Gowda I in the fiercely active 16th century.",
            "cultural_significance": "Represents incredibly brilliant architectural astronomy completely preserved in the modern tech city.",
            "architecture": "A deep subterranean shrine guarded heavily by enormous monolithic stone discs (Surya and Chandra Paana).",
            "interesting_facts": "Every Makara Sankranti, sunlight passes flawlessly between Nandi's horns securely lighting the Shiva Linga."
        },
        "images": ["assets/destinations/gavi/1.jpg", "assets/destinations/gavi/2.jpg"],
        "entry_fee": { "indian": "Free", "foreign": "Free" }, "best_time_to_visit": "Year Round", "category": "Temple"
    },
    {
        "destination_name": "Nanjangud Temple", "city": "Mysore", "state": "Karnataka", "country": "India",
        "latitude": 12.1158, "longitude": 76.6800, "description": "Famously referred directly to as 'Dakshina Kashi', sitting majestically on the Kapila River banks.",
        "detailedInfo": {
            "history": "A monumental structure extensively patronized heavily by the Gangas, Hoysalas, and Wodeyars.",
            "cultural_significance": "The massive Srikanteshwara deity is deeply reputed to possess supreme healing powers.",
            "architecture": "A fiercely towering 120-feet Gopura, surrounded heavily by beautifully pillared colonnades.",
            "interesting_facts": "Tipu Sultan famously named the presiding deity 'Hakim Nanjunda' after his favorite elephant's miraculous recovery."
        },
        "images": ["assets/destinations/nanjangud/1.jpg", "assets/destinations/nanjangud/2.jpg"],
        "entry_fee": { "indian": "Free", "foreign": "Free" }, "best_time_to_visit": "Year Round", "category": "Temple"
    },
    {
        "destination_name": "Marikamba Temple", "city": "Sirsi", "state": "Karnataka", "country": "India",
        "latitude": 14.6163, "longitude": 74.8340, "description": "An immensely vibrant 17th-century shrine heavily showcasing intense traditional Kadamba art styles.",
        "detailedInfo": {
            "history": "Established fiercely in 1688, possessing Karnataka's absolutely largest and most imposing wooden idol.",
            "cultural_significance": "A fiercely critical center for Shaktism, passionately attracting countless devotees during fairs.",
            "architecture": "Richly painted, intensely colorful outer wood carvings exclusively depicting mythological wars.",
            "interesting_facts": "The spectacular Sirsi Marikamba Jatra is incredibly huge and famously held once every simply two years."
        },
        "images": ["assets/destinations/marikamba/1.jpg", "assets/destinations/marikamba/2.jpg"],
        "entry_fee": { "indian": "Free", "foreign": "Free" }, "best_time_to_visit": "Year Round", "category": "Temple"
    },
    {
        "destination_name": "Yellamma Temple", "city": "Saundatti", "state": "Karnataka", "country": "India",
        "latitude": 15.7674, "longitude": 75.1118, "description": "An incredibly ancient holy hill temple fundamentally dedicated to the powerful Goddess Renuka.",
        "detailedInfo": {
            "history": "Roots dating fiercely back to the fierce Rashtrakuta period, deeply interwoven securely with the Jamadagni legend.",
            "cultural_significance": "Attracts uniquely massive congregations of deeply marginalized communities seeking intense divine blessing.",
            "architecture": "A sweeping fortress-like temple enclosure standing boldly atop shockingly arid hillocks.",
            "interesting_facts": "Revolves fiercely around the Devadasi traditions which were fundamentally reformed considerably recently."
        },
        "images": ["assets/destinations/yellamma/1.jpg", "assets/destinations/yellamma/2.jpg"],
        "entry_fee": { "indian": "Free", "foreign": "Free" }, "best_time_to_visit": "Oct-Mar", "category": "Temple"
    }
];

fs.writeFileSync('data/batch2b_dests.js', JSON.stringify(batch2b));
console.log('Batch 2b written. Size:', batch2b.length);
