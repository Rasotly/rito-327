import React, { useState, useEffect } from 'react';

const BackArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export default function LolModule({ onBack }) {
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
