import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';

const BackArrow = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

function ValorantModule({ onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Fetch data from PHP backend
    fetch('http://localhost:8081?game=valorant')
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
    <div className="module-container val-theme" style={{ paddingLeft: '260px', width: '100%', boxSizing: 'border-box' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <button className="back-btn" onClick={onBack} style={{ position: 'absolute', right: '2rem', top: '2rem', zIndex: 100 }}>
        <BackArrow /> Merkeze Dön
      </button>

      {activeTab === 'home' && (
        <div className="content-panel" style={{ marginTop: '2rem', margin: '2rem auto', maxWidth: '800px' }}>
          <h1 className="header-title">Valorant Protokolü - HOME</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Ajan veritabanına bağlanılıyor...</p>

          <div className="data-card">
            <div style={{ marginBottom: '1rem' }}>
              <span className={`status-indicator ${error ? 'status-offline' : 'status-online'}`}></span>
              <span>Sistem Durumu: {error ? 'Çevrimdışı' : 'Çevrimiçi'}</span>
            </div>

            {loading && <p>Veriler yükleniyor...</p>}
            {error && <p style={{ color: 'var(--valorant-red)' }}>Bağlantı Hatası: {error}</p>}

            {data && (
              <div>
                <h3>Sunucu Mesajı</h3>
                <p>{data.message}</p>

                <div className="stat-grid">
                  <div className="stat-item">
                    <div className="stat-value">{data.stats.activePlayers}</div>
                    <div className="stat-label">Aktif Oyuncu</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{data.stats.serverStatus}</div>
                    <div className="stat-label">Sunucu</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{data.stats.currentAct}</div>
                    <div className="stat-label">Bölüm</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'maps' && (
        <div style={{ padding: '2rem' }}>
            <ValorantMaps />
        </div>
      )}
      {activeTab === 'agents' && (
        <div style={{ padding: '2rem' }}>
            <ValorantAgents />
        </div>
      )}
      {activeTab === 'weapons' && (
        <div style={{ padding: '2rem' }}>
            <ValorantWeapons />
        </div>
      )}
      {activeTab === 'game' && (
        <div style={{ padding: '2rem' }}>
            <ValorantGame />
        </div>
      )}
      {activeTab === 'heardle' && (
        <div style={{ width: '100%', padding: '2rem', boxSizing: 'border-box' }}>
            <ValorantHeardle onBack={() => setActiveTab('home')} />
        </div>
      )}
    </div>
  );
}

const OFFICIAL_MAPS = [
  { name: 'Abyss', location: 'Norveç', description: 'Uçurum kenarında, sınırları zorlayan dikey bir harita.', image: 'https://media.valorant-api.com/maps/224b0a95-48b9-f703-1bd8-67aca101a61f/listviewicontall.png' },
  { name: 'Sunset', location: 'Los Angeles, ABD', description: "Geleneksel üç şeritli tasarım ve Gekko'nun memleketi.", image: 'https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/listviewicontall.png' },
  { name: 'Lotus', location: 'Batı Ghats, Hindistan', description: 'Üç farklı bomba alanına sahip antik bir harabe.', image: 'https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/listviewicontall.png' },
  { name: 'Pearl', location: 'Lizbon, Portekiz', description: 'Su altındaki bir şehirde geçen, teleportsuz geniş bir harita.', image: 'https://media.valorant-api.com/maps/fd267378-4d1d-484f-ff52-77821ed10dc2/listviewicontall.png' },
  { name: 'Fracture', location: 'Santa Fe, ABD', description: 'Savunanların ortada, saldıranların dışarıda başladığı H şeklinde harita.', image: 'https://media.valorant-api.com/maps/b529448b-4d60-346e-e89e-00a4c527a405/listviewicontall.png' },
  { name: 'Breeze', location: 'Bermuda Şeytan Üçgeni', description: 'Geniş açık alanlar ve uzun görüş mesafeleri sunan tropik bir ada.', image: 'https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a969-74b4046ebd53/listviewicontall.png' },
  { name: 'Icebox', location: 'Bennett Adası, Rusya', description: 'Dikey oynanışa sahip karlı bir tundra haritası.', image: 'https://media.valorant-api.com/maps/e2ad5c54-4114-a870-9641-8ea21279579a/listviewicontall.png' },
  { name: 'Bind', location: 'Rabat, Fas', description: 'Ortası olmayan, ışınlanma kapılarına sahip çöl haritası.', image: 'https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/listviewicontall.png' },
  { name: 'Haven', location: 'Thimphu, Butan', description: 'Üç bomba alanına sahip geleneksel bir manastır haritası.', image: 'https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/listviewicontall.png' },
  { name: 'Split', location: 'Tokyo, Japonya', description: 'Dikey halatlara sahip, iki bomba alanlı şehir haritası.', image: 'https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/listviewicontall.png' },
  { name: 'Ascent', location: 'Venedik, İtalya', description: 'Kontrol edilebilir kapılara sahip, geniş bir orta alana sahip harita.', image: 'https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/listviewicontall.png' }
];

function ValorantMaps() {
  return (
    <div className="maps-section-container">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--valorant-red)', fontSize: '2rem', fontFamily: "'Teko', sans-serif" }}>Resmi Haritalar</h3>
      <div className="maps-grid">
        {[...OFFICIAL_MAPS].sort((a, b) => a.name.localeCompare(b.name)).map(map => (
          <div key={map.name} className="map-card" style={{ backgroundImage: `url(${map.image})` }}>
            <div className="map-card-overlay"></div>
            <div className="map-card-content">
              <h4>{map.name}</h4>
              <span className="map-location">{map.location}</span>
              <p>{map.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const OFFICIAL_AGENTS = [
  {
    "name": "GEKKO",
    "role": "Öncü",
    "description": "Los Angeles çocuğu Gekko yaratıklardan oluşan belalı tayfasına liderlik etmekte. Gekko\\'nun tayfası ileri atılarak düşmanların başına bela olur. Sonrasında Gekko onları toplar ve birlikte tekrar bela olacak düşman aramaya koyulurlar.",
    "image": "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "KANKUŞ",
        "description": "Kankuş\\'u KUŞAN. Kankuş\\'u düşman aramaya göndermek için ATEŞ ET. Kankuş gördüğü ilk düşmana doğru Sersemletici bir patlama oluşturur. Kankuş\\'un Spike\\'ı yerleştirmesi veya imha etmesi için Spike bölgesine veya yerleştirilmiş Spike\\'a nişan al ve ALT. ATIŞ kullan. Yerleştirmek için Spike Gekko\\'da olmalıdır. Kankuş süresi dolduğunda pasif bir küreye dönüşür. Onu geri almak ve kısa bir bekleme süresinin ardından bir Kankuş yükü daha edinmek için küreyle ETKİLEŞİME GİR.",
        "icon": "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "ŞAŞKIN",
        "description": "Şaşkın\\'ı KUŞAN. Şaşkın\\'ı havada süzülecek şekilde fırlatmak için ATEŞ ET. Şaşkın enerji topladıktan sonra görüşüne giren düşmanlara plazma atar. Plazmanın isabet ettiği düşmanlar Kör olur. Şaşkın süresi dolduğunda pasif bir küreye dönüşür. Onu geri almak ve kısa bir bekleme süresinin ardından bir Şaşkın yükü daha edinmek için küreyle ETKİLEŞİME GİR.",
        "icon": "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "POFUDUK TARLASI",
        "description": "Pofu\\'yu KUŞAN. Pofu\\'yu bomba gibi fırlatmak için ATEŞ ET. Yavaşça fırlatmak için ALT. ATIŞ kullan. Pofu indiği yerde büyük bir alana yayılır, bu alandaki düşmanlara her saniye düşük miktarda hasar verir ve kısa bir gecikmenin ardından patlar. Onu geri almak ve kısa bir bekleme süresinin ardından bir Pofu yükü daha edinmek için küreyle ETKİLEŞİME GİR.",
        "icon": "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "ZORBA",
        "description": "Zorba\\'yı KUŞAN. Zorba\\'nın zihnine girerek onunla düşman bölgesinde gezinmek için ATEŞ ET. Zorba\\'nın ileri atılıp patlayarak küçük bir alandaki tüm oyuncuları Alıkoyması için ETKİNLEŞTİR. Zorba süresi dolduğunda pasif bir küreye dönüşür. Onu geri almak ve kısa bir bekleme süresinin ardından bir Zorba yükü daha edinmek için küreyle ETKİLEŞİME GİR. Zorba yalnızca bir kere geri alınabilir.",
        "icon": "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "FADE",
    "role": "Öncü",
    "description": "Türk kelle avcısı Fade, düşmanların sırlarını gasp etmek için saf kâbus gücünü kullanır. Korkuyla uyum içinde çalışarak hedeflerini avlar ve hedeflerinin işini bitirmeden önce en büyük korkularını açığa çıkarır.",
    "image": "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "MIHLA",
        "description": "Bir saf korku yumağı KUŞAN. Fırlatmak için ATEŞ ET. Yumak belli bir süre sonra yere iner. Yumağı yere erken indirmek için TEKRAR KULLAN. Yumak yere indiğinde açılarak yakındaki düşmanları olduğu yere sabitler. Sabitlenmiş düşmanlar Sağır olur ve Çürüme hasarı almaya başlar.",
        "icon": "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "MUSALLAT",
        "description": "Musallat olan bir gözcü KUŞAN. Fırlatmak için ATEŞ ET. Gözcü belli bir süre sonra yere iner. Gözcüyü yere erken indirmek için TEKRAR KULLAN. Gözcü yere indiğinde etkinleşerek görüş menzili içinde kalan düşmanları Açığa Çıkarır ve hepsine dehşet izi uygular. Düşmanlar gözcüyü yok edebilir.",
        "icon": "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "ECEL",
        "description": "Bir Ecel KUŞAN. Ecel\\'i ileri göndermek için ATEŞ ET. Ecel\\'i nişangâhının baktığı tarafa doğru yönlendirmek için ATEŞ DÜĞMESİNİ BASILI TUT. Ecel gördüğü ilk düşmanın veya dehşet izinin peşine takılır ve yakaladığı düşmanın Görüşünü Kısıtlar.",
        "icon": "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "GECE KARANLIĞI",
        "description": "Kâbusun gücünü KUŞAN. Durdurulamaz bir kâbus enerjisi göndermek için ATEŞ ET. Dalgaya maruz kalan düşmanlar dehşet izleriyle İşaretlenir, Sağır olur ve Çürüme hasarı almaya başlar.",
        "icon": "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "BREACH",
    "role": "Öncü",
    "description": "İnsanüstü güçlere sahip İsveçli Breach, düşman zemininde sert bir şekilde yolu açan, hedeflenebilir kinetik dalgalar gönderir. Sebep olduğu hasar ve darbeler, savaşın dengelerini değiştirecek niteliktedir.",
    "image": "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "GÖZ KAMAŞTIRAN",
        "description": "Kör Edici bir yük KUŞAN. Duvarın içinden geçtikten sonra art arda hızla gerçekleşen patlamalar oluşturmak için ATEŞ ET. Patlayan yük, ona bakan herkesi Kör eder.",
        "icon": "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "FAY HATTI",
        "description": "Sismik bir darbe KUŞAN. Darbenin etkili olacağı mesafeyi arttırmak için BASILI TUT. Bir sarsıntı oluşturarak etki alanında ve alan hattı üzerinde kalan tüm oyuncuları Sersemletmek için SERBEST BIRAK.",
        "icon": "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "ARTÇI SARSINTI",
        "description": "Termonükleer bir yük KUŞAN. Duvarın içinden geçtikten sonra zamanla gerçekleşen patlamalar için ATEŞ ET. Patlayan yük, etki alanında kalan herkese ağır hasar verir.",
        "icon": "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "ZELZELE",
        "description": "Sismik bir yük KUŞAN. Geniş bir alanın içinde kalan zemini dalga dalga etkileyen bir deprem tetiklemek için ATEŞ ET. Depreme yakalanan herkes Sersemler ve havaya savrulur.",
        "icon": "https://media.valorant-api.com/agents/5f8d3a7f-467b-97f3-062c-13acf203c006/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "DEADLOCK",
    "role": "Gözcü",
    "description": "Norveçli ajan Deadlock, savaş esnasında en ölümcül saldırıları bile savuşturabilecek son teknoloji bir nanobağ ağı kullanır. Keskin gözlerinden kaçan, vahşetinden kurtulan olmamıştır.",
    "image": "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "SONİK SENSÖR",
        "description": "Bir Sonik Sensör KUŞAN. Sensörü yerleştirmek için ATEŞ ET. Sensör, düşman seslerini algılamak üzere bölgeyi tarar. Eğer taradığı bölgede ayak sesi, silah sesi veya yüksek ses tespit ederse bölgeye sersemletme uygular. Bu yeteneği TEKRAR YERLEŞTİRMEK üzere bıraktığın yerden alabilirsin.",
        "icon": "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "BARİYER AĞI",
        "description": "Bir Bariyer Ağı diski KUŞAN. Diski ileri fırlatmak için ATEŞ ET. Diskin indiği noktada yanlara doğru açılan ve karakterlerin hareketini engelleyen bariyerler oluşur.",
        "icon": "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "NANOÇEKİM",
        "description": "Bir NanoÇekim bombası KUŞAN. Fırlatmak için ATEŞ ET. Yavaşça fırlatmak için ALT. ATIŞ kullan. NanoÇekim bombası yere temas ettiğinde patlayarak etki alanında kalanların çömelmelerine neden olur ve onları yavaşlatır.",
        "icon": "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "KISKIVRAK",
        "description": "Bir Nanobağ Hızlandırıcı KUŞAN. Yakaladığı ilk düşmanı sarıp kıskıvrak yakalayan bir nanobağ dalgası göndermek için ATEŞ ET. Kozaya yakalanan düşman, oluşan nanobağ yolu boyunca çekilir. Düşman, nanobağ kozasından kurtarılmazsa ölür. Nanobağ kozası yok edilebilir.",
        "icon": "https://media.valorant-api.com/agents/cc8b64c8-4b25-4ff9-6e7f-37b4da43d235/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "TEJO",
    "role": "Öncü",
    "description": "Kolombiyalı deneyimli istihbarat danışmanı Tejo\\'nun balistik güdüm sistemi düşmanları oldukları yerden çıkmaya veya canlarını vermeye zorlar. İsabetli saldırıları sayesinde Tejo rakiplerinin dengesini bozar ve onlara karşı üstünlük kurar.",
    "image": "https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/background.png",
    "abilities": [
      {
        "slot": "Ability2",
        "name": "GÜDÜMLÜ SALVO",
        "description": "Sanal bir hedefleme sistemi KUŞAN. Harita üzerinden en fazla iki hedef konum seçmek için ATEŞ ET. Otomatik olarak hedef konumlara doğru güdümlenen ve hedefe ulaştığında art arda patlayarak hasar veren füzeler atmak için ALT. ATIŞ kullan.",
        "icon": "https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Ability1",
        "name": "ÖZEL TESLİMAT",
        "description": "Bir yapışkan bomba KUŞAN. Fırlatmak için ATEŞ ET. Bomba değdiği ilk yüzeye yapışır ve patlar. Patlamadan etkilenen tüm hedefler hasar alır ve Sersemler. Bombayı bir kere sekecek şekilde fırlatmak için ALT. ATIŞ kullan.",
        "icon": "https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "KIYAMET",
        "description": "Bir taktiksel saldırı hedefleme haritası KUŞAN. Saldırının başlangıç noktasını seçmek için ATEŞ ET. Saldırının biteceği noktayı da seçip saldırıyı başlatmak için tekrar ATEŞ ET ve seçilen rota boyunca ilerleyerek ölümcül hasar veren patlama dalgaları gönder. Harita hedeflemesi esnasında başlangıç noktasını iptal etmek için ALT. ATIŞ kullan.",
        "icon": "https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/abilities/ultimate/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "GİZLİ DRON",
        "description": "Gizli bir dron KUŞAN. Dronu ileri doğru fırlatıp hareketlerini kontrol etmeye başlamak için ATEŞ ET. İsabet alan düşmanları Sindiren ve Açığa Çıkaran bir dalga göndermek için tekrar ATEŞ ET.",
        "icon": "https://media.valorant-api.com/agents/b444168c-4e35-8076-db47-ef9bf368f384/abilities/grenade/displayicon.png"
      }
    ]
  },
  {
    "name": "RAZE",
    "role": "Düellocu",
    "description": "Bomba gibi bir kişiliğe ve kocaman silahlara sahip olan Raze, aramıza Brezilya\\'dan katılıyor. Kafa göz dalan oyun tarzıyla düşmanları saklandıkları deliklerden çıkarmakta ve dar alanları \\'\\'bam bam bam\\'\\' temizlemekte üstüne yoktur.",
    "image": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "PATLAYICI ÇANTA",
        "description": "Zemine yapışan bir Patlayıcı Çanta\\'yı ANINDA fırlat. Elinden çıkan çantayı patlatmak için yeteneği TEKRAR KULLAN. Çanta isabet ettiği her şeyi yerinden oynatır ve tamamen kurulduysa onlara hasar verir.",
        "icon": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "RENK TESİRLİ BOMBA",
        "description": "Bir parça tesirli el bombası KUŞAN. Fırlatmak için ATEŞ ET. Bomba patlayıp hasar verdikten sonra her biri menzilindeki herkese hasar veren bombacıklar oluşturur. Yavaşça fırlatmak için ALT. ATIŞ kullan. Renk Tesirli Bomba\\'nın yükü her iki skorda bir dolar.",
        "icon": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "BOMBOT",
        "description": "Bir Bombot KUŞAN. Göndermek için ATEŞ ET; bot yerde düz bir hat halinde ilerler ve duvarlardan seker. Bombot önündeki koni şeklindeki alana giren tüm düşmanlara kilitlenir ve onları kovalar. Yakalayabilirse, ağır hasar vererek patlar.",
        "icon": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "NEFES KESEN",
        "description": "Bir roketatar KUŞAN. Herhangi bir şeye temas ettiğinde patlayıp muazzam alan hasarı veren bir roket fırlatmak için ATEŞ ET.",
        "icon": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "CHAMBER",
    "role": "Gözcü",
    "description": "Her daim şık ve tam teçhizat dolaşan Fransız silah tasarımcısı Chamber, ölümcül isabetliliğiyle rakipleri ortadan kaldırıyor. Özel yeteneklerini kullanarak görüş mesafesi sağlar, uzaktaki rakipleri avlar ve her plana mükemmel bir şekilde uyum sağlar.",
    "image": "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/background.png",
    "abilities": [
      {
        "slot": "Ability2",
        "name": "BULUŞMA",
        "description": "Bir ışınlayıcı KUŞAN. Işınlayıcıyı zemine yerleştirmek için ATEŞ ET. Işınlayıcının menzilinde ve yerde dururken hızlıca ışınlayıcıya ışınlanmak için TEKRAR ETKİNLEŞTİR. Işınlayıcıyı TEKRAR YERLEŞTİRMEK üzere bıraktığın yerden alabilirsin.",
        "icon": "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "KARTVİZİT",
        "description": "Düşmanlar için etrafı tarayan bir tuzak KUŞAN. Tuzağı zemine yerleştirmek için ATEŞ ET. Görünen düşmanlar tuzağın menzili içine girdiğinde, tuzak geri sayıma başlar. Tuzak devreye girdiğinde etki alanını stabil olmayan bir hale getirerek içinde bulunan düşmanları Yavaşlatır. Tuzağı TEKRAR YERLEŞTİRMEK üzere bıraktığın yerden alabilirsin.",
        "icon": "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ability1",
        "name": "KELLE AVCISI",
        "description": "Ağır bir tabanca kuşanmak için ETKİNLEŞTİR. Tabancanın ALT. ATIŞI nişan almanı sağlar.",
        "icon": "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "KESKİN TARZ",
        "description": "Gövdeye doğrudan isabet ettiği düşmanları anında öldüren güçlü ve özel bir keskin nişancı tüfeği kuşanmak için ETKİNLEŞTİR. Nişan almak için ALT. ATIŞ kullan. Düşmanı öldürdüğün yerde, içine giren düşmanları Yavaşlatan bir etki alanı oluşur.",
        "icon": "https://media.valorant-api.com/agents/22697a3d-45bf-8dd7-4fec-84a9e28c69d7/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "KAY/O",
    "role": "Öncü",
    "description": "KAY/O, Radyantları etkisiz hale getirmek için üretilmiş bir savaş makinesi. Düşmanlarının yeteneklerini Sindirerek karşı koyma yetilerini bastırır. Böylece hem kendisini hem de takım arkadaşlarını korur.",
    "image": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/background.png",
    "abilities": [
      {
        "slot": "Grenade",
        "name": "PARÇA/Tesirli",
        "description": "Patlayıcı bir şarapnel KUŞAN. Fırlatmak için ATEŞ ET. Yavaşça fırlatmak için ALT. ATIŞ kullan. Şarapnel yere yapışır, sonrasında birden fazla kez patlar ve tam merkezinde bulunanlara neredeyse ölümcül hasar verir.",
        "icon": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ability1",
        "name": "FLAŞ/Bellek",
        "description": "Bir Kör Edici bomba KUŞAN. Yüksekten fırlatmak için ATEŞ ET. Daha zayıf ama hızlı patlayan bir Kör Edici bomba atmak için ALT. ATIŞ kullan. Kör Edici bomba kısa bir süre sonra patlayarak görüş menzili içinde bulunan herkesi Kör eder.",
        "icon": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "SIFIR/Noktası",
        "description": "Düşmanları Sindirmeni sağlayan bir bıçak KUŞAN. Fırlatmak için ATEŞ ET. Bıçak isabet ettiği ilk yüzeye saplanır ve kısa bir süre sonra patlayarak menzili içindeki düşmanları Sindirir. Düşmanlar bu bıçağı yok edebilir.",
        "icon": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "İPTAL/Komut",
        "description": "KAY/O, kutuplaşmış radyanit enerjisiyle ANINDA aşırı yüklenir ve bulunduğu konumdan devasa bir etki alanına sahip enerji dalgaları yayar. Enerji dalgalarının isabet ettiği düşmanlar kısa bir süreliğine Sindirilir. Aşırı yükleme durumundayken KAY/O Kuvvetli Savaş kazanır ve çöktüğünde yeniden stabil hale getirilebilir.",
        "icon": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "SKYE",
    "role": "Öncü",
    "description": "Aramıza Avustralya\\'dan katılan Skye, beraberinde getirdiği vahşi hayvan ordusuyla birlikte çatışmayı iyiden iyiye kızıştırıyor. Düşmana ayak bağı olan hayvanları ve takım arkadaşlarını iyileştirme yetisiyle, takımının gücünü pekiştiriyor ve takımdaki herkesi kolluyor.",
    "image": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "AV PEŞİNDE",
        "description": "Bir Tazmanya kaplanı figürü KUŞAN. Avcıyı gönderip onu kontrol etmek için ATEŞ ET. Hayvanı kontrol ederken birden ileri atılarak çarpma halinde Sersemletici bir patlamaya sebep olmak ve doğrudan isabet alan düşmanlara hasar vermek için ATEŞ ET.",
        "icon": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "KILAVUZ IŞIK",
        "description": "Bir şahin figürü KUŞAN. Şahini ileri göndermek için ATEŞ ET. Şahini nişangâhının baktığı tarafa yöneltmek için ATEŞ DÜĞMESİNİ BASILI TUT. Şahini havada uçarken Kör Edici bir bombaya çevirmek için yeteneği TEKRAR KULLAN. Şahinin uçuşu başladıktan kısa bir süre sonra Kör Etme maksimum potansiyeline ulaşır.",
        "icon": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "DOĞANIN ŞİFASI",
        "description": "İyileştiren bir figür KUŞAN. Şifa gücünü odaklayarak menzil içinde ve görüş hattındaki takım arkadaşlarını İyileştirmek için ATEŞ DÜĞMESİNİ BASILI TUT. Bu yetenek, şifa gücü tamamen tükenene kadar birden fazla kez kullanılabilir. Skye kendini iyileştiremez.",
        "icon": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "İZSÜRENLER",
        "description": "Bir İzsüren figürü KUŞAN. En yakındaki üç düşmanın peşine düşecek üç tane İzsüren göndermek için ATEŞ ET. Bir İzsüren hedefine ulaştığında, hedefin Görüşünü Kısıtlar ve onu yavaşlatır. Düşmanlar İzsürenleri yok edebilir.",
        "icon": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "CYPHER",
    "role": "Gözcü",
    "description": "Faslı bilgi uzmanı ve tek kişilik gözetleme ağı Cypher, düşmanın her hareketini bilir. Her sırrını duyar. Her manevrasını görür. Cypher\\'ın gözleri hep üzerinizdedir.",
    "image": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "SİBER KAFES",
        "description": "Siber kafesi ANINDA Cypher\\'ın önüne fırlat. Düşmanlar içinden geçtiğinde ses çıkaran ve görüşü engelleyen bir alan oluşturmak için ETKİNLEŞTİR.",
        "icon": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "GİZLİ KAMERA",
        "description": "Bir gizli kamera KUŞAN. Gizli kamerayı hedef konuma yerleştirmek için ATEŞ ET. Kamera görüşünü kontrol etmek için bu yeteneği TEKRAR KULLAN. Kamera kontrolü sendeyken düşmanları işaretleyen bir iğne fırlatmak için ATEŞ ET. Bu iğne, isabet ettiği herhangi bir düşmanın konumunu Açığa Çıkarır. Bu yeteneği TEKRAR YERLEŞTİRMEK üzere bıraktığın yerden alabilirsin.",
        "icon": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "BUBİ TUZAĞI",
        "description": "Bir bubi tuzağı KUŞAN. Hedef konuma yok edilebilir, gizli bir bubi tuzağı yerleştirmek için ATEŞ ET. Yerleştirilen konum ile karşısındaki duvar arasına bir hat çekilir. Bubi tuzağına yakalanan düşmanlar cihazı zamanında yok edemedikleri takdirde kısa süre içinde Yavaşlatılır ve Açığa Çıkar. Bu yeteneği TEKRAR YERLEŞTİRMEK üzere bıraktığın yerden alabilirsin.",
        "icon": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "NÖRON HIRSIZI",
        "description": "Ölü bir düşman üzerinde ANINDA kullan ve takımı hakkında bilgi indir. Kısa bir gecikmenin ardından hayatta olan diğer düşmanların konumu iki kere Açığa Çıkar.",
        "icon": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "SOVA",
    "role": "Öncü",
    "description": "Rusya\\'nın uçsuz bucaksız tundralarında yetişen Sova düşmanlarını acımasız bir verimlilik ve titizlikle tespit eder, izlerini sürer ve onları yok eder. Özel yayı ve sıra dışı iz sürme yetenekleri ile ondan kaçsanız da asla saklanamazsınız. ",
    "image": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "ŞOK OKU",
        "description": "Şok okuna sahip bir yay KUŞAN. Patlayıcı oku ileri yollamak için ATEŞ ET. Ok çarpışma anında infilak eder ve yakındaki oyunculara hasar verir. Atış mesafesini uzatmak için ATEŞ DÜĞMESİNİ BASILI TUT. Oku iki kereye kadar sektirmek için ALT. ATIŞ kullan.",
        "icon": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "KEŞİF OKU",
        "description": "Keşif okuna sahip bir yay KUŞAN. Keşif okunu ileri yollamak için ATEŞ ET. Ok çarpışma anında etkinleşir ve görüş hattı yakınında kalan düşmanların konumunu Açığa Çıkarır. Düşmanlar bu oku yok edebilir. Atış mesafesini uzatmak için ATEŞ DÜĞMESİNİ BASILI TUT. Oku iki kereye kadar sektirmek için ALT. ATIŞ kullan. ",
        "icon": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "BAYKUŞ DRON",
        "description": "Bir Baykuş Dron KUŞAN. Dronu göndermek ve hareketlerini kontrol etmek için ATEŞ ET. Dronun kontrolü sendeyken düşmanları işaretleyen bir iğne fırlatmak için ATEŞ ET. Bu iğne, isabet ettiği herhangi bir düşmanın konumunu Açığa Çıkarır. Düşmanlar Baykuş Dron\\'u yok edebilir.",
        "icon": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "AVCININ HİDDETİ",
        "description": "Üç taneye kadar duvar delici enerji patlaması ateşleyebilen bir yay KUŞAN. Sova\\'nın önündeki bir hat üzerinde enerji patlamaları oluşturmak ve isabet alan düşmanlara hasar verip konumlarını Açığa Çıkarmak için ATEŞ ET. Bu yetenek, yetenek sayacı etkinken iki kez daha YENİDEN KULLANILABİLİR.",
        "icon": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/ultimate/displayicon.png"
      },
      {
        "slot": "Passive",
        "name": "Tekinsiz Nişancı",
        "description": "Sova\\'nın özel yapım yayı, okları atar ve onları çevredeki yüzeylerden sektirebilir. Atış düğmesini basılı tutmak yayın gücünü yükler, bırakmak da oku serbest bırakır. Sekme sayısını ayarlamak için alternatif atış kullan. Okların yüzeylerden sekebilir. Sol fare düğmesini basılı tutmak, yayın menzil doğrultusunu genişletir. Sağ fare düğmesiyle yüzey sekme sayıları arasında geçiş yap. Sol fare düğmesi bırakıldığında ok serbest kalır.",
        "icon": null
      }
    ]
  },
  {
    "name": "MIKS",
    "role": "Kontrol Uzmanı",
    "description": "Hırvatistan\\'dan gelen Miks, saf ses enerjisini sahneye taşıyor. Bulaşıcı tutkusu ve ses dalgalarını kontrol eden güçleriyle ekibini birlikte hareket etmeye teşvik eder ve savaş alanının temposunu beraber değiştirirler.",
    "image": "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/background.png",
    "abilities": [
      {
        "slot": "Grenade",
        "name": "M PATLAMASI",
        "description": "M Patlaması\\'nı KUŞAN. ALT. ATIŞ ile Sersemletme ve İyileştirme arasında geçiş yap. Cihazı fırlatmak için ATEŞ ET. M Patlaması yere düştüğünde ses dalgaları yayarak oyunculara Sersemletme veya İyileştirme uygular.",
        "icon": "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "DALGA FORMU",
        "description": "Bir Harita Hedefleyicisi KUŞAN. Konum belirlemek için ATEŞ ET. ALT. ATIŞ ile belirlediğin konumlarda duman oluştur.",
        "icon": "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Ability1",
        "name": "ARMONİ",
        "description": "Armoni\\'yi KUŞAN. Bir takım arkadaşını hedef alarak ATEŞ ET ve hem kendine hem de hedeflediğin takım arkadaşına her öldürmeyle yenilenen bir Kuvvetli Savaş etkisi ve hız artışı sağla. Kendine Kuvvetli Savaş etkisi ve hız artışı sağlamak için ALT. ATIŞ kullan.",
        "icon": "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "BAS DEPREMİ",
        "description": "Bas Depremi\\'ni KUŞAN. İleriye doğru bir Ses Işıltısı hazırlayıp fırlatmak için ATEŞ ET. Oyuncuları geriye savurur, Sağırlaştırma ve Yavaşlatma uygular.",
        "icon": "https://media.valorant-api.com/agents/7c8a4701-4de6-9355-b254-e09bc2a34b72/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "KILLJOY",
    "role": "Gözcü",
    "description": "Alman dâhi Killjoy, kendi icatlarından oluşan cephaneliğiyle savaş meydanını kontrol altına alır. Cihazlarının verdiği hasar rakiplerini durdurmaya yetmezse robotlarının yardımıyla rakiplerini zayıflatarak onların ortadan kaldırılmalarını kolaylaştırır.",
    "image": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/background.png",
    "abilities": [
      {
        "slot": "Grenade",
        "name": "NANOSÜRÜ",
        "description": "Nanosürü bombası KUŞAN. Bombayı fırlatmak için ATEŞ ET. Nanosürü bir yere isabet ettiği anda gizlenir. Yavaşça fırlatmak için ALT. ATIŞ kullan. Hasar veren nano robot sürüsünü salmak için Nanosürü\\'yü ETKİNLEŞTİR.",
        "icon": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ability1",
        "name": "ALARM BOTU",
        "description": "Gizli bir Alarm Botu KUŞAN. Menzili içine giren düşmanların peşine düşen bir robot göndermek için ATEŞ ET. Robot hedefine ulaştığında patlayarak bölge içindeki düşmanları Savunmasız hale getirir. Gönderdiğin botu geri çağırmak için KUŞANMA DÜĞMESİNİ BASILI TUT.",
        "icon": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "TARET",
        "description": "Bir taret KUŞAN. 100 derecelik bir koni içindeki düşmanlara ateş eden bir taret yerleştirmek için ATEŞ ET. Taretin yönünü değiştirmek için hedef alırken tekrar KUŞAN. Döndürmek için ALT. ATIŞ\\'ı BASILI TUT. Yerleştirdiğin tareti kaldırmak için KUŞANMA DÜĞMESİNİ BASILI TUT.",
        "icon": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "TECRİT",
        "description": "Tecrit cihazını KUŞAN. Cihazı yerleştirmek için ATEŞ ET. Uzun bir hazırlık süresinin ardından cihazın etki alanında kalan düşmanların hepsi Alıkoyulur. Bu cihaz düşmanlar tarafından yok edilebilir.",
        "icon": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "HARBOR",
    "role": "Kontrol Uzmanı",
    "description": "Hindistan\\'ın kıyılarından gelen Harbor, kadim teknolojilerle suya hükmederek sahada fırtınalar koparıyor. Dostlarını korumak ve düşmanlarını alt etmek için güçlü akıntılar ve coşkun dalgalar çağırıyor.",
    "image": "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "TAŞKIN",
        "description": "Taşkın\\'ı KUŞAN. Suyu zemin boyunca hareket ettirmek için ATEŞ ET. Suyu nişangâhının baktığı tarafa yöneltmek ve güzergâhı boyunca görüş engelleyen bir perde oluşturmak için ATEŞ DÜĞMESİNİ BASILI TUT. Suyu erkenden durdurmak için ALT. ATIŞ\\'a bas. Taşkın\\'ı geçen tüm oyuncular Yavaşlar.",
        "icon": "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "FIRTINA AKINI",
        "description": "Fırtına Akını\\'nı KUŞAN. Fırlatmak için ATEŞ ET ve kısa bir sürenin ardından içindeki oyuncuları Yavaşlatan ve onların Görüşlerini Kısıtlayan patlayıcı bir girdap oluştur.",
        "icon": "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "DALGAKIRAN",
        "description": "Dalgakıran\\'ı KUŞAN. Belirlenen konumda bir su dumanı oluşturmak için ETKİNLEŞTİR. Hedef alma esnasında işaretçiyi daha uzağa götürmek için ATEŞ DÜĞMESİNİ BASILI TUT, yakına getirmek içinse ALT. ATIŞ DÜĞMESİNİ BASILI TUT. Hedef almaya geçmek için DOLDURMA DÜĞMESİNE BAS. Su dumanını korumak ve ona isabet eden tüm kurşunları engellemek için TEKRAR ETKİNLEŞTİR. Korunan su dumanı yok edilebilir.",
        "icon": "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "KAYNAMA NOKTASI",
        "description": "Kaynama Noktası\\'nı KUŞAN. Yadigârının gerçek gücünü açığa çıkarmak için ATEŞ ET ve ileri doğru giderek isabet ettiği düşmanlara Görüş Kısıtlama ve Yavaşlatma uygulayan bir su dalgası oluştur.",
        "icon": "https://media.valorant-api.com/agents/95b78ed7-4637-86d9-7e41-71ba8c293152/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "VYSE",
    "role": "Gözcü",
    "description": "Vyse sıvı metali kontrol ederek düşmanlarını sürüden ayıran, tuzağa düşüren ve silahsız bırakan bir dâhi. Kurnazlığı ve manipülasyon kabiliyeti sayesinde karşısına çıkanları bizzat savaş alanının kendisinden korkar hale getirir.",
    "image": "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "DİKENLİ ÇİT",
        "description": "Bir miktar sıvı metal KUŞAN. Gizli bir duvar tuzağı yerleştirmek için ATEŞ ET. Bir düşman tuzaktan geçtiğinde arkasında yok edilemeyen bir duvar oluşur. Duvar kısa bir süre sonra ortadan kalkar.",
        "icon": "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "ARK GÜLÜ",
        "description": "Bir Ark Gülü KUŞAN. Gizli bir Ark Gülü yerleştirmek için bir yüzeye hedef al ve ATEŞ ET. Ark Gülü\\'nü duvarın arkasına yerleştirmek için ALT. ATIŞ kullan. Ark Gülü\\'ne bakan tüm oyuncuları kör etmek için yeteneği TEKRAR KULLAN. Bu yeteneği TEKRAR YERLEŞTİRMEK üzere bıraktığın yerden alabilirsin.",
        "icon": "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "KESKİN SARMAŞIK",
        "description": "Bir miktar sıvı metal KUŞAN. Fırlatmak için ATEŞ ET. Sıvı metal indiği konumda görünmez olur. Keskin sarmaşıklardan oluşan ve içerisindeki tüm oyuncuları yavaşlatıp onlara hasar veren geniş bir alan oluşturmak için ETKİNLEŞTİR.",
        "icon": "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "ÇELİK BAHÇESİ",
        "description": "Dikenli bir sıvı metal KUŞAN. Metal dikenlerden oluşan bir akım gönderip kısa bir süre sonra düşmanların birincil silahlarına TUTUKLUK YAPTIRMAK için ATEŞ ET.",
        "icon": "https://media.valorant-api.com/agents/efba5359-4016-a1e5-7626-b1ae76895940/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "VIPER",
    "role": "Kontrol Uzmanı",
    "description": "Amerikalı kimyager Viper zehir yüklü, çeşit çeşit kimyasal cihazıyla savaş alanını kontrol altında tutarken düşmanın görüşünü de sekteye uğratır. Avını zehriyle değilse bile aklıyla mutlaka avcunun içine alır.",
    "image": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "ZEHİR BULUTU",
        "description": "Bir gaz salgılayıcı KUŞAN. Tur boyunca devamlı yerde kalacak salgılayıcıyı fırlatmak için ATEŞ ET. Yavaşça fırlatmak için ALT. ATIŞ kullan. Yakıt harcayarak içindeki rakiplere Çürüme uygulayan zehirli bir duman bulutu oluşturmak için yeteneği TEKRAR KULLAN. Bu yeteneği tur başlamadan önce TEKRAR YERLEŞTİRMEK üzere bıraktığın yerden alabilirsin ve tur boyunca birden fazla kez TEKRAR KULLANABİLİRSİN.",
        "icon": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "ZEHİR PERDESİ",
        "description": "Yüzeyleri delip geçen bir gaz salgılayıcı fırlatıcısı KUŞAN. Gaz salgılayıcılardan uzun bir hat oluşturmak için ATEŞ ET. Yeteneği TEKRAR KULLAN ve içinden geçen rakiplere Çürüme uygulayan yüksek bir zehir duvarı yakıt karşılığında oluştur. Bu yetenek birden fazla kez TEKRAR KULLANILABİLİR.",
        "icon": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "ASİT HAVUZU",
        "description": "Bir kimyasal fırlatıcı KUŞAN. Yere çarptığında parçalanan bir kapsül fırlatmak için ATEŞ ET. Oluşturduğu uzun süreli kimyasal alanda kalan düşmanlar hasar alır ve Savunmasız hale gelir.",
        "icon": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "VIPER'IN İNİ",
        "description": "Bir kimyasal püskürtücü KUŞAN. Viper\\'ın etrafında her yöne yayılan kimyasal bir bulut oluşturmak için ATEŞ ET. Oluşan geniş bulut, içinde kalan oyuncuların Görüşünü Kısıtlar ve düşmanların canlarını Çürütür. Bulutu erken dağıtmak için yetenek düğmesini BASILI TUT.",
        "icon": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/abilities/ultimate/displayicon.png"
      },
      {
        "slot": "Passive",
        "name": "Zehirli",
        "description": "Yeteneklerini kullanmanı sağlayan zehri zamanla üretir ve yenilersin. Viper\\'ın Zehir Bulutu, Zehir Perdesi veya Viper\\'ın İni\\'nin içinden geçen düşmanlara anında en az 30 Çürüme uygulanır. Bu yeteneklere maruz kalma süresine göre Çürüme oranı artar.",
        "icon": null
      }
    ]
  },
  {
    "name": "PHOENIX",
    "role": "Düellocu",
    "description": "Aramıza Birleşik Krallık\\'tan katılan ve yıldızlardan aldığı gücü dövüş stilinin her noktasına yansıtan Phoenix, savaş alanını alevlerle ve patlamalarla aydınlatır. Arkasında destek olsun olmasın, bildiği gibi savaşmak için ileri atılacağından şüpheniz olmasın.",
    "image": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/background.png",
    "abilities": [
      {
        "slot": "Grenade",
        "name": "ATEŞTEN DUVAR",
        "description": "Bir ateş duvarı KUŞAN. Haritanın içinde ilerleyen, görüş engelleyen ve içinden geçenlere hasar veren ateş duvarını göndermek için ATEŞ ET. Ateş duvarı Phoenix\\'e hasar vermek yerine onu iyileştirir. Ateş duvarını nişangâhın yönünde bükmek için BASILI TUTARAK ATEŞ ET.",
        "icon": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ability1",
        "name": "YAKAR TOP",
        "description": "Bir alev topu KUŞAN. Yere temas ettiğinde ya da bir gecikmenin ardından patlayan alev topunu fırlatmak için ATEŞ ET. Yerde bir süre kalan alev bölgesi düşmanlara hasar verir. Alev bölgesi Phoenix\\'e hasar vermek yerine onu iyileştirir. Yavaşça fırlatmak için ALT. ATIŞ kullan.",
        "icon": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "FALSO",
        "description": "Kavisli giden ve fırlatıldıktan kısa bir süre sonra patlayan bir işaret küresi KUŞAN. İşaret küresine sola doğru yön vermek için ATEŞ ET. Küre patladığında onu gören tüm oyuncular Kör olur. Küreyi sağa doğru göndermek için ALT. ATIŞ kullan. Falso\\'nun yükü her iki skorda bir dolar.",
        "icon": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "YAKARDÖNER",
        "description": "Phoenix\\'in bulunduğu konumu ANINDA işaretle. Yetenek etkinken ölmek veya süresinin dolması yeteneği sonlandırır ve Phoenix\\'i işaretlenen konumda dolu canla ve yeteneği kullandığı esnadaki zırh miktarıyla hayata döndürür.",
        "icon": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/abilities/ultimate/displayicon.png"
      },
      {
        "slot": "Passive",
        "name": "Tutuşuyor",
        "description": "Phoenix kendi ateşinin içinde durduktan sonra hasar almak yerine PASİF olarak İyileşir.",
        "icon": null
      }
    ]
  },
  {
    "name": "VETO",
    "role": "Gözcü",
    "description": "Durdurulamaz bir DNA mutasyonuyla gücüne güç katan Senegalli fedai Veto, rakibinin güçlerini ve teknolojisini etkisiz kılarak çatışma kurallarını hiçe sayıyor. Veto\\'nun savaş meydanında tek güvenilir seçeneğin silahların.",
    "image": "https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/background.png",
    "abilities": [
      {
        "slot": "Ability2",
        "name": "TEHDİTSAVAR",
        "description": "Tehditsavar\\'ı KUŞAN. Tehditsavar\\'ı belirlenen konuma yerleştirmek için ATEŞ ET. Yerleştirdikten sonra etkinleştirmek için TEKRAR KULLAN. Etkin haldeki Tehditsavar bir oyuncudan SEKEBİLEN veya silahla yok edilebilen bütün yetenekleri yok eder. Düşmanlar Tehditsavar\\'ı yok edebilir.",
        "icon": "https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "GERİ SAR",
        "description": "Bir burgaç KUŞAN. Zemine yerleştirmek için ATEŞ ET. Burgaca ışınlanmak için menzilindeyken ve burgaca bakarken ETKİNLEŞTİR. SATIN ALMA EVRESİ sırasında burgacı TEKRAR YERLEŞTİRMEK üzere geri alabilirsin.",
        "icon": "https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "EVRİM",
        "description": "ANINDA tamamen mutasyona uğramaya başlayarak kuvvetli savaş ile can yenilemesi ve bütün zayıflatma etkilerine karşı BAĞIŞIKLIK kazanırsın.",
        "icon": "https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/abilities/ultimate/displayicon.png"
      },
      {
        "slot": "Ability1",
        "name": "DARBOĞAZ",
        "description": "Mutasyonundan yapışkan bir parçacık KUŞAN. Fırlatmak için ATEŞ ET. Parçacık yere değdiğinde açılır ve düşmanları yerine sabitleyen bir tuzak oluşturur. Sabitlenmiş düşmanlar Sağır olur ve Çürüme hasarı almaya başlar. Düşmanlar etkinleşmeden önce tuzağı yok edebilir.",
        "icon": "https://media.valorant-api.com/agents/92eeef5d-43b5-1d4a-8d03-b3927a09034b/abilities/ability1/displayicon.png"
      }
    ]
  },
  {
    "name": "ASTRA",
    "role": "Kontrol Uzmanı",
    "description": "Ganalı ajan Astra, kozmosun enerjisini kullanarak savaş meydanını lehine değiştirebiliyor. Astral yolculuğu üzerinde tam kontrole sahip olması ve engin stratejik öngörüsüyle, düşmanın bir sonraki hamlesinden her zaman birkaç ışık yılı önde.",
    "image": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "NOVA DARBESİ",
        "description": "Astral Yolcu halindeyken yıldız yerleştir (ulti düğmesi).\n\nPatlayarak Nova Darbesi oluşturması için bir yıldızı ETKİNLEŞTİR. Nova Darbesi kısa bir süre güç topladıktan sonra patlayarak etki alanı içindeki tüm oyuncuları Sersemletir.",
        "icon": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "YILDIZ BULUTU / KOZMİK ÇÖZÜNÜM",
        "description": "Astral Yolcu halindeyken yıldız yerleştir (ulti düğmesi). \nDönüşerek Yıldız Bulutu (duman) oluşturması için bir yıldızı ETKİNLEŞTİR.\nBir yıldızı Kozmik Çözünüm\\'le geri almak için KULLAN. Geri alınan yıldızı belli bir süre sonra tekrar yerleştirebilirsin.\nKozmik Çözünüm, dönmeden önce yıldızın yerinde kısa süreliğine sahte bir Yıldız Bulutu oluşturur.",
        "icon": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "ÇEKİM ALANI",
        "description": "Astral Yolcu halindeyken yıldız yerleştir (ulti düğmesi).\n\nÇekim Alanı oluşturmak için bir yıldızı ETKİNLEŞTİR. Etki alanı içindeki oyuncular merkeze çekilir ve ardından merkez patlayarak içerideki oyuncuları Savunmasız hale getirir.",
        "icon": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "ASTRAL YOLCU / \nKOZMİK AYRIM",
        "description": "ATIŞ düğmesiyle yıldız yerleştirebileceğin Astral Yolcu haline geçmek için ETKİNLEŞTİR. Yerleştirilen yıldızlar daha sonra etkinleştirilerek Nova Darbesi, Yıldız Bulutu ve Çekim Alanı\\'na dönüştürülebilir.\n\nKozmik Ayrım yeteneği hazır olduğunda Astral Yolcu halindeyken ALT. ATIŞ kullanarak hedef al ve ATIŞ düğmesine basarak iki konum seç. Bu iki konum arasında sonsuz bir Kozmik Ayrım bağlantısı oluşur. Kozmik Ayrım mermileri ve sesleri engeller.",
        "icon": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/abilities/ultimate/displayicon.png"
      },
      {
        "slot": "Passive",
        "name": "ASTRAL YOLCU",
        "description": "Astral Yolcu haline geçmek için ultiyi ETKİNLEŞTİR ve TEMEL ATIŞ düğmesiyle yıldız yerleştir. Yeteneklerini kullanmak için yıldızları Nova Darbesi, Yıldız Bulutu veya Çekim Alanı\\'yla hedef al.",
        "icon": "https://media.valorant-api.com/agents/41fb69c1-4189-7b37-f117-bcaf1e96f1bf/abilities/passive/displayicon.png"
      }
    ]
  },
  {
    "name": "BRIMSTONE",
    "role": "Kontrol Uzmanı",
    "description": "Aramıza ABD\\'den katılan Brimstone\\'un hava araçları sayesinde takımı her zaman 1-0 öndedir. Gereken her türlü işlevselliği titizlikle ve güvenle sağlaması, muharebe alanında bu kumandanı eşsiz kılar.",
    "image": "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/background.png",
    "abilities": [
      {
        "slot": "Grenade",
        "name": "KUVVET İŞARETİ",
        "description": "ANINDA bir Kuvvet İşareti at. Yere inen Kuvvet İşareti oyunculara Kuvvetli Savaş ve Hız Takviyesi sağlayan bir alan oluşturur.",
        "icon": "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ability1",
        "name": "YAKICI",
        "description": "Bir yangın bombası atar KUŞAN. Yerde durduğu anda infilak eden bir bomba fırlatmak için ATEŞ ET. Yerde bir süre kalan alev bölgesi, içindeki oyunculara hasar verir.",
        "icon": "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "DUMANLI HAVA SAHASI",
        "description": "Bir taktik harita KUŞAN. Brimstone\\'un duman bulutlarının ineceği konumları belirlemek için ATEŞ ET. Seçili alanda görüş engelleyen uzun süreli duman bulutları oluşturmak için ALT. ATIŞ ile onayla.",
        "icon": "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "UYDU SALDIRISI",
        "description": "Bir taktik harita KUŞAN. Seçili konuma bir süre yerde kalan bir uydu saldırısı lazeri fırlatmak için ATEŞ ET. Seçili alanda kalan oyuncular zaman içinde yüksek hasar alır.",
        "icon": "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "ISO",
    "role": "Düellocu",
    "description": "Çinli kiralık suikastçı Iso düşmanların saflarını darmadağın etmek için bir akış haline girer. Çevredeki enerjiyi yeniden şekillendirerek kurşun geçirmez bir kalkana dönüştüren Iso odağını yitirmeden bir sonraki ölümüne düellosuna ilerler.",
    "image": "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "GAREZ",
        "description": "Bir moleküler dalga KUŞAN. Dalgayı ileri fırlatarak temas ettiği bütün oyunculara Savunmasız ve Sindirme etkileri uygulamak için ATEŞ ET. Bu dalga duvarlar dahil olmak üzere sert cisimlerin içinden geçebilir.",
        "icon": "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "KİRALIK KATİL",
        "description": "Bir boyutlararası arena KUŞAN. Seni ve temas ettiği ilk düşmanı iyileştirip ölümüne bir düelloya gireceğiniz arenaya çekecek bir enerji dalgasını savaş meydanına göndermek için ATEŞ ET.",
        "icon": "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/abilities/ultimate/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "ÇELİK İRADE",
        "description": "ANINDA odaklanmaya başla. Odaklanma tamamlandığında herhangi bir kaynaktan gelecek ilk hasarı engelleyen bir kalkan kazanırsın, silahını daha hızlı doldurursun ve öldürdüğün veya ölmeden önce senden hasar alan düşmanların enerji küresi düşürdüğü bir akış haline girersin. Bu küreye ateş ettiğinde akış halini ve var olan kalkanını yenilersin veya yeni bir kalkan kazanırsın.",
        "icon": "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "B PLANI",
        "description": "Prizmatik enerji biriktirmek için KUŞAN. Yok edilemeyen ve mermileri engelleyen bir enerji duvarını ileri doğru göndermek için ATEŞ ET. Duvarı ileri doğru daha yavaş göndermek için ALT. ATIŞ kullan.",
        "icon": "https://media.valorant-api.com/agents/0e38b510-41a8-5780-5e8f-568b2a4f2d6c/abilities/grenade/displayicon.png"
      }
    ]
  },
  {
    "name": "CLOVE",
    "role": "Kontrol Uzmanı",
    "description": "İskoç ajan Clove muziplikleriyle hem çatışma sırasında hem de ölümden sonra sürekli ortalığı karıştırıyor. Ölüm nedir bilmeyen bu genç ajanın mezarından çıkıp gelerek düşmanlarının başına bela olması daima an meselesi.",
    "image": "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/background.png",
    "abilities": [
      {
        "slot": "Grenade",
        "name": "DİNÇLEŞTİRİCİ ÖZÜT",
        "description": "Clove\\'un öldürdüğü veya hasar vererek asist aldığı düşmanlardan yaşam enerjisi çekerek hız ve geçici can kazanmak için ETKİNLEŞTİR.",
        "icon": "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "KATAKULLİ",
        "description": "Savaş meydanının haritasını KUŞAN. Clove\\'un duman bulutlarının düşeceği konumları belirlemek için ATEŞ ET. Seçili alanlarda görüş engelleyen duman bulutları oluşturmak için ALT. ATIŞ ile onayla. Clove bu yeteneği öldükten sonra da kullanabilir.",
        "icon": "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "DAHA ÖLMEDİK",
        "description": "Öldükten sonra hayata dönmek için ETKİNLEŞTİR. Clove hayata döndükten sonra belirli bir süre içerisinde bir skor veya hasar yoluyla asist almazsa ölür. Yeteneği erkenden iptal etmek için TEKRAR ETKİNLEŞTİR.",
        "icon": "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/abilities/ultimate/displayicon.png"
      },
      {
        "slot": "Ability1",
        "name": "İŞGÜZAR",
        "description": "Bir ölümsüzlük özü parçası KUŞAN. Parçayı fırlatmak için ATEŞ ET. Fırlattığın parça yere değdikten sonra kısa bir gecikmenin ardından patlayarak etki alanında kalan tüm hedeflere geçici Çürüme uygular.",
        "icon": "https://media.valorant-api.com/agents/1dbf2edd-4729-0984-3115-daa5eed44993/abilities/ability1/displayicon.png"
      }
    ]
  },
  {
    "name": "NEON",
    "role": "Düellocu",
    "description": "Filipinli Ajan Neon, şoke edici bir hızla öne atılır ve bedeninin ürettiği biyoelektrik dalgalarını düşmanların üstüne salar. Düşmanları gafil avlamak için yarışırcasına koşar ve hepsini yıldırım hızıyla indirir.",
    "image": "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/background.png",
    "abilities": [
      {
        "slot": "Ability2",
        "name": "YÜKSEK DEVİR",
        "description": "Neon\\'u Hızlandırmak için ANINDA gücünü odakla. Yükü dolduğunda atılmak için ALT. ATIŞ\\'la elektrikli kayma hareketini etkinleştir. Her iki skorda bir kayma hareketinin yükü dolar.",
        "icon": "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Ability1",
        "name": "ELEKTRO OK",
        "description": "ANINDA bir enerji oku fırlat. Ok bir kere seker. Ok bir yüzeye çarptığında Sersemletici bir patlamayla altındaki zemine elektrik akımı verir.",
        "icon": "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "HIZ ŞERİDİ",
        "description": "Önüne doğru, kısa bir mesafe veya bir yüzeye çarpana kadar ilerleyen iki enerji hattı çıkarmak için ATEŞ ET. Bu enerji hatları, görüş engelleyen statik elektrik duvarlarına dönüşür.",
        "icon": "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "ENERJİ PATLAMASI",
        "description": "Neon\\'un tüm gücünü ve hızını kısa bir süreliğine etkinleştirerek tüm yakıtını yenile ve bir kayma yükü kazan. Gücünü, hareket ederken isabetliliği yüksek olan ölümcül bir ışın saldırısına dönüştürmek için ATEŞ ET. Skor almak bu etkinin süresini yeniler. ",
        "icon": "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "YORU",
    "role": "Düellocu",
    "description": "Japon Yoru, gerçeklikte açtığı geçitlerden geçerek düşman hattına sinsice sızıyor. Yanılsamalardan ve kaba kuvvetten eşit oranda faydalanarak hedeflerini göz açıp kapayıncaya kadar indiriyor.",
    "image": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/background.png",
    "abilities": [
      {
        "slot": "Grenade",
        "name": "FAKE AT",
        "description": "Etkinleştirildiğinde Yoru\\'nun birebir kopyası biçiminde bir yanılsama KUŞAN. Yanılsamayı etkinleştirerek ileri göndermek için ATEŞ ET. Hareketsiz bir yanılsama yerleştirmek için ALT. ATIŞ\\'a bas. Yerleştirilmiş hareketsiz yanılsamanın ileri yürümesi için KULLAN\\'a bas. Yanılsamalar düşmanlar tarafından yok edildiğinde Kör Edici bir flaşla patlar.",
        "icon": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ability1",
        "name": "KÖR NOKTA",
        "description": "Kararsız bir boyut parçacığını gerçeklikten koparıp almak için KUŞAN. Parçacığı fırlatmak için ATEŞ ET. Fırlattığın parçacık sert bir yüzeye çarptığında Kör Edici bir ışık saçar.",
        "icon": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "ÇATKAPI",
        "description": "Bir boyut geçidi küresi KUŞAN. Küreyi ilerletmek için ATEŞ ET. Küreyi sabit bir yere yerleştirmek için ALT. ATIŞ kullan. Kürenin bulunduğu konuma ışınlanmak için küreyi ETKİNLEŞTİR. Sahte bir ışınlanma görüntüsü vermek için KULLAN. ÇATKAPI\\'nın yükü her iki skorda bir dolar.",
        "icon": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "BOYUTLARARASI GEÇİŞ",
        "description": "Boyutlararasını görebilen bir maske KUŞAN. Yoru\\'nun boyutuna geçmek için ATEŞ ET. Yoru\\'nun boyutundayken dışarıdaki düşmanlar tarafından görülemez ve onlardan etkilenmezsin. Yoru\\'nun boyutundan erken ayrılmak için TEKRAR ETKİNLEŞTİR.",
        "icon": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "WAYLAY",
    "role": "Düellocu",
    "description": "Taylandlı prizmatik radyant Waylay, bizzat ışığın kendisine dönüşüp savaş alanının bir ucundan diğer ucuna fırlar. Hedeflerini göz açıp kapayıncaya kadar ışık parçalarıyla alt eden Waylay daha onlar ne olduğunu anlamadan güvenli bir noktaya dönmüştür bile.",
    "image": "https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/background.png",
    "abilities": [
      {
        "slot": "Ability2",
        "name": "KIRILMA",
        "description": "ANINDA yere bir ışık huzmesi yerleştir. Saf ışığa dönüşüp hızlı bir şekilde ışık huzmesinin konumuna dönmek için TEKRAR ETKİNLEŞTİR. Saf ışığa dönüştüğünde hasar görmez olursun. Kırılma\\'nın yükü her iki skorda bir dolar.",
        "icon": "https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "TUTULMA",
        "description": "Bir ışık kümesi KUŞAN. Kümeyi fırlatmak için ATEŞ ET. Işık kümesi yere temas ettiği anda patlar ve yakındaki oyunculara Ağırlaştırma uygulayarak onları güçlü bir hareket ve silah yavaşlatmasına maruz bırakır.",
        "icon": "https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ability1",
        "name": "IŞIK HIZI",
        "description": "Hızla atılmaya hazırlanmak için KUŞAN. İki kere ileri atılmak için ATEŞ ET. Bir kere ileri atılmak için ALT. ATIŞ kullan. İlk atılmada yukarı yönlü hareket edebilirsin.",
        "icon": "https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "YAKINSAYAN IŞINLAR",
        "description": "Prizmatik gücünü odaklamak için KUŞAN. Işın demeti saçan bir kopyanı oluşturmak için ATEŞ ET. Kısa bir gecikmenin ardından büyük oranda hızlanırsın ve ışın demeti genişleyerek bölgedeki diğer oyunculara Ağırlaştırma uygular.",
        "icon": "https://media.valorant-api.com/agents/df1cb487-4902-002e-5c17-d28e83e78588/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "SAGE",
    "role": "Gözcü",
    "description": "Çinli ve kapı gibi Sage gittiği her yerde kendisini ve takımını güvende tutar. Öldürülen silah arkadaşlarını hayata döndürme yeteneği ve agresif saldırıları bertaraf edebilmesiyle, cehennemvari savaş meydanında etrafına huzur verir.",
    "image": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "YAVAŞLATAN KÜRE",
        "description": "Bir yavaşlatma küresi KUŞAN. Yere temas ettiğinde patlayarak bir süre yerde kalan ve oluşturduğu alanda kalan oyuncuları ve oyuncuların atılma hızlarını Yavaşlatan bir yavaşlatma küresi göndermek için ATEŞ ET.",
        "icon": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "CAN KÜRESİ",
        "description": "Bir iyileştirme küresi KUŞAN. Nişangâhını hasar almış bir silah arkadaşına doğrult ve onu Zaman İçinde İyileştirmek için ATEŞ ET. Sage hasar aldıysa, kendini Zaman İçinde İyileştirmek için ALT. ATIŞ kullan.",
        "icon": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "BARİYER KÜRESİ",
        "description": "Bir Bariyer Küresi KUŞAN. Birkaç saniye sonra güçlenen bir duvar yerleştirmek için ATEŞ ET. ALT. ATIŞ, hedefleyiciyi döndürür.",
        "icon": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "DİRİLİŞ",
        "description": "Bir diriltme yeteneği KUŞAN. Nişangâhını dost bir cesede doğrult ve onu hayata döndürmek için ATEŞ ET. Silah arkadaşın kısa bir sürenin ardından tamamen iyileşmiş olarak hayata döner.",
        "icon": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "REYNA",
    "role": "Düellocu",
    "description": "Meksika\\'nın kalbinden kopup gelen Reyna, teke tek çatışmalarda düşmanını ezer ve aldığı her skorla daha da coşar. Yapabilecekleri tamamen saf beceri gerektirir ve onu ciddi şekilde performansa dayalı kılar. ",
    "image": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "SÖMÜR",
        "description": "Ruh Hasadı: Reyna\\'dan hasar aldıktan sonra 3 saniye içinde ölen düşmanlar, arkalarında 3 saniyeliğine Ruh Küreleri bırakır.\r\nSömür: ANINDA bir Ruh Küresi\\'ni tüket ve hızla geçici can kazan. İMPARATORİÇE etkinse Sömür otomatik olarak kullanılır, Ruh Küresi harcamaz ve iyileştirme kalıcı olur.",
        "icon": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "AZLET",
        "description": "Yakınlardaki bir Ruh Küresi\\'ni ANINDA tüketerek kısa süreliğine Saydamlaş. İMPARATORİÇE etkinse, aynı zamanda Görünmez olursun.",
        "icon": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "KEM GÖZ",
        "description": "Yok edilebilir, ruhtan bir göz KUŞAN. Gözü yakın mesafede ileri doğru kullanmak için ETKİNLEŞTİR. Göz, ona bakan tüm düşmanların Görüşünü Kısıtlar.",
        "icon": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "İMPARATORİÇE",
        "description": "ANINDA bir coşku haline geçerek atış, kuşanma ve doldurma hızını ciddi şekilde arttıran bir Kuvvetli Savaş edin. Ruh Hasadı yetenekleri için sonsuz yük kazanırsın.",
        "icon": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "OMEN",
    "role": "Kontrol Uzmanı",
    "description": "Bir anının hayaleti olan Omen gölgelerin içinde avlanır. Düşmanlarını kör eder, savaş alanını boydan boya kat eder ve paranoyanın, onun ne taraftan saldıracağını anlamaya çalışan rakiplerinin damarlarında gezinmesini sağlar.",
    "image": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "PARANOYA",
        "description": "Kör edici bir küre KUŞAN. İleri fırlatmak için ATEŞ ET. Küre kısa süreliğine, dokunduğu düşmanların Görüşünü Kısıtlar ve onları Sağır eder. Bu yetenek doğrudan duvarlardan geçebilir.",
        "icon": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "KARANLIK ÖRTÜ",
        "description": "Bir gölge küresi KUŞAN, küreleri yerleştirmek ve hedef almak için soyut bir dünyaya adım at. Küreyi işaretlenen konuma fırlatarak görüş engelleyen uzun süreli bir gölge küresi oluşturmak için yetenek düğmesine BAS. Hedef alma esnasında işaretçiyi daha uzağa götürmek için ATEŞ DÜĞMESİNİ BASILI TUT. İşaretçiyi daha yakına getirmek için ALT. ATIŞ DÜĞMESİNİ BASILI TUT. Normal hedef almaya geçmek için DOLDURMA DÜĞMESİNE BAS.",
        "icon": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "GİZLİ ADIM",
        "description": "Bir gizli adım yeteneği KUŞAN ve menzil göstergesini görüntüle. Kısa bir beklemenin ardından işaretli konuma ışınlanmak için ATEŞ ET.",
        "icon": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "GÖLGELERİN İÇİNDEN",
        "description": "Bir taktik harita KUŞAN. Seçili konuma ışınlanmaya başlamak için ATEŞ ET. Omen, ışınlanma esnasında Gölge suretine bürünür ve düşmanları onu yok ederek ışınlanmayı iptal edebilir ya da Omen KUŞANMAYA BASARAK ışınlanmasını kendisi iptal edebilir.",
        "icon": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/abilities/ultimate/displayicon.png"
      }
    ]
  },
  {
    "name": "JETT",
    "role": "Düellocu",
    "description": "Anavatanı Güney Kore\\'yi temsil eden Jett\\'in çevik ve darbelerden kaçmaya dayalı dövüş tarzı, başkalarının alamadığı riskleri almasını sağlar. Her çatışmada üstünlüğünü belli eder ve rakipleri daha nerede olduğunu anlamadan onları kesip biçmeye başlar.",
    "image": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/fullportrait.png",
    "background": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/background.png",
    "abilities": [
      {
        "slot": "Ability1",
        "name": "HAFİFLE",
        "description": "Jett\\'i ANINDA havaya doğru fırlat.",
        "icon": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/ability1/displayicon.png"
      },
      {
        "slot": "Ability2",
        "name": "RÜZGÂR GİBİ",
        "description": "Kısa süreliğine sert bir rüzgâr estirmeye hazırlanmak için ETKİNLEŞTİR. Jett\\'i hareket ettiği yönde fırlatmak için TEKRAR KULLAN. Jett hareketsiz durursa ileriye doğru atılır. Rüzgâr Gibi\\'nin yükü her iki skorda bir dolar.",
        "icon": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/ability2/displayicon.png"
      },
      {
        "slot": "Grenade",
        "name": "DUMAN BULUTU",
        "description": "ANINDA yaptığın atış, yüzeye çarptığında patlayarak kısa süreliğine görüş engelleyen bir sis bulutuna dönüşür. Duman bulutuna nişangâhın yönünde falso vermek için yetenek düğmesini BASILI TUT.",
        "icon": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/grenade/displayicon.png"
      },
      {
        "slot": "Ultimate",
        "name": "KESKİN FIRTINA",
        "description": "Oldukça isabetli fırlatma bıçakları KUŞAN. Hedefine tek bir bıçak fırlatmak için ATEŞ ET. Düşmanı öldürdüğünde yükü dolacak. Kalan tüm hançerleri hedefine fırlatmak için ALT. ATIŞ kullan. Bu saldırı düşmanı öldürdüğünde yük doldurmaz.",
        "icon": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/ultimate/displayicon.png"
      },
      {
        "slot": "Passive",
        "name": "SÜZÜL",
        "description": "Düşerken zıplama düğmesini basılı tutmak, havada süzülmeni sağlar.",
        "icon": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/passive/displayicon.png"
      }
    ]
  }
];


function ValorantAgents() {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeRole, setActiveRole] = useState('Tümü');

  const roles = ['Tümü', 'Düellocu', 'Gözcü', 'Kontrol Uzmanı', 'Öncü'];

  const filteredAgents = activeRole === 'Tümü'
    ? OFFICIAL_AGENTS
    : OFFICIAL_AGENTS.filter(a => a.role === activeRole);

  if (selectedAgent) {
    return (
      <div className="agent-details-container">
        <button className="back-btn" onClick={() => setSelectedAgent(null)} style={{ marginBottom: '2rem' }}>
          <BackArrow /> Geri Dön
        </button>
        
        <div className="agent-details-layout">
          <div className="agent-details-header">
            <h1 className="agent-details-name">{selectedAgent.name}</h1>
            <p className="agent-details-role">{selectedAgent.role}</p>
            <p className="agent-details-desc">{selectedAgent.description}</p>
          </div>
          
          <div className="agent-abilities-section">
            <h2 className="abilities-title">ÖZEL YETENEKLERİ</h2>
            <div className="abilities-vertical-list">
              {selectedAgent.abilities.filter(a => a.icon).map((ability, index) => (
                <div key={index} className="ability-item">
                  <div className="ability-icon-wrapper">
                    <img src={ability.icon} alt={ability.name} className="ability-icon" />
                  </div>
                  <div className="ability-info">
                    <h4 className="ability-name">{ability.name}</h4>
                    <p className="ability-desc">{ability.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="maps-section-container">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--valorant-red)', fontSize: '2rem', fontFamily: "'Teko', sans-serif" }}>Ajanlar</h3>
      
      <div className="weapon-categories">
        {roles.map(role => (
          <button 
            key={role} 
            className={`category-btn ${activeRole === role ? 'active' : ''}`}
            onClick={() => setActiveRole(role)}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="maps-grid">
        {[...filteredAgents].sort((a, b) => a.name.localeCompare(b.name)).map(agent => (
          <div key={agent.name} className="map-card agent-card" onClick={() => setSelectedAgent(agent)} style={{ backgroundImage: `url(${agent.image})`, backgroundSize: '150%', backgroundPosition: 'center top', backgroundColor: '#2b1d22' }}>
            <div className="map-card-overlay"></div>
            <div className="map-card-content">
              <h4>{agent.name}</h4>
              <span className="map-location">{agent.role}</span>
              <p>{agent.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const OFFICIAL_WEAPONS = [
  {
    "name": "ODIN",
    "category": "Ağır Silah",
    "image": "https://media.valorant-api.com/weapons/63e6c2b6-4a8e-869c-3d4c-e38355226584/displayicon.png",
    "cost": 3200,
    "stats": {
      "fireRate": 12,
      "magazineSize": 100,
      "equipTimeSeconds": 1.25,
      "reloadTimeSeconds": 5
    }
  },
  {
    "name": "ARES",
    "category": "Ağır Silah",
    "image": "https://media.valorant-api.com/weapons/55d8a0f4-4274-ca67-fe2c-06ab45efdf58/displayicon.png",
    "cost": 1600,
    "stats": {
      "fireRate": 13,
      "magazineSize": 50,
      "equipTimeSeconds": 1.25,
      "reloadTimeSeconds": 3.25
    }
  },
  {
    "name": "VANDAL",
    "category": "Taarruz Tüfeği",
    "image": "https://media.valorant-api.com/weapons/9c82e19d-4575-0200-1a81-3eacf00cf872/displayicon.png",
    "cost": 2900,
    "stats": {
      "fireRate": 9.75,
      "magazineSize": 25,
      "equipTimeSeconds": 1,
      "reloadTimeSeconds": 2.5
    }
  },
  {
    "name": "WARDEN",
    "category": "Taarruz Tüfeği",
    "image": "https://media.valorant-api.com/weapons/8db0a1bf-4a50-832a-4566-faaaa6d250ca/displayicon.png",
    "cost": 2900,
    "stats": {
      "fireRate": 6.5,
      "magazineSize": 18,
      "equipTimeSeconds": 1,
      "reloadTimeSeconds": 2.5
    }
  },
  {
    "name": "BULLDOG",
    "category": "Taarruz Tüfeği",
    "image": "https://media.valorant-api.com/weapons/ae3de142-4d85-2547-dd26-4e90bed35cf7/displayicon.png",
    "cost": 2050,
    "stats": {
      "fireRate": 10,
      "magazineSize": 24,
      "equipTimeSeconds": 1,
      "reloadTimeSeconds": 2.5
    }
  },
  {
    "name": "PHANTOM",
    "category": "Taarruz Tüfeği",
    "image": "https://media.valorant-api.com/weapons/ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a/displayicon.png",
    "cost": 2900,
    "stats": {
      "fireRate": 11,
      "magazineSize": 30,
      "equipTimeSeconds": 1,
      "reloadTimeSeconds": 2.5
    }
  },
  {
    "name": "JUDGE",
    "category": "Pompalı",
    "image": "https://media.valorant-api.com/weapons/ec845bf4-4f79-ddda-a3da-0db3774b2794/displayicon.png",
    "cost": 1850,
    "stats": {
      "fireRate": 3.5,
      "magazineSize": 5,
      "equipTimeSeconds": 1,
      "reloadTimeSeconds": 2.2
    }
  },
  {
    "name": "BUCKY",
    "category": "Pompalı",
    "image": "https://media.valorant-api.com/weapons/910be174-449b-c412-ab22-d0873436b21b/displayicon.png",
    "cost": 850,
    "stats": {
      "fireRate": 1.1,
      "magazineSize": 5,
      "equipTimeSeconds": 1,
      "reloadTimeSeconds": 2.5
    }
  },
  {
    "name": "FRENZY",
    "category": "Tabancalar",
    "image": "https://media.valorant-api.com/weapons/44d4e95c-4157-0037-81b2-17841bf2e8e3/displayicon.png",
    "cost": 450,
    "stats": {
      "fireRate": 10,
      "magazineSize": 15,
      "equipTimeSeconds": 1,
      "reloadTimeSeconds": 1.5
    }
  },
  {
    "name": "CLASSIC",
    "category": "Tabancalar",
    "image": "https://media.valorant-api.com/weapons/29a0cfab-485b-f5d5-779a-b59f85e204a8/displayicon.png",
    "cost": 0,
    "stats": {
      "fireRate": 6.75,
      "magazineSize": 12,
      "equipTimeSeconds": 0.75,
      "reloadTimeSeconds": 1.75
    }
  },
  {
    "name": "BANDIT",
    "category": "Tabancalar",
    "image": "https://media.valorant-api.com/weapons/410b2e0b-4ceb-1321-1727-20858f7f3477/displayicon.png",
    "cost": 600,
    "stats": {
      "fireRate": 5.1,
      "magazineSize": 8,
      "equipTimeSeconds": 0.75,
      "reloadTimeSeconds": 1.5
    }
  },
  {
    "name": "GHOST",
    "category": "Tabancalar",
    "image": "https://media.valorant-api.com/weapons/1baa85b4-4c70-1284-64bb-6481dfc3bb4e/displayicon.png",
    "cost": 500,
    "stats": {
      "fireRate": 6.75,
      "magazineSize": 13,
      "equipTimeSeconds": 0.75,
      "reloadTimeSeconds": 1.5
    }
  },
  {
    "name": "SHERIFF",
    "category": "Tabancalar",
    "image": "https://media.valorant-api.com/weapons/e336c6b8-418d-9340-d77f-7a9e4cfe0702/displayicon.png",
    "cost": 800,
    "stats": {
      "fireRate": 4,
      "magazineSize": 6,
      "equipTimeSeconds": 1,
      "reloadTimeSeconds": 2.25
    }
  },
  {
    "name": "SHORTY",
    "category": "Tabancalar",
    "image": "https://media.valorant-api.com/weapons/42da8ccc-40d5-affc-beec-15aa47b42eda/displayicon.png",
    "cost": 300,
    "stats": {
      "fireRate": 3,
      "magazineSize": 2,
      "equipTimeSeconds": 0.75,
      "reloadTimeSeconds": 1.75
    }
  },
  {
    "name": "OPERATOR",
    "category": "Keskin Nişancı",
    "image": "https://media.valorant-api.com/weapons/a03b24d3-4319-996d-0f8c-94bbfba1dfc7/displayicon.png",
    "cost": 4700,
    "stats": {
      "fireRate": 0.6,
      "magazineSize": 5,
      "equipTimeSeconds": 1.5,
      "reloadTimeSeconds": 3.7
    }
  },
  {
    "name": "GUARDIAN",
    "category": "Taarruz Tüfeği",
    "image": "https://media.valorant-api.com/weapons/4ade7faa-4cf1-8376-95ef-39884480959b/displayicon.png",
    "cost": 2250,
    "stats": {
      "fireRate": 5.25,
      "magazineSize": 12,
      "equipTimeSeconds": 1,
      "reloadTimeSeconds": 2.5
    }
  },
  {
    "name": "OUTLAW",
    "category": "Keskin Nişancı",
    "image": "https://media.valorant-api.com/weapons/5f0aaf7a-4289-3998-d5ff-eb9a5cf7ef5c/displayicon.png",
    "cost": 2400,
    "stats": {
      "fireRate": 2.75,
      "magazineSize": 2,
      "equipTimeSeconds": 1.25,
      "reloadTimeSeconds": 3.8
    }
  },
  {
    "name": "MARSHAL",
    "category": "Keskin Nişancı",
    "image": "https://media.valorant-api.com/weapons/c4883e50-4494-202c-3ec3-6b8a9284f00b/displayicon.png",
    "cost": 950,
    "stats": {
      "fireRate": 1.5,
      "magazineSize": 5,
      "equipTimeSeconds": 1.25,
      "reloadTimeSeconds": 2.5
    }
  },
  {
    "name": "SPECTRE",
    "category": "Hafif Makineli",
    "image": "https://media.valorant-api.com/weapons/462080d1-4035-2937-7c09-27aa2a5c27a7/displayicon.png",
    "cost": 1600,
    "stats": {
      "fireRate": 13.333,
      "magazineSize": 30,
      "equipTimeSeconds": 0.75,
      "reloadTimeSeconds": 2.25
    }
  },
  {
    "name": "STINGER",
    "category": "Hafif Makineli",
    "image": "https://media.valorant-api.com/weapons/f7e1b454-4ad4-1063-ec0a-159e56b58941/displayicon.png",
    "cost": 1100,
    "stats": {
      "fireRate": 16,
      "magazineSize": 20,
      "equipTimeSeconds": 0.75,
      "reloadTimeSeconds": 2.25
    }
  },
  {
    "name": "YAKIN DÖVÜŞ SİLAHI",
    "category": "Yakın Dövüş",
    "image": "https://media.valorant-api.com/weapons/2f59173c-4bed-b6c3-2191-dea9b58be9c7/displayicon.png",
    "cost": 0,
    "stats": null
  }
];



function ValorantWeapons() {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  
  const categories = ['Tümü', 'Tabancalar', 'Hafif Makineli', 'Pompalı', 'Taarruz Tüfeği', 'Keskin Nişancı', 'Ağır Silah', 'Yakın Dövüş'];
  
  const filteredWeapons = activeCategory === 'Tümü' 
    ? OFFICIAL_WEAPONS 
    : OFFICIAL_WEAPONS.filter(w => w.category === activeCategory);

  return (
    <div className="weapons-section-container">
      <h3 className="weapons-header">KOLEKSİYON (SİLAHLAR)</h3>
      
      <div className="weapon-categories">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="weapons-grid">
        {filteredWeapons.map(weapon => (
          <div key={weapon.name} className="weapon-card">
            <div className="weapon-cost">
              {weapon.cost > 0 && <span>¤ {weapon.cost}</span>}
            </div>
            <div className="weapon-image-wrapper">
              <img src={weapon.image} alt={weapon.name} className="weapon-image" />
            </div>
            <div className="weapon-info">
              <h4>{weapon.name}</h4>
              <span>{weapon.category}</span>
            </div>
            {weapon.stats && (
              <div className="weapon-stats">
                <div className="stat-row"><span>Atış Hızı:</span> <span>{weapon.stats.fireRate}</span></div>
                <div className="stat-row"><span>Şarjör:</span> <span>{weapon.stats.magazineSize}</span></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


const GAME_SKILLS = [
  {
    "name": "PATLAYICI ÇANTA",
    "agentName": "RAZE",
    "image": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/abilities/ability1/displayicon.png",
    "cost": 300
  },
  {
    "name": "RENK TESİRLİ BOMBA",
    "agentName": "RAZE",
    "image": "https://media.valorant-api.com/agents/f94c3b30-42be-e959-889c-5aa313dba261/abilities/ability2/displayicon.png",
    "cost": 200
  },
  {
    "name": "SİBER KAFES",
    "agentName": "CYPHER",
    "image": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/abilities/ability1/displayicon.png",
    "cost": 200
  },
  {
    "name": "GİZLİ KAMERA",
    "agentName": "CYPHER",
    "image": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/abilities/ability2/displayicon.png",
    "cost": 100
  },
  {
    "name": "ŞOK OKU",
    "agentName": "SOVA",
    "image": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/ability1/displayicon.png",
    "cost": 400
  },
  {
    "name": "KEŞİF OKU",
    "agentName": "SOVA",
    "image": "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/abilities/ability2/displayicon.png",
    "cost": 150
  },
  {
    "name": "NANOSÜRÜ",
    "agentName": "KILLJOY",
    "image": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/abilities/grenade/displayicon.png",
    "cost": 250
  },
  {
    "name": "ALARM BOTU",
    "agentName": "KILLJOY",
    "image": "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/abilities/ability1/displayicon.png",
    "cost": 200
  },
  {
    "name": "ZEHİR BULUTU",
    "agentName": "VIPER",
    "image": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/abilities/ability1/displayicon.png",
    "cost": 300
  },
  {
    "name": "ZEHİR PERDESİ",
    "agentName": "VIPER",
    "image": "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/abilities/ability2/displayicon.png",
    "cost": 200
  },
  {
    "name": "YAKAR TOP",
    "agentName": "PHOENIX",
    "image": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/abilities/ability1/displayicon.png",
    "cost": 250
  },
  {
    "name": "FALSO",
    "agentName": "PHOENIX",
    "image": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/abilities/ability2/displayicon.png",
    "cost": 200
  },
  {
    "name": "YAVAŞLATAN KÜRE",
    "agentName": "SAGE",
    "image": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/abilities/ability1/displayicon.png",
    "cost": 400
  },
  {
    "name": "CAN KÜRESİ",
    "agentName": "SAGE",
    "image": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/abilities/ability2/displayicon.png",
    "cost": 200
  },
  {
    "name": "SÖMÜR",
    "agentName": "REYNA",
    "image": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/abilities/ability1/displayicon.png",
    "cost": 200
  },
  {
    "name": "AZLET",
    "agentName": "REYNA",
    "image": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/abilities/ability2/displayicon.png",
    "cost": 250
  },
  {
    "name": "PARANOYA",
    "agentName": "OMEN",
    "image": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/abilities/ability1/displayicon.png",
    "cost": 250
  },
  {
    "name": "KARANLIK ÖRTÜ",
    "agentName": "OMEN",
    "image": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/abilities/ability2/displayicon.png",
    "cost": 100
  },
  {
    "name": "HAFİFLE",
    "agentName": "JETT",
    "image": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/ability1/displayicon.png",
    "cost": 150
  },
  {
    "name": "DUMAN BULUTU",
    "agentName": "JETT",
    "image": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/abilities/grenade/displayicon.png",
    "cost": 200
  }
];


function ValorantGame({ onBack }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('valHighScore') || '0'));
  
  const playableSkills = GAME_SKILLS;
  
  const getRandomSkill = (excludeSkill) => {
      let s;
      do {
          s = playableSkills[Math.floor(Math.random() * playableSkills.length)];
      } while (excludeSkill && (s.name === excludeSkill.name || s.cost === excludeSkill.cost));
      return s;
  };

  const [skillA, setSkillA] = useState(getRandomSkill(null));
  const [skillB, setSkillB] = useState(getRandomSkill(skillA));
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleGuess = (guessHigher) => {
      const isHigher = skillB.cost > skillA.cost;
      const correct = (guessHigher && isHigher) || (!guessHigher && !isHigher);
      
      if (correct) {
          setFeedback('correct');
          setScore(s => s + 1);
          setTimeout(() => {
              setSkillA(skillB);
              setSkillB(getRandomSkill(skillB));
              setFeedback(null);
          }, 1500);
      } else {
          setFeedback('wrong');
          if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('valHighScore', score);
          }
          setTimeout(() => {
              setGameOver(true);
          }, 2000);
      }
  };

  const restartGame = () => {
      setScore(0);
      setGameOver(false);
      setFeedback(null);
      const sA = getRandomSkill(null);
      setSkillA(sA);
      setSkillB(getRandomSkill(sA));
  };

  if (gameOver) {
      return (
          <div className="game-container game-over-container">
              <h2 style={{fontSize: '5rem', color: 'var(--valorant-red)', fontFamily: "'Teko', sans-serif"}}>OYUN BİTTİ</h2>
              <p style={{fontSize: '2rem'}}>Skorun: {score}</p>
              <p style={{fontSize: '1.5rem', color: 'var(--text-secondary)'}}>En Yüksek Skor: {highScore}</p>
              <button onClick={restartGame} className="category-btn active" style={{marginTop: '2rem', padding: '1rem 3rem', fontSize: '1.5rem'}}>Tekrar Oyna</button>
          </div>
      );
  }

  return (
      <div className="game-container">
          <div className="game-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem'}}>
              
              <h3 style={{fontFamily: "'Teko', sans-serif", fontSize: '3rem', margin: 0}}>HANGİ YETENEK DAHA PAHALI?</h3>
              <div className="game-score" style={{fontSize: '1.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1.5rem', borderRadius: '50px', whiteSpace: 'nowrap'}}>Skor: {score} | Yüksek: {highScore}</div>
          </div>
          
          <div className="game-arena">
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className={`game-card-half ${feedback === 'correct' ? 'correct-bg' : feedback === 'wrong' ? 'wrong-bg' : ''}`}>
                      <div className="game-card-content">
                          <img src={skillA.image} alt={skillA.name} className="game-img" style={{filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'}} />
                          <h2>{skillA.name}</h2>
                          <p style={{color: 'var(--text-secondary)', margin: '0 0 1rem 0'}}>{skillA.agentName}</p>
                          {feedback ? (
                              <p className="price text-green">¤ {skillA.cost}</p>
                          ) : (
                              <p className="price" style={{color: 'transparent'}}>¤ {skillA.cost}</p>
                          )}
                      </div>
                  </div>
                  {!feedback && (
                      <div className="guess-buttons" style={{ flexDirection: 'row', gap: '1rem', marginTop: '1.5rem', visibility: 'hidden' }}>
                          <button className="btn-higher" style={{ flex: 1, whiteSpace: 'nowrap', padding: '1rem 0' }}>▲ DAHA PAHALI</button>
                          <button className="btn-lower" style={{ flex: 1, whiteSpace: 'nowrap', padding: '1rem 0' }}>▼ DAHA UCUZ</button>
                      </div>
                  )}
              </div>
              
              <div className="vs-circle" style={{ marginTop: feedback ? '0' : '-35px' }}>VS</div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className={`game-card-half ${feedback === 'correct' ? 'correct-bg' : feedback === 'wrong' ? 'wrong-bg' : ''}`}>
                      <div className="game-card-content">
                          <img src={skillB.image} alt={skillB.name} className="game-img" style={{filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'}} />
                          <h2>{skillB.name}</h2>
                          <p style={{color: 'var(--text-secondary)', margin: '0 0 1rem 0'}}>{skillB.agentName}</p>
                          
                          {feedback ? (
                              <p className={`price ${feedback === 'correct' ? 'text-green' : 'text-red'}`}>¤ {skillB.cost}</p>
                          ) : (
                              <p className="price" style={{color: 'transparent'}}>¤ {skillB.cost}</p>
                          )}
                      </div>
                  </div>
                  {!feedback && (
                      <div className="guess-buttons" style={{ flexDirection: 'row', gap: '1rem', marginTop: '1.5rem' }}>
                          <button onClick={() => handleGuess(true)} className="btn-higher" style={{ flex: 1, whiteSpace: 'nowrap', padding: '1rem 0' }}>▲ DAHA PAHALI</button>
                          <button onClick={() => handleGuess(false)} className="btn-lower" style={{ flex: 1, whiteSpace: 'nowrap', padding: '1rem 0' }}>▼ DAHA UCUZ</button>
                      </div>
                  )}
              </div>
          </div>
      </div>
  );
}


let HEARDLE_DATA = [];
if (typeof OFFICIAL_AGENTS !== 'undefined') {
    let _hId = 1;
    OFFICIAL_AGENTS.forEach(agent => {
        if (agent.abilities) {
            agent.abilities.forEach(ab => {
                // KAY/O is special, otherwise format as Title Case (Gekko, Fade, etc.)
                let folderName = agent.name;
                if (agent.name.toUpperCase() === 'KAY/O') {
                    folderName = 'KAY/O';
                } else {
                    folderName = agent.name.charAt(0).toUpperCase() + agent.name.slice(1).toLowerCase();
                }
                
                HEARDLE_DATA.push({
                    id: _hId++,
                    title: `${agent.name} (${ab.name})`,
                    url: `/valorant/abilities/${folderName}/${ab.slot.toLowerCase()}.wav`,
                    answer: agent.name, // To match agent name check
                    abilityName: ab.name // Additional field if needed later
                });
            });
        }
    });
} else {
    HEARDLE_DATA = [
        { id: 1, title: "Jett (Rüzgâr Gibi)", url: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg", answer: "Jett" }
    ];
}

function ValorantHeardle({ onBack }) {
    const [currentSound, setCurrentSound] = useState(HEARDLE_DATA[Math.floor(Math.random() * HEARDLE_DATA.length)]);
    const [lives, setLives] = useState(3);
    const [wrongGuesses, setWrongGuesses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [gameStatus, setGameStatus] = useState('playing');
    const audioRef = React.useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = currentSound.url;
            audioRef.current.volume = volume;
            audioRef.current.load();
        }
    }, [currentSound]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const playAudio = () => {
        if (isPlaying || !audioRef.current) {
            if (audioRef.current && isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
            return;
        }
        audioRef.current.play();
        setIsPlaying(true);
    };

    const replayAudio = () => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const handleEnded = () => setIsPlaying(false);
        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, []);

    const handleGuess = (agentName, abilityName) => {
        if (gameStatus !== 'playing') return;

        // Strict check: both agent name and ability name must match if abilityName is provided in data
        const isCorrect = currentSound.abilityName 
            ? (currentSound.abilityName.toLowerCase() === abilityName.toLowerCase() && currentSound.answer.toLowerCase() === agentName.toLowerCase())
            : (currentSound.answer.toLowerCase() === agentName.toLowerCase() || currentSound.title.toLowerCase().includes(agentName.toLowerCase()));

        if (isCorrect) {
            setGameStatus('won');
        } else {
            const guessLabel = `${agentName} - ${abilityName}`;
            if (!wrongGuesses.includes(guessLabel)) {
                setWrongGuesses([...wrongGuesses, guessLabel]);
            }
            const newLives = lives - 1;
            setLives(newLives);
            if (newLives <= 0) {
                setGameStatus('lost');
            }
        }
    };

    const restartGame = () => {
        setCurrentSound(HEARDLE_DATA[Math.floor(Math.random() * HEARDLE_DATA.length)]);
        setLives(3);
        setWrongGuesses([]);
        setGameStatus('playing');
        setSearchQuery('');
    };

    const filteredAgents = OFFICIAL_AGENTS.filter(agent => 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.abilities.some(ab => ab.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="game-container heardle-container" style={{maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '2rem'}}>
            <style>{`
                @keyframes wave-animation {
                    0%, 100% { height: 15px; }
                    50% { height: 45px; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .wave-bar {
                    width: 3px;
                    background-color: rgba(255,255,255,0.3);
                    border-radius: 2px;
                    transition: background-color 0.3s ease;
                }
                .wave-bar.playing {
                    background-color: #fff;
                    animation: wave-animation 1s ease-in-out infinite;
                }
                .agents-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 2rem;
                    margin-top: 3rem;
                }
                .ability-icon {
                    width: 32px;
                    height: 32px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 4px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .ability-icon:hover {
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                    transform: translateY(-2px);
                }
                .agent-img-cont {
                    position: relative;
                    width: 140px;
                    height: 50px;
                    overflow: hidden;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
                }
                .agent-bg-text {
                    position: absolute;
                    width: 120%;
                    top: -10px;
                    opacity: 0.15;
                    filter: grayscale(100%);
                }
                .agent-face {
                    position: absolute;
                    height: 140%;
                    top: -10px;
                    z-index: 1;
                }
            `}</style>

            <button className="back-btn" onClick={onBack} style={{ position: 'absolute', right: '2rem', top: '2rem' }}>
                <BackArrow /> Geri Dön
            </button>

            <div style={{textAlign: 'center', marginBottom: '3rem'}}>
                <h1 style={{fontFamily: "'Teko', sans-serif", fontSize: '4rem', marginBottom: '1rem', letterSpacing: '1px'}}>What's The Ability?</h1>
                <p style={{color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6'}}>
                    Each agent in the game has 4 unique abilities that produce distinct sounds. You have 3 attempts to find the ability that matches the sound.
                </p>
                
                <div style={{marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}>
                    <span style={{color: '#fff', fontWeight: 'bold'}}>Difficulty:</span>
                    <select style={{background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '4px', outline: 'none'}}>
                        <option>Normal</option>
                        <option>Hard</option>
                    </select>
                </div>
            </div>

            <div style={{background: 'rgba(17,17,17,0.5)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '3rem'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '60px', margin: '0 auto 2rem'}}>
                    {Array.from({length: 40}).map((_, i) => (
                        <div key={i} className={`wave-bar ${isPlaying ? 'playing' : ''}`} style={{animationDelay: `${Math.random() * 0.5}s`}}></div>
                    ))}
                </div>

                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem'}}>
                    <span style={{color: 'var(--text-secondary)', fontFamily: "'Teko', sans-serif", fontSize: '1.5rem'}}>0.0s</span>
                    
                    <button onClick={playAudio} style={{width: '50px', height: '50px', borderRadius: '8px', background: 'var(--text-secondary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d={isPlaying ? "M6 19h4V5H6v14zm8-14v14h4V5h-4z" : "M8 5v14l11-7z"}/></svg>
                    </button>
                    
                    <button onClick={replayAudio} style={{width: '50px', height: '50px', borderRadius: '8px', background: 'var(--text-secondary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    </button>
                    
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem'}}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} style={{width: '100px'}} />
                    </div>
                </div>

                {wrongGuesses.length > 0 && (
                    <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap'}}>
                        {wrongGuesses.map(guess => (
                            <div key={guess} style={{
                                background: '#e8e6df', 
                                color: '#a13333', 
                                padding: '0.4rem 1rem', 
                                borderRadius: '6px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                fontWeight: 'bold',
                                fontSize: '0.95rem'
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                                  <path d="m12 13-1-3 2-2-2-3"></path>
                                </svg>
                                {guess}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {gameStatus !== 'playing' && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    backdropFilter: 'blur(5px)',
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(30,30,30,0.9), rgba(15,15,15,0.95))',
                        padding: '4rem',
                        borderRadius: '16px',
                        border: `2px solid ${gameStatus === 'won' ? '#2ecc71' : '#e74c3c'}`,
                        boxShadow: `0 0 40px ${gameStatus === 'won' ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
                        textAlign: 'center',
                        transform: 'scale(1)',
                        animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <h2 style={{
                            fontFamily: "'Teko', sans-serif", 
                            fontSize: '6rem', 
                            color: gameStatus === 'won' ? '#2ecc71' : '#e74c3c', 
                            margin: 0,
                            textTransform: 'uppercase',
                            textShadow: '0 4px 15px rgba(0,0,0,0.5)'
                        }}>
                            {gameStatus === 'won' ? 'Doğru Bİldİn!' : 'Oyun Bİttİ'}
                        </h2>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            margin: '2rem 0'
                        }}>
                            <span style={{color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem', marginBottom: '0.5rem'}}>Cevap Şuydu:</span>
                            <strong style={{color: '#fff', fontSize: '2.5rem', fontFamily: "'Teko', sans-serif", letterSpacing: '2px'}}>
                                {currentSound.title}
                            </strong>
                        </div>
                        
                        <button onClick={restartGame} style={{
                            background: gameStatus === 'won' ? '#2ecc71' : '#e74c3c',
                            color: '#fff',
                            border: 'none',
                            padding: '1rem 3rem',
                            fontSize: '1.5rem',
                            fontFamily: "'Teko', sans-serif",
                            borderRadius: '8px',
                            cursor: 'pointer',
                            letterSpacing: '1px',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            TEKRAR OYNA
                        </button>
                    </div>
                </div>
            )}

            <div style={{display: 'flex', justifyContent: 'center', position: 'sticky', top: '20px', zIndex: 10}}>
                <div style={{display: 'flex', alignItems: 'center', background: 'rgba(20,20,20,0.9)', padding: '0.5rem 1.5rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '1rem'}}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." style={{flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '1.1rem'}} />
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 'bold'}}>
                        {lives} <span style={{color: 'var(--valorant-red)'}}>❤️</span>
                    </div>
                </div>
            </div>

            <div className="agents-grid">
                {filteredAgents.map(agent => (
                    <div key={agent.name} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem'}}>
                        <div className="agent-img-cont">
                            <img src={agent.background} className="agent-bg-text" alt="bg" />
                            <img src={agent.image.replace('fullportrait.png', 'displayicon.png')} className="agent-face" alt={agent.name} onError={(e) => e.target.src = agent.image} />
                        </div>
                        <span style={{fontSize: '1rem', color: '#fff', fontWeight: 'bold'}}>{agent.name}</span>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                            {agent.abilities.map(ab => (
                                <button key={ab.name} className="ability-icon" onClick={() => handleGuess(agent.name, ab.name)} title={ab.name}>
                                    <img src={ab.icon} alt={ab.name} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <audio ref={audioRef} style={{display: 'none'}} />
        </div>
    );
}
function VufufuModule() {
    const [selectedGame, setSelectedGame] = useState(null);

    if (selectedGame === 'higherlower') {
        return <ValorantGame onBack={() => setSelectedGame(null)} />;
    }
    if (selectedGame === 'heardle') {
        return <ValorantHeardle onBack={() => setSelectedGame(null)} />;
    }

    return (
        <div className="vufufu-menu game-container" style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
            <div style={{textAlign: 'center', background: 'rgba(17,17,17,0.7)', padding: '5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)'}}>
                <h2 style={{fontSize: '5rem', color: 'var(--valorant-red)', fontFamily: "'Teko', sans-serif", marginBottom: '1rem', letterSpacing: '3px'}}>VUFUFU EĞLENCE</h2>
                <p style={{fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '4rem'}}>Valorant yeteneklerini test etmek için bir oyun seç!</p>
                
                <div className="game-cards-container" style={{display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap'}}>
                    <div className="category-btn active" onClick={() => setSelectedGame('higherlower')} style={{padding: '2rem', width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <span style={{fontSize: '3rem'}}>💰</span>
                        <h3 style={{fontFamily: "'Teko', sans-serif", fontSize: '2rem', margin: 0}}>HANGİSİ DAHA PAHALI?</h3>
                        <p style={{fontSize: '1rem', margin: 0, opacity: 0.8, whiteSpace: 'normal', textTransform: 'none'}}>Yetenek fiyatlarını karşılaştırarak en uzun seriyi yapmaya çalış.</p>
                    </div>
                    
                    <div className="category-btn" onClick={() => setSelectedGame('heardle')} style={{padding: '2rem', width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.05)', color: '#fff'}}>
                        <span style={{fontSize: '3rem'}}>🎵</span>
                        <h3 style={{fontFamily: "'Teko', sans-serif", fontSize: '2rem', margin: 0}}>HEARDLE</h3>
                        <p style={{fontSize: '1rem', margin: 0, opacity: 0.8, whiteSpace: 'normal', textTransform: 'none'}}>Sadece sese odaklan. Kimin veya neyin sesi olduğunu tahmin et.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ValorantModule;
