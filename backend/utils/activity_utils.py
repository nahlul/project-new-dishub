from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)


async def log_activity(db, message: str, admin_username: str = "admin"):
    """Helper function to log an activity. Call this from any route."""
    try:
        activity = {
            "message": message,
            "admin": admin_username,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.activity_log.insert_one(activity)
        logger.info(f"Activity logged: {message}")
    except Exception as e:
        logger.error(f"Failed to log activity: {e}")
