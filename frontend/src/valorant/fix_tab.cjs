const fs = require('fs');
let code = fs.readFileSync('App.jsx', 'utf8');

// Replace VufufuModule with ValorantGame and add ValorantHeardle
code = code.replace(
    "{activeTab === 'game' && <VufufuModule />}", 
    "{activeTab === 'game' && <ValorantGame />}\n          {activeTab === 'heardle' && <ValorantHeardle />}"
);

fs.writeFileSync('App.jsx', code);
console.log('Replaced successfully');
