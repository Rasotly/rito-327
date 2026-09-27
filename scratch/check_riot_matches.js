const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(d));
        } catch(e) {
          resolve(d);
        }
      });
    }).on('error', reject);
  });
}

async function checkMatches() {
  const puuid = 'K0oz48-QYDIrluf71rlnKl5hlGfBkFX1IdPLDnVSM6K7AE44vvKeUcMj_BcecKk3s4pw_qZAgWDg9Q';
  const apiKey = 'RGAPI-f3cbd501-065f-48ae-b55f-7f12a2d732cf';

  let total = 0;
  for (let start = 0; start <= 1000; start += 100) {
    const url = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=100&api_key=${apiKey}`;
    const ids = await get(url);
    if (!Array.isArray(ids)) {
      console.log('Error at start', start, ids);
      break;
    }
    console.log(`Start ${start}: got ${ids.length} matches`);
    total += ids.length;
    if (ids.length < 100) break;
  }
  console.log('TOTAL MATCHES in Riot Match-V5:', total);
}

checkMatches();
