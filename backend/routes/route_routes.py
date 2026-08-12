from fastapi import APIRouter, HTTPException, Depends, Request, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from math import radians, sin, cos, asin, sqrt
import logging
import httpx

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/routes", tags=["routes"])

# Rough bounding box for Banda Aceh / Aceh Besar to bias geocoding results.
ACEH_VIEWBOX = "95.20,5.65,95.45,5.45"  # left,top,right,bottom (lon,lat)


async def get_db(request: Request) -> AsyncIOMotorDatabase:
    return request.app.state.db


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Great-circle distance between two points in kilometers."""
    r = 6371.0
    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2
    return 2 * r * asin(sqrt(a))


async def _all_routes(db) -> list:
    return await db.bus_routes.find({}, {"_id": 0}).to_list(100)


def _iter_haltes(routes):
    """Yield (route, halte) for every halte that has coordinates."""
    for route in routes:
        for halte in route.get("halte", []):
            if "lat" in halte and "lng" in halte:
                yield route, halte


@router.get("/")
async def get_all_routes(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all route names and basic info"""
    try:
        routes = await db.bus_routes.find({}, {"_id": 0, "halte": 0}).to_list(100)
        return routes
    except Exception as e:
        logger.error(f"Get routes error: {e}")
        return []


@router.get("/search")
async def search_halte(q: str = "", db: AsyncIOMotorDatabase = Depends(get_db)):
    """Search halte by name across all routes"""
    try:
        if not q or len(q) < 1:
            return []
        
        # Search in all routes for matching halte names
        routes = await db.bus_routes.find({}, {"_id": 0}).to_list(100)
        results = []
        
        for route in routes:
            for halte in route.get("halte", []):
                if q.lower() in halte["nama"].lower():
                    results.append({
                        "halte_nama": halte["nama"],
                        "halte_arah": halte.get("arah", ""),
                        "route_id": route["id"],
                        "route_nama": route["nama"],
                        "jadwal": halte.get("jadwal", {}),
                    })
        
        return results[:20]  # Limit to 20 results
    except Exception as e:
        logger.error(f"Search halte error: {e}")
        return []


@router.get("/haltes")
async def get_all_haltes(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Flat list of every halte across all routes (deduplicated by name).

    Each entry aggregates which routes serve the halte plus its coordinates,
    for the Halte directory page.
    """
    try:
        routes = await _all_routes(db)
        by_name: dict = {}
        for route in routes:
            for halte in route.get("halte", []):
                key = halte["nama"].strip().lower()
                entry = by_name.get(key)
                if not entry:
                    entry = {
                        "nama": halte["nama"],
                        "lat": halte.get("lat"),
                        "lng": halte.get("lng"),
                        "routes": [],
                    }
                    by_name[key] = entry
                entry["routes"].append({
                    "route_id": route["id"],
                    "route_nama": route["nama"],
                    "route_warna": route.get("warna", "#0284c7"),
                    "arah": halte.get("arah", ""),
                    "jadwal": halte.get("jadwal", {}),
                })
        return sorted(by_name.values(), key=lambda h: h["nama"])
    except Exception as e:
        logger.error(f"Get all haltes error: {e}")
        return []


@router.get("/nearest")
async def nearest_haltes(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    limit: int = Query(5, ge=1, le=20),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Find the haltes nearest to a user position, ordered by distance."""
    try:
        routes = await _all_routes(db)
        seen: dict = {}
        for route, halte in _iter_haltes(routes):
            dist = haversine_km(lat, lng, halte["lat"], halte["lng"])
            key = halte["nama"].strip().lower()
            existing = seen.get(key)
            if existing and existing["distance_km"] <= dist:
                # keep nearest instance; still record the extra route
                existing["routes"].append({
                    "route_id": route["id"],
                    "route_nama": route["nama"],
                    "route_warna": route.get("warna", "#0284c7"),
                })
                continue
            routes_list = existing["routes"] if existing else []
            routes_list.append({
                "route_id": route["id"],
                "route_nama": route["nama"],
                "route_warna": route.get("warna", "#0284c7"),
            })
            seen[key] = {
                "nama": halte["nama"],
                "arah": halte.get("arah", ""),
                "lat": halte["lat"],
                "lng": halte["lng"],
                "distance_km": round(dist, 3),
                "jadwal": halte.get("jadwal", {}),
                "routes": routes_list,
            }
        results = sorted(seen.values(), key=lambda h: h["distance_km"])
        return results[:limit]
    except Exception as e:
        logger.error(f"Nearest haltes error: {e}")
        raise HTTPException(status_code=500, detail="Failed to find nearest haltes")


@router.get("/geocode")
async def geocode(q: str = Query(..., min_length=2)):
    """Geocode a destination name to coordinates, biased to Banda Aceh.

    Proxied server-side through OpenStreetMap Nominatim so the browser does not
    call the third-party service directly and we can set a proper User-Agent.
    """
    try:
        params = {
            "q": f"{q}, Banda Aceh, Aceh, Indonesia",
            "format": "json",
            "limit": 5,
            "viewbox": ACEH_VIEWBOX,
            "bounded": 0,
            "countrycodes": "id",
        }
        headers = {"User-Agent": "TransKoetaradja-Web/1.0 (dishub Banda Aceh)"}
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params=params, headers=headers,
            )
            resp.raise_for_status()
            data = resp.json()
        return [
            {
                "display_name": item.get("display_name"),
                "lat": float(item["lat"]),
                "lng": float(item["lon"]),
            }
            for item in data
        ]
    except httpx.HTTPError as e:
        logger.error(f"Geocode upstream error: {e}")
        raise HTTPException(status_code=502, detail="Layanan pencarian lokasi tidak tersedia")
    except Exception as e:
        logger.error(f"Geocode error: {e}")
        raise HTTPException(status_code=500, detail="Gagal mencari lokasi")


