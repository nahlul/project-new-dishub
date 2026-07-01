from fastapi import APIRouter, HTTPException, Depends, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone
import logging

from models.schemas import Contact, ContactUpdate, SocialMedia, SocialMediaUpdate, About, AboutUpdate
from utils.auth_utils import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/settings", tags=["settings"])

async def get_db(request: Request) -> AsyncIOMotorDatabase:
    return request.app.state.db

# ============= CONTACT ENDPOINTS =============

@router.get("/contact", response_model=Contact)
async def get_contact_info(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get contact information (public endpoint)"""
    try:
        contact = await db.contact.find_one({"id": "contact_info"}, {"_id": 0})
        if not contact:
            # Return default if not found
            return Contact(
                address="Jl. T. Panglima Nyak Makam No. 12, Banda Aceh",
                phone="+62 811 6712349",
                email="info@transkutaraja.acehprov.go.id",
                operational_hours="06:00 - 18:00 WIB (Setiap Hari)"
            )
        return contact
    except Exception as e:
        logger.error(f"Get contact error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch contact info")

@router.put("/contact", response_model=Contact)
async def update_contact_info(
    contact_data: ContactUpdate,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update contact information (admin only)"""
    try:
        # Verify admin authentication
        await get_current_user(request, db)
        
        # Get current contact info
        current = await db.contact.find_one({"id": "contact_info"}, {"_id": 0})
        
        # Prepare update data
        update_data = {k: v for k, v in contact_data.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        if current:
            # Update existing
            await db.contact.update_one(
                {"id": "contact_info"},
                {"$set": update_data}
            )
        else:
            # Create new
            new_contact = Contact(**update_data)
            contact_dict = new_contact.model_dump()
            contact_dict["updated_at"] = contact_dict["updated_at"].isoformat()
            await db.contact.insert_one(contact_dict)
        
        # Get updated contact
        updated = await db.contact.find_one({"id": "contact_info"}, {"_id": 0})
        
        logger.info("Contact info updated")
        return updated
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update contact error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update contact info")

# ============= SOCIAL MEDIA ENDPOINTS =============

@router.get("/social-media", response_model=SocialMedia)
async def get_social_media(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get social media links (public endpoint)"""
    try:
        social = await db.social_media.find_one({"id": "social_media"}, {"_id": 0})
        if not social:
            # Return default if not found
            return SocialMedia(
                whatsapp="https://wa.me/6281167123490",
                instagram="https://www.instagram.com/transkoetaradja",
                facebook="https://www.facebook.com/transkoetaradja",
                twitter="https://twitter.com/transkoetaradja"
            )
        return social
    except Exception as e:
        logger.error(f"Get social media error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch social media")

@router.put("/social-media", response_model=SocialMedia)
async def update_social_media(
    social_data: SocialMediaUpdate,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update social media links (admin only)"""
    try:
        # Verify admin authentication
        await get_current_user(request, db)
        
        # Get current social media info
        current = await db.social_media.find_one({"id": "social_media"}, {"_id": 0})
        
        # Prepare update data
        update_data = {k: v for k, v in social_data.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        if current:
            # Update existing
            await db.social_media.update_one(
                {"id": "social_media"},
                {"$set": update_data}
            )
        else:
            # Create new
            new_social = SocialMedia(**update_data)
            social_dict = new_social.model_dump()
            social_dict["updated_at"] = social_dict["updated_at"].isoformat()
            await db.social_media.insert_one(social_dict)
        
        # Get updated social media
        updated = await db.social_media.find_one({"id": "social_media"}, {"_id": 0})
        
        logger.info("Social media updated")
        return updated
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update social media error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update social media")

# ============= ABOUT (HISTORY) ENDPOINTS =============

@router.get("/about", response_model=About)
async def get_about_content(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get about/history content (public endpoint)"""
    try:
        about = await db.about.find_one({"id": "about_content"}, {"_id": 0})
        if not about:
            # Return default if not found
            return About(
                content="Trans Koetaradja adalah sistem transportasi Bus Rapid Transit (BRT) yang melayani Kota Banda Aceh dan sekitarnya."
            )
        return about
    except Exception as e:
        logger.error(f"Get about error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch about content")

@router.put("/about", response_model=About)
async def update_about_content(
    about_data: AboutUpdate,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update about/history content (admin only)"""
    try:
        # Verify admin authentication
        await get_current_user(request, db)
        
        # Prepare update data
        update_data = {
            "content": about_data.content,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        # Check if exists
        current = await db.about.find_one({"id": "about_content"}, {"_id": 0})
        
        if current:
            # Update existing
            await db.about.update_one(
                {"id": "about_content"},
                {"$set": update_data}
            )
        else:
            # Create new
            new_about = About(content=about_data.content)
            about_dict = new_about.model_dump()
            about_dict["updated_at"] = about_dict["updated_at"].isoformat()
            await db.about.insert_one(about_dict)
        
        # Get updated about
        updated = await db.about.find_one({"id": "about_content"}, {"_id": 0})
        
        logger.info("About content updated")
        return updated
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update about error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update about content")
