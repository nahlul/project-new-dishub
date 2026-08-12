"""
Parse the raw Trans Koetaradja route TXT into per-route halte JSON files.

Fixes the "scrambled halte" problem by ordering haltes according to the clean
SKEMA (travel order per direction) and attaching each halte's schedule from the
DETAIL section via normalized fuzzy matching.

Run:
    python parse_routes.py

Outputs halte_<id>.json into the parent data/ directory and prints a
match-quality report so unmatched entries can be verified.
"""
import json
import re
import difflib
from pathlib import Path

SRC = Path(__file__).parent / "rute_terbaru.txt"
OUT_DIR = Path(__file__).parent.parent  # backend/data

# Map koridor-title keywords -> route id used in routes_meta.json.
# Order matters: more specific titles must be checked before generic keywords
# (e.g. Trans Kampus title contains "KOPELMA DARUSSALAM", so KAMPUS wins first).
ROUTE_ID_RULES = [
    ("KAMPUS", "campus"),
    ("ULEE LHEUE", "ulee-lheue"),
    ("ULEE KARENG", "ulee-kareng"),
    ("MEUDIWANA", "meudiwana"),
    ("MATA IE 2", "mata-ie-2"),
    ("MATA IE 1", "mata-ie-1"),
    ("MALAHAYATI", "malahayati"),
    ("LAMBARO", "lambaro"),
    ("DARUSSALAM", "darussalam"),
    ("BLANG BINTANG", "blang-bintang"),
]

DAY_KEYS = [
    (re.compile(r"^senin", re.I), "senin_kamis"),
    (re.compile(r"^jum", re.I), "jumat"),
    (re.compile(r"^sabtu\s*[-&]\s*minggu", re.I), "sabtu_minggu"),
    (re.compile(r"^sabtu$", re.I), "sabtu"),
    (re.compile(r"^minggu$", re.I), "minggu"),
]

TIME_RE = re.compile(r"\b(\d{1,2}:\d{2})\b")


def route_id_for(title: str) -> str | None:
    up = title.upper()
    for kw, rid in ROUTE_ID_RULES:
        if kw in up:
            return rid
    return None


def day_key(label: str) -> str | None:
    lab = label.strip().rstrip(":").strip()
    for rx, key in DAY_KEYS:
        if rx.match(lab):
            return key
    return None


# Words / tokens dropped when normalizing a halte name for matching.
DROP_WORDS = {
    "HALTE", "SHELTER", "PORTABEL", "PORTABLE", "TITIK", "KEBERANGKATAN",
    "UTAMA", "ARAH", "DEPAN", "KE",
}
EXPAND = {
    "SP": "SIMPANG",
    "SP.": "SIMPANG",
    "GP": "GAMPONG",
    "GP.": "GAMPONG",
    "MNS": "MEUNASAH",
    "FAK": "FAKULTAS",
    "FAK.": "FAKULTAS",
    "MAHAKAMAH": "MAHKAMAH",
}


def normalize(name: str) -> str:
    # Drop only *direction-note* parentheticals (Arah.../Titik.../with arrows);
    # keep other parentheticals since they often carry an alias, e.g. "(KBJ 2)".
    def _strip_note(m):
        inner = m.group(1).upper()
        if "ARAH" in inner or "TITIK" in inner or "->" in inner or "PERHENTIAN" in inner:
            return " "
        return " " + m.group(1) + " "
    n = re.sub(r"\((.*?)\)", _strip_note, name)
    n = n.upper()
    n = re.sub(r"[^A-Z0-9\s.]", " ", n)
    tokens = []
    for tok in n.split():
        tok = EXPAND.get(tok, tok)
        if tok in DROP_WORDS:
            continue
        tokens.append(tok)
    return " ".join(tokens).strip()


def token_match(a_norm: str, b_norm: str) -> bool:
    """True if the two normalized names likely refer to the same halte.

    Requires any numeric suffix tokens to agree (so "Mata Ie 1" != "Mata Ie 2")
    and the smaller token set to be a subset of the larger.
    """
    a, b = set(a_norm.split()), set(b_norm.split())
    if not a or not b:
        return False
    da = {t for t in a if t.isdigit()}
    db = {t for t in b if t.isdigit()}
    if da and db and da != db:
        return False
    small, big = (a, b) if len(a) <= len(b) else (b, a)
    return small.issubset(big)


def clean_name(name: str) -> str:
    """Human-facing halte name: strip the parenthetical direction notes."""
    n = re.sub(r"\s*\(.*?\)\s*", "", name).strip()
    return n


def split_routes(text: str):
    """Yield (title, body) per route based on the KORIDOR title line."""
    lines = text.splitlines()
    title_idxs = [i for i, l in enumerate(lines)
                  if "KORIDOR" in l.upper() and "RUTE & JADWAL" in l.upper()]
    for k, start in enumerate(title_idxs):
        end = title_idxs[k + 1] if k + 1 < len(title_idxs) else len(lines)
        title = lines[start]
        m = re.search(r"\((.*?)\)", title)
        title_clean = m.group(1) if m else title
        yield title_clean, "\n".join(lines[start:end])


