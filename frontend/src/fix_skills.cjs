const fs = require('fs');

const skillCostsMapping = {
  "SAGE": { "Ability1": 400, "Ability2": 200 },
  "REYNA": { "Ability2": 250, "Ability1": 200 },
  "RAZE": { "Ability1": 300, "Ability2": 200 },
  "KILLJOY": { "Ability1": 200, "Grenade": 250 },
  "CYPHER": { "Ability1": 200, "Ability2": 100 },
  "SOVA": { "Ability1": 400, "Ability2": 150 },
  "JETT": { "Ability1": 150, "Grenade": 200 },
  "OMEN": { "Ability1": 250, "Ability2": 100 },
  "VIPER": { "Ability1": 300, "Ability2": 200 },
  "PHOENIX": { "Ability1": 250, "Ability2": 200 }
};

fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=tr-TR')
  .then(r => r.json())
  .then(d => {
    const gameSkills = [];

    d.data.forEach(agent => {
      const agentName = agent.displayName;
      
      if (skillCostsMapping[agentName]) {
        agent.abilities.forEach(ab => {
          const cost = skillCostsMapping[agentName][ab.slot];
          if (cost !== undefined && ab.displayIcon) {
            gameSkills.push({
              name: ab.displayName,
              agentName: agentName,
              image: ab.displayIcon,
              cost: cost
            });
          }
        });
      }
    });

    let appJsx = fs.readFileSync('App.jsx', 'utf8');
    appJsx = appJsx.replace('const GAME_SKILLS = [];', 'const GAME_SKILLS = ' + JSON.stringify(gameSkills, null, 2) + ';');
    fs.writeFileSync('App.jsx', appJsx);
    console.log("App.jsx fixed!");
  });
