"""
Inject approximate lat/lng into each halte entry.

Strategy (best-effort, correct later):
  1. ANCHORS holds real Banda Aceh / Aceh Besar landmark coordinates keyed by a
     normalized-name substring.
  2. For each route file, haltes are walked in listed order. Any halte whose
     normalized name contains an anchor key is pinned to that anchor.
  3. Remaining haltes are linearly interpolated between the surrounding pinned
     anchors (endpoints extrapolate from the nearest single anchor).
  4. Coordinates are written back into each halte as "lat"/"lng", and a merged
     halte_coords.json is emitted for later manual correction.

Run:  python add_coords.py
"""
import json
import glob
import re
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent  # backend/data

# key (normalized substring) -> (lat, lng). Approximate; verify later.
ANCHORS = {
    "MASJID RAYA BAITURRAHMAN": (5.5544, 95.3175),
    "PASAR ACEH": (5.5556, 95.3155),
    "KEUDAH": (5.5763, 95.3132),
    "PEUNAYONG": (5.5620, 95.3200),
    "SIMPANG LIMA": (5.5540, 95.3220),
    "SIMPANG KERAMAT": (5.5588, 95.3268),
    "SIMPANG KEURAMAT": (5.5588, 95.3268),
    "JAMBO TAPE": (5.5560, 95.3325),
    "SIMPANG SURABAYA": (5.5478, 95.3308),
    "LUENG BATA": (5.5410, 95.3350),
    "BATOH": (5.5320, 95.3350),
    "SIMPANG MESRA": (5.5730, 95.3560),
    "LAMNYONG": (5.5715, 95.3600),
    "RSUZA": (5.5665, 95.3470),
    "KANTOR GUBERNUR": (5.5620, 95.3420),
    "LINGKE": (5.5640, 95.3470),
    "PRADA": (5.5690, 95.3520),
    "MASJID JAMIK": (5.5745, 95.3695),
    "UIN": (5.5710, 95.3670),
    "EKONOMI": (5.5755, 95.3705),
    "ASRAMA USK": (5.5780, 95.3690),
    "RUKOH": (5.5760, 95.3720),
    "ULEE KARENG": (5.5610, 95.3480),
    "BEURAWE": (5.5620, 95.3350),
    "BPKP": (5.5590, 95.3520),
    "KESDAM": (5.5600, 95.3300),
    "HERMES": (5.5640, 95.3390),
    "PELABUHAN ULEE LHEUE": (5.5606, 95.2939),
    "BARATA": (5.5545, 95.3095),
    "MUSEUM TSUNAMI": (5.5490, 95.3170),
    "BLANG PADANG": (5.5500, 95.3150),
    "PUNGE": (5.5560, 95.3010),
    "BLANG OI": (5.5590, 95.2980),
    "LAMBUNG": (5.5580, 95.2920),
    "BANDARA SIM": (5.5232, 95.4204),
    "GAMPONG BLANG": (5.5210, 95.4130),
    "BLANG BINTANG": (5.5180, 95.4110),
    "MODAL BANGSA": (5.5210, 95.3980),
    "SIRON": (5.5220, 95.3700),
    "LAMBARO": (5.5169, 95.3480),
    "COT IRI": (5.5480, 95.3820),
    "KRUENG BARONA JAYA": (5.5500, 95.3720),
    "LAM ATEUK": (5.5350, 95.3950),
    "BUENG CALA": (5.5300, 95.4050),
    "MATA IE": (5.4870, 95.3300),
    "DARUL IMARAH": (5.5030, 95.3260),
    "KEUTAPANG": (5.5170, 95.3210),
    "LHONG RAYA": (5.5280, 95.3120),
    "NEUSU": (5.5450, 95.3160),
    "TVRI": (5.5100, 95.3230),
    "MEURAXA": (5.5150, 95.3050),
    "SEUTUI": (5.5470, 95.3110),
    "GUNONGAN": (5.5510, 95.3130),
    "TAMAN BUDAYA": (5.5520, 95.3140),
    "TEUKU UMAR": (5.5440, 95.3080),
    "LAMTEUMEN": (5.5470, 95.2990),
    "AJUN": (5.5350, 95.2850),
    "SIMPANG RIMA": (5.5250, 95.2750),
    "LAMPISANG": (5.5100, 95.2650),
    "TANJONG": (5.5000, 95.2600),
    "LHOKNGA": (5.4680, 95.2540),
    "LAMPUUK": (5.4790, 95.2470),
    "SP. MESRA": (5.5960, 95.3900),
    "GEDUNG AMANAH": (5.6050, 95.4350),
    "LADONG": (5.6050, 95.4350),
    "KAJHU": (5.5850, 95.3720),
    "CADEK": (5.5900, 95.3800),
    "COT PAYA": (5.5920, 95.3950),
    "BAITUSSALAM": (5.5930, 95.4000),
    "LABUY": (5.5960, 95.4100),
    "LAMNGA": (5.5990, 95.4180),
    "NEUHEUN": (5.6010, 95.4250),
    "SAMSAT": (5.5420, 95.3050),
    "DODIK": (5.5380, 95.2950),
    "SANTAN": (5.5250, 95.3550),
    "PAGAR AIR": (5.5300, 95.3450),
    "PANTERIEK": (5.5460, 95.3300),
    "FLYOVER": (5.5490, 95.3280),
    "PEUNITI": (5.5510, 95.3210),
    "FAKINAH": (5.5430, 95.3020),
    "GEUCEU": (5.5430, 95.3020),
    "ASRAMA TNI": (5.5300, 95.3150),
    "KIERKHOF": (5.5510, 95.3175),
    "MUSEUM ACEH": (5.5525, 95.3160),
    "SP. SEULAWAH": (5.5480, 95.3095),
    "SD 56": (5.5560, 95.3430),
    "MOORDEN": (5.5615, 95.3345),
    "PT DJARUM": (5.5540, 95.3600),
    "BABAH JURONG": (5.5510, 95.3780),
    "ABULYATAMA": (5.5400, 95.3880),
    "PESANTREN DAYAH": (5.5350, 95.3920),
    "MEULIGOE KUPI": (5.5350, 95.3120),
}

