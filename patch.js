const fs = require('fs');
const filepath = 'c:\\Users\\seker\\OneDrive\\Masaüstü\\rito-327\\frontend\\src\\valorant\\ValorantModule.jsx';
let content = fs.readFileSync(filepath, 'utf8');

const target =               <div style={{textAlign: 'center', marginBottom: '3rem'}}>
                  <h1 style={{fontFamily: \"'Teko', sans-serif\", fontSize: '4rem', marginBottom: '1rem', letterSpacing: '1px'}}>What's The Ability?</h1>
                  <p style={{color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6'}}>
                      Each agent in the game has 4 unique abilities that produce distinct sounds. You have 3 attempts to find the ability that matches the sound.
                  </p>
                  
                  <div style={{marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}>
                      <span style={{color: '#fff', fontWeight: 'bold'}}>Difficulty:</span>
                      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '4px', outline: 'none'}}>
                          <option value="Normal" style={{ background: '#222', color: '#fff' }}>Normal</option>
                          <option value="Hard" style={{ background: '#222', color: '#fff' }}>Hard</option>
                      </select>
                  </div>
              </div>
  
              <div style={{background: 'rgba(17,17,17,0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '3rem'}}>;

const replacement =               <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', fontWeight: 'bold' }}>What's The Ability?</h1>
                  <p style={{ color: '#ccc', fontSize: '1rem', lineHeight: '1.5', maxWidth: '700px', margin: '0 auto' }}>
                      Each agent in the game has 4 unique abilities that produce distinct sounds. <br/>
                      You have 3 attempts to find the ability that matches the sound.
                  </p>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                      <span style={{ fontSize: '0.9rem', color: '#aaa', fontWeight: 'bold', fontFamily: 'monospace' }}>Difficulty:</span>
                      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ background: '#333', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', outline: 'none' }}>
                          <option value="Normal">Normal</option>
                          <option value="Hard">Hard</option>
                      </select>
                  </div>;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('SUCCESS');
} else {
    console.log('TARGET NOT FOUND');
    console.log('Content preview:');
    console.log(content.substring(content.indexOf('What\\'s The Ability') - 100, content.indexOf('What\\'s The Ability') + 500));
}
