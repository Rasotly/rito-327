const https = require('https');

function testUrl(url) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    }, res => {
      let b = '';
      res.on('data', c => { if (b.length < 50000) b += c; });
      res.on('end', () => {
        resolve({ url, status: res.statusCode, len: b.length, preview: b.substring(0, 300) });
      });
    });
    req.on('error', e => resolve({ url, err: e.message }));
    req.end();
  });
}

async function main() {
  const urls = [
    'https://porofessor.gg/tr/live/tr/CaitlyneA%C5%9F%C4%B1%C4%9F%C4%B1m-CAIT',
    'https://porofessor.gg/tr/summoner/tr/CaitlyneA%C5%9F%C4%B1%C4%9F%C4%B1m-CAIT',
    'https://u.gg/lol/profile/tr1/caitlynea%C5%9F%C4%B1%C4%9F%C4%B1m-cait/overview'
  ];
  for (const u of urls) {
    const r = await testUrl(u);
    console.log(r.url, '=> Status:', r.status, 'Len:', r.len);
  }
}

main();
