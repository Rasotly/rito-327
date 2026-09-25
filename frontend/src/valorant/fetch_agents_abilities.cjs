const fs = require('fs');

fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=tr-TR')
  .then(r => r.json())
  .then(d => {
    const res = d.data.map(x => ({
      name: x.displayName,
      role: x.role ? x.role.displayName : '',
      description: x.description.replace(/'/g, "\\'"),
      image: x.fullPortrait,
      background: x.background,
      abilities: x.abilities.map(a => ({
        slot: a.slot,
        name: a.displayName,
        description: a.description ? a.description.replace(/'/g, "\\'") : '',
        icon: a.displayIcon
      }))
    }));

    fs.writeFileSync('agents_data_with_abilities.js', 'const OFFICIAL_AGENTS = ' + JSON.stringify(res, null, 2) + ';\n\n');
    console.log("Agents data with abilities written!");
  });
