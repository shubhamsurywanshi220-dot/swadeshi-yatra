const { allPlaces } = require('./allPlaces.js');
console.log('Total Destinations:', allPlaces.length);

const karnataka = allPlaces.filter(p => p.state === 'Karnataka');
console.log('Karnataka Destinations:', karnataka.length);

const hiddenGems = allPlaces.filter(p => p.isHiddenGem);
console.log('Hidden Gems:', hiddenGems.length);

const categories = {};
allPlaces.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + 1;
});
console.log('Categories Breakup:', JSON.stringify(categories, null, 2));
