import os
import urllib.request

DEST_DIR = r"c:\Users\thana\Desktop\ackerman-website\public\images\products"
os.makedirs(DEST_DIR, exist_ok=True)

ASSETS = [
    # --- 1. Enkei Wheels ---
    {
        "filename": "wheel-enkei-rpf1.jpg",
        "url": "https://enkei.com/wp-content/uploads/2019/12/ENKEI-RPF1-SP-144-WEB.jpg"
    },
    {
        "filename": "wheel-enkei-pf07.jpg",
        "url": "https://enkei.com/wp-content/uploads/2019/12/ENKEI-PF07-DS-146-WEB.jpg"
    },
    {
        "filename": "wheel-enkei-pf05.jpg",
        "url": "https://enkei.com/wp-content/uploads/2019/12/PF05-DS-1.jpg"
    },
    {
        "filename": "wheel-enkei-nt03rr.jpg",
        "url": "https://enkei.com/wp-content/uploads/2019/12/ENKEI-NT03RR-GM-191-WEB.jpg"
    },
    {
        "filename": "wheel-enkei-gtc02.jpg",
        "url": "https://enkei.com/wp-content/uploads/2019/12/ENKEI-WHEELS-gtc02-hyper-silver-side-2.jpg"
    },
    # --- 2. RAYS Volk Racing Wheels ---
    {
        "filename": "wheel-rays-te37.jpg",
        "url": "https://www.rayswheels.co.jp/lacne/news/upload/wheel/TE37-30th_SAGA-SP_BR_189545-5-120.jpg"
    },
    # --- 3. BBS Wheels ---
    {
        "filename": "wheel-bbs-lm.jpg",
        "url": "https://bbs-japan.co.jp/en/wp-content/uploads/sites/2/2016/10/newLM.jpg"
    },
    {
        "filename": "wheel-bbs-fir.jpg",
        "url": "https://bbs-japan.co.jp/en/wp-content/uploads/sites/2/2017/07/newFI-R.jpg"
    },
    # --- 4. Brakes ---
    {
        "filename": "brake-brembo-gt6.jpg",
        "url": "https://www.racetechnologies.com/cdn/shop/files/street.jpg"
    },
    {
        "filename": "brake-brembo-car.jpg",
        "url": "https://i0.wp.com/blog.racetechnologies.com/wp-content/uploads/2015/07/brembo-volk_cutaway-1.jpg"
    },
    {
        "filename": "brake-brembo-detail.jpg",
        "url": "https://www.racetechnologies.com/cdn/shop/files/Categories_Auto_Systems_1.jpg"
    },
    # --- 5. Suspension ---
    {
        "filename": "susp-bilstein-b16.jpg",
        "url": "https://www.bilstein-shop.com/media/5c/42/99/1721849284/bilstein_b16_coilover.jpg"
    },
    {
        "filename": "susp-kw-v3.png",
        "url": "http://res.cloudinary.com/dsahg7sfz/image/upload/v1736851832/352200AL_005_zrlz0o.png"
    },
    {
        "filename": "susp-tein-rx1.jpg",
        "url": "https://www.tein.co.jp/wp/wp-content/uploads/2025/11/RX1-1.jpg"
    },
    # --- 6. Engine Oil ---
    {
        "filename": "oil-motul-300v.png",
        "url": "https://azupim01.motul.com/media/motulData/IM/bigweb/Motul_110813_300V_POWER_0W-20_2L_png.png"
    },
    # --- 7. Clean Tire Studio ---
    {
        "filename": "tire-michelin-ps5.webp",
        "url": "https://dxm.contentcenter.michelin.com/api/wedia/dam/transform/b98rpyxf61b4xcey3tp75nbgww/4w-986_3528709222846_tire_michelin_pilot-sport-5_225-slash-40-zr18-92y-xl_a_main_1-30_nopad.webp"
    }
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
}

for item in ASSETS:
    dest_path = os.path.join(DEST_DIR, item["filename"])
    print(f"Downloading {item['filename']}...")
    try:
        req = urllib.request.Request(item["url"], headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            with open(dest_path, "wb") as f:
                f.write(content)
        print(f"  [OK] Saved {item['filename']} ({len(content)} bytes)")
    except Exception as e:
        print(f"  [ERROR] {item['filename']}: {e}")

print("\nAsset download finished.")
