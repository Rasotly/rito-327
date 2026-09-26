import React, { useState, useEffect } from 'react';

export default function ValorantGeoAdmin() {
  const [token, setToken] = useState(localStorage.getItem('geovalo_token') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [questions, setQuestions] = useState([]);
  
  // Form states
  const [selectedImage, setSelectedImage] = useState(null);
  const [mapName, setMapName] = useState('');
  const [marker, setMarker] = useState(null); // {x, y}
  const [uploading, setUploading] = useState(false);

  const MAP_OPTIONS = ['Ascent', 'Bind', 'Breeze', 'Corrode', 'Fracture', 'Haven', 'Icebox', 'Lotus', 'Pearl', 'Split', 'Sunset', 'Abyss'];

  useEffect(() => {
    if (token) {
      loadQuestions();
    }
  }, [token]);

  const loadQuestions = () => {
    fetch('http://localhost:8081/geovalo.php?action=get_questions')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setQuestions(json.data);
        }
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('http://localhost:8081/geovalo.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    .then(res => res.json())
    .then(json => {
      if (json.status === 'success') {
        setToken(json.token);
        localStorage.setItem('geovalo_token', json.token);
        setLoginError('');
      } else {
        setLoginError(json.message);
      }
    })
    .catch(() => setLoginError('Sunucuya ulaşılamıyor.'));
  };

  const handleMapClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMarker({ x, y });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedImage || !mapName || !marker) {
      alert("Lütfen resmi, haritayı ve koordinatı (minimap'e tıklayarak) belirleyin.");
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('mapName', mapName);
    formData.append('correctX', marker.x.toFixed(2));
    formData.append('correctY', marker.y.toFixed(2));

    fetch('http://localhost:8081/geovalo.php?action=add_question', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData
    })
    .then(res => res.json())
    .then(json => {
      if (json.status === 'success') {
        alert("Soru başarıyla eklendi!");
        setSelectedImage(null);
        setMapName('');
        setMarker(null);
        loadQuestions();
      } else {
        alert("Hata: " + json.message);
      }
      setUploading(false);
    })
    .catch(() => {
      alert("Yükleme sırasında hata oluştu.");
      setUploading(false);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    
    fetch('http://localhost:8081/geovalo.php?action=delete_question', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(json => {
      if (json.status === 'success') {
        loadQuestions();
      } else {
        alert("Hata: " + json.message);
      }
    });
  };

  function getMapId(name) {
    const ids = {
      'Ascent': '7eaecc1b-4337-bbf6-6ab9-04b8f06b3319',
      'Bind': '2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba',
      'Breeze': '2fb9a4fd-47b8-4e7d-a969-74b4046ebd53',
      'Corrode': '1c18ab1f-420d-0d8b-71d0-77ad3c439115',
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

  if (!token) {
    return (
      <div style={{ color: 'white', maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #333' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#ff4655' }}>GeoValo Admin Girişi</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Admin Şifresi"
            style={{ padding: '0.8rem', backgroundColor: '#222', border: '1px solid #444', color: 'white', borderRadius: '4px' }}
          />
          {loginError && <div style={{ color: '#ff4655' }}>{loginError}</div>}
          <button type="submit" style={{ padding: '0.8rem', backgroundColor: '#ff4655', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ color: 'white', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
        <h2 style={{ color: '#00ff00' }}>GeoValo Yönetim Paneli</h2>
        <button 
          onClick={() => { setToken(''); localStorage.removeItem('geovalo_token'); }}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Çıkış Yap
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Yükleme Formu */}
        <div style={{ flex: '1 1 400px', backgroundColor: '#111', padding: '2rem', borderRadius: '8px', border: '1px solid #333' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#aaa' }}>Yeni Soru Ekle</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>1. Ekran Görüntüsü Seç:</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>2. Harita Seç:</label>
              <select 
                value={mapName}
                onChange={(e) => { setMapName(e.target.value); setMarker(null); }}
                style={{ width: '100%', padding: '0.8rem', backgroundColor: '#222', border: '1px solid #444', color: 'white', borderRadius: '4px' }}
              >
                <option value="">Harita Seçin...</option>
                {MAP_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {mapName && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>3. Minimap Üzerinde Doğru Yeri İşaretle:</label>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1', backgroundColor: '#000', border: '1px solid #444', borderRadius: '4px', overflow: 'hidden' }}>
                  <img 
                    src={`https://media.valorant-api.com/maps/${getMapId(mapName)}/displayicon.png`} 
                    alt={mapName}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'crosshair' }}
                    onClick={handleMapClick}
                  />
                  {marker && (
                    <div style={{
                      position: 'absolute',
                      left: `${marker.x}%`,
                      top: `${marker.y}%`,
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#00ff00',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      border: '2px solid black'
                    }}></div>
                  )}
                </div>
                {marker && <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#00ff00' }}>Koordinat Seçildi: X:{marker.x.toFixed(1)} Y:{marker.y.toFixed(1)}</p>}
              </div>
            )}

            <button 
              type="submit" 
              disabled={uploading || !selectedImage || !mapName || !marker}
              style={{ 
                padding: '1rem', 
                backgroundColor: (uploading || !selectedImage || !mapName || !marker) ? '#555' : '#00ff00', 
                color: 'black', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: (uploading || !selectedImage || !mapName || !marker) ? 'not-allowed' : 'pointer', 
                fontWeight: 'bold',
                marginTop: '1rem'
              }}
            >
              {uploading ? 'Yükleniyor...' : 'Soruyu Kaydet'}
            </button>
          </form>
        </div>

        {/* Sorular Listesi */}
        <div style={{ flex: '1 1 400px' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#aaa' }}>Mevcut Sorular ({questions.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions.length === 0 ? (
              <p style={{ color: '#555' }}>Henüz soru eklenmemiş.</p>
            ) : (
              questions.map(q => (
                <div key={q.id} style={{ display: 'flex', backgroundColor: '#111', padding: '1rem', borderRadius: '8px', border: '1px solid #333', alignItems: 'center', gap: '1rem' }}>
                  <img src={q.wallImage} alt="soru" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#ff4655' }}>{q.mapName}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#aaa' }}>X: {q.correctX} | Y: {q.correctY}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(q.id)}
                    style={{ padding: '0.5rem', backgroundColor: '#ff4655', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Sil
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
