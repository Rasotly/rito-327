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
  console.log('Status:', res.status, 'Body len:', res.body.length);
  
  // Look for JSON or script data
  const scripts = res.body.match(/<script id=\"__NEXT_DATA__\"[^>]*>(.*?)<\/script>/s);
  if (scripts) {
    console.log('Found __NEXT_DATA__!');
    const j = JSON.parse(scripts[1]);
    console.log('Props keys:', Object.keys(j.props || {}));
    console.log('PageProps keys:', Object.keys(j.props?.pageProps || {}));
    if (j.props?.pageProps?.data) {
      console.log('Data keys:', Object.keys(j.props.pageProps.data));
      console.log('Data summoner:', j.props.pageProps.data.summoner);
    }
  } else {
    console.log('No __NEXT_DATA__, searching for champions / games data in scripts...');
    const allScripts = res.body.match(/<script[^>]*>(.*?)<\/script>/gs);
    console.log('Total scripts:', allScripts ? allScripts.length : 0);
    allScripts?.forEach((s, idx) => {
      if (s.includes('champions') || s.includes('most_champions') || s.includes('Caitlyn') || s.includes('games')) {
        console.log(`Script ${idx} length:`, s.length, 'preview:', s.substring(0, 200).replace(/\n/g, ' '));
      }
    });
  }
}

test().catch(console.error);
