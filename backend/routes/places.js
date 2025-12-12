const express = require('express');
const router = express.Router();
const Place = require('../models/Place');

// @route   GET /api/places
// @desc    Get all places
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Returning rich mock data with Unsplash images for instant UI feedback
        // In production, this would come from the internal admin panel / DB
        const richPlaces = [
            // Rajasthan
            {
                id: '1', name: 'Hawa Mahal', location: 'Jaipur, Rajasthan', state: 'Rajasthan', city: 'Jaipur',
                description: 'The "Palace of Winds" built from red and pink sandstone.',
                imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897866e4a?q=80&w=1000',
                category: 'Heritage', rating: 4.7, bestTime: 'Oct-Mar', entryFee: '₹50',
                isEcoFriendly: false,
                contactInfo: {
                    phone: '+91-141-2618862',
                    email: 'info@hawamahal.com',
                    website: 'https://hawamahal.com'
                },
                coordinates: { latitude: 26.9239, longitude: 75.8267 }
            },
            {
                id: '1a', name: 'Amber Fort', location: 'Jaipur, Rajasthan', state: 'Rajasthan', city: 'Jaipur',
                description: 'A majestic fort located high on a hill, known for its artistic style elements.',
                imageUrl: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?q=80&w=1000',
                category: 'Forts', rating: 4.8, bestTime: 'Oct-Mar', entryFee: '₹100',
                isEcoFriendly: false,
                contactInfo: {
                    phone: '+91-141-2530293',
                    website: 'https://amberfort.org'
                },
                coordinates: { latitude: 26.9855, longitude: 75.8513 }
            },
            {
                id: '1b', name: 'Lake Pichola', location: 'Udaipur, Rajasthan', state: 'Rajasthan', city: 'Udaipur',
                description: 'An artificial fresh water lake, created in the year 1362 AD.',
                imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?q=80&w=1000',
                category: 'Nature', rating: 4.9, bestTime: 'Sep-Mar', entryFee: 'Free',
                isEcoFriendly: true,
                contactInfo: {
                    phone: '+91-294-2419010',
                    email: 'tourism@udaipur.gov.in'
                },
                coordinates: { latitude: 24.5761, longitude: 73.6791 }
            },
            {
                id: '1c', name: 'Jaisalmer Fort', location: 'Jaisalmer, Rajasthan', state: 'Rajasthan', city: 'Jaisalmer',
                description: 'One of the very few "living forts" in the world, as nearly one fourth of the old city\'s population still resides within the fort.',
                imageUrl: 'https://images.unsplash.com/photo-1572885994165-2bc385d38392?q=80&w=1000',
                category: 'Forts', rating: 4.8, bestTime: 'Nov-Feb', entryFee: '₹50',
                isEcoFriendly: false,
                coordinates: { latitude: 26.9124, longitude: 70.9167 }
            },

            // Uttar Pradesh
            {
                id: '2', name: 'Taj Mahal', location: 'Agra, Uttar Pradesh', state: 'Uttar Pradesh', city: 'Agra',
                description: 'An immense mausoleum of white marble, the jewel of Muslim art in India.',
                imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000',
                category: 'Heritage', rating: 4.9, bestTime: 'Oct-Mar', entryFee: '₹50',
                isEcoFriendly: false,
                contactInfo: {
                    phone: '+91-562-2226431',
                    website: 'https://tajmahal.gov.in'
                },
                coordinates: { latitude: 27.1751, longitude: 78.0421 }
            },
            {
                id: '4', name: 'Varanasi Ghats', location: 'Varanasi, Uttar Pradesh', state: 'Uttar Pradesh', city: 'Varanasi',
                description: 'Major religious hub in India, and the holiest of the seven sacred cities.',
                imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1000',
                category: 'Spiritual', rating: 4.8, bestTime: 'Nov-Feb', entryFee: 'Free',
                isEcoFriendly: true,
                contactInfo: {
                    phone: '+91-542-2506670',
                    email: 'tourism@varanasi.gov.in'
                },
                coordinates: { latitude: 25.2820, longitude: 83.0010 }
            },

            // Kerala
            {
                id: '3', name: 'Kerala Backwaters', location: 'Alleppey, Kerala', state: 'Kerala', city: 'Alleppey',
                description: 'A network of brackish lagoons and lakes lying parallel to the Arabian Sea coast.',
                imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9947?q=80&w=1000',
                category: 'Nature', rating: 4.8, bestTime: 'Sep-Mar', entryFee: 'Free',
                isEcoFriendly: true,
                contactInfo: {
                    phone: '+91-477-2251796',
                    email: 'info@keralatourism.org',
                    website: 'https://www.keralatourism.org'
                },
                coordinates: { latitude: 9.4981, longitude: 76.3388 }
            },
            {
                id: '3a', name: 'Munnar Tea Gardens', location: 'Munnar, Kerala', state: 'Kerala', city: 'Munnar',
                description: 'Rolling hills dotted with tea plantations, established in the late 19th century.',
                imageUrl: 'https://images.unsplash.com/photo-1591035889753-46142c13000b?q=80&w=1000',
                category: 'Hill Stations', rating: 4.9, bestTime: 'Sep-Mar', entryFee: 'Free',
                isEcoFriendly: true,
                contactInfo: {
                    phone: '+91-4865-231516',
                    website: 'https://munnar.com'
                },
                coordinates: { latitude: 10.0889, longitude: 77.0595 }
            },

            // Ladakh
            {
                id: '5', name: 'Pangong Lake', location: 'Ladakh', state: 'Ladakh', city: 'Leh',
                description: 'Endorheic lake in the Himalayas situated at a height of about 4,350 m.',
                imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000',
                category: 'Adventure', rating: 4.9, bestTime: 'May-Sep', entryFee: 'Permit',
                isEcoFriendly: true,
                contactInfo: {
                    phone: '+91-1982-252297',
                    email: 'tourism@leh.gov.in'
                },
                coordinates: { latitude: 33.7296, longitude: 78.9396 }
            },

            // Goa
            {
                id: '6', name: 'Goa Beaches', location: 'Calangute, Goa', state: 'Goa', city: 'North Goa',
                description: 'Tropical spice plantations and long coastlines stretching along the Arabian Sea.',
                imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000',
                category: 'Beaches', rating: 4.6, bestTime: 'Nov-Feb', entryFee: 'Free',
                isEcoFriendly: false,
                contactInfo: {
                    phone: '+91-832-2438866',
                    website: 'https://www.goatourism.gov.in'
                },
                coordinates: { latitude: 15.5530, longitude: 73.7630 }
            }
        ];

        res.json(richPlaces);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
