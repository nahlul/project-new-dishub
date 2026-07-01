from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
from uuid import uuid4

# ============= ADMIN MODELS =============

class Admin(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid4()))
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminChangePassword(BaseModel):
    current_password: str
    new_password: str
    new_username: Optional[str] = None

class AdminResponse(BaseModel):
    id: str
    username: str
    created_at: datetime

# ============= NEWS MODELS =============

class NewsCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str

class NewsUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None

class News(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str
    excerpt: str
    content: str
    category: str
    image_url: Optional[str] = None
    storage_path: Optional[str] = None
    date: str = Field(default_factory=lambda: datetime.now().strftime("%d %B %Y"))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ============= GALLERY MODELS =============

class GalleryCreate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = "Galeri"

class Gallery(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid4()))
    image_url: str
    storage_path: str
    title: Optional[str] = None
    category: str = "Galeri"
    is_deleted: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ============= CONTACT MODELS =============

class ContactUpdate(BaseModel):
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    operational_hours: Optional[str] = None

class Contact(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = "contact_info"
    address: str
    phone: str
    email: str
    operational_hours: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ============= SOCIAL MEDIA MODELS =============

class SocialMediaUpdate(BaseModel):
    whatsapp: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    twitter: Optional[str] = None

class SocialMedia(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = "social_media"
    whatsapp: str
    instagram: str
    facebook: str
    twitter: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ============= ABOUT (HISTORY) MODELS =============

class AboutUpdate(BaseModel):
    content: str

class About(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = "about_content"
    content: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)
