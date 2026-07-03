import os
import io
import uuid
from PIL import Image
from typing import Tuple
import logging
from pathlib import Path
import mimetypes

logger = logging.getLogger(__name__)

# Local storage directory
STORAGE_DIR = Path(__file__).parent.parent / "local_storage"
APP_NAME = "transkoetaradja"


def init_storage():
    """Initialize local storage directory. Call ONCE at startup."""
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    (STORAGE_DIR / APP_NAME / "news").mkdir(parents=True, exist_ok=True)
    (STORAGE_DIR / APP_NAME / "gallery").mkdir(parents=True, exist_ok=True)
    (STORAGE_DIR / APP_NAME / "uploads").mkdir(parents=True, exist_ok=True)
    logger.info(f"Local storage initialized at: {STORAGE_DIR}")


def put_object(path: str, data: bytes, content_type: str) -> dict:
    """Save file to local storage. Returns {"path": "...", "size": 123}"""
    file_path = STORAGE_DIR / path
    file_path.parent.mkdir(parents=True, exist_ok=True)
    
    file_path.write_bytes(data)
    
    logger.info(f"File saved locally: {path} ({len(data)} bytes)")
    return {"path": path, "size": len(data)}


def get_object(path: str) -> Tuple[bytes, str]:
    """Read file from local storage. Returns (content_bytes, content_type)."""
    file_path = STORAGE_DIR / path
    
    if not file_path.exists():
        raise FileNotFoundError(f"File not found: {path}")
    
    data = file_path.read_bytes()
    
    # Determine content type from extension
    content_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
    
    return data, content_type


def resize_image(image_data: bytes, max_width: int = 1200, max_height: int = 800, quality: int = 85) -> bytes:
    """
    Resize and compress image for web optimization.
    Returns the processed image as bytes.
    """
    try:
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
    Upload image with automatic resizing to local storage.
    Returns dict with path and metadata.
    """
    # Resize image
    processed_data = resize_image(image_data)
    
    # Generate unique path
    ext = filename.split(".")[-1].lower() if "." in filename else "jpg"
    unique_filename = f"{uuid.uuid4()}.{ext}"
    path = f"{APP_NAME}/{folder}/{unique_filename}"
    
    # Save to local storage
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
