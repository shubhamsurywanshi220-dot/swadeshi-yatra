const fs = require('fs');
const content = fs.readFileSync('data/karnatakaDestinations.js', 'utf8');
const match = [...content.matchAll(/\"destination_name\":\s*\"([^\"]+)\"/g)];
const names = match.map(m => m[1]);
console.log(names.join('\n'));
