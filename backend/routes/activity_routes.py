from fastapi import APIRouter, Depends, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging

from utils.activity_utils import log_activity  # re-export for backward compat

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/activity-log", tags=["activity"])

async def get_db(request: Request) -> AsyncIOMotorDatabase:
    return request.app.state.db


@router.get("/")
async def get_activity_log(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get recent activity log (last 10 activities)"""
    try:
        activities = await db.activity_log.find(
            {}, {"_id": 0}
        ).sort("created_at", -1).limit(10).to_list(10)
        return activities
    except Exception as e:
        logger.error(f"Get activity log error: {e}")
        return []
