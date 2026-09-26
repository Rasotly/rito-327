import React, { useState } from 'react';

const PATCH_NOTES = [
  {
    id: '13.06',
    version: '13.06',
    date: '22.09.2026',
    category: 'Oyun Güncellemeleri',
    image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/cbf4460132cdfeb2a97fad5f9dd25ba0bc058f76-128x128.png', 
    title: 'VALORANT 13.06 Yama Notları',
    summary: 'VALORANT\'ın büyük güncellemesi geldi.',
    sections: [
      {
        title: 'AJAN GÜNCELLEMELERİ',
        content: [
          'Ascent haritasındaki camların yeteneklerle olan etkileşimi değiştirildi.',
          'Phoenix\'in Ateşten Duvar ve Neon\'un Hız Şeridi yetenekleri güncellendi.'
        ]
      }
    ]
  },
  {
    id: '13.05',
    version: '13.05',
    date: '01.09.2026',
    category: 'Oyun Güncellemeleri',
    image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/7f4e91242e88a0b06ab39d6c703e226d97c5f87f-128x128.png',
    title: 'VALORANT 13.05 Yama Notları',
    summary: 'Champions için Kim Alır yakında çıkıyor, yayından bilgi alma ve anında kilitleme programları için cezalar geliyor ve Ajan Teçhizatı sistemine değişiklikler geliyor.',
    sections: [
      {
        title: 'SİSTEM GÜNCELLEMELERİ',
        content: [
          'Anında kilitleme (Instalock) programları için yeni tespit ve ceza sistemleri.'
        ]
      }
    ]
  },
  {
    id: '13.04',
    version: '13.04',
    date: '18.08.2026',
    category: 'Oyun Güncellemeleri',
    image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/924e6ab4f93e3d647a50f75beff22fdbcf56f2f9-128x128.png',
    title: 'VALORANT 13.04 Yama Notları',
    summary: 'Yeni harita rotasyonu geldi ve ajanlarla yakın dövüş kaplamalarıyla ilgili bazı hatalar giderildi.',
    sections: [
      {
        title: 'HARİTA GÜNCELLEMELERİ',
        content: [
          'Yeni harita rotasyonunda değişiklikler yapıldı.'
        ]
      }
    ]
  },
  {
    id: '13.03',
    version: '13.03',
    date: '28.07.2026',
    category: 'Oyun Güncellemeleri',
    image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/583c21a4f02a4bf772cf8bb0e0bb37976e189679-128x128.png',
    title: 'VALORANT 13.03 Yama Notları',
    summary: 'Phoenix yetenek setinde yenilikler, ateş duvarı görsel iyileştirmeleri ve harita hata düzeltmeleri.',
    sections: [
      {
        title: 'AJAN GÜNCELLEMELERİ',
        content: [
          'Phoenix için dengeleme ayarlamaları.'
        ]
      }
    ]
  },
  {
    id: '13.02',
    version: '13.02',
    date: '14.07.2026',
    category: 'Oyun Güncellemeleri',
    image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/a2bc4fa0194858da39be33ff61b8fbf1f12255de-128x128.png',
    title: 'VALORANT 13.02 Yama Notları',
    summary: 'Yoru klonunun davranışı değiştirildi ve keskin nişancı tüfeklerindeki haksız rekabet unsurları azaltıldı.',
    sections: [
      {
        title: 'SİLAH GÜNCELLEMELERİ',
        content: [
          'Keskin nişancı tüfekleri ile yürüme esnasındaki isabetlilik tamamen kaldırıldı.'
        ]
      }
    ]
  },
  {
    id: '13.01',
    version: '13.01',
    date: '23.06.2026',
    category: 'Oyun Güncellemeleri',
    image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/16fa9cc677eef3f707f18579044d0c9f80cc1b4c-128x128.png',
    title: 'VALORANT 13.01 Yama Notları',
    summary: 'Lotus haritasındaki B kapısında yaşanan sıkışma problemleri düzeltildi ve turnuva istemcisi yenilendi.',
    sections: [
      {
        title: 'HARİTA GÜNCELLEMELERİ',
        content: [
          'Lotus haritasındaki B bölgesinde kapı sıkışma hataları giderildi.'
        ]
      }
    ]
  }
];

