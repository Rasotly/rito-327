const fs = require('fs');

// --- 1. UPDATE Sidebar.jsx ---
let sidebar = fs.readFileSync('Sidebar.jsx', 'utf8');

const gameIconCode = `
const GameIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect>
    <line x1="6" y1="12" x2="10" y2="12"></line>
    <line x1="8" y1="10" x2="8" y2="14"></line>
    <line x1="15" y1="13" x2="15.01" y2="13"></line>
    <line x1="18" y1="11" x2="18.01" y2="11"></line>
  </svg>
);
`;

sidebar = sidebar.replace('const NAV_ITEMS = [', gameIconCode + '\nconst NAV_ITEMS = [');
sidebar = sidebar.replace(
  "{ id: 'maps', label: 'Haritalar', icon: <MapIcon /> },",
  "{ id: 'maps', label: 'Haritalar', icon: <MapIcon /> },\n  { id: 'game', label: 'Mini Oyun', icon: <GameIcon /> },"
);

fs.writeFileSync('Sidebar.jsx', sidebar);


// --- 2. UPDATE App.jsx ---
let appJsx = fs.readFileSync('App.jsx', 'utf8');

appJsx = appJsx.replace(
  "{activeTab === 'weapons' && <ValorantWeapons />}",
  "{activeTab === 'weapons' && <ValorantWeapons />}\n          {activeTab === 'game' && <ValorantGame />}"
);

const gameComponent = `
function ValorantGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('valHighScore') || '0'));
  
  const playableWeapons = OFFICIAL_WEAPONS.filter(w => w.cost > 0);
  
  const getRandomWeapon = (excludeWeapon) => {
      let w;
      do {
          w = playableWeapons[Math.floor(Math.random() * playableWeapons.length)];
      } while (excludeWeapon && (w.name === excludeWeapon.name || w.cost === excludeWeapon.cost));
      return w;
  };

  const [weaponA, setWeaponA] = useState(getRandomWeapon(null));
  const [weaponB, setWeaponB] = useState(getRandomWeapon(weaponA));
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleGuess = (guessHigher) => {
      const isHigher = weaponB.cost > weaponA.cost;
      const correct = (guessHigher && isHigher) || (!guessHigher && !isHigher);
      
      if (correct) {
          setFeedback('correct');
          setScore(s => s + 1);
          setTimeout(() => {
              setWeaponA(weaponB);
              setWeaponB(getRandomWeapon(weaponB));
              setFeedback(null);
          }, 1500);
      } else {
          setFeedback('wrong');
          if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('valHighScore', score);
          }
          setTimeout(() => {
              setGameOver(true);
          }, 2000);
      }
  };

  const restartGame = () => {
      setScore(0);
      setGameOver(false);
      setFeedback(null);
      const wA = getRandomWeapon(null);
      setWeaponA(wA);
      setWeaponB(getRandomWeapon(wA));
  };

  if (gameOver) {
      return (
          <div className="game-container game-over-container">
              <h2 style={{fontSize: '5rem', color: 'var(--valorant-red)', fontFamily: "'Teko', sans-serif"}}>OYUN BİTTİ</h2>
              <p style={{fontSize: '2rem'}}>Skorun: {score}</p>
              <p style={{fontSize: '1.5rem', color: 'var(--text-secondary)'}}>En Yüksek Skor: {highScore}</p>
              <button onClick={restartGame} className="category-btn active" style={{marginTop: '2rem', padding: '1rem 3rem', fontSize: '1.5rem'}}>Tekrar Oyna</button>
          </div>
      );
  }

  return (
      <div className="game-container">
          <div className="game-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h3 style={{fontFamily: "'Teko', sans-serif", fontSize: '3rem', margin: 0}}>HANGİ SİLAH DAHA PAHALI?</h3>
              <div className="game-score" style={{fontSize: '1.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1.5rem', borderRadius: '50px'}}>Skor: {score} | Yüksek: {highScore}</div>
          </div>
          
          <div className="game-arena">
              <div className="game-card-half">
                  <div className="game-card-content">
                      <img src={weaponA.image} alt={weaponA.name} className="game-img" />
                      <h2>{weaponA.name}</h2>
                      <p className="price">¤ {weaponA.cost}</p>
                  </div>
              </div>
              
              <div className="vs-circle">VS</div>
              
              <div className={\`game-card-half \${feedback === 'correct' ? 'correct-bg' : feedback === 'wrong' ? 'wrong-bg' : ''}\`}>
                  <div className="game-card-content">
                      <img src={weaponB.image} alt={weaponB.name} className="game-img" />
                      <h2>{weaponB.name}</h2>
                      
                      {feedback ? (
                          <p className={\`price \${feedback === 'correct' ? 'text-green' : 'text-red'}\`}>¤ {weaponB.cost}</p>
                      ) : (
                          <div className="guess-buttons">
                              <button onClick={() => handleGuess(true)} className="btn-higher">▲ Daha Pahalı</button>
                              <button onClick={() => handleGuess(false)} className="btn-lower">▼ Daha Ucuz</button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
  );
}
`;

appJsx = appJsx.replace('export default App;', gameComponent + '\nexport default App;');
fs.writeFileSync('App.jsx', appJsx);

// --- 3. UPDATE index.css ---
let css = fs.readFileSync('index.css', 'utf8');

const gameCss = `
/* GAME MODULE CSS */
.game-container {
  animation: fadeIn 0.5s ease-out;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.game-arena {
  display: flex;
  position: relative;
  gap: 2rem;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.game-card-half {
  flex: 1;
  height: 100%;
  min-height: 400px;
  background: rgba(17, 17, 17, 0.6);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: all 0.5s ease;
}

.correct-bg {
  background: rgba(46, 204, 113, 0.2);
  border-color: #2ecc71;
  box-shadow: 0 0 30px rgba(46, 204, 113, 0.4);
}

.wrong-bg {
  background: rgba(231, 76, 60, 0.2);
  border-color: #e74c3c;
  box-shadow: 0 0 30px rgba(231, 76, 60, 0.4);
}

.game-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  width: 100%;
}

.game-img {
  width: 80%;
  max-width: 400px;
  max-height: 150px;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
  margin-bottom: 2rem;
}

.game-card-content h2 {
  font-family: 'Teko', sans-serif;
  font-size: 4rem;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 2px;
}

.price {
  font-family: 'Teko', sans-serif;
  font-size: 3.5rem;
  color: #f1c40f;
  margin: 0;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.text-green { color: #2ecc71; }
.text-red { color: #e74c3c; }

.vs-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: var(--valorant-red);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Teko', sans-serif;
  font-size: 2.5rem;
  z-index: 10;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  border: 4px solid #111;
}

.guess-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.guess-buttons button {
  padding: 1rem 3rem;
  font-family: 'Teko', sans-serif;
  font-size: 2rem;
  text-transform: uppercase;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #fff;
}

.btn-higher {
  background: transparent;
  border: 2px solid #fff !important;
}
.btn-higher:hover {
  background: #fff;
  color: #000;
  transform: translateY(-5px);
}

.btn-lower {
  background: transparent;
  border: 2px solid var(--text-secondary) !important;
  color: var(--text-secondary);
}
.btn-lower:hover {
  background: var(--text-secondary);
  color: #111;
  transform: translateY(5px);
}

.game-over-container {
  align-items: center;
  justify-content: center;
  text-align: center;
}

@keyframes popIn {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
`;

fs.writeFileSync('index.css', css + '\n' + gameCss);
console.log('Game implementation complete!');
