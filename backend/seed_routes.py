"""
Seed route data into MongoDB.
Loads route metadata and halte schedule data from JSON files.
Called from server.py on startup.
"""
import json
import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).parent / "data"


def _data_version() -> str:
    """Hash of route data files so the seeder refreshes when data changes."""
    import hashlib

    h = hashlib.sha256()
    files = [DATA_DIR / "routes_meta.json"] + sorted(DATA_DIR.glob("halte_*.json"))
    for fp in files:
        if fp.exists():
            h.update(fp.read_bytes())
    return h.hexdigest()[:16]


async def seed_routes(db):
    """Seed all route data into the bus_routes collection.

    Re-seeds automatically whenever the underlying JSON data changes, detected
    via a content hash stored in the meta collection.
    """
    try:
        version = _data_version()
        meta = await db.route_seed_meta.find_one({"_id": "version"})
        count = await db.bus_routes.count_documents({})
        if meta and meta.get("hash") == version and count > 0:
            logger.info(f"Routes up to date ({count} routes, v{version}). Skipping.")
            return

        logger.info("Seeding route data (data changed or first run)...")

        # Load route metadata
        meta_file = DATA_DIR / "routes_meta.json"
        if not meta_file.exists():
            logger.warning("routes_meta.json not found. Skipping route seed.")
            return

        with open(meta_file, "r", encoding="utf-8") as f:
            routes_meta = json.load(f)

        # For each route, try to load halte data
        for route in routes_meta:
            halte_file = DATA_DIR / f"halte_{route['id'].replace('-', '_')}.json"

            if halte_file.exists():
                with open(halte_file, "r", encoding="utf-8") as f:
                    route["halte"] = json.load(f)
            else:
                route["halte"] = []
                logger.warning(f"No halte data for route: {route['id']}")

        # Replace all existing route data with the fresh set
        await db.bus_routes.delete_many({})
        await db.bus_routes.insert_many(routes_meta)
        await db.route_seed_meta.update_one(
            {"_id": "version"}, {"$set": {"hash": version}}, upsert=True
        )
        logger.info(f"Successfully seeded {len(routes_meta)} routes (v{version})")

    except Exception as e:
        logger.error(f"Error seeding routes: {e}")
