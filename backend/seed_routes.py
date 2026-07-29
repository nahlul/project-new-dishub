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


async def seed_routes(db):
    """Seed all route data into the bus_routes collection"""
    try:
        # Check if routes already seeded
        count = await db.bus_routes.count_documents({})
        if count > 0:
            logger.info(f"Routes already seeded ({count} routes). Skipping.")
            return

        logger.info("Seeding route data...")

        # Load route metadata
        meta_file = DATA_DIR / "routes_meta.json"
        if not meta_file.exists():
            logger.warning("routes_meta.json not found. Skipping route seed.")
            return

        with open(meta_file, "r") as f:
            routes_meta = json.load(f)

        # For each route, try to load halte data
        for route in routes_meta:
            halte_file = DATA_DIR / f"halte_{route['id'].replace('-', '_')}.json"
            
            if halte_file.exists():
                with open(halte_file, "r") as f:
                    route["halte"] = json.load(f)
            else:
                route["halte"] = []
                logger.warning(f"No halte data for route: {route['id']}")

        # Insert all routes
        await db.bus_routes.insert_many(routes_meta)
        logger.info(f"Successfully seeded {len(routes_meta)} routes")

    except Exception as e:
        logger.error(f"Error seeding routes: {e}")
