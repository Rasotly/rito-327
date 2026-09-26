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

export const LolAssets = {
  getVersion: () => ddragonVersion,
  
  getProfileIcon: (iconId = 1) => 
    `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/profileicon/${iconId}.png`,

  getChampionIcon: (champName) => 
    `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${champName}.png`,

  getChampionSplash: (champName, skin = 0) => 
    `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champName}_${skin}.jpg`,

  getChampionLoading: (champName, skin = 0) => 
    `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champName}_${skin}.jpg`,

  getItemIcon: (itemId) => 
    `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/item/${itemId}.png`,

  getSpellIcon: (spellName) => 
    `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/spell/${spellName}.png`
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
