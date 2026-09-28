import React, { useState, useEffect } from 'react';
import { LolAssets } from './lolAssets';

// Fallback Top Challengers (so home page is NEVER blank while loading)
const FALLBACK_TOP_CHALLENGERS = [
  {
    rankPosition: 1,
    riotId: 'Şapşal pampa#silly',
    gameName: 'Şapşal pampa',
    tagLine: 'silly',
    server: 'tr1',
    profileIconId: 7123,
    summonerLevel: 215,
    leaguePoints: 2956,
    wins: 352,
    losses: 257,
    tier: 'CHALLENGER'
  },
  {
    rankPosition: 2,
    riotId: 'ZOR YARIŞIRLAR#1818',
    gameName: 'ZOR YARIŞIRLAR',
    tagLine: '1818',
    server: 'tr1',
    profileIconId: 4070,
    summonerLevel: 479,
    leaguePoints: 2738,
    wins: 277,
    losses: 157,
    tier: 'CHALLENGER'
  },
  {
    rankPosition: 3,
    riotId: 'Akıma Undomîell#QeQ',
    gameName: 'Akıma Undomîell',
    tagLine: 'QeQ',
    server: 'tr1',
    profileIconId: 3366,
    summonerLevel: 842,
    leaguePoints: 2715,
    wins: 341,
    losses: 242,
    tier: 'CHALLENGER'
  },
  {
    rankPosition: 4,
    riotId: 'Jaquen#TR2',
    gameName: 'Jaquen',
    tagLine: 'TR2',
    server: 'tr1',
    profileIconId: 3891,
    summonerLevel: 687,
    leaguePoints: 2601,
    wins: 253,
    losses: 131,
    tier: 'CHALLENGER'
  }
];

// Curated 2026 Meta Tier List
const META_CHAMPIONS = [
  {
    name: 'Caitlyn',
    role: 'adc',
    roleLabel: 'Alt Koridor',
    tier: 'S+',
    winrate: '53.5',
    pickrate: '24.6',
    banrate: '18.2',
    title: 'Şerif',
    desc: 'Uzun menzil ve tuzak mekaniği ile koridoru ve kuleleri erkenden eritir.'
  },
  {
    name: 'Aatrox',
    role: 'top',
    roleLabel: 'Üst Koridor',
    tier: 'S+',
    winrate: '52.8',
    pickrate: '14.2',
    banrate: '12.4',
    title: 'Darkin Kılıcı',
    desc: 'Takım savaşlarında devasa can çalma ve sürekli alan hasarı baskısı.'
  },
  {
    name: 'Lee Sin',
    role: 'jungle',
    roleLabel: 'Orman',
    tier: 'S+',
    winrate: '51.9',
    pickrate: '19.5',
    banrate: '15.6',
    title: 'Kör Keşiş',
    desc: 'Erken oyundaki yüksek hareketliliği ve ejder/harita rotasyon gücü.'
  },
  {
    name: 'Ahri',
    role: 'mid',
    roleLabel: 'Orta Koridor',
    tier: 'S+',
    winrate: '52.4',
    pickrate: '15.8',
    banrate: '9.3',
    title: 'Dokuz Kuyruklu Tilki',
    desc: 'Yüksek anlık hasar, ayartma kitle kontrolü ve güvenli koridor aşaması.'
  },
  {
    name: 'Thresh',
    role: 'support',
    roleLabel: 'Destek',
    tier: 'S+',
    winrate: '52.7',
    pickrate: '17.1',
    banrate: '11.5',
    title: 'Zincirli Gardiyan',
    desc: 'Kusursuz kanca ve fener mekanikleriyle takım savaşlarını tek başına çevirir.'
  },
  {
    name: 'Ambessa',
    role: 'top',
    roleLabel: 'Üst Koridor',
    tier: 'S+',
    winrate: '52.1',
    pickrate: '13.4',
    banrate: '21.0',
    title: 'Savaşın Matriarkı',
    desc: 'Aralıksız atılma ve acımasız zincirleme kombolarla koridor ezicisi.'
  },
  {
    name: 'Yone',
    role: 'mid',
    roleLabel: 'Orta Koridor',
    tier: 'S',
    winrate: '51.2',
    pickrate: '16.8',
    banrate: '17.9',
    title: 'Unutulmayan',
    desc: 'Ruh biçimi ve kılıç fırtınasıyla arka safları darmadağın eden suikastçı.'
  },
  {
    name: 'Jinx',
    role: 'adc',
    roleLabel: 'Alt Koridor',
    tier: 'S',
    winrate: '51.8',
    pickrate: '20.2',
    banrate: '8.7',
    title: 'Delifişek',
    desc: 'İlk katletme sonrası pasifiyle durdurulamaz roket yağmuru başlatır.'
  },
  {
    name: 'Nautilus',
    role: 'support',
    roleLabel: 'Destek',
    tier: 'S',
    winrate: '51.6',
    pickrate: '14.5',
    banrate: '10.2',
    title: 'Derinliklerin Devi',
    desc: 'Kaçınılmaz kitle kontrol zinciri ve sarsılmaz ön hat kalkanı.'
  },
  {
    name: 'Viego',
    role: 'jungle',
    roleLabel: 'Orman',
    tier: 'S',
    winrate: '51.5',
    pickrate: '13.8',
    banrate: '11.4',
    title: 'Mahvolmuş Kral',
    desc: 'Ruhları ele geçirip sıfırlanan ultisiyle çatışmaları tek başına temizler.'
  }
];

