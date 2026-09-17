# ⚡ Fortnite Sprites Tracker & OBS Overlay (Glitch Season v2.2)

<p align="center">
  <img src="static/images/T_Icon_BR_Creature_Sprite_JazzJackrabbit_L.webp" width="130" alt="Fortnite Sprite" />
</p>

<p align="center">
  <a href="https://fortnite.gg/sprites"><img src="https://img.shields.io/badge/Fortnite-Chapter%207%20Season%204-ff007b?style=for-the-badge&logo=epicgames" alt="Fortnite Season" /></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.10%2B-00f0ff?style=for-the-badge&logo=python" alt="Python" /></a>
  <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" /></a>
  <a href="https://obsproject.com/"><img src="https://img.shields.io/badge/OBS%20Studio-Compatible-302E31?style=for-the-badge&logo=obsstudio" alt="OBS Studio" /></a>
  <a href="https://github.com/FNFest-TR/sprites/releases"><img src="https://img.shields.io/badge/Version-v2.2.0-00ff88?style=for-the-badge" alt="Version 2.2.0" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-ffe600?style=for-the-badge" alt="License" /></a>
</p>

<p align="center">
  <b>🇹🇷 Türkçe & 🇬🇧 English Bilingual Support</b>
</p>

---

## 🇹🇷 TÜRKÇE

### 📖 Genel Bakış
**Fortnite.GG** üzerindeki tüm Sprite'ları (153 adet), varyantları, düşme oranlarını ve unreleased karakterleri canlı takip edip canlı yayınlarınızda (**OBS Studio**) şık bir Cyberpunk / Glitch animasyonlu widget olarak sergilemenizi sağlayan yerel yönetim paneli ve yayın overlay sistemi.

### ✨ v2.2 Yenilikleri & Özellikler
- 📼 **Cyber Kaset / Disk Widget Modu (`mode=cassette`):** Özel siber kaset çerçevesi içinde, neon ışıklı kaset barı ve CRT arka plan üzerinde soldan sağa akıcı şekilde kayan eksik karakterler bandı.
- 🎛️ **Canlı Widget Özelleştirici (Live Customizer):** Arayüz üzerinden mod, tema, ızgara sütun/satır, sayfa geçiş hızı, arka plan ve boyut ayarlarını canlı önizlemeyle test edip tek tıkla OBS linki kopyalama.
- 🎨 **4 Görsel Tema Seçeneği:**
  - 👾 **Glitch / Override:** Neon pembe ve camgöbeği siber efektler.
  - ⚡ **Fortnite Classic:** Klasik mavi ve mor Fortnite teması.
  - 👑 **Midas Gold:** Lüks altın sarısı parlaklık ve metalik gölgeler.
  - 🌑 **Stealth:** Dikkat dağıtmayan minimalist koyu gri tonlar.
- 🃏 **Kare NxM Dinamik Izgara (Grid):** 2x2, 3x3, 4x2, 4x3 ve 4x1 seçenekleriyle tam kare kartlar ve yumuşak sayfa geçişleri.
- 🎞️ **Kayan Marquee Ticker:** Kesintisiz akan yatay eksik kart bandı.
- 📊 **Kompakt Banner / HUD:** Yayının köşesine oturan şık ilerleme çubuğu.
- 🔒 **Unreleased Filtresi:** Henüz oyuna eklenmemiş (unreleased) sprite'ları tek tıkla gösterme veya gizleme.
- 💎 **Nadirlik İlerleme Çubukları:** Her nadirlik seviyesinin (Mythic, Legendary, Epic vb.) tamamlanma yüzdesini gösteren interaktif kapsüller.
- 🔔 **Otomatik Güncelleme & Sürüm Bildirimi (`v2.2.0`):** GitHub Releases ile otomatik kontrol yapıp yeni sürüm çıktığında yönetim panelinde bildirim gösterir.
- 🔄 **Canlı Sıfır Gecikme (0ms Live Sync):** Yönetim panelinde işaretlediğiniz sprite'lar OBS Studio'da anında güncellenir.
- 📦 **Tek Tıkla Bağımsız EXE:** Python kurulumu gerektirmeden arka planda sistem tepsisinde çalışan tek dosya `.exe`.

### 🚀 Hızlı Başlangıç

