const https = require('https');

async function testOpggApi() {
  // Let's test various OP.GG API endpoints for summoner CaitlyneAşığım#CAIT
  const endpoints = [
    'https://op.gg/api/v1.0/internal/bypass/summoners/tr/CaitlyneA%C5%9F%C4%B1%C4%9F%C4%B1m-CAIT/most-champions/ranked',
    'https://op.gg/api/v1.0/internal/bypass/games/tr/summoners/CaitlyneA%C5%9F%C4%B1%C4%9F%C4%B1m-CAIT',
    'https://lol-web-api.op.gg/api/v1.0/internal/bypass/summoners/tr/CaitlyneA%C5%9F%C4%B1%C4%9F%C4%B1m-CAIT'
  ];

  for (const url of endpoints) {
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://op.gg/'
      }
    }, res => {
      let b = '';
      res.on('data', c => { b += c; });
      res.on('end', () => {
        console.log(url, '=> Status:', res.statusCode, 'Len:', b.length, 'Body:', b.substring(0, 300));
      });
    });
    req.on('error', e => console.error(url, e.message));
    req.end();
  }
}

testOpggApi();
