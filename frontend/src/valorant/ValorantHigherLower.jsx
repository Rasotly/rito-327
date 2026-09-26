import React, { useState, useEffect } from 'react';

// Animates a number from 0 to target value
const AnimatedNumber = ({ value, show, duration = 1000 }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!show) {
      setCurrent(0);
      return;
    }
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.floor(easeProgress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrent(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, show, duration]);

  return <span>{show ? current.toLocaleString() : '?'}</span>;
};

export default function ValorantHigherLower({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const [hasGuessed, setHasGuessed] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8081/higherlower.php?action=get_questions')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          // Shuffle the questions array for randomness
          const shuffled = [...json.data].sort(() => Math.random() - 0.5);
          setQuestions(shuffled);
        } else {
          setError(json.message);
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Sunucuya bağlanılamadı.");
        setLoading(false);
      });
  }, []);

  const handleGuess = (guess) => {
    if (hasGuessed || isGameOver) return;
    
    const currentQ = questions[currentIndex];
    const isHigher = currentQ.item2_value >= currentQ.item1_value;
    const isLower = currentQ.item2_value <= currentQ.item1_value;
    
    let isCorrect = false;
    if (guess === 'higher' && isHigher) isCorrect = true;
    if (guess === 'lower' && isLower) isCorrect = true;
    
    setHasGuessed(true);
    
    if (isCorrect) {
      setScore(s => s + 1);
      setResultMessage('Doğru!');
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    } else {
      if (score > highScore) setHighScore(score);
      setResultMessage('Yanlış!');
      setIsGameOver(true);
    }
  };

  const nextQuestion = () => {
    setCurrentIndex((prev) => (prev + 1) % questions.length);
    setHasGuessed(false);
    setResultMessage('');
  };

  const restartGame = () => {
    setScore(0);
    setHasGuessed(false);
    setIsGameOver(false);
    setResultMessage('');
    // Reshuffle for replay
    setQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Veriler Yükleniyor...</div>;
  if (error) return <div style={{ color: '#ff4655', textAlign: 'center', padding: '2rem' }}>Hata: {error}</div>;
  if (questions.length === 0) return <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Henüz hiç soru eklenmemiş! Lütfen Admin panelinden soru ekleyin.</div>;

  const currentQ = questions[currentIndex];

  return (
    <div style={{ color: 'white', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
            <h2 style={{ color: 'var(--valorant-red, #ff4655)', fontSize: '2.5rem', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>Alt mı Üst mü?</h2>
            <p style={{ color: '#aaa', margin: 0 }}>{currentQ.category}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Skor: {score}</div>
            <div style={{ fontSize: '1rem', color: '#aaa' }}>Rekor: {highScore}</div>
        </div>
      </div>

      <div style={{ display: 'flex', position: 'relative', height: '500px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
        
        {/* VS Badge */}
        <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ff4655',
            color: 'white',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            zIndex: 10,
            border: '4px solid #111',
            boxShadow: '0 0 15px rgba(255, 70, 85, 0.5)'
        }}>VS</div>

        {/* Item 1 */}
        <div style={{ flex: 1, backgroundColor: '#1a1a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', position: 'relative' }}>
          <img src={currentQ.item1_image} alt={currentQ.item1_name} style={{ width: '200px', height: '200px', objectFit: 'contain', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }} />
          <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{currentQ.item1_name}</h3>
          <p style={{ fontSize: '1.2rem', color: '#aaa', margin: 0 }}>{currentQ.category}</p>
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#00ff00', marginTop: '1rem' }}>
            {currentQ.item1_value.toLocaleString()}
          </div>
        </div>

        {/* Item 2 */}
        <div style={{ flex: 1, backgroundColor: '#111', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', position: 'relative' }}>
          <img src={currentQ.item2_image} alt={currentQ.item2_name} style={{ width: '200px', height: '200px', objectFit: 'contain', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }} />
          <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{currentQ.item2_name}</h3>
          <p style={{ fontSize: '1.2rem', color: '#aaa', margin: 0 }}>{currentQ.category}</p>
          
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: hasGuessed ? (resultMessage === 'Doğru!' ? '#00ff00' : '#ff4655') : '#fff', marginTop: '1rem', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AnimatedNumber value={currentQ.item2_value} show={hasGuessed} />
          </div>

          {!hasGuessed && !isGameOver && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', width: '100%', maxWidth: '200px' }}>
              <button 
                onClick={() => handleGuess('higher')}
                style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid white', borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              >
                ▲ DAHA YÜKSEK
              </button>
              <button 
                onClick={() => handleGuess('lower')}
                style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid white', borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              >
                ▼ DAHA DÜŞÜK
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem', backgroundColor: '#1a0505', border: '2px solid #ff4655', borderRadius: '8px' }}>
          <h2 style={{ color: '#ff4655', fontSize: '2.5rem', margin: '0 0 1rem 0' }}>YANLIŞ!</h2>
          <p style={{ fontSize: '1.2rem', margin: '0 0 2rem 0' }}>Serin bozuldu. Ulaştığın skor: <strong>{score}</strong></p>
          <button 
            onClick={restartGame}
            style={{ padding: '1rem 3rem', backgroundColor: '#ff4655', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Tekrar Oyna
          </button>
        </div>
      )}
      
      {/* Result feedback */}
      {hasGuessed && !isGameOver && (
         <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <h2 style={{ color: '#00ff00', fontSize: '2rem' }}>✓ DOĞRU TAHMİN!</h2>
         </div>
      )}
    </div>
  );
}
