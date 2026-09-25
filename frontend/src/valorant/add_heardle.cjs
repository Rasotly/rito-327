const fs = require('fs');

let appJsx = fs.readFileSync('App.jsx', 'utf8');

const heardleDataStr = `
const HEARDLE_DATA = [
    { id: 1, title: "Jett (Rüzgâr Gibi)", url: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg", answer: "Jett" },
    { id: 2, title: "Vandal (Şarjör)", url: "https://actions.google.com/sounds/v1/weapons/laser_gun.ogg", answer: "Vandal" },
    { id: 3, title: "Omen (Paranoya)", url: "https://actions.google.com/sounds/v1/horror/creepy_wind.ogg", answer: "Omen" },
    { id: 4, title: "Ahşap Zemin (Ayak Sesi)", url: "https://actions.google.com/sounds/v1/foley/footsteps_wood_floor.ogg", answer: "Ahşap" }
];

function ValorantHeardle({ onBack }) {
    const [currentSound, setCurrentSound] = useState(HEARDLE_DATA[Math.floor(Math.random() * HEARDLE_DATA.length)]);
    const [guesses, setGuesses] = useState(['', '', '', '', '']);
    const [currentGuessIndex, setCurrentGuessIndex] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
    const audioRef = React.useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playProgress, setPlayProgress] = useState(0);

    const durations = [1, 2, 4, 7, 10]; // seconds allowed per guess
    const maxDuration = durations[Math.min(currentGuessIndex, 4)];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = currentSound.url;
            audioRef.current.load();
        }
    }, [currentSound]);

    const playSegment = () => {
        if (isPlaying || !audioRef.current) return;
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);

        const checkTime = setInterval(() => {
            if (audioRef.current && audioRef.current.currentTime >= maxDuration) {
                audioRef.current.pause();
                setIsPlaying(false);
                clearInterval(checkTime);
            }
            if (audioRef.current) {
                setPlayProgress((audioRef.current.currentTime / 10) * 100);
            }
        }, 50);

        audioRef.current.onended = () => {
            setIsPlaying(false);
            clearInterval(checkTime);
            setPlayProgress(0);
        };
    };

    const handleGuess = () => {
        if (gameStatus !== 'playing' || !inputValue.trim()) return;

        const newGuesses = [...guesses];
        const isCorrect = inputValue.toLowerCase().includes(currentSound.answer.toLowerCase());
        newGuesses[currentGuessIndex] = { text: inputValue, correct: isCorrect };
        setGuesses(newGuesses);
        setInputValue('');

        if (isCorrect) {
            setGameStatus('won');
        } else if (currentGuessIndex >= 4) {
            setGameStatus('lost');
        } else {
            setCurrentGuessIndex(currentGuessIndex + 1);
        }
    };

    const handlePass = () => {
        if (gameStatus !== 'playing') return;
        
        const newGuesses = [...guesses];
        newGuesses[currentGuessIndex] = { text: 'PAS GEÇİLDİ', correct: false };
        setGuesses(newGuesses);
        
        if (currentGuessIndex >= 4) {
            setGameStatus('lost');
        } else {
            setCurrentGuessIndex(currentGuessIndex + 1);
        }
    };

    const restartGame = () => {
        setCurrentSound(HEARDLE_DATA[Math.floor(Math.random() * HEARDLE_DATA.length)]);
        setGuesses(['', '', '', '', '']);
        setCurrentGuessIndex(0);
        setGameStatus('playing');
        setPlayProgress(0);
    };

    return (
        <div className="game-container heardle-container" style={{maxWidth: '800px', margin: '0 auto', width: '100%'}}>
            <div className="game-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <button onClick={onBack} className="category-btn active" style={{padding: '0.5rem 1rem'}}>Geri Dön</button>
                <h3 style={{fontFamily: "'Teko', sans-serif", fontSize: '3rem', margin: 0}}>HEARDLE</h3>
                <div style={{width: '100px'}}></div>
            </div>

            <div style={{background: 'rgba(17,17,17,0.8)', padding: '3rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)'}}>
                
                <div className="music-player" style={{display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem'}}>
                    <button 
                        onClick={playSegment} 
                        disabled={isPlaying}
                        style={{
                            width: '80px', height: '80px', borderRadius: '50%', 
                            background: isPlaying ? 'var(--text-secondary)' : 'var(--valorant-red)',
                            color: '#fff', border: 'none', cursor: isPlaying ? 'default' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
                        }}>
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    
                    <div style={{flex: 1, background: '#333', height: '10px', borderRadius: '5px', overflow: 'hidden'}}>
                        <div style={{width: \`\${playProgress}%\`, height: '100%', background: 'var(--valorant-red)', transition: 'width 0.1s linear'}}></div>
                    </div>
                    <span style={{fontFamily: "'Teko', sans-serif", fontSize: '1.5rem'}}>{maxDuration}sn Dinle</span>
                </div>

                <div className="guesses-list" style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem'}}>
                    {guesses.map((guess, idx) => (
                        <div key={idx} style={{
                            height: '50px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '1.2rem',
                            border: guess.correct === true ? '2px solid #2ecc71' : guess.correct === false ? '2px solid #e74c3c' : '2px solid transparent',
                            color: guess.correct === true ? '#2ecc71' : guess.correct === false ? '#e74c3c' : '#fff'
                        }}>
                            {guess.text || ''}
                        </div>
                    ))}
                </div>

                {gameStatus === 'playing' ? (
                    <div className="guess-input-area" style={{display: 'flex', gap: '1rem'}}>
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleGuess()}
                            placeholder="Ajan, Silah veya Harita tahmini yap..."
                            style={{flex: 1, padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1.2rem'}}
                        />
                        <button onClick={handleGuess} className="category-btn active" style={{padding: '0 2rem'}}>Tahmin Et</button>
                        <button onClick={handlePass} className="category-btn" style={{padding: '0 2rem', background: 'transparent', border: '1px solid var(--text-secondary)'}}>Pas</button>
                    </div>
                ) : (
                    <div style={{textAlign: 'center'}}>
                        <h2 style={{fontFamily: "'Teko', sans-serif", fontSize: '3rem', color: gameStatus === 'won' ? '#2ecc71' : '#e74c3c'}}>
                            {gameStatus === 'won' ? 'KAZANDIN!' : 'KAYBETTİN!'}
                        </h2>
                        <p style={{fontSize: '1.5rem', marginBottom: '2rem'}}>Doğru Cevap: <strong style={{color: 'var(--valorant-red)'}}>{currentSound.answer} ({currentSound.title})</strong></p>
                        <button onClick={restartGame} className="category-btn active" style={{padding: '1rem 3rem'}}>Tekrar Oyna</button>
                    </div>
                )}
            </div>
            <audio ref={audioRef} style={{display: 'none'}} />
        </div>
    );
}

function VufufuModule() {
    const [selectedGame, setSelectedGame] = useState(null);

    if (selectedGame === 'higherlower') {
        return <ValorantGame onBack={() => setSelectedGame(null)} />;
    }
    if (selectedGame === 'heardle') {
        return <ValorantHeardle onBack={() => setSelectedGame(null)} />;
    }

    return (
        <div className="vufufu-menu game-container" style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
            <div style={{textAlign: 'center', background: 'rgba(17,17,17,0.7)', padding: '5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)'}}>
                <h2 style={{fontSize: '5rem', color: 'var(--valorant-red)', fontFamily: "'Teko', sans-serif", marginBottom: '1rem', letterSpacing: '3px'}}>VUFUFU EĞLENCE</h2>
                <p style={{fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '4rem'}}>Valorant yeteneklerini test etmek için bir oyun seç!</p>
                
                <div className="game-cards-container" style={{display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                    <div className="category-btn active" onClick={() => setSelectedGame('higherlower')} style={{padding: '2rem', width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <span style={{fontSize: '3rem'}}>💰</span>
                        <h3 style={{fontFamily: "'Teko', sans-serif", fontSize: '2rem', margin: 0}}>HANGİSİ DAHA PAHALI?</h3>
                        <p style={{fontSize: '1rem', margin: 0, opacity: 0.8, whiteSpace: 'normal', textTransform: 'none'}}>Yetenek fiyatlarını karşılaştırarak en uzun seriyi yapmaya çalış.</p>
                    </div>
                    
                    <div className="category-btn" onClick={() => setSelectedGame('heardle')} style={{padding: '2rem', width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.05)', color: '#fff'}}>
                        <span style={{fontSize: '3rem'}}>🎵</span>
                        <h3 style={{fontFamily: "'Teko', sans-serif", fontSize: '2rem', margin: 0}}>HEARDLE</h3>
                        <p style={{fontSize: '1rem', margin: 0, opacity: 0.8, whiteSpace: 'normal', textTransform: 'none'}}>Sadece sese odaklan. Kimin veya neyin sesi olduğunu tahmin et.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
`;

appJsx = appJsx.replace('function ValorantGame() {', 'function ValorantGame({ onBack }) {');
appJsx = appJsx.replace(
    '<div className="game-header" style={{display: \'flex\', justifyContent: \'space-between\', alignItems: \'center\', marginBottom: \'2rem\', flexWrap: \'wrap\', gap: \'1rem\'}}>',
    '<div className="game-header" style={{display: \'flex\', justifyContent: \'space-between\', alignItems: \'center\', marginBottom: \'2rem\', flexWrap: \'wrap\', gap: \'1rem\'}}>\n              <button onClick={onBack} className="category-btn active" style={{padding: \'0.5rem 1rem\'}}>Geri Dön</button>'
);

appJsx = appJsx.replace('{activeTab === \'game\' && <ValorantGame />}', '{activeTab === \'game\' && <VufufuModule />}');

appJsx = appJsx.replace('export default App;', heardleDataStr + '\\nexport default App;');

fs.writeFileSync('App.jsx', appJsx);
console.log('Successfully injected Vufufu Heardle game!');
