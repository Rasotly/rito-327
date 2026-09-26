import React, { useState, useEffect } from 'react';

export default function ValorantHigherLowerAdmin({ token }) {
  const [questions, setQuestions] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Form States
  const [category, setCategory] = useState('Silah Fiyatı (VP)');
  const [item1Name, setItem1Name] = useState('');
  const [item1Image, setItem1Image] = useState('');
  const [item1Value, setItem1Value] = useState('');
  
  const [item2Name, setItem2Name] = useState('');
  const [item2Image, setItem2Image] = useState('');
  const [item2Value, setItem2Value] = useState('');

  const loadQuestions = () => {
    fetch('http://localhost:8081/higherlower.php?action=get_questions')
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setQuestions(json.data);
        }
      })
      .catch(err => console.error("Admin yükleme hatası:", err));
  };

  useEffect(() => {
    if (token) {
      loadQuestions();
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item1Name || !item1Image || !item1Value || !item2Name || !item2Image || !item2Value) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    setUploading(true);

    const payload = {
        category,
        item1_name: item1Name,
        item1_image: item1Image,
        item1_value: parseFloat(item1Value),
        item2_name: item2Name,
        item2_image: item2Image,
        item2_value: parseFloat(item2Value)
    };

    fetch('http://localhost:8081/higherlower.php?action=add_question', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(json => {
      if (json.status === 'success') {
        alert("Eşleşme başarıyla eklendi!");
        setItem1Name('');
        setItem1Image('');
        setItem1Value('');
        setItem2Name('');
        setItem2Image('');
        setItem2Value('');
        loadQuestions();
      } else {
        alert("Hata: " + json.message);
      }
      setUploading(false);
    })
    .catch(() => {
      alert("Yükleme sırasında hata oluştu.");
      setUploading(false);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu eşleşmeyi silmek istediğinize emin misiniz?")) return;
    
    fetch('http://localhost:8081/higherlower.php?action=delete_question&id=' + id, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(json => {
      if (json.status === 'success') {
        loadQuestions();
      } else {
        alert("Hata: " + json.message);
      }
    })
    .catch(() => {
      alert("Silme sırasında hata oluştu.");
    });
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      {/* Yükleme Formu */}
      <div style={{ flex: '1 1 400px', backgroundColor: '#111', padding: '2rem', borderRadius: '8px', border: '1px solid #333' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#aaa' }}>Yeni Eşleşme (VS) Ekle</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Kategori / Soru Konusu:</label>
            <input 
              type="text" 
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', backgroundColor: '#222', border: '1px solid #444', color: 'white', borderRadius: '4px' }}
            />
          </div>

          <div style={{ border: '1px solid #444', padding: '1rem', borderRadius: '4px', backgroundColor: '#1a1a1a' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#00ff00' }}>Kart 1 (Sabit İstatistik)</h4>
            <input placeholder="Örn: Asil Vandal" value={item1Name} onChange={e => setItem1Name(e.target.value)} style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem', backgroundColor: '#222', border: 'none', color: 'white' }} />
            <input placeholder="Resim URL'si (ör: https://...)" value={item1Image} onChange={e => setItem1Image(e.target.value)} style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem', backgroundColor: '#222', border: 'none', color: 'white' }} />
            <input placeholder="Değeri (Örn: 1775)" type="number" value={item1Value} onChange={e => setItem1Value(e.target.value)} style={{ width: '100%', padding: '0.8rem', backgroundColor: '#222', border: 'none', color: 'white' }} />
          </div>

          <div style={{ border: '1px solid #444', padding: '1rem', borderRadius: '4px', backgroundColor: '#1a1a1a' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#ff4655' }}>Kart 2 (Tahmin Edilecek)</h4>
            <input placeholder="Örn: Kuronami Vandal" value={item2Name} onChange={e => setItem2Name(e.target.value)} style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem', backgroundColor: '#222', border: 'none', color: 'white' }} />
            <input placeholder="Resim URL'si (ör: https://...)" value={item2Image} onChange={e => setItem2Image(e.target.value)} style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem', backgroundColor: '#222', border: 'none', color: 'white' }} />
            <input placeholder="Değeri (Örn: 2375)" type="number" value={item2Value} onChange={e => setItem2Value(e.target.value)} style={{ width: '100%', padding: '0.8rem', backgroundColor: '#222', border: 'none', color: 'white' }} />
          </div>

          <button 
            type="submit" 
            disabled={uploading}
            style={{ 
              padding: '1rem', 
              backgroundColor: uploading ? '#555' : '#00ff00', 
              color: 'black', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: uploading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold'
            }}
          >
            {uploading ? 'Kaydediliyor...' : 'Eşleşmeyi Kaydet'}
          </button>
        </form>
      </div>

      {/* Sorular Listesi */}
      <div style={{ flex: '1 1 400px' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#aaa' }}>Mevcut Eşleşmeler ({questions.length})</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {questions.length === 0 ? (
            <p style={{ color: '#555' }}>Henüz veri eklenmemiş.</p>
          ) : (
            questions.map(q => (
              <div key={q.id} style={{ display: 'flex', backgroundColor: '#111', padding: '1rem', borderRadius: '8px', border: '1px solid #333', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <img src={q.item1_image} style={{ width: '40px', height: '40px', objectFit: 'contain' }} alt="" />
                        <p style={{ margin: '0', fontSize: '0.8rem', color: '#00ff00' }}>{q.item1_name}</p>
                        <strong style={{ color: 'white' }}>{q.item1_value}</strong>
                    </div>
                    <div style={{ padding: '0 1rem', color: '#aaa', fontWeight: 'bold' }}>VS</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <img src={q.item2_image} style={{ width: '40px', height: '40px', objectFit: 'contain' }} alt="" />
                        <p style={{ margin: '0', fontSize: '0.8rem', color: '#ff4655' }}>{q.item2_name}</p>
                        <strong style={{ color: 'white' }}>{q.item2_value}</strong>
                    </div>
                </div>
                <button 
                  onClick={() => handleDelete(q.id)}
                  style={{ padding: '0.5rem', backgroundColor: '#ff4655', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Sil
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