export default function LolLandingHome({ onSelectPlayer, onSelectChampion, onOpenLeaderboard, onOpenChampions }) {
  const [challengers, setChallengers] = useState(FALLBACK_TOP_CHALLENGERS);
  const [activeRole, setActiveRole] = useState('all');
  const [loadingChallengers, setLoadingChallengers] = useState(false);

  // Fetch live top challengers from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchTopChallengers = async () => {
      try {
        setLoadingChallengers(true);
        const res = await fetch('http://localhost:8081/?game=lol&action=leaderboard&server=tr1');
        if (!res.ok) return;
        const data = await res.json();
        const list = data?.data?.leaderboard || data?.leaderboard || [];
        if (isMounted && Array.isArray(list) && list.length > 0) {
          setChallengers(list.slice(0, 4));
        }
      } catch (err) {
        console.warn('Leaderboard fetch fallback used:', err);
      } finally {
        if (isMounted) setLoadingChallengers(false);
      }
    };

    fetchTopChallengers();
    return () => { isMounted = false; };
  }, []);

  const filteredMeta = activeRole === 'all' 
    ? META_CHAMPIONS 
    : META_CHAMPIONS.filter(c => c.role === activeRole);

  return (
    <div className="lol-landing-home">
      
      {/* 1. Live Challenger Spotlight / Zirvedekiler Showcase */}
      <section className="landing-section spotlight-section">
        <div className="section-header-row">
          <div className="section-title-wrap">
            <span className="section-badge gold">
              <span className="pulse-dot gold"></span> CANLI ZİRVE
            </span>
            <h2 className="section-title">Türkiye Sunucusu Zirvedekileri</h2>
            <p className="section-subtitle">Challenger liginde anlık en yüksek LP'ye ve galibiyet oranına sahip sihirdarlar.</p>
          </div>
          <button 
            type="button" 
            className="view-all-link-btn" 
            onClick={onOpenLeaderboard}
            title="Tüm En İyi 100 Oyuncuyu Görüntüle"
          >
            <span>Tüm Liderlik Tablosu</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <div className="podium-grid">
          {challengers.slice(0, 3).map((player, idx) => {
            const rankPos = player.rankPosition || (idx + 1);
            const totalGames = (player.wins || 0) + (player.losses || 0);
            const wr = totalGames > 0 ? ((player.wins / totalGames) * 100).toFixed(1) : '55.0';
            const cleanName = player.gameName || player.riotId.split('#')[0];
            const cleanTag = player.tagLine ? `#${player.tagLine}` : '';

            const crownMedal = rankPos === 1 ? '👑 #1 ŞAMPİYON' : rankPos === 2 ? '🥈 #2 LİDER' : '🥉 #3 SEÇKİN';
            const cardAccent = rankPos === 1 ? 'gold-top' : rankPos === 2 ? 'silver-top' : 'bronze-top';

            return (
              <div 
                key={idx} 
                className={`podium-card ${cardAccent}`}
                onClick={() => onSelectPlayer(player.riotId, player.server || 'tr1')}
              >
                <div className="podium-card-glow"></div>
                <div className="podium-crown-badge">{crownMedal}</div>
                
                <div className="podium-avatar-area">
                  <div className="podium-avatar-wrapper">
                    <img 
                      src={LolAssets.getProfileIcon(player.profileIconId || 1)} 
                      alt={cleanName} 
                      className="podium-avatar-img"
                      onError={(e) => { e.target.src = LolAssets.getProfileIcon(1); }}
                    />
                    <span className="podium-level-badge">{player.summonerLevel || 100}</span>
                  </div>
                  <img 
                    src={LolAssets.getRankEmblem('CHALLENGER')} 
                    alt="Challenger" 
                    className="podium-crest-img"
                  />
                </div>

                <div className="podium-player-meta">
                  <h3 className="podium-player-name">
                    {cleanName}
                    <span className="podium-player-tag">{cleanTag}</span>
                  </h3>
                  <div className="podium-lp-badge">
                    <span className="lp-num">{(player.leaguePoints || 2500).toLocaleString('tr-TR')} LP</span>
                    <span className="lp-tier">CHALLENGER</span>
                  </div>
                </div>

                <div className="podium-stats-row">
                  <div className="podium-stat-box">
                    <span className="stat-label">Galibiyet Oranı</span>
                    <span className="stat-val green">%{wr}</span>
                  </div>
                  <div className="podium-stat-divider"></div>
                  <div className="podium-stat-box">
                    <span className="stat-label">Toplam Maç</span>
                    <span className="stat-val">{totalGames} ({player.wins}Z {player.losses}M)</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="podium-inspect-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlayer(player.riotId, player.server || 'tr1');
                  }}
                >
                  <span>Profili İncele</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Current Meta & Trending Champions */}
      <section className="landing-section meta-section">
        <div className="section-header-row">
          <div className="section-title-wrap">
            <span className="section-badge cyan">
              <span className="pulse-dot cyan"></span> SEZON 2026 META
            </span>
            <h2 className="section-title">Yamanın En Güçlü Şampiyonları</h2>
            <p className="section-subtitle">Yüksek eloda en çok tercih edilen ve en yüksek kazanma oranına sahip S+ ve S seviyesi tercihler.</p>
          </div>

          <div className="section-header-actions">
            {onOpenChampions && (
              <button 
                type="button" 
                className="view-all-link-btn cyan" 
                onClick={onOpenChampions}
                title="Tüm 167+ Şampiyonu Görüntüle"
              >
                <span>Tüm Şampiyonlar (167+)</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="role-filter-row">
          <div className="role-filter-pills">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'top', label: 'Üst Koridor' },
              { id: 'jungle', label: 'Orman' },
              { id: 'mid', label: 'Orta Koridor' },
              { id: 'adc', label: 'Alt Koridor' },
              { id: 'support', label: 'Destek' }
            ].map((role) => (
              <button
                key={role.id}
                type="button"
                className={`role-pill-btn ${activeRole === role.id ? 'active' : ''}`}
                onClick={() => setActiveRole(role.id)}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <div className="meta-champions-grid">
          {filteredMeta.map((champ, idx) => {
            const splashUrl = LolAssets.getChampionSplash(champ.name.replace(/['\s\.]/g, ''));
            const iconUrl = LolAssets.getChampionIcon(champ.name.replace(/['\s\.]/g, ''));

            return (
              <div 
                key={idx} 
                className="meta-champ-card"
                role="button"
                tabIndex={0}
                onClick={() => onSelectChampion && onSelectChampion(champ.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (onSelectChampion) onSelectChampion(champ.name);
                  }
                }}
                title={`${champ.name} Profilini ve Detaylı Şampiyon Rehberini İncele`}
              >
                {/* Background Splash Overlay */}
                <div 
                  className="meta-card-bg"
                  style={{ backgroundImage: `url(${splashUrl})` }}
                ></div>
                <div className="meta-card-gradient"></div>

                <div className="meta-card-top">
                  <div className="meta-champ-identity">
                    <img 
                      src={iconUrl} 
                      alt={champ.name} 
                      className="meta-champ-avatar"
                      onError={(e) => {
                        e.target.src = LolAssets.getChampionIcon('Caitlyn');
                      }}
                    />
                    <div className="meta-champ-titles">
                      <h4 className="meta-champ-name">{champ.name}</h4>
                      <span className="meta-champ-role-tag">{champ.roleLabel} • {champ.title}</span>
                    </div>
                  </div>

                  <span className={`meta-tier-badge ${champ.tier === 'S+' ? 'tier-s-plus' : 'tier-s'}`}>
                    {champ.tier}
                  </span>
                </div>

                <p className="meta-champ-desc">{champ.desc}</p>

                <div className="meta-card-metrics">
                  <div className="metric-box">
                    <span className="metric-title">Kazanma</span>
                    <span className="metric-num green">%{champ.winrate}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-title">Seçilme</span>
                    <span className="metric-num">%{champ.pickrate}</span>
                  </div>
                  <div className="metric-box">
                    <span className="metric-title">Yasaklama</span>
                    <span className="metric-num red">%{champ.banrate}</span>
                  </div>
                </div>

                <div className="meta-card-hover-action">
                  <span>Şampiyonu ve Karşılaşmaları İncele →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Platform Capabilities & Intelligence Features */}
      <section className="landing-section features-section">
        <div className="section-header-row centered">
          <div className="section-title-wrap text-center">
            <span className="section-badge purple">
              <span className="pulse-dot purple"></span> İLERİ DÜZEY ANALİTİK
            </span>
            <h2 className="section-title">Oyununuzu Bir Üst Seviyeye Taşıyın</h2>
            <p className="section-subtitle">Riot Games API verilerini dünya ortalamaları ve yapay zeka analiz algoritmalarıyla birleştirdik.</p>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box gold">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 20V10M12 20V4M6 20v-6"></path>
              </svg>
            </div>
            <h3 className="feature-title">Dünya Şampiyon Kıyaslaması</h3>
            <p className="feature-desc">
              Oynadığınız her maçtaki CS/dk, Altın/dk, Hasar/dk ve Görüş puanlarınız; şampiyonun dünya standartlarıyla anlık olarak karşılaştırılır.
            </p>
            <div className="feature-pill gold">Riot Match-V5 Canlı Verisi</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box cyan">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                <line x1="8" y1="2" x2="8" y2="18"></line>
                <line x1="16" y1="6" x2="16" y2="22"></line>
              </svg>
            </div>
            <h3 className="feature-title">Vadi Haritası & Isı Haritası (Heatmap)</h3>
            <p className="feature-desc">
              Zaman çizelgesi analitiği ile maç boyunca hangi koridorlarda bulunduğunuzu, ölüm konumlarınızı ve harita varlığınızı interaktif haritada inceleyin.
            </p>
            <div className="feature-pill cyan">Zaman Çizelgesi Paternleri</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box purple">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </div>
            <h3 className="feature-title">Resmi Riot Mücadeleleri (Challenges)</h3>
            <p className="feature-desc">
              Ustalık, Takım Çalışması, Şöhret ve Gazap kategorilerinde rozetlerinizi ve genel sunucu sıralamanızı eksiksiz görüntüleyin.
            </p>
            <div className="feature-pill purple">Challenges-V1 Entegrasyonu</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box green">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="feature-title">Yapay Zeka Koçluk & Hata Tespiti</h3>
            <p className="feature-desc">
              Maç içi kararlarınız, yetersiz kontrol totemi alışkanlıklarınız ve kritik güç patlaması (powerspike) pencereleriniz için özel taktikler alın.
            </p>
            <div className="feature-pill green">Kişiye Özel Koçluk</div>
          </div>
        </div>
      </section>

      {/* 4. Global Stats & Support Banner */}
      <section className="landing-ribbon-section">
        <div className="ribbon-box">
          <div className="ribbon-item">
            <span className="ribbon-num">168+</span>
            <span className="ribbon-text">Şampiyon İstatistiği</span>
          </div>
          <div className="ribbon-divider"></div>
          <div className="ribbon-item">
            <span className="ribbon-num">6 Sunucu</span>
            <span className="ribbon-text">TR, EUW, KR, NA, EUNE, VN</span>
          </div>
          <div className="ribbon-divider"></div>
          <div className="ribbon-item">
            <span className="ribbon-num">%100</span>
            <span className="ribbon-text">Canlı Riot API Doğrulaması</span>
          </div>
          <div className="ribbon-divider"></div>
          <div className="ribbon-item">
            <span className="ribbon-num">2026</span>
            <span className="ribbon-text">Sezonu 1. Split Aktif</span>
          </div>
        </div>
      </section>

    </div>
  );
}
