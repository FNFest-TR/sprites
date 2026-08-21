import os
import sys
import multiprocessing

if __name__ == "__main__":
    multiprocessing.freeze_support()

if sys.stdout is None:
    sys.stdout = open(os.devnull, "w")
if sys.stderr is None:
    sys.stderr = open(os.devnull, "w")

LOG_FILE = os.path.join(os.path.dirname(sys.executable if getattr(sys, 'frozen', False) else __file__), "server_log.txt")

def log(msg):
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(f"{msg}\n")
    except Exception:
        pass

log("=== Starting Fortnite Sprites Tracker ===")

try:
    import threading
    import webbrowser
    import time
    import uvicorn
    import pystray
    from PIL import Image, ImageDraw

    if getattr(sys, 'frozen', False):
        BUNDLE_DIR = sys._MEIPASS
        APP_DIR = os.path.dirname(sys.executable)
    else:
        BUNDLE_DIR = os.path.dirname(os.path.abspath(__file__))
        APP_DIR = BUNDLE_DIR

    STATIC_DIR = os.path.join(BUNDLE_DIR, "static")
    IMAGES_DIR = os.path.join(STATIC_DIR, "images")

    from app import app, PORT, DATA_DIR
    import fetch_sprites

    server = None
    tray = None

    def get_tray_icon():
        icon_path = os.path.join(IMAGES_DIR, "T_Icon_BR_Creature_Sprite_JazzJackrabbit_L.webp")
        if os.path.exists(icon_path):
            try:
                img = Image.open(icon_path).convert("RGBA")
                img = img.resize((64, 64), Image.Resampling.LANCZOS)
                return img
            except Exception as e:
                log(f"Icon load error: {e}")
        image = Image.new("RGBA", (64, 64), (14, 18, 24, 255))
        draw = ImageDraw.Draw(image)
        draw.rounded_rectangle([4, 4, 60, 60], radius=12, fill=(46, 204, 113, 255))
        draw.polygon([(32, 10), (18, 36), (28, 36), (24, 54), (46, 26), (36, 26)], fill=(255, 255, 255, 255))
        return image

    def open_dashboard(icon=None, item=None):
        webbrowser.open(f"http://127.0.0.1:{PORT}")

    def open_obs_widget(icon=None, item=None):
        webbrowser.open(f"http://127.0.0.1:{PORT}/obs?mode=grid&season=42&lang=tr")

    def exit_app(icon=None, item=None):
        log("Exiting application...")
        if server:
            server.should_exit = True
        if tray:
            tray.stop()
        os._exit(0)

    def launch_browser():
        time.sleep(1.0)
        open_dashboard()

    def background_auto_sync():
        """Silently syncs with Fortnite.GG in the background on startup"""
        try:
            time.sleep(4.0)
            log("Running background auto-sync from Fortnite.GG...")
            images_dir = os.path.join(STATIC_DIR, "images")
            count, msg = fetch_sprites.scrape_and_save(DATA_DIR, images_dir)
            log(f"Background auto-sync complete: {count} sprites.")
        except Exception as e:
            log(f"Background auto-sync error (ignoring): {e}")

    def run_tray():
        global tray
        try:
            icon_image = get_tray_icon()
            menu = pystray.Menu(
                pystray.MenuItem("⚡ Fortnite Sprites Tracker", open_dashboard, default=True),
                pystray.Menu.SEPARATOR,
                pystray.MenuItem("🌐 Yönetim Panelini Aç (Open Dashboard)", open_dashboard),
                pystray.MenuItem("📺 OBS 3x3 Widget Aç (Open OBS Widget)", open_obs_widget),
                pystray.Menu.SEPARATOR,
                pystray.MenuItem("❌ Çıkış (Exit)", exit_app)
            )
            tray = pystray.Icon("FortniteSpritesTracker", icon_image, "Fortnite Sprites Tracker", menu)
            log("Pystray loop running in background thread...")
            tray.run()
        except Exception as e:
            log(f"Tray error (ignoring and keeping server alive): {e}")

    def main():
        global server
        # Start tray in thread
        t_tray = threading.Thread(target=run_tray, daemon=True)
        t_tray.start()

        # Launch browser in thread
        t_browser = threading.Thread(target=launch_browser, daemon=True)
        t_browser.start()

        # Background auto-sync thread
        t_sync = threading.Thread(target=background_auto_sync, daemon=True)
        t_sync.start()

        # RUN UVICORN IN MAIN THREAD
        config = uvicorn.Config(
            app=app,
            host="127.0.0.1",
            port=PORT,
            log_config=None,
            loop="asyncio",
            http="h11"
        )
        server = uvicorn.Server(config)
        log("Uvicorn running in main thread on 127.0.0.1:8765...")
        server.run()

except Exception as e:
    log(f"Fatal Startup Error: {e}")
    import traceback
    log(traceback.format_exc())

if __name__ == "__main__":
    main()
