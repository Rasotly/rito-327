const fs = require('fs');

const skillCostsMapping = {
  "Sage": { "Ability1": 400, "Ability2": 200 },
  "Reyna": { "Ability2": 250, "Ability1": 200 },
  "Raze": { "Ability1": 300, "Ability2": 200 },
  "Killjoy": { "Ability1": 200, "Grenade": 250 },
  "Cypher": { "Ability1": 200, "Ability2": 100 },
  "Sova": { "Ability1": 400, "Ability2": 150 },
  "Jett": { "Ability1": 150, "Grenade": 200 },
  "Omen": { "Ability1": 250, "Ability2": 100 },
  "Viper": { "Ability1": 300, "Ability2": 200 },
  "Phoenix": { "Ability1": 250, "Ability2": 200 }
};

fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=tr-TR')
  .then(r => r.json())
  .then(d => {
    const gameSkills = [];

    d.data.forEach(agent => {
      // Find original english name roughly, or map by ID. But displayName is localized!
      // Let's rely on mapping by English name (since they are mostly identical except maybe a few, but Sage, Reyna, etc. are the same)
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

    fs.writeFileSync('game_skills_data.js', 'const GAME_SKILLS = ' + JSON.stringify(gameSkills, null, 2) + ';\n\n');
    console.log("Game skills data written!");
  });
