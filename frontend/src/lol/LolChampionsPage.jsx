import React, { useState, useEffect, useMemo } from 'react';
import { LolAssets, RpIcon, MythicEssenceIcon, SkinRarityGem } from './lolAssets';
import { getChampionBuildData, getSkinMetadata, getSpellKey, getSpellNameById } from './championBuildService';
import { getChampionAbilitiesData } from './championAbilitiesService';
import LolAbilitiesView, { AbilityCard } from './LolAbilitiesView';

// Role mappings between Riot Data Dragon tags and Turkish labels
export const ROLE_DEFINITIONS = [
  { id: 'all', label: 'Tümü', icon: '✦' },
  { id: 'Fighter', label: 'Dövüşçü', icon: '⚔️' },
  { id: 'Mage', label: 'Büyücü', icon: '🔮' },
  { id: 'Assassin', label: 'Suikastçı', icon: '🗡️' },
  { id: 'Marksman', label: 'Nişancı', icon: '🏹' },
  { id: 'Tank', label: 'Tank', icon: '🛡️' },
  { id: 'Support', label: 'Destek', icon: '💚' }
];

export const ROLE_LABELS_TR = {
  Fighter: 'Dövüşçü',
  Mage: 'Büyücü',
  Assassin: 'Suikastçı',
  Marksman: 'Nişancı',
  Tank: 'Tank',
  Support: 'Destek'
};

