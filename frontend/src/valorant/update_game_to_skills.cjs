const fs = require('fs');

let appJsx = fs.readFileSync('App.jsx', 'utf8');

const skillsData = fs.readFileSync('game_skills_data.js', 'utf8');

// I will just replace the entire ValorantGame function and append skillsData at the top of it.
// First, extract everything except ValorantGame and what comes after it.
// Since ValorantGame is the last component before export default App;
const parts = appJsx.split('function ValorantGame() {');
if (parts.length < 2) {
  console.log("Could not find ValorantGame");
  process.exit(1);
}

const baseAppJsx = parts[0];

const gameComponent = `
function ValorantGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('valHighScore') || '0'));
  
  const playableSkills = GAME_SKILLS;
  
  const getRandomSkill = (excludeSkill) => {
      let s;
      do {
          s = playableSkills[Math.floor(Math.random() * playableSkills.length)];
      } while (excludeSkill && (s.name === excludeSkill.name || s.cost === excludeSkill.cost));
      return s;
  };

  const [skillA, setSkillA] = useState(getRandomSkill(null));
  const [skillB, setSkillB] = useState(getRandomSkill(skillA));
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleGuess = (guessHigher) => {
      const isHigher = skillB.cost > skillA.cost;
      const correct = (guessHigher && isHigher) || (!guessHigher && !isHigher);
      
      if (correct) {
          setFeedback('correct');
          setScore(s => s + 1);
          setTimeout(() => {
              setSkillA(skillB);
              setSkillB(getRandomSkill(skillB));
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
      const sA = getRandomSkill(null);
      setSkillA(sA);
      setSkillB(getRandomSkill(sA));
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
              <h3 style={{fontFamily: "'Teko', sans-serif", fontSize: '3rem', margin: 0}}>HANGİ YETENEK DAHA PAHALI?</h3>
              <div className="game-score" style={{fontSize: '1.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1.5rem', borderRadius: '50px'}}>Skor: {score} | Yüksek: {highScore}</div>
          </div>
          
          <div className="game-arena">
              <div className="game-card-half">
                  <div className="game-card-content">
                      <img src={skillA.image} alt={skillA.name} className="game-img" style={{filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'}} />
                      <h2>{skillA.name}</h2>
                      <p style={{color: 'var(--text-secondary)', margin: '0 0 1rem 0'}}>{skillA.agentName}</p>
                      <p className="price">¤ {skillA.cost}</p>
                  </div>
              </div>
              
              <div className="vs-circle">VS</div>
              
              <div className={\`game-card-half \${feedback === 'correct' ? 'correct-bg' : feedback === 'wrong' ? 'wrong-bg' : ''}\`}>
                  <div className="game-card-content">
                      <img src={skillB.image} alt={skillB.name} className="game-img" style={{filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'}} />
                      <h2>{skillB.name}</h2>
                      <p style={{color: 'var(--text-secondary)', margin: '0 0 1rem 0'}}>{skillB.agentName}</p>
                      
                      {feedback ? (
                          <p className={\`price \${feedback === 'correct' ? 'text-green' : 'text-red'}\`}>¤ {skillB.cost}</p>
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

export default App;
`;

fs.writeFileSync('App.jsx', baseAppJsx + skillsData + gameComponent);
console.log('App.jsx successfully updated with skills game!');
