import React, { useState, useMemo } from 'react';

// Maps definitions
export const MAP_DEFINITIONS = [
  {
    id: 'sr',
    name: "Sihirdar Vadisi",
    subName: "Summoner's Rift",
    mode: '5v5 Standart & Dereceli',
    icon: '🌲',
    bgUrl: 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/map/map11.png',
    accentColor: '#0ea5e9',
    description: "League of Legends'ın ana rekabetçi 5v5 haritası. 3 koridor, tarafsız orman, epik canavarlar (Baron, Ejderhalar, Hiçlik Kurtçukları) ve stratejik görüş savaşları içerir."
  },
  {
    id: 'aram',
    name: 'Sonsuz Uçurum',
    subName: 'Howling Abyss (ARAM)',
    mode: '5v5 Tek Koridor Rastgele Şampiyon',
    icon: '❄️',
    bgUrl: 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/map/map12.png',
    accentColor: '#38bdf8',
    description: "Hiçlik'in kıyısında dondurucu bir uçurum. Orman yok, tek koridor, 4 can yadigarı ve üslerden kulelere hızlı intikal sağlayan Hexkapıları bulunur."
  },
  {
    id: 'nb',
    name: 'Merkez Baskını',
    subName: 'Nexus Blitz',
    mode: '5v5 Hızlı Kaos & Etkinlik Modu',
    icon: '⚡',
    bgUrl: 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/map/map21.png',
    accentColor: '#f59e0b',
    description: "Kompakt çift koridorlu, paylaşımlı orman kamplı ve her birkaç dakikada bir tetiklenen rastgele çılgın mini oyunlara (Ateş Çemberi, Bard gibi) sahip hızlı mod haritası."
  },
  {
    id: 'arena',
    name: 'Ruhlar Halkası',
    subName: 'Arena (2v2v2v2)',
    mode: '4 Takımlı Gladyatör Arenası',
    icon: '⚔️',
    bgUrl: 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/map/map30.png',
    accentColor: '#ec4899',
    description: "İkişer kişilik 4 takımın eklentiler (Augments) ve özel çiçekler eşliğinde hayatta kalma mücadelesi verdiği dinamik halka arenası."
  }
];

