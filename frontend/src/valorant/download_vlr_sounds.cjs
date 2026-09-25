const fs = require('fs');
const path = require('path');
const https = require('https');

async function downloadAudio(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log("Fetching root HTML...");
  const htmlRes = await fetch('https://vlr-guessr.pages.dev/');
  const html = await htmlRes.text();

  const jsMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  if (!jsMatch) {
    console.error("Could not find JS bundle in HTML.");
    return;
  }
  
  const jsUrl = 'https://vlr-guessr.pages.dev' + jsMatch[1];
  console.log(`Fetching JS bundle: ${jsUrl}...`);
  const jsRes = await fetch(jsUrl);
  const jsText = await jsRes.text();

  const index = jsText.indexOf('JSON.parse(`[');
  if (index === -1) {
    console.error("Could not find agents JSON in JS bundle.");
    return;
  }

  const startIndex = index + 'JSON.parse(`'.length;
  const endIndex = jsText.indexOf(']`)', startIndex) + 1;
  const jsonString = jsText.substring(startIndex, endIndex);

  // Safely parse it
  const unescapedString = new Function('return `' + jsonString + '`')();
  const agents = JSON.parse(unescapedString);

  console.log(`Found ${agents.length} agents. Beginning download...`);
  
  const baseDir = path.join(__dirname, '..', '..', 'public', 'valorant', 'abilities');
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  let totalAbilities = 0;
  let downloadedAbilities = 0;

  for (const agent of agents) {
    for (const ability of agent.abilities) {
      totalAbilities++;
    }
  }

  for (const agent of agents) {
    const agentDir = path.join(baseDir, agent.name);
    if (!fs.existsSync(agentDir)) {
      fs.mkdirSync(agentDir, { recursive: true });
    }

    for (const ability of agent.abilities) {
      const url = `https://vlr-guessr.pages.dev/abilities/${agent.id}/${ability.id}.wav`;
      const fileName = `${ability.slot.toLowerCase()}.wav`;
      const filePath = path.join(agentDir, fileName);

      if (!fs.existsSync(filePath)) {
        try {
          await downloadAudio(url, filePath);
          downloadedAbilities++;
          console.log(`[${downloadedAbilities}/${totalAbilities}] Downloaded: ${agent.name} - ${ability.slot}`);
        } catch (err) {
          console.error(`Failed to download ${agent.name} - ${ability.slot}: ${err.message}`);
        }
      } else {
        downloadedAbilities++;
        console.log(`[${downloadedAbilities}/${totalAbilities}] Skipped (already exists): ${agent.name} - ${ability.slot}`);
      }
    }
  }

  console.log("All downloads completed!");
}

run();
