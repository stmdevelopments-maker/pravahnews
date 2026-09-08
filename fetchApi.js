const https = require('https');
https.get('https://pravahnews.com/api/home', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Keys in json:', Object.keys(json));
      if (json.data) {
        console.log('Keys in json.data:', Object.keys(json.data));
        if (json.data.ads) {
          console.log('Ads:', JSON.stringify(json.data.ads).substring(0, 200));
        } else if (json.data.advertisements) {
          console.log('Advertisements:', JSON.stringify(json.data.advertisements).substring(0, 200));
        } else {
            console.log('No ads key found.');
        }
      }
    } catch (e) {
      console.error(e);
    }
  });
});
