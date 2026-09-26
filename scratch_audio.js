const https = require('https');

https.get('https://vlr-guessr.pages.dev/ace', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const regex = /src="(\/assets\/index-[^"]+\.js)"/g;
    const match = regex.exec(data);
    if(match) {
      https.get('https://vlr-guessr.pages.dev' + match[1], (r) => {
        let js = '';
        r.on('data', c => js += c);
        r.on('end', () => {
          const audioMatches = js.match(/https?:\/\/[^"]+\.mp3/g);
          // Look for an array of sounds mapped to names
          // We can also try to find the full mapping
          console.log(audioMatches ? audioMatches.length : 0, "mp3 links found");
          
          if (audioMatches && audioMatches.length > 0) {
              const fs = require('fs');
              fs.writeFileSync('vlr_sounds.json', JSON.stringify(audioMatches, null, 2));
              console.log("Written to vlr_sounds.json");
          }
        });
      });
    } else {
      console.log('no match');
    }
  });
});
