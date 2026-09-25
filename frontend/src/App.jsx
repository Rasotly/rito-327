import React, { useState, useEffect, useRef } from 'react';
import './index.css';

// SVG Icons for generic back arrow
const BackArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

import ValorantModule from './valorant/ValorantModule';
import LolModule from './lol/LolModule';

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

export default App;
