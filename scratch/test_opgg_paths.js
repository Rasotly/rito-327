const https = require('https');

async function testEndpoints() {
  const base = 'https://op.gg/lol/summoners/tr/CaitlyneA%C5%9F%C4%B1%C4%9F%C4%B1m-CAIT';
  const urls = [
    `${base}/champions.json`,
    `${base}/most-champions.json`,
    `${base}/summary.json`,
    `${base}/stats.json`,
    `${base}/ai.json`
  ];

  for (const u of urls) {
    const parsed = new URL(u);
    https.get({
      hostname: parsed.hostname,
      path: parsed.pathname,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    }, res => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => console.log(u, '=> Status:', res.statusCode, 'Len:', b.length, 'Preview:', b.substring(0, 100)));
    });
  }
}

testEndpoints();