export default function ValorantPatchNotes() {
  const [selectedPatch, setSelectedPatch] = useState(null);

  if (selectedPatch) {
    return (
      <div style={{ backgroundColor: '#111', minHeight: '100vh', padding: '2rem', color: '#ece8e1', fontFamily: 'sans-serif', margin: '-2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <button 
            onClick={() => setSelectedPatch(null)}
            style={{ marginBottom: '2rem', padding: '0.8rem 1.5rem', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
            ← Geri Dön
            </button>

            <div style={{ backgroundColor: '#1a1a1a', overflow: 'hidden', border: '1px solid #333' }}>
            {/* Banner Area */}
            <div style={{ padding: '3rem', backgroundColor: '#161616', borderBottom: '1px solid #333', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: '#ff4655' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <span style={{ color: '#ff4655', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'block' }}>
                    {selectedPatch.category} <span style={{ color: '#555', margin: '0 0.5rem' }}>|</span> {selectedPatch.date}
                    </span>
                    <h3 style={{ fontSize: '3rem', margin: '0 0 1rem 0', textTransform: 'uppercase', color: '#ece8e1' }}>{selectedPatch.title}</h3>
                    <p style={{ color: '#aaa', margin: 0, maxWidth: '800px', lineHeight: '1.6', fontSize: '1.2rem' }}>{selectedPatch.summary}</p>
                </div>
                </div>
            </div>

            {/* Patch Details */}
            <div style={{ padding: '3rem' }}>
                {selectedPatch.sections.map((section, sIdx) => (
                <div key={sIdx} style={{ marginBottom: sIdx === selectedPatch.sections.length - 1 ? 0 : '3rem' }}>
                    <h4 style={{ color: '#ece8e1', fontSize: '1.8rem', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.8rem', textTransform: 'uppercase' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#ff4655', display: 'inline-block' }}></span>
                    {section.title}
                    </h4>
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    {section.content.map((point, pIdx) => (
                        <li key={pIdx} style={{ color: '#ccc', marginBottom: '1rem', paddingLeft: '2rem', position: 'relative', lineHeight: '1.8', fontSize: '1.1rem' }}>
                        <span style={{ position: 'absolute', left: 0, top: '12px', width: '6px', height: '6px', backgroundColor: '#ff4655', borderRadius: '50%' }}></span>
                        {point}
                        </li>
                    ))}
                    </ul>
                </div>
                ))}
            </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#111', minHeight: '100vh', padding: '2rem', margin: '-2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '2.5rem 1.5rem' 
        }}>
          {PATCH_NOTES.map((patch) => (
            <div 
              key={patch.id} 
              onClick={() => setSelectedPatch(patch)}
              style={{ 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'transparent'
              }}
              onMouseOver={(e) => {
                e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
                e.currentTarget.querySelector('h3').style.color = '#ff4655';
              }}
              onMouseOut={(e) => {
                e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                e.currentTarget.querySelector('h3').style.color = '#ece8e1';
              }}
            >
              {/* Image Container */}
              <div style={{ 
                width: '100%', 
                aspectRatio: '16/9', 
                overflow: 'hidden', 
                position: 'relative',
                marginBottom: '1rem',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333'
              }}>
                <img 
                  src={patch.image} 
                  alt={patch.title} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-out'
                  }} 
                  onError={(e) => {
                    // Fallback to a solid color if image fails to load
                    e.target.style.display = 'none';
                    e.target.parentElement.style.backgroundColor = '#1a1a1a';
                    e.target.parentElement.style.display = 'flex';
                    e.target.parentElement.style.alignItems = 'center';
                    e.target.parentElement.style.justifyContent = 'center';
                    e.target.parentElement.innerHTML = '<div style="color: #555; font-weight: bold; font-size: 2rem;">V26</div>' + e.target.parentElement.innerHTML;
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  backgroundColor: 'rgba(15, 25, 35, 0.8)',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </div>
              </div>

              {/* Text Content */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  <span style={{ color: '#ff4655' }}>{patch.category}</span>
                  <span style={{ color: '#555' }}>|</span>
                  <span style={{ color: '#aaa' }}>{patch.date}</span>
                </div>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontSize: '1.4rem', 
                  color: '#ece8e1',
                  fontWeight: 'bold',
                  transition: 'color 0.2s ease'
                }}>
                  {patch.title}
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: '#888', 
                  fontSize: '0.95rem', 
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {patch.summary}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
