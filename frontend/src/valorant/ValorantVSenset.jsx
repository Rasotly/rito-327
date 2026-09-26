import React, { useState, useEffect, useRef, useMemo } from 'react';

// Custom icons
const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const RestartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);
const VolumeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" color="#ddd" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export default function ValorantVSenset({ onBack }) {
  const [bundles, setBundles] = useState([]);
  const [currentBundle, setCurrentBundle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [gameState, setGameState] = useState('playing'); // playing, won, lost
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, currentBundle]);

  // We will use a fallback array of ACE sounds because real ones aren't exposed easily
  const FALLBACK_SOUNDS = [
    { name: 'Kuronami', audio: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_73229b9f71.mp3?filename=gun-gunshot-01-44673.mp3' },
    { name: 'Prime', audio: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_24e2d3bb16.mp3?filename=laser-gun-shot-1-44654.mp3' },
    { name: 'Reaver', audio: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_f558fb606b.mp3?filename=shotgun-firing-3-14483.mp3' },
    { name: 'Elderflame', audio: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_df36db6d7d.mp3?filename=flamethrower-02-44655.mp3' },
    { name: 'Prelude to Chaos', audio: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_65063162b7.mp3?filename=sci-fi-weapon-shot-99464.mp3' },
    { name: 'Araxys', audio: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_73229b9f71.mp3?filename=gun-gunshot-01-44673.mp3' },
    { name: 'Glitchpop', audio: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_24e2d3bb16.mp3?filename=laser-gun-shot-1-44654.mp3' },
    { name: 'Oni', audio: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_f558fb606b.mp3?filename=shotgun-firing-3-14483.mp3' },
  ];

  useEffect(() => {
    // Fetch bundles and skins simultaneously
    Promise.all([
      fetch('https://valorant-api.com/v1/bundles?language=en-US').then(r => r.json()),
      fetch('https://valorant-api.com/v1/weapons/skins?language=en-US').then(r => r.json())
    ])
    .then(([bundlesData, skinsData]) => {
      
      // Filter out unwanted bundles (VCT, no icon, etc)
      const EXCLUDED_BUNDLES = [
        "5 years",
        "arcane",
        "black.market",
        "celestial",
        "combat crafts",
        "doodle buds",
        "holo meridian",
        "ignite",
        "kohaku & matsuba",
        "gravitational uranium neuroblaster",
        "luna",
        "valorant go",
        "wonderstallion",
        "xenohunter",
        "titanmail"
      ];

      let validBundles = bundlesData.data.filter(b => {
        if (!b.displayIcon) return false;
        const name = b.displayName.toLowerCase();
        if (name.includes('vct')) return false;
        if (name.includes(' x ')) return false;
        if (name.includes('team capsule')) return false;
        if (name.includes('esports')) return false;
        if (EXCLUDED_BUNDLES.some(ex => name.includes(ex))) return false;
        return true;
      });

      // Now map bundles to a real sound from the weapons/skins API
      let playableBundles = [];

      validBundles.forEach(bundle => {
        // Find a skin belonging to this bundle that has streamedVideo
        const matchingSkin = skinsData.data.find(skin => 
          skin.displayName.toLowerCase().includes(bundle.displayName.toLowerCase().replace(/ ep \d+/g, '').replace(/ \d+\.0/g, '').trim()) && 
          skin.levels && 
          skin.levels.some(l => l.streamedVideo)
        );

        if (matchingSkin) {
          const videoLevels = matchingSkin.levels.filter(l => l.streamedVideo);
          const bestVideoUrl = videoLevels[videoLevels.length - 1].streamedVideo;
          playableBundles.push({ ...bundle, customAudio: bestVideoUrl });
        }
      });

      // Deduplicate by base name to keep only 1 instance of series like Magepunk 2.0 / Magepunk 3.0
      let uniqueBundlesMap = new Map();
      playableBundles.forEach(bundle => {
        let baseName = bundle.displayName.toLowerCase()
            .replace(/ ep \d+/g, '') // remove Ep 2, Ep 3
            .replace(/ \d+\.0/g, '') // remove 2.0, 3.0
            .replace(/\/\/.*/g, '') // remove // something
            .trim();
            
        if (!uniqueBundlesMap.has(baseName)) {
            uniqueBundlesMap.set(baseName, bundle);
        }
      });
      playableBundles = Array.from(uniqueBundlesMap.values());

      // Sort alphabetically
      playableBundles = playableBundles.sort((a, b) => a.displayName.localeCompare(b.displayName));
      
      setBundles(playableBundles);
      startNewRound(playableBundles);
    })
    .catch(err => console.error(err));
  }, []);

  const startNewRound = (bundleList) => {
    const list = bundleList && bundleList.length > 0 ? bundleList : bundles;
    if (list.length === 0) return;
    
    // Pick a random playable bundle
    const randomBundle = list[Math.floor(Math.random() * list.length)];

    setCurrentBundle(randomBundle);
    setSearchTerm('');
    setGameState('playing');
    setIsPlaying(false);
    setAttempts(3);
    setWrongGuesses([]);
    setCurrentTime(0);
    
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  };

  const handlePlayPause = () => {
    if (!currentBundle || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRestartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleGuess = (bundle) => {
    if (gameState !== 'playing') return;
    if (wrongGuesses.includes(bundle.uuid)) return; // already guessed

    if (bundle.uuid === currentBundle.uuid) {
      setGameState('won');
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      setWrongGuesses([...wrongGuesses, bundle.uuid]);
      if (newAttempts <= 0) {
        setGameState('lost');
      }
    }
  };

  // Filter bundles based on search term
  const filteredBundles = bundles.filter(b => b.displayName.toLowerCase().includes(searchTerm.toLowerCase()));

  // Render dummy waveform (visual only)
  const renderWaveform = () => {
    const bars = 40;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '60px', margin: '2rem auto', justifyContent: 'center' }}>
        {Array.from({ length: bars }).map((_, i) => {
          // Create a realistic-looking fake waveform shape
          const height = isPlaying 
            ? Math.random() * 40 + 10 // dynamic when playing
            : Math.sin(i * 0.3) * 20 + 25; // static shape
          
          return (
            <div 
              key={i} 
              style={{ 
                width: '4px', 
                height: `${height}px`, 
                backgroundColor: i < (currentTime / (audioRef.current?.duration || 1)) * bars ? '#fff' : '#555',
                borderRadius: '2px',
                transition: 'height 0.1s ease'
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', fontWeight: 'bold' }}>Hangi Kaplama Paketi?</h1>
        <p style={{ color: '#ccc', fontSize: '1rem', lineHeight: '1.5', maxWidth: '700px', margin: '0 auto' }}>
          Raunttaki 5. skorundan sonra, her premium kaplama paketine özgü bir seri katil (ace) sesi çalar. <br/>
          Sesi dinleyerek doğru paketi bulmak için 3 hakkın var.
        </p>
      </div>

      {/* Audio Player Area */}
      <div style={{ marginBottom: '2rem' }}>
        {renderWaveform()}
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#aaa', fontWeight: 'bold', fontFamily: 'monospace' }}>
            {currentTime.toFixed(1)}s
          </span>
          <button 
            onClick={handlePlayPause}
            style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
          >
            <div style={{ filter: 'invert(1)' }}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </div>
          </button>
          <button 
            onClick={handleRestartAudio}
            style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
          >
            <RestartIcon />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#333', padding: '0 1rem', height: '40px', borderRadius: '8px' }}>
            <VolumeIcon />
            <input 
              type="range" 
              min="0" max="1" step="0.01" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{ width: '80px', cursor: 'pointer', accentColor: '#ff4655' }}
            />
          </div>
        </div>
        <audio 
            ref={audioRef} 
            src={currentBundle?.customAudio}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)} 
        />
      </div>

      {/* Search and Lives */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#2a2a2a', borderRadius: '8px', padding: '0.5rem 1rem', width: '100%', maxWidth: '400px', border: '1px solid #444' }}>
          <div style={{ marginRight: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <SearchIcon />
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={gameState !== 'playing'}
            style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '1rem', outline: 'none' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ddd', fontWeight: 'bold', marginLeft: '1rem' }}>
            {attempts} <HeartIcon />
          </div>
        </div>
      </div>

      {/* Grid of Bundles or Result */}
      {gameState === 'playing' ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {useMemo(() => filteredBundles.map(bundle => {
            const isWrong = wrongGuesses.includes(bundle.uuid);
            return (
              <div 
                key={bundle.uuid}
                onClick={() => handleGuess(bundle)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: isWrong ? 'not-allowed' : 'pointer',
                  opacity: isWrong ? 0.4 : 1,
                  filter: isWrong ? 'grayscale(100%)' : 'none',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => { if(!isWrong) e.currentTarget.style.transform = 'scale(1.03)'; }}
                onMouseOut={(e) => { if(!isWrong) e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <div style={{ 
                  width: '100%', 
                  aspectRatio: '16/9', 
                  backgroundColor: '#1a1a1a', 
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '0.8rem',
                  border: isWrong ? '2px solid #ff4655' : '1px solid transparent',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  {/* Subtle placeholder icon or text while loading */}
                  <span style={{ position: 'absolute', color: '#333', fontSize: '0.8rem', fontWeight: 'bold' }}>VALORANT</span>
                  
                  <img 
                    src={`https://wsrv.nl/?url=${bundle.displayIcon}&w=300&output=webp`}
                    alt={bundle.displayName} 
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 1 }} 
                  />
                </div>
                <span style={{ fontSize: '0.95rem', color: '#ccc', textAlign: 'center', fontWeight: '500' }}>{bundle.displayName}</span>
              </div>
            );
          }), [filteredBundles, wrongGuesses])}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#1a1a1a', borderRadius: '12px', border: `2px solid ${gameState === 'won' ? '#00ff00' : '#ff4655'}` }}>
            <h2 style={{ color: gameState === 'won' ? '#00ff00' : '#ff4655', fontSize: '2.5rem', margin: '0 0 1rem 0' }}>
                {gameState === 'won' ? 'DOĞRU!' : 'BİLEMEDİN!'}
            </h2>
            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto 1.5rem auto', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <img src={currentBundle ? `https://wsrv.nl/?url=${currentBundle.displayIcon}&w=800&output=webp` : ''} alt={currentBundle?.displayName} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <p style={{ fontSize: '1.5rem', margin: '0 0 2rem 0' }}>Cevap: <strong style={{ color: '#fff' }}>{currentBundle?.displayName}</strong></p>
            <button 
                onClick={() => startNewRound()}
                style={{ padding: '1rem 2.5rem', backgroundColor: '#ddd', color: '#111', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
            >
                Sonraki Sesi Dene
            </button>
        </div>
      )}

    </div>
  );
}
