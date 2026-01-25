const API_BASE_URL = 'http://localhost:5000/series';

async function debugFetch() {
  try {
    const res = await fetch(API_BASE_URL);
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data structure preview (first item):');
    if (data.length > 0) {
      console.log(JSON.stringify(data[0], null, 2));
      console.log('Meta keys:', Object.keys(data[0].meta || {}));
    } else {
      console.log('Empty array returned');
    }
  } catch (e) {
    console.error('Fetch error:', e.message);
  }
}

debugFetch();
