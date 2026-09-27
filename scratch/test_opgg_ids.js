const https = require('https');

function fetchFollow(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    };

    https.get(options, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchFollow(res.headers.location));
      }
      let body = '';
      res.on('data', d => { body += d; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function test() {
  const res = await fetchFollow('https://op.gg/lol/summoners/tr/CaitlyneA%C5%9F%C4%B1%C4%9F%C4%B1m-CAIT');
  const m = res.body.match(/\"summoner_id\":\"([^\"]+)\"/);
  console.log('summoner_id:', m ? m[1] : 'not found');
  const puuid = res.body.match(/\"puuid\":\"([^\"]+)\"/);
  console.log('puuid:', puuid ? puuid[1] : 'not found');
}

test().catch(console.error);
