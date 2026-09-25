const fs = require('fs');

let appJsx = fs.readFileSync('App.jsx', 'utf8');

// The file has:
// export default App;
// const OFFICIAL_AGENTS = ...
// function ValorantAgents() { ... }
// export default App;
// Oh wait, in my previous script, I appended it *before* export default App; but actually the script did:
// appJsx.replace('export default App;', agentsData + '\n' + agentComponent + '\nexport default App;');
// So 'const OFFICIAL_AGENTS' is at the bottom before export default App;

// I will split the file by 'const OFFICIAL_AGENTS =' and take the first part.
const parts = appJsx.split('const OFFICIAL_AGENTS =');
if (parts.length < 2) {
  console.log("Could not find OFFICIAL_AGENTS");
  process.exit(1);
}

const baseAppJsx = parts[0];

const agentsData = fs.readFileSync('agents_data_with_abilities.js', 'utf8');

const components = `
function ValorantAgents() {
  const [selectedAgent, setSelectedAgent] = useState(null);

  if (selectedAgent) {
    return (
      <div className="agent-details-container">
        <button className="back-btn" onClick={() => setSelectedAgent(null)} style={{ marginBottom: '2rem' }}>
          <BackArrow /> Geri Dön
        </button>
        
        <div className="agent-details-layout">
          <div className="agent-details-header">
            <h1 className="agent-details-name" style={{ backgroundImage: \`url(\${selectedAgent.background})\` }}>{selectedAgent.name}</h1>
            <p className="agent-details-role">{selectedAgent.role}</p>
            <p className="agent-details-desc">{selectedAgent.description}</p>
          </div>
          
          <div className="agent-abilities-section">
            <h2 className="abilities-title">ÖZEL YETENEKLERİ</h2>
            <div className="abilities-vertical-list">
              {selectedAgent.abilities.filter(a => a.icon).map((ability, index) => (
                <div key={index} className="ability-item">
                  <div className="ability-icon-wrapper">
                    <img src={ability.icon} alt={ability.name} className="ability-icon" />
                  </div>
                  <div className="ability-info">
                    <h4 className="ability-name">{ability.name}</h4>
                    <p className="ability-desc">{ability.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="maps-section-container">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--valorant-red)', fontSize: '2rem', fontFamily: "'Teko', sans-serif" }}>Ajanlar</h3>
      <div className="maps-grid">
        {[...OFFICIAL_AGENTS].sort((a, b) => a.name.localeCompare(b.name)).map(agent => (
          <div key={agent.name} className="map-card agent-card" onClick={() => setSelectedAgent(agent)} style={{ backgroundImage: \`url(\${agent.image})\`, backgroundSize: '150%', backgroundPosition: 'center top', backgroundColor: '#2b1d22' }}>
            <div className="map-card-overlay"></div>
            <div className="map-card-content">
              <h4>{agent.name}</h4>
              <span className="map-location">{agent.role}</span>
              <p>{agent.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
`;

fs.writeFileSync('App.jsx', baseAppJsx + agentsData + components);
console.log('App.jsx updated with Agent Details!');