def _next_departure(jadwal: dict, day_key: str, after_minutes: int):
    """Return (time_str, minutes) of the next bus at/after a time, or None."""
    times = jadwal.get(day_key) or jadwal.get("sabtu_minggu") or []
    best = None
    for t in times:
        try:
            h, m = map(int, t.split(":"))
        except ValueError:
            continue
        mins = h * 60 + m
        if mins >= after_minutes and (best is None or mins < best[1]):
            best = (t, mins)
    return best


@router.get("/plan")
async def plan_trip(
    from_lat: float = Query(..., ge=-90, le=90),
    from_lng: float = Query(..., ge=-180, le=180),
    to_lat: float = Query(..., ge=-90, le=90),
    to_lng: float = Query(..., ge=-180, le=180),
    day: str = Query("senin_kamis"),
    depart_after: Optional[str] = Query(None, description="HH:MM earliest departure"),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    """Plan a trip from an origin to a destination using the bus network.

    Finds direct routes (a single route whose halte order passes the origin's
    nearest halte before the destination's nearest halte) and one-transfer
    itineraries. Returns step-by-step legs with boarding halte, alighting halte
    and the next scheduled departure time.
    """
    try:
        routes = await _all_routes(db)

        after_minutes = 0
        if depart_after:
            try:
                h, m = map(int, depart_after.split(":"))
                after_minutes = h * 60 + m
            except ValueError:
                after_minutes = 0

        # A route file concatenates every direction into one halte array, so a
        # halte name (e.g. "Masjid Raya") can appear once per direction. Split
        # the array into contiguous segments by the "arah" label so boarding and
        # alighting are matched within the same travel direction.
        def segments(route):
            halte = route.get("halte", [])
            segs = []
            start = 0
            for i in range(1, len(halte) + 1):
                if i == len(halte) or halte[i].get("arah") != halte[start].get("arah"):
                    segs.append((start, i))  # [start, end) global indices
                    start = i
            return segs

        # Nearest halte to a point *within a given segment*; returns global index.
        def nearest_in_segment(route, seg, lat, lng):
            halte = route["halte"]
            best = None
            for idx in range(seg[0], seg[1]):
                h = halte[idx]
                if "lat" not in h:
                    continue
                d = haversine_km(lat, lng, h["lat"], h["lng"])
                if best is None or d < best[0]:
                    best = (d, idx, h)
            return best

        def build_leg(route, board_idx, alight_idx):
            halte = route["halte"]
            board = halte[board_idx]
            alight = halte[alight_idx]
            dep = _next_departure(board.get("jadwal", {}), day, after_minutes)
            stops = [h["nama"] for h in halte[board_idx:alight_idx + 1]]
            return {
                "route_id": route["id"],
                "route_nama": route["nama"],
                "route_warna": route.get("warna", "#0284c7"),
                "arah": board.get("arah", ""),
                "board_halte": board["nama"],
                "alight_halte": alight["nama"],
                "num_stops": alight_idx - board_idx,
                "stops": stops,
                "departure": dep[0] if dep else None,
                "board_lat": board.get("lat"),
                "board_lng": board.get("lng"),
                "alight_lat": alight.get("lat"),
                "alight_lng": alight.get("lng"),
            }

        WALK_LIMIT_KM = 1.2  # max walk to a boarding/alighting halte

        # 1) Direct routes: within one direction segment, board precedes alight.
        direct = []
        for route in routes:
            for seg in segments(route):
                nb = nearest_in_segment(route, seg, from_lat, from_lng)
                na = nearest_in_segment(route, seg, to_lat, to_lng)
                if not nb or not na:
                    continue
                if nb[0] > WALK_LIMIT_KM or na[0] > WALK_LIMIT_KM:
                    continue
                if nb[1] < na[1]:
                    leg = build_leg(route, nb[1], na[1])
                    direct.append({
                        "type": "direct",
                        "walk_from_km": round(nb[0], 3),
                        "walk_to_km": round(na[0], 3),
                        "legs": [leg],
                    })
        direct.sort(key=lambda p: (p["legs"][0]["num_stops"], p["walk_from_km"] + p["walk_to_km"]))

        if direct:
            return {"found": True, "options": direct[:3]}

        # 2) One-transfer itineraries via a shared interchange halte, matched
        # within direction segments on both legs.
        # origin_segs: (route, seg, board_idx, walk_from)
        # dest_segs:   (route, seg, alight_idx, walk_to)
        origin_segs = []
        dest_segs = []
        for route in routes:
            for seg in segments(route):
                nb = nearest_in_segment(route, seg, from_lat, from_lng)
                if nb and nb[0] <= WALK_LIMIT_KM:
                    origin_segs.append((route, seg, nb[1], nb[0]))
                na = nearest_in_segment(route, seg, to_lat, to_lng)
                if na and na[0] <= WALK_LIMIT_KM:
                    dest_segs.append((route, seg, na[1], na[0]))

        transfers = []
        for r1, seg1, board_idx, walk_from in origin_segs:
            h1 = r1["halte"]
            for r2, seg2, alight2_idx, walk_to in dest_segs:
                if r1["id"] == r2["id"]:
                    continue
                h2 = r2["halte"]
                # interchange: a halte on leg 1 after boarding (within seg1) close
                # to a halte on leg 2 before alighting (within seg2)
                best_x = None
                for i in range(board_idx + 1, seg1[1]):
                    if "lat" not in h1[i]:
                        continue
                    for j in range(seg2[0], alight2_idx):
                        if "lat" not in h2[j]:
                            continue
                        d = haversine_km(h1[i]["lat"], h1[i]["lng"], h2[j]["lat"], h2[j]["lng"])
                        if d <= 0.4 and (best_x is None or d < best_x[0]):
                            best_x = (d, i, j)
                if best_x:
                    leg1 = build_leg(r1, board_idx, best_x[1])
                    leg2 = build_leg(r2, best_x[2], alight2_idx)
                    transfers.append({
                        "type": "transfer",
                        "walk_from_km": round(walk_from, 3),
                        "walk_to_km": round(walk_to, 3),
                        "interchange_km": round(best_x[0], 3),
                        "legs": [leg1, leg2],
                    })
        transfers.sort(key=lambda p: sum(l["num_stops"] for l in p["legs"]) + p["walk_from_km"] + p["walk_to_km"])

        if transfers:
            return {"found": True, "options": transfers[:3]}

        return {"found": False, "options": [], "message": "Tidak ditemukan rute bus yang menghubungkan lokasi ini."}
    except Exception as e:
        logger.error(f"Plan trip error: {e}")
        raise HTTPException(status_code=500, detail="Gagal merencanakan perjalanan")


@router.get("/{route_id}")
async def get_route_detail(route_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get full route detail with all halte and schedules"""
    try:
        route = await db.bus_routes.find_one({"id": route_id}, {"_id": 0})
        if not route:
            raise HTTPException(status_code=404, detail="Route not found")
        return route
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get route detail error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get route")


@router.get("/halte/{halte_name}")
async def get_halte_schedule(halte_name: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get schedule for a specific halte across all routes"""
    try:
        routes = await db.bus_routes.find({}, {"_id": 0}).to_list(100)
        results = []
        
        for route in routes:
            for halte in route.get("halte", []):
                if halte_name.lower() in halte["nama"].lower():
                    results.append({
                        "halte_nama": halte["nama"],
                        "halte_arah": halte.get("arah", ""),
                        "route_id": route["id"],
                        "route_nama": route["nama"],
                        "route_warna": route.get("warna", "#0284c7"),
                        "jadwal": halte.get("jadwal", {}),
                    })
        
        if not results:
            raise HTTPException(status_code=404, detail="Halte not found")
        
        return results
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get halte schedule error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get halte schedule")
