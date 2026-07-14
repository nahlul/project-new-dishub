from fastapi import APIRouter, HTTPException, Depends, Request, UploadFile, File, Form
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from datetime import datetime, timezone
import logging
import os

from models.schemas import Gallery, GalleryCreate
from utils.auth_utils import get_current_user
from utils.storage_utils import upload_image
from routes.activity_routes import log_activity

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/gallery", tags=["gallery"])

async def get_db(request: Request) -> AsyncIOMotorDatabase:
    return request.app.state.db

# ============= PUBLIC ENDPOINTS =============

@router.get("/", response_model=List[Gallery])
async def get_all_gallery(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all gallery images (public endpoint)"""
    try:
        gallery_list = await db.gallery.find(
            {"is_deleted": False},
            {"_id": 0}
        ).sort("created_at", -1).to_list(1000)
        return gallery_list
    except Exception as e:
        logger.error(f"Get gallery error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch gallery")

# ============= ADMIN ENDPOINTS (PROTECTED) =============

@router.post("/upload")
async def upload_gallery_image(
    file: UploadFile = File(...),
    title: str = Form(None),
    category: str = Form("Galeri"),
    request: Request = None,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Upload image to gallery (admin only)"""
    try:
        # Verify admin authentication
        await get_current_user(request, db)
        
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and upload image
        image_data = await file.read()
        upload_result = upload_image(image_data, file.filename, folder="gallery")
        
        # Generate public URL pointing to the BACKEND server (not frontend)
        backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8001')
        image_url = f"{backend_url}/api/files/{upload_result['storage_path']}"
        
        # Create gallery entry
        gallery = Gallery(
            image_url=image_url,
            storage_path=upload_result["storage_path"],
            title=title or f"Foto {datetime.now().strftime('%d %B %Y')}",
            category=category
        )
        
        # Insert to database
        gallery_dict = gallery.model_dump()
        gallery_dict["created_at"] = gallery_dict["created_at"].isoformat()
        
        await db.gallery.insert_one(gallery_dict)
        
        logger.info(f"Gallery image uploaded: {gallery.id}")
        await log_activity(db, f"Mengupload foto galeri: {gallery.title}")
        
        return {
            "message": "Image uploaded successfully",
            "gallery": gallery
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload gallery image error: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload image")

@router.put("/{gallery_id}")
async def update_gallery_image(
    gallery_id: str,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update gallery item title/category (admin only)"""
    try:
        # Verify admin authentication
        await get_current_user(request, db)
        
        # Check if gallery item exists
        gallery = await db.gallery.find_one({"id": gallery_id, "is_deleted": False}, {"_id": 0})
        if not gallery:
            raise HTTPException(status_code=404, detail="Gallery image not found")
        
        # Parse JSON body
        body = await request.json()
        update_data = {}
        
        if "title" in body and body["title"] is not None:
            update_data["title"] = body["title"]
        if "category" in body and body["category"] is not None:
            update_data["category"] = body["category"]
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        # Update in database
        result = await db.gallery.update_one(
            {"id": gallery_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Failed to update gallery item")
        
        # Return updated item
        updated = await db.gallery.find_one({"id": gallery_id}, {"_id": 0})
        
        logger.info(f"Gallery image updated: {gallery_id}")
        return updated
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update gallery image error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update gallery item")

@router.delete("/{gallery_id}")
async def delete_gallery_image(
    gallery_id: str,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete gallery image (admin only - soft delete)"""
    try:
        # Verify admin authentication
        await get_current_user(request, db)
        
        # Check if gallery item exists
        gallery = await db.gallery.find_one({"id": gallery_id, "is_deleted": False}, {"_id": 0})
        if not gallery:
            raise HTTPException(status_code=404, detail="Gallery image not found")
        
        # Soft delete (mark as deleted)
        result = await db.gallery.update_one(
            {"id": gallery_id},
            {"$set": {"is_deleted": True}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Failed to delete image")
        
        logger.info(f"Gallery image deleted: {gallery_id}")
        
        return {"message": "Image deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete gallery image error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete image")
