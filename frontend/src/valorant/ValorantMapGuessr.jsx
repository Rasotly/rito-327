import React, { useState } from 'react';

const SAMPLE_LOCATIONS = [
  {
    id: 1,
    mapName: 'Ascent',
    wallImage: '/geovalo/ascent_1.jpg',
    correctX: 88, // A Main fıçılarının haritadaki sağ yatay konumu
    correctY: 47, // A Main fıçılarının dikey konumu
  },
  {
    id: 2,
    mapName: 'Abyss',
    wallImage: '/geovalo/abyss_1.jpg', 
    correctX: 50, 
    correctY: 85, 
  }
];

export default function ValorantMapGuessr() {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedMap, setSelectedMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [score, setScore] = useState(0);

  const currentChallenge = SAMPLE_LOCATIONS[currentRound % SAMPLE_LOCATIONS.length];

  const handleMapClick = (e) => {
    if (hasGuessed) return;
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMarker({ x, y });
  };

  const handleGuess = () => {
    if (!selectedMap || !marker) return;
    setHasGuessed(true);
    
    if (selectedMap === currentChallenge.mapName) {
        const dx = marker.x - currentChallenge.correctX;
        const dy = marker.y - currentChallenge.correctY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 5) {
            setScore(s => s + 100);
        } else if (distance < 15) {
            setScore(s => s + 50);
        } else {
            setScore(s => s + 10);
        }
    }
  };

  const nextRound = () => {
    setCurrentRound(r => r + 1);
    setSelectedMap(null);
    setMarker(null);
    setHasGuessed(false);
  };

  const MAP_OPTIONS = ['Ascent', 'Bind', 'Breeze', 'Fracture', 'Haven', 'Icebox', 'Lotus', 'Pearl', 'Split', 'Sunset', 'Abyss'];

  return (
    <div style={{ color: 'white', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: 'var(--valorant-red, #ff4655)', fontSize: '2.5rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Geo-Valo: Harita Bulmaca</h2>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>Zorlu resme bakıp hangi harita olduğunu tahmin et ve haritada yerini işaretle!</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
        <div>Skor: {score}</div>
        <div>Tur: {currentRound + 1}</div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Sol taraf: Gizemli Resim */}
        <div style={{ flex: '1 1 400px' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', borderBottom: '2px solid var(--valorant-red, #ff4655)', paddingBottom: '0.5rem' }}>Bu Neresi?</h3>
          <div style={{ 
            width: '100%', 
            height: '400px', 
            borderRadius: '8px',
            border: '2px solid #333',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            backgroundColor: '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <img 
              src={currentChallenge.wallImage} 
              alt="Gizemli Yer" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{ display: 'none', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
              <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>📷</span>
              <p style={{ color: '#ff4655', fontWeight: 'bold' }}>Resim Bulunamadı!</p>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Lütfen oyun içinden çektiğiniz resmi şu yola kaydedin:</p>
              <code style={{ backgroundColor: '#222', padding: '0.5rem', borderRadius: '4px', marginTop: '0.5rem' }}>
                public{currentChallenge.wallImage}
              </code>
            </div>
          </div>
        </div>

        {/* Sağ taraf: Harita Seçimi ve İşaretleme */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', borderBottom: '2px solid var(--valorant-red, #ff4655)', paddingBottom: '0.5rem' }}>Tahmin Et</h3>
          
          <select 
            value={selectedMap || ''} 
            onChange={(e) => setSelectedMap(e.target.value)}
            disabled={hasGuessed}
            style={{ 
              width: '100%', 
              padding: '0.8rem', 
              marginBottom: '1rem',
              backgroundColor: '#1f2326',
              color: 'white',
              border: '1px solid #333',
              borderRadius: '4px',
              fontSize: '1rem',
              outline: 'none'
            }}
          >
            <option value="">Harita Seçin...</option>
            {MAP_OPTIONS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {selectedMap && (
             <div style={{ position: 'relative', width: '100%', aspectRatio: '1', backgroundColor: '#111', border: '1px solid #333', borderRadius: '4px', overflow: 'hidden' }}>
                <img 
                  src={`https://media.valorant-api.com/maps/${getMapId(selectedMap)}/displayicon.png`} 
                  alt={selectedMap}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: hasGuessed ? 'default' : 'crosshair' }}
                  onClick={handleMapClick}
                />
                
                {/* Kullanıcının İşareti */}
                {marker && (
                  <div style={{
                    position: 'absolute',
                    left: `${marker.x}%`,
                    top: `${marker.y}%`,
                    width: '16px',
                    height: '16px',
                    backgroundColor: 'var(--valorant-red, #ff4655)',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: '2px solid white',
                    boxShadow: '0 0 5px rgba(0,0,0,0.8)'
                  }}></div>
                )}

                {/* Doğru Sonuç (sadece tahmin edildiyse) */}
                {hasGuessed && selectedMap === currentChallenge.mapName && (
                  <div style={{
                    position: 'absolute',
                    left: `${currentChallenge.correctX}%`,
                    top: `${currentChallenge.correctY}%`,
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#00ff00',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: '3px solid black',
                    zIndex: 2
                  }}></div>
                )}
             </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            {!hasGuessed ? (
              <button 
                onClick={handleGuess}
                disabled={!selectedMap || !marker}
                style={{ 
                  flex: 1, 
                  padding: '1rem', 
                  backgroundColor: (!selectedMap || !marker) ? '#555' : 'var(--valorant-red, #ff4655)', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1.1rem',
                  cursor: (!selectedMap || !marker) ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
              >
                Tahmin Et
              </button>
            ) : (
              <button 
                onClick={nextRound}
                style={{ 
                  flex: 1, 
                  padding: '1rem', 
                  backgroundColor: '#00ff00',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Sonraki Tur
              </button>
            )}
          </div>

          {hasGuessed && (
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#1f2326', borderRadius: '4px', borderLeft: `4px solid ${selectedMap === currentChallenge.mapName ? '#00ff00' : '#ff4655'}` }}>
               {selectedMap === currentChallenge.mapName ? (
                 <p style={{ color: '#00ff00', margin: 0, fontWeight: 'bold' }}>Harita doğru! Uzaklık puanlandırıldı.</p>
               ) : (
                 <p style={{ color: 'var(--valorant-red, #ff4655)', margin: 0, fontWeight: 'bold' }}>Yanlış harita! Doğrusu: {currentChallenge.mapName}</p>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getMapId(name) {
  const ids = {
    'Ascent': '7eaecc1b-4337-bbf6-6ab9-04b8f06b3319',
    'Bind': '2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba',
    'Breeze': '2fb9a4fd-47b8-4e7d-a969-74b4046ebd53',
    'Fracture': 'b529448b-4d60-346e-e89e-00a4c527a405',
    'Haven': '2bee0dc9-4ffe-519b-1cbd-7fbe763a6047',
    'Icebox': 'e2ad5c54-4114-a870-9641-8ea21279579a',
    'Lotus': '2fe4ed3a-450a-948b-6d6b-e89a78e680a9',
    'Pearl': 'fd267378-4d1d-484f-ff52-77821ed10dc2',
    'Split': 'd960549e-485c-e861-8d71-aa9d1aed12a2',
    'Sunset': '92584fbe-486a-b1b2-9faa-39b0f486b498',
    'Abyss': '224b0a95-48b9-f703-1bd8-67aca101a61f'
  };
  return ids[name] || '';
}
