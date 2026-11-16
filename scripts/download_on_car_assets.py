import os
import urllib.request

DEST_DIR = r"c:\Users\thana\Desktop\ackerman-website\public\images\products"

ON_CAR_ASSETS = [
    {
        "filename": "wheel-enkei-rpf1-car.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/0/05/Enkei_RPF1_on_a_Honda_S2000.jpg"
    },
    {
        "filename": "wheel-rays-te37-car.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/f/f0/The_frontview_of_Nissan_SKYLINE_GT-R_V-spec_II_%28BNR34%29_with_TE37_wheel.JPG"
    },
    {
        "filename": "brake-brembo-car.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Brembo_Disc_brake.jpg"
    },
    {
        "filename": "brake-brembo-detail.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Ferrari_458_Italia_Brembo_Ceramic_Brake_Caliper_%2814937767662%29.jpg"
    },
    {
        "filename": "susp-coilover-installed.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/3/37/Coilovers.jpg"
    },
    {
        "filename": "tire-installed-car.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/1/12/Michelin_Pilot_Sport_Tire_on_Scion_Wheel_%2853338833448%29.jpg"
    },
    {
        "filename": "tire-racing-wheel.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Michelin_Pilot_Sport_Racing_Tire_on_Wheel.jpg"
    }
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

for item in ON_CAR_ASSETS:
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

print("On-car assets download finished.")