// Summoner's Rift detailed tactical data (True Minimap Coordinate System)
export const SR_ELEMENTS = [
  // --- EPICS ---
  {
    id: 'sr_baron',
    name: 'Baron Nashor',
    type: 'epic',
    x: 30.5,
    y: 31.0,
    icon: '👑',
    iconImg: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/baron-100.png',
    tag: 'Epik Canavar',
    color: '#a855f7',
    respawn: 'İlk Doğuş: 20:00 • Yeniden Doğuş: 6:00 dk',
    rewards: '300 Altın (Takım Başına) + 1400 XP + Baron Güçlendirmesi',
    buff: 'Baron Elçisi: Yakındaki tüm minyonları aşırı güçlendirir, menzillerini artırır ve kuleleri saniyeler içinde eritmeyi sağlar. Şampiyonlara bonus SG ve YG verir.',
    tactics: 'Baron almadan önce rakip ormandaki görüşü temizleyin ve arkadan gelecek engelleri pembe totem ile engelleyin. Rakip ormancı ölü olduğunda veya alt koridorda yalnız yakalandığında başlamak en güvenlisidir.'
  },
  {
    id: 'sr_herald',
    name: "Vadi'nin Alameti (Rift Herald)",
    type: 'epic',
    x: 27.0,
    y: 33.5,
    icon: '👾',
    iconImg: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/herald-100.png',
    tag: 'Epik Canavar',
    color: '#8b5cf6',
    respawn: 'İlk Doğuş: 14:00 • Tek Seferlik (19:45 kaybolur)',
    rewards: '100 Altın + 300 XP + Alamet Gözü',
    buff: "Alamet Çağrısı & Sürüş: Alamet çağrıldığında bir oyuncu içine binip kontrol edebilir ve kulelere devasa gerçek hasar veren koçbaşı saldırısı yapabilir.",
    tactics: "Arkasına geçip zayıf noktası olan mor göze vurduğunuzda azami canının %12'si kadar ek hasar alır. Erken kule barikatlarını veya kritik orta koridor kulesini açmak için kullanın."
  },
  {
    id: 'sr_voidgrubs',
    name: 'Hiçlik Kurtçukları (Voidgrubs)',
    type: 'epic',
    x: 34.0,
    y: 27.5,
    icon: '🟣',
    tag: 'Erken Epik',
    color: '#c084fc',
    respawn: 'İlk Doğuş: 5:00 • Yeniden Doğuş: 4:00 (13:45 kaybolur)',
    rewards: '20 Altın / kurtçuk + XP + Hiçliğin Açlığı Yükü',
    buff: 'Hiçliğin Dokunuşu: Kulelere ve yapılara zamanla gerçek hasar yakması uygular. 5-6 yük toplandığında kule vururken yardımcı küçük hiçlik akıncıları çağrılır.',
    tactics: 'Ormancı ve üst/orta koridor önceliği varken ilk 5 dakikada hızlıca 3 kurtçuğu almak, split push ve kule eritme hızını inanılmaz artırır.'
  },
  {
    id: 'sr_dragon',
    name: 'Ejder Çukuru (Element & Kadim Ejderhalar)',
    type: 'epic',
    x: 70.0,
    y: 69.5,
    icon: '🐉',
    iconImg: 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default/dragon-100.png',
    tag: 'Epik Canavar',
    color: '#f97316',
    respawn: 'İlk Doğuş: 5:00 • Yeniden Doğuş: 5:00 • Kadim: 6:00 dk',
    rewards: '25 Altın + Takım Ejder Güçlendirmesi + Ejder Ruhu',
    buff: 'Alev (SG/YG artışı), Okyanus (Can/Mana yenilenmesi), Dağ (Zırh/Büyü Direnci), Bulut (Yetenek Hızı & Koşu), Hextech (Yetenek/Saldırı Hızı + Kapılar), Kimya (Düşük can direnci) ve Kadim (%20 altı infaz & yakma).',
    tactics: 'Ejder doğmadan 1 dakika önce alt nehirdeki çalılara totem yerleştirip nehir yampirisini alarak alan hakimiyetini sağlayın.'
  },

  // --- JUNGLE CAMPS: BLUE TEAM ---
  {
    id: 'sr_blue_gromp',
    name: 'Gromp (Mavi Takım Kurbağa)',
    type: 'jungle',
    side: 'blue',
    x: 19.5,
    y: 60.5,
    icon: '🐸',
    tag: 'Orman Kampı',
    color: '#22c55e',
    respawn: 'İlk Doğuş: 1:42 • Yeniden Doğuş: 2:15 dk',
    rewards: '80 Altın + 125-180 XP',
    buff: 'Büyük Şifa: Kesildiğinde ormancıya anında büyük miktarda can ve mana iade eder.',
    tactics: 'İlk vuruşlarında yüksek saldırı hızıyla büyü hasarı vurur, ardından yavaşlar. Mavi güçlendirmenin hemen ardından kesilerek tam can toparlanması sağlanır.'
  },
  {
    id: 'sr_blue_buff',
    name: 'Mavi Muhafız (Mavi Takım Blue Buff)',
    type: 'jungle',
    side: 'blue',
    x: 35.5,
    y: 64.5,
    icon: '🔷',
    tag: 'Büyük Güçlendirme',
    color: '#0284c7',
    respawn: 'İlk Doğuş: 1:30 • Yeniden Doğuş: 5:00 dk',
    rewards: '90 Altın + 115-180 XP + Sorguç Simgesi',
    buff: 'Mavi Güçlendirme: 2 dakikalığına +10 Yetenek Hızı ve çok yüksek saniyelik mana/enerji yenilenmesi kazandırır. 20. dakikadan sonra kesildiğinde tüm takıma yayılır.',
    tactics: 'Mana bağımlısı orta koridor şampiyonları (Anivia, Orianna, Hwei) ve ormancı için hayati öneme sahiptir. Karşı ormancı baskınlarına karşı çalısına totem atılmalıdır.'
  },
  {
    id: 'sr_blue_wolves',
    name: 'Alacakaranlık Kurtları (Mavi Takım)',
    type: 'jungle',
    side: 'blue',
    x: 37.0,
    y: 53.0,
    icon: '🐺',
    tag: 'Orman Kampı',
    color: '#6366f1',
    respawn: 'İlk Doğuş: 1:30 • Yeniden Doğuş: 2:15 dk',
    rewards: '85 Altın (1 Büyük + 2 Küçük) + 110-170 XP',
    buff: 'Standart kamp temizliği ve orman yoldaşı besini.',
    tactics: 'Büyük kurt önce odaklanmalı veya alan vuran yeteneklerle küçük kurtlar hızlıca temizlenmelidir.'
  },
  {
    id: 'sr_blue_raptors',
    name: 'Alazkuşlar (Mavi Takım Kuşlar)',
    type: 'jungle',
    side: 'blue',
    x: 44.0,
    y: 73.0,
    icon: '🐦',
    tag: 'Orman Kampı',
    color: '#ef4444',
    respawn: 'İlk Doğuş: 1:30 • Yeniden Doğuş: 2:15 dk',
    rewards: '70 Altın (1 Büyük + 5 Küçük) + 95-155 XP',
    buff: 'Ormancı petine hızlı can çekme ve yüksek alan temizleme ödülü.',
    tactics: 'Kayn, Hecarim, Lillia gibi alan hasarı yeteneği olan şampiyonlar bu kampı 3-4 saniyede temizleyip tam cana ulaşabilir.'
  },
  {
    id: 'sr_blue_red',
    name: 'Kırmızı Korkunçboynuz (Mavi Takım Red Buff)',
    type: 'jungle',
    side: 'blue',
    x: 50.0,
    y: 74.0,
    icon: '🔴',
    tag: 'Büyük Güçlendirme',
    color: '#dc2626',
    respawn: 'İlk Doğuş: 1:30 • Yeniden Doğuş: 5:00 dk',
    rewards: '90 Altın + 115-180 XP + Kül Simgesi',
    buff: 'Kırmızı Güçlendirme: Düz vuruşlara seviyeye bağlı gerçek hasar yakması ve yavaşlatma ekler; çatışma dışındayken yüksek can yenilenmesi sağlar.',
    tactics: 'Erken gank atan ormancılar (Lee Sin, Jarvan, Xin Zhao) kırmızı buff ile başlar başlamaz yavaşlatma etkisini koridor baskınında kullanır.'
  },
  {
    id: 'sr_blue_krugs',
    name: 'Kayacıllar (Mavi Takım Krugs)',
    type: 'jungle',
    side: 'blue',
    x: 49.5,
    y: 86.5,
    icon: '🪨',
    tag: 'Orman Kampı',
    color: '#d97706',
    respawn: 'İlk Doğuş: 1:42 • Yeniden Doğuş: 2:15 dk',
    rewards: '110+ Altın (Parçalanarak çoğalır) + 135-210 XP',
    buff: 'Vadideki en çok altın ve deneyim veren orman kampı.',
    tactics: 'Büyük Kayacıl kesildiğinde 2 orta kayacıla, onlar da 4 küçük parçaya ayrılır. Tam altın için tüm parçalar toplanmalıdır.'
  },

  // --- JUNGLE CAMPS: RED TEAM ---
  {
    id: 'sr_red_gromp',
    name: 'Gromp (Kırmızı Takım Kurbağa)',
    type: 'jungle',
    side: 'red',
    x: 80.5,
    y: 39.5,
    icon: '🐸',
    tag: 'Orman Kampı',
    color: '#22c55e',
    respawn: 'İlk Doğuş: 1:42 • Yeniden Doğuş: 2:15 dk',
    rewards: '80 Altın + 125-180 XP',
    buff: 'Büyük Şifa: Kesildiğinde anında can ve mana yeniler.',
    tactics: 'Üst koridorda kule altı baskını yapmadan önce veya can tazelemek için kritik bir hedeftir.'
  },
  {
    id: 'sr_red_blue',
    name: 'Mavi Muhafız (Kırmızı Takım Blue Buff)',
    type: 'jungle',
    side: 'red',
    x: 64.5,
    y: 35.5,
    icon: '🔷',
    tag: 'Büyük Güçlendirme',
    color: '#0284c7',
    respawn: 'İlk Doğuş: 1:30 • Yeniden Doğuş: 5:00 dk',
    rewards: '90 Altın + 115-180 XP',
    buff: '+10 Yetenek Hızı ve yüksek mana yenilenmesi.',
    tactics: 'Mavi çalısı Baron çukurunun hemen yukarısındadır. Karşı takımın gizlice çalmasını engellemek için nehir arkası aydınlatılmalıdır.'
  },
  {
    id: 'sr_red_wolves',
    name: 'Alacakaranlık Kurtları (Kırmızı Takım)',
    type: 'jungle',
    side: 'red',
    x: 63.0,
    y: 47.0,
    icon: '🐺',
    tag: 'Orman Kampı',
    color: '#6366f1',
    respawn: 'İlk Doğuş: 1:30 • Yeniden Doğuş: 2:15 dk',
    rewards: '85 Altın + 110-170 XP',
    buff: 'Standart orman kampı temizliği.',
    tactics: 'Orta koridor arkasına geçiş koridorundadır. İstilalarda ilk kontrol edilen kamplardan biridir.'
  },
  {
    id: 'sr_red_raptors',
    name: 'Alazkuşlar (Kırmızı Takım Kuşlar)',
    type: 'jungle',
    side: 'red',
    x: 56.0,
    y: 27.0,
    icon: '🐦',
    tag: 'Orman Kampı',
    color: '#ef4444',
    respawn: 'İlk Doğuş: 1:30 • Yeniden Doğuş: 2:15 dk',
    rewards: '70 Altın + 95-155 XP',
    buff: 'Ormancı petine hızlı can çekme.',
    tactics: 'Orta koridorun hemen üstündedir; orta koridor şampiyonları ittirdikten sonra bu kampa minyon/altın takviyesi için yönelebilir.'
  },
  {
    id: 'sr_red_red',
    name: 'Kırmızı Korkunçboynuz (Kırmızı Takım Red Buff)',
    type: 'jungle',
    side: 'red',
    x: 50.0,
    y: 26.0,
    icon: '🔴',
    tag: 'Büyük Güçlendirme',
    color: '#dc2626',
    respawn: 'İlk Doğuş: 1:30 • Yeniden Doğuş: 5:00 dk',
    rewards: '90 Altın + 115-180 XP',
    buff: 'Düz vuruşlarda gerçek hasar yakması, yavaşlatma ve can yenilenmesi.',
    tactics: 'Üst koridora yakın olduğu için 1. seviye istilalarında (invade) en çok hedeflenen kamptır.'
  },
  {
    id: 'sr_red_krugs',
    name: 'Kayacıllar (Kırmızı Takım Krugs)',
    type: 'jungle',
    side: 'red',
    x: 50.5,
    y: 13.5,
    icon: '🪨',
    tag: 'Orman Kampı',
    color: '#d97706',
    respawn: 'İlk Doğuş: 1:42 • Yeniden Doğuş: 2:15 dk',
    rewards: '110+ Altın + 135-210 XP',
    buff: 'En yüksek altın ve deneyim kampı.',
    tactics: 'Haritanın en üst kenarındadır. Üst koridor baskınından sonra tam seviye atlamak için kesilir.'
  },

  // --- RIVER SCUTTLE CRABS ---
  {
    id: 'sr_top_scuttle',
    name: 'Yampiri Yengeç (Üst Nehir)',
    type: 'jungle',
    x: 38.0,
    y: 41.0,
    icon: '🦀',
    tag: 'Nehir Görüşü',
    color: '#06b6d4',
    respawn: 'İlk Doğuş: 3:30 • Yeniden Doğuş: 2:30 dk',
    rewards: '55-125 Altın + Hızlandırma Alanı & 90 sn Nehir Görüş Tapınağı',
    buff: 'Hızlandırma Tapınağı: Kesildiği nehir bölgesinde 90 saniye boyunca yok edilemez görüş tapınağı oluşturur ve takım arkadaşlarına hızlandırma sağlar.',
    tactics: 'Kitle kontrolü (sersemletme, havaya savurma, kışkırtma) uygulandığında kalkanı anında kırılır ve %25 daha fazla hasar alır.'
  },
  {
    id: 'sr_bot_scuttle',
    name: 'Yampiri Yengeç (Alt Nehir)',
    type: 'jungle',
    x: 62.0,
    y: 59.0,
    icon: '🦀',
    tag: 'Nehir Görüşü',
    color: '#06b6d4',
    respawn: 'İlk Doğuş: 3:30 • Yeniden Doğuş: 2:30 dk',
    rewards: '55-125 Altın + Hızlandırma Alanı & 90 sn Ejder Önü Görüşü',
    buff: 'Ejder Önü Hakimiyeti: Ejder kapısına giden yolu aydınlatır.',
    tactics: '3:30 dakikasında alt koridorun itilmiş olması bu yengecin güvenle alınmasını garanti eder.'
  },

  // --- RECOMMENDED WARDS (TOTEMLER) ---
  {
    id: 'sr_ward_dragon',
    name: 'Ejder Önü Nehir Çalısı (Pixel Bush)',
    type: 'ward',
    wardType: 'control',
    x: 58.0,
    y: 55.0,
    icon: '👁️',
    iconImg: 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/2055.png',
    tag: 'Kritik Kontrol Totemi',
    color: '#ec4899',
    purpose: 'Ejderha Önü Hakimiyeti & Orta Koridor Savunması',
    tactics: 'Bu çalıya yerleştirilen Kontrol Totemi (Pembe Totem), orta koridor ve alt koridordan gelen rakip rotalarını ve ejderha teşebbüslerini dakikalarca önceden bildirir.'
  },
  {
    id: 'sr_ward_baron',
    name: 'Baron Önü Nehir Çalısı (Baron Pixel)',
    type: 'ward',
    wardType: 'control',
    x: 42.0,
    y: 45.0,
    icon: '👁️',
    iconImg: 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/2055.png',
    tag: 'Kritik Kontrol Totemi',
    color: '#ec4899',
    purpose: 'Baron & Alamet Hazırlığı',
    tactics: 'Baron ve Hiçlik Kurtçukları çukuruna giriş yapan ormancıların tamamını görünür kılar. Nehir boyunca kurulan pusuları boşa çıkarır.'
  },
  {
    id: 'sr_ward_bot_tri',
    name: 'Alt Koridor Üçlü Çalı (Bot Tri-Bush)',
    type: 'ward',
    wardType: 'stealth',
    x: 81.0,
    y: 80.0,
    icon: '🟡',
    iconImg: 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3340.png',
    tag: 'Erken Gank Uyarısı',
    color: '#eab308',
    purpose: 'Bot Lane Arkadan Baskın (Dive) Koruması',
    tactics: 'Mavi takım için kule altı baskınlarını (dive) engeller; kırmızı takım içinse rakibin koridora sızmasını erkenden haber verir.'
  },
  {
    id: 'sr_ward_top_tri',
    name: 'Üst Koridor Üçlü Çalı (Top Tri-Bush)',
    type: 'ward',
    wardType: 'stealth',
    x: 19.0,
    y: 20.0,
    icon: '🟡',
    iconImg: 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3340.png',
    tag: 'Üst Koridor Koruması',
    color: '#eab308',
    purpose: 'Top Lane Gank Engelleme',
    tactics: 'Üst koridorda 3:15 civarında atılan bir totem, rakip ormancının ilk temizlik sonrası yapacağı ani ganki tamamen etkisiz hale getirir.'
  },
  {
    id: 'sr_ward_red_deep',
    name: 'Kırmızı Takım Kuşlar Arkası Derin Totem',
    type: 'ward',
    wardType: 'farsight',
    x: 53.5,
    y: 31.5,
    icon: '🔵',
    iconImg: 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3363.png',
    tag: 'Derin Orman İstilası',
    color: '#38bdf8',
    purpose: 'Ormancı Rota Takibi (Camp Tracking)',
    tactics: 'Rakip ormancının kuşları kesip kesmediğini gösterir. Hangi koridora baskın planladığını haritada daha görünmeden tahmin etmenizi sağlar.'
  },
  {
    id: 'sr_ward_blue_deep',
    name: 'Mavi Takım Kuşlar Arkası Derin Totem',
    type: 'ward',
    wardType: 'farsight',
    x: 46.5,
    y: 68.5,
    icon: '🔵',
    iconImg: 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3363.png',
    tag: 'Derin Orman İstilası',
    color: '#38bdf8',
    purpose: 'Ormancı Rota Takibi',
    tactics: 'Özellikle orta koridor ittirildikten sonra hızlıca içeri sızıp bu noktaya totem atmak takımınıza devasa harita üstünlüğü kazandırır.'
  },
  {
    id: 'sr_ward_bot_river',
    name: 'Alt Nehir Giriş Çalısı (Bot River Entrance)',
    type: 'ward',
    wardType: 'stealth',
    x: 69.0,
    y: 73.0,
    icon: '🟡',
    iconImg: 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3340.png',
    tag: 'Nehir Görüşü',
    color: '#eab308',
    purpose: 'Orta Koridor Dolaşımı (Roam) Tespiti',
    tactics: 'Orta koridor büyücülerinin veya ormancının alt koridora pusu atmasını önceden yakalar.'
  },
  {
    id: 'sr_ward_top_river',
    name: 'Üst Nehir Giriş Çalısı (Top River Entrance)',
    type: 'ward',
    wardType: 'stealth',
    x: 31.0,
    y: 27.0,
    icon: '🟡',
    iconImg: 'https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/3340.png',
    tag: 'Nehir Görüşü',
    color: '#eab308',
    purpose: 'Kurtçuklar & Üst Koridor Güvenliği',
    tactics: 'Hiçlik kurtçukları dövüşlerinde arkanızdan gelebilecek orta koridor oyuncusunu önceden haber verir.'
  }
];