def parse_skema(body: str):
    """Return list of (arah_label, [halte names in order]).

    Loop routes (no 'Arah') return a single group labeled 'Loop'.
    """
    lines = body.splitlines()
    # find SKEMA block bounds
    try:
        s = next(i for i, l in enumerate(lines) if "SKEMA RUTE" in l.upper())
    except StopIteration:
        return []
    try:
        e = next(i for i, l in enumerate(lines)
                 if i > s and "DETAIL JADWAL" in l.upper())
    except StopIteration:
        e = len(lines)
    block = lines[s:e]

    groups = []
    cur_label = None
    cur = []
    arah_re = re.compile(r"^Arah\s*\d+\s*:\s*(.+)$", re.I)
    item_re = re.compile(r"^\s*\d+\.\s*(.+?)\s*$")

    def flush():
        nonlocal cur, cur_label
        if cur:
            groups.append((cur_label, cur))
        cur = []

    for l in block:
        am = arah_re.match(l.strip())
        if am:
            flush()
            cur_label = am.group(1).strip()
            continue
        im = item_re.match(l)
        if im and not l.strip().upper().startswith("ARAH"):
            cur.append(im.group(1).strip())
    flush()

    if not groups:
        return []
    # loop route: single unnamed group
    if len(groups) == 1 and groups[0][0] is None:
        return [("Loop", groups[0][1])]
    return [(lbl or "", items) for lbl, items in groups]


def parse_detail(body: str):
    """Return list of dicts: {name, jadwal:{day:[times]}} in file order."""
    lines = body.splitlines()
    try:
        s = next(i for i, l in enumerate(lines) if "DETAIL JADWAL" in l.upper())
    except StopIteration:
        return []
    block = lines[s:]

    entries = []
    cur = None
    cur_day = None
    entry_re = re.compile(r"^\s*\d+\.\s+([A-Za-z].+?)\s*$")

    for l in block:
        if set(l.strip()) <= {"-", "="} and l.strip():
            continue
        em = entry_re.match(l)
        if em and day_key(l) is None:
            # New halte entry header
            if cur:
                entries.append(cur)
            cur = {"name": em.group(1).strip(), "jadwal": {}}
            cur_day = None
            continue
        if cur is None:
            continue
        dk = day_key(l)
        if dk is not None:
            cur_day = dk
            cur["jadwal"].setdefault(dk, [])
            # times may also share the label line
            for t in TIME_RE.findall(l):
                cur["jadwal"][cur_day].append(t)
            continue
        if cur_day is not None:
            found = TIME_RE.findall(l)
            if found:
                cur["jadwal"][cur_day].extend(found)
    if cur:
        entries.append(cur)
    return entries


def build_route(title: str, body: str):
    rid = route_id_for(title)
    skema = parse_skema(body)
    detail = parse_detail(body)

    # index detail by normalized name for matching
    norm_index = {}
    for d in detail:
        norm_index.setdefault(normalize(d["name"]), d)
    norm_keys = list(norm_index.keys())

    used = set()
    haltes = []
    unmatched = []

    for arah_label, names in skema:
        for nm in names:
            norm = normalize(nm)
            match = None
            if norm in norm_index:
                match = norm_index[norm]
            else:
                # token-subset match (respects numeric suffixes); a detail entry
                # may serve the same halte in both directions, so no used-filter.
                for cand in norm_keys:
                    if token_match(norm, cand):
                        match = norm_index[cand]
                        break
                if match is None:
                    close = difflib.get_close_matches(norm, norm_keys, n=1, cutoff=0.72)
                    if close:
                        match = norm_index[close[0]]
            jadwal = {}
            if match:
                jadwal = match["jadwal"]
                used.add(normalize(match["name"]))
            else:
                unmatched.append((rid, nm))
            haltes.append({
                "nama": clean_name(nm),
                "arah": arah_label,
                "jadwal": jadwal,
            })

    # append detail entries never referenced by skema (so no data is lost)
    leftover = [d for d in detail if normalize(d["name"]) not in used]
    return rid, title, haltes, unmatched, leftover


def main():
    text = SRC.read_text(encoding="utf-8", errors="replace")
    report = []
    for title, body in split_routes(text):
        rid, ttl, haltes, unmatched, leftover = build_route(title, body)
        if not rid:
            report.append(f"!! No route id for title: {title}")
            continue
        out = OUT_DIR / f"halte_{rid.replace('-', '_')}.json"
        out.write_text(json.dumps(haltes, ensure_ascii=False, indent=2), encoding="utf-8")
        report.append(f"[{rid}] haltes={len(haltes)} unmatched={len(unmatched)} leftover_detail={len(leftover)} -> {out.name}")
        for _, nm in unmatched:
            report.append(f"    UNMATCHED skema halte (no schedule): {nm}")
        for d in leftover:
            report.append(f"    LEFTOVER detail (not in skema): {d['name']}")
    print("\n".join(report))


if __name__ == "__main__":
    main()
