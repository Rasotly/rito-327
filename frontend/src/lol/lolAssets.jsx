import React from 'react';

// Dynamic version state with reliable fallback
let ddragonVersion = '14.5.1';

// Automatically fetch latest Data Dragon version
fetch('https://ddragon.leagueoflegends.com/api/versions.json')
  .then(res => res.json())
  .then(versions => {
    if (Array.isArray(versions) && versions.length > 0) {
      ddragonVersion = versions[0];
    }
  })
  .catch(() => {});

export function normalizeChampionKey(champName) {
  if (!champName) return 'Caitlyn';
  const clean = String(champName).trim();
  const lower = clean.toLowerCase();

  const specialMap = {
    'wukong': 'MonkeyKing',
    'monkeyking': 'MonkeyKing',
    'renata glasc': 'Renata',
    'renata': 'Renata',
    'nunu & willump': 'Nunu',
    'nunu': 'Nunu',
    'leblanc': 'Leblanc',
    "cho'gath": 'Chogath',
    'chogath': 'Chogath',
    "kai'sa": 'Kaisa',
    'kaisa': 'Kaisa',
    "kha'zix": 'Khazix',
    'khazix': 'Khazix',
    "vel'koz": 'Velkoz',
    'velkoz': 'Velkoz',
    "k'sante": 'KSante',
    'ksante': 'KSante',
    'dr. mundo': 'DrMundo',
    'drmundo': 'DrMundo',
    'jarvan iv': 'JarvanIV',
    'jarvaniv': 'JarvanIV',
    'miss fortune': 'MissFortune',
    'missfortune': 'MissFortune',
    'master yi': 'MasterYi',
    'masteryi': 'MasterYi',
    'lee sin': 'LeeSin',
    'leesin': 'LeeSin',
    'tahm kench': 'TahmKench',
    'tahmkench': 'TahmKench',
    'twisted fate': 'TwistedFate',
    'twistedfate': 'TwistedFate',
    'xin zhao': 'XinZhao',
    'xinzhao': 'XinZhao',
    'aurelion sol': 'AurelionSol',
    'aurelionsol': 'AurelionSol',
    "kog'maw": 'KogMaw',
    'kogmaw': 'KogMaw',
    "rek'sai": 'RekSai',
    'reksai': 'RekSai',
    "bel'veth": 'Belveth',
    'belveth': 'Belveth'
  };

  if (specialMap[lower]) {
    return specialMap[lower];
  }

  // Strip apostrophes, spaces, periods, ampersands
  return clean.replace(/['\s\.\&]/g, '');
}

export const LolAssets = {
  getVersion: () => ddragonVersion,
  
  getProfileIcon: (iconId = 1) => 
    `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/profileicon/${iconId}.png`,

  getChampionIcon: (champName) => {
    const key = normalizeChampionKey(champName);
    return `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${key}.png`;
  },

  getChampionSplash: (champName, skin = 0) => {
    const key = normalizeChampionKey(champName);
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${key}_${skin}.jpg`;
  },

  getChampionLoading: (champName, skin = 0) => {
    const key = normalizeChampionKey(champName);
    return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${key}_${skin}.jpg`;
  },

  getItemIcon: (itemId) => 
    `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/item/${itemId}.png`,

  getSpellIcon: (spellName) => 
    `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/spell/${spellName}.png`,

  getRankEmblem: (tier = 'unranked') => {
    const raw = (tier || 'unranked').toLowerCase().trim();
    const base = raw.split(' ')[0] || 'unranked';
    const validTiers = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'emerald', 'diamond', 'master', 'grandmaster', 'challenger'];
    if (validTiers.includes(base)) {
      return `https://opgg-static.akamaized.net/images/medals_new/${base}.png`;
    }
    return `https://opgg-static.akamaized.net/images/medals_new/iron.png`;
  },

  getTierName: (tier = '') => {
    const raw = (tier || '').toLowerCase().trim();
    const parts = raw.split(' ');
    const base = parts[0] || '';
    const division = parts[1] ? ` ${parts[1]}` : '';
    const map = {
      'iron': 'Demir',
      'bronze': 'Bronz',
      'silver': 'Gümüş',
      'gold': 'Altın',
      'platinum': 'Platin',
      'emerald': 'Zümrüt',
      'diamond': 'Elmas',
      'master': 'Ustalık',
      'grandmaster': 'Üstatlık',
      'challenger': 'Şampiyonluk',
      'unranked': 'Derecesiz'
    };
    if (map[base]) {
      return `${map[base]}${division}`;
    }
    return map[raw] || tier || 'Derecesiz';
  }
};

export const LolLogoIcon = ({ size = 28, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`lol-logo-svg ${className}`}
  >
    <defs>
      <linearGradient id="lolGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0e6d2" />
        <stop offset="35%" stopColor="#c8aa6e" />
        <stop offset="70%" stopColor="#785a28" />
        <stop offset="100%" stopColor="#c89b3c" />
      </linearGradient>
      <linearGradient id="lolRingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#c8aa6e" />
        <stop offset="100%" stopColor="#463714" />
      </linearGradient>
    </defs>
    {/* Outer Hextech circle */}
    <circle cx="50" cy="50" r="46" stroke="url(#lolRingGrad)" strokeWidth="4" fill="#091428" />
    <circle cx="50" cy="50" r="41" stroke="#785a28" strokeWidth="1" strokeDasharray="4 3" fill="none" opacity="0.6" />
    
    {/* Stylized LoL 'L' Emblem */}
    <path 
      d="M36 22H45V68H66V77H36V22Z" 
      fill="url(#lolGoldGrad)" 
      stroke="#1e2328" 
      strokeWidth="2" 
    />
    <path 
      d="M45 32L61 68H45V32Z" 
      fill="url(#lolGoldGrad)" 
      opacity="0.3" 
    />
  </svg>
);

/**
 * Official Riot Points (RP) currency emblem
 */
export const RpIcon = ({ size = 16, className = "" }) => (
  <svg 
    width={size} 
    height={Math.round(size * 14 / 13)} 
    viewBox="0 0 13 14" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`rp-currency-icon ${className}`}
    title="Riot Points (RP)"
  >
    <defs>
      <linearGradient id="rpGoldShineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff2a3" />
        <stop offset="50%" stopColor="#e2ba3d" />
        <stop offset="100%" stopColor="#9c771c" />
      </linearGradient>
    </defs>
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M8.63343 2.25848L6.5001 0.600098L4.36676 2.25848V8.25781L6.5001 9.7405L8.63343 8.25781V2.25848ZM12.0468 6.1152L12.9001 5.49383L10.3401 3.11553V9.11486L7.35343 11.2575V13.4001L12.9001 9.68479L12.0468 8.68634V6.1152ZM2.6601 3.11553L0.100098 5.49383L0.953431 6.1152V8.68634L0.100098 9.68479L5.64676 13.4001V11.2575L2.6601 9.11486V3.11553Z" 
      fill="url(#rpGoldShineGrad)"
    />
  </svg>
);