// Summoner's Rift visual terrain bushes (pure decorative background overlay, non-clickable)
export const SR_BUSHES = [
  // --- RIVER PIXEL BUSHES (Small standalone round bushes in river) ---
  { id: 'b_baron_pixel', cx: 42.0, cy: 45.0, rx: 2.2, ry: 1.6, rot: -30, label: 'Baron Pixel Çalısı' },
  { id: 'b_dragon_pixel', cx: 58.0, cy: 55.0, rx: 2.2, ry: 1.6, rot: -30, label: 'Ejder Pixel Çalısı' },

  // --- RIVER ENTRANCE BUSHES (Curved river edge bushes) ---
  { id: 'b_top_river_ent', cx: 31.0, cy: 27.0, rx: 3.0, ry: 1.5, rot: -45, label: 'Üst Nehir Giriş Çalısı' },
  { id: 'b_bot_river_ent', cx: 69.0, cy: 73.0, rx: 3.0, ry: 1.5, rot: -45, label: 'Alt Nehir Giriş Çalısı' },

  // --- TRI-BUSHES (Üçlü Çalılar) ---
  { id: 'b_top_tri', cx: 19.0, cy: 20.0, rx: 2.6, ry: 1.8, rot: 40, label: 'Üst Koridor Üçlü Çalı' },
  { id: 'b_bot_tri', cx: 81.0, cy: 80.0, rx: 2.6, ry: 1.8, rot: 40, label: 'Alt Koridor Üçlü Çalı' },
  { id: 'b_top_ramp', cx: 28.0, cy: 38.0, rx: 2.5, ry: 1.5, rot: -30, label: 'Üst Nehir Rampa Çalısı' },
  { id: 'b_bot_ramp', cx: 72.0, cy: 62.0, rx: 2.5, ry: 1.5, rot: -30, label: 'Alt Nehir Rampa Çalısı' },

  // --- MID LANE RIVER EDGE BUSHES ---
  { id: 'b_mid_top', cx: 42.0, cy: 49.0, rx: 2.4, ry: 1.4, rot: 45, label: 'Orta Sol Nehir Çalısı' },
  { id: 'b_mid_bot', cx: 58.0, cy: 51.0, rx: 2.4, ry: 1.4, rot: 45, label: 'Orta Sağ Nehir Çalısı' },

  // --- TOP LANE OUTER BUSHES (3 Lane Bushes) ---
  { id: 'b_top_lane_1', cx: 14.0, cy: 41.0, rx: 3.0, ry: 1.3, rot: 90, label: 'Üst Koridor 1. Çalı' },
  { id: 'b_top_lane_2', cx: 14.0, cy: 27.0, rx: 3.0, ry: 1.3, rot: 90, label: 'Üst Koridor 2. Çalı' },
  { id: 'b_top_lane_3', cx: 27.0, cy: 14.0, rx: 3.0, ry: 1.3, rot: 0, label: 'Üst Koridor 3. Çalı' },

  // --- BOT LANE OUTER BUSHES (3 Lane Bushes) ---
  { id: 'b_bot_lane_1', cx: 86.0, cy: 59.0, rx: 3.0, ry: 1.3, rot: 90, label: 'Alt Koridor 1. Çalı' },
  { id: 'b_bot_lane_2', cx: 86.0, cy: 73.0, rx: 3.0, ry: 1.3, rot: 90, label: 'Alt Koridor 2. Çalı' },
  { id: 'b_bot_lane_3', cx: 73.0, cy: 86.0, rx: 3.0, ry: 1.3, rot: 0, label: 'Alt Koridor 3. Çalı' },

  // --- JUNGLE BUFF BUSHES (Mavi ve Kırmızı Orman Çalıları) ---
  { id: 'b_blue_bluebuff', cx: 34.5, cy: 61.5, rx: 2.4, ry: 1.4, rot: 25, label: 'Mavi Takım Blue Buff Çalısı' },
  { id: 'b_red_bluebuff', cx: 65.5, cy: 38.5, rx: 2.4, ry: 1.4, rot: 25, label: 'Kırmızı Takım Blue Buff Çalısı' },
  { id: 'b_blue_redbuff', cx: 50.0, cy: 70.5, rx: 2.5, ry: 1.4, rot: 0, label: 'Mavi Takım Red Buff Çalısı' },
  { id: 'b_red_redbuff', cx: 50.0, cy: 29.5, rx: 2.5, ry: 1.4, rot: 0, label: 'Kırmızı Takım Red Buff Çalısı' },

  // --- DEEP RAPTOR BUSHES (Kuşlar Arkası Derin Çalılar) ---
  { id: 'b_blue_deep', cx: 46.5, cy: 68.5, rx: 2.5, ry: 1.5, rot: -35, label: 'Mavi Kuşlar Arkası Çalı' },
  { id: 'b_red_deep', cx: 53.5, cy: 31.5, rx: 2.5, ry: 1.5, rot: -35, label: 'Kırmızı Kuşlar Arkası Çalı' },

  // --- GROMP BUSHES ---
  { id: 'b_blue_gromp', cx: 22.0, cy: 64.0, rx: 2.3, ry: 1.4, rot: 40, label: 'Mavi Gromp Çalısı' },
  { id: 'b_red_gromp', cx: 78.0, cy: 36.0, rx: 2.3, ry: 1.4, rot: 40, label: 'Kırmızı Gromp Çalısı' }
];