#### Seçenek 1: Bağımsız `.exe` ile (Python Gerektirmez)
1. **[Releases](https://github.com/FNFest-TR/sprites/releases)** bölümünden **`FortniteSpritesTracker.exe`** dosyasını indirin ve çalıştırın.
2. Siyah konsol penceresi açılmaz; sistem tepsisinde (sağ altta) sessizce çalışır ve tarayıcınızda otomatik olarak yönetim panelini (**`http://127.0.0.1:8765`**) açar.

#### Seçenek 2: Kaynak Koddan Çalıştırma (Python 3.10+)
```bash
# 1. Depoyu klonlayın
git clone https://github.com/FNFest-TR/sprites.git
cd sprites

# 2. Gerekli kütüphaneleri yükleyin
pip install -r requirements.txt

# 3. Uygulamayı başlatın
python tray_app.py
```

### 📺 OBS Studio Entegrasyonu

OBS Studio'da **Kaynaklar (Sources) -> Ekle (+) -> Tarayıcı (Browser Source)** seçeneğini ekleyip linkinizi yapıştırın:

| Görünüm Modu | OBS Tarayıcı URL Örneği | Önerilen OBS Boyutu (W x H) |
| :--- | :--- | :--- |
| **📼 Kaset / Disk (Yeni!)** | `http://127.0.0.1:8765/obs?mode=cassette&season=42&lang=tr` | `700 x 500` veya `1920 x 1080` |
| **🃏 3x3 Dinamik Grid** | `http://127.0.0.1:8765/obs?mode=grid&season=42&cols=3&rows=3&lang=tr` | `500 x 500` |
| **🎞️ Kayan Kartlar (Ticker)** | `http://127.0.0.1:8765/obs?mode=ticker&season=42&lang=tr` | `1920 x 240` |
| **📊 İlerleme Banner'ı (HUD)** | `http://127.0.0.1:8765/obs?mode=banner&season=42&lang=tr` | `490 x 140` |

---

## 🇬🇧 ENGLISH

### 📖 Overview
A real-time Sprite collection tracker and OBS Studio stream overlay system designed for **Fortnite Chapter 7 Season 4 (Glitch / Override Season)**. Tracks all 153 sprites, variants, rarities, drop chances, and unreleased assets directly from Fortnite.GG.

### ✨ v2.2 Features
- 📼 **Cyber Cassette / Disk Mode (`mode=cassette`):** Retro-futuristic cartridge frame with neon glowing bar and seamless conveyor conveyor belt of missing sprites.
- 🎛️ **Live Widget Customizer:** Real-time visual customizer with interactive live preview to configure theme, layout, animation interval, background transparency, and unreleased filters.
- 🎨 **4 Visual Themes:**
  - 👾 **Glitch / Override:** Cyberpunk neon magenta & cyan.
  - ⚡ **Fortnite Classic:** Iconic Battle Royale blue & purple.
  - 👑 **Midas Gold:** Golden reflections with dark accents.
  - 🌑 **Stealth:** Minimalist dark mode.
- 🃏 **Dynamic Square NxM Grid:** 2x2, 3x3, 4x2, 4x3, and 4x1 layouts with true square cards and pagination.
- 🎞️ **Smooth Marquee Ticker:** Continuous horizontal ticker for missing sprites.
- 📊 **Progress Banner / HUD:** Sleek, compact overlay for stream HUDs.
- 🔒 **Unreleased Sprites Toggle:** Include or exclude unreleased sprites with one click.
- 💎 **Rarity Breakdown Bars:** Clickable rarity capsules showing progress percentages per rarity tier.
- 🔔 **Auto-Update & Version Check (`v2.2.0`):** Checks GitHub Releases and notifies you when an update is available.
- 🔄 **0ms Zero-Latency Sync:** Real-time BroadcastChannel sync across all open widgets.
- 📦 **Single Portable EXE:** Standalone executable running in the system tray.

### 🚀 Quick Start

#### Option 1: Standalone `.exe` (No Python Needed)
1. Download **`FortniteSpritesTracker.exe`** from the **[Releases](https://github.com/FNFest-TR/sprites/releases)** page.
2. Double-click to launch. It runs quietly in the Windows system tray and opens `http://127.0.0.1:8765` in your browser.

#### Option 2: Run from Source (Python 3.10+)
```bash
# 1. Clone the repository
git clone https://github.com/FNFest-TR/sprites.git
cd sprites

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start the application
python tray_app.py
```

### 📺 OBS Studio Browser Source Setup

In OBS Studio, add a **Browser Source** and enter your desired URL:

| View Mode | OBS Browser Source URL Example | Recommended Size (W x H) |
| :--- | :--- | :--- |
| **📼 Cassette / Disk (New!)** | `http://127.0.0.1:8765/obs?mode=cassette&season=42&lang=en` | `700 x 500` or `1920 x 1080` |
| **🃏 Dynamic NxM Grid** | `http://127.0.0.1:8765/obs?mode=grid&season=42&cols=3&rows=3&lang=en` | `500 x 500` |
| **🎞️ Smooth Ticker** | `http://127.0.0.1:8765/obs?mode=ticker&season=42&lang=en` | `1920 x 240` |
| **📊 Progress Banner (HUD)** | `http://127.0.0.1:8765/obs?mode=banner&season=42&lang=en` | `490 x 140` |

---

## 📂 Project Structure

```
sprites/
├── app.py                     # FastAPI backend, state API & version check
├── fetch_sprites.py           # Fortnite.GG scraper & asset downloader
├── tray_app.py                # System tray runner & startup sync
├── requirements.txt           # Python dependencies
├── data/
│   ├── sprites.json           # 153 sprites metadata database
│   └── user_state.json        # User progress tracking state
└── static/
    ├── index.html             # Manager Dashboard UI & Live Customizer
    ├── obs_widget.html        # OBS Studio Browser Source Overlay
    ├── css/                   # Glitch, Classic, Gold, Stealth themes
    ├── js/                    # Real-time sync & customizer controllers
    ├── img/                   # Cyber Cassette assets (kaset, kaset_bar, bg)
    └── images/                # 153 high-res .webp sprite icons
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE). Fortnite and all associated assets are trademarks and property of Epic Games.
