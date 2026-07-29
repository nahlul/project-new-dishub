from fastapi import APIRouter, HTTPException, Depends, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/routes", tags=["routes"])

async def get_db(request: Request) -> AsyncIOMotorDatabase:
    return request.app.state.db


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
        if not q or len(q) < 2:
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
