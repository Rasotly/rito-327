# 🎮 Rito 327 — League of Legends & Valorant İstatistik & Analiz Platformu

<div align="center">

![Rito 327 Banner](https://img.shields.io/badge/RITO-327-0ea5e9?style=for-the-badge&logo=riotgames&logoColor=white)
![React 19](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=for-the-badge&logo=vite&logoColor=white)
![PHP 8.2](https://img.shields.io/badge/PHP-8.2-777bb4?style=for-the-badge&logo=php&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Apache-2496ed?style=for-the-badge&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<p align="center">
  <b>Riot Games API</b> ve yerel veri işleme algoritmalarıyla güçlendirilmiş; <b>League of Legends</b> ve <b>Valorant</b> oyuncuları için detaylı profil analizi, profesyonel şampiyon sıralamaları, canlı maç geçmişi, meta eşya rehberleri, interaktif Sihirdar Vadisi haritası ve mini oyunlar sunan yeni nesil hepsi-bir-arada web platformu.
</p>

[Özellikler](#-özellikler) • [Mimari](#-proje-mimarisi) • [Kurulum](#-kurulum-rehberi) • [API Anahtarı Yapılandırması](#-api-anahtarı-yapılandırması-önemli) • [Sorun Giderme](#-sorun-giderme)

---

</div>

## 📌 İçindekiler
- [🌟 Öne Çıkan Özellikler](#-öne-çıkan-özellikler)
  - [⚔️ League of Legends Modülü](#-league-of-legends-modülü)
  - [🎯 Valorant Modülü](#-valorant-modülü)
- [🏗️ Proje Mimarisi & Teknoloji Yığını](#-proje-mimarisi--teknoloji-yığını)
- [📁 Dizin Yapısı](#-dizin-yapısı)
- [🔑 API Anahtarı Yapılandırması (ÖNEMLİ)](#-api-anahtarı-yapılandırması-önemli)
- [🚀 Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
  - [Gereksinimler](#gereksinimler)
  - [1. Backend (Docker & PHP)](#1-backend-docker--php)
  - [2. Frontend (React 19 & Vite)](#2-frontend-react-19--vite)
- [⚙️ Gelişmiş Algoritmalar](#-gelişmiş-algoritmalar)
  - [League of Graphs Şampiyon Derece Formülü](#league-of-graphs-şampiyon-derece-formülü)
- [🔧 Sorun Giderme (Troubleshooting)](#-sorun-giderme-troubleshooting)
- [🔒 Güvenlik Notları](#-güvenlik-notları)
- [📄 Lisans](#-lisans)

---

## 🌟 Öne Çıkan Özellikler

### ⚔️ League of Legends Modülü

1. **Oyuncu & Profil Analizi**:
   - **Tüm Riot Bölgeleri Desteği**: TR, EUW, EUN, NA, KR, LAN, LAS, OCE vb.
   - **Gerçek Riot ID Desteği**: `İsim#Etiket` araması ile anlık PUUID çözümleme.
   - **Detaylı Sıralama Kartları**: Tekli/Çiftli (Solo/Duo) ve Esnek (Flex) dereceleri, LP, galibiyet/mağlubiyet oranları ve yüzdelik dilim (`En iyi %X`).
2. **League of Graphs Şampiyon Sıralaması (Champion Ranking)**:
   - **20 Maç Kuralı**: Bir şampiyonda sıralamaya girmek için sezonda en az 20 dereceli maç oynama şartı. 20 maç altındaki şampiyonlar otomatik olarak `Derece: -` ve açıklama ipucuyla korunur.
   - **Sunucu & Dünya Sıralaması**: KDA, lig kademesi (Tier/Rank/LP), kazanma oranı ve oyun modu ağırlıklarıyla hesaplanan dinamik lig sıralaması (Örn: `TR: #81.110 • Dünya: #1.336.526`).
3. **Kapsamlı Profil Sekmeleri (`LolProfileTabs`)**:
   - **Genel Bakış (Overview)**: Sezon istatistikleri, en çok oynanan şampiyonlar, KDA ve maç sayıları.
   - **Şampiyonlar (Champions Performance)**: Şampiyon bazında dakika başı minyon (CSPM), dakika başı altın (GPM), hasar/dakika ve görüş puanlarının dünya ortalaması ile karşılaştırmalı analizi (`▲ +%12`, `▼ -%5`).
   - **Paternler & Harita Varlığı (Patterns)**: Son 20 maçın zaman çizelgesi verilerinden otomatik hesaplanan koridor dağılımı (Top, Jungle, Mid, ADC, Support) ve Sihirdar Vadisi ısı haritası.
   - **Canlı Karşılaşma Geçmişi (Match History)**: Eşyalar, kullanılan rünler (birincil + ikincil ağaçlar), totemler, şampiyon seviyeleri ve maç süresi.
4. **Şampiyonlar Rehberi & Hasar Skalaları (`LolAbilitiesView`)**:
   - Tüm şampiyonların Pasif, Q, W, E, R yeteneklerinin ayrıntılı taban hasarları, AD / AP çarpanları, bekleme süreleri ve mana bedelleri.
   - En popüler eşya dizilimleri, başlangıç eşyaları, çizme tercihleri ve rün setleri.
5. **İnteraktif Sihirdar Vadisi Haritası (`LolMapsPage`)**:
   - **Totemleme Rehberi**: Pembe kontrol totemleri ve yeşil görüş totemlerinin kritik yerleşim noktaları.
   - **Orman Kampları**: Baron Nashor, Ejderhalar, Vadi'nin Alameti, Hiçlik Kurtçukları ve buff kamplarının kesin konumları ve yeniden doğma süreleri.
   - **Minyon Çarpışma Çizgileri**: Dalga buluşma süreleri ve stratejik koridor noktaları.
   - Kule, inhibitör ve Nexus konumları.

---

### 🎯 Valorant Modülü

1. **Oyuncu İstatistik Takipçisi (Valorant Tracker)**:
   - Oyuncu Riot ID sorgulama, güncel K/D oranı, HS (Headshot) yüzdesi, maç başı ortalama skor (ACS).
   - Ajan kazanma oranları ve son karşılaşma geçmişi.
2. **Ajan & Yetenek Kütüphanesi**:
   - Tüm ajanların ses dosyaları, yetenek animasyon detayları, rol dağılımları (Düellocu, Öncü, Kontrol Uzmanı, Gözcü).
3. **Silah Veritabanı & Hasar Tabloları**:
   - Silahların menzil bazında kafa/gövde/bacak hasar değerleri, sekme desenleri ve mermi kapasiteleri.
4. **İnteraktif Mini Oyunlar**:
   - **GeoValo**: Ekran görüntülerinden harita konumunu tahmin etme oyunu.
   - **Higher / Lower**: Valorant istatistiklerini yüksek/düşük olarak tahmin etme yarışması.
   - **Admin Paneli**: Mini oyunlara yeni soru ve görsel ekleme/düzenleme paneli.
5. **VSenset (Hassasiyet Dönüştürücü)**:
   - CS:GO/CS2, Apex Legends, Overwatch vb. oyunlardan Valorant'a hassasiyet (eDPI) çevirici araç.

---

## 🏗️ Proje Mimarisi & Teknoloji Yığını

```
┌─────────────────────────────────────────────────────────────┐
│                      RITO 327 CLIENT                        │
│                React 19 • Vite • Vanilla CSS                │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
       (HTTP / REST API)               (HTTP / REST API)
       Port: 8081                      Port: 8081
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      LoL BACKEND SERVICE     │ │   VALORANT BACKEND SERVICE │
│   PHP 8.2 • Apache • Docker  │ │  PHP 8.2 • Apache • Docker │
│                              │ │                            │
│ • RiotApi.php                │ │ • tracker.php              │
│ • ChampionRankingCalculator  │ │ • geovalo.php              │
│ • lol.php                    │ │ • higherlower.php          │
│ • Yerel Önbellek (JSON/File) │ │ • uploads / data           │
└──────────────┬───────────────┘ └────────────────────────────┘
               │
      (X-Riot-Token)
               ▼
┌──────────────────────────────┐
│       RIOT GAMES API         │
│  Account-v1 • Summoner-v4    │
│  Match-v5 • League-v4        │
│  Champion-Mastery-v4         │
└──────────────────────────────┘
```

- **Frontend**: React 19.x, Vite 8.x, Vanilla CSS (koyu mod, glassmorphism, responsive grid & flexbox).
- **Backend**: PHP 8.2 (Apache), Docker & Docker Compose.
- **Dış Entegrasyonlar**: Riot Games Resmi Geliştirici API'si, Data Dragon CDN, Community Dragon Assets.

---

## 📁 Dizin Yapısı

```bash
rito-327/
├── backend/
│   ├── lol/
│   │   ├── ChampionRankingCalculator.php   # League of Graphs sıralama hesaplayıcı
│   │   ├── RiotApi.php                     # Riot API istek yöneticisi & veri harmanlama
│   │   ├── lol.php                         # LoL yönlendirici endpoint
│   │   └── cache/                          # Dinamik API yanıt önbelleği (Git ignored)
│   ├── valorant/
│   │   └── valorant.php                    # Valorant temel servisleri
│   ├── data/                               # Yerel JSON veritabanları
│   ├── uploads/                            # Mini oyun görselleri
│   ├── geovalo.php                         # GeoValo mini oyun API
│   ├── higherlower.php                     # Higher/Lower mini oyun API
│   ├── tracker.php                         # Valorant Tracker API
│   ├── index.php                           # Ana API yönlendirici
│   ├── .env.example                        # Örnek çevre değişkeni şablonu
│   └── .env                                # Kullanıcının oluşturması gereken gizli dosya!
├── frontend/
│   ├── public/                             # İkonlar, harita ve nadirlik görselleri
│   ├── src/
│   │   ├── lol/                            # League of Legends sayfaları ve bileşenleri
│   │   ├── valorant/                       # Valorant sayfaları ve bileşenleri
│   │   ├── App.jsx                         # Ana modül yönlendirme ekranı
│   │   ├── index.css                       # Genel tasarım sistemi ve tema
│   │   └── main.jsx                        # React render giriş noktası
│   ├── package.json                        # Frontend bağımlılıkları
│   └── vite.config.js                      # Vite sunucu yapılandırması
├── docker-compose.yml                      # Backend Apache & PHP konteyner tanımı
├── .gitignore                              # Git gizlilik ve hariç tutma kuralları
└── README.md                               # Proje dokümantasyonu
```

---

## 🔑 API Anahtarı Yapılandırması (ÖNEMLİ)

Güvenlik nedenleriyle projenin kaynak kodlarında **hiçbir Riot API anahtarı barındırılmaz** ve `.env` dosyaları GitHub'a **asla yüklenmez** (`.gitignore` ile korunmaktadır).

Projeyi çalıştırmadan önce **kullanıcının kendi Riot Games API anahtarını tanımlaması zorunludur**:

### 1. Adım: API Anahtarı Alın
1. [Riot Games Developer Portal](https://developer.riotgames.com/) adresine gidin.
2. Riot hesabınızla giriş yapın.
3. Dashboard üzerinden kişisel **Development API Key**'inizi kopyalayın (Örn: `RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

> [!NOTE]  
> Geliştirici anahtarlarının geçerlilik süresi Riot Games tarafından **24 saat** olarak belirlenmiştir. Süresi dolduğunda aynı panelden yenileyebilirsiniz.

### 2. Adım: `.env` Dosyasını Oluşturun
Projenin `backend/` dizini içerisinde `.env` adında yeni bir dosya oluşturun:

```bash
# Windows PowerShell
copy backend\.env.example backend\.env

# Linux / macOS
cp backend/.env.example backend/.env
```

### 3. Adım: Anahtarınızı Ekleyin
Oluşturduğunuz `backend/.env` dosyasını bir metin düzenleyiciyle açıp anahtarınızı yapıştırın:

```env
# Riot Games Developer API Key
# Do NOT commit this file to GitHub!
RIOT_API_KEY=RGAPI-ba5a9bb8-783f-4776-a515-4606b8de5dcb
```

Dosyayı kaydedin. Backend servisi bu anahtarı otomatik olarak okuyacaktır.

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (veya yerel PHP 8.2 + Apache)
- [Node.js](https://nodejs.org/) (v18+ veya v20+ önerilir)
- [Git](https://git-scm.com/)

---

### 1. Backend (Docker & PHP)

Backend servisi PHP 8.2 Apache Docker konteyneri üzerinde çalışacak şekilde yapılandırılmıştır.

1. Proje ana dizinindeyken Docker konteynerini başlatın:
   ```bash
   docker compose up -d
   ```
2. Konteynerin durumunu kontrol edin:
   ```bash
   docker compose ps
   ```
   Backend servisi `http://localhost:8081` adresinde yayına başlayacaktır.
3. API'nin çalıştığını doğrulamak için tarayıcınızda veya terminalde test edin:
   ```bash
   curl http://localhost:8081/index.php
   ```

---

### 2. Frontend (React 19 & Vite)

1. `frontend/` dizinine geçin:
   ```bash
   cd frontend
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Geliştirici sunucusunu başlatın:
   ```bash
   npm run dev
   ```
4. Tarayıcınızda **`http://127.0.0.1:5174`** adresine gidin.

---

## ⚙️ Gelişmiş Algoritmalar

### League of Graphs Şampiyon Derece Formülü
[ChampionRankingCalculator.php](file:///backend/lol/ChampionRankingCalculator.php) dosyası, resmi League of Graphs / Porofessor sıralama mantığını birebir modeller:

$$\text{Puan} = \text{Kademe Tabanı} \times M_{\text{WR}} \times M_{\text{KDA}} \times \text{Kuyruk Faktörü} \times \text{Maç Cezası}$$

- **Kademe Çarpanı**: Demir'den Şampiyonluk aşamasına kadar her lig kademesine taban puan atanır (Örn: Challenger 140.000 puan, Master 52.000 puan, Gold 2.500 puan).
- **Kazanma Oranı Çarpanı ($M_{\text{WR}}$)**: %50 taban kabul edilir; her +%25 kazanma oranı puanı 2 katına çıkarır.
- **KDA Çarpanı ($M_{\text{KDA}}$)**: 2.3 KDA ortalama kabul edilir; 4.6 KDA puanı 3 katına çıkarır.
- **Kuyruk Ağırlığı**: Tekli/Çiftli maçlar 1.0x, Esnek (Flex) maçlar 0.4x ile ağırlıklandırılır.
- **20 Maç Barajı**: Oyuncunun sezonda $\ge 20$ maçı yoksa oyuncu sıralamaya dahil edilmez (`isRanked: false`, `Derece: -`). 20-80 maç arasındaysa skor $\frac{\text{Maç Sayısı}}{80}$ oranında dengelenir.
- **Sıralama Eğrisi**: Elde edilen skor dünya merdiveninde logaritmik olarak haritalanır ve sunucu oyuncu havuzu katsayısına (TR için ~16.48) bölünerek sunucu sıralaması elde edilir.

---

## 🔧 Sorun Giderme (Troubleshooting)

### 1. `Error: listen EACCES: permission denied ::1:5174`
- **Sebep**: Windows üzerinde IPv6 loopback (`::1`) dinleme izninin Hyper-V veya güvenlik duvarı tarafından engellenmesi.
- **Çözüm**: `frontend/vite.config.js` dosyasına `host: '127.0.0.1'` eklenmiştir. Projeyi doğrudan `npm run dev` ile başlatabilirsiniz.

### 2. Docker `bind: Erişim izinlerince izin verilmeyen bir şekilde bir yuvaya erişilmeye çalışıldı` (Port 8081)
- **Sebep**: Windows yeniden başlatıldığında WinNAT / Hyper-V servisinin dinamik port aralıklarını geçici olarak rezerve etmesi.
- **Çözüm**: Yönetici olarak PowerShell açıp şu komutları sırasıyla çalıştırın:
  ```powershell
  net stop winnat
  net start winnat
  docker compose up -d
  ```

### 3. API İsteklerinde `403 Forbidden` veya Boş Veri
- **Sebep**: Riot API anahtarınızın süresi dolmuş veya `.env` dosyası oluşturulmamış olabilir.
- **Çözüm**: [Riot Developer Portal](https://developer.riotgames.com/)'dan yeni anahtar alıp `backend/.env` dosyasındaki `RIOT_API_KEY` değerini güncelleyin.

---

## 🔒 Güvenlik Notları
- `.env` ve hassas anahtar barındıran hiçbir dosya Git takibine alınmaz (`.gitignore` ile korunmaktadır).
- Yerel önbellek dosyaları (`backend/lol/cache/`, `*.json`) kullanıcı gizliliğini korumak adına depoya dahil edilmez.
- Riot Games Developer API anahtarınızı asla herkese açık platformlarda (GitHub, Discord vb.) paylaşmayınız.

---

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) altında geliştirilmiştir. Riot Games, League of Legends ve Valorant markaları Riot Games, Inc.'in tescilli ticari markalarıdır. Bu proje Riot Games tarafından onaylanmamıştır ve Riot Games'in görüş veya fikirlerini yansıtmaz.
