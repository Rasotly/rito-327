const fs = require('fs');

let appJsx = fs.readFileSync('App.jsx', 'utf8');

appJsx = appJsx.replace(
  "{activeTab === 'agents' && <ValorantAgents />}",
  "{activeTab === 'agents' && <ValorantAgents />}\n          {activeTab === 'weapons' && <ValorantWeapons />}"
);

const weaponsData = fs.readFileSync('weapons_data.js', 'utf8');

const weaponsComponent = `
function ValorantWeapons() {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  
  const categories = ['Tümü', 'Beylik Silahlar', 'Hafif Makineli', 'Pompalı', 'Taarruz Tüfeği', 'Keskin Nişancı', 'Ağır Silah', 'Yakın Dövüş'];
  
  const filteredWeapons = activeCategory === 'Tümü' 
    ? OFFICIAL_WEAPONS 
    : OFFICIAL_WEAPONS.filter(w => w.category === activeCategory);

  return (
    <div className="weapons-section-container">
      <h3 className="weapons-header">KOLEKSİYON (SİLAHLAR)</h3>
      
      <div className="weapon-categories">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={\`category-btn \${activeCategory === cat ? 'active' : ''}\`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="weapons-grid">
        {filteredWeapons.map(weapon => (
          <div key={weapon.name} className="weapon-card">
            <div className="weapon-cost">
              {weapon.cost > 0 && <span>¤ {weapon.cost}</span>}
            </div>
            <div className="weapon-image-wrapper">
              <img src={weapon.image} alt={weapon.name} className="weapon-image" />
            </div>
            <div className="weapon-info">
              <h4>{weapon.name}</h4>
              <span>{weapon.category}</span>
            </div>
            {weapon.stats && (
              <div className="weapon-stats">
                <div className="stat-row"><span>Atış Hızı:</span> <span>{weapon.stats.fireRate}</span></div>
                <div className="stat-row"><span>Şarjör:</span> <span>{weapon.stats.magazineSize}</span></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
`;

appJsx = appJsx.replace('export default App;', weaponsData + '\n' + weaponsComponent + '\nexport default App;');

fs.writeFileSync('App.jsx', appJsx);
console.log('App.jsx successfully updated with weapons!');
