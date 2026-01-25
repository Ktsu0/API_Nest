const fs = require('fs');

async function debugFetchSave() {
  try {
    const res = await fetch('http://localhost:5000/series');
    const data = await res.json();
    fs.writeFileSync('error_dump.json', JSON.stringify(data, null, 2));
    console.log('Error saved to error_dump.json');
  } catch (e) {
    console.error('Fetch error:', e.message);
  }
}

debugFetchSave();
