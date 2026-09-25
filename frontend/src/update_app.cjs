const fs = require('fs');
let appJsx = fs.readFileSync('App.jsx', 'utf8');

appJsx = appJsx.replace(
  "{activeTab === 'maps' && <ValorantMaps />}",
  "{activeTab === 'maps' && <ValorantMaps />}\n          {activeTab === 'agents' && <ValorantAgents />}"
);

const agentsData = fs.readFileSync('agents_data.js', 'utf8');

const agentComponent = `
function ValorantAgents() {
  return (
    <div className="maps-section-container">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--valorant-red)', fontSize: '2rem', fontFamily: "'Teko', sans-serif" }}>Ajanlar</h3>
      <div className="maps-grid">
        {[...OFFICIAL_AGENTS].sort((a, b) => a.name.localeCompare(b.name)).map(agent => (
          <div key={agent.name} className="map-card agent-card" style={{ backgroundImage: \`url(\${agent.image})\`, backgroundSize: '150%', backgroundPosition: 'center top', backgroundColor: '#2b1d22' }}>
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
`;

appJsx = appJsx.replace('export default App;', agentsData + '\n' + agentComponent + '\nexport default App;');

fs.writeFileSync('App.jsx', appJsx);
console.log('App.jsx successfully updated with agents!');
