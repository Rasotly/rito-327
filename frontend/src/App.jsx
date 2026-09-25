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
          {activeTab === 'agents' && <ValorantAgents />}
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
  { name: 'Abyss', location: 'Norveç', description: 'Uçurum kenarında, sınırları zorlayan dikey bir harita.', image: 'https://media.valorant-api.com/maps/224b0a95-48b9-f703-1bd8-67aca101a61f/listviewicontall.png' },
  { name: 'Sunset', location: 'Los Angeles, ABD', description: "Geleneksel üç şeritli tasarım ve Gekko'nun memleketi.", image: 'https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/listviewicontall.png' },
  { name: 'Lotus', location: 'Batı Ghats, Hindistan', description: 'Üç farklı bomba alanına sahip antik bir harabe.', image: 'https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/listviewicontall.png' },
  { name: 'Pearl', location: 'Lizbon, Portekiz', description: 'Su altındaki bir şehirde geçen, teleportsuz geniş bir harita.', image: 'https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/listviewicontall.png' },
  { name: 'Fracture', location: 'Santa Fe, ABD', description: 'Savunanların ortada, saldıranların dışarıda başladığı H şeklinde harita.', image: 'https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/listviewicontall.png' },
  { name: 'Breeze', location: 'Bermuda Şeytan Üçgeni', description: 'Geniş açık alanlar ve uzun görüş mesafeleri sunan tropik bir ada.', image: 'https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/listviewicontall.png' },
  { name: 'Icebox', location: 'Bennett Adası, Rusya', description: 'Dikey oynanışa sahip karlı bir tundra haritası.', image: 'https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/listviewicontall.png' },
  { name: 'Bind', location: 'Rabat, Fas', description: 'Ortası olmayan, ışınlanma kapılarına sahip çöl haritası.', image: 'https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/listviewicontall.png' },
  { name: 'Haven', location: 'Thimphu, Butan', description: 'Üç bomba alanına sahip geleneksel bir manastır haritası.', image: 'https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/listviewicontall.png' },
  { name: 'Split', location: 'Tokyo, Japonya', description: 'Dikey halatlara sahip, iki bomba alanlı şehir haritası.', image: 'https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/listviewicontall.png' },
  { name: 'Ascent', location: 'Venedik, İtalya', description: 'Kontrol edilebilir kapılara sahip, geniş bir orta alana sahip harita.', image: 'https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/listviewicontall.png' }
];

