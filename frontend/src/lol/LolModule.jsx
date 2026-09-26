import React, { useState, useEffect, useRef } from 'react';
import './Lol.css';
import { LolAssets, LolLogoIcon } from './lolAssets';

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
  420: 'Dereceli Tek/Çift',
  440: 'Dereceli Esnek',
  400: 'Normal (Taslak)',
  430: 'Normal (Kör)',
  450: 'ARAM',
  1700: 'Arena'
};

const POPULAR_PLAYERS_FALLBACK = [
  { riotId: 'Hide on bush#KR1', region: 'kr', icon: 6, level: 940 },
  { riotId: 'Thebausffs#EUW', region: 'euw1', icon: 4568, level: 820 },
  { riotId: 'Caps#EUW', region: 'euw1', icon: 3200, level: 650 },
  { riotId: 'ca koi#vn444', region: 'vn2', icon: 54, level: 320 },
  { riotId: 'CA HUYEN#1315', region: 'euw1', icon: 29, level: 210 },
  { riotId: 'CaitlyneAşığım#CAIT', region: 'tr1', icon: 3460, level: 420 },
  { riotId: 'HolyPhoenix#TR1', region: 'tr1', icon: 580, level: 640 },
  { riotId: 'Elwind#TR1', region: 'tr1', icon: 4500, level: 530 },
  { riotId: 'Doublelift#NA1', region: 'na1', icon: 512, level: 710 },
  { riotId: 'Nemesis#KR1', region: 'kr', icon: 77, level: 490 },
  { riotId: 'Agurin#EUW', region: 'euw1', icon: 4220, level: 890 },
  { riotId: 'Dopa#KR1', region: 'kr', icon: 1, level: 510 }
];

