import os
import re
import json
import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
STATIC_DIR = os.path.join(BASE_DIR, "static")
IMAGES_DIR = os.path.join(STATIC_DIR, "images")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://fortnite.gg/",
}

def fetch_html():
    url = "https://fortnite.gg/sprites"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            return resp.text
    except Exception as e:
        print(f"[-] Fetch error: {e}")
    
    local_page = os.path.join(BASE_DIR, "page.html")
    if os.path.exists(local_page):
        with open(local_page, "r", encoding="utf-8") as f:
            return f.read()
    return None

def parse_sprites(html):
    soup = BeautifulSoup(html, "html.parser")
    cards = soup.find_all(class_="sprite-card")
    sprites = []
    
    for card in cards:
        sprite_id = card.get("data-sprite")
        parent = card.get("data-parent", "")
        rarity = card.get("data-rarity", "common")
        variant = card.get("data-variant", "base")
        season = card.get("data-season", "")
        unreleased = card.get("data-unreleased") == "1"
        
        name_el = card.find(class_="sprite-name")
        name = name_el.get_text(strip=True) if name_el else f"Sprite {sprite_id}"
        
        pills = [p.get_text(strip=True) for p in card.find_all(class_="sprite-pill")]
        drop_chance = ""
        for p in pills:
            if "%" in p:
                drop_chance = p
        
        img_el = card.find("img")
        img_src = ""
        if img_el:
            img_src = img_el.get("src") or img_el.get("data-src") or ""
            
        if not img_src:
            art_div = card.find(class_="sprite-art")
            if art_div:
                style = art_div.get("style", "")
                if "url(" in style:
                    img_src = style.split("url(")[1].split(")")[0].strip("'\"")
                    
        if img_src.startswith("/"):
            remote_img_url = "https://fortnite.gg" + img_src
        elif img_src.startswith("http"):
            remote_img_url = img_src
        else:
            remote_img_url = "https://fortnite.gg/" + img_src
            
        filename = os.path.basename(img_src.split("?")[0]) if img_src else f"sprite_{sprite_id}.webp"
        if not filename.endswith(('.webp', '.png', '.jpg', '.jpeg')):
            filename = f"sprite_{sprite_id}.webp"
            
        local_img_path = f"images/{filename}"
        
        sprites.append({
            "id": sprite_id,
            "name": name,
            "parent": parent,
            "rarity": rarity.lower(),
            "variant": variant.lower(),
            "season": season,
            "unreleased": unreleased,
            "drop_chance": drop_chance,
            "pills": pills,
            "image_url": remote_img_url,
            "image_local": local_img_path,
            "filename": filename,
        })
        
    return sprites

def download_image_to(sprite, target_images_dir):
    filename = sprite["filename"]
    save_path = os.path.join(target_images_dir, filename)
    
    if os.path.exists(save_path) and os.path.getsize(save_path) > 0:
        return True
        
    url = sprite["image_url"]
    if not url or not url.startswith("http"):
        return False
        
    try:
        r = requests.get(url, headers=HEADERS, timeout=10)
        if r.status_code == 200:
            with open(save_path, "wb") as f:
                f.write(r.content)
            return True
    except Exception:
        pass
    return False

def scrape_and_save(target_data_dir=None, target_images_dir=None):
    if not target_data_dir:
        target_data_dir = DATA_DIR
    if not target_images_dir:
        target_images_dir = IMAGES_DIR
        
    os.makedirs(target_data_dir, exist_ok=True)
    os.makedirs(target_images_dir, exist_ok=True)
    
    html = fetch_html()
    if not html:
        raise ValueError("Could not retrieve HTML from fortnite.gg")
        
    sprites = parse_sprites(html)
    if not sprites:
        raise ValueError("No sprites found on page")
        
    # Save sprites.json
    json_path = os.path.join(target_data_dir, "sprites.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(sprites, f, ensure_ascii=False, indent=2)
        
    # Download missing images in parallel
    with ThreadPoolExecutor(max_workers=8) as executor:
        list(executor.map(lambda s: download_image_to(s, target_images_dir), sprites))
        
    return len(sprites), f"Successfully updated {len(sprites)} sprites"

def main():
    count, msg = scrape_and_save()
    print(f"[+] {msg}")

if __name__ == "__main__":
    main()
