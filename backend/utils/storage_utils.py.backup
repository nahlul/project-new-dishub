import os
import io
import requests
import uuid
from PIL import Image
from typing import Tuple
import logging

logger = logging.getLogger(__name__)

STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
APP_NAME = "transkoetaradja"
storage_key = None  # Module-level, set once and reused globally

def get_emergent_key() -> str:
    """Get Emergent LLM key from environment"""
    key = os.environ.get("EMERGENT_LLM_KEY")
    if not key:
        raise ValueError("EMERGENT_LLM_KEY not set in environment")
    return key

def init_storage() -> str:
    """Initialize storage and return storage_key. Call ONCE at startup."""
    global storage_key
    if storage_key:
        return storage_key
    
    try:
        resp = requests.post(
            f"{STORAGE_URL}/init",
            json={"emergent_key": get_emergent_key()},
            timeout=30
        )
        resp.raise_for_status()
        storage_key = resp.json()["storage_key"]
        logger.info("Storage initialized successfully")
        return storage_key
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
        raise

def put_object(path: str, data: bytes, content_type: str) -> dict:
    """Upload file to storage. Returns {"path": "...", "size": 123, "etag": "..."}"""
    key = init_storage()
    
    try:
        resp = requests.put(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key, "Content-Type": content_type},
            data=data,
            timeout=120
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.error(f"Upload failed for {path}: {e}")
        raise

def get_object(path: str) -> Tuple[bytes, str]:
    """Download file from storage. Returns (content_bytes, content_type)."""
    key = init_storage()
    
    try:
        resp = requests.get(
            f"{STORAGE_URL}/objects/{path}",
            headers={"X-Storage-Key": key},
            timeout=60
        )
        resp.raise_for_status()
        content_type = resp.headers.get("Content-Type", "application/octet-stream")
        return resp.content, content_type
    except Exception as e:
        logger.error(f"Download failed for {path}: {e}")
        raise

def resize_image(image_data: bytes, max_width: int = 1200, max_height: int = 800, quality: int = 85) -> bytes:
    """
    Resize and compress image for web optimization.
    Returns the processed image as bytes.
    """
    try:
        # Open image
        img = Image.open(io.BytesIO(image_data))
        
        # Convert RGBA to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Calculate new dimensions maintaining aspect ratio
        img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        
        # Save to bytes
        output = io.BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        output.seek(0)
        
        return output.read()
    except Exception as e:
        logger.error(f"Image resize failed: {e}")
        raise ValueError(f"Failed to process image: {str(e)}")

def upload_image(image_data: bytes, filename: str, folder: str = "uploads") -> dict:
    """
    Upload image with automatic resizing.
    Returns dict with path and metadata.
    """
    # Resize image
    processed_data = resize_image(image_data)
    
    # Generate unique path
    ext = filename.split(".")[-1] if "." in filename else "jpg"
    unique_filename = f"{uuid.uuid4()}.{ext}"
    path = f"{APP_NAME}/{folder}/{unique_filename}"
    
    # Upload to storage
    result = put_object(path, processed_data, "image/jpeg")
    
    return {
        "storage_path": result["path"],
        "original_filename": filename,
        "size": result["size"],
        "content_type": "image/jpeg"
    }

def get_mime_type(filename: str) -> str:
    """Get MIME type from filename extension"""
    MIME_TYPES = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif",
        "webp": "image/webp",
        "pdf": "application/pdf",
        "json": "application/json",
        "csv": "text/csv",
        "txt": "text/plain"
    }
    
    ext = filename.split(".")[-1].lower() if "." in filename else "bin"
    return MIME_TYPES.get(ext, "application/octet-stream")
