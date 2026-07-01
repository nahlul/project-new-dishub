from fastapi import APIRouter, HTTPException, Header, Query
from fastapi.responses import Response
import logging

from utils.storage_utils import get_object

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/files", tags=["files"])

@router.get("/{path:path}")
async def serve_file(
    path: str,
    authorization: str = Header(None),
    auth: str = Query(None)
):
    """
    Serve files from storage.
    Supports both Authorization header and query param for image tags.
    """
    try:
        # Get file from storage
        data, content_type = get_object(path)
        
        return Response(content=data, media_type=content_type)
        
    except Exception as e:
        logger.error(f"Serve file error for {path}: {e}")
        raise HTTPException(status_code=404, detail="File not found")
