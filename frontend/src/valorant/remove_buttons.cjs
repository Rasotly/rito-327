const fs = require('fs');
let code = fs.readFileSync('App.jsx', 'utf8');

// The back buttons were added during the Vufufu menu phase. Now they are separate tabs, so we don't need them.
code = code.split('<button onClick={onBack} className="category-btn active" style={{padding: \\'0.5rem 1rem\\'}}>Geri Dön</button>').join('');

// Clean up the parameter list since we don't need onBack anymore
code = code.replace('function ValorantGame({ onBack }) {', 'function ValorantGame() {');
code = code.replace('function ValorantHeardle({ onBack }) {', 'function ValorantHeardle() {');

fs.writeFileSync('App.jsx', code);
console.log('Removed back buttons!');