// Minion wave paths on Summoner's Rift
export const SR_MINION_LANES = [
  {
    id: 'top',
    name: 'Üst Koridor (Top Lane)',
    color: '#3b82f6',
    dash: '6, 6',
    clashX: 23.0,
    clashY: 23.0,
    firstSpawn: '1:05',
    clashTime: '1:38 (~33 saniye varış)',
    waveInterval: 'Her 30 saniyede bir yeni dalga',
    details: 'Mavi üsten çıkarak sol duvar boyunca ilerler, kule barikatları erken oyunda üst koridor oyuncularına devasa ekonomi sağlar.'
  },
  {
    id: 'mid',
    name: 'Orta Koridor (Mid Lane)',
    color: '#f59e0b',
    dash: '6, 6',
    clashX: 50.0,
    clashY: 50.0,
    firstSpawn: '1:05',
    clashTime: '1:27 (~22 saniye varış - En Hızlı)',
    waveInterval: 'Her 30 saniyede bir yeni dalga',
    details: 'En kısa koridordur. Minyonlar çok daha hızlı çarpışır. Orta koridoru erkenden ittiren şampiyon haritada ilk dolaşım (roam) önceliğini kazanır.'
  },
  {
    id: 'bot',
    name: 'Alt Koridor (Bot Lane)',
    color: '#10b981',
    dash: '6, 6',
    clashX: 77.0,
    clashY: 77.0,
    firstSpawn: '1:05',
    clashTime: '1:38 (~33 saniye varış)',
    waveInterval: 'Her 30 saniyede bir yeni dalga',
    details: 'Mavi üsten çıkarak alt kenar boyunca ilerler. 2v2 koridor baskısı ve Ejder çukuru kontrolü için minyon dalga yönetimi (freeze/slow push) hayati önem taşır.'
  }
];