# order longest-key-first so specific names win over generic substrings
ANCHOR_ITEMS = sorted(ANCHORS.items(), key=lambda kv: -len(kv[0]))


def normalize(name: str) -> str:
    n = re.sub(r"\(.*?\)", " ", name).upper()
    n = re.sub(r"[^A-Z0-9\s.]", " ", n)
    return re.sub(r"\s+", " ", n).strip()


def anchor_for(name: str):
    norm = normalize(name)
    for key, coord in ANCHOR_ITEMS:
        if key in norm:
            return coord
    return None


def interpolate(haltes):
    n = len(haltes)
    pins = {}  # index -> (lat,lng)
    for i, h in enumerate(haltes):
        c = anchor_for(h["nama"])
        if c:
            pins[i] = c
    if not pins:
        return  # nothing to anchor to; leave without coords
    pin_idx = sorted(pins)

    for i in range(n):
        if i in pins:
            haltes[i]["lat"], haltes[i]["lng"] = pins[i]
            continue
        # find surrounding pins
        prev = max((p for p in pin_idx if p < i), default=None)
        nxt = min((p for p in pin_idx if p > i), default=None)
        if prev is not None and nxt is not None:
            t = (i - prev) / (nxt - prev)
            la = pins[prev][0] + (pins[nxt][0] - pins[prev][0]) * t
            lo = pins[prev][1] + (pins[nxt][1] - pins[prev][1]) * t
        elif prev is not None:
            la, lo = pins[prev]
        else:
            la, lo = pins[nxt]
        # tiny offset so interpolated stops are not exactly identical
        haltes[i]["lat"] = round(la + (i % 3) * 0.00012, 6)
        haltes[i]["lng"] = round(lo + (i % 2) * 0.00012, 6)
    for i in pins:
        haltes[i]["lat"] = round(haltes[i]["lat"], 6)
        haltes[i]["lng"] = round(haltes[i]["lng"], 6)


def main():
    merged = {}
    exact = 0
    total = 0
    for f in sorted(glob.glob(str(DATA_DIR / "halte_*.json"))):
        haltes = json.load(open(f, encoding="utf-8"))
        for h in haltes:
            if anchor_for(h["nama"]):
                exact += 1
            total += 1
        interpolate(haltes)
        json.dump(haltes, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
        for h in haltes:
            if "lat" in h:
                merged.setdefault(h["nama"], [h["lat"], h["lng"]])
    coords_path = DATA_DIR / "halte_coords.json"
    json.dump(merged, open(coords_path, "w", encoding="utf-8"),
              ensure_ascii=False, indent=2, sort_keys=True)
    print(f"halte entries: {total}, anchor-matched: {exact}, "
          f"interpolated: {total - exact}")
    print(f"unique coords written: {len(merged)} -> {coords_path.name}")


if __name__ == "__main__":
    main()
