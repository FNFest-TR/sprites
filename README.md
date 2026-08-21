# ⚡ Fortnite Sprites Tracker & OBS Overlay (Glitch Season)

[![Fortnite](https://img.shields.io/badge/Fortnite-Chapter%207%20Season%204-ff007b?style=for-the-badge&logo=epicgames)](https://fortnite.gg/sprites)
[![Python](https://img.shields.io/badge/Python-3.10%2B-00f0ff?style=for-the-badge&logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![OBS](https://img.shields.io/badge/OBS%20Studio-Compatible-302E31?style=for-the-badge&logo=obsstudio)](https://obsproject.com/)

> **Fortnite.GG** üzerindeki tüm Sprite'ları (153 adet), varyantları, düşme oranlarını ve unreleased karakterleri canlı takip edip yayınlarınızda (**OBS Studio**) şık bir Cyberpunk / Glitch animasyonlu widget olarak sergilemenizi sağlayan yerel yönetim paneli ve yayın overlay sistemi.

---

## ✨ Özellikler (Features)

- 👾 **Glitch / Override Teması:** Cyber Grid ızgara deseni, CRT TV Scanlines efektleri, kromatik RGB glitch animasyonları ve neon ışıklandırmalar.
- 🃏 **OBS 3x3 Dönüşümlü Grid:** Canlı yayında 3x3 (9 kart) formatında devasa 3D karakter modelleri ve 9'dan fazla eksik olduğunda akıcı sayfa rotasyonu (**Carousel/Pagination**).
- 🎞️ **OBS Kayan Kartlar (Ticker):** Kesintisiz akan yatay kart bandı.
- 📊 **OBS Banner / HUD:** Kompakt ilerleme çubuğu ve eksik/toplanan sayaçları.
- 🔄 **Canlı Sıfır Gecikme (0ms Live Sync):** Yönetim panelinde işaretlediğiniz sprite'lar OBS Studio'da anında güncellenir.
- 🌐 **İki Dilli Destek:** Türkçe 🇹🇷 ve İngilizce 🇬🇧 tam arayüz desteği.
- ⚡ **Fortnite.GG Canlı Otomasyon:** Uygulama açılışında otomatik senkronizasyon ve tek tıkla canlı güncelleme.
- 📦 **Tek Tıkla Taşınabilir EXE:** Python kurulumu gerektirmeden arka planda sistem tepsisinde çalışan bağımsız `.exe`.

---

## 🚀 Hızlı Başlangıç (Kurulum)

### Seçenek 1: Bağımsız `.exe` ile (Python Gerektirmez)
1. **[`FortniteSpritesTracker.exe`](./FortniteSpritesTracker.exe)** dosyasını çalıştırın.
2. Siyah konsol penceresi açılmaz; sistem tepsisinde (sağ altta) sessizce çalışır ve tarayıcınızda otomatik olarak yönetim panelini (**`http://127.0.0.1:8765`**) açar.

### Seçenek 2: Kaynak Koddan Çalıştırma (Python 3.10+)
```bash
# 1. Depoyu klonlayın
git clone https://github.com/FNFest-TR/sprites.git
cd sprites

# 2. Gerekli kütüphaneleri yükleyin
pip install fastapi uvicorn requests beautifulsoup4 pystray pillow

# 3. Uygulamayı başlatın
python tray_app.py
```

---

## 📺 OBS Studio Entegrasyonu

OBS Studio'da **Kaynaklar (Sources) -> Ekle (+) -> Tarayıcı (Browser)** seçeneğini ekleyip aşağıdaki linklerden birini yapıştırın:

| Görünüm Modu | OBS Tarayıcı URL'si | Önerilen OBS Boyutu (W x H) |
| :--- | :--- | :--- |
| **🃏 3x3 Glitch Grid (Önerilen)** | `http://127.0.0.1:8765/obs?mode=grid&season=42&lang=tr` | `500 x 500` |
| **🎞️ Kayan Kartlar (Ticker)** | `http://127.0.0.1:8765/obs?mode=ticker&season=42&lang=tr` | `1920 x 240` |
| **📊 İlerleme Banner'ı (HUD)** | `http://127.0.0.1:8765/obs?mode=banner&season=42&lang=tr` | `490 x 140` |

> 💡 **İpucu:** İngilizce dil için URL sonundaki `&lang=tr` parametresini `&lang=en` yapabilirsiniz.

---

## 📂 Proje Yapısı

```
sprites/
├── app.py                     # FastAPI web sunucusu ve API endpointleri
├── fetch_sprites.py           # Fortnite.GG scraper ve indirme motoru
├── tray_app.py                # Sistem tepsisi ve arka plan yöneticisi
├── start.bat                  # Hızlı başlatıcı (Windows)
├── FortniteSpritesTracker.exe # Bağımsız Windows çalıştırılabilir dosyası
├── data/
│   └── sprites.json           # Çekilen 153 sprite'ın veritabanı
└── static/
    ├── index.html             # Yönetim Paneli arayüzü
    ├── obs_widget.html        # OBS Tarayıcı Overlay'i
    ├── css/                   # Glitch / Cyberpunk stilleri
    ├── js/                    # Canlı senkronizasyon & widget mantığı
    └── images/                # İndirilen 153 adet yüksek çözünürlüklü .webp ikon
```

---

## 📄 Lisans
Bu proje [MIT](LICENSE) lisansı ile lisanslanmıştır. Fortnite ve ilgili tüm görseller Epic Games'e aittir.