// Howling Abyss (ARAM) Elements
export const ARAM_ELEMENTS = [
  {
    id: 'aram_relic_b1',
    name: 'Can Yadigarı (Mavi Taraf 1)',
    type: 'relic',
    x: 34.0,
    y: 66.0,
    icon: '💚',
    tag: 'Can Paketi',
    color: '#22c55e',
    respawn: 'İlk Doğuş: 3:15 • Yeniden Doğuş: 90 sn',
    rewards: 'Yarıçap içindeki tüm dostlara %8 Can & %8 Mana + Genişleyen şifa patlaması',
    tactics: 'Alındıktan 2.5 saniye sonra alan patlaması yaparak etrafındaki herkesi iyileştirir. Rakip takımın üstüne atılan kar topu (snowball) ile paket anında çalınabilir.'
  },
  {
    id: 'aram_relic_b2',
    name: 'Can Yadigarı (Mavi Taraf 2)',
    type: 'relic',
    x: 43.0,
    y: 57.0,
    icon: '💚',
    tag: 'Can Paketi',
    color: '#22c55e',
    respawn: 'İlk Doğuş: 3:15 • Yeniden Doğuş: 90 sn',
    rewards: 'Genişleyen alan şifası ve mana iadesi',
    tactics: 'Köprünün orta sol kısmındadır. Çatışma ortasında geri çekilip takımca toplanmak için anahtar noktadır.'
  },
  {
    id: 'aram_relic_r1',
    name: 'Can Yadigarı (Kırmızı Taraf 1)',
    type: 'relic',
    x: 57.0,
    y: 43.0,
    icon: '💚',
    tag: 'Can Paketi',
    color: '#22c55e',
    respawn: 'İlk Doğuş: 3:15 • Yeniden Doğuş: 90 sn',
    rewards: 'Genişleyen alan şifası ve mana iadesi',
    tactics: 'Kırmızı tarafın dış kulesi ayaktayken güvenle toplanır. Kule düştüğünde rakip takımın pusu noktası haline gelebilir.'
  },
  {
    id: 'aram_relic_r2',
    name: 'Can Yadigarı (Kırmızı Taraf 2)',
    type: 'relic',
    x: 66.0,
    y: 34.0,
    icon: '💚',
    tag: 'Can Paketi',
    color: '#22c55e',
    respawn: 'İlk Doğuş: 3:15 • Yeniden Doğuş: 90 sn',
    rewards: 'Genişleyen alan şifası ve mana iadesi',
    tactics: 'Kırmızı üs savunmasında son toparlanma noktasıdır.'
  },
  {
    id: 'aram_portal_blue',
    name: 'Hexkapısı (Mavi Üs Portalı)',
    type: 'portal',
    x: 19.0,
    y: 81.0,
    icon: '🌀',
    tag: 'Hexkapısı',
    color: '#0ea5e9',
    respawn: 'Maç boyunca aktif',
    rewards: 'Üsten en dıştaki ilk aktif kuleye anında ışınlanma',
    tactics: 'Öldükten sonra doğduğunuzda doğrudan savaşa dönmenizi sağlar. Dış kule yıkıldığında portal iç kuleye otomatik çekilir.'
  },
  {
    id: 'aram_portal_red',
    name: 'Hexkapısı (Kırmızı Üs Portalı)',
    type: 'portal',
    x: 81.0,
    y: 19.0,
    icon: '🌀',
    tag: 'Hexkapısı',
    color: '#0ea5e9',
    respawn: 'Maç boyunca aktif',
    rewards: 'Üsten en dıştaki ilk aktif kuleye anında ışınlanma',
    tactics: 'Takım savaşında hayatta kalan arkadaşlarınızı desteklemek için koruyucu iniş pozisyonu sağlar.'
  },
  {
    id: 'aram_bush_mid1',
    name: 'Köprü Orta Sol Çalısı',
    type: 'bush',
    x: 47.0,
    y: 54.0,
    icon: '🌿',
    tag: 'Taktik Çalı',
    color: '#10b981',
    respawn: 'Sürekli alan',
    rewards: 'Tam görünmezlik ve pusu alanı',
    tactics: 'Blitzcrank, Thresh, Fiddlesticks gibi ani baskın yetenekleri olan şampiyonlar bu çalıyı kontrol ederek rakipleri kar topuyla avlar.'
  },
  {
    id: 'aram_bush_mid2',
    name: 'Köprü Orta Sağ Çalısı',
    type: 'bush',
    x: 53.0,
    y: 46.0,
    icon: '🌿',
    tag: 'Taktik Çalı',
    color: '#10b981',
    respawn: 'Sürekli alan',
    rewards: 'Tam görünmezlik ve pusu alanı',
    tactics: 'Köprünün diğer yarısını kontrol eder. Karşı takımın can paketine erişimini engellemek için mükemmel bir tehdit noktasıdır.'
  }
];