function ValorantMaps() {
  return (
    <div className="maps-section-container">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--valorant-red)', fontSize: '2rem', fontFamily: "'Teko', sans-serif" }}>Resmi Haritalar</h3>
      <div className="maps-grid">
        {[...OFFICIAL_MAPS].sort((a, b) => a.name.localeCompare(b.name)).map(map => (
          <div key={map.name} className="map-card" style={{ backgroundImage: `url(${map.image})` }}>
            <div className="map-card-overlay"></div>
            <div className="map-card-content">
              <h4>{map.name}</h4>
              <span className="map-location">{map.location}</span>
              <p>{map.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const OFFICIAL_AGENTS = [
  {
    "name": "Gekko",
    "role": "Initiator",
    "description": "Gekko the Angeleno leads a tight-knit crew of calamitous creatures. His buddies bound forward, scattering enemies out of the way, with Gekko chasing them down to regroup and go again.",
    "image": "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/background.png"
  },
  {
    "name": "Fade",
    "role": "Initiator",
    "description": "Turkish bounty hunter Fade unleashes the power of raw nightmare to seize enemy secrets. Attuned with terror itself, she hunts down targets and reveals their deepest fears - before crushing them in the dark.",
    "image": "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/background.png"
  },
  {
    "name": "Breach",
    "role": "Initiator",
    "description": "The bionic Swede Breach fires powerful, targeted kinetic blasts to aggressively clear a path through enemy ground. The damage and disruption he inflicts ensures no fight is ever fair.",
    "image": "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/background.png"
  },
  {
    "name": "Deadlock",
    "role": "Sentinel",
    "description": "Norwegian operative Deadlock deploys an array of cutting-edge nanowire to secure the battlefield from even the most lethal assault. No one escapes her vigilant watch, nor survives her unyielding ferocity.",
    "image": "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/background.png"
  },
  {
    "name": "Tejo",
    "role": "Initiator",
    "description": "A veteran intelligence consultant from Colombia, Tejo’s ballistic guidance system pressures the enemy to relinquish their ground - or their lives. His targeted strikes keep opponents off balance and under his heel.",
    "image": "https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/background.png"
  },
  {
    "name": "Raze",
    "role": "Duelist",
    "description": "Raze explodes out of Brazil with her big personality and big guns. With her blunt-force-trauma playstyle, she excels at flushing entrenched enemies and clearing tight spaces with a generous dose of \"boom.\"",
    "image": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/background.png"
  },
  {
    "name": "Chamber",
    "role": "Sentinel",
    "description": "Well-dressed and well-armed, French weapons designer Chamber expels aggressors with deadly precision. He leverages his custom arsenal to hold the line and pick off enemies from afar, with a contingency built for every plan.",
    "image": "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/background.png"
  },
  {
    "name": "KAY/O",
    "role": "Initiator",
    "description": "KAY/O is a machine of war built for a single purpose: neutralizing radiants. His power to Suppress enemy abilities dismantles his opponents\\' capacity to fight back, securing him and his allies the ultimate edge.",
    "image": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/background.png"
  },
  {
    "name": "Skye",
    "role": "Initiator",
    "description": "Hailing from Australia, Skye and her band of beasts trailblaze the way through hostile territory. With her creations hampering the enemy, and her power to heal others, the team is strongest and safest by Skye\\'s side.",
    "image": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/background.png"
  },
  {
    "name": "Cypher",
    "role": "Sentinel",
    "description": "The Moroccan information broker, Cypher is a one-man surveillance network who keeps tabs on the enemy\\'s every move. No secret is safe. No maneuver goes unseen. Cypher is always watching.",
    "image": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/background.png"
  },
  {
    "name": "Sova",
    "role": "Initiator",
    "description": "Born from the eternal winter of Russia\\'s tundra, Sova tracks, finds, and eliminates enemies with ruthless efficiency and precision. His custom bow and incredible scouting abilities ensure that even if you run, you cannot hide. ",
    "image": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/background.png"
  },
  {
    "name": "Miks",
    "role": "Controller",
    "description": "Straight from Croatia, Miks takes the stage channeling pure sound energy. With his infectious passion and sonic powers, he rallies his squad to move as one as they set the tempo on the battlefield together.",
    "image": "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/background.png"
  },
  {
    "name": "Killjoy",
    "role": "Sentinel",
    "description": "The genius of Germany, Killjoy effortlessly secures key battlefield positions with her arsenal of inventions. If their damage doesn\\'t take her enemies out, the debuff her robots provide will make short work of them.",
    "image": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/background.png"
  },
  {
    "name": "Harbor",
    "role": "Controller",
    "description": "Hailing from India’s coast, Harbor storms the field wielding ancient technology with dominion over water. He unleashes frothing rapids and crushing waves to shield his allies, or pummel those that oppose him.",
    "image": "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/background.png"
  },
  {
    "name": "Vyse",
    "role": "Sentinel",
    "description": "Metallic mastermind Vyse unleashes liquid metal to isolate, trap, and disarm her enemies. Through cunning and manipulation, she forces all who oppose her to fear the battlefield itself.",
    "image": "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/background.png"
  },
  {
    "name": "Viper",
    "role": "Controller",
    "description": "The American Chemist, Viper deploys an array of poisonous chemical devices to control the battlefield and choke the enemy\\'s vision. If the toxins don\\'t kill her prey, her mindgames surely will.",
    "image": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/background.png"
  },
  {
    "name": "Phoenix",
    "role": "Duelist",
    "description": "Hailing from the U.K., Phoenix\\'s star power shines through in his fighting style, igniting the battlefield with flash and flare. Whether he\\'s got backup or not, he\\'s rushing in to fight on his own terms.",
    "image": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/background.png"
  },
  {
    "name": "Veto",
    "role": "Sentinel",
    "description": "Empowered by an unstoppable DNA mutation, Senegalese enforcer Veto defies the rules of engagement by nullifying his opponent\\'s powers and technology. On Veto\\'s battlefield, gunplay is your only guarantee.",
    "image": "https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/background.png"
  },
  {
    "name": "Astra",
    "role": "Controller",
    "description": "Ghanaian Agent Astra harnesses the energies of the cosmos to reshape battlefields to her whim. With full command of her astral form and a talent for deep strategic foresight, she\\'s always eons ahead of her enemy\\'s next move.",
    "image": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/background.png"
  },
  {
    "name": "Brimstone",
    "role": "Controller",
    "description": "Joining from the U.S.A., Brimstone\\'s orbital arsenal ensures his squad always has the advantage. His ability to deliver utility precisely and safely make him the unmatched boots-on-the-ground commander.",
    "image": "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/background.png"
  },
  {
    "name": "Iso",
    "role": "Duelist",
    "description": "Chinese fixer for hire Iso falls into a flow state to dismantle the opposition. Reconfiguring ambient energy into bulletproof protection, he advances with focus towards his next duel to the death.",
    "image": "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/background.png"
  },
  {
    "name": "Clove",
    "role": "Controller",
    "description": "Scottish troublemaker Clove makes mischief for enemies in both the heat of combat and the cold of death. The young immortal keeps foes guessing, even from beyond the grave, their return to the living only ever a moment away.",
    "image": "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/background.png"
  },
  {
    "name": "Neon",
    "role": "Duelist",
    "description": "Filipino Agent Neon surges forward at shocking speeds, discharging bursts of bioelectric radiance as fast as her body generates it. She races ahead to catch enemies off guard then strikes them down quicker than lightning.",
    "image": "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/background.png"
  },
  {
    "name": "Yoru",
    "role": "Duelist",
    "description": "Japanese native Yoru rips holes straight through reality to infiltrate enemy lines unseen. Using deception and aggression in equal measure, he gets the drop on each target before they know where to look.",
    "image": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/background.png"
  },
  {
    "name": "Waylay",
    "role": "Duelist",
    "description": "Thailand\\'s prismatic radiant Waylay transforms into light itself as she darts across the battlefield, striking down her targets through shards of light before flitting back to safety, all in the blink of an eye.",
    "image": "https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/background.png"
  },
  {
    "name": "Sage",
    "role": "Sentinel",
    "description": "The bastion of China, Sage creates safety for herself and her team wherever she goes. Able to revive fallen friends and stave off forceful assaults, she provides a calm center to a hellish battlefield.",
    "image": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/background.png"
  },
  {
    "name": "Reyna",
    "role": "Duelist",
    "description": "Forged in the heart of Mexico, Reyna dominates single combat, popping off with each kill she scores. Her capability is only limited by her raw skill, making her sharply dependent on performance. ",
    "image": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/background.png"
  },
  {
    "name": "Omen",
    "role": "Controller",
    "description": "A phantom of a memory, Omen hunts in the shadows. He renders enemies blind, teleports across the field, then lets paranoia take hold as his foe scrambles to uncover where he might strike next.",
    "image": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/background.png"
  },
  {
    "name": "Jett",
    "role": "Duelist",
    "description": "Representing her home country of South Korea, Jett\\'s agile and evasive fighting style lets her take risks no one else can. She runs circles around every skirmish, cutting enemies up before they even know what hit them.",
    "image": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/background.png"
  }
];



function ValorantAgents() {
  return (
    <div className="maps-section-container">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--valorant-red)', fontSize: '2rem', fontFamily: "'Teko', sans-serif" }}>Ajanlar</h3>
      <div className="maps-grid">
        {[...OFFICIAL_AGENTS].sort((a, b) => a.name.localeCompare(b.name)).map(agent => (
          <div key={agent.name} className="map-card agent-card" style={{ backgroundImage: `url(${agent.image})`, backgroundSize: '150%', backgroundPosition: 'center top', backgroundColor: '#2b1d22' }}>
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

export default App;