const fs = require('fs');

const batch2a = [
    {
        "destination_name": "Bhatkal Beach",
        "city": "Bhatkal",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.9785,
        "longitude": 74.5500,
        "description": "A historic coastal beach shadowed by an ancient lighthouse and rugged terrain.",
        "detailedInfo": {
            "history": "Bhatkal was once a remarkably prosperous medieval port trading extensively with the Middle East.",
            "cultural_significance": "A blend of deep Islamic heritage and ancient Hindu temples dotting the surrounding coastal area.",
            "architecture": "Features an old stone lighthouse standing defiantly against aggressively crashing Arabian sea waves.",
            "interesting_facts": "The beach is uniquely flanked by towering hills providing an incredible panoramic oceanic view."
        },
        "images": ["assets/destinations/bhatkal_beach/1.jpg", "assets/destinations/bhatkal_beach/2.jpg", "assets/destinations/bhatkal_beach/3.jpg"],
        "entry_fee": { "indian": "Free", "foreign": "Free" }, "best_time_to_visit": "Oct-Feb", "category": "Beach"
    },
    {
        "destination_name": "Ullal Beach",
        "city": "Mangalore",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.8021,
        "longitude": 74.8430,
        "description": "A deeply serene, shaded beach lined flawlessly with towering casuarina groves.",
        "detailedInfo": {
            "history": "Historically intertwined with the fierce independence struggle led by Queen Abbakka Chowta.",
            "cultural_significance": "Beloved by locals for its tranquility compared to the bustling commercial beaches of Mangalore.",
            "architecture": "A sweeping shoreline naturally barricaded by dense green casuarina and palm trees.",
            "interesting_facts": "Located exceptionally close to the famous Seyyid Madani Dargah attracting thousands of pilgrims."
        },
        "images": ["assets/destinations/ullal_beach/1.jpg", "assets/destinations/ullal_beach/2.jpg", "assets/destinations/ullal_beach/3.jpg"],
        "entry_fee": { "indian": "Free", "foreign": "Free" }, "best_time_to_visit": "Oct-Feb", "category": "Beach"
    },
    {
        "destination_name": "Bengre Beach",
        "city": "Mangalore",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.8569,
        "longitude": 74.8194,
        "description": "A geographically striking peninsula beach where the Netravati river merges with the sea.",
        "detailedInfo": {
            "history": "Served traditionally as a secluded encampment for deep-sea fishermen of the Mangalore region.",
            "cultural_significance": "Showcases authentic, undisturbed coastal fishing life completely away from modern tourist traps.",
            "architecture": "A breathtaking sandy spit extending boldly outward framed by river on one side, sea on the other.",
            "interesting_facts": "Offers a highly unique 'estuary walk' right at the dramatic confluence of river and ocean."
        },
        "images": ["assets/destinations/bengre_beach/1.jpg", "assets/destinations/bengre_beach/2.jpg", "assets/destinations/bengre_beach/3.jpg"],
        "entry_fee": { "indian": "Free", "foreign": "Free" }, "best_time_to_visit": "Oct-Feb", "category": "Beach"
    },
    {
        "destination_name": "Ranganathittu Bird Sanctuary",
        "city": "Srirangapatna",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.4246,
        "longitude": 76.6548,
        "description": "Karnataka's largest bird sanctuary spanning intimately across six tiny islands in the Kaveri river.",
        "detailedInfo": {
            "history": "Established heavily due to the dedicated efforts of the legendary ornithologist Dr. Salim Ali in 1940.",
            "cultural_significance": "A critical eco-tourism hotspot drawing millions to witness spectacular avian migrations.",
            "architecture": "Naturally formed riverine islands populated fiercely by bamboo and broad-leaved species.",
            "interesting_facts": "Hosts the largest congregation of enormously massive mugger crocodiles peacefully coexisting with the birds."
        },
        "images": ["assets/destinations/ranganathittu_bird_sanctuary/1.jpg", "assets/destinations/ranganathittu_bird_sanctuary/2.jpg", "assets/destinations/ranganathittu_bird_sanctuary/3.jpg"],
        "entry_fee": { "indian": "₹75", "foreign": "₹500" }, "best_time_to_visit": "Dec-May", "category": "Nature"
    },
    {
        "destination_name": "Kokkare Bellur Bird Sanctuary",
        "city": "Maddur",
        "state": "Karnataka",
        "country": "India",
        "latitude": 12.6015,
        "longitude": 77.0673,
        "description": "A charming village where wild pelicans and painted storks live intimately amongst village residents.",
        "detailedInfo": {
            "history": "The village has a centuries-old tradition of coexisting harmoniously with massive migratory birds.",
            "cultural_significance": "A beautiful example of rural conservation where villagers actively protect the nesting trees.",
            "architecture": "Birds build massive nests directly in the tamarind and peepal trees lining the village streets.",
            "interesting_facts": "The villagers consider the birds a sign of immense good luck and prosperity for their crops."
        },
        "images": ["assets/destinations/kokkare_bellur_bird_sanctuary/1.jpg", "assets/destinations/kokkare_bellur_bird_sanctuary/2.jpg", "assets/destinations/kokkare_bellur_bird_sanctuary/3.jpg"],
        "entry_fee": { "indian": "Free", "foreign": "Free" }, "best_time_to_visit": "Nov-Mar", "category": "Nature"
    },
    {
        "destination_name": "Daroji Sloth Bear Sanctuary",
        "city": "Hampi",
        "state": "Karnataka",
        "country": "India",
        "latitude": 15.2505,
        "longitude": 76.5470,
        "description": "A dramatically rugged, boulder-strewn sanctuary exclusively dedicated to the Indian Sloth Bear.",
        "detailedInfo": {
            "history": "Created specifically in 1994 to aggressively protect the fast-dwindling sloth bear population.",
            "cultural_significance": "Serves as a crucial ecological buffer supporting the world heritage site of Hampi.",
            "architecture": "Composed primarily of fiercely hot, dry deciduous scrub forest thoroughly dotted with ancient boulders.",
            "interesting_facts": "Features a specifically dedicated watchtower allowing visitors to watch bears feast on honey directly."
        },
        "images": ["assets/destinations/daroji_sloth_bear_sanctuary/1.jpg", "assets/destinations/daroji_sloth_bear_sanctuary/2.jpg", "assets/destinations/daroji_sloth_bear_sanctuary/3.jpg"],
        "entry_fee": { "indian": "₹50", "foreign": "₹300" }, "best_time_to_visit": "Aug-Apr", "category": "Wildlife"
    },
    {
        "destination_name": "Gudavi Bird Sanctuary",
        "city": "Soraba",
        "state": "Karnataka",
        "country": "India",
        "latitude": 14.4372,
        "longitude": 75.0116,
        "description": "A picturesque bird sanctuary nestled deeply inside the thick, wet Malnad forests.",
        "detailedInfo": {
            "history": "Centered intimately around the vast Gudavi Lake which historically supported local farming.",
            "cultural_significance": "Home prominently to hundreds of varieties of vibrant water birds breeding during monsoons.",
            "architecture": "A densely forested lake perimeter featuring highly accessible viewing platforms.",
            "interesting_facts": "At peak season, the sheer noise of tens of thousands of squawking birds is utterly deafening."
        },
        "images": ["assets/destinations/gudavi_bird_sanctuary/1.jpg", "assets/destinations/gudavi_bird_sanctuary/2.jpg", "assets/destinations/gudavi_bird_sanctuary/3.jpg"],
        "entry_fee": { "indian": "₹50", "foreign": "₹50" }, "best_time_to_visit": "Jun-Nov", "category": "Nature"
    },
    {
        "destination_name": "Mandagadde Bird Sanctuary",
        "city": "Shimoga",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.7842,
        "longitude": 75.4626,
        "description": "A tiny yet incredibly vibrant riverine island serving as a prime monsoon nesting ground.",
        "detailedInfo": {
            "history": "Pioneered organically by the Tunga river forming an isolated sanctuary heavily protected by water.",
            "cultural_significance": "A vital halt specifically for the elegant Median Egret, Darter, and Little Cormorant.",
            "architecture": "An isolated chunk of lush forest directly in the middle of a constantly flowing river.",
            "interesting_facts": "The absolute best viewing requires riding a traditional coracle extremely close to the nesting trees."
        },
        "images": ["assets/destinations/mandagadde_bird_sanctuary/1.jpg", "assets/destinations/mandagadde_bird_sanctuary/2.jpg", "assets/destinations/mandagadde_bird_sanctuary/3.jpg"],
        "entry_fee": { "indian": "Free", "foreign": "Free" }, "best_time_to_visit": "Jul-Oct", "category": "Nature"
    },
    {
        "destination_name": "Attiveri Bird Sanctuary",
        "city": "Mundgod",
        "state": "Karnataka",
        "country": "India",
        "latitude": 15.0175,
        "longitude": 74.9669,
        "description": "A spectacularly engineered reservoir sanctuary sitting silently between agricultural fields and forests.",
        "detailedInfo": {
            "history": "Developed massively around an irrigation reservoir built extensively in the 1990s.",
            "cultural_significance": "Proves the resilience of nature specifically adapting to man-made water bodies for massive breeding.",
            "architecture": "A beautifully quiet lake completely fringed by thick deciduous forest and agricultural land.",
            "interesting_facts": "Features an extensively long walkway built right across the water specifically for undisturbed bird watching."
        },
        "images": ["assets/destinations/attiveri_bird_sanctuary/1.jpg", "assets/destinations/attiveri_bird_sanctuary/2.jpg", "assets/destinations/attiveri_bird_sanctuary/3.jpg"],
        "entry_fee": { "indian": "₹50", "foreign": "₹50" }, "best_time_to_visit": "Nov-Mar", "category": "Nature"
    },
    {
        "destination_name": "Bonal Bird Sanctuary",
        "city": "Shorapur",
        "state": "Karnataka",
        "country": "India",
        "latitude": 16.4862,
        "longitude": 76.6215,
        "description": "Karnataka's second largest bird sanctuary situated boldly in the extremely dry Yadgir district.",
        "detailedInfo": {
            "history": "The lake itself was built by the Surpur King Raja Pam Naik heavily supported by the British.",
            "cultural_significance": "A spectacular oasis serving absolutely vital life-support functions in an otherwise arid region.",
            "architecture": "An expansive man-made lake engineered beautifully surviving across several centuries.",
            "interesting_facts": "During harsh winter months, an astonishing number of brilliant purple moorhens famously occupy the lake."
        },
        "images": ["assets/destinations/bonal_bird_sanctuary/1.jpg", "assets/destinations/bonal_bird_sanctuary/2.jpg", "assets/destinations/bonal_bird_sanctuary/3.jpg"],
        "entry_fee": { "indian": "Free", "foreign": "Free" }, "best_time_to_visit": "Nov-Mar", "category": "Nature"
    },
    {
        "destination_name": "Ranebennur Blackbuck Sanctuary",
        "city": "Ranebennur",
        "state": "Karnataka",
        "country": "India",
        "latitude": 14.6186,
        "longitude": 75.7001,
        "description": "An open scrub forest beautifully protecting the highly endangered striking Indian blackbuck.",
        "detailedInfo": {
            "history": "Eestablished specifically in 1974 precisely to recover sharply declining blackbuck populations.",
            "cultural_significance": "Represents deeply successful ecological recovery balancing heavy agricultural pressure.",
            "architecture": "Consists largely of aggressively dry scrub plains, brilliantly suited for fast-running antelopes.",
            "interesting_facts": "The sanctuary heavily features the Great Indian Bustard, one of the rarest birds strictly surviving today."
        },
        "images": ["assets/destinations/ranebennur_blackbuck_sanctuary/1.jpg", "assets/destinations/ranebennur_blackbuck_sanctuary/2.jpg", "assets/destinations/ranebennur_blackbuck_sanctuary/3.jpg"],
        "entry_fee": { "indian": "₹50", "foreign": "₹50" }, "best_time_to_visit": "Oct-Mar", "category": "Wildlife"
    },
    {
        "destination_name": "Mookambika Wildlife Sanctuary",
        "city": "Kollur",
        "state": "Karnataka",
        "country": "India",
        "latitude": 13.8647,
        "longitude": 74.8390,
        "description": "A staggeringly thick coastal rainforest sanctuary sprawling beautifully across the dramatic Western Ghats.",
        "detailedInfo": {
            "history": "Named devotedly after the intensely powerful presiding deity of the globally famous adjacent Kollur temple.",
            "cultural_significance": "Flawlessly blends intense spiritual devotion intimately with raw, fierce natural preservation.",
            "architecture": "Steeply plunging valleys entirely covered fiercely by practically impenetrable evergreen timber.",
            "interesting_facts": "Acts critically as an enormously vital green ecological corridor safely linking higher mountain reserves."
        },
        "images": ["assets/destinations/mookambika_wildlife_sanctuary/1.jpg", "assets/destinations/mookambika_wildlife_sanctuary/2.jpg", "assets/destinations/mookambika_wildlife_sanctuary/3.jpg"],
        "entry_fee": { "indian": "₹200", "foreign": "₹200" }, "best_time_to_visit": "Nov-Mar", "category": "Wildlife"
    }
];

fs.writeFileSync('data/batch2a_dests.js', JSON.stringify(batch2a));
console.log('Batch 2a written. Size:', batch2a.length);
