import { useState, useEffect } from 'react';
import './index.css';

// SVG Icons for generic back arrow
const BackArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

function App() {
  const getHash = () => window.location.hash.replace('#', '') || 'home';
  const [currentModule, setCurrentModule] = useState(getHash());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentModule(getHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (module) => {
    window.location.hash = module;
  };

  return (
    <>
      {currentModule === 'home' && <HomeScreen onSelect={navigateTo} />}
      {currentModule === 'valorant' && <ValorantModule onBack={() => navigateTo('home')} />}
      {currentModule === 'lol' && <LolModule onBack={() => navigateTo('home')} />}
    </>
  );
}

function HomeScreen({ onSelect }) {
  return (
    <div className="home-container">
      <h1 className="home-title">Rito 327</h1>
      <p className="home-subtitle">Lütfen işlem yapmak istediğiniz modülü seçin</p>

      <div className="cards-container">
        <div className="game-card card-val" onClick={() => onSelect('valorant')}>
          <h2>Valorant</h2>
          <p>Taktiksel Nişancı Modülü • Ajanlar, Haritalar ve İstatistikler</p>
        </div>

        <div className="game-card card-lol" onClick={() => onSelect('lol')}>
          <h2>League of Legends</h2>
          <p>MOBA Modülü • Şampiyonlar, Rünler ve Meta Analizi</p>
        </div>
      </div>
    </div>
  );
}

import Sidebar from './Sidebar';

function ValorantModule({ onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Fetch data from PHP backend
    fetch('http://localhost:8081?game=valorant')
      .then(res => {
        if (!res.ok) throw new Error('Sunucu yanıt vermedi');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="module-container val-theme" style={{ paddingLeft: '260px' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <button className="back-btn" onClick={onBack} style={{ position: 'absolute', right: '2rem', top: '2rem' }}>
        <BackArrow /> Merkeze Dön
      </button>

      <div className="content-panel" style={{ marginTop: '2rem' }}>
        <h1 className="header-title">Valorant Protokolü - {activeTab.toUpperCase()}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Ajan veritabanına bağlanılıyor...</p>

        <div className="data-card">
          <div style={{ marginBottom: '1rem' }}>
            <span className={`status-indicator ${error ? 'status-offline' : 'status-online'}`}></span>
            <span>Sistem Durumu: {error ? 'Çevrimdışı' : 'Çevrimiçi'}</span>
          </div>

          {loading && <p>Veriler yükleniyor...</p>}
          {error && <p style={{ color: 'var(--valorant-red)' }}>Bağlantı Hatası: {error}</p>}

          {data && activeTab === 'home' && (
            <div>
              <h3>Sunucu Mesajı</h3>
              <p>{data.message}</p>

              <div className="stat-grid">
                <div className="stat-item">
                  <div className="stat-value">{data.stats.activePlayers}</div>
                  <div className="stat-label">Aktif Oyuncu</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{data.stats.serverStatus}</div>
                  <div className="stat-label">Sunucu</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{data.stats.currentAct}</div>
                  <div className="stat-label">Bölüm</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'maps' && <ValorantMaps />}
        </div>
      </div>
    </div>
  );
}

function LolModule({ onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from PHP backend
    fetch('http://localhost:8081?game=lol')
      .then(res => {
        if (!res.ok) throw new Error('Sunucu yanıt vermedi');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="module-container lol-theme">
      <button className="back-btn" onClick={onBack}>
        <BackArrow /> Geri Dön
      </button>

      <div className="content-panel">
        <h1 className="header-title">Sihirdar Vadisi</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Runeterra arşivi yükleniyor...</p>

        <div className="data-card">
          <div style={{ marginBottom: '1rem' }}>
            <span className={`status-indicator ${error ? 'status-offline' : 'status-online'}`}></span>
            <span>Bağlantı Durumu: {error ? 'Kesildi' : 'Aktif'}</span>
          </div>

          {loading && <p>Veriler yükleniyor...</p>}
          {error && <p style={{ color: 'var(--valorant-red)' }}>Bağlantı Hatası: {error}</p>}

          {data && (
            <div>
              <h3 style={{ color: 'var(--lol-gold)', fontFamily: 'Cinzel, serif' }}>Sistem Mesajı</h3>
              <p>{data.message}</p>

              <div className="stat-grid">
                <div className="stat-item">
                  <div className="stat-value">{data.stats.activeMatches}</div>
                  <div className="stat-label">Aktif Maç</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{data.stats.currentPatch}</div>
                  <div className="stat-label">Yama Versiyonu</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{data.stats.featuredMode}</div>
                  <div className="stat-label">Öne Çıkan Mod</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const OFFICIAL_MAPS = [
  { name: 'Abyss', location: 'Norveç', description: 'Uçurum kenarında, sınırları zorlayan dikey bir harita.' },
  { name: 'Sunset', location: 'Los Angeles, ABD', description: "Geleneksel üç şeritli tasarım ve Gekko'nun memleketi." },
  { name: 'Lotus', location: 'Batı Ghats, Hindistan', description: 'Üç farklı bomba alanına sahip antik bir harabe.' },
  { name: 'Pearl', location: 'Lizbon, Portekiz', description: 'Su altındaki bir şehirde geçen, teleportsuz geniş bir harita.' },
  { name: 'Fracture', location: 'Santa Fe, ABD', description: 'Savunanların ortada, saldıranların dışarıda başladığı H şeklinde harita.' },
  { name: 'Breeze', location: 'Bermuda Şeytan Üçgeni', description: 'Geniş açık alanlar ve uzun görüş mesafeleri sunan tropik bir ada.' },
  { name: 'Icebox', location: 'Bennett Adası, Rusya', description: 'Dikey oynanışa sahip karlı bir tundra haritası.' },
  { name: 'Bind', location: 'Rabat, Fas', description: 'Ortası olmayan, ışınlanma kapılarına sahip çöl haritası.' },
  { name: 'Haven', location: 'Thimphu, Butan', description: 'Üç bomba alanına sahip geleneksel bir manastır haritası.' },
  { name: 'Split', location: 'Tokyo, Japonya', description: 'Dikey halatlara sahip, iki bomba alanlı şehir haritası.' },
  { name: 'Ascent', location: 'Venedik, İtalya', description: 'Kontrol edilebilir kapılara sahip, geniş bir orta alana sahip harita.' }
];

function ValorantMaps() {
  return (
    <div className="maps-section-container">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--valorant-red)', fontSize: '2rem', fontFamily: "'Teko', sans-serif" }}>Resmi Haritalar</h3>
      <div className="maps-grid">
        {OFFICIAL_MAPS.map(map => (
          <div key={map.name} className="map-card">
            <h4>{map.name}</h4>
            <span className="map-location">{map.location}</span>
            <p>{map.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;