export default function LolMapsPage() {
  const [selectedMapId, setSelectedMapId] = useState('sr');
  const [activeLayers, setActiveLayers] = useState({
    epics: true,
    jungle: true,
    minions: true,
    wards: true,
    towers: true
  });
  const [selectedElement, setSelectedElement] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const currentMap = useMemo(() => {
    return MAP_DEFINITIONS.find(m => m.id === selectedMapId) || MAP_DEFINITIONS[0];
  }, [selectedMapId]);

  // Elements for current map
  const mapElements = useMemo(() => {
    if (selectedMapId === 'sr') {
      return SR_ELEMENTS.filter(item => {
        if (item.type === 'epic' && !activeLayers.epics) return false;
        if (item.type === 'jungle' && !activeLayers.jungle) return false;
        if (item.type === 'ward' && !activeLayers.wards) return false;
        return true;
      });
    } else if (selectedMapId === 'aram') {
      return ARAM_ELEMENTS;
    }
    return [];
  }, [selectedMapId, activeLayers]);

  // Set default selected element when switching map
  const activeInspectorItem = selectedElement || hoveredElement || (selectedMapId === 'sr' ? SR_ELEMENTS[0] : ARAM_ELEMENTS[0]);

  const toggleLayer = (layerKey) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.9));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="lol-maps-page-container">
      {/* 1. Header & Map Selector Bar */}
      <div className="maps-header-card">
        <div className="maps-header-title-box">
          <div className="maps-badge-pill">
            <span className="maps-badge-icon">🗺️</span>
            <span>VADİ & ARENA TAKTİK HARİTALARI</span>
          </div>
          <h1 className="maps-main-heading">League of Legends Harita Rehberi</h1>
          <p className="maps-sub-desc">
            Sihirdar Vadisi ve ARAM haritalarında canavar kampları, doğuş zamanları, minyon dalga rotaları ve profesyonel totem yerleşimleri.
          </p>
        </div>

        {/* Map Selector Buttons */}
        <div className="maps-selector-grid">
          {MAP_DEFINITIONS.map(m => {
            const isActive = m.id === selectedMapId;
            return (
              <button
                key={m.id}
                type="button"
                className={`map-card-tab ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setSelectedMapId(m.id);
                  setSelectedElement(null);
                  setHoveredElement(null);
                  setZoomLevel(1);
                }}
              >
                <div className="map-tab-icon">{m.icon}</div>
                <div className="map-tab-text">
                  <span className="map-tab-name">{m.name}</span>
                  <span className="map-tab-mode">{m.mode}</span>
                </div>
                {isActive && <div className="map-tab-glow-indicator"></div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Map Explorer Layout */}
      <div className="maps-explorer-layout">
        
        {/* Left Side: Map Visual Canvas with Zoom & Overlays */}
        <div className="map-canvas-wrapper">
          
          {/* Top Control Bar: Layers & Zoom */}
          <div className="map-control-bar">
            {selectedMapId === 'sr' && (
              <div className="map-layer-toggles">
                <span className="layer-bar-label">Katmanlar:</span>
                <button
                  type="button"
                  className={`layer-btn ${activeLayers.epics ? 'active' : ''}`}
                  onClick={() => toggleLayer('epics')}
                >
                  <span className="layer-dot epic"></span>
                  <span>Epik Canavarlar</span>
                </button>

                <button
                  type="button"
                  className={`layer-btn ${activeLayers.jungle ? 'active' : ''}`}
                  onClick={() => toggleLayer('jungle')}
                >
                  <span className="layer-dot jungle"></span>
                  <span>Orman Kampları</span>
                </button>

                <button
                  type="button"
                  className={`layer-btn ${activeLayers.minions ? 'active' : ''}`}
                  onClick={() => toggleLayer('minions')}
                >
                  <span className="layer-dot minions"></span>
                  <span>Minyon Rotaları</span>
                </button>

                <button
                  type="button"
                  className={`layer-btn ${activeLayers.wards ? 'active' : ''}`}
                  onClick={() => toggleLayer('wards')}
                >
                  <span className="layer-dot wards"></span>
                  <span>Önerilen Totemler</span>
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="map-zoom-controls">
              <button type="button" className="zoom-btn" onClick={handleZoomOut} title="Uzaklaştır">-</button>
              <span className="zoom-indicator">{Math.round(zoomLevel * 100)}%</span>
              <button type="button" className="zoom-btn" onClick={handleZoomIn} title="Yakınlaştır">+</button>
              {zoomLevel !== 1 && (
                <button type="button" className="zoom-reset-btn" onClick={handleResetZoom} title="Sıfırla">Sıfırla</button>
              )}
            </div>
          </div>

          {/* Interactive Map Surface */}
          <div className="map-viewport-box">
            <div 
              className="map-surface"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center'
              }}
            >
              {/* Background Map Art */}
              <img 
                src={currentMap.bgUrl} 
                alt={currentMap.name} 
                className="map-base-art"
                loading="lazy"
                draggable={false}
              />

              {/* Visual Decorative Bushes for Summoner's Rift (Pure display, non-clickable) */}
              {selectedMapId === 'sr' && (
                <svg className="map-bushes-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="bushGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#16a34a" />
                      <stop offset="45%" stopColor="#15803d" />
                      <stop offset="100%" stopColor="#064e3b" />
                    </linearGradient>
                    <filter id="bushGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0.3" stdDeviation="0.4" floodColor="#000000" floodOpacity="0.75" />
                    </filter>
                  </defs>

                  {SR_BUSHES.map(bush => (
                    <g 
                      key={bush.id} 
                      transform={`translate(${bush.cx}, ${bush.cy}) rotate(${bush.rot})`}
                      filter="url(#bushGlow)"
                      className="map-bush-item"
                    >
                      {/* Main bush body */}
                      <ellipse 
                        cx="0" 
                        cy="0" 
                        rx={bush.rx} 
                        ry={bush.ry} 
                        fill="url(#bushGrad)" 
                        stroke="#22c55e" 
                        strokeWidth="0.35"
                      />
                      {/* Top leafy highlight cluster */}
                      <circle 
                        cx={-bush.rx * 0.35} 
                        cy={-bush.ry * 0.25} 
                        r={bush.ry * 0.55} 
                        fill="#4ade80" 
                        opacity="0.55" 
                      />
                      {/* Secondary leafy highlight cluster */}
                      <circle 
                        cx={bush.rx * 0.3} 
                        cy={bush.ry * 0.2} 
                        r={bush.ry * 0.45} 
                        fill="#86efac" 
                        opacity="0.4" 
                      />
                    </g>
                  ))}
                </svg>
              )}

              {/* SVG Overlay: Minion Paths & Waves for Summoner's Rift */}
              {selectedMapId === 'sr' && activeLayers.minions && (
                <svg className="map-svg-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    {/* Pulsing Gradient for Waves */}
                    <linearGradient id="waveTopGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="waveMidGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.85" />
                    </linearGradient>
                    <linearGradient id="waveBotGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Top Lane Path: Corner route */}
                  <path 
                    d="M 14 86 L 14 18 Q 14 14 18 14 L 86 14" 
                    fill="none" 
                    stroke="url(#waveTopGrad)" 
                    strokeWidth="1.6" 
                    strokeDasharray="3 3"
                    className="animated-minion-path"
                  />

                  {/* Mid Lane Path: Direct diagonal */}
                  <line 
                    x1="14" 
                    y1="86" 
                    x2="86" 
                    y2="14" 
                    stroke="url(#waveMidGrad)" 
                    strokeWidth="1.6" 
                    strokeDasharray="3 3"
                    className="animated-minion-path"
                  />

                  {/* Bot Lane Path: Bottom corner route */}
                  <path 
                    d="M 14 86 L 82 86 Q 86 86 86 82 L 86 14" 
                    fill="none" 
                    stroke="url(#waveBotGrad)" 
                    strokeWidth="1.6" 
                    strokeDasharray="3 3"
                    className="animated-minion-path"
                  />
                </svg>
              )}

              {/* Minion Clash Markers (Çarpışma Noktaları) */}
              {selectedMapId === 'sr' && activeLayers.minions && SR_MINION_LANES.map(lane => (
                <div
                  key={lane.id}
                  className="minion-clash-marker"
                  style={{ left: `${lane.clashX}%`, top: `${lane.clashY}%` }}
                  title={`${lane.name} Minyon Buluşması • ${lane.clashTime}`}
                  onClick={() => {
                    setSelectedElement({
                      id: `minion_${lane.id}`,
                      name: `${lane.name} Minyon Dalgası`,
                      type: 'minion',
                      tag: 'Minyon Dalgası',
                      color: lane.color,
                      icon: '⚔️',
                      respawn: `İlk Dalga: ${lane.firstSpawn} • ${lane.waveInterval}`,
                      rewards: 'Koridor Minyon Altını (Büyücü: 14g, Yakın Dövüşçü: 21g, Kuşatma: 60-90g)',
                      buff: `${lane.clashTime} süresinde koridor merkezine varış.`,
                      tactics: lane.details
                    });
                  }}
                >
                  <span className="clash-pulse-ring" style={{ borderColor: lane.color }}></span>
                  <span className="clash-core" style={{ backgroundColor: lane.color }}>⚔️</span>
                </div>
              ))}

              {/* Interactive Point Markers on Map */}
              {mapElements.map(item => {
                const isSelected = activeInspectorItem?.id === item.id;
                const isWard = item.type === 'ward';
                const isEpic = item.type === 'epic';

                return (
                  <div
                    key={item.id}
                    className={`map-marker-pin ${item.type} ${item.wardType || ''} ${isSelected ? 'selected' : ''}`}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      '--pin-color': item.color
                    }}
                    onClick={() => setSelectedElement(item)}
                    onMouseEnter={() => setHoveredElement(item)}
                    onMouseLeave={() => setHoveredElement(null)}
                    title={`${item.name} (${item.tag})`}
                  >
                    {/* Outer Glow Ring */}
                    <span 
                      className={`marker-halo ${isEpic ? 'epic-pulse' : ''}`}
                      style={{ backgroundColor: item.color }}
                    ></span>

                    {/* Circular Badge Core Frame */}
                    <div className="marker-core-circle">
                      {item.iconImg ? (
                        <img src={item.iconImg} alt={item.name} className="marker-badge-icon" draggable={false} />
                      ) : (
                        <span className="marker-emoji-icon">{item.icon}</span>
                      )}
                    </div>

                    {/* Smooth Animated Tooltip */}
                    <div className="marker-tooltip">
                      <span className="tooltip-tag" style={{ color: item.color }}>{item.tag}</span>
                      <span className="tooltip-title">{item.name}</span>
                      {item.respawn && (
                        <span className="tooltip-time">{item.respawn.split('•')[0]}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Tactical Inspector & Guide Panel */}
        <div className="maps-inspector-sidebar">
          {activeInspectorItem ? (
            <div className="inspector-card">
              {/* Header with Type & Name */}
              <div className="inspector-head">
                <div className="inspector-avatar-box" style={{ borderColor: activeInspectorItem.color }}>
                  {activeInspectorItem.iconImg ? (
                    <img src={activeInspectorItem.iconImg} alt={activeInspectorItem.name} />
                  ) : (
                    <span className="inspector-large-emoji">{activeInspectorItem.icon}</span>
                  )}
                </div>

                <div className="inspector-titles">
                  <span className="inspector-type-pill" style={{ background: activeInspectorItem.color + '22', color: activeInspectorItem.color, borderColor: activeInspectorItem.color }}>
                    {activeInspectorItem.tag}
                  </span>
                  <h3 className="inspector-name">{activeInspectorItem.name}</h3>
                  <span className="inspector-coords">
                    Harita Konumu: X: %{Math.round(activeInspectorItem.x || 50)} • Y: %{Math.round(activeInspectorItem.y || 50)}
                  </span>
                </div>
              </div>

              {/* Quick Baron Pit Epic Switcher (Side-by-Side Easy Navigation) */}
              {['sr_baron', 'sr_herald', 'sr_voidgrubs'].includes(activeInspectorItem.id) && (
                <div className="pit-selector-card">
                  <span className="pit-selector-label">Baron Çukuru Hedefleri:</span>
                  <div className="pit-selector-btns">
                    <button
                      type="button"
                      className={`pit-select-btn ${activeInspectorItem.id === 'sr_baron' ? 'active' : ''}`}
                      onClick={() => setSelectedElement(SR_ELEMENTS.find(e => e.id === 'sr_baron'))}
                    >
                      👑 Baron (20:00)
                    </button>
                    <button
                      type="button"
                      className={`pit-select-btn ${activeInspectorItem.id === 'sr_herald' ? 'active' : ''}`}
                      onClick={() => setSelectedElement(SR_ELEMENTS.find(e => e.id === 'sr_herald'))}
                    >
                      👾 Alamet (14:00)
                    </button>
                    <button
                      type="button"
                      className={`pit-select-btn ${activeInspectorItem.id === 'sr_voidgrubs' ? 'active' : ''}`}
                      onClick={() => setSelectedElement(SR_ELEMENTS.find(e => e.id === 'sr_voidgrubs'))}
                    >
                      🟣 Kurtçuklar (05:00)
                    </button>
                  </div>
                </div>
              )}

              {/* Timing & Respawn Box */}
              {activeInspectorItem.respawn && (
                <div className="inspector-section-card timer">
                  <div className="section-label-row">
                    <span className="sec-icon">⏱️</span>
                    <span className="sec-title">Doğuş & Yeniden Doğuş Zamanları</span>
                  </div>
                  <p className="sec-value highlight">{activeInspectorItem.respawn}</p>
                </div>
              )}

              {/* Rewards / Gold / XP */}
              {activeInspectorItem.rewards && (
                <div className="inspector-section-card rewards">
                  <div className="section-label-row">
                    <span className="sec-icon">💰</span>
                    <span className="sec-title">Sağlanan Ödüller & Kaynaklar</span>
                  </div>
                  <p className="sec-value">{activeInspectorItem.rewards}</p>
                </div>
              )}

              {/* Buff / Power */}
              {activeInspectorItem.buff && (
                <div className="inspector-section-card buff">
                  <div className="section-label-row">
                    <span className="sec-icon">✨</span>
                    <span className="sec-title">Güçlendirme & Özel Etkiler</span>
                  </div>
                  <p className="sec-value">{activeInspectorItem.buff}</p>
                </div>
              )}

              {/* Strategic Purpose for Wards */}
              {activeInspectorItem.purpose && (
                <div className="inspector-section-card purpose">
                  <div className="section-label-row">
                    <span className="sec-icon">🎯</span>
                    <span className="sec-title">Stratejik Totem Amacı</span>
                  </div>
                  <p className="sec-value">{activeInspectorItem.purpose}</p>
                </div>
              )}

              {/* Tactical Secrets & Tips */}
              {activeInspectorItem.tactics && (
                <div className="inspector-section-card tactics">
                  <div className="section-label-row">
                    <span className="sec-icon">💡</span>
                    <span className="sec-title">Profesyonel Taktik & İpuçları</span>
                  </div>
                  <p className="sec-value tactics-text">{activeInspectorItem.tactics}</p>
                </div>
              )}

            </div>
          ) : (
            <div className="inspector-empty-card">
              <span className="empty-hand-icon">👆</span>
              <h3>Haritadan Bir Nokta Seçin</h3>
              <p>
                Kampların doğuş süreleri, altın değerleri, minyon rotaları veya totem rehberlerini görmek için harita üzerindeki işaretçilere tıklayın.
              </p>
            </div>
          )}

          {/* Quick Cheat Sheet List */}
          <div className="quick-timers-card">
            <h4>⏱️ Hızlı Vadi Zamanlayıcıları</h4>
            <div className="timers-mini-table">
              <div className="timer-row">
                <span className="t-name">⚔️ Minyon İlk Dalga</span>
                <span className="t-val">1:05</span>
              </div>
              <div className="timer-row">
                <span className="t-name">🔷 Kırmızı & Mavi Buff</span>
                <span className="t-val">1:30</span>
              </div>
              <div className="timer-row">
                <span className="t-name">🐸 Gromp & Kayacıllar</span>
                <span className="t-val">1:42</span>
              </div>
              <div className="timer-row">
                <span className="t-name">🦀 Yampiri Yengeç</span>
                <span className="t-val">3:30</span>
              </div>
              <div className="timer-row">
                <span className="t-name">🟣 Hiçlik Kurtçukları</span>
                <span className="t-val">5:00</span>
              </div>
              <div className="timer-row">
                <span className="t-name">🐉 İlk Ejderha</span>
                <span className="t-val">5:00</span>
              </div>
              <div className="timer-row">
                <span className="t-name">👾 Vadi'nin Alameti</span>
                <span className="t-val">14:00</span>
              </div>
              <div className="timer-row">
                <span className="t-name">👑 Baron Nashor</span>
                <span className="t-val">20:00</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
