const fs = require('fs');
fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
  .then(r => r.json())
  .then(d => {
    const res = d.data.map(x => ({
      name: x.displayName,
      role: x.role.displayName,
      description: x.description.replace(/'/g, "\\'"),
      image: x.fullPortrait,
      background: x.background
    }));
    fs.writeFileSync('agents_data.js', 'const OFFICIAL_AGENTS = ' + JSON.stringify(res, null, 2) + ';\n\n');
    console.log("Agents data written to agents_data.js");
  });
