import os
import json
import sys
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import fetch_sprites

# Determine runtime directory (Handles both PyInstaller frozen mode and normal script mode)
if getattr(sys, 'frozen', False):
    BUNDLE_DIR = sys._MEIPASS
    APP_DIR = os.path.dirname(sys.executable)
else:
    BUNDLE_DIR = os.path.dirname(os.path.abspath(__file__))
    APP_DIR = BUNDLE_DIR

STATIC_DIR = os.path.join(BUNDLE_DIR, "static")
if not os.path.exists(STATIC_DIR):
    STATIC_DIR = os.path.join(APP_DIR, "static")

# Writable data directory next to the exe
DATA_DIR = os.path.join(APP_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

SPRITES_JSON_BUNDLE = os.path.join(BUNDLE_DIR, "data", "sprites.json")
SPRITES_JSON = os.path.join(DATA_DIR, "sprites.json")
STATE_JSON = os.path.join(DATA_DIR, "user_state.json")

# Ensure sprites.json is available in writable data dir if not already present
if not os.path.exists(SPRITES_JSON) and os.path.exists(SPRITES_JSON_BUNDLE):
    try:
        import shutil
        shutil.copyfile(SPRITES_JSON_BUNDLE, SPRITES_JSON)
    except Exception:
        pass

# Ensure state file exists
if not os.path.exists(STATE_JSON):
    with open(STATE_JSON, "w", encoding="utf-8") as f:
        json.dump({"owned": [], "mastered": []}, f, indent=2)

app = FastAPI(title="Fortnite Sprites OBS Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/", response_class=FileResponse)
async def read_index():
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))

@app.get("/obs", response_class=FileResponse)
async def read_obs():
    return FileResponse(os.path.join(STATIC_DIR, "obs_widget.html"))

@app.get("/api/sprites")
async def get_sprites():
    target_json = SPRITES_JSON if os.path.exists(SPRITES_JSON) else SPRITES_JSON_BUNDLE
    if not os.path.exists(target_json):
        return JSONResponse(status_code=404, content={"error": "sprites.json not found"})
    with open(target_json, "r", encoding="utf-8") as f:
        sprites = json.load(f)
    return sprites

@app.get("/api/state")
async def get_state():
    if os.path.exists(STATE_JSON):
        try:
            with open(STATE_JSON, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"owned": [], "mastered": []}

@app.post("/api/state")
async def save_state(request: Request):
    data = await request.json()
    owned = list(set(data.get("owned", [])))
    mastered = list(set(data.get("mastered", [])))
    
    state = {
        "owned": owned,
        "mastered": mastered,
        "updated_at": data.get("updated_at")
    }
    with open(STATE_JSON, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)
    return {"status": "ok", "count_owned": len(owned), "count_mastered": len(mastered)}

@app.post("/api/refresh")
async def refresh_sprites():
    try:
        images_dir = os.path.join(STATIC_DIR, "images")
        count, msg = fetch_sprites.scrape_and_save(DATA_DIR, images_dir)
        return {
            "status": "success",
            "message": f"Successfully updated {count} sprites from Fortnite.GG!",
            "count": count
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

PORT = int(os.environ.get("PORT", 8765))

if __name__ == "__main__":
    print(f"[*] Starting Fortnite Sprites Tracker Server on http://127.0.0.1:{PORT}")
    uvicorn.run(app, host="127.0.0.1", port=PORT, log_level="info")
