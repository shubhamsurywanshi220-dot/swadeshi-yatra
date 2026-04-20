const axios = require('axios');

async function testApi() {
    try {
        console.log('Testing /api/admin/stats...');
        // Note: This requires a token. I'll try to find one or just see if it returns 401 vs 500.
        const res = await axios.get('http://localhost:5000/api/admin/stats');
        console.log('Stats:', res.data);
    } catch (err) {
        console.error('Error:', err.response ? err.response.status : err.message);
        if (err.response && err.response.data) console.error('Data:', err.response.data);
    }
}

testApi();