export default function LolModule({ onBack }) {
  const [activeNav, setActiveNav] = useState('summoners'); // 'summoners' | 'leaderboard' | 'champions'
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
            if (playerData || activeNav === 'leaderboard') {
              handleGoHome();
            } else {
              onBack();
            }
          }} 
          title={playerData || activeNav === 'leaderboard' ? "Arama Sayfasına Dön" : "Ana Menüye Dön"}
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
        </div>
      </div>

      {/* Main Views */}
      {activeNav === 'leaderboard' ? (
        <LolLeaderboard onSelectPlayer={(selectedId, selectedReg) => handleSearchSubmit(selectedId, selectedReg)} />
      ) : (
        <>
          {/* Hero / Search Section */}
          <div className={`lol-hero-section ${playerData ? 'compact' : ''}`}>
            {!playerData && (
              <>
                <h1 className="lol-hero-title">Sihirdarını Keşfet</h1>
                <p className="lol-hero-subtitle">İstatistikler, Ligler, Maç Geçmişi ve Çok Daha Fazlası.</p>
              </>
            )}
            
            <div className="lol-search-wrapper" ref={wrapperRef}>
              <form className="lol-search-box" onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(); }}>
                <input 
                  type="text" 
                  placeholder="OyuncuAdı#Etiket veya Şampiyon" 
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
                            setRiotId(champ.name);
                            setShowDropdown(false);
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
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && <div className="lol-error-message">{error}</div>}
          </div>

          {/* Main Profile View */}
          {playerData && (
            <div className="lol-player-results">
               <PlayerProfile 
                 data={playerData} 
                 championsMap={championsMap} 
                 region={region} 
               />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PlayerProfile({ data, championsMap, region }) {
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

  const totalSoloGames = soloQ ? (soloQ.wins + soloQ.losses) : 0;
  const soloWinrate = totalSoloGames > 0 ? ((soloQ.wins / totalSoloGames) * 100).toFixed(1) : 0;

  const totalFlexGames = flexQ ? (flexQ.wins + flexQ.losses) : 0;
  const flexWinrate = totalFlexGames > 0 ? ((flexQ.wins / totalFlexGames) * 100).toFixed(1) : 0;

  const displayTotalGames = totalSoloGames > 0 ? totalSoloGames : (totalFlexGames > 0 ? totalFlexGames : 0);
  const displayWinrate = totalSoloGames > 0 ? soloWinrate : (totalFlexGames > 0 ? flexWinrate : 0);

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
            </div>
            <div className="lol-profile-names-large">
              <h2>
                {account.gameName}
                <span className="lol-tagline-large">#{account.tagLine} ({cleanRegion})</span>
              </h2>
              <p className="lol-profile-subtitle">
                Seviye {summoner.summonerLevel} • En Çok Oynanan: <span className="highlight-champ">{topChampName}</span> ({mastery?.[0]?.championPoints ? mastery[0].championPoints.toLocaleString() : '0'} Ustalık)
              </p>
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

      {/* Main Grid */}
      <div className="lol-profile-grid">
        
        {/* Left Column (Ranks, Enemy MMR, Tags, Match History) */}
        <div className="lol-profile-left">
          
          {/* Bireysel Derece Card */}
          <div className="lol-card lol-ranks-card">
            <div className="card-header-line">
              <h3>Bireysel Derece</h3>
            </div>
            
            {/* Solo Queue Primary */}
            <RankDetailedRow title="Tekli Sıra" stats={soloQ} isPrimary={true} />

            <div className="rank-divider-horizontal"></div>

            {/* Flex Queue Secondary */}
            <RankDetailedRow title="Taslak Sıralaması Flex" stats={flexQ} isPrimary={false} />
          </div>

          {/* Ortalama Düşman Derecesi */}
          <div className="lol-card lol-enemy-mmr-card">
            <h3>Ortalama Düşman Derecesi</h3>
            <div className="enemy-mmr-content">
              <div className="mmr-icon-badge">
                <span className="mmr-tier-icon">⚔️</span>
              </div>
              <div className="mmr-text">
                <span className="mmr-tier-title">{soloQ ? `${soloQ.tier} ${soloQ.rank}` : (flexQ ? `${flexQ.tier} ${flexQ.rank}` : 'Gümüş IV')}</span>
                <span className="mmr-sub">Ortalama Düşman Derecesi (Son Maçlar)</span>
              </div>
            </div>
          </div>

          {/* Badges / Playstyle Tags */}
          <div className="lol-badges-container">
            <span className="style-badge gold">S2025 {soloQ?.tier || 'Dereceli'}</span>
            <span className="style-badge green">Art arda kazanan</span>
            <span className="style-badge teal">{topChampName} Bağımlısı</span>
            <span className="style-badge blue">Kartopları</span>
            <span className="style-badge purple">İyi Başlangıçlar</span>
            <span className="style-badge red">Ardı ardına kaybetme</span>
          </div>

          {/* Son Maçlar (Match History) */}
          <div className="lol-card lol-match-history-card">
            <div className="match-history-header">
              <h3>Son Maçlar</h3>
              <div className="match-filters">
                <span className="filter-chip active">Tüm şampiyonlar ▾</span>
                <span className="filter-chip">Tüm Sıralar ▾</span>
                <span className="filter-chip">Herkesle ▾</span>
              </div>
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
              <button className="q-tab more">Daha fazla ▾</button>
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
                    <span className="chart-value">{displayWinrate}%</span>
                 </div>
                 <p className="chart-label">Kazanma Oranı</p>
              </div>
            </div>

            {/* Oynadığı Şampiyonlar Tablosu */}
            <div className="champions-table-section">
              <div className="table-header-row">
                <span className="col-champ">Şampiyon</span>
                <span className="col-played">Oynadığı</span>
                <span className="col-winrate">Kazanma Oranı</span>
              </div>

              <div className="champions-list">
                {mastery && mastery.length > 0 ? (
                  mastery.map((m, i) => {
                    const champName = championsMap[m.championId] || 'Unknown';
                    const pseudoGames = Math.max(1, Math.round(m.championPoints / 12000));
                    const pseudoWinrate = (45 + ((m.championPoints % 30) - 10) * 0.8).toFixed(1);
                    const isGood = parseFloat(pseudoWinrate) >= 50;

                    return (
                      <div key={i} className="champ-row">
                        <div className="champ-info-cell">
                          <div className="champ-avatar-box">
                            <img 
                              src={LolAssets.getChampionIcon(champName)} 
                              alt={champName} 
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <span className="mastery-lvl-badge">{m.championLevel}</span>
                          </div>
                          <div className="champ-titles">
                            <span className="champ-name">{champName}</span>
                            <span className="champ-sub-rank">Derece: #{Math.max(1000, 150000 - i * 12000).toLocaleString()}</span>
                            <span className="champ-points-text">{m.championPoints.toLocaleString()} Puan</span>
                          </div>
                        </div>

                        <div className="champ-played-cell">
                          <span className="played-num">{pseudoGames}</span>
                          <div className="bar-bg">
                            <div className="bar-fill blue" style={{ width: `${Math.min(100, pseudoGames * 2)}%` }}></div>
                          </div>
                        </div>

                        <div className="champ-winrate-cell">
                          <span className="winrate-num">{pseudoWinrate}%</span>
                          <div className="bar-bg">
                            <div className={`bar-fill ${isGood ? 'green' : 'red'}`} style={{ width: `${Math.min(100, pseudoWinrate)}%` }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="no-data">Şampiyon verisi bulunamadı.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

function RankDetailedRow({ title, stats, isPrimary }) {
  if (!stats) {
    return (
      <div className={`rank-row-box unranked ${isPrimary ? 'primary' : 'secondary'}`}>
        <div className="tier-emblem unranked">⚪</div>
        <div className="rank-info-block">
          <span className="tier-label">{isPrimary ? 'Iron I' : 'Derecesiz'}</span>
          <span className="queue-label">{title}</span>
          <span className="lp-status">LP: 0 • Zafer: 0 - Kayıplar: 0</span>
        </div>
      </div>
    );
  }

  const totalGames = stats.wins + stats.losses;
  const winrate = totalGames > 0 ? ((stats.wins / totalGames) * 100).toFixed(1) : 0;
  const tierLower = (stats.tier || 'unranked').toLowerCase();

  return (
    <div className={`rank-row-box tier-${tierLower} ${isPrimary ? 'primary' : 'secondary'}`}>
      <div className={`tier-emblem-badge ${tierLower}`}>
        {stats.tier.charAt(0)}
      </div>
      <div className="rank-info-block">
        <div className="tier-head">
          <span className="tier-label">{stats.tier} {stats.rank}</span>
          <span className="queue-label">{title}</span>
        </div>
        <div className="tier-stats-line">
          <span className="lp-val">LP: {stats.leaguePoints}</span>
          <span className="wl-val">Zafer: <b className="win-c">{stats.wins}</b> - Kayıplar: <b className="loss-c">{stats.losses}</b></span>
          <span className={`wr-val ${winrate >= 50 ? 'pos' : 'neg'}`}>%{winrate} Kazanma Oranı</span>
        </div>
      </div>
    </div>
  );
}

function MatchItem({ matchId, puuid, region, championsMap }) {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const durationSec = matchData.info.gameDuration % 60;
  const queueName = QUEUE_MAP[matchData.info.queueId] || 'Normal Maç';

  const team1 = matchData.info.participants.slice(0, 5);
  const team2 = matchData.info.participants.slice(5, 10);

  return (
    <div className={`match-card-league ${isWin ? 'win' : 'loss'}`}>
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
          {team1.map((p, idx) => (
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
          {team2.map((p, idx) => (
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
                        <span className="tier-icon-gold">🏆</span>
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
