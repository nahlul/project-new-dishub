import os
from fastapi import APIRouter, HTTPException, Depends, Response, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone
import logging

from models.schemas import AdminLogin, AdminChangePassword, AdminResponse
from utils.auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    get_current_user
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

# Cookie configuration
COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "false").lower() == "true"
COOKIE_SAMESITE = os.environ.get("COOKIE_SAMESITE", "lax")

# Dependency to get database
async def get_db(request: Request) -> AsyncIOMotorDatabase:
    return request.app.state.db

@router.post("/login")
async def login(
    credentials: AdminLogin,
    response: Response,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Admin login endpoint.
    Returns admin info and sets httpOnly cookies for access and refresh tokens.
    """
    try:
        # Find admin by username
        admin = await db.admins.find_one({"username": credentials.username}, {"_id": 0})
        
        if not admin:
            raise HTTPException(status_code=401, detail="Username atau password salah")
        
        # Verify password
        if not verify_password(credentials.password, admin["password_hash"]):
            raise HTTPException(status_code=401, detail="Username atau password salah")
        
        # Create tokens
        access_token = create_access_token(admin["id"], admin["username"])
        refresh_token = create_refresh_token(admin["id"])
        
        # Set httpOnly cookies
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            max_age=900,  # 15 minutes
            path="/"
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            max_age=604800,  # 7 days
            path="/"
        )
        
        # Return admin info (without password_hash)
        admin_response = AdminResponse(
            id=admin["id"],
            username=admin["username"],
            created_at=admin["created_at"]
        )
        
        logger.info(f"Admin {admin['username']} logged in successfully")
        return admin_response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

@router.post("/logout")
async def logout(response: Response):
    """
    Logout endpoint. Clears authentication cookies.
    """
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=AdminResponse)
async def get_me(
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Get current authenticated admin info.
    """
    try:
        user = await get_current_user(request, db)
        return AdminResponse(
            id=user["id"],
            username=user["username"],
            created_at=user["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get me error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get user info")

@router.put("/change-password")
async def change_password(
    data: AdminChangePassword,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Change admin password and optionally username.
    Requires current password verification.
    """
    try:
        # Get current user
        current_user = await get_current_user(request, db)
        
        # Get admin from database (with password_hash)
        admin = await db.admins.find_one({"id": current_user["id"]}, {"_id": 0})
        
        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")
        
        # Verify current password
        if not verify_password(data.current_password, admin["password_hash"]):
            raise HTTPException(status_code=401, detail="Current password is incorrect")
        
        # Prepare update data
        update_data = {
            "password_hash": hash_password(data.new_password),
            "updated_at": datetime.now(timezone.utc)
        }
        
        # Update username if provided
        if data.new_username:
            # Check if username already exists (for other users)
            existing = await db.admins.find_one({
                "username": data.new_username,
                "id": {"$ne": current_user["id"]}
            })
            if existing:
                raise HTTPException(status_code=400, detail="Username already taken")
            
            update_data["username"] = data.new_username
        
        # Update admin
        result = await db.admins.update_one(
            {"id": current_user["id"]},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Failed to update password")
        
        logger.info(f"Admin {current_user['username']} changed password/username")
        
        return {
            "message": "Password updated successfully",
            "username": data.new_username or admin["username"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Change password error: {e}")
        raise HTTPException(status_code=500, detail="Failed to change password")