export default function LolChampionsPage({ 
  onSelectChampion, 
  onSearchPlayer, 
  initialChampionName = null, 
  onClearInitialChampion = null 
}) {
  const [champions, setChampions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc');

  // Selected Champion for Full-Page View (Replacing the modal popup)
  const [selectedChampion, setSelectedChampion] = useState(null);

  // If initialChampionName is provided or changes, find and open that champion
  useEffect(() => {
    if (initialChampionName && champions.length > 0) {
      const cleanSearch = String(initialChampionName).trim().toLowerCase();
      const found = champions.find(c => 
        c.name.toLowerCase() === cleanSearch ||
        c.id.toLowerCase() === cleanSearch ||
        c.name.toLowerCase().replace(/['\s\.]/g, '') === cleanSearch.replace(/['\s\.]/g, '') ||
        c.id.toLowerCase().replace(/['\s\.]/g, '') === cleanSearch.replace(/['\s\.]/g, '')
      );
      if (found) {
        setSelectedChampion(found);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [initialChampionName, champions]);

  // Fetch all champions from Riot Data Dragon
  useEffect(() => {
    let isMounted = true;
    const version = LolAssets.getVersion() || '14.5.1';

    const loadAllChampions = async () => {
      try {
        setLoading(true);
        let res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/tr_TR/champion.json`);
        if (!res.ok) {
          res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`);
        }
        const json = await res.json();
        if (isMounted && json && json.data) {
          const list = Object.values(json.data);
          setChampions(list);
        }
      } catch (err) {
        console.error('Data Dragon champion load failed:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAllChampions();
    return () => { isMounted = false; };
  }, []);

  // Role Counts
  const roleCounts = useMemo(() => {
    const counts = { all: champions.length };
    champions.forEach(c => {
      if (Array.isArray(c.tags)) {
        c.tags.forEach(t => {
          counts[t] = (counts[t] || 0) + 1;
        });
      }
    });
    return counts;
  }, [champions]);

  // Filtered and Sorted Champions
  const filteredChampions = useMemo(() => {
    let list = [...champions];

    // Search query filter (name or title)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) || 
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q))
      );
    }

    // Role filter
    if (selectedRole !== 'all') {
      list = list.filter(c => Array.isArray(c.tags) && c.tags.includes(selectedRole));
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      list = list.filter(c => {
        const diff = c.info?.difficulty || 5;
        if (selectedDifficulty === 'easy') return diff <= 3;
        if (selectedDifficulty === 'medium') return diff >= 4 && diff <= 7;
        if (selectedDifficulty === 'hard') return diff >= 8;
        return true;
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'name_asc') {
        return (a.name || '').localeCompare(b.name || '', 'tr');
      }
      if (sortBy === 'name_desc') {
        return (b.name || '').localeCompare(a.name || '', 'tr');
      }
      if (sortBy === 'diff_asc') {
        return (a.info?.difficulty || 0) - (b.info?.difficulty || 0);
      }
      if (sortBy === 'diff_desc') {
        return (b.info?.difficulty || 0) - (a.info?.difficulty || 0);
      }
      if (sortBy === 'attack_desc') {
        return (b.info?.attack || 0) - (a.info?.attack || 0);
      }
      if (sortBy === 'defense_desc') {
        return (b.info?.defense || 0) - (a.info?.defense || 0);
      }
      if (sortBy === 'magic_desc') {
        return (b.info?.magic || 0) - (a.info?.magic || 0);
      }
      return 0;
    });

    return list;
  }, [champions, searchQuery, selectedRole, selectedDifficulty, sortBy]);

  const getDifficultyLabel = (diff) => {
    if (diff <= 3) return { label: 'Kolay', color: 'green' };
    if (diff <= 7) return { label: 'Orta', color: 'yellow' };
    return { label: 'İleri Seviye', color: 'red' };
  };

  // If a champion is selected, render the dedicated Full-Page Champion Profile!
  if (selectedChampion) {
    return (
      <ChampionDetailPage 
        champion={selectedChampion} 
        onBack={() => {
          setSelectedChampion(null);
          if (onClearInitialChampion) onClearInitialChampion();
        }}
        onSelectChampion={onSelectChampion}
        onSearchPlayer={onSearchPlayer}
      />
    );
  }

  // If initialChampionName is requested but champions list is still loading
  if (initialChampionName && !selectedChampion && loading) {
    return (
      <div className="champ-loading-box" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="lol-spinner"></div>
        <p style={{ marginTop: '1rem', color: '#c8aa6e', fontWeight: 600 }}>{initialChampionName} profili ve güncel analitik verileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="lol-champions-page">
      
      {/* 1. Header Banner & Stats Overview */}
      <section className="champ-page-header">
        <div className="champ-header-content">
          <div className="champ-header-pill">
            <span className="pulse-dot gold"></span>
            <span>Riot Games Data Dragon v{LolAssets.getVersion()}</span>
          </div>
          <h1 className="champ-page-title">League of Legends Şampiyonları</h1>
          <p className="champ-page-subtitle">
            Vadi'deki tüm şampiyonların rolleri, yetenek setleri, zorluk seviyeleri ve temel nitelikleri.
          </p>

          <div className="champ-quick-stats-row">
            <div className="champ-stat-chip">
              <span className="stat-icon">🛡️</span>
              <div className="stat-info">
                <span className="stat-val">{champions.length}</span>
                <span className="stat-lbl">Toplam Şampiyon</span>
              </div>
            </div>
            <div className="champ-stat-chip">
              <span className="stat-icon">⚔️</span>
              <div className="stat-info">
                <span className="stat-val">6 Farklı Rol</span>
                <span className="stat-lbl">Taktiksel Dağılım</span>
              </div>
            </div>
            <div className="champ-stat-chip">
              <span className="stat-icon">📜</span>
              <div className="stat-info">
                <span className="stat-val">%100 Türkçe</span>
                <span className="stat-lbl">Yetenek & Hikaye</span>
              </div>
            </div>
            <div className="champ-stat-chip">
              <span className="stat-icon">🎮</span>
              <div className="stat-info">
                <span className="stat-val">Sezon 2026</span>
                <span className="stat-lbl">Güncel Yama</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Controls: Search, Roles, Difficulty & Sorting */}
      <section className="champ-controls-section">
        
        {/* Top Control Bar: Search & Sorting */}
        <div className="champ-controls-top">
          <div className="champ-search-input-wrap">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              className="champ-search-input"
              placeholder="Şampiyon Adı veya Unvanı Ara... (örn: Yasuo, Ahri, Ashe, Jinx)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button" 
                className="champ-search-clear" 
                onClick={() => setSearchQuery('')}
                title="Aramayı Temizle"
              >
                ✕
              </button>
            )}
          </div>

          <div className="champ-sort-wrap">
            <label htmlFor="champ-sort-select" className="sort-label">Sırala:</label>
            <select 
              id="champ-sort-select"
              className="champ-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name_asc">İsme Göre (A - Z)</option>
              <option value="name_desc">İsme Göre (Z - A)</option>
              <option value="diff_asc">Zorluk (Kolay → Zor)</option>
              <option value="diff_desc">Zorluk (Zor → Kolay)</option>
              <option value="attack_desc">Saldırı Gücü (Yüksek)</option>
              <option value="defense_desc">Savunma Gücü (Yüksek)</option>
              <option value="magic_desc">Büyü Gücü (Yüksek)</option>
            </select>
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="champ-filter-row">
          <div className="role-tabs-wrap">
            {ROLE_DEFINITIONS.map(role => {
              const count = roleCounts[role.id] || 0;
              const isActive = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  className={`role-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <span className="role-btn-icon">{role.icon}</span>
                  <span className="role-btn-label">{role.label}</span>
                  <span className="role-btn-count">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Difficulty Quick Filter */}
          <div className="difficulty-tabs-wrap">
            <span className="diff-label">Zorluk:</span>
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'easy', label: 'Kolay' },
              { id: 'medium', label: 'Orta' },
              { id: 'hard', label: 'İleri' }
            ].map(diff => (
              <button
                key={diff.id}
                type="button"
                className={`diff-pill-btn ${selectedDifficulty === diff.id ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty(diff.id)}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="champ-results-bar">
          <span className="results-count-text">
            <strong>{filteredChampions.length}</strong> şampiyon listeleniyor
            {selectedRole !== 'all' && <span> • Rol: <strong>{ROLE_LABELS_TR[selectedRole]}</strong></span>}
            {selectedDifficulty !== 'all' && <span> • Zorluk: <strong>{selectedDifficulty.toUpperCase()}</strong></span>}
            {searchQuery && <span> • Arama: "<em>{searchQuery}</em>"</span>}
          </span>
          {(searchQuery || selectedRole !== 'all' || selectedDifficulty !== 'all') && (
            <button 
              type="button" 
              className="reset-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedRole('all');
                setSelectedDifficulty('all');
                setSortBy('name_asc');
              }}
            >
              Filtreleri Sıfırla
            </button>
          )}
        </div>
      </section>

      {/* 3. Champions Grid */}
      <section className="champ-grid-section">
        {loading ? (
          <div className="champ-loading-box">
            <div className="lol-spinner"></div>
            <p>Vadi'nin tüm şampiyonları Data Dragon üzerinden yükleniyor...</p>
          </div>
        ) : filteredChampions.length === 0 ? (
          <div className="champ-empty-box">
            <span className="empty-icon">🔍</span>
            <h3>Aradığınız kriterlere uygun şampiyon bulunamadı.</h3>
            <p>Farklı bir arama terimi deneyebilir veya filtreleri sıfırlayabilirsiniz.</p>
            <button 
              type="button" 
              className="empty-reset-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedRole('all');
                setSelectedDifficulty('all');
              }}
            >
              Tüm Şampiyonları Göster
            </button>
          </div>
        ) : (
          <div className="champions-card-grid">
            {filteredChampions.map(champ => {
              const diffInfo = getDifficultyLabel(champ.info?.difficulty || 5);
              const loadingImgUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champ.id}_0.jpg`;
              const iconImgUrl = LolAssets.getChampionIcon(champ.id);

              return (
                <div 
                  key={champ.id} 
                  className="champ-card"
                  onClick={() => {
                    setSelectedChampion(champ);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {/* Vertical Loading Screen Background Art */}
                  <div className="champ-card-media">
                    <img 
                      src={loadingImgUrl} 
                      alt={champ.name} 
                      className="champ-loading-art"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = iconImgUrl;
                        e.target.classList.add('fallback-icon-mode');
                      }}
                    />
                    <div className="champ-card-gradient"></div>

                    {/* Top Difficulty Pip */}
                    <div className={`champ-diff-badge ${diffInfo.color}`} title={`Zorluk Derecesi: ${champ.info?.difficulty || 5}/10`}>
                      <span>{diffInfo.label}</span>
                    </div>

                    {/* Roles Badges */}
                    <div className="champ-roles-container">
                      {Array.isArray(champ.tags) && champ.tags.map(t => (
                        <span key={t} className={`champ-role-tag ${t.toLowerCase()}`}>
                          {ROLE_LABELS_TR[t] || t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="champ-card-info">
                    <h3 className="champ-card-name">{champ.name}</h3>
                    <p className="champ-card-title">{champ.title}</p>

                    {/* Stat Bars (Attack, Defense, Magic) */}
                    <div className="champ-mini-bars">
                      <div className="mini-bar-row" title={`Saldırı: ${champ.info?.attack || 0}/10`}>
                        <span className="bar-tag">SAL</span>
                        <div className="bar-track">
                          <div className="bar-fill attack" style={{ width: `${((champ.info?.attack || 1) / 10) * 100}%` }}></div>
                        </div>
                      </div>
                      <div className="mini-bar-row" title={`Savunma: ${champ.info?.defense || 0}/10`}>
                        <span className="bar-tag">SAV</span>
                        <div className="bar-track">
                          <div className="bar-fill defense" style={{ width: `${((champ.info?.defense || 1) / 10) * 100}%` }}></div>
                        </div>
                      </div>
                      <div className="mini-bar-row" title={`Büyü: ${champ.info?.magic || 0}/10`}>
                        <span className="bar-tag">BÜY</span>
                        <div className="bar-track">
                          <div className="bar-fill magic" style={{ width: `${((champ.info?.magic || 1) / 10) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Call to Action */}
                    <div className="champ-card-hover-prompt">
                      <span>Profili İncele →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}

// Strip raw HTML tags and decode entities from Riot Data Dragon text
function cleanDescription(text) {
  if (!text) return '';
  return text
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

/**
 * DEDICATED FULL-PAGE CHAMPION PROFILE & ANALYTICS
 * Includes official 2026 Season Runes, Skill Max 1-18 Order Matrix,
 * Item Progression (Starting, Core, Situational), Pro Builds, and Best Players Leaderboard!
 */
function ChampionDetailPage({ champion, onBack, onSelectChampion, onSearchPlayer }) {
  const [champDetail, setChampDetail] = useState(null);
  const [cdSkinsMap, setCdSkinsMap] = useState({});
  const [buildData, setBuildData] = useState(null);
  const [abilitiesData, setAbilitiesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'abilities' | 'pro_builds' | 'best_players' | 'skins' | 'tips'
  const [activeSkinIdx, setActiveSkinIdx] = useState(0);
  const [activeSpellKey, setActiveSpellKey] = useState('P'); // 'P' | 'Q' | 'W' | 'E' | 'R'
  const [runeMode, setRuneMode] = useState('popular'); // 'popular' | 'situational'

  // Fetch individual champion details and rich build data
  useEffect(() => {
    let isMounted = true;
    const version = LolAssets.getVersion() || '14.5.1';

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setActiveSkinIdx(0);
        setActiveSpellKey('P');

        // 1. Fetch Data Dragon detail
        let res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/tr_TR/champion/${champion.id}.json`);
        if (!res.ok) {
          res = await fetch(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${champion.id}.json`);
        }
        const json = await res.json();
        let fetchedChamp = null;
        if (isMounted && json?.data?.[champion.id]) {
          fetchedChamp = json.data[champion.id];
          setChampDetail(fetchedChamp);
        }

        // 2. Fetch CommunityDragon Turkish skins metadata (rarity, isLegacy, description, price)
        try {
          const champKey = champion.key || fetchedChamp?.key || champion.id;
          const cdRes = await fetch(`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/tr_tr/v1/champions/${champKey}.json`);
          if (cdRes.ok) {
            const cdJson = await cdRes.json();
            if (isMounted && Array.isArray(cdJson?.skins)) {
              const map = {};
              cdJson.skins.forEach(s => {
                const num = s.id % 1000;
                map[num] = s;
              });
              setCdSkinsMap(map);
            }
          }
        } catch (cdErr) {
          console.warn('CommunityDragon skin data load warning:', cdErr);
        }

        // 3. Fetch official build data, runes, skill order, items, pro builds
        const builds = await getChampionBuildData(champion);
        if (isMounted) {
          setBuildData(builds);
        }

        // 4. Fetch official Meraki Wiki abilities with exact damage scalings & ratios
        try {
          const abData = await getChampionAbilitiesData(champion.id, fetchedChamp);
          if (isMounted) {
            setAbilitiesData(abData);
          }
        } catch (abErr) {
          console.warn('Abilities data load warning:', abErr);
        }
      } catch (err) {
        console.error('Failed to load champion detail & build:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllData();

    // Listen to ESC key to easily go back to grid
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [champion.id]);

  // Filter out all chromas / color variants
  const cleanSkins = useMemo(() => {
    if (!champDetail?.skins || !Array.isArray(champDetail.skins)) return [];
    return champDetail.skins.filter(s => {
      if (!s || !s.name) return false;
      const lower = s.name.toLowerCase();
      if (s.name.includes('(') || s.name.includes(')')) return false;
      if (lower.includes('rengi') || lower.includes('chroma')) return false;
      return true;
    });
  }, [champDetail]);

  const diffScore = champion.info?.difficulty || 5;
  const diffLabel = diffScore <= 3 ? 'Kolay' : diffScore <= 7 ? 'Orta' : 'İleri Seviye';
  const diffColor = diffScore <= 3 ? 'green' : diffScore <= 7 ? 'yellow' : 'red';

  // Get active ability object
  const activeAbility = useMemo(() => {
    if (!champDetail) return null;
    if (activeSpellKey === 'P') {
      return {
        key: 'PASİF',
        name: champDetail.passive?.name || 'Pasif Yetenek',
        desc: cleanDescription(champDetail.passive?.description),
        image: `https://ddragon.leagueoflegends.com/cdn/${LolAssets.getVersion()}/img/passive/${champDetail.passive?.image?.full}`,
        cooldown: null,
        cost: null
      };
    }
    const idx = activeSpellKey === 'Q' ? 0 : activeSpellKey === 'W' ? 1 : activeSpellKey === 'E' ? 2 : 3;
    const spell = champDetail.spells?.[idx];
    if (!spell) return null;
    return {
      key: activeSpellKey,
      name: spell.name,
      desc: cleanDescription(spell.description),
      image: `https://ddragon.leagueoflegends.com/cdn/${LolAssets.getVersion()}/img/spell/${spell.image?.full}`,
      cooldown: spell.cooldownBurn,
      cost: spell.costBurn && spell.costBurn !== '0' ? `${spell.costBurn} ${champDetail.partype || 'Mana'}` : null
    };
  }, [champDetail, activeSpellKey]);

  return (
    <div className="champion-page-view">
      
      {/* Top Profile Header (Hextech Hero Banner) */}
      <div 
        className="champ-profile-hero"
        style={{
          backgroundImage: `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_${activeSkinIdx}.jpg)`
        }}
      >
        <div className="champ-profile-hero-overlay"></div>

        {/* Hero Top Action Bar */}
        <div className="champ-hero-topbar">
          <button 
            type="button" 
            className="champ-back-to-grid-btn"
            onClick={onBack}
            title="Şampiyonlar Listesine Dön (ESC)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Tüm Şampiyonlara Dön</span>
          </button>

          <button 
            type="button" 
            className="champ-hero-search-btn"
            onClick={() => onSelectChampion && onSelectChampion(champion.name)}
            title="Sihirdar Arama Sayfasına Aktar"
          >
            <span>🔍 Sihirdar Aramasında Bu Şampiyonu Ara</span>
          </button>
        </div>

        {/* Hero Identity Content */}
        <div className="champ-hero-identity-row">
          <div className="champ-hero-avatar-wrap">
            <img 
              src={LolAssets.getChampionIcon(champion.id)} 
              alt={champion.name}
              className="champ-hero-avatar"
            />
          </div>

          <div className="champ-hero-info">
            <div className="champ-hero-tags">
              {Array.isArray(champion.tags) && champion.tags.map(t => (
                <span key={t} className={`hero-role-pill ${t.toLowerCase()}`}>
                  {ROLE_LABELS_TR[t] || t}
                </span>
              ))}
              <span className={`hero-diff-pill ${diffColor}`}>
                Zorluk: {diffScore}/10 ({diffLabel})
              </span>
              <span className="hero-partype-pill">
                Kaynak: {champDetail?.partype || champion.partype || 'Mana'}
              </span>
              <span className="hero-tier-pill">
                {buildData?.metaStats?.tier || 'S'} Seviye
              </span>
            </div>

            <div className="champ-hero-titles">
              <h1 className="champ-hero-name">{champion.name}</h1>
              <span className="champ-hero-sub">{champion.title}</span>
            </div>

            <div className="champ-hero-blurb">
              <div className="champ-lore-badge">
                <span className="lore-book-icon">📜</span>
                <span>Resmi Oyun Hikayesi (Biyografi)</span>
              </div>
              <p className="champ-lore-text">"{cleanDescription(champDetail?.lore || champion.lore || (champion.blurb ? champion.blurb.replace(/\s*\.{3,}$/, '') : ''))}"</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="champ-hero-tabs-ribbon">
          <button 
            type="button" 
            className={`champ-ribbon-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            ✨ Genel Bakış & Rün / Build
          </button>
          <button 
            type="button" 
            className={`champ-ribbon-tab ${activeTab === 'abilities' ? 'active' : ''}`}
            onClick={() => setActiveTab('abilities')}
          >
            ⚡ Yetenekler & Tam Hasarlar (Wiki)
          </button>
          <button 
            type="button" 
            className={`champ-ribbon-tab ${activeTab === 'pro_builds' ? 'active' : ''}`}
            onClick={() => setActiveTab('pro_builds')}
          >
            🏆 Pro Oyuncu Yapıları ({buildData?.proBuilds?.length || 5})
          </button>
          <button 
            type="button" 
            className={`champ-ribbon-tab ${activeTab === 'best_players' ? 'active' : ''}`}
            onClick={() => setActiveTab('best_players')}
          >
            👑 En İyi Oyuncular (Top 10)
          </button>
          <button 
            type="button" 
            className={`champ-ribbon-tab ${activeTab === 'skins' ? 'active' : ''}`}
            onClick={() => setActiveTab('skins')}
          >
            🎨 Kostüm Galerisi ({cleanSkins.length})
          </button>
          <button 
            type="button" 
            className={`champ-ribbon-tab ${activeTab === 'tips' ? 'active' : ''}`}
            onClick={() => setActiveTab('tips')}
          >
            📖 Hikaye & Taktikler
          </button>
        </div>
      </div>

      {/* Main Dashboard Body */}
      <div className="champ-page-body">
        {loading ? (
          <div className="champ-page-loading">
            <div className="lol-spinner"></div>
            <p>{champion.name} rünleri, eşyaları ve istatistikleri yükleniyor...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: GENEL BAKIŞ & RÜNLER / EŞYALAR */}
            {activeTab === 'overview' && champDetail && buildData && (
              <div className="champ-comprehensive-overview">
                
                {/* 1. Top Meta Metrics & Counters Strip (Matching Screenshot 2) */}
                <div className="meta-stats-counters-banner">
                  
                  {/* Meta Gauges */}
                  <div className="meta-gauges-cluster">
                    <div className="gauge-item">
                      <div className="circle-gauge cyan">
                        <span className="gauge-val">%{buildData.metaStats.popularity}</span>
                      </div>
                      <span className="gauge-lbl">Popülerlik</span>
                    </div>

                    <div className="gauge-item">
                      <div className="circle-gauge green">
                        <span className="gauge-val">%{buildData.metaStats.winRate}</span>
                      </div>
                      <span className="gauge-lbl">Kazanma Oranı</span>
                    </div>

                    <div className="gauge-item">
                      <div className="circle-gauge red">
                        <span className="gauge-val">%{buildData.metaStats.banRate}</span>
                      </div>
                      <span className="gauge-lbl">Ban Oranı</span>
                    </div>
                  </div>

                  {/* Role Info Box */}
                  <div className="meta-role-summary-box">
                    <span className="box-mini-lbl">Birincil Rol</span>
                    <div className="role-main-row">
                      <span className="role-badge-large">{buildData.metaStats.role}</span>
                    </div>
                    <span className="meta-sample-text">{buildData.metaStats.sampleMatches}</span>
                  </div>

                  {/* Counters Matchups Box */}
                  <div className="meta-counters-strip">
                    <div className="counter-col disadvantage">
                      <span className="counter-col-title">Counterlar (Zorlandığı)</span>
                      <div className="counter-icons-row">
                        {buildData.counters.disadvantage.map((c, i) => (
                          <div key={i} className="counter-item" title={`${c.name} - Kazanma Oranı: %${c.winRate}`}>
                            <img src={LolAssets.getChampionIcon(c.id)} alt={c.name} />
                            <span className="counter-wr red">%{c.winRate}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="counter-col advantage">
                      <span className="counter-col-title">Counter'ı (Üstün Olduğu)</span>
                      <div className="counter-icons-row">
                        {buildData.counters.advantage.map((c, i) => (
                          <div key={i} className="counter-item" title={`${c.name} - Kazanma Oranı: %${c.winRate}`}>
                            <img src={LolAssets.getChampionIcon(c.id)} alt={c.name} />
                            <span className="counter-wr green">%{c.winRate}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* 2. Main Two-Column Dashboard */}
                <div className="overview-two-columns-grid">
                  
                  {/* LEFT COLUMN: Abilities, Skill Matrix, Runes & Spells */}
                  <div className="overview-col-left">
                    
                    {/* Panel A: Abilities & Pasif */}
                    <div className="dashboard-card abilities-card">
                      <div className="card-header-row">
                        <div className="card-title-wrap">
                          <span className="panel-badge-gold">BECERİ SETİ</span>
                          <h3 className="panel-title">Şampiyon Yetenekleri</h3>
                        </div>
                        <button 
                          type="button" 
                          className="panel-view-all-abilities-btn"
                          onClick={() => setActiveTab('abilities')}
                          title="Tüm yetenekleri (P, Q, W, E, R) alt alta formülleriyle incele"
                        >
                          Tüm Yetenekleri Gör (P, Q, W, E, R) →
                        </button>
                      </div>

                      {/* 5 Ability Quick Selector Strip */}
                      <div className="abilities-selector-strip">
                        <button
                          type="button"
                          className={`ability-select-btn ${activeSpellKey === 'P' ? 'active' : ''}`}
                          onClick={() => setActiveSpellKey('P')}
                        >
                          <div className="select-btn-img-wrap">
                            <img 
                              src={`https://ddragon.leagueoflegends.com/cdn/${LolAssets.getVersion()}/img/passive/${champDetail.passive?.image?.full}`} 
                              alt="Pasif" 
                            />
                            <span className="select-btn-key passive">PASİF</span>
                          </div>
                          <span className="select-btn-name">{champDetail.passive?.name}</span>
                        </button>

                        {['Q', 'W', 'E', 'R'].map((key, idx) => {
                          const spell = champDetail.spells?.[idx];
                          if (!spell) return null;
                          return (
                            <button
                              key={key}
                              type="button"
                              className={`ability-select-btn ${activeSpellKey === key ? 'active' : ''}`}
                              onClick={() => setActiveSpellKey(key)}
                            >
                              <div className="select-btn-img-wrap">
                                <img 
                                  src={`https://ddragon.leagueoflegends.com/cdn/${LolAssets.getVersion()}/img/spell/${spell.image?.full}`} 
                                  alt={key} 
                                />
                                <span className={`select-btn-key ${key.toLowerCase()}`}>{key}</span>
                              </div>
                              <span className="select-btn-name">{spell.name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Active Ability View (Wiki Card with Exact Damage Formulas & Scalings) */}
                      {abilitiesData?.abilities?.[activeSpellKey]?.[0] ? (
                        <div className="panel-active-wiki-ability">
                          <AbilityCard 
                            ability={abilitiesData.abilities[activeSpellKey][0]} 
                            abilityKey={activeSpellKey} 
                          />
                        </div>
                      ) : activeAbility ? (
                        <div className="active-ability-highlight-card">
                          <div className="highlight-top">
                            <div className="highlight-icon-box">
                              <img src={activeAbility.image} alt={activeAbility.name} />
                              <span className={`highlight-key-badge ${activeAbility.key.toLowerCase()}`}>
                                {activeAbility.key}
                              </span>
                            </div>
                            <div className="highlight-titles">
                              <h4 className="highlight-spell-name">{activeAbility.name}</h4>
                              <div className="highlight-meta-badges">
                                {activeAbility.cooldown && (
                                  <span className="meta-badge cooldown">
                                    ⏱️ Bekleme: {activeAbility.cooldown} sn
                                  </span>
                                )}
                                {activeAbility.cost && (
                                  <span className="meta-badge cost">
                                    💧 Bedel: {activeAbility.cost}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="highlight-desc-box">
                            <p>{activeAbility.desc}</p>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* Panel B: Skill Order Priority & Level 1-18 Matrix (Matching Screenshot 2) */}
                    <div className="dashboard-card skill-matrix-card">
                      <div className="card-header-row">
                        <div className="card-title-wrap">
                          <span className="panel-badge-cyan">MAX SIRASI</span>
                          <h3 className="panel-title">Yetenek Sırası & Seviye Dağılımı</h3>
                        </div>
                        <div className="card-header-stats">
                          <span>Popülerlik: <strong>%{buildData.skillPriority.pickRate}</strong></span>
                          <span>Kazanma: <strong className="green">%{buildData.skillPriority.winRate}</strong></span>
                        </div>
                      </div>

                      {/* Big Priority Badges (Q > W > E) */}
                      <div className="skill-priority-badges-row">
                        {buildData.skillPriority.order.map((key, kIdx) => {
                          const spellIdx = key === 'Q' ? 0 : key === 'W' ? 1 : key === 'E' ? 2 : 3;
                          const spell = champDetail.spells?.[spellIdx];
                          const iconUrl = spell?.image?.full ? `https://ddragon.leagueoflegends.com/cdn/${LolAssets.getVersion()}/img/spell/${spell.image.full}` : null;

                          return (
                            <React.Fragment key={key}>
                              <div className="skill-priority-pill">
                                {iconUrl && <img src={iconUrl} alt={key} className="skill-pill-icon" />}
                                <span className={`skill-pill-key ${key.toLowerCase()}`}>{key}</span>
                                <span className="skill-pill-name">{spell?.name}</span>
                              </div>
                              {kIdx < buildData.skillPriority.order.length - 1 && (
                                <span className="skill-arrow">›</span>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* 1-18 Leveling Grid Table (Identical to League of Graphs) */}
                      <div className="leveling-matrix-table-wrap">
                        <table className="leveling-matrix-table">
                          <thead>
                            <tr>
                              <th className="skill-name-col">Yetenek</th>
                              {Array.from({ length: 18 }, (_, i) => (
                                <th key={i + 1} className={i + 1 === 6 || i + 1 === 11 || i + 1 === 16 ? 'ult-col' : ''}>
                                  {i + 1}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {['Q', 'W', 'E', 'R'].map((key) => {
                              const spellIdx = key === 'Q' ? 0 : key === 'W' ? 1 : key === 'E' ? 2 : 3;
                              const spell = champDetail.spells?.[spellIdx];
                              const iconUrl = spell?.image?.full ? `https://ddragon.leagueoflegends.com/cdn/${LolAssets.getVersion()}/img/spell/${spell.image.full}` : null;

                              return (
                                <tr key={key}>
                                  <td className="skill-name-cell">
                                    {iconUrl && <img src={iconUrl} alt={key} className="table-spell-img" />}
                                    <span className={`table-spell-key ${key.toLowerCase()}`}>{key}</span>
                                  </td>
                                  {Array.from({ length: 18 }, (_, i) => {
                                    const isLeveled = buildData.skillPriority.matrix[key][i];
                                    return (
                                      <td key={i} className={`level-cell ${isLeveled ? 'leveled ' + key.toLowerCase() : ''}`}>
                                        {isLeveled ? key : ''}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Panel C: Meta Rune Tree & Summoner Spells (Ranked Solo/Duo Meta) */}
                    {(() => {
                      const currentRunes = (runeMode === 'situational' && buildData.situationalRunes) ? buildData.situationalRunes : buildData.runes;
                      if (!currentRunes) return null;

                      return (
                        <div className="dashboard-card runes-card">
                          <div className="card-header-row">
                            <div className="card-title-wrap">
                              <span className="panel-badge-gold">META RÜNLER</span>
                              <h3 className="panel-title">En Çok Tercih Edilen Rün Ağacı</h3>
                            </div>
                            <div className="card-header-stats">
                              {/* Popüler / Duruma Göre Toggle Buttons (Matching Screenshot 2) */}
                              <div className="rune-mode-toggle-group">
                                <button
                                  type="button"
                                  className={`rune-mode-btn ${runeMode === 'popular' ? 'active' : ''}`}
                                  onClick={() => setRuneMode('popular')}
                                >
                                  <span className="chk-icon">{runeMode === 'popular' ? '☑' : '☐'}</span>
                                  <span>Popüler</span>
                                </button>
                                {buildData.situationalRunes && (
                                  <button
                                    type="button"
                                    className={`rune-mode-btn ${runeMode === 'situational' ? 'active' : ''}`}
                                    onClick={() => setRuneMode('situational')}
                                  >
                                    <span className="chk-icon">{runeMode === 'situational' ? '☑' : '☐'}</span>
                                    <span>Duruma göre</span>
                                  </button>
                                )}
                              </div>
                              <span className="stat-pill">Popülerlik: <strong>%{currentRunes.pickRate}</strong></span>
                              <span className="stat-pill">Kazanma: <strong className="green">%{currentRunes.winRate}</strong></span>
                            </div>
                          </div>

                          <div className="runes-display-container">
                            
                            {/* Primary Tree */}
                            <div className="rune-tree-column primary">
                              <div className="tree-header">
                                <img src={`https://ddragon.leagueoflegends.com/cdn/img/${currentRunes.primaryTree.icon}`} alt="Tree" className="tree-icon" />
                                <span className="tree-name">{currentRunes.primaryTree.name}</span>
                                <span className="tree-badge">BİRİNCİL</span>
                              </div>

                              <div className="runes-list">
                                {currentRunes.primaryRunes.map((rune, rIdx) => (
                                  <div key={rIdx} className={`rune-row ${rune.isKeystone ? 'keystone-row' : ''}`} title={rune.name}>
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`} alt={rune.name} className="rune-icon" />
                                    <div className="rune-meta">
                                      <span className="rune-name">{rune.name}</span>
                                      <span className="rune-tag">{rune.isKeystone ? 'KİLİT RÜN' : `Kademe ${rIdx}`}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Secondary Tree */}
                            <div className="rune-tree-column secondary">
                              <div className="tree-header">
                                <img src={`https://ddragon.leagueoflegends.com/cdn/img/${currentRunes.secondaryTree.icon}`} alt="Tree" className="tree-icon" />
                                <span className="tree-name">{currentRunes.secondaryTree.name}</span>
                                <span className="tree-badge secondary">İKİNCİL</span>
                              </div>

                              <div className="runes-list">
                                {currentRunes.secondaryRunes.map((rune, rIdx) => (
                                  <div key={rIdx} className="rune-row" title={rune.name}>
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`} alt={rune.name} className="rune-icon" />
                                    <div className="rune-meta">
                                      <span className="rune-name">{rune.name}</span>
                                      <span className="rune-tag">İkincil Seçim</span>
                                    </div>
                                  </div>
                                ))}

                                {/* Stat Shards */}
                                <div className="shards-row">
                                  <span className="shards-title">Nitelik Parçaları:</span>
                                  <div className="shards-icons">
                                    {currentRunes.statShards.map((shard, sIdx) => (
                                      <div key={sIdx} className="shard-item" title={shard.name}>
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/img/${shard.icon}`} alt={shard.name} />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Summoner Spells Mini Box */}
                            <div className="spells-side-box">
                              <span className="spells-side-title">Sihirdar Yetenekleri</span>
                              <div className="spells-pair-row">
                                {currentRunes.spells.map((spId, idx) => (
                                  <div key={idx} className="sp-icon-box" title={currentRunes.spellLabels?.[idx] || 'Büyü'}>
                                    <img src={LolAssets.getSpellIcon(getSpellKey(spId))} alt="Spell" />
                                    <span>{currentRunes.spellLabels?.[idx] || 'Büyü'}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="spells-meta-stats">
                                <span>Popülerlik: <strong>%{currentRunes.pickRate}</strong></span>
                                <span>Kazanma: <strong className="green">%{currentRunes.winRate}</strong></span>
                              </div>
                            </div>

                          </div>
                        </div>
                      );
                    })()}

                  </div>

                  {/* RIGHT COLUMN: Stats, Starting Items, Core Progression, Situational & Boots */}
                  <div className="overview-col-right">
                    
                    {/* Panel D: Base Stats 3x3 */}
                    <div className="dashboard-card stats-card">
                      <div className="card-header-row">
                        <div className="card-title-wrap">
                          <span className="panel-badge-cyan">SEZON 2026</span>
                          <h3 className="panel-title">Temel Nitelikler</h3>
                        </div>
                      </div>

                      <div className="champ-stats-3x3-grid">
                        <div className="stat-tile">
                          <span className="tile-label">Can (HP)</span>
                          <span className="tile-value">{champDetail.stats?.hp} <small>+{champDetail.stats?.hpperlevel}</small></span>
                        </div>
                        <div className="stat-tile">
                          <span className="tile-label">Can Yenilenmesi</span>
                          <span className="tile-value">{champDetail.stats?.hpregen} <small>+{champDetail.stats?.hpregenperlevel}</small></span>
                        </div>
                        <div className="stat-tile">
                          <span className="tile-label">{champDetail.partype || 'Mana'}</span>
                          <span className="tile-value">{champDetail.stats?.mp} <small>+{champDetail.stats?.mpperlevel}</small></span>
                        </div>
                        <div className="stat-tile">
                          <span className="tile-label">Saldırı Gücü (AD)</span>
                          <span className="tile-value">{champDetail.stats?.attackdamage} <small>+{champDetail.stats?.attackdamageperlevel}</small></span>
                        </div>
                        <div className="stat-tile">
                          <span className="tile-label">Saldırı Hızı</span>
                          <span className="tile-value">{champDetail.stats?.attackspeed} <small>+{champDetail.stats?.attackspeedperlevel}%</small></span>
                        </div>
                        <div className="stat-tile">
                          <span className="tile-label">Saldırı Menzili</span>
                          <span className="tile-value">{champDetail.stats?.attackrange}</span>
                        </div>
                        <div className="stat-tile">
                          <span className="tile-label">Zırh</span>
                          <span className="tile-value">{champDetail.stats?.armor} <small>+{champDetail.stats?.armorperlevel}</small></span>
                        </div>
                        <div className="stat-tile">
                          <span className="tile-label">Büyü Direnci</span>
                          <span className="tile-value">{champDetail.stats?.spellblock} <small>+{champDetail.stats?.spellblockperlevel}</small></span>
                        </div>
                        <div className="stat-tile">
                          <span className="tile-label">Hareket Hızı</span>
                          <span className="tile-value">{champDetail.stats?.movespeed}</span>
                        </div>
                      </div>
                    </div>

                    {/* Panel E: Item Builds (Starting & Core & Situational) */}
                    <div className="dashboard-card items-build-card">
                      <div className="card-header-row">
                        <div className="card-title-wrap">
                          <span className="panel-badge-gold">EŞYA DİZİLİMİ</span>
                          <h3 className="panel-title">Meta Eşya Tercihleri</h3>
                        </div>
                      </div>

                      {/* Starting Items */}
                      <div className="items-sub-section">
                        <div className="sub-section-header">
                          <h4 className="sub-section-title">Başlangıç Eşyaları</h4>
                          <span className="sub-meta-stats">
                            Popülerlik: <strong>%{buildData.items.startingPickRate}</strong> • Kazanma: <strong className="green">%{buildData.items.startingWinRate}</strong>
                          </span>
                        </div>
                        <div className="items-icons-strip">
                          {buildData.items.starting.map((it, idx) => (
                            <div key={idx} className="item-slot-box" title={it.name}>
                              <img src={LolAssets.getItemIcon(it.id)} alt={it.name} />
                              {it.count && <span className="item-count-badge">x{it.count}</span>}
                              <span className="item-slot-name">{it.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Core Items (En Gerekli Eşyalar) */}
                      <div className="items-sub-section">
                        <div className="sub-section-header">
                          <h4 className="sub-section-title">En Gerekli Eşyalar (Core 3 Item)</h4>
                          <span className="sub-meta-stats">
                            Popülerlik: <strong>%{buildData.items.corePickRate}</strong> • Kazanma: <strong className="green">%{buildData.items.coreWinRate}</strong>
                          </span>
                        </div>
                        <div className="core-progression-row">
                          {buildData.items.core.map((it, idx) => (
                            <React.Fragment key={idx}>
                              <div className="core-item-card" title={it.name}>
                                <img src={LolAssets.getItemIcon(it.id)} alt={it.name} className="core-item-img" />
                                <span className="core-item-title">{it.name}</span>
                                <span className="core-step-badge">#{idx + 1}. Eşya</span>
                              </div>
                              {idx < buildData.items.core.length - 1 && (
                                <span className="core-arrow">›</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* Situational & Boots Row */}
                      <div className="items-bottom-grid">
                        
                        {/* Situational Items */}
                        <div className="situational-col">
                          <h5 className="sub-col-title">Durumsal & Oyun Sonu</h5>
                          <div className="situational-icons-strip">
                            {buildData.items.situational.map((it, idx) => (
                              <div key={idx} className="situational-item-badge" title={it.name}>
                                <img src={LolAssets.getItemIcon(it.id)} alt={it.name} />
                                <span>{it.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Boots */}
                        <div className="boots-col">
                          <h5 className="sub-col-title">Çizme Seçenekleri</h5>
                          <div className="boots-list">
                            {buildData.items.boots.map((b, idx) => (
                              <div key={idx} className="boot-item-row" title={b.name}>
                                <img src={LolAssets.getItemIcon(b.id)} alt={b.name} />
                                <div className="boot-meta">
                                  <span className="boot-name">{b.name}</span>
                                  <span className="boot-rate">{b.pickRate}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* TAB: YETENEKLER & TAM HASARLAR (OFFICIAL LEAGUE WIKI & MERAKI DATA) */}
            {activeTab === 'abilities' && (
              <div className="champ-abilities-tab-view">
                <LolAbilitiesView 
                  abilitiesData={abilitiesData} 
                  championName={champion.name} 
                />
              </div>
            )}

            {/* TAB 2: PRO OYUNCU YAPILARI (PRO BUILDS - MATCHING SCREENSHOT 3) */}
            {activeTab === 'pro_builds' && buildData && (
              <div className="champ-pro-builds-view">
                <div className="pro-builds-header-box">
                  <div className="pro-title-wrap">
                    <span className="panel-badge-gold">PRO LİG & YÜKSEK ELO</span>
                    <h2 className="pro-header-title">{champion.name} Pro Oyuncu Yapıları</h2>
                    <p className="pro-header-sub">
                      Dünya çapındaki profesyonel oyuncuların canlı soloQ ve resmi maçlarında tercih ettiği eşyalar, rünler ve yetenek sıraları.
                    </p>
                  </div>
                </div>

                <div className="pro-matches-list">
                  {buildData.proBuilds.map((match, idx) => (
                    <div 
                      key={idx} 
                      className="pro-match-row clickable"
                      onClick={() => {
                        if (onSearchPlayer) {
                          onSearchPlayer(match.riotId || `${match.playerName}#${(match.server || 'EUW').toUpperCase()}`, (match.server || 'euw1').toLowerCase());
                        }
                      }}
                      title={`${match.playerName} (#${match.tagLine || 'PRO'}) sihirdar profilini incelemek için tıkla`}
                    >
                      
                      {/* Player Col */}
                      <div 
                        className="pro-player-col"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSearchPlayer) {
                            onSearchPlayer(match.riotId || `${match.playerName}#${(match.server || 'EUW').toUpperCase()}`, (match.server || 'euw1').toLowerCase());
                          }
                        }}
                      >
                        <div className="pro-avatar-wrap" title={`${match.playerName} - Seviye ${match.level || 500}`}>
                          <img 
                            src={LolAssets.getProfileIcon(match.profileIconId || 1)} 
                            alt={match.playerName} 
                            className="pro-avatar-img"
                            onError={(e) => { e.target.src = LolAssets.getProfileIcon(1); }}
                          />
                          <span className="pro-avatar-level">{match.level || 500}</span>
                        </div>
                        <div className="pro-player-meta">
                          <div className="pro-player-name-row">
                            <span className="pro-player-name">{match.playerName}</span>
                            <span className="pro-player-tag">#{match.tagLine}</span>
                            <span className="pro-inspect-badge">Profili Gör ↗</span>
                          </div>
                          <div className="pro-player-sub-row">
                            <span className="pro-player-level-pill">Seviye {match.level || 500}</span>
                            <span className="pro-match-date">{match.date} • {match.team}</span>
                          </div>
                          <span className="pro-kda-badge">
                            KDA: <strong>{match.kda}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Opponent Col */}
                      <div className="pro-matchup-col">
                        <span className="vs-tag">VS</span>
                        <div className="opponent-icon-wrap" title={`Rakip: ${match.opponent}`}>
                          <img src={match.opponentIcon} alt={match.opponent} />
                          <span className="opponent-name">{match.opponent}</span>
                        </div>
                      </div>

                      {/* Keystone & Spells */}
                      <div className="pro-runes-spells-col">
                        <img 
                          src={match.keystoneIcon} 
                          alt={match.keystoneName || "Kilit Rün"} 
                          className="pro-keystone-img" 
                          title={`Kilit Rün: ${match.keystoneName || 'Rün'}`} 
                        />
                        <div className="pro-spells-vertical">
                          {match.spells.map((spId, sIdx) => (
                            <img 
                              key={sIdx} 
                              src={LolAssets.getSpellIcon(getSpellKey(spId))} 
                              alt="Spell" 
                              className="pro-spell-img" 
                              title={getSpellNameById(spId)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Skill Priority Badges */}
                      <div className="pro-skill-order-col">
                        <div className="pro-skill-badges">
                          {match.skillOrder ? match.skillOrder.map((sk, sIdx) => (
                            <React.Fragment key={sIdx}>
                              <span className={`pro-skill-badge ${sk.toLowerCase()}`}>{sk}</span>
                              {sIdx < match.skillOrder.length - 1 && <span className="skill-divider">›</span>}
                            </React.Fragment>
                          )) : (
                            <>
                              <span className="pro-skill-badge q">Q</span>
                              <span className="skill-divider">›</span>
                              <span className="pro-skill-badge w">W</span>
                              <span className="skill-divider">›</span>
                              <span className="pro-skill-badge e">E</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 6 Full Items + Trinket */}
                      <div className="pro-items-col">
                        <div className="pro-items-grid">
                          {match.items.map((itId, itIdx) => (
                            <div key={itIdx} className="pro-item-box">
                              <img src={LolAssets.getItemIcon(itId)} alt="Item" />
                            </div>
                          ))}
                          <div className="pro-item-box trinket" title="Ziynet">
                            <img src={LolAssets.getItemIcon(match.trinket)} alt="Trinket" />
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: EN İYİ OYUNCULAR (TOP 10 OTP MASTERS - MATCHING SCREENSHOT 4) */}
            {activeTab === 'best_players' && buildData && (
              <div className="champ-best-players-view">
                <div className="best-players-header-box">
                  <div className="best-title-wrap">
                    <span className="panel-badge-cyan">DÜNYA SIRALAMASI</span>
                    <h2 className="best-header-title">En İyi {champion.name} Oyuncuları</h2>
                    <p className="best-header-sub">
                      Yüksek eloda bu şampiyonla en yüksek kazanma oranına ve maç tecrübesine sahip usta oyuncular (OTP Liderleri).
                    </p>
                  </div>
                </div>

                <div className="best-players-table-card">
                  <table className="best-players-table">
                    <thead>
                      <tr>
                        <th className="th-rank">#</th>
                        <th className="th-summoner">Sihirdar</th>
                        <th className="th-tier">Aşama</th>
                        <th className="th-winrate">Kazanma Oranı</th>
                        <th className="th-games">Oynadığı Maç</th>
                        <th className="th-action">Profil</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buildData.bestPlayers.map((player) => (
                        <tr 
                          key={player.rank} 
                          className="best-player-row clickable"
                          onClick={() => {
                            if (onSearchPlayer) {
                              onSearchPlayer(`${player.name}#${player.tag}`, player.server.toLowerCase());
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                          title={`${player.name}#${player.tag} profilini incele`}
                        >
                          <td className="td-rank">
                            <span className={`rank-medal rank-${player.rank}`}>
                              {player.rank === 1 ? '🥇 1' : player.rank === 2 ? '🥈 2' : player.rank === 3 ? '🥉 3' : player.rank}
                            </span>
                          </td>
                          <td className="td-summoner">
                            <div className="best-player-identity">
                              <img 
                                src={LolAssets.getProfileIcon(player.icon)} 
                                alt={player.name} 
                                className="best-player-avatar"
                                onError={(e) => { e.target.src = LolAssets.getProfileIcon(1); }}
                              />
                              <div className="best-player-text">
                                <span className="best-player-name">{player.name}#{player.tag}</span>
                                <span className={`server-pill-mini ${player.server.toLowerCase()}`}>{player.server}</span>
                              </div>
                            </div>
                          </td>
                          <td className="td-tier">
                            <div className="tier-cell">
                              <img src={LolAssets.getRankEmblem(player.tier)} alt={player.tier} className="best-tier-emblem" />
                              <span className="tier-label">{LolAssets.getTierName(player.tier)}</span>
                            </div>
                          </td>
                          <td className="td-winrate">
                            <div className="winrate-badge-pill green">
                              <span>{player.winrate}</span>
                            </div>
                          </td>
                          <td className="td-games">
                            <span className="games-count-num">{player.games} maç</span>
                          </td>
                          <td className="td-action">
                            <button
                              type="button"
                              className="inspect-player-btn"
                              onClick={() => {
                                if (onSearchPlayer) {
                                  onSearchPlayer(`${player.name}#${player.tag}`, player.server.toLowerCase());
                                }
                              }}
                            >
                              İncele →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: KOSTÜM GALERİSİ */}
            {activeTab === 'skins' && (() => {
              const activeSkinObj = cleanSkins.find(s => s.num === activeSkinIdx);
              const activeSkinTitle = activeSkinObj?.name === 'default' ? `Klasik ${champion.name}` : (activeSkinObj?.name || `Kostüm #${activeSkinIdx}`);
              const activeMeta = getSkinMetadata(cdSkinsMap?.[activeSkinIdx], activeSkinObj?.name, activeSkinIdx, champion.name);

              return (
                <div className="champ-dashboard-skins">
                  <div className="skins-showcase-container">
                    
                    {/* Big Splash Preview Card */}
                    <div className="skins-big-preview">
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_${activeSkinIdx}.jpg`} 
                        alt={activeSkinTitle}
                        className="big-splash-image"
                        onError={(e) => {
                          e.target.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;
                        }}
                      />

                      {/* Top-Left Corner: Glowing Rarity / Tier Badge */}
                      <div className={`preview-tier-banner ${activeMeta.tierColor}`}>
                        <span className="tier-icon">
                          <SkinRarityGem rarity={activeMeta.tierKey} size={22} />
                        </span>
                        <span className="tier-text">{activeMeta.tierFullName}</span>
                      </div>

                      {/* Top-Right Corner: Price & Availability Chips */}
                      <div className="preview-top-right">
                        <div className={`preview-price-badge ${activeMeta.tierColor} ${activeMeta.currencyType === 'ME' ? 'currency-me' : 'currency-rp'}`}>
                          <span className="price-tag-icon">
                            {activeMeta.currencyType === 'ME' ? (
                              <MythicEssenceIcon size={18} />
                            ) : activeMeta.currencyType === 'RP' ? (
                              <RpIcon size={16} />
                            ) : (
                              <span className="free-badge-icon">✦</span>
                            )}
                          </span>
                          <span className="price-tag-val">{activeMeta.price}</span>
                        </div>
                        <div className={`preview-status-badge ${activeMeta.statusColor}`}>
                          <span className={`status-pip ${activeMeta.statusColor}`}></span>
                          <span className="status-tag-val">{activeMeta.availabilityText}</span>
                        </div>
                      </div>

                      {/* Caption Bar with Lore and Meta */}
                      <div className="big-splash-caption">
                        <div className="caption-text">
                          <div className="caption-title-row">
                            <h3>{activeSkinTitle}</h3>
                            <span className={`caption-tier-pill ${activeMeta.tierColor}`}>
                              <SkinRarityGem rarity={activeMeta.tierKey} size={15} />
                              <span>{activeMeta.tierFullName}</span>
                            </span>
                            <span className={`caption-price-pill ${activeMeta.currencyType === 'ME' ? 'currency-me' : 'currency-rp'}`}>
                              {activeMeta.currencyType === 'ME' ? (
                                <MythicEssenceIcon size={15} />
                              ) : activeMeta.currencyType === 'RP' ? (
                                <RpIcon size={14} />
                              ) : null}
                              <span>{activeMeta.price}</span>
                            </span>
                            <span className={`caption-avail-pill ${activeMeta.statusColor}`}>
                              <span className={`avail-dot ${activeMeta.statusColor}`}></span>
                              {activeMeta.availabilityText}
                            </span>
                          </div>
                          {activeMeta.description && (
                            <p className="caption-skin-lore">"{activeMeta.description}"</p>
                          )}
                          <span className="caption-detail-note">{activeMeta.availabilityDetail}</span>
                        </div>
                        <span className="caption-count-badge">
                          {cleanSkins.findIndex(s => s.num === activeSkinIdx) + 1} / {cleanSkins.length}
                        </span>
                      </div>
                    </div>

                    {/* Standalone Skins Selector Grid */}
                    <div className="clean-skins-selector-wrapper">
                      <div className="skins-selector-header">
                        <div className="selector-title-row">
                          <h4>Resmi Ana Kostümler ({cleanSkins.length})</h4>
                          <span className="chroma-note">✓ Renk paketleri (Chroma) filtrelenmiştir • Gerçek RP Fiyatları & Mağaza Durumu</span>
                        </div>
                      </div>

                      <div className="clean-skins-grid-list">
                        {cleanSkins.map((skin) => {
                          const isCurrent = activeSkinIdx === skin.num;
                          const skinTitle = skin.name === 'default' ? `Klasik ${champion.name}` : skin.name;
                          const thumbUrl = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_${skin.num}.jpg`;
                          const meta = getSkinMetadata(cdSkinsMap?.[skin.num], skin.name, skin.num, champion.name);

                          return (
                            <button
                              key={skin.id || skin.num}
                              type="button"
                              className={`skin-card-btn ${isCurrent ? 'active' : ''} ${meta.tierColor}`}
                              onClick={() => setActiveSkinIdx(skin.num)}
                              title={`${skinTitle} • ${meta.tierFullName} • ${meta.price} • ${meta.availabilityText}`}
                            >
                              <div className="skin-card-img-wrap">
                                <img 
                                  src={thumbUrl} 
                                  alt={skinTitle} 
                                  className="skin-card-thumb-splash"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.target.src = LolAssets.getChampionIcon(champion.id);
                                  }}
                                />
                                {/* Top-Left Corner: Rarity / Tier Badge with official in-game gem */}
                                <span className={`skin-corner-tier ${meta.tierColor}`}>
                                  <SkinRarityGem rarity={meta.tierKey} size={11} className="corner-gem-img" />
                                  <span className="corner-tier-text">{meta.tierLabel}</span>
                                </span>

                                {/* Top-Right Corner: Availability indicator pip */}
                                <span className={`skin-corner-avail ${meta.statusColor}`} title={meta.availabilityText}></span>

                                {isCurrent && <span className="skin-active-tag">SEÇİLDİ</span>}
                              </div>

                              <div className="skin-card-meta">
                                <span className="skin-card-label">{skinTitle}</span>
                                <div className="skin-card-sub-row">
                                  <span className={`skin-card-price-tag ${meta.currencyType === 'ME' ? 'currency-me' : 'currency-rp'}`}>
                                    {meta.currencyType === 'ME' ? (
                                      <MythicEssenceIcon size={12} className="sub-currency-icon" />
                                    ) : meta.currencyType === 'RP' ? (
                                      <RpIcon size={11} className="sub-currency-icon" />
                                    ) : null}
                                    <span>{meta.price}</span>
                                  </span>
                                  <span className={`skin-card-avail-badge ${meta.statusColor}`}>
                                    {meta.availabilityBadge}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })()}

            {/* TAB 5: RESMİ HİKAYE & TAKTİKLER */}
            {activeTab === 'tips' && champDetail && (
              <div className="champ-dashboard-tips">
                {/* 1. Full Official Lore & Biography Card */}
                <div className="dashboard-card lore-fullscreen-card">
                  <div className="card-header-row">
                    <div className="card-title-wrap">
                      <span className="panel-badge-gold">RESMİ BİYOGRAFİ & OYUN HİKAYESİ</span>
                      <h3 className="panel-title">{champion.name} — {champion.title}</h3>
                    </div>
                    <span className="panel-hint">Riot Games Universe (tr_TR)</span>
                  </div>
                  <div className="lore-fullscreen-body">
                    <p className="lore-fullscreen-text">
                      "{cleanDescription(champDetail.lore || champDetail.blurb || champion.blurb)}"
                    </p>
                  </div>
                </div>

                <div className="tips-two-columns">
                  <div className="tips-panel ally-panel">
                    <div className="tips-panel-header">
                      <span className="tips-badge-green">DOST TAKTİKLERİ</span>
                      <h3>🛡️ {champion.name} Oynarken Dikkat Edilecekler</h3>
                    </div>
                    {Array.isArray(champDetail.allytips) && champDetail.allytips.length > 0 ? (
                      <div className="tips-cards-list">
                        {champDetail.allytips.map((tip, idx) => (
                          <div key={idx} className="tip-card green">
                            <span className="tip-card-number">#{idx + 1}</span>
                            <p>{tip}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-tips-text">Bu şampiyon için özel dost oynanış taktiği bulunamadı.</p>
                    )}
                  </div>

                  <div className="tips-panel enemy-panel">
                    <div className="tips-panel-header">
                      <span className="tips-badge-red">DÜŞMAN TAKTİKLERİ</span>
                      <h3>⚔️ {champion.name}'e Karşı Oynarken Dikkat Edilecekler</h3>
                    </div>
                    {Array.isArray(champDetail.enemytips) && champDetail.enemytips.length > 0 ? (
                      <div className="tips-cards-list">
                        {champDetail.enemytips.map((tip, idx) => (
                          <div key={idx} className="tip-card red">
                            <span className="tip-card-number">#{idx + 1}</span>
                            <p>{tip}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-tips-text">Bu şampiyona karşı özel mücadele taktiği bulunamadı.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

          </>
        )}
      </div>

    </div>
  );
}
