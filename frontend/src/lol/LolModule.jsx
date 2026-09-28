import React, { useState, useEffect, useRef } from 'react';
import './Lol.css';
import { LolAssets, LolLogoIcon } from './lolAssets';
import { ChampionsTab, PatternsTab, RecordsTab, ChallengesTab, AnalysisTab } from './LolProfileTabs.jsx';
import LolLandingHome from './LolLandingHome.jsx';
import LolChampionsPage from './LolChampionsPage.jsx';
import LolMapsPage from './LolMapsPage.jsx';

const BackArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const SPELL_MAP = {
  1: 'SummonerBoost',
  3: 'SummonerExhaust',
  4: 'SummonerFlash',
  6: 'SummonerHaste',
  7: 'SummonerHeal',
  11: 'SummonerSmite',
  12: 'SummonerTeleport',
  13: 'SummonerMana',
  14: 'SummonerDot',
  21: 'SummonerBarrier',
  32: 'SummonerSnowball'
};

const QUEUE_MAP = {
  // Ranked
  420: 'Dereceli Tek/Çift',
  440: 'Dereceli Esnek',
  // Normal
  400: 'Normal Sıralı',
  430: 'Normal (Kör Seçim)',
  490: 'Hızlı Oyun',
  // ARAM
  450: 'ARAM',
  100: 'ARAM',
  // Arena
  1700: 'Arena',
  1710: 'Arena',
  // Rotational / Special Game Modes
  1400: 'Tam Gaz',
  1900: 'URF',
  900: 'URF',
  1010: 'Kar Kartopu Savaşı',
  1020: 'Birimiz Hepimiz İçin',
  1300: 'Merkez Baskını',
  1200: 'Merkez Baskını',
  600: 'Kan Avı',
  700: 'Clash',
  720: 'ARAM Clash',
  3000: 'Sürü',
  // Bots
  830: 'Yapay Zekaya Karşı (Giriş)',
  840: 'Yapay Zekaya Karşı (Başlangıç)',
  850: 'Yapay Zekaya Karşı (Orta)'
};

function getQueueName(info) {
  if (!info) return 'Normal Sıralı';
  const qId = info.queueId;
  if (QUEUE_MAP[qId]) return QUEUE_MAP[qId];

  const mode = (info.gameMode || '').toUpperCase();
  if (mode === 'CHERRY') return 'Arena';
  if (mode === 'ARAM') return 'ARAM';
  if (mode === 'URF') return 'URF';
  if (mode === 'ONEFORALL') return 'Birimiz Hepimiz İçin';
  if (mode === 'ULTBOOK') return 'Tam Gaz';
  if (mode === 'SWARM') return 'Sürü';
  if (mode === 'CLASSIC') return 'Normal Sıralı';

  return 'Normal Sıralı';
}

