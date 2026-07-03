from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime, timezone

# Load env first
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import routes
from routes.auth_routes import router as auth_router
from routes.news_routes import router as news_router
from routes.gallery_routes import router as gallery_router
from routes.settings_routes import router as settings_router
from routes.file_routes import router as file_router

# Import utilities
from utils.auth_utils import hash_password, verify_password
from utils.storage_utils import init_storage

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Trans Koetaradja API")

# Create API router with /api prefix
api_router = APIRouter(prefix="/api")

# Root endpoint
@api_router.get("/")
async def root():
    return {
        "message": "Trans Koetaradja API",
        "version": "1.0.0",
        "status": "running"
    }

# Include all routers
api_router.include_router(auth_router)
api_router.include_router(news_router)
api_router.include_router(gallery_router)
api_router.include_router(settings_router)
api_router.include_router(file_router)

# Include API router in main app
app.include_router(api_router)

# CORS middleware
# Read allowed origins from environment variable (comma-separated)
# Defaults to localhost:3000 for development
cors_origins_str = os.environ.get("CORS_ORIGINS", "http://localhost:3000")
cors_origins = [origin.strip() for origin in cors_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,  # Required for httpOnly cookie authentication
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed data function
async def seed_initial_data():
    """Seed database with initial data from mockData.js"""
    try:
        logger.info("Starting data seeding...")
        
        # 1. Seed admin account
        admin_username = os.environ.get("ADMIN_USERNAME", "admin")
        admin_password = os.environ.get("ADMIN_PASSWORD", "admin")
        
        existing_admin = await db.admins.find_one({"username": admin_username})
        if not existing_admin:
            admin_doc = {
                "id": "admin-001",
                "username": admin_username,
                "password_hash": hash_password(admin_password),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            await db.admins.insert_one(admin_doc)
            logger.info(f"Admin account created: {admin_username}")
        elif not verify_password(admin_password, existing_admin["password_hash"]):
            # Update password if changed in .env
            await db.admins.update_one(
                {"username": admin_username},
                {"$set": {"password_hash": hash_password(admin_password)}}
            )
            logger.info(f"Admin password updated for: {admin_username}")
        
        # Write test credentials
        try:
            with open("/app/memory/test_credentials.md", "w") as f:
                f.write("# Test Credentials for Trans Koetaradja\n\n")
                f.write("## Admin Account\n")
                f.write(f"- Username: `{admin_username}`\n")
                f.write(f"- Password: `{admin_password}`\n")
                f.write("- Role: Admin\n\n")
                f.write("## API Endpoints\n")
                f.write("- POST `/api/auth/login` - Admin login\n")
                f.write("- GET `/api/auth/me` - Get current user\n")
                f.write("- POST `/api/auth/logout` - Logout\n")
                f.write("- PUT `/api/auth/change-password` - Change password\n")
                f.write("- GET `/api/news` - Get all news\n")
                f.write("- GET `/api/gallery` - Get all gallery\n")
                f.write("- GET `/api/settings/contact` - Get contact info\n")
                f.write("- GET `/api/settings/social-media` - Get social media links\n")
                f.write("- GET `/api/settings/about` - Get about content\n")
        except Exception as e:
            logger.error(f"Failed to write test credentials: {e}")
        
        # 2. Seed news (existing news from mockData.js)
        news_count = await db.news.count_documents({})
        if news_count == 0:
            news_data = [
                {
                    "id": "news-001",
                    "title": "Bus Trans Koetaradja Kembali Beroperasi, Layani 14 Rute",
                    "excerpt": "BANDA ACEH – Bus Trans Koetaradja kembali beroperasi melayani mobilitas masyarakat di wilayah Banda Aceh dan Aceh Besar. Pengoperasian 14 rute akan dilakukan secara bertahap, 3 di antaranya merupakan rute baru.",
                    "content": "Bus Trans Koetaradja kembali beroperasi melayani mobilitas masyarakat di wilayah Banda Aceh dan Aceh Besar. Pengoperasian 14 rute akan dilakukan secara bertahap, 3 di antaranya merupakan rute baru. Layanan ini didukung penuh oleh Pemerintah Aceh melalui APBA untuk memberikan transportasi publik yang nyaman, aman, dan gratis bagi masyarakat.",
                    "date": "24 Februari 2025",
                    "category": "Pengumuman",
                    "image_url": "https://dishub.acehprov.go.id/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-24-at-20.39.53.jpeg",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": "news-002",
                    "title": "Plt Kadishub Aceh Besar Hadiri Launching Rute Baru Trans Koetaradja Simpang Mesra – Kajhu",
                    "excerpt": "Pelaksana Tugas (Plt) Kepala Dinas Perhubungan Kabupaten Aceh Besar, Dodi Trisna SSTP MSi, menghadiri acara launching rute baru Trans Koetaradja trayek Simpang Mesra – Kajhu di Depo Trans Koetaradja, Batoh, Banda Aceh.",
                    "content": "Pelaksana Tugas (Plt) Kepala Dinas Perhubungan Kabupaten Aceh Besar menghadiri acara launching rute baru Trans Koetaradja. Rute baru ini diharapkan dapat meningkatkan konektivitas dan kemudahan akses masyarakat Aceh Besar ke berbagai lokasi penting.",
                    "date": "17 September 2025",
                    "category": "Berita",
                    "image_url": "https://acehbesarkab.go.id/thumbnail/700x0/media/2025.09/whatsapp_image_2025-09-17_at_35530_pm1.jpeg",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": "news-003",
                    "title": "Dishub Aceh Luncurkan TransCampus dan 7 Armada Bus Baru Trans Koetaradja",
                    "excerpt": "Dinas Perhubungan Aceh telah meluncurkan program TransCampus dan tujuh armada bus baru Trans Koetaradja. Penyediaan angkutan feeder di kawasan kampus USK dan UIN Ar-Raniry diharapkan dapat menunjang seluruh kegiatan sivitas akademika kampus.",
                    "content": "Dinas Perhubungan Aceh meluncurkan program TransCampus dengan 7 armada bus baru. Program ini khusus melayani area kampus USK dan UIN Ar-Raniry untuk memudahkan mobilitas mahasiswa dan dosen. Layanan ini gratis dan dilengkapi dengan fasilitas AC dan WiFi.",
                    "date": "19 Januari 2023",
                    "category": "Informasi",
                    "image_url": "https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,f_auto,q_auto:best,w_640/v1634025439/01gq4kage3c0x0m8yzdmav30tn.jpg",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": "news-004",
                    "title": "Masyarakat Butuh Feeder Trans Koetaradja",
                    "excerpt": "Tasya Rahmayanti, mahasiswi UIN Ar-Raniry mengharapkan adanya Feeder agar memudahkan masyarakat yang ingin menggunakan Trans Koetaradja. Feeder adalah kendaraan pengumpul yang dapat menjangkau kawasan perumahan dan mengantar penumpang ke halte terdekat.",
                    "content": "Mahasiswa UIN Ar-Raniry mengharapkan adanya layanan feeder untuk memudahkan akses ke halte Trans Koetaradja. Feeder adalah kendaraan pengumpul yang menjangkau kawasan perumahan dan mengantarkan penumpang ke halte utama. Hal ini diharapkan dapat meningkatkan penggunaan transportasi publik di Aceh.",
                    "date": "29 November 2019",
                    "category": "Berita",
                    "image_url": "https://dishub.acehprov.go.id/wp-content/uploads/2019/11/Bus-Trans-K-scaled-1.jpg",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
            ]
            await db.news.insert_many(news_data)
            logger.info(f"Seeded {len(news_data)} news articles")
        
        # 3. Seed contact info
        contact_exists = await db.contact.find_one({"id": "contact_info"})
        if not contact_exists:
            contact_doc = {
                "id": "contact_info",
                "address": "Jl. T. Panglima Nyak Makam No. 12, Banda Aceh, Aceh 23116",
                "phone": "+62 811 6712349",
                "email": "info@transkutaraja.acehprov.go.id",
                "operational_hours": "06:00 - 18:00 WIB (Setiap Hari)",
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            await db.contact.insert_one(contact_doc)
            logger.info("Contact info seeded")
        
        # 4. Seed social media
        social_exists = await db.social_media.find_one({"id": "social_media"})
        if not social_exists:
            social_doc = {
                "id": "social_media",
                "whatsapp": "https://wa.me/6281167123490",
                "instagram": "https://www.instagram.com/dishubaceh",
                "facebook": "https://www.facebook.com/dishub.aceh",
                "twitter": "https://twitter.com/dishubaceh",
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            await db.social_media.insert_one(social_doc)
            logger.info("Social media links seeded")
        
        # 5. Seed about content
        about_exists = await db.about.find_one({"id": "about_content"})
        if not about_exists:
            about_doc = {
                "id": "about_content",
                "content": """Trans Koetaradja adalah sistem transportasi Bus Rapid Transit (BRT) yang melayani Kota Banda Aceh dan sekitarnya. Diluncurkan sebagai solusi modern untuk kebutuhan transportasi publik masyarakat Aceh, Trans Koetaradja hadir dengan armada bus modern ber-AC yang nyaman dan aman.

Layanan ini didukung penuh oleh Pemerintah Aceh melalui APBA (Anggaran Pendapatan dan Belanja Aceh), sehingga dapat dinikmati secara GRATIS oleh seluruh masyarakat. Trans Koetaradja kini melayani 14 rute yang menghubungkan berbagai titik penting di Banda Aceh dan Aceh Besar, termasuk koridor utama, rute feeder, dan Trans Kampus untuk sivitas akademika.

Dengan visi menjadi transportasi publik yang ramah lingkungan dan berkelanjutan, Trans Koetaradja terus berkomitmen memberikan pelayanan terbaik untuk mobilitas masyarakat Aceh.""",
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            await db.about.insert_one(about_doc)
            logger.info("About content seeded")
        
        logger.info("Data seeding completed successfully!")
        
    except Exception as e:
        logger.error(f"Error during data seeding: {e}")
        raise

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    try:
        # Initialize storage
        init_storage()
        logger.info("Storage initialized")
        
        # Store db in app state for access in routes
        app.state.db = db
        
        # Seed initial data
        await seed_initial_data()
        
        logger.info("Application startup completed")
    except Exception as e:
        logger.error(f"Startup error: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    client.close()
    logger.info("Database connection closed")