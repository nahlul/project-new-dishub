from fastapi import APIRouter, HTTPException, Depends, Request, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from datetime import datetime, timezone
import logging
import os

from models.schemas import News, NewsCreate, NewsUpdate
from utils.auth_utils import get_current_user
from utils.storage_utils import upload_image, get_object

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/news", tags=["news"])

async def get_db(request: Request) -> AsyncIOMotorDatabase:
    return request.app.state.db

# ============= PUBLIC ENDPOINTS =============

@router.get("/", response_model=List[News])
async def get_all_news(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all news articles (public endpoint)"""
    try:
        news_list = await db.news.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
        return news_list
    except Exception as e:
        logger.error(f"Get news error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch news")

@router.get("/{news_id}", response_model=News)
async def get_news_by_id(
    news_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get single news article by ID (public endpoint)"""
    try:
        news = await db.news.find_one({"id": news_id}, {"_id": 0})
        if not news:
            raise HTTPException(status_code=404, detail="News not found")
        return news
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get news by ID error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch news")

# ============= ADMIN ENDPOINTS (PROTECTED) =============

@router.post("/", response_model=News)
async def create_news(
    news_data: NewsCreate,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create new news article (admin only)"""
    try:
        # Verify admin authentication
        await get_current_user(request, db)
        
        # Create news object
        news = News(
            **news_data.model_dump(),
            date=datetime.now().strftime("%d %B %Y")
        )
        
        # Insert to database
        news_dict = news.model_dump()
        news_dict["created_at"] = news_dict["created_at"].isoformat()
        news_dict["updated_at"] = news_dict["updated_at"].isoformat()
        
        await db.news.insert_one(news_dict)
        
        logger.info(f"News created: {news.title}")
        return news
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create news error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create news")

@router.post("/{news_id}/upload-image")
async def upload_news_image(
    news_id: str,
    file: UploadFile = File(...),
    request: Request = None,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Upload image for news article (admin only)"""
    try:
        # Verify admin authentication
        await get_current_user(request, db)
        
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Check if news exists
        news = await db.news.find_one({"id": news_id}, {"_id": 0})
        if not news:
            raise HTTPException(status_code=404, detail="News not found")
        
        # Read and upload image
        image_data = await file.read()
        upload_result = upload_image(image_data, file.filename, folder="news")
        
        # Generate public URL pointing to the BACKEND server (not frontend)
        backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8001')
        image_url = f"{backend_url}/api/files/{upload_result['storage_path']}"
        
        # Update news with image info
        await db.news.update_one(
            {"id": news_id},
            {
                "$set": {
                    "image_url": image_url,
                    "storage_path": upload_result["storage_path"],
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            }
        )
        
        logger.info(f"Image uploaded for news: {news_id}")
        
        return {
            "message": "Image uploaded successfully",
            "image_url": image_url,
            "storage_path": upload_result["storage_path"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload news image error: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload image")

@router.put("/{news_id}", response_model=News)
async def update_news(
    news_id: str,
    news_data: NewsUpdate,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update news article (admin only)"""
    try:
        # Verify admin authentication
        await get_current_user(request, db)
        
        # Check if news exists
        news = await db.news.find_one({"id": news_id}, {"_id": 0})
        if not news:
            raise HTTPException(status_code=404, detail="News not found")
        
        # Prepare update data (only non-None fields)
        update_data = {k: v for k, v in news_data.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        # Update news
        await db.news.update_one(
            {"id": news_id},
            {"$set": update_data}
        )
        
        # Get updated news
        updated_news = await db.news.find_one({"id": news_id}, {"_id": 0})
        
        logger.info(f"News updated: {news_id}")
        return updated_news
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update news error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update news")

@router.delete("/{news_id}")
async def delete_news(
    news_id: str,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete news article (admin only)"""
    try:
        # Verify admin authentication
        await get_current_user(request, db)
        
        # Check if news exists
        news = await db.news.find_one({"id": news_id}, {"_id": 0})
        if not news:
            raise HTTPException(status_code=404, detail="News not found")
        
        # Delete news
        result = await db.news.delete_one({"id": news_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=400, detail="Failed to delete news")
        
        logger.info(f"News deleted: {news_id}")
        
        return {"message": "News deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete news error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete news")