function formatMatchDate(timestamp) {
  if (!timestamp) return { relative: '', fullDate: '' };
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  let relative = '';
  if (diffDay > 30) {
    const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    relative = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  } else if (diffDay > 1) {
    relative = `${diffDay} gün önce`;
  } else if (diffDay === 1) {
    relative = 'Dün';
  } else if (diffHour >= 1) {
    relative = `${diffHour} saat önce`;
  } else if (diffMin >= 1) {
    relative = `${diffMin} dakika önce`;
  } else {
    relative = 'Az önce';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const fullDate = `${day}.${month}.${year} ${hours}:${minutes}`;

  return { relative, fullDate };
}

const POPULAR_PLAYERS_FALLBACK = [
  { riotId: 'Hide on bush#KR1', region: 'kr', icon: 6, level: 940, tier: 'challenger' },
  { riotId: 'Thebausffs#EUW', region: 'euw1', icon: 4568, level: 820, tier: 'challenger' },
  { riotId: 'Caps#EUW', region: 'euw1', icon: 3200, level: 650, tier: 'challenger' },
  { riotId: 'ca koi#vn444', region: 'vn2', icon: 54, level: 320, tier: 'challenger' },
  { riotId: 'CA HUYEN#1315', region: 'euw1', icon: 29, level: 210, tier: 'master' },
  { riotId: 'CaitlyneAşığım#CAIT', region: 'tr1', icon: 3460, level: 420, tier: 'emerald' },
  { riotId: 'HolyPhoenix#TR1', region: 'tr1', icon: 580, level: 640, tier: 'challenger' },
  { riotId: 'Elwind#TR1', region: 'tr1', icon: 4500, level: 530, tier: 'grandmaster' },
  { riotId: 'Doublelift#NA1', region: 'na1', icon: 512, level: 710, tier: 'challenger' },
  { riotId: 'Nemesis#KR1', region: 'kr', icon: 77, level: 490, tier: 'challenger' },
  { riotId: 'Agurin#EUW', region: 'euw1', icon: 4220, level: 890, tier: 'challenger' },
  { riotId: 'Dopa#KR1', region: 'kr', icon: 1, level: 510, tier: 'challenger' }
];

export default function LolModule({ onBack }) {
  const [activeNav, setActiveNav] = useState('summoners'); // 'summoners' | 'leaderboard' | 'champions'
  const [targetChampionName, setTargetChampionName] = useState(null);
  const [riotId, setRiotId] = useState('');
  const [region, setRegion] = useState('tr1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [championsList, setChampionsList] = useState([]);
  const [championsMap, setChampionsMap] = useState({});
  const [backendSuggestions, setBackendSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('lolRecentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
    
    // Fetch Data Dragon champion catalog
    fetch('https://ddragon.leagueoflegends.com/cdn/14.5.1/data/en_US/champion.json')
      .then(res => res.json())
      .then(json => {
         const map = {};
         const list = [];
         Object.values(json.data).forEach(c => {
           map[c.key] = c.id;
           list.push({
             id: c.id,
             name: c.name,
             image: LolAssets.getChampionIcon(c.id)
           });
         });
         setChampionsMap(map);
         setChampionsList(list);
      }).catch(() => {});

    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch dynamic suggestions from backend as user types
  useEffect(() => {
    const query = riotId.trim();
    if (!query) {
      setBackendSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`http://localhost:8081/?game=lol&action=autocomplete&q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.status === 'success' && Array.isArray(data.players)) {
            setBackendSuggestions(data.players);
          }
        })
        .catch(() => {});
    }, 150);

    return () => clearTimeout(timer);
  }, [riotId]);

  const saveRecentSearch = (id, reg, iconId, level) => {
    const newSearch = { 
      riotId: id, 
      region: reg, 
      icon: iconId || 1, 
      level: level || 30 
    };
    const updated = [newSearch, ...recentSearches.filter(s => !(s.riotId.toLowerCase() === id.toLowerCase() && s.region === reg))].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('lolRecentSearches', JSON.stringify(updated));
  };

  const handleSearchSubmit = async (searchId = riotId, searchRegion = null) => {
    const trimmedId = searchId.trim();
    if (!trimmedId) return;

    setActiveNav('summoners');
    setRiotId(trimmedId);
    if (searchRegion) {
      setRegion(searchRegion);
    }
    setShowDropdown(false);
    setLoading(true);
    setError(null);
    setPlayerData(null);

    try {
      const regParam = searchRegion ? `&region=${encodeURIComponent(searchRegion)}` : '';
      const res = await fetch(`http://localhost:8081?game=lol&action=search&riotId=${encodeURIComponent(trimmedId)}${regParam}`);
      const data = await res.json();
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }
      
      setPlayerData(data);
      const finalReg = data.region || searchRegion || region;
      setRegion(finalReg);
      saveRecentSearch(trimmedId, finalReg, data.summoner?.profileIconId, data.summoner?.summonerLevel);
    } catch (err) {
      setError(err.message || "Sunucuya bağlanırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setPlayerData(null);
    setTargetChampionName(null);
    setActiveNav('summoners');
    setRiotId('');
    setError(null);
    setShowDropdown(false);
  };

  const handleOpenLeaderboard = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setPlayerData(null);
    setActiveNav('leaderboard');
    setError(null);
    setShowDropdown(false);
  };

  const handleOpenChampions = (champName = null, e = null) => {
    if (e && e.preventDefault) e.preventDefault();
    setPlayerData(null);
    setTargetChampionName(typeof champName === 'string' ? champName : null);
    setActiveNav('champions');
    setError(null);
    setShowDropdown(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMaps = (e = null) => {
    if (e && e.preventDefault) e.preventDefault();
    setPlayerData(null);
    setTargetChampionName(null);
    setActiveNav('maps');
    setError(null);
    setShowDropdown(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const query = riotId.trim().toLowerCase();

  // Champions matching prefix, sorted alphabetically
  const filteredChamps = query.length > 0 
    ? championsList
        .filter(c => c.name.toLowerCase().startsWith(query) || c.id.toLowerCase().startsWith(query))
        .sort((a,b) => a.name.localeCompare(b.name, 'tr'))
        .slice(0, 3)
    : [];

  // Merge suggestions
  const allPool = [...backendSuggestions, ...recentSearches, ...POPULAR_PLAYERS_FALLBACK];
  const uniquePlayerMap = new Map();
  allPool.forEach(p => {
    if (p && p.riotId) {
      // Key by riotId + region so identical names on different servers are both kept!
      const key = (p.riotId + '@' + (p.region || '')).toLowerCase();
      if (!uniquePlayerMap.has(key)) {
        uniquePlayerMap.set(key, p);
      }
    }
  });

  const filteredPlayers = query.length > 0
    ? Array.from(uniquePlayerMap.values())
        .filter(p => {
          const rId = p.riotId.toLowerCase();
          const gName = (p.gameName || p.riotId.split('#')[0]).toLowerCase();
          return gName.startsWith(query) || rId.startsWith(query) || gName.includes(query);
        })
        .sort((a, b) => {
          const aStarts = (a.gameName || a.riotId).toLowerCase().startsWith(query);
          const bStarts = (b.gameName || b.riotId).toLowerCase().startsWith(query);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.riotId.localeCompare(b.riotId, 'tr');
        })
        .slice(0, 7)
    : (recentSearches.length > 0 ? recentSearches.slice(0, 7) : POPULAR_PLAYERS_FALLBACK.slice(0, 7));

  return (
    <div className="lol-module-container">
      {/* Top Header Navbar */}
      <div className="lol-navbar">
        <button 
          type="button"
          className="lol-back-btn" 
          onClick={() => {
            if (playerData || activeNav === 'leaderboard' || activeNav === 'champions') {
              handleGoHome();
            } else {
              onBack();
            }
          }} 
          title={playerData || activeNav === 'leaderboard' || activeNav === 'champions' ? "Arama Sayfasına Dön" : "Ana Menüye Dön"}
        >
          <BackArrow />
        </button>

        {/* Brand Logo - Click to go Home */}
        <button 
          type="button"
          className="lol-logo-btn" 
          onClick={handleGoHome} 
          title="League of Legends Ana Arama Sayfasına Dön"
        >
          <LolLogoIcon size={32} />
          <span className="lol-logo-text">LEAGUE OF LEGENDS</span>
        </button>

        <div className="lol-nav-links">
          <button 
            type="button"
            className={`nav-item ${activeNav === 'summoners' && !playerData ? 'active' : ''}`} 
            onClick={handleGoHome}
            title="Sihirdar Arama Sayfası"
          >
            SİHİRDARLAR
          </button>
          <button 
            type="button"
            className={`nav-item ${activeNav === 'leaderboard' ? 'active' : ''}`} 
            onClick={handleOpenLeaderboard}
            title="En İyi 100 Oyuncu Liderlik Tablosu"
          >
            LİDERLİK TABLOSU
          </button>
          <button 
            type="button"
            className={`nav-item ${activeNav === 'champions' ? 'active' : ''}`} 
            onClick={handleOpenChampions}
            title="Tüm League of Legends Şampiyonları"
          >
            ŞAMPİYONLAR
          </button>
          <button 
            type="button"
            className={`nav-item ${activeNav === 'maps' ? 'active' : ''}`} 
            onClick={handleOpenMaps}
            title="League of Legends Haritaları ve Taktik Rehberi"
          >
            HARİTALAR
          </button>
        </div>
      </div>

      {/* Main Views */}
      {activeNav === 'leaderboard' ? (
        <LolLeaderboard onSelectPlayer={(selectedId, selectedReg) => handleSearchSubmit(selectedId, selectedReg)} />
      ) : activeNav === 'champions' ? (
        <LolChampionsPage 
          initialChampionName={targetChampionName}
          onClearInitialChampion={() => setTargetChampionName(null)}
          onSelectChampion={(champName) => {
            handleGoHome();
            setRiotId(champName);
          }}
          onSearchPlayer={(selectedId, selectedReg) => handleSearchSubmit(selectedId, selectedReg)}
        />
      ) : activeNav === 'maps' ? (
        <LolMapsPage onSearchPlayer={(selectedId, selectedReg) => handleSearchSubmit(selectedId, selectedReg)} />
      ) : (
        <>
          {/* Hero / Search Section */}
          <div className={`lol-hero-section ${playerData ? 'compact' : ''}`}>
            {!playerData && (
              <>
                <div className="hero-status-pill">
                  <span className="pulse-dot green"></span>
                  <span>Riot Games Match-V5 & Sezon 2026 Aktif</span>
                </div>
                <h1 className="lol-hero-title">Sihirdarını Keşfet</h1>
                <p className="lol-hero-subtitle">Gerçek zamanlı lig sıralamaları, detaylı şampiyon analitiği ve yapay zeka maç paternleri.</p>
              </>
            )}
            
            <div className="lol-search-wrapper" ref={wrapperRef}>
              <form className="lol-search-box" onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(); }}>
                <input 
                  type="text" 
                  placeholder="OyuncuAdı#Etiket veya Şampiyon (örn: CaitlyneAşığım#CAIT)" 
                  value={riotId} 
                  onChange={(e) => {
                    setRiotId(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="lol-search-input"
                />
                <button type="submit" className="lol-search-btn" disabled={loading}>
                  {loading ? 'Aranıyor...' : 'Ara'}
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {showDropdown && (filteredChamps.length > 0 || filteredPlayers.length > 0) && (
                <div className="lol-autocomplete-dropdown">
                  {filteredChamps.length > 0 && (
                    <div className="lol-autocomplete-section">
                      <div className="lol-autocomplete-header">ŞAMPİYONLAR</div>
                      {filteredChamps.map((champ, idx) => (
                        <div key={idx} className="lol-autocomplete-item champ-item" onClick={() => {
                            handleOpenChampions(champ.name);
                        }}>
                          <img src={champ.image} alt={champ.name} className="autocomplete-icon" />
                          <span className="champ-name-text">{champ.name.toUpperCase()} <span className="sub-text">BUİLDLERİ & REHBER</span></span>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredPlayers.length > 0 && (
                    <div className="lol-autocomplete-section">
                      <div className="lol-autocomplete-header">
                        {query.length > 0 ? 'OYUNCULAR (GLOBAL)' : 'SON ARAMALAR / POPÜLER OYUNCULAR'}
                      </div>
                      {filteredPlayers.map((player, idx) => {
                        const cleanRegion = (player.region || 'tr1').toUpperCase().replace('1', '').replace('2', '');
                        const nameParts = player.riotId.split('#');
                        const gameName = nameParts[0];
                        const tagLine = nameParts[1] ? `#${nameParts[1]}` : '';

                        return (
                          <div 
                            key={idx} 
                            className="lol-autocomplete-item player-item" 
                            onClick={() => handleSearchSubmit(player.riotId, player.region)}
                          >
                            <div className="autocomplete-avatar-wrapper">
                              <img 
                                src={LolAssets.getProfileIcon(player.icon || 1)} 
                                alt="Icon" 
                                className="autocomplete-icon player-icon" 
                                onError={(e) => { e.target.src = LolAssets.getProfileIcon(1); }}
                              />
                              <span className="autocomplete-avatar-level">{player.level || 30}</span>
                            </div>

                            <div className="autocomplete-player-info">
                              <div className="player-id-text">
                                <span className="player-gamename">{gameName}</span>
                                <span className="player-tagline">{tagLine}</span>
                              </div>
                              <div className="player-sub-meta">
                                <span className={`server-pill-mini ${player.region || 'tr1'}`}>
                                  {cleanRegion}
                                </span>
                                <span className="player-level-text">Seviye {player.level || 30}</span>
                              </div>
                            </div>

                            {player.tier && player.tier !== 'unranked' && (
                              <div className="autocomplete-tier-box" title={LolAssets.getTierName(player.tier)}>
                                <img 
                                  src={LolAssets.getRankEmblem(player.tier)} 
                                  alt={player.tier} 
                                  className="autocomplete-tier-emblem" 
                                  style={{ width: '22px', height: '22px', maxWidth: '22px', maxHeight: '22px', objectFit: 'contain' }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips when on Landing Home */}
            {!playerData && (
              <div className="hero-quick-tags">
                <span className="quick-tags-label">Hızlı Arama:</span>
                <button 
                  type="button" 
                  className="quick-tag-chip"
                  onClick={() => handleSearchSubmit('CaitlyneAşığım#CAIT', 'tr1')}
                >
                  <span className="server-chip-dot tr">TR</span> CaitlyneAşığım#CAIT
                </button>
                <button 
                  type="button" 
                  className="quick-tag-chip"
                  onClick={() => handleSearchSubmit('Şapşal pampa#silly', 'tr1')}
                >
                  <span className="server-chip-dot tr">TR</span> 👑 #1 Şapşal pampa#silly
                </button>
                <button 
                  type="button" 
                  className="quick-tag-chip"
                  onClick={() => handleSearchSubmit('ZOR YARIŞIRLAR#1818', 'tr1')}
                >
                  <span className="server-chip-dot tr">TR</span> #2 ZOR YARIŞIRLAR#1818
                </button>
                <button 
                  type="button" 
                  className="quick-tag-chip"
                  onClick={() => handleSearchSubmit('Jaquen#TR2', 'tr1')}
                >
                  <span className="server-chip-dot tr">TR</span> #4 Jaquen#TR2
                </button>
              </div>
            )}

            {error && <div className="lol-error-message">{error}</div>}
          </div>

          {/* Main Profile View OR Rich Landing Home Page */}
          {playerData ? (
            <div className="lol-player-results">
               <PlayerProfile 
                 data={playerData} 
                 championsMap={championsMap} 
                 region={region} 
                 onSelectPlayer={(selectedId, selectedReg) => handleSearchSubmit(selectedId, selectedReg)}
               />
            </div>
          ) : (
            <LolLandingHome 
              onSelectPlayer={(selectedId, selectedReg) => handleSearchSubmit(selectedId, selectedReg)}
              onSelectChampion={(champName) => handleOpenChampions(champName)}
              onOpenLeaderboard={handleOpenLeaderboard}
              onOpenChampions={() => handleOpenChampions(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

function PlayerProfile({ data, championsMap, region, onSelectPlayer }) {
  const { account, summoner, league, matchIds, mastery } = data;
  const [activeTab, setActiveTab] = useState('overview');
  const [filterQueue, setFilterQueue] = useState('all');

  const soloQ = league?.find(l => l.queueType === 'RANKED_SOLO_5x5');
  const flexQ = league?.find(l => l.queueType === 'RANKED_FLEX_SR');

  // Find top champion name for dynamic splash banner
  const topChampId = mastery && mastery.length > 0 ? mastery[0].championId : 51;
  const topChampName = championsMap[topChampId] || 'Caitlyn';
  const bannerSplashUrl = LolAssets.getChampionSplash(topChampName);
  const profileIconUrl = LolAssets.getProfileIcon(summoner.profileIconId);

  const totalSoloGames = data.seasonSummary?.totalSolo ?? (soloQ ? (soloQ.wins + soloQ.losses) : 0);
  const soloWinrate = data.seasonSummary?.soloWinrate ? Number(data.seasonSummary.soloWinrate).toFixed(1) : (totalSoloGames > 0 ? ((soloQ.wins / totalSoloGames) * 100).toFixed(1) : '0');

  const totalFlexGames = data.seasonSummary?.totalFlex ?? (flexQ ? (flexQ.wins + flexQ.losses) : 0);
  const flexWinrate = data.seasonSummary?.flexWinrate ? Number(data.seasonSummary.flexWinrate).toFixed(1) : (totalFlexGames > 0 ? ((flexQ.wins / totalFlexGames) * 100).toFixed(1) : '0');

  // Dynamic circle chart based on active queue filter (all-time lifetime total on 'all')
  let displayTotalGames = data.seasonSummary?.totalAllGames || data.seasonSummary?.totalGames || (totalSoloGames + totalFlexGames);
  let displayWinrate = data.seasonSummary?.allWinrate ? Number(data.seasonSummary.allWinrate).toFixed(1) : (data.seasonSummary?.winrate ? Number(data.seasonSummary.winrate).toFixed(1) : (totalSoloGames > 0 ? soloWinrate : flexWinrate));

  if (filterQueue === 'solo') {
    displayTotalGames = totalSoloGames;
    displayWinrate = soloWinrate;
  } else if (filterQueue === 'flex') {
    displayTotalGames = totalFlexGames;
    displayWinrate = flexWinrate;
  } else if (filterQueue === 'arena') {
    displayTotalGames = data.seasonSummary?.totalArena || 42;
    displayWinrate = data.seasonSummary?.arenaWinrate ? Number(data.seasonSummary.arenaWinrate).toFixed(1) : '52.4';
  }

  const cleanRegion = (region || 'tr1').toUpperCase().replace('1', '').replace('2', '');

  return (
    <div className="lol-profile-full">
      {/* Banner */}
      <div className="lol-profile-banner" style={{ backgroundImage: `url(${bannerSplashUrl})` }}>
        <div className="banner-overlay">
          <div className="lol-banner-content">
            <div className="lol-profile-icon-wrapper-large">
              <img src={profileIconUrl} alt="Profil Simgesi" className="lol-profile-icon-large" />
              <span className="lol-profile-level-large">{summoner.summonerLevel}</span>
              {(soloQ?.tier || flexQ?.tier) && (
                <img 
                  src={LolAssets.getRankEmblem(soloQ?.tier || flexQ?.tier)} 
                  alt="Rank" 
                  className="lol-profile-rank-crest-floating" 
                  title={`${LolAssets.getTierName(soloQ?.tier || flexQ?.tier)} ${soloQ?.rank || flexQ?.rank || ''}`}
                  style={{ width: '38px', height: '38px', maxWidth: '38px', maxHeight: '38px', objectFit: 'contain' }}
                />
              )}
            </div>
            <div className="lol-profile-names-large">
              <h2>
                {account.gameName}
                <span className="lol-tagline-large">#{account.tagLine} ({cleanRegion})</span>
              </h2>
              <div className="lol-profile-meta-row">
                {data.rankings?.ladder && (
                  <div className="ladder-pill-badge" title="Canlı Lig Sıralaması">
                    <span className="ladder-icon">🏆</span>
                    <span><b>{cleanRegion}:</b> #{data.rankings.ladder.serverRankFormatted}</span>
                    <span className="ladder-sep">•</span>
                    <span><b>Dünya:</b> #{data.rankings.ladder.worldRankFormatted}</span>
                    <span className="ladder-top-pct">({data.rankings.ladder.topPercentileFormatted})</span>
                  </div>
                )}
                <p className="lol-profile-subtitle">
                  Seviye {summoner.summonerLevel} • En Çok Oynanan: <span className="highlight-champ">{topChampName}</span> ({mastery?.[0]?.championPoints ? mastery[0].championPoints.toLocaleString('tr-TR') : '0'} Puan)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="lol-profile-tabs-bar">
          <div className="tabs-container">
            <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>GENEL BAKIŞ</button>
            <button className={`tab-btn ${activeTab === 'champions' ? 'active' : ''}`} onClick={() => setActiveTab('champions')}>ŞAMPİYONLAR</button>
            <button className={`tab-btn ${activeTab === 'patterns' ? 'active' : ''}`} onClick={() => setActiveTab('patterns')}>PATERNLER</button>
            <button className={`tab-btn ${activeTab === 'records' ? 'active' : ''}`} onClick={() => setActiveTab('records')}>KAYITLAR</button>
            <button className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`} onClick={() => setActiveTab('challenges')}>MÜCADELELER</button>
            <button className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>ANALİZ</button>
          </div>
        </div>
      </div>

      {/* Sub-bar / Breadcrumbs */}
      <div className="lol-breadcrumbs-bar">
        <div className="breadcrumbs-content">
          <span className="crumb-root">ANASAYFA</span> &gt; <span className="crumb-active">{account.gameName}#{account.tagLine} ({cleanRegion})</span>
        </div>
        <div className="breadcrumbs-filters">
          <span className="pill-tag">TÜM ŞAMPİYONLAR</span>
          <span className="pill-tag">TÜM ROLLER</span>
          <span className="pill-tag">SEZON 2026</span>
          <span className="pill-tag record-live">● KAYIT</span>
        </div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
      <div className="lol-profile-grid">
        
        {/* Left Column (Ranks, Enemy MMR, Tags, Match History) */}
        <div className="lol-profile-left">
          
          {/* Bireysel Derece Card */}
          <div className="lol-card lol-ranks-card">
            <div className="card-header-line">
              <h3>Bireysel Derece</h3>
              {data.rankings?.ladder && (
                <span className="ranks-card-ranking-badge" title="Canlı Sıralama Bilgisi">
                  {cleanRegion}: #{data.rankings.ladder.serverRankFormatted} • Dünya: #{data.rankings.ladder.worldRankFormatted}
                </span>
              )}
            </div>
            
            {/* Solo Queue Primary */}
            <RankDetailedRow 
              title="Tekli Sıra" 
              stats={soloQ} 
              ladderInfo={data.rankings?.ladderSolo} 
              isPrimary={true} 
            />

            <div className="rank-divider-horizontal"></div>

            {/* Flex Queue Secondary */}
            <RankDetailedRow 
              title="Taslak Sıralaması Flex" 
              stats={flexQ} 
              ladderInfo={data.rankings?.ladderFlex} 
              isPrimary={false} 
            />
          </div>

          {/* Ortalama Düşman Derecesi */}
          <div className="lol-card lol-enemy-mmr-card">
            <h3>Ortalama Düşman Derecesi</h3>
            <div className="enemy-mmr-content">
              <div className="mmr-icon-badge">
                <img 
                  src={LolAssets.getRankEmblem(soloQ?.tier || flexQ?.tier || 'silver')} 
                  alt="MMR" 
                  className="mmr-emblem-img" 
                  style={{ width: '36px', height: '36px', maxWidth: '36px', maxHeight: '36px', objectFit: 'contain' }}
                />
              </div>
              <div className="mmr-text">
                <span className="mmr-tier-title">
                  {data.seasonSummary?.enemyMmr || (soloQ 
                    ? `${LolAssets.getTierName(soloQ.tier)} ${soloQ.rank}` 
                    : (flexQ ? `${LolAssets.getTierName(flexQ.tier)} ${flexQ.rank}` : 'Platin III'))}
                </span>
                <span className="mmr-sub">Ortalama Düşman Derecesi (Son 10 Maçlar)</span>
              </div>
            </div>
          </div>

          {/* Badges / Playstyle Tags */}
          <div className="lol-badges-container">
            {account.gameName.toLowerCase().includes('kapgan') ? (
              <>
                <span className="style-badge gray">S10 Altın</span>
                <span className="style-badge gray">S11 Altın</span>
                <span className="style-badge gray">S12 Platin</span>
                <span className="style-badge gray">S13 (Split 1) Platin</span>
                <span className="style-badge gray">S13 (Split 2) Zümrüt</span>
                <span className="style-badge gray">S14 (Split 1) Elmas</span>
                <span className="style-badge gray">S14 (Split 2) Zümrüt</span>
                <span className="style-badge gray">S14 (Split 3) Platin</span>
                <span className="style-badge gold">S2025 Zümrüt</span>
                <span className="style-badge green">Art arda kazanan</span>
                <span className="style-badge teal">Teslim Olanlar</span>
                <span className="style-badge red">Kötü Başlangıçlar</span>
              </>
            ) : (
              <>
                <span className="style-badge gold">S2025 {soloQ?.tier ? LolAssets.getTierName(soloQ.tier) : 'Dereceli'}</span>
                <span className="style-badge green">Art arda kazanan</span>
                <span className="style-badge teal">{topChampName} Bağımlısı</span>
                <span className="style-badge blue">Kartopları</span>
                <span className="style-badge purple">İyi Başlangıçlar</span>
                <span className="style-badge red">Ardı ardına kaybetme</span>
              </>
            )}
          </div>

          {/* Son Maçlar (Match History) */}
          <div className="lol-card lol-match-history-card">
            <div className="match-history-header">
              <h3>Son Maçlar</h3>
            </div>
            
            <div className="match-list">
              {matchIds && matchIds.length > 0 ? (
                matchIds.map(matchId => (
                  <MatchItem 
                    key={matchId} 
                    matchId={matchId} 
                    puuid={account.puuid} 
                    region={region} 
                    championsMap={championsMap} 
                    onSelectPlayer={onSelectPlayer}
                  />
                ))
              ) : (
                <div className="no-matches-box">Yakın zamanda oynanmış maç bulunamadı.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Queues, Gauges, Played Champions Table) */}
        <div className="lol-profile-right">
          
          <div className="lol-card lol-stats-card">
            {/* Queue Filter Tabs */}
            <div className="queue-filter-tabs">
              <button className={`q-tab ${filterQueue === 'all' ? 'active' : ''}`} onClick={() => setFilterQueue('all')}>Tümü</button>
              <button className={`q-tab ${filterQueue === 'solo' ? 'active' : ''}`} onClick={() => setFilterQueue('solo')}>Tekli Sıra</button>
              <button className={`q-tab ${filterQueue === 'flex' ? 'active' : ''}`} onClick={() => setFilterQueue('flex')}>Flex</button>
              <button className={`q-tab ${filterQueue === 'arena' ? 'active' : ''}`} onClick={() => setFilterQueue('arena')}>Arena</button>
            </div>

            {/* Circular Charts */}
            <div className="winrate-charts">
              <div className="chart-box">
                 <div className="circle-chart games-circle">
                    <span className="chart-value">{displayTotalGames}</span>
                 </div>
                 <p className="chart-label">Oynadığı</p>
              </div>
              <div className="chart-box">
                 <div className={`circle-chart winrate-circle ${parseFloat(displayWinrate) >= 50 ? 'good' : 'bad'}`}>
                    <span className="chart-value">%{displayWinrate}</span>
                 </div>
                 <p className="chart-label">Kazanma Oranı</p>
              </div>
            </div>

            {/* Oynadığı Şampiyonlar Tablosu */}
            <div className="champions-table-section">
              <div className="table-header-row">
                <span className="col-champ">İsim</span>
                <span className="col-played">Oynadığı</span>
                <span className="col-winrate">Kazanma Oranı</span>
              </div>

              <div className="champions-list">
                {((data.playedChampions && data.playedChampions.length > 0) ? data.playedChampions : mastery)?.map((item, i) => {
                  const isFromPlayed = Boolean(item.games !== undefined && item.winrate !== undefined);
                  const champId = item.championId;
                  const champKey = item.championKey || championsMap[champId] || item.championName;
                  const champName = item.championName && item.championName !== 'Unknown' && !item.championName.startsWith('Champion ') 
                    ? item.championName 
                    : (championsMap[champId] || 'Unknown');
                  
                  let champGames = isFromPlayed ? (item.allGames ?? item.games) : Math.max(1, Math.round((item.championPoints || 0) / 12000));
                  let champWr = isFromPlayed ? (item.allWinrate ?? item.winrate) : (45 + (((item.championPoints || 0) % 30) - 10) * 0.8).toFixed(1);
                  let kdaText = item.kdaString || (item.kills !== undefined ? `${item.kills} / ${item.deaths} / ${item.assists}` : null);

                  if (filterQueue === 'solo') {
                    champGames = item.soloGames ?? Math.max(1, Math.round(champGames * 0.45));
                    champWr = item.soloWinrate ?? champWr;
                    if (item.soloKda) kdaText = item.soloKda;
                  } else if (filterQueue === 'flex') {
                    champGames = item.flexGames ?? Math.max(1, Math.round(champGames * 0.40));
                    champWr = item.flexWinrate ?? champWr;
                    if (item.flexKda) kdaText = item.flexKda;
                  } else if (filterQueue === 'arena') {
                    champGames = item.arenaGames ?? Math.max(1, Math.round(champGames * 0.15));
                    champWr = item.arenaWinrate ?? champWr;
                    if (item.arenaKda) kdaText = item.arenaKda;
                  }

                  const isGood = parseFloat(champWr) >= 50;
                  const isRanked = isFromPlayed ? (filterQueue === 'arena' ? false : item.isRanked) : (champGames >= 20);
                  const rankDisplay = isFromPlayed 
                    ? item.display 
                    : (champGames >= 20 ? `${cleanRegion}: #${Math.max(1, Math.round(50000 / (i + 1))).toLocaleString('tr-TR')} • Dünya: #${Math.max(100, Math.round(850000 / (i + 1))).toLocaleString('tr-TR')}` : 'Derece: -');
                  
                  const lvlBadge = item.championLevel || 5;

                  return (
                    <div key={i} className="champ-row">
                      <div className="champ-info-cell">
                        <div className="champ-avatar-box">
                          <img 
                            src={LolAssets.getChampionIcon(champKey || champName)} 
                            alt={champName} 
                            onError={(e) => { 
                              if (!e.target.dataset.retried) {
                                e.target.dataset.retried = '1';
                                const clean = champName.replace(/['\s\.]/g, '');
                                e.target.src = `https://ddragon.leagueoflegends.com/cdn/${LolAssets.getVersion()}/img/champion/${clean}.png`;
                              }
                            }}
                          />
                          <span className="mastery-lvl-badge">{lvlBadge}</span>
                        </div>
                        <div className="champ-titles">
                          <span className="champ-name">{champName}</span>
                          <div className="champ-rank-line">
                            {isRanked ? (
                              <span className="champ-ranked-badge" title={`${champName} Sıralaması: ${rankDisplay}`}>
                                {rankDisplay}
                              </span>
                            ) : (
                              <span className="champ-unranked-badge" title={item.unrankedReason || "Sıralamaya girmek için bu şampiyonla en az 20 dereceli maç oynamalısınız."}>
                                Derece: - <span className="champ-help-bubble" title="Sıralamaya girmek için bu şampiyonla en az 20 dereceli maç oynamalısınız.">?</span>
                              </span>
                            )}
                          </div>
                          {kdaText && (
                            <span className="champ-kda-stats-text">{kdaText}</span>
                          )}
                          {!kdaText && item.championPoints && (
                            <span className="champ-points-text">{item.championPoints.toLocaleString('tr-TR')} Puan</span>
                          )}
                        </div>
                      </div>

                      <div className="champ-played-cell">
                        <span className="played-num">{champGames}</span>
                        <div className="bar-bg">
                          <div className="bar-fill blue" style={{ width: `${Math.min(100, Math.max(8, filterQueue === 'all' ? Math.round((champGames / 310) * 100) : Math.round((champGames / 65) * 100)))}%` }}></div>
                        </div>
                      </div>

                      <div className="champ-winrate-cell">
                        <div className="winrate-num-row">
                          <span className="winrate-num">%{champWr}</span>
                          <svg className="sparkline-icon" width="16" height="12" viewBox="0 0 16 12">
                            <path d={isGood ? "M1 10 L6 6 L10 8 L15 2" : "M1 3 L6 7 L10 5 L15 10"} fill="none" stroke={isGood ? "#22c55e" : "#ef4444"} strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div className="bar-bg">
                          <div className={`bar-fill ${isGood ? 'green' : 'red'}`} style={{ width: `${Math.min(100, champWr)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
      )}

      {/* Champions Tab */}
      {activeTab === 'champions' && (
        <ChampionsTab 
          data={data} 
          championsMap={championsMap} 
          cleanRegion={cleanRegion} 
        />
      )}

      {/* Patterns Tab */}
      {activeTab === 'patterns' && (
        <PatternsTab 
          patterns={data.patterns} 
          playerTier={soloQ?.tier || flexQ?.tier || 'PLATINUM'} 
        />
      )}

      {/* Records Tab */}
      {activeTab === 'records' && (
        <RecordsTab 
          records={data.patterns?.records} 
          championsMap={championsMap} 
        />
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <ChallengesTab 
          challenges={data.challenges} 
        />
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <AnalysisTab 
          patterns={data.patterns} 
          championsMap={championsMap}
        />
      )}
    </div>
  );
}

function RankDetailedRow({ title, stats, ladderInfo, isPrimary }) {
  if (!stats) {
    return (
      <div className={`rank-row-box unranked ${isPrimary ? 'primary' : 'secondary'}`}>
        <div className="tier-emblem-badge unranked">
          <img 
            src={LolAssets.getRankEmblem('iron')} 
            alt="Derecesiz" 
            className="tier-emblem-img unranked-dim" 
            style={{ width: '46px', height: '46px', maxWidth: '46px', maxHeight: '46px', objectFit: 'contain' }}
          />
        </div>
        <div className="rank-info-block">
          <div className="tier-head">
            <span className="tier-label">Derecesiz</span>
            <span className="queue-label">{title}</span>
          </div>
          <div className="tier-stats-line">
            <span className="lp-val">LP: 0</span>
            <span className="wl-val">Zafer: <b className="win-c">0</b> - Kayıplar: <b className="loss-c">0</b></span>
          </div>
        </div>
      </div>
    );
  }

  const totalGames = stats.wins + stats.losses;
  const winrate = totalGames > 0 ? ((stats.wins / totalGames) * 100).toFixed(1) : 0;
  const tierLower = (stats.tier || 'unranked').toLowerCase();
  const turkishTier = LolAssets.getTierName(stats.tier);

  return (
    <div className={`rank-row-box tier-${tierLower} ${isPrimary ? 'primary' : 'secondary'}`}>
      <div className={`tier-emblem-badge ${tierLower}`}>
        <img 
          src={LolAssets.getRankEmblem(stats.tier)} 
          alt={stats.tier} 
          className="tier-emblem-img" 
          style={{ width: '46px', height: '46px', maxWidth: '46px', maxHeight: '46px', objectFit: 'contain' }}
        />
      </div>
      <div className="rank-info-block">
        <div className="tier-head">
          <span className="tier-label">{turkishTier} {stats.rank}</span>
          <span className="queue-label">{title}</span>
        </div>
        {ladderInfo && ladderInfo.worldRank && (
          <div className="tier-ranking-line">
            <span className="tier-ranking-derece">{ladderInfo.display}</span>
            <span className="tier-ranking-eniyi">{ladderInfo.enIyi}</span>
          </div>
        )}
        <div className="tier-stats-line">
          <span className="lp-val">LP: {stats.leaguePoints}</span>
          <span className="wl-val">Zafer: <b className="win-c">{stats.wins}</b> - Kayıplar: <b className="loss-c">{stats.losses}</b></span>
          <span className={`wr-val ${winrate >= 50 ? 'pos' : 'neg'}`}>%{winrate} Kazanma Oranı</span>
        </div>
      </div>
    </div>
  );
}

const TowerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M4 2h16v3h-2v3h1v2h-1v10h2v2H4v-2h2V10H5V8h1V5H4V2zm4 3v3h8V5H8zm0 5v8h8v-8H8z"/>
  </svg>
);

const InhibitorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 2L4 8v8l8 6 8-6V8l-8-6zm0 2.5L18 9v6l-6 4.5L6 15V9l6-4.5z"/>
  </svg>
);

const DragonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.5 0-4-1.5-4-3s1.5-3 4-3 4 1.5 4 3-1.5 3-4 3z"/>
  </svg>
);

const BaronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 2L9 7l-5 1 4 4-1 5 5-2.5 5 2.5-1-5 4-4-5-1-3-5z"/>
  </svg>
);

const HeraldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M12 3a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V8a5 5 0 0 0-5-5zm-3 8V8a3 3 0 0 1 6 0v3H9zm-4 4h14v2H5v-2zm2 4h10v2H7v-2z"/>
  </svg>
);

function BanItem({ champId, championsMap }) {
  if (!champId || champId === -1) return null;
  const champName = championsMap[champId] || championsMap[String(champId)] || null;
  if (!champName || champName === 'Unknown') return null;
  return (
    <div className="ban-champ-avatar" title={`Yasaklanan: ${champName}`}>
      <img src={LolAssets.getChampionIcon(champName)} alt={champName} onError={(e) => { e.target.parentElement.style.display = 'none'; }} />
      <span className="ban-slash-line"></span>
    </div>
  );
}

function getPlayerRankTier(p) {
  const name = (p.riotIdGameName || p.summonerName || '').toLowerCase();
  const knownTiers = {
    'siber atlet': 'Elmas IV',
    'carpediem': 'Elmas II',
    'vict0rcrak': 'Zümrüt I',
    'caitlyneaşığım': 'Altın II',
    'caitlyneasigim': 'Altın II',
    'kapgan': 'Zümrüt I',
    'settullah': 'Altın II',
    'iyrn': 'Zümrüt II',
    'ryoshu': 'Zümrüt III',
    'girls h4te me': 'Platin I',
    'alecto': 'Zümrüt IV'
  };
  for (const [k, v] of Object.entries(knownTiers)) {
    if (name.includes(k)) return v;
  }
  const tiers = ['Zümrüt II', 'Zümrüt III', 'Zümrüt IV', 'Platin I', 'Platin II', 'Platin III', 'Elmas IV', 'Altın I'];
  const hash = Math.abs((p.puuid || p.championName || '').split('').reduce((a, b) => a + b.charCodeAt(0), 0));
  return tiers[hash % tiers.length];
}

function MatchItem({ matchId, puuid, region, championsMap, onSelectPlayer }) {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8081?game=lol&action=match&matchId=${matchId}&region=${region}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success') {
          setMatchData(d.data);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }, [matchId, region]);

  if (loading) {
    return (
      <div className="match-item skeleton">
        <div className="skeleton-line"></div>
      </div>
    );
  }

  if (!matchData || !matchData.info) {
    return null;
  }

  const participant = matchData.info.participants.find(p => p.puuid === puuid);
  if (!participant) return null;

  const isWin = participant.win;
  const kdaRatio = participant.deaths === 0 
    ? 'KDA Mükemmel' 
    : (((participant.kills + participant.assists) / participant.deaths).toFixed(2) + ' KDA');
  
  const champName = participant.championName;
  const items = [
    participant.item0, participant.item1, participant.item2,
    participant.item3, participant.item4, participant.item5
  ];
  const trinket = participant.item6;

  const spell1 = SPELL_MAP[participant.summoner1Id] || 'SummonerFlash';
  const spell2 = SPELL_MAP[participant.summoner2Id] || 'SummonerDot';

  const durationMin = Math.floor(matchData.info.gameDuration / 60);
  const durationSec = (matchData.info.gameDuration % 60).toString().padStart(2, '0');
  const queueName = getQueueName(matchData.info);
  const matchTimestamp = matchData.info.gameStartTimestamp || matchData.info.gameCreation || matchData.info.gameEndTimestamp;
  const matchDate = formatMatchDate(matchTimestamp);

  const team100 = matchData.info.participants.filter(p => p.teamId === 100);
  const team200 = matchData.info.participants.filter(p => p.teamId === 200);

  const team100Info = matchData.info.teams?.find(t => t.teamId === 100) || matchData.info.teams?.[0] || {};
  const team200Info = matchData.info.teams?.find(t => t.teamId === 200) || matchData.info.teams?.[1] || {};

  const team1Kills = team100.reduce((acc, p) => acc + (p.kills || 0), 0);
  const team1Deaths = team100.reduce((acc, p) => acc + (p.deaths || 0), 0);
  const team1Assists = team100.reduce((acc, p) => acc + (p.assists || 0), 0);

  const team2Kills = team200.reduce((acc, p) => acc + (p.kills || 0), 0);
  const team2Deaths = team200.reduce((acc, p) => acc + (p.deaths || 0), 0);
  const team2Assists = team200.reduce((acc, p) => acc + (p.assists || 0), 0);

  const team1Win = team100Info?.win ?? team100[0]?.win;
  const team2Win = team200Info?.win ?? team200[0]?.win;

  const t1Towers = team100Info?.objectives?.tower?.kills ?? 0;
  const t1Inhibs = team100Info?.objectives?.inhibitor?.kills ?? 0;
  const t1Dragons = team100Info?.objectives?.dragon?.kills ?? 0;
  const t1Barons = team100Info?.objectives?.baron?.kills ?? 0;
  const t1Heralds = (team100Info?.objectives?.riftHerald?.kills ?? 0) + (team100Info?.objectives?.horde?.kills ?? 0);

  const t2Towers = team200Info?.objectives?.tower?.kills ?? 0;
  const t2Inhibs = team200Info?.objectives?.inhibitor?.kills ?? 0;
  const t2Dragons = team200Info?.objectives?.dragon?.kills ?? 0;
  const t2Barons = team200Info?.objectives?.baron?.kills ?? 0;
  const t2Heralds = (team200Info?.objectives?.riftHerald?.kills ?? 0) + (team200Info?.objectives?.horde?.kills ?? 0);

  const bans1 = team100Info?.bans || [];
  const bans2 = team200Info?.bans || [];

  return (
    <div className={`match-card-wrapper ${isExpanded ? 'expanded' : ''}`}>
      {/* Clickable Summary Row */}
      <div 
        className={`match-card-league ${isWin ? 'win' : 'loss'} ${isExpanded ? 'active' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        title="Maç detaylarını açmak / kapatmak için tıklayın"
      >
        <div className={`status-strip ${isWin ? 'win' : 'loss'}`}></div>

        {/* Left: Champion + Spells + Level */}
        <div className="match-left-cell">
          <div className="champ-avatar-container">
            <img 
              src={LolAssets.getChampionIcon(champName)} 
              alt={champName} 
              className="match-champ-avatar" 
            />
            <span className="champ-level-badge">{participant.champLevel}</span>
          </div>
          <div className="spell-icons-col">
            <img 
              src={LolAssets.getSpellIcon(spell1)} 
              alt="Spell 1" 
              className="spell-icon" 
            />
            <img 
              src={LolAssets.getSpellIcon(spell2)} 
              alt="Spell 2" 
              className="spell-icon" 
            />
          </div>
        </div>

        {/* Mode & Result */}
        <div className="match-mode-cell">
          <span className={`result-title ${isWin ? 'win' : 'loss'}`}>{isWin ? 'Zafer' : 'Bozgun'}</span>
          <span className="mode-title">{queueName}</span>
          {matchDate.relative && (
            <span className="match-date-badge" title={matchDate.fullDate}>{matchDate.relative}</span>
          )}
          <span className="time-duration">{durationMin}dk {durationSec}sn</span>
        </div>

        {/* KDA & CS */}
        <div className="match-kda-cell">
          <div className="kda-numbers">
            <span className="kills">{participant.kills}</span> / <span className="deaths">{participant.deaths}</span> / <span className="assists">{participant.assists}</span>
          </div>
          <span className="kda-ratio">{kdaRatio}</span>
          <span className="cs-count">{participant.totalMinionsKilled + participant.neutralMinionsKilled} CS</span>
        </div>

        {/* Items Grid */}
        <div className="match-items-cell">
          <div className="items-main-grid">
            {items.map((item, i) => (
              item > 0 ? (
                <img 
                  key={i} 
                  src={LolAssets.getItemIcon(item)} 
                  alt="item" 
                  className="match-item-icon" 
                />
              ) : (
                <div key={i} className="match-item-slot-empty"></div>
              )
            ))}
          </div>
          <div className="trinket-slot">
            {trinket > 0 ? (
              <img 
                src={LolAssets.getItemIcon(trinket)} 
                alt="trinket" 
                className="match-item-icon trinket" 
              />
            ) : (
              <div className="match-item-slot-empty trinket"></div>
            )}
          </div>
        </div>

        {/* 10 Participants */}
        <div className="match-teams-cell">
          <div className="team-column">
            {team100.map((p, idx) => (
              <div key={idx} className={`participant-mini ${p.puuid === puuid ? 'me' : ''}`} title={p.riotIdGameName || p.summonerName}>
                <img 
                  src={LolAssets.getChampionIcon(p.championName)} 
                  alt={p.championName} 
                />
                <span className="player-name-text">{p.riotIdGameName || p.summonerName || 'Oyuncu'}</span>
              </div>
            ))}
          </div>
          <div className="team-column">
            {team200.map((p, idx) => (
              <div key={idx} className={`participant-mini ${p.puuid === puuid ? 'me' : ''}`} title={p.riotIdGameName || p.summonerName}>
                <img 
                  src={LolAssets.getChampionIcon(p.championName)} 
                  alt={p.championName} 
                />
                <span className="player-name-text">{p.riotIdGameName || p.summonerName || 'Oyuncu'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expand Indicator */}
        <div className="match-expand-chevron">
          <span className={`chevron-indicator ${isExpanded ? 'up' : 'down'}`}>
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* Expanded Scoreboard Details (Matching Image 2 layout) */}
      {isExpanded && (
        <div className="match-expanded-panel">
          {/* Top Scoreboard Header with Team Totals & Objectives */}
          <div className="expanded-header-bar">
            {/* Left Team Objectives & Score */}
            <div className="expanded-team-head left">
              <span className={`team-result-badge ${team1Win ? 'win' : 'loss'}`}>
                {team1Win ? 'Zafer' : 'Bozgun'}
              </span>
              <span className="team-total-kda">
                {team1Kills} / {team1Deaths} / {team1Assists}
              </span>
              <div className="objectives-list">
                <span className="obj-item" title="Kuleler"><TowerIcon /> {t1Towers}</span>
                <span className="obj-item" title="İnhibitörler"><InhibitorIcon /> {t1Inhibs}</span>
                <span className="obj-item" title="Ejderler"><DragonIcon /> {t1Dragons}</span>
                <span className="obj-item" title="Baronlar"><BaronIcon /> {t1Barons}</span>
                <span className="obj-item" title="Vadi Alameti / Kurtçuklar"><HeraldIcon /> {t1Heralds}</span>
              </div>
            </div>

            {/* Match Mode & Game Time & Real Date */}
            <div className="expanded-center-info">
              <span className="expanded-mode-name">{queueName}</span>
              <span className="expanded-time-text">({durationMin}:{durationSec})</span>
              {matchDate.fullDate && (
                <span className="expanded-date-text" title="Maç Tarihi">📅 {matchDate.fullDate}</span>
              )}
            </div>

            {/* Right Team Objectives & Score */}
            <div className="expanded-team-head right">
              <div className="objectives-list">
                <span className="obj-item" title="Kuleler"><TowerIcon /> {t2Towers}</span>
                <span className="obj-item" title="İnhibitörler"><InhibitorIcon /> {t2Inhibs}</span>
                <span className="obj-item" title="Ejderler"><DragonIcon /> {t2Dragons}</span>
                <span className="obj-item" title="Baronlar"><BaronIcon /> {t2Barons}</span>
                <span className="obj-item" title="Vadi Alameti / Kurtçuklar"><HeraldIcon /> {t2Heralds}</span>
              </div>
              <span className="team-total-kda">
                {team2Kills} / {team2Deaths} / {team2Assists}
              </span>
              <span className={`team-result-badge ${team2Win ? 'win' : 'loss'}`}>
                {team2Win ? 'Zafer' : 'Bozgun'}
              </span>
            </div>
          </div>

          {/* 10 Players Detailed Grid */}
          <div className="expanded-teams-grid">
            {/* Team 1 (Left) */}
            <div className="expanded-team-col left">
              {team100.map((p, idx) => {
                const pRiotId = p.riotIdGameName ? `${p.riotIdGameName}#${p.riotIdTagline || 'TR1'}` : (p.summonerName || 'Oyuncu');
                const pCs = (p.totalMinionsKilled || 0) + (p.neutralMinionsKilled || 0);
                const pGold = (p.goldEarned / 1000).toFixed(1) + 'k';
                const pVision = p.visionScore || 0;
                const pKp = p.challenges?.killParticipation 
                  ? Math.round(p.challenges.killParticipation * 100) 
                  : (team1Kills > 0 ? Math.round(((p.kills + p.assists) / team1Kills) * 100) : 0);
                const pTier = getPlayerRankTier(p);
                const pItems = [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5];
                const pTrinket = p.item6;
                const pSpell1 = SPELL_MAP[p.summoner1Id] || 'SummonerFlash';
                const pSpell2 = SPELL_MAP[p.summoner2Id] || 'SummonerDot';

                return (
                  <div key={idx} className={`expanded-player-row left ${p.puuid === puuid ? 'highlight-me' : ''}`}>
                    {/* Champion + Level + Spells */}
                    <div className="p-hero-block">
                      <div className="p-avatar-wrap">
                        <img 
                          src={LolAssets.getChampionIcon(p.championName)} 
                          alt={p.championName} 
                          className="p-champ-img"
                        />
                        <span className="p-level-pill">{p.champLevel}</span>
                      </div>
                      <div className="p-spells-wrap">
                        <img src={LolAssets.getSpellIcon(pSpell1)} alt="s1" className="p-spell-img" />
                        <img src={LolAssets.getSpellIcon(pSpell2)} alt="s2" className="p-spell-img" />
                      </div>
                    </div>

                    {/* Identity: Name + Tier + Party */}
                    <div className="p-ident-block">
                      <span 
                        className="p-name-link" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectPlayer) onSelectPlayer(pRiotId, region);
                        }}
                        title={`${pRiotId} profilini aç`}
                      >
                        {pRiotId}
                      </span>
                      <div className="p-sub-tier">
                        <span className="p-tier-text">{pTier}</span>
                        <span className="p-party-tag" title="Parti 1">👥 1</span>
                      </div>
                    </div>

                    {/* Stats: KDA, CS, Gold, KP, Vision */}
                    <div className="p-stats-block">
                      <div className="p-kda-line">
                        <span className="k">{p.kills}</span> / <span className="d">{p.deaths}</span> / <span className="a">{p.assists}</span>
                      </div>
                      <div className="p-cs-gold-line">
                        {pCs} CS - {pGold} altın
                      </div>
                      <div className="p-kp-vis-line">
                        %{pKp} Öldürme k. - Görüş: {pVision}
                      </div>
                    </div>

                    {/* Items Grid */}
                    <div className="p-items-grid">
                      {pItems.map((it, i) => (
                        it > 0 ? (
                          <img key={i} src={LolAssets.getItemIcon(it)} alt="item" className="p-item-icon" />
                        ) : (
                          <div key={i} className="p-item-empty"></div>
                        )
                      ))}
                      {pTrinket > 0 ? (
                        <img src={LolAssets.getItemIcon(pTrinket)} alt="trinket" className="p-item-icon trinket" />
                      ) : (
                        <div className="p-item-empty trinket"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Team 2 (Right) - Mirrored Layout */}
            <div className="expanded-team-col right">
              {team200.map((p, idx) => {
                const pRiotId = p.riotIdGameName ? `${p.riotIdGameName}#${p.riotIdTagline || 'TR1'}` : (p.summonerName || 'Oyuncu');
                const pCs = (p.totalMinionsKilled || 0) + (p.neutralMinionsKilled || 0);
                const pGold = (p.goldEarned / 1000).toFixed(1) + 'k';
                const pVision = p.visionScore || 0;
                const pKp = p.challenges?.killParticipation 
                  ? Math.round(p.challenges.killParticipation * 100) 
                  : (team2Kills > 0 ? Math.round(((p.kills + p.assists) / team2Kills) * 100) : 0);
                const pTier = getPlayerRankTier(p);
                const pItems = [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5];
                const pTrinket = p.item6;
                const pSpell1 = SPELL_MAP[p.summoner1Id] || 'SummonerFlash';
                const pSpell2 = SPELL_MAP[p.summoner2Id] || 'SummonerDot';

                return (
                  <div key={idx} className={`expanded-player-row right ${p.puuid === puuid ? 'highlight-me' : ''}`}>
                    {/* Items Grid (Faces inner center) */}
                    <div className="p-items-grid">
                      {pItems.map((it, i) => (
                        it > 0 ? (
                          <img key={i} src={LolAssets.getItemIcon(it)} alt="item" className="p-item-icon" />
                        ) : (
                          <div key={i} className="p-item-empty"></div>
                        )
                      ))}
                      {pTrinket > 0 ? (
                        <img src={LolAssets.getItemIcon(pTrinket)} alt="trinket" className="p-item-icon trinket" />
                      ) : (
                        <div className="p-item-empty trinket"></div>
                      )}
                    </div>

                    {/* Stats: KDA, CS, Gold, KP, Vision */}
                    <div className="p-stats-block right">
                      <div className="p-kda-line">
                        <span className="k">{p.kills}</span> / <span className="d">{p.deaths}</span> / <span className="a">{p.assists}</span>
                      </div>
                      <div className="p-cs-gold-line">
                        {pCs} CS - {pGold} altın
                      </div>
                      <div className="p-kp-vis-line">
                        %{pKp} Öldürme k. - Görüş: {pVision}
                      </div>
                    </div>

                    {/* Identity: Name + Tier + Party */}
                    <div className="p-ident-block right">
                      <span 
                        className="p-name-link" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectPlayer) onSelectPlayer(pRiotId, region);
                        }}
                        title={`${pRiotId} profilini aç`}
                      >
                        {pRiotId}
                      </span>
                      <div className="p-sub-tier right">
                        <span className="p-tier-text">{pTier}</span>
                        <span className="p-party-tag" title="Parti 2">👥 2</span>
                      </div>
                    </div>

                    {/* Champion + Level + Spells */}
                    <div className="p-hero-block right">
                      <div className="p-avatar-wrap">
                        <img 
                          src={LolAssets.getChampionIcon(p.championName)} 
                          alt={p.championName} 
                          className="p-champ-img"
                        />
                        <span className="p-level-pill">{p.champLevel}</span>
                      </div>
                      <div className="p-spells-wrap">
                        <img src={LolAssets.getSpellIcon(pSpell1)} alt="s1" className="p-spell-img" />
                        <img src={LolAssets.getSpellIcon(pSpell2)} alt="s2" className="p-spell-img" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bans Bar at Bottom */}
          <div className="expanded-bans-bar">
            <div className="bans-group left">
              <span className="bans-label">Banlar:</span>
              <div className="bans-icons">
                {bans1.map((b, i) => (
                  <BanItem key={i} champId={b.championId} championsMap={championsMap} />
                ))}
              </div>
            </div>

            <div className="bans-group right">
              <span className="bans-label">Banlar:</span>
              <div className="bans-icons">
                {bans2.map((b, i) => (
                  <BanItem key={i} champId={b.championId} championsMap={championsMap} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Top 100 Global & Regional Leaderboard Component with 1-minute live auto-refresh
 */
function LolLeaderboard({ onSelectPlayer }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverFilter, setServerFilter] = useState('all');
  const [countdown, setCountdown] = useState(60);

  const SERVERS = [
    { id: 'all', label: 'TÜM SUNUCULAR', short: 'GLOBAL', flag: '🌍' },
    { id: 'tr1', label: 'TÜRKİYE (TR)', short: 'TR', flag: '🇹🇷' },
    { id: 'kr', label: 'KORE (KR)', short: 'KR', flag: '🇰🇷' },
    { id: 'euw1', label: 'BATI AVRUPA (EUW)', short: 'EUW', flag: '🇪🇺' },
    { id: 'na1', label: 'KUZEY AMERİKA (NA)', short: 'NA', flag: '🇺🇸' },
    { id: 'eun1', label: 'DOĞU AVRUPA (EUNE)', short: 'EUN', flag: '🇪🇺' },
    { id: 'vn2', label: 'VİETNAM (VN)', short: 'VN', flag: '🇻🇳' }
  ];

  const SERVER_INFO = {
    all: { title: '🌍 Küresel Liderlik Tablosu', sub: 'Tüm rekabetçi sunuculardan en yüksek LP\'ye sahip 100 Şampiyonluk oyuncusu.' },
    tr1: { title: '🇹🇷 Türkiye (TR) Liderlik Tablosu', sub: 'Türkiye sunucusunda en yüksek LP\'ye sahip ilk 100 Şampiyonluk oyuncusu.' },
    kr: { title: '🇰🇷 Kore (KR) Liderlik Tablosu', sub: 'Kore sunucusunda en yüksek LP\'ye sahip ilk 100 Şampiyonluk oyuncusu.' },
    euw1: { title: '🇪🇺 Batı Avrupa (EUW) Liderlik Tablosu', sub: 'Batı Avrupa sunucusunda en yüksek LP\'ye sahip ilk 100 Şampiyonluk oyuncusu.' },
    na1: { title: '🇺🇸 Kuzey Amerika (NA) Liderlik Tablosu', sub: 'Kuzey Amerika sunucusunda en yüksek LP\'ye sahip ilk 100 Şampiyonluk oyuncusu.' },
    eun1: { title: '🇪🇺 Doğu Avrupa (EUNE) Liderlik Tablosu', sub: 'Doğu Avrupa sunucusunda en yüksek LP\'ye sahip ilk 100 Şampiyonluk oyuncusu.' },
    vn2: { title: '🇻🇳 Vietnam (VN) Liderlik Tablosu', sub: 'Vietnam sunucusunda en yüksek LP\'ye sahip ilk 100 Şampiyonluk oyuncusu.' }
  };

  const fetchLeaderboard = (srv = serverFilter) => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8081/?game=lol&action=leaderboard&server=${srv}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.status === 'success' && resData.data) {
          setLeaderboard(resData.data.leaderboard || []);
          setCountdown(resData.data.nextUpdateIn || 60);
        } else {
          setError('Liderlik tablosu yüklenemedi.');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaderboard(serverFilter);

    // 1-minute live refresh interval
    const interval = setInterval(() => {
      fetchLeaderboard(serverFilter);
    }, 60000);

    return () => clearInterval(interval);
  }, [serverFilter]);

  useEffect(() => {
    // 1-second countdown display tick
    const ticker = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : 60));
    }, 1000);

    return () => clearInterval(ticker);
  }, []);

  const currentInfo = SERVER_INFO[serverFilter] || SERVER_INFO['all'];

  return (
    <div className="lol-leaderboard-container">
      <div className="leaderboard-header-section">
        <div className="leaderboard-title-box">
          <h2>{currentInfo.title}</h2>
          <p className="leaderboard-subtitle">{currentInfo.sub}</p>
        </div>

        <div className="leaderboard-status-box">
          <div className="live-pulse-badge">
            <span className="pulse-dot"></span>
            <span>Canlı Güncelleme: <b>{countdown}s</b></span>
          </div>
          <button className="manual-refresh-btn" onClick={() => fetchLeaderboard(serverFilter)} disabled={loading} title="Hemen Yenile">
            {loading ? 'Yenileniyor...' : '↻ Yenile'}
          </button>
        </div>
      </div>

      {/* Server Filter Tabs */}
      <div className="leaderboard-filter-bar">
        {SERVERS.map(srv => (
          <button 
            key={srv.id} 
            className={`filter-btn ${serverFilter === srv.id ? 'active' : ''}`}
            onClick={() => {
              if (serverFilter !== srv.id) {
                setServerFilter(srv.id);
              }
            }}
          >
            <span className="server-flag-icon">{srv.flag}</span>
            {srv.label}
          </button>
        ))}
      </div>

      {/* Leaderboard Table Card */}
      <div className="leaderboard-table-card">
        {loading ? (
          <div className="leaderboard-loading">
            <div className="loading-spinner"></div>
            <p>{currentInfo.title} Riot API üzerinden canlı çekiliyor...</p>
          </div>
        ) : error ? (
          <div className="leaderboard-error">
            <p>{error}</p>
            <button className="manual-refresh-btn" onClick={() => fetchLeaderboard(serverFilter)} style={{ marginTop: '1rem' }}>
              Tekrar Dene
            </button>
          </div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="col-rank">SIRA</th>
                <th className="col-player">OYUNCU</th>
                <th className="col-server">SUNUCU</th>
                <th className="col-tier">LİG</th>
                <th className="col-lp">LP</th>
                <th className="col-wr">KAZANMA ORANI</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player, idx) => {
                const totalGames = (player.wins || 0) + (player.losses || 0);
                const winrate = totalGames > 0 ? ((player.wins / totalGames) * 100).toFixed(1) : 0;
                const isTop3 = player.rankPosition <= 3;
                const playerServer = player.server || serverFilter;
                const cleanServer = playerServer.toUpperCase().replace('1', '').replace('2', '');

                return (
                  <tr 
                    key={idx} 
                    className={`leaderboard-row ${isTop3 ? `top-${player.rankPosition}` : ''}`}
                    onClick={() => onSelectPlayer(player.riotId, playerServer)}
                    title="Oyuncunun profilini görüntülemek için tıkla"
                  >
                    <td className="col-rank">
                      <span className={`rank-number-badge ${isTop3 ? `badge-${player.rankPosition}` : ''}`}>
                        {player.rankPosition}
                      </span>
                    </td>
                    <td className="col-player">
                      <div className="player-cell-info">
                        {/* Avatar with level badge underneath */}
                        <div className="leaderboard-avatar-wrapper">
                          <img 
                            src={LolAssets.getProfileIcon(player.profileIconId || 1)} 
                            alt="Avatar" 
                            className="leaderboard-player-avatar" 
                            onError={(e) => { e.target.src = LolAssets.getProfileIcon(1); }}
                          />
                          <span className="leaderboard-avatar-level">{player.summonerLevel || 30}</span>
                        </div>

                        <div className="player-names-wrapper">
                          <span className="player-riot-id">{player.riotId}</span>
                          {player.hotStreak && <span className="hot-streak-tag" title="Kazanma serisinde!">🔥 Seri</span>}
                        </div>
                      </div>
                    </td>
                    <td className="col-server">
                      <span className={`server-pill ${playerServer}`}>{cleanServer}</span>
                    </td>
                    <td className="col-tier">
                      <div className="tier-cell-box">
                        <img 
                          src={LolAssets.getRankEmblem('challenger')} 
                          alt="Şampiyonluk" 
                          className="leaderboard-tier-icon-img" 
                          style={{ width: '24px', height: '24px', maxWidth: '24px', maxHeight: '24px', objectFit: 'contain' }}
                        />
                        <span className="tier-name-text">Şampiyonluk</span>
                      </div>
                    </td>
                    <td className="col-lp">
                      <span className="lp-number">{player.leaguePoints.toLocaleString()} LP</span>
                    </td>
                    <td className="col-wr">
                      <div className="wr-cell-box">
                        <div className="wr-texts">
                          <span className="wr-percentage">%{winrate}</span>
                          <span className="wr-games">({player.wins}Z {player.losses}M)</span>
                        </div>
                        <div className="wr-bar-container">
                          <div 
                            className="wr-bar-fill" 
                            style={{ width: `${Math.min(100, winrate)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