/**
 * Official League of Legends Mythic Essence (İhtişamlı Öz) crystal icon
 */
export const MythicEssenceIcon = ({ size = 16, className = "" }) => (
  <img 
    src="/lol/mythic_essence.png" 
    alt="İhtişamlı Öz" 
    title="İhtişamlı Öz"
    width={size} 
    height={size} 
    className={`mythic-essence-icon ${className}`}
    loading="lazy"
    onError={(e) => {
      e.target.src = '/lol/mythic.svg';
    }}
  />
);

/**
 * Official League of Legends in-game skin rarity gem badges:
 * - Ultimate (Ebedi): Orange fiery gem
 * - Mythic / Prestige (İhtişamlı / Prestij): Purple crest gem
 * - Legendary (Efsanevi): Crimson ruby crest gem
 * - Epic (Destansı): Cyan crystal crest gem
 * - Transcendent / Exalted (Aşkın / Yüce): Cosmic crest gem
 * - Legacy (Hatıra): Vaulted Hextech chest badge
 */
export const SkinRarityGem = ({ rarity = "standard", size = 18, className = "" }) => {
  const r = (rarity || '').toLowerCase();
  let iconSrc = null;
  let altText = 'Standart';

  if (r === 'ultimate' || r === 'ebedi') {
    iconSrc = '/lol/rarity/ultimate.png';
    altText = 'Ebedi Kostüm';
  } else if (r === 'mythic' || r === 'ihtişamlı' || r === 'prestige' || r === 'prestij') {
    iconSrc = '/lol/rarity/mythic.png';
    altText = 'İhtişamlı Kostüm';
  } else if (r === 'legendary' || r === 'efsanevi') {
    iconSrc = '/lol/rarity/legendary.png';
    altText = 'Efsanevi Kostüm';
  } else if (r === 'epic' || r === 'destansı') {
    iconSrc = '/lol/rarity/epic.png';
    altText = 'Destansı Kostüm';
  } else if (r === 'transcendent' || r === 'aşkın') {
    iconSrc = '/lol/rarity/transcendent.png';
    altText = 'Aşkın Kostüm';
  } else if (r === 'exalted' || r === 'yüce') {
    iconSrc = '/lol/rarity/exalted.png';
    altText = 'Yüce Kostüm';
  } else if (r === 'legacy' || r === 'hatıra') {
    iconSrc = '/lol/rarity/chest.png';
    altText = 'Hatıra Kostüm (Sandıkta)';
  }

  if (!iconSrc) {
    return <span className={`rarity-symbol-fallback ${className}`}>✦</span>;
  }

  return (
    <img 
      src={iconSrc} 
      alt={altText} 
      title={altText}
      width={size} 
      height={size} 
      className={`skin-rarity-gem-img ${r} ${className}`}
      loading="lazy"
    />
  );
};

export default LolAssets;
