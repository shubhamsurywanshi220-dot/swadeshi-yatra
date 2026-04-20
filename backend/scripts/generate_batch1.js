const fs = require('fs');

const batch1 = [
    {
        "destination_name": "Tadiandamol",
        "city": "Coorg",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.2322,
        "longitude": 75.6086,
        "description": "The highest peak in Kodagu district offering breathtaking views of the Western Ghats.",
        "detailedInfo": {
            "history": "Historically a landmark for the Kodava kings, specifically Dodda Veerarajendra who built the nearby Nalaknad Palace.",
            "cultural_significance": "A major trekking hotspot deeply woven into the local Kodava geography and stories.",
            "architecture": "Features steep rolling Shola grasslands interwoven with dark, dense patches of jungle.",
            "interesting_facts": "Stands tall at 1,748 meters and the trek starts near an ancient Palace that was an escape route against Tipu Sultan."
        },
        "images": [
            "assets/destinations/tadiandamol/1.jpg",
            "assets/destinations/tadiandamol/2.jpg",
            "assets/destinations/tadiandamol/3.jpg"
        ],
        "entry_fee": { "indian": "₹50", "foreign": "₹200" },
        "best_time_to_visit": "Sep-Feb",
        "category": "Hill Station"
    },
    {
        "destination_name": "Pushpagiri",
        "city": "Somwarpet",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.5646,
        "longitude": 75.6698,
        "description": "Also known as Kumaraparvatha, this is the second highest peak of Kodagu.",
        "detailedInfo": {
            "history": "Surrounded by the Pushpagiri Wildlife Sanctuary, designated to protect rare flora.",
            "cultural_significance": "Highly revered due to the famous Kukke Subramanya temple situated at its base.",
            "architecture": "A naturally rugged and incredibly steep mountain trail flanked by dense elephant grass.",
            "interesting_facts": "The trek to the peak ranks among the toughest trails in South India."
        },
        "images": [
            "assets/destinations/pushpagiri/1.jpg",
            "assets/destinations/pushpagiri/2.jpg",
            "assets/destinations/pushpagiri/3.jpg"
        ],
        "entry_fee": { "indian": "₹200", "foreign": "₹1000" },
        "best_time_to_visit": "Oct-Jan",
        "category": "Hill Station"
    },
    {
        "destination_name": "Brahmagiri Hills",
        "city": "Kodagu",
        "state": "Karnataka",
        "country": "India",
        "latitude": 11.9546,
        "longitude": 75.9961,
        "description": "A deeply forested mountain range connecting the Western Ghats of Karnataka and Kerala.",
        "detailedInfo": {
            "history": "Believed to be the origin point of the holy River Kaveri at Talacauvery.",
            "cultural_significance": "A critical spiritual site where the sage Agastya is said to have meditated.",
            "architecture": "Lush shola evergreen forests enveloping a high-altitude sanctuary terrain.",
            "interesting_facts": "The hills overlook the spectacular Iruppu falls traversing from ancient mythological texts."
        },
        "images": [
            "assets/destinations/brahmagiri_hills/1.jpg",
            "assets/destinations/brahmagiri_hills/2.jpg",
            "assets/destinations/brahmagiri_hills/3.jpg"
        ],
        "entry_fee": { "indian": "₹250", "foreign": "₹250" },
        "best_time_to_visit": "Sep-Feb",
        "category": "Hill Station"
    },
    {
        "destination_name": "Nishani Motte",
        "city": "Madikeri",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.3831,
        "longitude": 75.6882,
        "description": "An off-beat, relatively unknown trekking peak within the Tala Kaveri Wildlife Sanctuary.",
        "detailedInfo": {
            "history": "Traditionally used by local forest guards as an observation point.",
            "cultural_significance": "Showcases the pristine and completely untouched parts of Kodagu’s rainforests.",
            "architecture": "A beautiful ridgeline walk culminating in an anti-poaching camp at the peak.",
            "interesting_facts": "Due to wild elephants and leopards, the trek strictly requires an official forest guide."
        },
        "images": [
            "assets/destinations/nishani_motte/1.jpg",
            "assets/destinations/nishani_motte/2.jpg",
            "assets/destinations/nishani_motte/3.jpg"
        ],
        "entry_fee": { "indian": "₹200", "foreign": "₹200" },
        "best_time_to_visit": "Oct-Mar",
        "category": "Adventure"
    },
    {
        "destination_name": "Ettina Bhuja",
        "city": "Chikmagalur",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.9840,
        "longitude": 75.6425,
        "description": "A distinctive mountain peak specifically shaped like an ox’s shoulder.",
        "detailedInfo": {
            "history": "Part of the expansive Charmadi Ghat range, heavily forested and less commercialized.",
            "cultural_significance": "Translated from Kannada, the name directly means 'Ox's Shoulder,' honoring rural agrarian life.",
            "architecture": "Characterized by its unique humped rocky summit protruding from the thick jungle.",
            "interesting_facts": "Provides stunning 360-degree views of the sprawling Charmadi Ghats devoid of modern structures."
        },
        "images": [
            "assets/destinations/ettina_bhuja/1.jpg",
            "assets/destinations/ettina_bhuja/2.jpg",
            "assets/destinations/ettina_bhuja/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Sep-Feb",
        "category": "Hill Station"
    },
    {
        "destination_name": "Ballalarayana Durga",
        "city": "Chikmagalur",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.1256,
        "longitude": 75.4045,
        "description": "A historic hill fort nestled in the remote corners of the Western Ghats.",
        "detailedInfo": {
            "history": "Constructed in the 12th century by the illustrious wife of Hoysala Emperor Veera Ballala I.",
            "cultural_significance": "A silent witness to the majestic Hoysala empire's strategic defense systems against invasions.",
            "architecture": "Ruined stone fortifications seamlessly blending into thick, ever-green forests and steep drops.",
            "interesting_facts": "The fort overlooks the terrifyingly beautiful cliff face known famously as Bandaje Arbi falls."
        },
        "images": [
            "assets/destinations/ballalarayana_durga/1.jpg",
            "assets/destinations/ballalarayana_durga/2.jpg",
            "assets/destinations/ballalarayana_durga/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Nov-Mar",
        "category": "Adventure"
    },
    {
        "destination_name": "Narasimha Parvatha",
        "city": "Agumbe",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.4682,
        "longitude": 75.0593,
        "description": "The highest peak in the Agumbe Ghats, famous for challenging and dense rainforest treks.",
        "detailedInfo": {
            "history": "Deeply situated in the region receiving the second-highest rainfall in India.",
            "cultural_significance": "A prized achievement for regional trekkers due to its grueling and remote nature.",
            "architecture": "Endless canopies of rainforest opening suddenly into a completely bald, grassy summit.",
            "interesting_facts": "The trail is heavily infested with leeches and one must beware of the elusive King Cobra."
        },
        "images": [
            "assets/destinations/narasimha_parvatha/1.jpg",
            "assets/destinations/narasimha_parvatha/2.jpg",
            "assets/destinations/narasimha_parvatha/3.jpg"
        ],
        "entry_fee": { "indian": "₹200", "foreign": "₹200" },
        "best_time_to_visit": "Oct-Jan",
        "category": "Adventure"
    },
    {
        "destination_name": "Ombattu Gudda",
        "city": "Sakleshpur",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.8711,
        "longitude": 75.6416,
        "description": "One of the most mysterious and difficult trekking peaks, roughly translating to 'Nine Hills'.",
        "detailedInfo": {
            "history": "Maintained largely as untouched virgin forest reserve separating Hassan and Dakshina Kannada.",
            "cultural_significance": "Renowned amongst hardcore survivalists and trekkers for its completely unmarked, raw trails.",
            "architecture": "A succession of nine distinct humps traversing across a vast high-altitude grassy ridge.",
            "interesting_facts": "It is dangerously easy to get lost due to confusing terrain, and requires crossing deep, swirling rivers."
        },
        "images": [
            "assets/destinations/ombattu_gudda/1.jpg",
            "assets/destinations/ombattu_gudda/2.jpg",
            "assets/destinations/ombattu_gudda/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Oct-Feb",
        "category": "Adventure"
    },
    {
        "destination_name": "Kopatty Hills",
        "city": "Coorg",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.3615,
        "longitude": 75.6432,
        "description": "A pristine, hidden trekking spot in Coorg traversing coffee estates and grasslands.",
        "detailedInfo": {
            "history": "Forms part of the Talacauvery range but has remained relatively obscure to commercial tourism.",
            "cultural_significance": "A quiet retreat capturing the authentic essence of pastoral Kodava farm life.",
            "architecture": "Trail begins at local plantations and gradually transitions into dark timber woods and open cliffs.",
            "interesting_facts": "You often catch surreal views of the Ernakulam hills in Kerala on a perfectly clear day."
        },
        "images": [
            "assets/destinations/kopatty_hills/1.jpg",
            "assets/destinations/kopatty_hills/2.jpg",
            "assets/destinations/kopatty_hills/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Sep-Feb",
        "category": "Hill Station"
    },
    {
        "destination_name": "Hidlumane Falls",
        "city": "Shimoga",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.8821,
        "longitude": 74.8783,
        "description": "A magnificent series of cascading falls located deep inside the Mookambika Wildlife Sanctuary.",
        "detailedInfo": {
            "history": "Discovered largely by trekkers as it lies en route to the famous Kodachadri peak.",
            "cultural_significance": "Its untouched waters are considered medicinal by the isolated local tribes.",
            "architecture": "Consists of 6 to 7 individual cascades plunging down uniquely jagged, overlapping rock formations.",
            "interesting_facts": "The ultimate view requires a gruelling, slippery climb right through the middle of the lower waterfalls."
        },
        "images": [
            "assets/destinations/hidlumane_falls/1.jpg",
            "assets/destinations/hidlumane_falls/2.jpg",
            "assets/destinations/hidlumane_falls/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Aug-Jan",
        "category": "Nature"
    },
    {
        "destination_name": "Koosalli Falls",
        "city": "Byndoor",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.9161,
        "longitude": 74.6983,
        "description": "A majestic six-tiered waterfall hidden deep in a rocky, forested gorge.",
        "detailedInfo": {
            "history": "Surrounded by ancient untouched woods, occasionally harboring rare black panthers.",
            "cultural_significance": "Considered a supreme example of raw natural beauty on Karnataka's coastline.",
            "architecture": "Drops over 380 feet from steep, jagged laterite rocks in a dramatic sequence.",
            "interesting_facts": "Requires a grueling rock-climbing trek to reach, making it completely secluded."
        },
        "images": [
            "assets/destinations/koosalli_falls/1.jpg",
            "assets/destinations/koosalli_falls/2.jpg",
            "assets/destinations/koosalli_falls/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Nov-Jan",
        "category": "Nature"
    },
    {
        "destination_name": "Kadambi Falls",
        "city": "Kudremukh",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.2081,
        "longitude": 75.2530,
        "description": "A picturesque, accessible waterfall located right off the main highway in Kudremukh.",
        "detailedInfo": {
            "history": "Tied to the history of the Kudremukh National Park's establishment post iron-ore mining.",
            "cultural_significance": "A favorite fast stopway for travelers driving through the mesmerizing Ghat sections.",
            "architecture": "A powerful single-tier drop nestled intimately amongst dense roadside greenery.",
            "interesting_facts": "Despite its ease of access, strict forest department rules prohibit bathing in its pool."
        },
        "images": [
            "assets/destinations/kadambi_falls/1.jpg",
            "assets/destinations/kadambi_falls/2.jpg",
            "assets/destinations/kadambi_falls/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Jul-Dec",
        "category": "Nature"
    },
    {
        "destination_name": "Jomlu Teertha Falls",
        "city": "Udupi",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.4385,
        "longitude": 74.9658,
        "description": "A fierce, rocky waterfall on the Sita River popular for exhilarating white-water rafting.",
        "detailedInfo": {
            "history": "Known heavily within the Someshwara Wildlife Sanctuary's complex geography.",
            "cultural_significance": "Considered a 'teertha' or holy water spot where local bathing rituals occasionally occur.",
            "architecture": "Creates deep pools and intense rapids due to sharp volcanic rocks in the riverbed.",
            "interesting_facts": "The force of the water during monsoons makes swimming fatally dangerous."
        },
        "images": [
            "assets/destinations/jomlu_teertha_falls/1.jpg",
            "assets/destinations/jomlu_teertha_falls/2.jpg",
            "assets/destinations/jomlu_teertha_falls/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Nov-Feb",
        "category": "Nature"
    },
    {
        "destination_name": "Mallalli Falls",
        "city": "Somwarpet",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.6375,
        "longitude": 75.7601,
        "description": "A thunderous, milky-white waterfall forming where the Kumaradhara River dives into a gorge.",
        "detailedInfo": {
            "history": "Located right at the foothills of the Pushpagiri hills, feeding the coastal belts.",
            "cultural_significance": "One of the most photogenic and massive monsoon attractions of Northern Coorg.",
            "architecture": "The water splits into multiple wide streams plummeting 200 feet over a stepped cliff face.",
            "interesting_facts": "A steep descent of over 700 perfectly laid concrete stairs leads you directly to the misty pool base."
        },
        "images": [
            "assets/destinations/mallalli_falls/1.jpg",
            "assets/destinations/mallalli_falls/2.jpg",
            "assets/destinations/mallalli_falls/3.jpg"
        ],
        "entry_fee": { "indian": "₹20", "foreign": "₹20" },
        "best_time_to_visit": "Jul-Dec",
        "category": "Nature"
    },
    {
        "destination_name": "Chelavara Falls",
        "city": "Cheyyandane",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.2341,
        "longitude": 75.6793,
        "description": "A stunning waterfall uniquely shaped like a tortoise, cutting through intense coffee estates.",
        "detailedInfo": {
            "history": "Locally termed as 'Embepare' which bizarrely translates to Tortoise Rock in the Kodava language.",
            "cultural_significance": "A major highlight accompanying the famous Chomakund hill trek just adjacent to it.",
            "architecture": "The water gently glides and suddenly plunges over a bizarrely round, dome-like giant rock.",
            "interesting_facts": "Due to immense depth and treacherous undercurrents, getting into the water here is strictly banned."
        },
        "images": [
            "assets/destinations/chelavara_falls/1.jpg",
            "assets/destinations/chelavara_falls/2.jpg",
            "assets/destinations/chelavara_falls/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Aug-Nov",
        "category": "Nature"
    },
    {
        "destination_name": "Barkana Falls",
        "city": "Agumbe",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.4866,
        "longitude": 75.0747,
        "description": "The tenth highest waterfall in India, cascading a massive 850 feet deep in the rainforest.",
        "detailedInfo": {
            "history": "Formed directly by the Sita River rushing through the thickest parts of the Western Ghats.",
            "cultural_significance": "The name is derived from 'Barka', which translates to Mouse Deer frequently found here.",
            "architecture": "A sheer, unbroken, devastatingly steep plunge viewable only from a specific distant forest watchtower.",
            "interesting_facts": "Remains completely invisible during monsoon peak due to perpetual, unbelievably thick fog."
        },
        "images": [
            "assets/destinations/barkana_falls/1.jpg",
            "assets/destinations/barkana_falls/2.jpg",
            "assets/destinations/barkana_falls/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Oct-Jan",
        "category": "Nature"
    },
    {
        "destination_name": "Hanuman Gundi Falls",
        "city": "Karkala",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.2384,
        "longitude": 75.2573,
        "description": "A beautifully stepped, 100-foot waterfall managed securely by the forest department.",
        "detailedInfo": {
            "history": "An integral, well-maintained attraction of the massive Kudremukh National Park infrastructure.",
            "cultural_significance": "Also known as Sutanabbe falls, famous for perfectly safe tourist bathing.",
            "architecture": "Deep, naturally carved stone bathing pool surrounded by protective metal railings.",
            "interesting_facts": "You must precisely descend 300 perfectly positioned stone stairs under giant tree canopies."
        },
        "images": [
            "assets/destinations/hanuman_gundi_falls/1.jpg",
            "assets/destinations/hanuman_gundi_falls/2.jpg",
            "assets/destinations/hanuman_gundi_falls/3.jpg"
        ],
        "entry_fee": { "indian": "₹40", "foreign": "₹40" },
        "best_time_to_visit": "Aug-Jan",
        "category": "Nature"
    },
    {
        "destination_name": "Sirimane Falls",
        "city": "Sringeri",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.4357,
        "longitude": 75.2155,
        "description": "A surprisingly broad and highly accessible waterfall situated close to the holy town of Sringeri.",
        "detailedInfo": {
            "history": "A regular brief retreat for thousands of pilgrims who visit the historic Sharadamba Temple.",
            "cultural_significance": "Revered locally for its pure water source originating deep in the untainted Ghats.",
            "architecture": "Not exceptionally tall, but uniquely wide, creating a broad misty and shallow pool.",
            "interesting_facts": "The local community has constructed changing rooms allowing visitors to directly stand under the plunge."
        },
        "images": [
            "assets/destinations/sirimane_falls/1.jpg",
            "assets/destinations/sirimane_falls/2.jpg",
            "assets/destinations/sirimane_falls/3.jpg"
        ],
        "entry_fee": { "indian": "₹50", "foreign": "₹50" },
        "best_time_to_visit": "Sep-Feb",
        "category": "Nature"
    },
    {
        "destination_name": "Tannirbhavi Beach",
        "city": "Mangalore",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.8911,
        "longitude": 74.8166,
        "description": "A pristine, serene beach near Mangalore backed completely by thick Casuarina trees.",
        "detailedInfo": {
            "history": "Recently heavily developed by changing local administrations to alleviate crowds at Panambur.",
            "cultural_significance": "A hub for young Mangaloreans; uniquely accessed by ferry across the Gurupura river.",
            "architecture": "Characterized by golden sands, wooden seaside shacks, and large offshore ship views.",
            "interesting_facts": "Features a scenic dedicated tree park perfectly protecting the shore from severe soil erosion."
        },
        "images": [
            "assets/destinations/tannirbhavi_beach/1.jpg",
            "assets/destinations/tannirbhavi_beach/2.jpg",
            "assets/destinations/tannirbhavi_beach/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Oct-Feb",
        "category": "Beach"
    },
    {
        "destination_name": "Panambur Beach",
        "city": "Mangalore",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.9372,
        "longitude": 74.8016,
        "description": "The most famous and buzzing public beach in Mangalore known for festivals.",
        "detailedInfo": {
            "history": "Maintained exceptionally by a private enterprise, a pioneering model in coastal Karnataka.",
            "cultural_significance": "Host to visually spectacular international kite festivals and annual sand art competitions.",
            "architecture": "Wide, heavily guarded shores equipped intimately with watchtowers and jet ski docks.",
            "interesting_facts": "Ranked consistently as one of the cleanest and safest city-adjacent beaches in all of India."
        },
        "images": [
            "assets/destinations/panambur_beach/1.jpg",
            "assets/destinations/panambur_beach/2.jpg",
            "assets/destinations/panambur_beach/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Oct-May",
        "category": "Beach"
    },
    {
        "destination_name": "Someshwar Beach",
        "city": "Ullal",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.7932,
        "longitude": 74.8465,
        "description": "A spectacularly ragged beach instantly recognizable by the massive rocks called Rudra Shile.",
        "detailedInfo": {
            "history": "Adorned by the centuries-old Someshwara Temple constructed by the powerful Queen Abbakka.",
            "cultural_significance": "A dramatic clash of roaring oceanic nature and ancient unmoving faith.",
            "architecture": "Features violently crashing waves upon huge black boulders alongside an elevated golden temple.",
            "interesting_facts": "Swimming here is considered practically suicidal due to incredibly fierce unseen rip currents."
        },
        "images": [
            "assets/destinations/someshwar_beach/1.jpg",
            "assets/destinations/someshwar_beach/2.jpg",
            "assets/destinations/someshwar_beach/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Oct-Feb",
        "category": "Beach"
    },
    {
        "destination_name": "Kodi Beach",
        "city": "Kundapur",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.6265,
        "longitude": 74.7001,
        "description": "A stunning visual delta beach where the roaring Arabian sea meets backwaters.",
        "detailedInfo": {
            "history": "The word 'Kodi' quite literally means 'corner' in the local Kannada dialect.",
            "cultural_significance": "Perfectly preserves a quaint, ultra-relaxed fishing village atmosphere devoid of commercialism.",
            "architecture": "Lined intimately with a newly built sea-walk stretching right out onto the oceanic water.",
            "interesting_facts": "Dolphins are regularly and easily spotted jumping gracefully close to the rocky breakwater."
        },
        "images": [
            "assets/destinations/kodi_beach/1.jpg",
            "assets/destinations/kodi_beach/2.jpg",
            "assets/destinations/kodi_beach/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Oct-Feb",
        "category": "Beach"
    },
    {
        "destination_name": "Delta Beach",
        "city": "Udupi",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.4111,
        "longitude": 74.6980,
        "description": "Also known intimately as Kodi Bengre, it's a slender peninsula between the river and sea.",
        "detailedInfo": {
            "history": "Emerged recently as a booming hotspot strictly for surfing and chilled coastal shacks.",
            "cultural_significance": "Where the beautiful Suvarna River finally embraces the massive Arabian Sea gracefully.",
            "architecture": "A narrow geographical strip lined densely with toddy tapping palms.",
            "interesting_facts": "Contains completely undiscovered hidden mangrove forests reachable only via quiet kayak tours."
        },
        "images": [
            "assets/destinations/delta_beach/1.jpg",
            "assets/destinations/delta_beach/2.jpg",
            "assets/destinations/delta_beach/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Oct-Mar",
        "category": "Beach"
    },
    {
        "destination_name": "Trasi Beach",
        "city": "Kundapur",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.7501,
        "longitude": 74.6201,
        "description": "A scenic white-sand beach known famous for its tiny private turtle island.",
        "detailedInfo": {
            "history": "Functioned historically as a prime migration nesting ground for rare olive ridley turtles.",
            "cultural_significance": "Merges gracefully with the famous Maravanthe strip, offering undisturbed calm vibes.",
            "architecture": "Sweeping wide coastal sands with extremely shallow, child-safe waves.",
            "interesting_facts": "The entire coastline dramatically glows with bio-luminescence during very specific late summer nights."
        },
        "images": [
            "assets/destinations/trasi_beach/1.jpg",
            "assets/destinations/trasi_beach/2.jpg",
            "assets/destinations/trasi_beach/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Nov-Feb",
        "category": "Beach"
    },
    {
        "destination_name": "Baindur Beach",
        "city": "Byndoor",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.8741,
        "longitude": 74.6212,
        "description": "An unbelievably tranquil beach marked by a huge cliff and the Ottinene viewpoint.",
        "detailedInfo": {
            "history": "Sheltered traditionally by the nearby historical Someshwara temple structure.",
            "cultural_significance": "An introspective retreat specifically where the Byndoor river gracefully meets the ocean.",
            "architecture": "Features a rare high-altitude cliff jutting spectacularly into an otherwise flat coastal line.",
            "interesting_facts": "The sunset viewed directly from the Ottinene cliff is considered the most dramatic in coastal Karnataka."
        },
        "images": [
            "assets/destinations/baindur_beach/1.jpg",
            "assets/destinations/baindur_beach/2.jpg",
            "assets/destinations/baindur_beach/3.jpg"
        ],
        "entry_fee": { "indian": "Free", "foreign": "Free" },
        "best_time_to_visit": "Oct-Mar",
        "category": "Beach"
    }
];

fs.writeFileSync('data/batch1_dests.js', JSON.stringify(batch1));
console.log('Batch 1 written. Size:', batch1.length);
